import { permanentRedirect } from "next/navigation";

export default function LegacyPakistanGuidePage() {
  permanentRedirect("/news-blogs/?type=blog");
}
