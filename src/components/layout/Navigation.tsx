"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { navItems } from "@/data/navigation";

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  return (
    <header className="bg-[#0A0A0A] sticky top-[40px] z-[999] shadow-header">
      <div className="flex items-center justify-between px-6 lg:px-12 py-1 max-w-[1280px] mx-auto">
        <Link href="/" className="flex items-center">
          <Image
            src="/turkish-flag.png"
            alt="Turkish Student Federation"
            width={112}
            height={112}
            className="h-20 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          <ul className="flex items-center gap-1 list-none m-0 p-0">
            {navItems.map((item) => (
              <li key={item.label} className="relative group">
                {item.children ? (
                  <>
                    <button
                      className="text-white text-sm font-medium px-3 py-2 rounded flex items-center gap-1 transition-colors hover:text-accent cursor-pointer"
                      onMouseEnter={() => setOpenDropdown(item.label)}
                    >
                      {item.label}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {openDropdown === item.label && (
                      <ul
                        className="absolute top-full left-0 bg-[#1a1a1a] rounded-lg min-w-[180px] py-2 shadow-dropdown list-none z-50"
                        onMouseLeave={() => setOpenDropdown(null)}
                      >
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <Link
                              href={child.href}
                              prefetch={false}
                              className="block px-5 py-2.5 text-white text-sm no-underline transition-colors hover:text-accent hover:bg-white/5"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    prefetch={false}
                    className={`text-white text-sm font-medium px-3 py-2 rounded no-underline transition-colors hover:text-accent ${
                      pathname === item.href
                        ? "text-accent border-b-2 border-accent"
                        : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0A0A0A] px-6 pb-6">
          <ul className="flex flex-col gap-2 list-none m-0 p-0">
            {navItems.map((item) => (
              <li key={item.label}>
                {item.children ? (
                  <div>
                    <button
                      className="text-white text-sm font-medium py-2 flex items-center gap-1 w-full"
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === item.label ? null : item.label
                        )
                      }
                    >
                      {item.label}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {openDropdown === item.label && (
                      <ul className="pl-4 flex flex-col gap-1 list-none">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <Link
                              href={child.href}
                              prefetch={false}
                              className="text-white/80 text-sm py-1 block no-underline hover:text-accent"
                              onClick={() => setMobileOpen(false)}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    prefetch={false}
                    className={`text-white text-sm font-medium py-2 block no-underline hover:text-accent ${
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
      )}
    </header>
  );
}
