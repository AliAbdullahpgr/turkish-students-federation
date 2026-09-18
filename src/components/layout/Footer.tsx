import Image from "next/image";
import Link from "next/link";
import SocialIcon from "@/components/ui/SocialIcon";
import type { SocialAccount } from "@/db/queries/social-accounts";

interface FooterProps {
  description: string;
  socialAccounts: SocialAccount[];
}

const quickLinks = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Hakkimizda", href: "/about-us/" },
  { label: "Etkinlikler", href: "/events/" },
  { label: "Birimlerimiz", href: "/departments/" },
  { label: "Kullanim Kosullari", href: "/terms/" },
  { label: "Gizlilik Politikasi", href: "/privacy/" },
];

const literatureLinks = [
  { label: "Kitaplar", href: "/books/" },
  { label: "Bulten", href: "/newsletter/" },
];

export default function Footer({ description, socialAccounts }: FooterProps) {
  return (
    <footer className="bg-surface pt-16 text-text-secondary">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div>
            <Image
              src="/logo.png"
              alt="MSL Pakistan"
              width={112}
              height={112}
              className="mb-4 h-28 w-28 object-contain"
            />
            <p className="mb-5 text-sm leading-relaxed">{description}</p>
            {socialAccounts.length > 0 && (
              <div className="flex gap-3">
                {socialAccounts.map((account) => (
                  <a
                    key={account.id || account.platform}
                    href={account.url}
                    target={account.openInNewTab ? "_blank" : undefined}
                    rel={account.openInNewTab ? "noreferrer noopener" : undefined}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-accent hover:text-white"
                    aria-label={account.label || account.platform}
                  >
                    <SocialIcon platform={account.platform} className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="mb-5 text-[15px] font-bold uppercase tracking-wider text-text-primary">
              Hizli Baglantilar
            </h2>
            <ul className="m-0 list-none p-0">
              {quickLinks.map((link) => (
                <li key={link.label} className="mb-1">
                  <Link
                    href={link.href}
                    prefetch={false}
                    className="inline-block py-1 text-sm text-text-secondary no-underline transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-5 text-[15px] font-bold uppercase tracking-wider text-text-primary">
              Edebiyat
            </h2>
            <ul className="m-0 list-none p-0">
              {literatureLinks.map((link) => (
                <li key={link.label} className="mb-1">
                  <Link
                    href={link.href}
                    prefetch={false}
                    className="inline-block py-1 text-sm text-text-secondary no-underline transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-5 text-[15px] font-bold uppercase tracking-wider text-text-primary">
              Iletisime Gec
            </h2>
            <p className="mb-4 text-sm leading-relaxed">
              Gelecek guncellemelerimizi kacirma! Hemen abone ol!
            </p>
            <form className="flex flex-col gap-2.5">
              <input
                type="email"
                aria-label="E-posta adresiniz"
                placeholder="E-posta adresinizi girin"
                className="rounded-lg border border-border-custom bg-white px-4 py-2.5 text-sm text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-action"
              />
              <button
                type="submit"
                className="rounded-xl bg-action px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-action-dark"
              >
                Abone Ol
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-border-custom px-6 py-5 text-center text-[13px] text-text-muted lg:px-12">
        <p>(c)2026. TSF IT DEPARTMENT. Design & Develop by Abdul Manan</p>
      </div>
    </footer>
  );
}
