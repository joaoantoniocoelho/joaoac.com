"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';

const navItems = [
  { href: '/#about', label: 'About' },
  { href: '/#experience', label: 'Experience' },
  { href: '/#blog', label: 'Writing' },
  { href: '/#contact', label: 'Contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6" aria-label="Main navigation">
      <div
        className={`mx-auto flex h-14 max-w-7xl items-center justify-between rounded-full border px-4 transition-all duration-300 sm:px-5 ${
          isScrolled || isOpen
            ? 'border-white/10 bg-black/80 shadow-2xl shadow-black/40 backdrop-blur-xl'
            : 'border-transparent bg-transparent'
        }`}
      >
        <Link href="/" className="group flex items-center gap-3" aria-label="João Coelho — home">
          <span className="grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-xs font-semibold text-white transition-colors group-hover:bg-white group-hover:text-black">
            JC
          </span>
          <span className="hidden text-xl font-semibold tracking-tight text-white sm:block">João Coelho</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                pathname === item.href ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 text-xs text-zinc-500 md:flex">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_9px_rgba(52,211,153,0.8)]" />
          Available to talk
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-zinc-300 transition-colors hover:border-white/20 hover:text-white md:hidden"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <FiX className="h-4 w-4" /> : <FiMenu className="h-4 w-4" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-auto mt-2 max-w-7xl overflow-hidden rounded-2xl border border-white/10 bg-black/90 p-2 backdrop-blur-xl md:hidden"
          >
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                {item.label}
                <span className="font-mono text-[10px] text-zinc-600">0{index + 1}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
