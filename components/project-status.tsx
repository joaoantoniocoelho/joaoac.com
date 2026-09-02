'use client';

import { useReducedMotion } from 'framer-motion';
import { useLocale } from '@/lib/i18n';

type ProjectStatusHeaderProps = {
  name: string;
  titleAs?: 'h2' | 'h3';
  titleClassName?: string;
};

export function ProjectStatusHeader({
  name,
  titleAs = 'h3',
  titleClassName = 'break-words text-2xl font-semibold tracking-tight text-white',
}: ProjectStatusHeaderProps) {
  const locale = useLocale();
  const pt = locale === 'pt-BR';
  const prefersReducedMotion = useReducedMotion();
  const Title = titleAs;

  return (
    <div className="min-w-0">
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <Title className={titleClassName}>{name}</Title>
        <span className="text-sm font-normal text-zinc-500">{pt ? 'fase inicial' : 'early stage'}</span>
      </div>
      <div className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-emerald-400">
        <span className="relative flex h-2 w-2 shrink-0">
          {!prefersReducedMotion && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/50" />
          )}
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.75)]" />
        </span>
        {pt ? 'Em produção' : 'In production'}
      </div>
    </div>
  );
}
