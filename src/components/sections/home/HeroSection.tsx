"use client";

export default function HeroSection() {
  return (
    <section
      className="relative w-full min-h-[100vh] flex items-center justify-center overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/image/group.png')" }}
    >
      <div className="absolute inset-0 bg-[rgba(7,42,31,0.65)]" />
      <div className="relative z-[2] text-center px-6">
        <h1 className="font-heading">
          <span className="block text-[clamp(64px,10vw,120px)] font-black text-white tracking-[-2px] leading-none uppercase">
            LEADERS
          </span>
          <span className="inline-block max-w-[calc(100vw-2rem)] bg-primary text-white text-[26px] sm:text-[clamp(32px,5vw,64px)] font-extrabold px-6 sm:px-10 py-3 uppercase mt-4 whitespace-nowrap"
            style={{ clipPath: "polygon(20px 0%, 100% 0%, calc(100% - 20px) 100%, 0% 100%)" }}
          >
            IN THE MAKING
          </span>
        </h1>
      </div>
      {/* Turkeyi flag graphic placeholder */}
      <div className="absolute right-8 lg:right-16 top-1/2 -translate-y-1/2 z-[2] hidden md:block">
        <div className="w-20 h-28 lg:w-28 lg:h-40 bg-[#0B3D2E] rounded-sm flex items-center justify-center shadow-lg">
          <div className="w-16 h-20 lg:w-24 lg:h-28 bg-white rounded-sm flex items-center justify-center">
            <span className="text-primary text-4xl lg:text-6xl font-bold">*</span>
          </div>
        </div>
      </div>
    </section>
  );
}
