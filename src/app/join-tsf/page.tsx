"use client";

import { useForm } from "react-hook-form";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import PrimaryButton from "@/components/ui/PrimaryButton";

interface JoinFormData {
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  city: string;
  motivation: string;
}

export default function JoinTSFPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinFormData>();

  const onSubmit = (data: JoinFormData) => {
    console.log(data);
    alert("İlginiz için teşekkürler! Sizinle yakında iletişime geçeceğiz.");
  };

  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow">
        <PageHero title="Pakistan Türk Öğrenci Birliği'ne Katılın" accentWord="Katılın" />

        <section className="py-section bg-white">
          <div className="max-w-[800px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <SectionEyebrow text="ÜYE OL" />
              <h2 className="text-section-title font-heading font-bold text-text-primary mb-4">
                Harekete <span className="text-accent">Katıl</span>
              </h2>
              <p className="text-body text-text-secondary">
                Pakistan Türk Öğrenci Birliği&apos;nin bir parçası olun. Aşağıdaki formu doldurun,
                ekibimiz size ulaşacaktır.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-surface rounded-[16px] p-8 lg:p-10 space-y-5"
            >
              <div>
                <label className="block text-[13px] font-semibold text-[#333] mb-1.5">
                  Ad Soyad
                </label>
                <input
                  {...register("fullName", { required: "Ad soyad gereklidir" })}
                  placeholder="Adınızı ve soyadınızı girin"
                  className="w-full px-4 py-3 border-[1.5px] border-border-custom rounded-lg text-sm text-[#333] outline-none bg-white transition-colors focus:border-accent"
                />
                {errors.fullName && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.fullName.message}
                  </span>
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
                    className="w-full px-4 py-3 border-[1.5px] border-border-custom rounded-lg text-sm text-[#333] outline-none bg-white transition-colors focus:border-accent"
                  />
                  {errors.email && (
                    <span className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#333] mb-1.5">
                    Telefon Numarası
                  </label>
                  <input
                    type="tel"
                    {...register("phone", { required: "Telefon gereklidir" })}
                    placeholder="Telefon numaranızı girin"
                    className="w-full px-4 py-3 border-[1.5px] border-border-custom rounded-lg text-sm text-[#333] outline-none bg-white transition-colors focus:border-accent"
                  />
                  {errors.phone && (
                    <span className="text-red-500 text-xs mt-1">
                      {errors.phone.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[13px] font-semibold text-[#333] mb-1.5">
                    Kurum
                  </label>
                  <input
                    {...register("institution", { required: "Kurum gereklidir" })}
                    placeholder="Okul / Üniversiteniz"
                    className="w-full px-4 py-3 border-[1.5px] border-border-custom rounded-lg text-sm text-[#333] outline-none bg-white transition-colors focus:border-accent"
                  />
                  {errors.institution && (
                    <span className="text-red-500 text-xs mt-1">
                      {errors.institution.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#333] mb-1.5">
                    Şehir
                  </label>
                  <input
                    {...register("city", { required: "Şehir gereklidir" })}
                    placeholder="Bulunduğunuz şehir"
                    className="w-full px-4 py-3 border-[1.5px] border-border-custom rounded-lg text-sm text-[#333] outline-none bg-white transition-colors focus:border-accent"
                  />
                  {errors.city && (
                    <span className="text-red-500 text-xs mt-1">
                      {errors.city.message}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#333] mb-1.5">
                  Neden bize katılmak istiyorsunuz?
                </label>
                <textarea
                  {...register("motivation", { required: "Bu alan gereklidir" })}
                  rows={5}
                  placeholder="Motivasyonunuzu bizimle paylaşın..."
                  className="w-full px-4 py-3 border-[1.5px] border-border-custom rounded-lg text-sm text-[#333] outline-none bg-white transition-colors focus:border-accent resize-none"
                />
                {errors.motivation && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.motivation.message}
                  </span>
                )}
              </div>

              <PrimaryButton type="submit" className="w-full">
                Başvuruyu Gönder
              </PrimaryButton>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
