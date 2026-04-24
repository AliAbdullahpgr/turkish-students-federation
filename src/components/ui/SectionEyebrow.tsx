"use client";

export default function SectionEyebrow({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2 border-[1.5px] border-accent rounded-pill px-4 py-1 text-[11px] font-bold text-primary uppercase tracking-[2.5px] mb-4">
      <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
      <span>{text}</span>
      <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
    </div>
  );
}
