import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminUi";
import HomeContentForm from "@/app/admin/(protected)/home/HomeContentForm";
import {
  HOME_FIELD_BY_KEY,
  HOME_SECTIONS,
  getHomeSettingsForAdmin,
} from "@/db/queries/home-sections";

export const metadata = { title: "Anasayfa" };

function errorMessage(code: string | undefined, field: string | undefined) {
  if (!code) return null;
  if (code === "href") {
    const label = field ? HOME_FIELD_BY_KEY.get(field)?.label : undefined;
    const which = label ? `"${label}" alanı` : "Bir bağlantı alanı";
    return `${which} geçerli bir adres değil. \`/faaliyetler/\` gibi bir site yolu veya \`https://\` ile başlayan bir adres girin. Hiçbir değişiklik kaydedilmedi.`;
  }
  return "Kaydedilemedi. Alanları kontrol edip tekrar deneyin.";
}

export default async function AdminHomePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string; field?: string }>;
}) {
  const [values, params] = await Promise.all([getHomeSettingsForAdmin(), searchParams]);

  return (
    <>
      <AdminPageHeader
        eyebrow="Website içeriği"
        title="Anasayfa"
        description="Anasayfadaki her bölümün başlığı, metni, bağlantısı ve görünürlüğü. Bölümler sitedeki sırayla listelenir."
        action={
          <Link href="/" target="_blank" rel="noreferrer" className="admin-button admin-button-secondary">
            Website&apos;i görüntüle
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        }
      />
      <HomeContentForm
        sections={HOME_SECTIONS}
        values={values}
        saved={params.saved === "1"}
        error={errorMessage(params.error, params.field)}
      />
    </>
  );
}
