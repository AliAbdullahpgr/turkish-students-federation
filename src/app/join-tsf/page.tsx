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
    alert("Thank you for your interest! We will contact you soon.");
  };

  return (
    <>
      <AnnouncementBar />
      <Navigation />
      <main className="flex-grow">
        <PageHero title="Join Turkish Student Federation" accentWord="Turkey" />

        <section className="py-section bg-white">
          <div className="max-w-[800px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <SectionEyebrow text="BECOME A MEMBER" />
              <h2 className="text-section-title font-heading font-bold text-text-primary mb-4">
                Join the <span className="text-accent">Movement</span>
              </h2>
              <p className="text-body text-text-secondary">
                Become a part of Turkey&apos;s largest student organization. Fill
                out the form below and our team will reach out to you.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-surface rounded-[16px] p-8 lg:p-10 space-y-5"
            >
              <div>
                <label className="block text-[13px] font-semibold text-[#333] mb-1.5">
                  Full Name
                </label>
                <input
                  {...register("fullName", { required: "Full name is required" })}
                  placeholder="Enter your full name"
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
                    Email
                  </label>
                  <input
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    placeholder="Enter your email"
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
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    {...register("phone", { required: "Phone is required" })}
                    placeholder="Enter your phone number"
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
                    Institution
                  </label>
                  <input
                    {...register("institution", { required: "Institution is required" })}
                    placeholder="Your school / college / university"
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
                    City
                  </label>
                  <input
                    {...register("city", { required: "City is required" })}
                    placeholder="Your city"
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
                  Why do you want to join TSF?
                </label>
                <textarea
                  {...register("motivation", { required: "This field is required" })}
                  rows={5}
                  placeholder="Tell us about your motivation..."
                  className="w-full px-4 py-3 border-[1.5px] border-border-custom rounded-lg text-sm text-[#333] outline-none bg-white transition-colors focus:border-accent resize-none"
                />
                {errors.motivation && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.motivation.message}
                  </span>
                )}
              </div>

              <PrimaryButton type="submit" className="w-full">
                Submit Application
              </PrimaryButton>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
