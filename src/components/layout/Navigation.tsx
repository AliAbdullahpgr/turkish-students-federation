"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { NavItem } from "@/db/queries/navigation";

interface NavigationProps {
  navItems: NavItem[];
}

export default function Navigation({ navItems }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="bg-[#0A0A0A] sticky top-[40px] z-[999] shadow-header"
    >
      <div className="flex items-center justify-between px-6 lg:px-12 py-1 max-w-[1280px] mx-auto">
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

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          <ul className="flex items-center gap-1 list-none m-0 p-0">
            {navItems.map((item) => (
              <li
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {item.children ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      className="text-white text-sm font-medium px-3 py-2 rounded flex items-center gap-1 transition-colors hover:text-accent cursor-pointer"
                    >
                      {item.label}
                      <motion.span
                        animate={{ rotate: openDropdown === item.label ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.span>
                    </motion.button>
                    <AnimatePresence>
                      {openDropdown === item.label && (
                        <motion.ul
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 bg-[#1a1a1a] rounded-lg min-w-[180px] py-2 shadow-dropdown list-none z-50"
                        >
                          {item.children.map((child, i) => (
                            <motion.li
                              key={child.label}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                            >
                              <Link
                                href={child.href}
                                prefetch={false}
                                className="block px-5 py-2.5 text-white text-sm no-underline transition-colors hover:text-accent hover:bg-white/5"
                              >
                                {child.label}
                              </Link>
                            </motion.li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <motion.div whileHover={{ scale: 1.02 }}>
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
                  </motion.div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Hamburger */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="lg:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait">
            {mobileOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-[#0A0A0A] px-6 pb-6 overflow-hidden"
          >
            <ul className="flex flex-col gap-2 list-none m-0 p-0">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
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
                        <motion.span
                          animate={{ rotate: openDropdown === item.label ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </motion.span>
                      </button>
                      <AnimatePresence>
                        {openDropdown === item.label && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="pl-4 flex flex-col gap-1 list-none overflow-hidden"
                          >
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
                          </motion.ul>
                        )}
                      </AnimatePresence>
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
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
