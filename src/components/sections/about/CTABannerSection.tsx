"use client";

import { motion } from "framer-motion";
import PrimaryButton from "@/components/ui/PrimaryButton";
import FadeIn from "@/components/animation/FadeIn";

interface CTABannerSectionProps {
  /** `join_href` from site settings; defaults to the join page. */
  joinHref?: string;
  /** `guide_href` from site settings; defaults to the blog listing. */
  guideHref?: string;
}

/**
 * The about page's one saturated field. Every other band on the page is white
 * and separated by a hairline, so this is the single colour event — it should
 * stay singular. Do not tint the neighbouring sections to "balance" it.
 *
 * Both destinations used to be literals, so the "Katılım Linki" and "Rehber
 * Linki" fields in the settings panel saved fine and changed nothing here. The
 * defaults are the previous literals, so an unset install is unchanged.
 */
export default function CTABannerSection({
  joinHref = "/join-tsf/",
  guideHref = "/news-blogs/?type=blog",
}: CTABannerSectionProps = {}) {
  return (
    <section className="py-section bg-primary">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="max-w-[46rem]">
          <FadeIn>
            <h2 className="text-section-title font-heading font-bold text-white">
              Pakistan Türk Öğrenci Birliği&apos;ne Katılın —{" "}
              <span className="text-accent-light">Geleceği</span> Şekillendirin
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="text-body text-white/70 mt-4 max-w-[62ch]">
              İster öğrenci olun, ister mezun veya profesyonel — Pakistan Türk Öğrenci Birliği,
              herkesi açık kollarla karşılar. İlk adımı bugün atın.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="flex flex-wrap gap-4 mt-8">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <PrimaryButton href={joinHref}>Bugün Üye Olun</PrimaryButton>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <PrimaryButton
                  href={guideHref}
                  className="bg-transparent text-white border-2 border-white/40 hover:bg-white hover:text-primary"
                >
                  Öğrenci Bloglarını İncele
                </PrimaryButton>
              </motion.div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
