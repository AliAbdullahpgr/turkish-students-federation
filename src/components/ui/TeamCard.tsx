"use client";

import { motion } from "framer-motion";

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
      className="bg-white rounded-[16px] overflow-hidden shadow-[0_6px_24px_rgba(0,0,0,0.09)] text-center p-8 px-6 cursor-pointer"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        className="w-[100px] h-[100px] rounded-full overflow-hidden mx-auto mb-5 border-[3px] border-accent"
      >
        {photo ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={photo}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
            {name.charAt(0)}
          </div>
        )}
      </motion.div>
      <h3 className="text-lg font-bold text-text-primary mb-1.5">{name}</h3>
      <span className="text-[13px] font-semibold text-accent block mb-3.5">
        {role}
      </span>
      <p className="text-[13px] text-text-secondary leading-relaxed">{bio}</p>
    </motion.div>
  );
}
