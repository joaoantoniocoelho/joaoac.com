"use client";

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { FiCode, FiCompass, FiCpu } from 'react-icons/fi';
import { useLocale } from '@/lib/i18n';

const toolkit = ['Java', 'Spring Boot', 'Node.js', 'TypeScript', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker'];

const engineeringInterests = [
  'Backend Architecture',
  'System Design',
  'APIs',
  'Distributed Systems',
  'Cloud',
  'Developer Experience',
  'Software Architecture',
];

const exploring = [
  'AI Engineering',
  'LLMs',
  'Agents',
  'Generative AI',
  'Cybersecurity',
  'Developer Tooling',
];

const engineeringInterestsPtBr = [
  'Arquitetura Backend',
  'Design de Sistemas',
  'APIs',
  'Sistemas Distribuídos',
  'Nuvem',
  'Experiência de Desenvolvimento',
  'Arquitetura de Software',
];

const exploringPtBr = [
  'Engenharia de IA',
  'LLMs',
  'Agentes',
  'IA Generativa',
  'Cibersegurança',
  'Ferramentas para Desenvolvedores',
];

const groupAnimation = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay },
  }),
};

export function AboutSection() {
  const locale = useLocale();
  const pt = locale === 'pt-BR';
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="about" data-ambient="sky" className="relative overflow-hidden bg-black/75 py-28 md:py-36">
      <div className="pointer-events-none absolute right-0 top-1/3 hidden h-80 w-80 translate-x-1/2 rounded-full bg-sky-500/[0.07] blur-[110px] lg:block" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/20 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.15 }}
        >
          <div className="mb-14 flex items-center justify-between border-b border-white/[0.08] pb-6">
            <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.24em] text-sky-300/80">
              <span className="h-px w-8 bg-sky-300/60" />
              {pt ? 'Sobre' : 'About'}
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-700">01 · {pt ? 'Perfil' : 'Profile'}</span>
          </div>

          <div className="grid gap-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:gap-24">
            <div className="max-w-3xl">
              <h2 className="mb-10 text-4xl font-bold leading-[0.98] tracking-[-0.025em] text-white md:text-6xl lg:text-7xl">
                {pt ? 'Gosto de entender o porquê' : 'I like knowing why'}<span className="text-sky-300">.</span>
              </h2>

              <div className="space-y-6 text-base leading-8 text-zinc-300 md:text-lg md:leading-9">
                <div className="grid grid-cols-[minmax(7.5rem,9.5rem)_minmax(0,1fr)] items-stretch gap-4 md:flex md:items-center md:gap-6">
                  <div className="relative min-h-[7.5rem] overflow-hidden rounded-2xl border border-white/10 md:h-40 md:w-40 md:min-h-0 md:shrink-0">
                    <Image
                      src="/avatar.png"
                      alt={pt ? 'Avatar de João Coelho em pixel art' : 'Pixel art avatar of João Coelho'}
                      fill
                      sizes="(min-width: 768px) 160px, 152px"
                      className="object-cover"
                    />
                  </div>
                  <p className="min-w-0 self-center text-xl leading-9 text-zinc-100 md:text-2xl md:leading-10">
                  {pt
                    ? 'Sou o João. Construo software, quebro coisas, conserto e quase sempre aprendo algo novo no processo.'
                    : <>I&apos;m João. I build software, break things, fix them, and usually end up learning something new in the process.</>}
                  </p>
                </div>
                <p>
                  {pt
                    ? 'Meu foco é backend, sistemas distribuídos e infraestrutura. Já trabalhei com pagamentos na Bazk, compras na SAP e hoje construo ferramentas de IA na ADP. Também trabalho com React e Flutter quando o produto precisa.'
                    : <>My focus is backend, distributed systems, and infrastructure. I&apos;ve worked on payments at Bazk, procurement at SAP, and now AI tools at ADP. I also work with React and Flutter when the product needs it.</>}
                </p>
                <p>
                  {pt
                    ? 'Gosto de investigar o que acontece por baixo das abstrações e escolher soluções que façam sentido para o problema e sejam simples de manter. Nos meus produtos, Revisa Aí e Ao Redor, cuido da ideia, da arquitetura e da interface até colocar tudo no ar.'
                    : <>I like looking beneath the abstractions and choosing solutions that fit the problem and stay easy to maintain. For my own products, Revisa Aí and Ao Redor, I take care of the idea, architecture, and interface through to launch.</>}
                </p>
                <p>
                  {pt
                    ? 'Tenho explorado como IA, LLMs e agentes mudam o dia a dia de desenvolvimento, e escrevo sobre o que aprendo. Cibersegurança também está nos meus estudos: começo um MBA na USP/Esalq em outubro de 2026.'
                    : <>I&apos;m exploring how AI, LLMs, and agents change everyday development, and writing about what I learn. I&apos;m also studying cybersecurity, with an MBA at USP/Esalq starting in October 2026.</>}
                </p>
                <p>
                  {pt
                    ? 'Fora do trabalho, normalmente estou correndo, jogando videogame ou passando tempo com meus cachorros.'
                    : <>Outside of work, I&apos;m usually running, playing videogames, or hanging out with my dogs.</>}
                </p>
              </div>
            </div>

            <aside className="lg:pt-20" aria-label={pt ? 'Interesses técnicos atuais' : 'Current technical interests'}>
              <div className="space-y-5">
                <InterestGroup index="01" icon={<FiCode />} label={pt ? 'Trabalho com' : 'I work with'} items={toolkit} delay={0.1} reducedMotion={Boolean(prefersReducedMotion)} />
                <InterestGroup
                  index="02"
                  icon={<FiCpu />}
                  label={pt ? 'Coisas importantes para mim' : 'Things I care about'}
                  items={pt ? engineeringInterestsPtBr : engineeringInterests}
                  delay={0.2}
                  reducedMotion={Boolean(prefersReducedMotion)}
                />
                <InterestGroup
                  index="03"
                  icon={<FiCompass />}
                  label={pt ? 'Explorando ultimamente' : 'Exploring lately'}
                  items={pt ? exploringPtBr : exploring}
                  delay={0.3}
                  accent
                  learningLabel={pt ? 'Aprendendo' : 'Learning'}
                  reducedMotion={Boolean(prefersReducedMotion)}
                />
              </div>
            </aside>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function InterestGroup({
  icon,
  index,
  label,
  items,
  delay,
  accent = false,
  learningLabel = 'Learning',
  reducedMotion = false,
}: {
  icon: React.ReactNode;
  index: string;
  label: string;
  items: string[];
  delay: number;
  accent?: boolean;
  learningLabel?: string;
  reducedMotion?: boolean;
}) {
  return (
    <motion.div
      className={`rounded-2xl border p-5 transition-colors duration-300 md:p-6 ${
        accent
          ? 'border-white/15 bg-gradient-to-br from-white/[0.08] to-transparent hover:border-white/25'
          : 'border-white/[0.08] bg-white/[0.025] hover:border-white/15'
      }`}
      variants={groupAnimation}
      initial={reducedMotion ? false : "hidden"}
      whileInView="visible"
      custom={delay}
      viewport={{ once: true, amount: 0.4 }}
    >
      <div className="mb-4 flex items-center gap-2.5">
        <span className={accent ? 'text-zinc-200' : 'text-zinc-500'} aria-hidden="true">
          {icon}
        </span>
        <h4 className={`text-sm font-medium ${accent ? 'text-white' : 'text-zinc-300'}`}>
          {label}
        </h4>
        <span className="ml-auto font-mono text-[9px] text-zinc-700">{index}</span>
        {accent && (
          <span className="rounded-full border border-sky-300/20 bg-sky-300/[0.08] px-2 py-0.5 text-[10px] uppercase tracking-wider text-sky-200">
            {learningLabel}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className={`rounded-full border px-3 py-1.5 text-xs transition-all duration-300 hover:-translate-y-0.5 ${
              accent
                ? 'border-white/15 bg-white/[0.06] text-zinc-300 hover:border-white/30 hover:text-white'
                : 'border-white/[0.08] bg-black/30 text-zinc-400 hover:border-white/20 hover:text-zinc-200'
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
