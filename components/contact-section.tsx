"use client";

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FiArrowUpRight, FiCheck, FiCopy, FiMail } from 'react-icons/fi';
import { copyToClipboard } from '@/lib/copy-to-clipboard';

const socialLinks = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/joaoac' },
  { label: 'GitHub', href: 'https://github.com/joaoantoniocoelho' },
  { label: 'X / Twitter', href: 'https://x.com/joaoac_dev' },
];

export function ContactSection() {
  const [copied, setCopied] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const copyEmail = async () => {
    await copyToClipboard('joaoantonioscoelho@gmail.com');
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section id="contact" data-ambient="indigo" className="relative overflow-hidden bg-black/75 pb-10 pt-28 md:pt-40">
      <div className="pointer-events-none absolute bottom-0 left-1/2 hidden h-72 w-[70%] -translate-x-1/2 bg-indigo-500/[0.07] blur-[120px] lg:block" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300/20 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.25 }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.075] via-black/70 to-black/85 p-7 sm:p-10 md:p-14 lg:p-16"
        >
          <div className="absolute right-7 top-7 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-700 sm:right-10 sm:top-10">
            04 · Contact
          </div>
          <div className="grid gap-16 lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.65fr)] lg:items-end">
            <div>
              <div className="mb-8 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.24em] text-indigo-300/80">
                <span className="h-px w-8 bg-indigo-300/60" />
                Contact
              </div>
              <h2 className="max-w-4xl text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-white sm:text-5xl md:text-7xl lg:text-8xl">
                Let&apos;s make it worth remembering<span className="text-indigo-300">.</span>
              </h2>
              <p className="mt-7 max-w-2xl text-base leading-8 text-zinc-400 md:text-lg">
                Software, a difficult technical problem, or a landing page that needs a stronger point of view — feel free to reach out.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a
                  href="mailto:joaoantonioscoelho@gmail.com?subject=Let%27s%20build%20something"
                  className="pressable focus-ring group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black"
                >
                  <FiMail className="h-4 w-4" />
                  Send me an email
                  <FiArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="pressable focus-ring inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-zinc-300 transition-colors hover:border-white/30 hover:text-white"
                  aria-live="polite"
                >
                  {copied ? <FiCheck className="h-4 w-4 text-emerald-300" /> : <FiCopy className="h-4 w-4" />}
                  {copied ? 'Email copied' : 'Copy email'}
                </button>
              </div>
            </div>

            <div className="relative border-t border-white/10 lg:border-l lg:border-t-0 lg:pl-10">
              <p className="py-4 text-xs uppercase tracking-[0.2em] text-zinc-600 lg:pt-0">Elsewhere</p>
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pressable focus-ring group flex items-center justify-between border-t border-white/10 py-4 text-sm text-zinc-400 transition-colors hover:text-white"
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
            aria-label="Open quick navigation"
          >
            Built with curiosity and a lot of debugging.
            <kbd className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-[9px] text-zinc-700 transition-colors group-hover:border-white/20 group-hover:text-zinc-400">
              /
            </kbd>
          </button>
        </footer>
      </div>
    </section>
  );
}
