"use client";

import { Monitor, Users, BookOpen, Trophy, Shield, Heart, LucideIcon } from "lucide-react";

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
  description: string;
}

export default function ActivityCard({ icon, title, description }: ActivityCardProps) {
  const IconComponent = iconMap[icon] || Monitor;

  return (
    <div className="flex items-start gap-5 p-7 bg-white rounded-md shadow-card transition-all duration-normal hover:-translate-y-1 hover:shadow-card-hover">
      <div className="w-14 h-14 shrink-0 bg-primary/[0.08] rounded-[10px] flex items-center justify-center">
        <IconComponent className="w-7 h-7 text-primary" />
      </div>
      <div>
        <h3 className="text-[17px] font-bold text-primary mb-2">{title}</h3>
        <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
