"use client";

import { motion } from 'framer-motion';
import { FiArrowUpRight, FiMail } from 'react-icons/fi';

const socialLinks = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/joaoac' },
  { label: 'GitHub', href: 'https://github.com/joaoantoniocoelho' },
  { label: 'X / Twitter', href: 'https://x.com/joaoac_dev' },
];

export function ContactSection() {
  return (
    <section id="contact" className="relative overflow-hidden bg-black pb-10 pt-28 md:pt-40">
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-[70%] -translate-x-1/2 bg-indigo-500/[0.07] blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.25 }}
          className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.07] via-white/[0.025] to-transparent p-7 sm:p-10 md:p-14 lg:p-16"
        >
          <div className="grid gap-16 lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.65fr)] lg:items-end">
            <div>
              <div className="mb-8 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.24em] text-indigo-300/80">
                <span className="h-px w-8 bg-indigo-300/60" />
                Contact
              </div>
              <h2 className="max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-7xl">
                Have something interesting in mind?
              </h2>
              <p className="mt-7 max-w-2xl text-base leading-8 text-zinc-400 md:text-lg">
                An idea, a difficult problem, or just a good conversation about software — feel free to reach out.
              </p>
              <a
                href="mailto:joaoantonioscoelho@gmail.com"
                className="group mt-9 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-transform duration-300 hover:-translate-y-0.5"
              >
                <FiMail className="h-4 w-4" />
                Send me an email
                <FiArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>

            <div className="border-t border-white/10 lg:border-l lg:border-t-0 lg:pl-10">
              <p className="py-4 text-xs uppercase tracking-[0.2em] text-zinc-600 lg:pt-0">Elsewhere</p>
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between border-t border-white/10 py-4 text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  {link.label}
                  <FiArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        <footer className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} João Coelho</span>
          <span>Built with curiosity and a lot of debugging.</span>
        </footer>
      </div>
    </section>
  );
}
