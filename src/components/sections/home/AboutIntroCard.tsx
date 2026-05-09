"use client";

import { motion } from "framer-motion";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function AboutIntroCard() {
  return (
    <div className="max-w-[760px] mx-auto px-6 lg:px-12 -mt-20 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="bg-primary rounded-[20px] p-10 lg:p-12 shadow-about-card"
      >
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[13px] font-semibold text-accent uppercase tracking-[2px] block mb-3"
        >
          Biz Kimiz?
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-[28px] lg:text-[32px] font-extrabold text-white mb-4 leading-tight"
        >
          Pakistan Türk Öğrenci Birliği
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-[15px] text-white/85 leading-relaxed mb-7"
        >
          Pakistan&apos;da eğitim tahsil etme yolculuğuna çıkan ve çıkmak isteyen öğrencilere destek olmak,
          onların eğitim sürecini kolaylaştırmak ve bu yolculukta yalnız olmadıklarını hissettirmek için
          kurulmuş bir kardeşlik ve rehberlik grubuyuz. Hem akademik hem de kişisel gelişimlerinde
          yanlarında olmayı, karşılaştıkları zorluklarda kolaylaştırıcı ve yönlendirici bir destek ağı
          oluşturmayı amaçlıyoruz.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <PrimaryButton href="/about-us/">Daha Fazla Bilgi</PrimaryButton>
        </motion.div>
      </motion.div>
    </div>
  );
}
