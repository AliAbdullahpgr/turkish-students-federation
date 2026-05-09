"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import FadeIn from "@/components/animation/FadeIn";
import StaggerContainer, { StaggerItem } from "@/components/animation/StaggerContainer";

export default function WhoWeAreSection() {
  return (
    <section className="py-section bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <FadeIn>
          <SectionEyebrow text="BİZ KİMİZ?" />
          <h2 className="text-section-title font-heading font-bold text-text-primary mb-8">
            Pakistan Türk Öğrenci Birliği
          </h2>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="space-y-6 text-body text-text-secondary leading-relaxed max-w-[900px]">
            <p>
              Biz; Pakistan&apos;da eğitim tahsil etme yolculuğuna çıkan ve çıkmak isteyen öğrencilere destek olmak,
              onların eğitim sürecini kolaylaştırmak ve bu yolculukta yalnız olmadıklarını hissettirmek için kurulmuş
              bir kardeşlik ve rehberlik grubuyuz. Niyetimiz; burada bulunan öğrencilerin hem akademik hem de kişisel
              gelişimlerinde Allah rızası doğrultusunda yanlarında olmak, karşılaştıkları zorluklarda kolaylaştırıcı,
              ihtiyaç duyduklarında yönlendirici bir destek ağı oluşturmaktır.
            </p>
            <p>
              Bu kitapçık; Pakistan&apos;a yeni gelen veya gelmeyi düşünen kardeşlerimizin güvenli, bilinçli ve huzurlu
              bir şekilde eğitim hayatlarına başlamaları için hazırlanmıştır. Amacımız; onları doğru bilgiyle buluşturmak,
              karşılaşabilecekleri durumlara hazırlamak ve sorunsuz bir başlangıç yapmalarına vesile olmaktır.
            </p>
            <p>
              Üyelerimiz; Pakistan&apos;ı tanıyan ve buradaki akademik hayatı bilen kişilerden oluşmaktadır. Biz sadece
              danışmanlık sağlayan bir grup değil, aynı zamanda ihtiyaç anında dayanabileceğiniz bir kardeşlik topluluğu
              olmaya çalışıyoruz. Burada bulunduğunuz süre boyunca yanınızda olmaya, her adımda destek vermeye devam
              etmeye çalışacağız. İlim yolculuğunuzun bereketli ve hayırlı olmasını diliyoruz.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="flex flex-wrap gap-4 mt-8" staggerDelay={0.1}>
          {[
            "Öğrenci Liderliği ve Rehberlik",
            "Eğitim, Kültür ve Sosyal Girişimler",
            "Topluluk Hizmeti ve Sosyal Etki Programları",
          ].map((item) => (
            <StaggerItem key={item}>
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-primary rounded-full text-sm font-semibold"
              >
                <Check className="w-4 h-4 text-accent" />
                {item}
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
