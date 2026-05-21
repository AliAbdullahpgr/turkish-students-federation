import { getNavigationTree } from "@/db/queries/navigation";
import NavigationClient from "./Navigation";

export default async function Navigation() {
  const navItems = await getNavigationTree();
  return <NavigationClient navItems={navItems} />;
}
