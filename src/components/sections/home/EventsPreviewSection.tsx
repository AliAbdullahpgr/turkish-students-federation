"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { events } from "@/data/events";
import FadeIn from "@/components/animation/FadeIn";
import StaggerContainer, { StaggerItem } from "@/components/animation/StaggerContainer";

export default function EventsPreviewSection() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "recent">("upcoming");
  const filteredEvents = events.filter((e) => e.status === activeTab);

  return (
    <section className="py-section bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <FadeIn className="text-center mb-10">
          <h2 className="text-section-title font-heading font-bold text-text-primary">
            Etkinliklerimiz
          </h2>
        </FadeIn>

        <FadeIn delay={0.1} className="flex justify-center mb-10">
          <div className="inline-flex rounded-lg overflow-hidden shadow-sm">
            <motion.button
              onClick={() => setActiveTab("upcoming")}
              whileTap={{ scale: 0.97 }}
              className={`px-8 py-3 text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "upcoming"
                  ? "bg-primary text-white"
                  : "bg-surface text-text-secondary hover:text-primary"
              }`}
            >
              YAKLAŞAN
            </motion.button>
            <motion.button
              onClick={() => setActiveTab("recent")}
              whileTap={{ scale: 0.97 }}
              className={`px-8 py-3 text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "recent"
                  ? "bg-primary text-white"
                  : "bg-surface text-text-secondary hover:text-primary"
              }`}
            >
              GEÇMİŞ
            </motion.button>
          </div>
        </FadeIn>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <StaggerContainer
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              staggerDelay={0.12}
            >
              {filteredEvents.map((event) => (
                <StaggerItem key={event.id}>
                  <motion.div
                    whileHover={{ y: -6, boxShadow: "0 12px 32px rgba(0,0,0,0.12)" }}
                    transition={{ duration: 0.3 }}
                    className="relative rounded-md overflow-hidden shadow-card group cursor-pointer"
                  >
                    <div className="aspect-[3/4] bg-surface flex items-center justify-center">
                      <div className="text-center p-8">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                          className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center"
                        >
                          <span className="text-2xl font-bold text-primary">
                            {event.title.charAt(0)}
                          </span>
                        </motion.div>
                        <h3 className="text-xl font-bold text-text-primary mb-2">
                          {event.title}
                        </h3>
                        <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-bold uppercase rounded-full">
                          {event.category}
                        </span>
                        {event.date && (
                          <p className="text-sm text-text-muted mt-3">{event.date}</p>
                        )}
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-[10px] font-bold text-primary">
                      TSF
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
