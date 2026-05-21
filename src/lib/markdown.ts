import { marked } from "marked";

export function renderMarkdown(text: string): string {
  if (!text) return "";
  return marked.parse(text, { breaks: true, gfm: true }) as string;
}
