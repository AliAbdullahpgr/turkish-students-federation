import Link from "next/link";
import {
  Activity,
  Calendar,
  Image as ImageIcon,
  Newspaper,
  Settings,
  Users,
} from "lucide-react";
import { getAdminSession } from "@/lib/auth-guard";
import { getLatestBlogPosts } from "@/db/queries/blog-posts";
import { getUpcomingEvents } from "@/db/queries/events";
import { getPublishedActivityPosts } from "@/db/queries/activity-posts";
import { getVisibleSocialAccounts } from "@/db/queries/social-accounts";
import { getPresidentSection, getYoutubeSection } from "@/db/queries/site-settings";
import { extractYoutubeVideoId } from "@/lib/youtube";

export const metadata = { title: "Genel bakış" };

/**
 * Modelled on the reference admin's dashboard rather than on a grid of one
 * card per collection — that just restates the sidebar and answers nothing.
 *
 * This leads with the two questions someone opens the panel with: *is
 * anything missing from the site*, and *where do I add the thing I came to
 * add*. Four numbers, six shortcuts, and the list of gaps.
 */
const QUICK_ACTIONS = [
  {
    href: "/admin/blog-posts/new",
    title: "Yeni yazı yaz",
    copy: "Blog veya haber bölümünde yayınlanacak bir yazı ekleyin.",
    icon: Newspaper,
  },
  {
    href: "/admin/activity-posts/new",
    title: "Yeni faaliyet ekle",
    copy: "Gerçekleşen bir ziyaret, buluşma veya programı yayınlayın.",
    icon: Activity,
  },
  {
    href: "/admin/events/new",
    title: "Yeni etkinlik oluştur",
    copy: "Yaklaşan bir etkinliği takvime ekleyin.",
    icon: Calendar,
  },
  {
    href: "/admin/media",
    title: "Medya kütüphanesi",
    copy: "Görsel yükleyin ya da mevcutları düzenleyin.",
    icon: ImageIcon,
  },
  {
    href: "/admin/team-members",
    title: "Ekip üyeleri",
    copy: "Yönetim ve ekip kartlarını güncelleyin.",
    icon: Users,
  },
  {
    href: "/admin/site-settings",
    title: "Site ayarları",
    copy: "Anasayfa metinleri, iletişim bilgileri ve genel varsayılanlar.",
    icon: Settings,
  },
] as const;

export default async function AdminDashboard() {
  const [session, posts, upcomingEvents, activities, socials, president, youtube] =
    await Promise.all([
      getAdminSession(),
      getLatestBlogPosts(6),
      getUpcomingEvents(),
      getPublishedActivityPosts(),
      getVisibleSocialAccounts(),
      getPresidentSection(),
      getYoutubeSection(),
    ]);

  /**
   * Things the site is currently missing, rather than a count of things that
   * exist. These are precisely the gaps that are invisible otherwise: a social
   * account with no link renders as a dead icon, and the YouTube block shows a
   * placeholder whether or not a video has ever been chosen.
   */
  const needsAttention = [
    socials.length === 0 && {
      href: "/admin/social",
      text: "Hiçbir sosyal medya hesabının bağlantısı yok — footer'da hiç simge görünmüyor.",
    },
    activities.length === 0 && {
      href: "/admin/activity-posts/new",
      text: "Henüz faaliyet eklenmedi — anasayfadaki faaliyetler bölümü gizli.",
    },
    youtube.visible &&
      !extractYoutubeVideoId(youtube.videoUrl) && {
        href: "/admin/youtube",
        text: "YouTube bölümü açık ama seçili bir video yok.",
      },
    youtube.visible &&
      !youtube.channelUrl && {
        href: "/admin/youtube",
        text: "YouTube kanal bağlantısı boş — takip düğmesi gizleniyor.",
      },
    !president.name && {
      href: "/admin/president",
      text: "Başkan bölümünde isim girilmemiş.",
    },
  ].filter((item): item is { href: string; text: string } => Boolean(item));

  return (
    <div className="ad-view">
      <header className="ad-hero">
        <p className="ad-hero__eyebrow">PTÖB Yönetim Paneli</p>
        <h1 className="ad-hero__title">
          Hoş geldiniz, {session?.user.name ?? "yönetici"}
        </h1>
        <p className="ad-hero__lede">
          Bu panelden sitenin yazılarını, faaliyetlerini, etkinliklerini ve anasayfa
          metinlerini yönetebilir, siteye gelen mesapları görebilirsiniz. Soldaki menüde
          her bölüm ayrı ayrı yer alır.
        </p>
      </header>

      <section className="ad-stats">
        <Link className="ad-stat ad-stat--green" href="/admin/blog-posts">
          <p className="ad-stat__label">Blog ve Haberler</p>
          <p className="ad-stat__value">{posts.length}</p>
          <p className="ad-stat__note">Sitenin blog bölümünde görünen son yazılar.</p>
        </Link>

        <Link className="ad-stat ad-stat--blue" href="/admin/activity-posts">
          <p className="ad-stat__label">Yayındaki Faaliyet</p>
          <p className="ad-stat__value">{activities.length}</p>
          <p className="ad-stat__note">
            {activities.length > 0
              ? "Anasayfada faaliyetler bölümü görünüyor."
              : "Henüz yok — anasayfadaki bölüm gizli."}
          </p>
        </Link>

        <Link className="ad-stat ad-stat--green" href="/admin/events">
          <p className="ad-stat__label">Yaklaşan Etkinlik</p>
          <p className="ad-stat__value">{upcomingEvents.length}</p>
          <p className="ad-stat__note">Etkinlik takviminde görünenler.</p>
        </Link>

        <Link className="ad-stat ad-stat--blue" href="/admin/social">
          <p className="ad-stat__label">Sosyal Medya</p>
          <p className="ad-stat__value">{socials.length}</p>
          <p className="ad-stat__note">Footer&apos;da simgesi görünen bağlantılı hesaplar.</p>
        </Link>
      </section>

      <section className="ad-panel">
        <div className="ad-panel__head">
          <div>
            <h2 className="ad-panel__title">Ne yapmak istiyorsunuz?</h2>
            <p className="ad-panel__copy">
              En sık kullanılan işlemler. Geri kalan her şey sol taraftaki menüde.
            </p>
          </div>
        </div>

        <div className="ad-actions">
          {QUICK_ACTIONS.map(({ href, title, copy, icon: Icon }) => (
            <Link key={href} className="ad-action" href={href}>
              <span className="ad-action__icon" aria-hidden="true">
                <Icon size={22} strokeWidth={1.7} />
              </span>
              <span>
                <span className="ad-action__title">{title}</span>
                <span className="ad-action__copy">{copy}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="ad-panel">
        <div className="ad-panel__head">
          <div>
            <h2 className="ad-panel__title">Eksik görünen alanlar</h2>
            <p className="ad-panel__copy">
              Bunlar website&apos;de boş, gizli veya bozuk görünür.
            </p>
          </div>
        </div>

        {needsAttention.length === 0 ? (
          <div className="ad-empty">
            <p className="ad-empty__title">Her şey yerinde</p>
            <p className="ad-empty__copy">Şu anda eksik görünen bir alan yok.</p>
          </div>
        ) : (
          <div className="ad-attention">
            {needsAttention.map((item) => (
              <Link key={item.text} href={item.href} className="ad-attention__item">
                {item.text}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
