import { getSiteSetting } from "@/db/queries/site-settings";
import { getVisibleSocialAccounts } from "@/db/queries/social-accounts";
import FooterClient from "./Footer";

export default async function Footer() {
  const [description, socialAccounts] = await Promise.all([
    getSiteSetting("site_description"),
    getVisibleSocialAccounts(),
  ]);

  return <FooterClient description={description ?? ""} socialAccounts={socialAccounts} />;
}
