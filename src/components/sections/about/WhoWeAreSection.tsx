"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import FadeIn from "@/components/animation/FadeIn";
import StaggerContainer, { StaggerItem } from "@/components/animation/StaggerContainer";

interface HomeMessaging {
  aboutIntro: string;
}

interface SiteIdentity {
  name: string;
  guideHref: string;
}

const guideSourceSections = [
  {
    title: "Kimlik ve Topluluk",
    href: "/pakistan-rehberi/#biz-kimiz",
    summary: "Pakistan'daki Türk öğrenci topluluğunun kimliği, misyonu ve dayanışma kültürü.",
  },
  {
    title: "Vize ve Pasaport",
    href: "/pakistan-rehberi/#vize-ve-pasaport",
    summary: "Öğrenci vizesi başvuru süreci, gerekli belgeler ve pasaport işlemleri.",
  },
  {
    title: "Resmi İşlemler",
    href: "/pakistan-rehberi/#ogrenci-resmi-islemleri",
    summary: "Elçilik adres beyanı, denklik, üniversite kayıt süreçleri.",
  },
  {
    title: "Üniversiteler ve Eğitim",
    href: "/pakistan-rehberi/#universiteler",
    summary: "Pakistan'daki üniversite seçenekleri, kayıt hazırlığı ve yükseköğretim hayatı.",
  },
  {
    title: "Sağlık ve Günlük Hayat",
    href: "/pakistan-rehberi/#saglik",
    summary: "Sağlık hizmetleri, güvenli başlangıç ve günlük hayatı kolaylaştıran bilgiler.",
  },
  {
    title: "Şehirler ve Kültür",
    href: "/pakistan-rehberi/#turistik-ve-tarihi-mekanlar",
    summary: "İslamabad, Lahor, Karaçi ve diğer şehirlerdeki tarihi, kültürel noktalar.",
  },
];

interface WhoWeAreSectionProps {
  messaging: HomeMessaging;
  identity: SiteIdentity;
}

export default function WhoWeAreSection({ messaging, identity }: WhoWeAreSectionProps) {
  return (
    <section className="py-section bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <FadeIn>
          <SectionEyebrow text="BİZ KİMİZ?" />
          <h2 className="text-section-title font-heading font-bold text-text-primary mb-8">
            {identity.name}
          </h2>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="prose prose-slate max-w-none max-w-[900px]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {messaging.aboutIntro}
            </ReactMarkdown>
            <p>
              Bu nedenle web sitesinin ana dili de rehberdir: her bölüm öğrencinin
              Pakistan&apos;a gelmeden önce ve geldikten sonra ihtiyaç duyacağı bilgiye
              ulaşmasını kolaylaştırmak için düzenlenir.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8" staggerDelay={0.08}>
          {guideSourceSections.map((item) => (
            <StaggerItem key={item.title}>
              <motion.a
                href={item.href}
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.2 }}
                className="h-full flex gap-3 p-4 bg-accent/10 text-primary rounded-[12px] no-underline"
              >
                <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span>
                  <span className="block text-sm font-bold">{item.title}</span>
                  <span className="block text-xs text-text-secondary leading-5 mt-1">{item.summary}</span>
                </span>
              </motion.a>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
