/**
 * YouTube link handling.
 *
 * Editors paste whatever the browser or the share sheet gave them — a
 * `watch?v=` address, a `youtu.be` short link, a `/shorts/` link, or an
 * already-embeddable `/embed/` URL. All of them carry the same 11-character
 * video id, so the id is extracted once here and the embed/thumbnail URLs are
 * derived from it, rather than asking the admin to hand-build an embed link.
 */

/** YouTube video ids are exactly 11 characters of [A-Za-z0-9_-]. */
const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

export function extractYoutubeVideoId(input: string | null | undefined): string | null {
  const value = input?.trim();
  if (!value) return null;

  // A bare id, which is what the field holds once it has been saved a few times.
  if (VIDEO_ID.test(value)) return value;

  let url: URL;
  try {
    url = new URL(value.startsWith("http") ? value : `https://${value}`);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "").toLowerCase();

  if (host === "youtu.be") {
    const id = url.pathname.slice(1).split("/")[0];
    return VIDEO_ID.test(id) ? id : null;
  }

  if (host !== "youtube.com" && host !== "m.youtube.com" && host !== "youtube-nocookie.com") {
    return null;
  }

  const queryId = url.searchParams.get("v");
  if (queryId && VIDEO_ID.test(queryId)) return queryId;

  const [, prefix, candidate] = url.pathname.split("/");
  if (prefix === "embed" || prefix === "shorts" || prefix === "live" || prefix === "v") {
    return VIDEO_ID.test(candidate ?? "") ? candidate : null;
  }

  return null;
}

/**
 * Privacy-enhanced embed host: youtube-nocookie.com does not write tracking
 * cookies until the visitor actually presses play.
 */
export function youtubeEmbedUrl(input: string | null | undefined): string | null {
  const id = extractYoutubeVideoId(input);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}

export function youtubeWatchUrl(input: string | null | undefined): string | null {
  const id = extractYoutubeVideoId(input);
  return id ? `https://www.youtube.com/watch?v=${id}` : null;
}

/**
 * `hqdefault` exists for every video. `maxresdefault` does not — it 404s on
 * anything that was never uploaded above 720p, which would leave a broken
 * poster frame on the homepage.
 */
export function youtubeThumbnailUrl(input: string | null | undefined): string | null {
  const id = extractYoutubeVideoId(input);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

/**
 * Accepts the shapes a channel can be addressed by: `@handle`, `/channel/UC…`,
 * `/c/Name` and `/user/Name`. Returns null for anything else so a mistyped
 * address becomes a hidden button rather than a link to nowhere.
 */
export function normalizeYoutubeChannelUrl(input: string | null | undefined): string | null {
  const value = input?.trim();
  if (!value) return null;

  if (value.startsWith("@") && /^@[\w.-]{3,30}$/.test(value)) {
    return `https://www.youtube.com/${value}`;
  }

  let url: URL;
  try {
    url = new URL(value.startsWith("http") ? value : `https://${value}`);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  if (host !== "youtube.com" && host !== "m.youtube.com") return null;

  const segments = url.pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  const [first] = segments;
  if (first.startsWith("@")) return `https://www.youtube.com/${first}`;
  if ((first === "channel" || first === "c" || first === "user") && segments[1]) {
    return `https://www.youtube.com/${first}/${segments[1]}`;
  }

  return null;
}
