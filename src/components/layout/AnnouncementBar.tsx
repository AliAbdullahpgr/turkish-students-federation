"use client";

import Link from "next/link";

export default function AnnouncementBar() {
  return (
    <div className="bg-primary-light text-white flex items-center justify-center gap-4 px-6 py-2 text-[13px] font-medium sticky top-0 z-[1000]">
      <span>Join the movement — Turkish Student Federation</span>
      <Link
        href="/join-tsf/"
        className="bg-transparent border-[1.5px] border-white text-white px-4 py-1 rounded-pill text-xs font-bold uppercase tracking-wider no-underline transition-all duration-fast hover:bg-white hover:text-primary-light"
      >
        JOIN US
      </Link>
    </div>
  );
}
