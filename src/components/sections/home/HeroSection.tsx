"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import type { HeroSlide } from "@/lib/hero-slides";

interface HeroSectionProps {
  slides: HeroSlide[];
}

const AUTOPLAY_MS = 7_000;

/**
 * The homepage hero. One slide renders exactly as the old static hero did; with
 * several, it becomes a carousel that advances on its own, pauses while the
 * pointer or focus is inside it, and never auto-advances for visitors who ask
 * for reduced motion. A slide without a button label or destination has no
 * button, rather than a button to nowhere.
 */
export default function HeroSection({ slides }: HeroSectionProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const count = slides.length;
  const current = slides[Math.min(index, count - 1)];
  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = () => setReducedMotion(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (count < 2 || paused || reducedMotion) return;
    const timer = window.setTimeout(() => go(index + 1), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [count, index, paused, reducedMotion, go]);

  if (!current) return null;

  return (
    <section
      className="relative w-full min-h-[85vh] flex items-center overflow-hidden"
      aria-roledescription={count > 1 ? "carousel" : undefined}
      aria-label={count > 1 ? "Öne çıkanlar" : undefined}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((slide, position) => (
        <div
          key={slide.id}
          aria-hidden="true"
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
            position === index ? "opacity-100" : "opacity-0"
          }`}
          style={slide.image ? { backgroundImage: `url('${slide.image}')` } : undefined}
          role={slide.image && slide.imageAlt ? "img" : undefined}
        />
      ))}
      <div className="absolute inset-0 bg-[rgba(7,42,31,0.75)]" />

      <div
        key={current.id}
        className="relative z-[2] w-full max-w-[1280px] mx-auto px-6 lg:px-12"
        aria-roledescription={count > 1 ? "slide" : undefined}
        aria-label={count > 1 ? `${index + 1} / ${count}` : undefined}
      >
        <div className="max-w-[700px]">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-[clamp(40px,7vw,84px)] font-black text-white leading-[1.05] uppercase tracking-tight"
          >
            {current.titleTop}{" "}
            <span className="text-accent-light">{current.titleBottom}</span>
          </motion.h1>

          {current.summary && (
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="max-w-[560px] text-[17px] leading-7 text-white/80 mt-6"
            >
              {current.summary}
            </motion.p>
          )}

          {current.ctaLabel && current.ctaHref && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="mt-8"
            >
              <Link
                href={current.ctaHref}
                className="inline-flex items-center gap-2 rounded-xl bg-action px-7 py-3.5 text-sm font-bold text-white no-underline transition-colors hover:bg-action-dark"
              >
                {current.ctaLabel}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      {count > 1 && (
        <div className="absolute inset-x-0 bottom-8 z-[3] mx-auto flex w-full max-w-[1280px] items-center justify-between px-6 lg:px-12">
          <div className="flex items-center gap-2">
            {slides.map((slide, position) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => go(position)}
                aria-label={`${position + 1}. slayta git`}
                aria-current={position === index ? "true" : undefined}
                className={`h-1.5 w-8 transition-colors ${position === index ? "bg-white" : "bg-white/40 hover:bg-white/70"}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Önceki slayt"
              className="grid size-10 place-items-center border border-white/50 text-white hover:bg-white/10"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Sonraki slayt"
              className="grid size-10 place-items-center border border-white/50 text-white hover:bg-white/10"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
