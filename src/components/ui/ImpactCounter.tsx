"use client";

import { useCounterAnimation } from "@/hooks/useCounterAnimation";

interface ImpactCounterProps {
  target: number;
  suffix: string;
  label: string;
  format?: boolean;
}

export default function ImpactCounter({
  target,
  suffix,
  label,
  format = true,
}: ImpactCounterProps) {
  const { count, ref } = useCounterAnimation(target);

  return (
    <div ref={ref} className="text-center">
      <div className="flex items-center justify-center">
        <span className="text-[clamp(40px,6vw,64px)] font-black text-white leading-none">
          {format ? count.toLocaleString() : count}
        </span>
        <span className="text-[clamp(32px,5vw,48px)] font-black text-accent leading-none">
          {suffix}
        </span>
      </div>
      <p className="text-[15px] text-white/75 mt-3 font-medium">{label}</p>
    </div>
  );
}
