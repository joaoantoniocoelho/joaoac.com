"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion, useScroll } from 'framer-motion';
import { FiCommand, FiMenu, FiX } from 'react-icons/fi';
import { isHomePath, localizedPath, useLocale } from '@/lib/i18n';
import { LanguageSwitch } from '@/components/language-switch';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const pathname = usePathname();
  const locale = useLocale();
  const pt = locale === 'pt-BR';
  const homePath = localizedPath('/', locale);
  const navItems = [
    { href: `${homePath}#about`, label: pt ? 'Sobre' : 'About' },
    { href: `${homePath}#experience`, label: pt ? 'Experiência' : 'Experience' },
    { href: `${homePath}#projects`, label: pt ? 'Projetos' : 'Projects' },
    { href: `${homePath}#blog`, label: 'Blog' },
    { href: `${homePath}#contact`, label: pt ? 'Contato' : 'Contact' },
  ];
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    let frameId = 0;

    const handleScroll = () => {
      if (frameId) return;

      frameId = window.requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 24);

        if (isHomePath(pathname)) {
          const marker = window.scrollY + window.innerHeight * 0.38;
          const current = ['about', 'experience', 'projects', 'blog', 'contact']
            .map((id) => document.getElementById(id))
            .filter((section): section is HTMLElement => Boolean(section))
            .find((section) => marker >= section.offsetTop && marker < section.offsetTop + section.offsetHeight);

          setActiveSection(current?.id ?? '');
        } else {
          setActiveSection('');
        }

        frameId = 0;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [pathname]);

  const openCommandMenu = () => {
    window.dispatchEvent(new Event('open-command-menu'));
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6" aria-label={pt ? 'Navegação principal' : 'Main navigation'}>
      <div
        className={`relative mx-auto flex h-14 max-w-7xl items-center justify-between rounded-full border px-4 transition-all duration-300 sm:px-5 ${
          isScrolled || isOpen
            ? 'border-white/10 bg-black/95 shadow-2xl shadow-black/40 lg:bg-black/80 lg:backdrop-blur-xl'
            : 'border-transparent bg-transparent'
        }`}
      >
        <Link href={homePath} className="focus-ring group flex items-center gap-3 rounded-full" aria-label={`João Coelho, ${pt ? 'início' : 'home'}`}>
          <span className="grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-xs font-semibold text-white transition-colors group-hover:bg-white group-hover:text-black">
            JC
          </span>
          <span className="hidden text-xl font-semibold tracking-tight text-white sm:block">João Coelho</span>
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={activeSection === item.href.split('#')[1] ? 'location' : undefined}
              className={`focus-ring relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeSection === item.href.split('#')[1] ? 'text-white' : 'text-zinc-500 hover:text-white'
              }`}
            >
              {activeSection === item.href.split('#')[1] && (
                <motion.span
                  layoutId="active-navigation-pill"
                  transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 z-0 rounded-full border border-white/[0.08] bg-white/[0.08]"
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="/resume"
            className="pressable focus-ring rounded-full px-3 py-2 text-sm font-medium text-zinc-500 transition-colors hover:text-white"
          >
            {pt ? 'Currículo' : 'Resume'}
          </a>
          <LanguageSwitch />
          <button
            type="button"
            onClick={openCommandMenu}
            className="pressable focus-ring inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.035] px-2 py-1 text-[10px] font-medium text-zinc-500 hover:border-white/20 hover:text-white"
            aria-label={pt ? 'Abrir navegação rápida' : 'Open quick navigation'}
          >
            <FiCommand className="h-3 w-3" />K
          </button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitch />
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className="pressable focus-ring grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
            aria-label={isOpen ? (pt ? 'Fechar menu' : 'Close menu') : (pt ? 'Abrir menu' : 'Open menu')}
            aria-expanded={isOpen}
          >
            {isOpen ? <FiX className="h-4 w-4" /> : <FiMenu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            className="mx-auto mt-2 max-w-7xl overflow-hidden rounded-2xl border border-white/10 bg-black/95 p-2 lg:hidden"
          >
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                aria-current={activeSection === item.href.split('#')[1] ? 'location' : undefined}
                className={`focus-ring flex items-center justify-between rounded-xl px-4 py-3 text-sm transition-colors hover:bg-white/[0.06] hover:text-white ${
                  activeSection === item.href.split('#')[1] ? 'bg-white/[0.06] text-white' : 'text-zinc-300'
                }`}
              >
                {item.label}
                <span className="font-mono text-[10px] text-zinc-600">0{index + 1}</span>
              </Link>
            ))}
            <a
              href="/resume"
              onClick={() => setIsOpen(false)}
              className="focus-ring flex items-center justify-between rounded-xl px-4 py-3 text-sm text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              {pt ? 'Currículo' : 'Resume'}
              <span className="font-mono text-[10px] text-zinc-600">06</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="absolute inset-x-6 top-0 h-px origin-left bg-gradient-to-r from-sky-300 via-emerald-300 to-indigo-300 motion-reduce:hidden"
        aria-hidden="true"
      />
    </nav>
  );
}
