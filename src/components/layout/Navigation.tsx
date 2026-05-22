"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import type { NavItem } from "@/db/queries/navigation";

interface NavigationProps {
  navItems: NavItem[];
}

export default function Navigation({ navItems }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  return (
    <header className="sticky top-[40px] z-[999] bg-[#0A0A0A] shadow-header">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-1 lg:px-12">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="MSL Pakistan"
            width={112}
            height={112}
            className="h-20 w-auto object-contain"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <ul className="m-0 flex list-none items-center gap-1 p-0">
            {navItems.map((item) => (
              <li
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {item.children ? (
                  <>
                    <button
                      type="button"
                      className="flex cursor-pointer items-center gap-1 rounded px-3 py-2 text-sm font-medium text-white transition-colors hover:text-accent"
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          openDropdown === item.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {openDropdown === item.label ? (
                      <ul className="absolute left-0 top-full z-50 min-w-[180px] list-none rounded-lg bg-[#1a1a1a] py-2 shadow-dropdown">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <Link
                              href={child.href}
                              prefetch={false}
                              className="block px-5 py-2.5 text-sm text-white no-underline transition-colors hover:bg-white/5 hover:text-accent"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    prefetch={false}
                    className={`rounded px-3 py-2 text-sm font-medium text-white no-underline transition-colors hover:text-accent ${
                      pathname === item.href ? "border-b-2 border-accent text-accent" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="p-2 text-white lg:hidden"
          onClick={() => setMobileOpen((current) => !current)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="overflow-hidden bg-[#0A0A0A] px-6 pb-6 lg:hidden">
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {navItems.map((item) => (
              <li key={item.label}>
                {item.children ? (
                  <div>
                    <button
                      type="button"
                      className="flex w-full items-center gap-1 py-2 text-sm font-medium text-white"
                      onClick={() =>
                        setOpenDropdown((current) => (current === item.label ? null : item.label))
                      }
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          openDropdown === item.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {openDropdown === item.label ? (
                      <ul className="flex list-none flex-col gap-1 overflow-hidden pl-4">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <Link
                              href={child.href}
                              prefetch={false}
                              className="block py-1 text-sm text-white/80 no-underline hover:text-accent"
                              onClick={() => setMobileOpen(false)}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    prefetch={false}
                    className={`block py-2 text-sm font-medium text-white no-underline hover:text-accent ${
                      pathname === item.href ? "text-accent" : ""
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </header>
  );
}
