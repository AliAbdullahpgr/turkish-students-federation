"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import FadeIn from "@/components/animation/FadeIn";
import type { HomeContent } from "@/db/queries/home-sections";

interface WhoWeAreSectionProps {
  content: HomeContent["whoWeAre"];
  showPhotos?: boolean;
}

/**
 * The eyebrow, heading, closing paragraph and the "Birliğimizi tanıyın" link
 * were all literals here. The link in particular is the one the association
 * asked to point at the about page rather than the blog, so it is a field now.
 */
export default function WhoWeAreSection({ content, showPhotos = false }: WhoWeAreSectionProps) {
  return (
    <section id="biz-kimiz" className="bg-white py-section">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-6 lg:grid-cols-[0.75fr_1.25fr] lg:px-12">
        <FadeIn>
          {content.eyebrow && (
            <p className="mb-4 text-sm font-bold text-primary">{content.eyebrow}</p>
          )}
          <h2 className="text-section-title text-balance font-heading font-bold text-primary">
            {content.title}
          </h2>
        </FadeIn>

        <FadeIn delay={0.15} className="lg:border-l lg:border-primary/15 lg:pl-10">
          <div className="prose prose-slate max-w-[70ch] text-text-secondary">
            {content.intro && (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content.intro}</ReactMarkdown>
            )}
            {content.note && <p>{content.note}</p>}
          </div>
          {content.linkLabel && content.linkHref && (
            <Link
              href={content.linkHref}
              className="mt-7 inline-flex items-center gap-2 font-bold text-primary no-underline hover:text-primary-light"
            >
              {content.linkLabel} <ArrowRight className="h-4 w-4" />
            </Link>
          )}
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
