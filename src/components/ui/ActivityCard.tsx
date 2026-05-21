"use client";

import { Monitor, Users, BookOpen, Trophy, Shield, Heart, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

const iconMap: Record<string, LucideIcon> = {
  Monitor,
  Users,
  BookOpen,
  Trophy,
  Shield,
  Heart,
};

interface ActivityCardProps {
  icon: string;
  title: string;
  description: string | null;
}

export default function ActivityCard({ icon, title, description }: ActivityCardProps) {
  const IconComponent = iconMap[icon] || Monitor;

  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: "0 12px 32px rgba(0,0,0,0.12)" }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-5 p-7 bg-white rounded-md shadow-card cursor-pointer"
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ duration: 0.3 }}
        className="w-14 h-14 shrink-0 bg-primary/[0.08] rounded-[10px] flex items-center justify-center"
      >
        <IconComponent className="w-7 h-7 text-primary" />
      </motion.div>
      <div>
        <h3 className="text-[17px] font-bold text-primary mb-2">{title}</h3>
        <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
