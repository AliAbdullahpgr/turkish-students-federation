import { AdminPageHeader } from "@/components/admin/AdminUi";
import SocialAccountsForm from "@/app/admin/(protected)/social/SocialAccountsForm";
import { getAllSocialAccounts } from "@/db/queries/social-accounts";

export const metadata = { title: "Sosyal medya hesapları" };

function errorMessage(code: string | undefined) {
  if (!code) return null;
  if (code === "platform") return "Her hesabın bir platform adı olmalıdır.";
  if (code === "url") {
    return "Bağlantılardan biri geçerli değil. Adresler `https://` ile başlamalıdır. Hiçbir değişiklik kaydedilmedi.";
  }
  return "Kaydedilemedi. Alanları kontrol edip tekrar deneyin.";
}

export default async function AdminSocialPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const [accounts, params] = await Promise.all([getAllSocialAccounts(), searchParams]);

  return (
    <>
      <AdminPageHeader
        eyebrow="Website içeriği"
        title="Sosyal medya hesapları"
        description="Hesapları ekleyin, sırasını değiştirin ve hangilerinin yayında olacağını seçin. Bağlantısı olmayan hesaplar website'de görünmez."
      />
      <SocialAccountsForm
        initialAccounts={accounts}
        saved={params.saved === "1"}
        error={errorMessage(params.error)}
      />
    </>
  );
}
