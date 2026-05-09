"use client";

import { useForm } from "react-hook-form";
import { Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import PrimaryButton from "./PrimaryButton";
import SectionEyebrow from "./SectionEyebrow";
import FadeIn from "@/components/animation/FadeIn";

interface FormData {
  name: string;
  email: string;
  whatsapp: string;
  membership: string;
  department: string;
  subject: string;
  message: string;
}

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
    alert("Mesajınız gönderildi! 24 saat içinde size dönüş yapacağız.");
  };

  return (
    <section className="py-section">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10 items-start">
          {/* Form */}
          <FadeIn direction="left">
            <motion.div
              whileHover={{ boxShadow: "0 12px 32px rgba(0,0,0,0.12)" }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-[16px] p-10 shadow-card"
            >
              <SectionEyebrow text="İLETİŞİME GEÇ" />
              <h2 className="text-section-title font-heading font-bold text-text-primary mb-2">
                Bize Ulaşın
              </h2>
              <p className="text-body text-text-secondary mb-8">
                Sorularınızı gönderin, ekibimiz 24 saat içinde yanıt verecektir.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <div>
                  <label className="block text-[13px] font-semibold text-[#333] mb-1.5">
                    Ad Soyad
                  </label>
                  <input
                    {...register("name", { required: "Ad soyad gereklidir" })}
                    placeholder="Adınızı ve soyadınızı girin"
                    className="w-full px-4 py-3 border-[1.5px] border-border-custom rounded-lg text-sm text-[#333] outline-none bg-[#FAFAFA] transition-all duration-300 focus:border-accent focus:bg-white focus:shadow-sm"
                  />
                  {errors.name && (
                    <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#333] mb-1.5">
                      E-posta
                    </label>
                    <input
                      type="email"
                      {...register("email", { required: "E-posta gereklidir" })}
                      placeholder="E-posta adresinizi girin"
                      className="w-full px-4 py-3 border-[1.5px] border-border-custom rounded-lg text-sm text-[#333] outline-none bg-[#FAFAFA] transition-all duration-300 focus:border-accent focus:bg-white focus:shadow-sm"
                    />
                    {errors.email && (
                      <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-[#333] mb-1.5">
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      {...register("whatsapp")}
                      placeholder="WhatsApp numaranızı girin"
                      className="w-full px-4 py-3 border-[1.5px] border-border-custom rounded-lg text-sm text-[#333] outline-none bg-[#FAFAFA] transition-all duration-300 focus:border-accent focus:bg-white focus:shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#333] mb-1.5">
                      Üyelik No (isteğe bağlı)
                    </label>
                    <input
                      {...register("membership")}
                      placeholder="Üyelik numaranızı girin"
                      className="w-full px-4 py-3 border-[1.5px] border-border-custom rounded-lg text-sm text-[#333] outline-none bg-[#FAFAFA] transition-all duration-300 focus:border-accent focus:bg-white focus:shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-[#333] mb-1.5">
                      Birim
                    </label>
                    <select
                      {...register("department")}
                      className="w-full px-4 py-3 border-[1.5px] border-border-custom rounded-lg text-sm text-[#333] outline-none bg-[#FAFAFA] transition-all duration-300 focus:border-accent focus:bg-white focus:shadow-sm"
                    >
                      <option value="">Birim Seçin</option>
                      <option value="general">Genel Soru</option>
                      <option value="membership">Üyelik</option>
                      <option value="media">Medya & Halkla İlişkiler</option>
                      <option value="events">Etkinlikler</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#333] mb-1.5">
                    Konu
                  </label>
                  <input
                    {...register("subject", { required: "Konu gereklidir" })}
                    placeholder="Konuyu girin"
                    className="w-full px-4 py-3 border-[1.5px] border-border-custom rounded-lg text-sm text-[#333] outline-none bg-[#FAFAFA] transition-all duration-300 focus:border-accent focus:bg-white focus:shadow-sm"
                  />
                  {errors.subject && (
                    <span className="text-red-500 text-xs mt-1">{errors.subject.message}</span>
                  )}
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#333] mb-1.5">
                    Mesaj
                  </label>
                  <textarea
                    {...register("message", { required: "Mesaj gereklidir" })}
                    rows={5}
                    placeholder="Mesajınızı buraya yazın..."
                    className="w-full px-4 py-3 border-[1.5px] border-border-custom rounded-lg text-sm text-[#333] outline-none bg-[#FAFAFA] transition-all duration-300 focus:border-accent focus:bg-white focus:shadow-sm resize-none"
                  />
                  {errors.message && (
                    <span className="text-red-500 text-xs mt-1">{errors.message.message}</span>
                  )}
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <PrimaryButton type="submit">Mesaj Gönder</PrimaryButton>
                </motion.div>
              </form>
            </motion.div>
          </FadeIn>

          {/* Contact Info Card */}
          <FadeIn direction="right" delay={0.2}>
            <motion.div
              whileHover={{ boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
              transition={{ duration: 0.3 }}
              className="bg-primary rounded-[16px] p-10 text-white"
            >
              <h3 className="text-[22px] font-bold mb-2.5">İletişim Bilgileri</h3>
              <p className="text-white/80 mb-8">
                Bize doğrudan e-posta, WhatsApp veya ofis adresimizden ulaşabilirsiniz.
              </p>

              <div className="space-y-6">
                <motion.div
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.12)" }}
                  transition={{ duration: 0.2 }}
                  className="p-4 bg-white/[0.08] rounded-[10px]"
                >
                  <span className="block text-[11px] font-bold tracking-[2px] text-accent mb-1.5">
                    E-POSTA
                  </span>
                  <a
                    href="mailto:query@tsfturkey.org"
                    className="text-white no-underline hover:text-accent transition-colors flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    query@tsfturkey.org
                  </a>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.12)" }}
                  transition={{ duration: 0.2 }}
                  className="p-4 bg-white/[0.08] rounded-[10px]"
                >
                  <span className="block text-[11px] font-bold tracking-[2px] text-accent mb-1.5">
                    WHATSAPP
                  </span>
                  <span className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    +92 319 1255858
                  </span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.12)" }}
                  transition={{ duration: 0.2 }}
                  className="p-4 bg-white/[0.08] rounded-[10px]"
                >
                  <span className="block text-[11px] font-bold tracking-[2px] text-accent mb-1.5">
                    ADRES
                  </span>
                  <span className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                    Pakistan Türk Öğrenci Birliği, Ana Ofis, İslamabad, Pakistan
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
