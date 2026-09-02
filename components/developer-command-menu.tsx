"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  FiArrowDown,
  FiArrowUpRight,
  FiBriefcase,
  FiCheck,
  FiCode,
  FiCommand,
  FiCopy,
  FiFileText,
  FiGithub,
  FiLayers,
  FiMail,
  FiUser,
  FiX,
} from 'react-icons/fi';
import { copyToClipboard } from '@/lib/copy-to-clipboard';
import { localizedPath, useLocale } from '@/lib/i18n';

const email = 'joaoantonioscoelho@gmail.com';

export function DeveloperCommandMenu() {
  const locale = useLocale();
  const pt = locale === 'pt-BR';
  const homePath = localizedPath('/', locale);
  const navigationActions = [
    { label: pt ? 'Sobre mim' : 'About me', description: pt ? 'Uma apresentação rápida' : 'A quick introduction', href: `${homePath}#about`, icon: FiUser },
    { label: pt ? 'Experiência' : 'Experience', description: pt ? 'Equipes, produtos e problemas' : 'Teams, products, and problems', href: `${homePath}#experience`, icon: FiBriefcase },
    { label: pt ? 'Projetos' : 'Projects', description: pt ? 'Produtos que construí do zero' : 'Products built from scratch', href: localizedPath('/projects', locale), icon: FiLayers },
    { label: 'Blog', description: pt ? 'Notas e artigos recentes' : 'Recent notes and articles', href: localizedPath('/blog', locale), icon: FiCode },
    { label: pt ? 'Currículo' : 'Resume', description: pt ? 'PDF de uma página' : 'One-page PDF', href: '/resume', icon: FiFileText },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName ?? '');
      const isCommandShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      const isSlashShortcut = event.key === '/' && !isTyping && !event.metaKey && !event.ctrlKey;

      if (isCommandShortcut || isSlashShortcut) {
        event.preventDefault();
        setIsOpen((current) => !current);
      }

      if (event.key === 'Escape') close();
    };

    const handleOpenRequest = () => setIsOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-menu', handleOpenRequest);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-menu', handleOpenRequest);
    };
  }, [close]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLElement>('button')?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const navigate = (href: string) => {
    close();
    window.location.assign(href);
  };

  const copyEmail = async () => {
    await copyToClipboard(email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const handleDialogKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('[data-command-item]') ?? []);
    const currentIndex = items.indexOf(document.activeElement as HTMLElement);

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      const nextIndex = currentIndex < 0 ? 0 : (currentIndex + direction + items.length) % items.length;
      items[nextIndex]?.focus();
    }

    if (event.key === 'Tab' && items.length > 0) {
      const nextIndex = event.shiftKey ? currentIndex - 1 : currentIndex + 1;
      if (nextIndex < 0 || nextIndex >= items.length) {
        event.preventDefault();
        items[event.shiftKey ? items.length - 1 : 0]?.focus();
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/75 px-4 pt-[14vh] backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="command-menu-title"
            initial={prefersReducedMotion ? false : { opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
            onKeyDown={handleDialogKeyDown}
            className="w-full max-w-xl overflow-hidden rounded-3xl border border-white/15 bg-zinc-950/95 shadow-2xl shadow-black"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <FiCommand className="h-4 w-4 text-sky-300" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <h2 id="command-menu-title" className="text-sm font-medium text-white">
                  {pt ? 'Navegação rápida' : 'Quick navigation'}
                </h2>
                <p className="text-xs text-zinc-600">{pt ? 'Aonde você quer ir?' : 'Where do you want to go?'}</p>
              </div>
              <button
                type="button"
                data-command-item
                onClick={close}
                className="pressable grid h-8 w-8 place-items-center rounded-full text-zinc-500 hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/60"
                aria-label={pt ? 'Fechar navegação rápida' : 'Close quick navigation'}
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>

            <div className="p-2">
              {navigationActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.href}
                    type="button"
                    data-command-item
                    onClick={() => navigate(action.href)}
                    className="group flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left transition-colors hover:bg-white/[0.06] focus-visible:bg-white/[0.06] focus-visible:outline-none"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-500 transition-colors group-hover:text-white">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-zinc-200">{action.label}</span>
                      <span className="block text-xs text-zinc-600">{action.description}</span>
                    </span>
                    <FiArrowUpRight className="h-4 w-4 text-zinc-700 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                  </button>
                );
              })}

              <div className="my-2 h-px bg-white/10" />

              <button
                type="button"
                data-command-item
                onClick={copyEmail}
                className="group flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left transition-colors hover:bg-white/[0.06] focus-visible:bg-white/[0.06] focus-visible:outline-none"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-500 transition-colors group-hover:text-white">
                  {copied ? <FiCheck className="h-4 w-4 text-emerald-300" /> : <FiCopy className="h-4 w-4" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-zinc-200">
                    {copied ? (pt ? 'E-mail copiado' : 'Email copied') : (pt ? 'Copiar e-mail' : 'Copy email')}
                  </span>
                  <span className="block truncate text-xs text-zinc-600">{email}</span>
                </span>
                <FiMail className="h-4 w-4 text-zinc-700 transition-colors group-hover:text-white" />
              </button>

              <a
                href="https://github.com/joaoantoniocoelho"
                target="_blank"
                rel="noopener noreferrer"
                data-command-item
                onClick={close}
                className="group flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left transition-colors hover:bg-white/[0.06] focus-visible:bg-white/[0.06] focus-visible:outline-none"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-500 transition-colors group-hover:text-white">
                  <FiGithub className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-zinc-200">{pt ? 'Abrir GitHub' : 'Open GitHub'}</span>
                  <span className="block text-xs text-zinc-600">{pt ? 'Projetos e experimentos' : 'Projects and experiments'}</span>
                </span>
                <FiArrowUpRight className="h-4 w-4 text-zinc-700 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
              </a>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 text-[10px] uppercase tracking-[0.14em] text-zinc-700">
              <span className="flex items-center gap-2">
                <FiArrowDown className="h-3 w-3" /> {pt ? 'Navegar' : 'Navigate'}
              </span>
              <span>{pt ? 'Esc para fechar' : 'Esc to close'}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
