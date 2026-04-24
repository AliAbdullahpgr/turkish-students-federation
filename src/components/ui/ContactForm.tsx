"use client";

import { useForm } from "react-hook-form";
import { Mail, Phone, MapPin } from "lucide-react";
import PrimaryButton from "./PrimaryButton";
import SectionEyebrow from "./SectionEyebrow";

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
    alert("Message sent! We will get back to you within 24 hours.");
  };

  return (
    <section className="py-section">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10 items-start">
          {/* Form */}
          <div className="bg-white rounded-[16px] p-10 shadow-card">
            <SectionEyebrow text="GET IN TOUCH" />
            <h2 className="text-section-title font-heading font-bold text-text-primary mb-2">
              Contact Us
            </h2>
            <p className="text-body text-text-secondary mb-8">
              Submit your inquiry and our team will respond within 24 hours.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <div>
                <label className="block text-[13px] font-semibold text-[#333] mb-1.5">
                  Name
                </label>
                <input
                  {...register("name", { required: "Name is required" })}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border-[1.5px] border-border-custom rounded-lg text-sm text-[#333] outline-none bg-[#FAFAFA] transition-colors focus:border-accent focus:bg-white"
                />
                {errors.name && (
                  <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>
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
                    className="w-full px-4 py-3 border-[1.5px] border-border-custom rounded-lg text-sm text-[#333] outline-none bg-[#FAFAFA] transition-colors focus:border-accent focus:bg-white"
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
                    placeholder="Enter your WhatsApp number"
                    className="w-full px-4 py-3 border-[1.5px] border-border-custom rounded-lg text-sm text-[#333] outline-none bg-[#FAFAFA] transition-colors focus:border-accent focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[13px] font-semibold text-[#333] mb-1.5">
                    Membership ID (optional)
                  </label>
                  <input
                    {...register("membership")}
                    placeholder="Enter your membership ID"
                    className="w-full px-4 py-3 border-[1.5px] border-border-custom rounded-lg text-sm text-[#333] outline-none bg-[#FAFAFA] transition-colors focus:border-accent focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#333] mb-1.5">
                    Department
                  </label>
                  <select
                    {...register("department")}
                    className="w-full px-4 py-3 border-[1.5px] border-border-custom rounded-lg text-sm text-[#333] outline-none bg-[#FAFAFA] transition-colors focus:border-accent focus:bg-white"
                  >
                    <option value="">Select Department</option>
                    <option value="general">General Inquiry</option>
                    <option value="membership">Membership</option>
                    <option value="media">Media & PR</option>
                    <option value="events">Events</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#333] mb-1.5">
                  Subject
                </label>
                <input
                  {...register("subject", { required: "Subject is required" })}
                  placeholder="Enter subject"
                  className="w-full px-4 py-3 border-[1.5px] border-border-custom rounded-lg text-sm text-[#333] outline-none bg-[#FAFAFA] transition-colors focus:border-accent focus:bg-white"
                />
                {errors.subject && (
                  <span className="text-red-500 text-xs mt-1">{errors.subject.message}</span>
                )}
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#333] mb-1.5">
                  Message
                </label>
                <textarea
                  {...register("message", { required: "Message is required" })}
                  rows={5}
                  placeholder="Write your message here..."
                  className="w-full px-4 py-3 border-[1.5px] border-border-custom rounded-lg text-sm text-[#333] outline-none bg-[#FAFAFA] transition-colors focus:border-accent focus:bg-white resize-none"
                />
                {errors.message && (
                  <span className="text-red-500 text-xs mt-1">{errors.message.message}</span>
                )}
              </div>

              <PrimaryButton type="submit">Send Message</PrimaryButton>
            </form>
          </div>

          {/* Contact Info Card */}
          <div className="bg-primary rounded-[16px] p-10 text-white">
            <h3 className="text-[22px] font-bold mb-2.5">Contact Information</h3>
            <p className="text-white/80 mb-8">
              Reach us directly through email, WhatsApp, or our office address.
            </p>

            <div className="space-y-6">
              <div className="p-4 bg-white/[0.08] rounded-[10px]">
                <span className="block text-[11px] font-bold tracking-[2px] text-accent mb-1.5">
                  EMAIL
                </span>
                <a
                  href="mailto:query@tsfturkey.org"
                  className="text-white no-underline hover:text-accent transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  query@tsfturkey.org
                </a>
              </div>

              <div className="p-4 bg-white/[0.08] rounded-[10px]">
                <span className="block text-[11px] font-bold tracking-[2px] text-accent mb-1.5">
                  WHATSAPP
                </span>
                <span className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  +92 319 1255858
                </span>
              </div>

              <div className="p-4 bg-white/[0.08] rounded-[10px]">
                <span className="block text-[11px] font-bold tracking-[2px] text-accent mb-1.5">
                  ADDRESS
                </span>
                <span className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  Turkish Student Federation, Main Office, Istanbul, Marmara, Turkey
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
