import slugify from "slugify";
import { nanoid } from "nanoid";
import { ApiInputError, boolean, integer, optionalText, requiredText } from "@/lib/api-validation";

const MAX_LIST_ITEMS = 60;

function objectList(body: Record<string, unknown>, key: string) {
  const value = body[key];
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) throw new ApiInputError(`${key} must be a list`);
  if (value.length > MAX_LIST_ITEMS) throw new ApiInputError(`${key} can hold at most ${MAX_LIST_ITEMS} items`);
  return value.map((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new ApiInputError(`${key}[${index}] must be an object`);
    }
    return item as Record<string, unknown>;
  });
}

/** Validated writable fields of a department, shared by create and update. */
export function parseDepartmentInput(body: Record<string, unknown>) {
  const name = requiredText(body, "name", 160);
  const requestedSlug = optionalText(body, "slug", 160);
  // slugify spells "&" as the English "and"; names like "Medya & Yayınlar" should read medya-yayinlar.
  const slug =
    slugify((requestedSlug || name).replace(/&/g, " "), { lower: true, strict: true }) || `birim-${nanoid(6)}`;

  const members = objectList(body, "members").map((item) => ({
    name: requiredText(item, "name", 160),
    role: optionalText(item, "role", 160) ?? "",
    photoMediaId: optionalText(item, "photoMediaId", 100),
  }));

  const gallery = objectList(body, "gallery").map((item) => ({
    mediaId: requiredText(item, "mediaId", 100),
    caption: optionalText(item, "caption", 300) ?? "",
  }));

  return {
    slug,
    name,
    summary: optionalText(body, "summary", 1_000) ?? "",
    body: optionalText(body, "body", 150_000) ?? "",
    icon: optionalText(body, "icon", 80) ?? "",
    heroMediaId: optionalText(body, "heroMediaId", 100),
    members: JSON.stringify(members),
    gallery: JSON.stringify(gallery),
    isPublished: boolean(body, "isPublished", true),
    sortOrder: integer(body, "sortOrder"),
  };
}
