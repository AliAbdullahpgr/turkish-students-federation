"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface TeamCardProps {
  photo?: string;
  name: string;
  role: string;
  bio: string;
}

export default function TeamCard({ photo, name, role, bio }: TeamCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: "0 12px 32px rgba(0,0,0,0.12)" }}
      transition={{ duration: 0.3 }}
      className="cursor-pointer overflow-hidden rounded-[16px] bg-white p-8 px-6 text-center shadow-[0_6px_24px_rgba(0,0,0,0.09)]"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        className="mx-auto mb-5 h-[100px] w-[100px] overflow-hidden rounded-full border-[3px] border-accent"
      >
        {photo ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={photo} alt={name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/10 text-2xl font-bold text-primary">
            {name.charAt(0)}
          </div>
        )}
      </motion.div>

      <h3 className="mb-1.5 text-lg font-bold text-text-primary">{name}</h3>
      <span className="mb-3.5 block text-[13px] font-semibold text-accent">{role}</span>

      <div className="prose prose-sm prose-slate max-w-none text-left text-[13px] leading-relaxed text-text-secondary">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{bio}</ReactMarkdown>
      </div>
    </motion.div>
  );
}
