import { revalidatePath } from "next/cache";

function revalidate(paths: string[]) {
  for (const path of new Set(paths)) {
    revalidatePath(path);
  }
}

export function revalidateBlogContent(slug?: string) {
  revalidate(["/", "/news-blogs", ...(slug ? [`/news-blogs/${slug}`] : [])]);
}

export function revalidateEventContent() {
  revalidate(["/", "/events"]);
}

export function revalidateTeamContent() {
  revalidate(["/about-us"]);
}

export function revalidateCourseContent() {
  revalidate(["/"]);
}

export function revalidateActivityContent() {
  revalidate(["/", "/about-us"]);
}

export function revalidateGuideContent() {
  revalidate(["/pakistan-rehberi"]);
}

export function revalidateNavigationContent() {
  revalidatePath("/", "layout");
}

export function revalidateSiteContent() {
  revalidatePath("/", "layout");
}
