import { getSiteSetting } from "@/db/queries/site-settings";
import AnnouncementBarClient from "./AnnouncementBar";

export default async function AnnouncementBar() {
  const guideName = (await getSiteSetting("guide_name")) ?? "Pakistan Öğrenci Rehberi";
  const guideHref = (await getSiteSetting("guide_href")) ?? "/pakistan-rehberi/";
  return <AnnouncementBarClient guideName={guideName} guideHref={guideHref} />;
}
