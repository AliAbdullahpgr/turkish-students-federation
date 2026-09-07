"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import FadeIn from "@/components/animation/FadeIn";

interface HomeMessaging {
  aboutIntro: string;
}

interface SiteIdentity {
  name: string;
  guideHref: string;
}

interface WhoWeAreSectionProps {
  messaging: HomeMessaging;
  identity: SiteIdentity;
  showPhotos?: boolean;
}

export default function WhoWeAreSection({ messaging, identity, showPhotos = false }: WhoWeAreSectionProps) {
  return (
    <section id="biz-kimiz" className="bg-white py-section">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-6 lg:grid-cols-[0.75fr_1.25fr] lg:px-12">
        <FadeIn>
          <p className="mb-4 text-sm font-bold text-primary">Biz Kimiz?</p>
          <h2 className="text-section-title text-balance font-heading font-bold text-primary">
            Pakistan&apos;da birlikte daha güçlü bir öğrenci topluluğu
          </h2>
        </FadeIn>

        <FadeIn delay={0.15} className="lg:border-l lg:border-primary/15 lg:pl-10">
          <div className="prose prose-slate max-w-[70ch] text-text-secondary">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {messaging.aboutIntro}
            </ReactMarkdown>
            <p>
              {identity.name}, öğrencilerin Pakistan&apos;daki akademik, sosyal ve kültürel
              hayata güvenle katılabilmesi için dayanışma, temsil ve bilgi paylaşımı sağlar.
            </p>
          </div>
          <Link href="/about-us/" className="mt-7 inline-flex items-center gap-2 font-bold text-primary no-underline hover:text-primary-light">
            Birliğimizi tanıyın <ArrowRight className="h-4 w-4" />
          </Link>
        </FadeIn>
      </div>
      {showPhotos && <div className="mx-auto mt-12 grid max-w-[1280px] gap-8 px-6 md:grid-cols-2 lg:px-12">
        <figure className="min-w-0">
          <Image
            src="/image/association-group-visit.png"
            alt="Öğrenciler ve bir takım elbiseli katılımcının bina önündeki toplu fotoğrafı"
            width={1071}
            height={796}
            sizes="(min-width: 1280px) 576px, (min-width: 768px) 46vw, calc(100vw - 48px)"
            className="h-auto w-full rounded-2xl"
          />
          <figcaption className="mt-4 text-sm leading-6 text-text-secondary">
            Öğrencilerimizle bir arada.
          </figcaption>
        </figure>
        <figure className="min-w-0">
          <Image
            src="/image/association-community-evening.png"
            alt="Öğrenciler, aileler ve çocukların akşam buluşmasındaki toplu fotoğrafı"
            width={1600}
            height={1200}
            sizes="(min-width: 1280px) 576px, (min-width: 768px) 46vw, calc(100vw - 48px)"
            className="h-auto w-full rounded-2xl"
          />
          <figcaption className="mt-4 text-sm leading-6 text-text-secondary">
            Öğrencilerimiz ve ailelerimizle paylaştığımız anlar.
          </figcaption>
        </figure>
      </div>}
    </section>
  );
}
