import { permanentRedirect } from "next/navigation";

export default function NewsAliasPage() {
  permanentRedirect("/news-blogs/?type=news");
}
