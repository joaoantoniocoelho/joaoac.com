"use client";

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
  'RAG',
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
  'RAG',
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
              <h2 className="mb-10 text-4xl font-bold leading-[0.98] tracking-[-0.04em] text-white md:text-6xl lg:text-7xl">
                {pt ? 'Movido pela curiosidade' : 'Built around curiosity'}<span className="text-sky-300">.</span>
              </h2>

              <div className="space-y-6 text-base leading-8 text-zinc-300 md:text-lg md:leading-9">
                <p className="text-xl leading-9 text-zinc-100 md:text-2xl md:leading-10">
                  {pt
                    ? 'Sou o João. Construo software, quebro coisas, conserto e quase sempre aprendo algo novo no processo.'
                    : <>I&apos;m João. I build software, break things, fix them, and usually end up learning something new in the process.</>}
                </p>
                <p>
                  {pt
                    ? 'Sou principalmente um cara de backend, mas gosto de participar onde quer que esteja o problema. Arquitetura, APIs, nuvem, bancos de dados, IA, bugs estranhos e sistemas que precisam escalar: é esse tipo de coisa que costuma chamar minha atenção.'
                    : <>I&apos;m mostly a backend guy, but I like being involved wherever the problem is. Architecture, APIs, cloud, databases, AI, weird bugs, systems that need to scale: that&apos;s usually the kind of stuff that gets my attention.</>}
                </p>
                <p>
                  {pt
                    ? 'Gosto muito de entender como as coisas funcionam por baixo dos panos e transformar problemas confusos em algo mais simples e fácil de manter. Também gosto de construir do zero, especialmente quando há espaço para experimentar, tomar decisões e ajudar a moldar o produto.'
                    : <>I really enjoy understanding how things work under the hood and turning messy problems into something simpler and easier to maintain. I also like building things from scratch, especially when there&apos;s room to experiment, make decisions, and shape the product along the way.</>}
                </p>
                <p>
                  {pt
                    ? 'Ultimamente, tenho dedicado bastante tempo a explorar IA, agentes, LLMs, ferramentas para desenvolvedores e cibersegurança. Também estou começando um MBA em Cibersegurança, então esse tema tem ocupado uma parte cada vez maior dos meus estudos.'
                    : <>Lately, I&apos;ve been spending a lot of time exploring AI, agents, LLMs, developer tooling, and cybersecurity. I&apos;m also starting an MBA in Cybersecurity, so that&apos;s becoming a bigger part of what I&apos;m studying and thinking about.</>}
                </p>
                <p>
                  {pt
                    ? 'Fora do trabalho, normalmente estou correndo, jogando videogame ou passando tempo com meus cachorros.'
                    : <>Outside of work, I&apos;m usually running, playing videogames, or hanging out with my dogs.</>}
                </p>
              </div>
            </div>

            <aside className="lg:pt-20" aria-label={pt ? 'Interesses técnicos atuais' : 'Current technical interests'}>
              <div className="relative mb-5 overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.018] p-6">
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-zinc-600">{pt ? 'Momento atual' : 'Current snapshot'}</p>
                    <h3 className="text-2xl font-semibold tracking-tight text-white">{pt ? 'O que me interessa' : <>What I&apos;m into</>}</h3>
                  </div>
                  <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-emerald-300/70">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" /> {pt ? 'Agora' : 'Live'}
                  </span>
                </div>
                <div className="relative mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.08]">
                  <div className="bg-black/80 p-3">
                    <span className="block font-mono text-lg text-white">2018</span>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-600">{pt ? 'Construindo desde' : 'Building since'}</span>
                  </div>
                  <div className="bg-black/80 p-3">
                    <span className="block font-mono text-lg text-white">BRT</span>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-600">{pt ? 'Fuso horário' : 'Timezone'}</span>
                  </div>
                </div>
              </div>

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
