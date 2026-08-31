"use client";

import { useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { FiArrowUpRight, FiCheck, FiCopy, FiMail } from 'react-icons/fi';
import { copyToClipboard } from '@/lib/copy-to-clipboard';
import { useLocale } from '@/lib/i18n';

/* Keep in sync with the .sheen-text animation in app/globals.css. */
const SHEEN = { delay: 0.3, duration: 1.5 };

const socialLinks = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/joaoac' },
  { label: 'GitHub', href: 'https://github.com/joaoantoniocoelho' },
  { label: 'X / Twitter', href: 'https://x.com/joaoac_dev' },
];

export function ContactSection() {
  const locale = useLocale();
  const pt = locale === 'pt-BR';
  const [copied, setCopied] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isHeadingInView = useInView(headingRef, { once: true, amount: 0.6 });

  const copyEmail = async () => {
    await copyToClipboard('joaoantonioscoelho@gmail.com');
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section id="contact" data-ambient="indigo" className="relative overflow-hidden bg-black/75 pb-10 pt-20 md:pt-28">
      <div className="pointer-events-none absolute bottom-0 left-1/2 hidden h-72 w-[70%] -translate-x-1/2 bg-indigo-500/[0.07] blur-[120px] lg:block" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300/20 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.25 }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.075] via-black/70 to-black/85 p-6 sm:p-8 md:p-10 lg:p-12"
        >
          <div className="absolute right-6 top-6 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-700 sm:right-8 sm:top-8">
            04 · {pt ? 'Contato' : 'Contact'}
          </div>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(240px,0.65fr)] lg:items-end lg:gap-12">
            <div>
              <div className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.24em] text-indigo-300/80">
                <span className="h-px w-8 bg-indigo-300/60" />
                {pt ? 'Contato' : 'Contact'}
              </div>
              <h2
                ref={headingRef}
                className="group/sheen max-w-3xl text-3xl font-bold leading-[1.05] tracking-[-0.04em] text-white sm:text-4xl md:text-5xl lg:text-6xl"
              >
                {pt ? (
                  <>
                    Vamos criar algo{' '}
                    <span className="sheen-text" data-sheen={isHeadingInView ? 'on' : undefined}>
                      memorável
                    </span>
                  </>
                ) : (
                  <>
                    Let&apos;s make it worth{' '}
                    <span className="sheen-text" data-sheen={isHeadingInView ? 'on' : undefined}>
                      remembering
                    </span>
                  </>
                )}
                <motion.span
                  initial={
                    prefersReducedMotion
                      ? false
                      : { opacity: 0, scale: 0.2, filter: 'drop-shadow(0 0 16px rgba(165,180,252,0.95))' }
                  }
                  animate={
                    isHeadingInView
                      ? {
                          opacity: 1,
                          scale: prefersReducedMotion ? 1 : [0.2, 1.35, 1],
                          filter: 'drop-shadow(0 0 0px rgba(165,180,252,0))',
                        }
                      : undefined
                  }
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.65,
                    // Lands just as the beam clears the last letter.
                    delay: prefersReducedMotion ? 0 : SHEEN.delay + SHEEN.duration - 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="inline-block text-indigo-300"
                >
                  .
                </motion.span>
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-400 md:text-base">
                {pt
                  ? 'Software, um problema técnico difícil ou uma landing page que precisa de um ponto de vista mais forte. Fique à vontade para entrar em contato.'
                  : 'Software, a difficult technical problem, or a landing page that needs a stronger point of view. Feel free to reach out.'}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-2.5">
                <a
                  href="mailto:joaoantonioscoelho@gmail.com?subject=Let%27s%20build%20something"
                  className="pressable focus-ring group inline-flex items-center gap-3 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black"
                >
                  <FiMail className="h-4 w-4" />
                  {pt ? 'Envie um e-mail' : 'Send me an email'}
                  <FiArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="pressable focus-ring inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-white/30 hover:text-white"
                  aria-live="polite"
                >
                  {copied ? <FiCheck className="h-4 w-4 text-emerald-300" /> : <FiCopy className="h-4 w-4" />}
                  {copied ? (pt ? 'E-mail copiado' : 'Email copied') : (pt ? 'Copiar e-mail' : 'Copy email')}
                </button>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.06] px-4 py-2.5 text-sm font-medium text-emerald-200/90">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_9px_rgba(52,211,153,0.8)]" />
                  {pt ? 'Disponível para conversar' : 'Available to talk'}
                </span>
              </div>
            </div>

            <div className="relative border-t border-white/10 lg:border-l lg:border-t-0 lg:pl-8">
              <p className="py-3 text-xs uppercase tracking-[0.2em] text-zinc-600 lg:pt-0">{pt ? 'Outros lugares' : 'Elsewhere'}</p>
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pressable focus-ring group flex items-center justify-between border-t border-white/10 py-3 text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  {link.label}
                  <FiArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        <footer className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} João Coelho</span>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('open-command-menu'))}
            className="focus-ring group inline-flex w-fit items-center gap-2 rounded-full text-left transition-colors hover:text-zinc-300"
            aria-label={pt ? 'Abrir navegação rápida' : 'Open quick navigation'}
          >
            {pt ? 'Feito com curiosidade e muito debugging.' : 'Built with curiosity and a lot of debugging.'}
            <kbd className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-[9px] text-zinc-700 transition-colors group-hover:border-white/20 group-hover:text-zinc-400">
              /
            </kbd>
          </button>
        </footer>
      </div>
    </section>
  );
}
