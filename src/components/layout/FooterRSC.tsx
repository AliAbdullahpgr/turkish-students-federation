import { getSiteSetting } from "@/db/queries/site-settings";
import FooterClient from "./Footer";

export default async function Footer() {
  const description = (await getSiteSetting("site_description")) ?? "";
  return <FooterClient description={description} />;
}
