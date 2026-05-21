import { getSiteSetting } from "@/db/queries/site-settings";
import FooterClient from "./Footer";

export default async function Footer() {
  const description = (await getSiteSetting("site_description")) ?? "";
  const guideHref = (await getSiteSetting("guide_href")) ?? "/pakistan-rehberi/";
  return <FooterClient description={description} guideHref={guideHref} />;
}
