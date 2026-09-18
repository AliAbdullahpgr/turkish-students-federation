"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import PrimaryButton from "@/components/ui/PrimaryButton";

interface JoinFormData {
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  city: string;
  motivation: string;
}

/**
 * The membership form.
 *
 * Split out of the page so the page itself can stay a server component: it
 * renders the async RSC header and footer, which cannot be imported from a
 * module marked "use client".
 */
export default function JoinForm() {
  const [submitState, setSubmitState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<JoinFormData>();

  const onSubmit = async (data: JoinFormData) => {
    setSubmitState("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "membership",
          name: data.fullName,
          email: data.email,
          phone: data.phone,
          institution: data.institution,
          city: data.city,
          message: data.motivation,
        }),
      });
      if (!response.ok) throw new Error("Submission failed");
      reset();
      setSubmitState("success");
    } catch {
      setSubmitState("error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-surface rounded-[16px] p-8 lg:p-10 space-y-5"
    >
      <div>
        <label className="block text-[13px] font-semibold text-[#333] mb-1.5" htmlFor="join-fullName">
          Ad Soyad
        </label>
        <input id="join-fullName"
          {...register("fullName", { required: "Ad soyad gereklidir" })}
          placeholder="Adınızı ve soyadınızı girin"
          className="w-full px-4 py-3 border-[1.5px] border-border-custom rounded-lg text-sm text-[#333] outline-none bg-white transition-colors focus:border-action"
        />
        {errors.fullName && (
          <span className="text-red-500 text-xs mt-1">
            {errors.fullName.message}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-[13px] font-semibold text-[#333] mb-1.5" htmlFor="join-email">
            E-posta
          </label>
          <input id="join-email"
            type="email"
            {...register("email", { required: "E-posta gereklidir" })}
            placeholder="E-posta adresinizi girin"
            className="w-full px-4 py-3 border-[1.5px] border-border-custom rounded-lg text-sm text-[#333] outline-none bg-white transition-colors focus:border-action"
          />
          {errors.email && (
            <span className="text-red-500 text-xs mt-1">
              {errors.email.message}
            </span>
          )}
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-[#333] mb-1.5" htmlFor="join-phone">
            Telefon Numarası
          </label>
          <input id="join-phone"
            type="tel"
            {...register("phone", { required: "Telefon gereklidir" })}
            placeholder="Telefon numaranızı girin"
            className="w-full px-4 py-3 border-[1.5px] border-border-custom rounded-lg text-sm text-[#333] outline-none bg-white transition-colors focus:border-action"
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
          <label className="block text-[13px] font-semibold text-[#333] mb-1.5" htmlFor="join-institution">
            Kurum
          </label>
          <input id="join-institution"
            {...register("institution", { required: "Kurum gereklidir" })}
            placeholder="Okul / Üniversiteniz"
            className="w-full px-4 py-3 border-[1.5px] border-border-custom rounded-lg text-sm text-[#333] outline-none bg-white transition-colors focus:border-action"
          />
          {errors.institution && (
            <span className="text-red-500 text-xs mt-1">
              {errors.institution.message}
            </span>
          )}
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-[#333] mb-1.5" htmlFor="join-city">
            Şehir
          </label>
          <input id="join-city"
            {...register("city", { required: "Şehir gereklidir" })}
            placeholder="Bulunduğunuz şehir"
            className="w-full px-4 py-3 border-[1.5px] border-border-custom rounded-lg text-sm text-[#333] outline-none bg-white transition-colors focus:border-action"
          />
          {errors.city && (
            <span className="text-red-500 text-xs mt-1">
              {errors.city.message}
            </span>
          )}
        </div>
      </div>

      <div>
        <label className="block text-[13px] font-semibold text-[#333] mb-1.5" htmlFor="join-motivation">
          Neden bize katılmak istiyorsunuz?
        </label>
        <textarea id="join-motivation"
          {...register("motivation", { required: "Bu alan gereklidir" })}
          rows={5}
          placeholder="Motivasyonunuzu bizimle paylaşın..."
          className="w-full px-4 py-3 border-[1.5px] border-border-custom rounded-lg text-sm text-[#333] outline-none bg-white transition-colors focus:border-action resize-none"
        />
        {errors.motivation && (
          <span className="text-red-500 text-xs mt-1">
            {errors.motivation.message}
          </span>
        )}
      </div>

      <PrimaryButton type="submit" className="w-full" disabled={submitState === "sending"}>
        {submitState === "sending" ? "Gönderiliyor..." : "Başvuruyu Gönder"}
      </PrimaryButton>
      <p aria-live="polite" className={submitState === "error" ? "text-sm text-red-600" : "text-sm text-accent"}>
        {submitState === "success" ? "Başvurunuz güvenle kaydedildi. Ekibimiz sizinle iletişime geçecektir." : null}
        {submitState === "error" ? "Başvuru gönderilemedi. Lütfen tekrar deneyin." : null}
      </p>
    </form>
  );
}
