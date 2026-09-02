"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FiArrowUpRight, FiCheck, FiCopy, FiMessageCircle, FiRefreshCw, FiX } from 'react-icons/fi';
import { ByteMascot, type ByteMood } from '@/components/byte-mascot';
import { useLocale, isHomePath } from '@/lib/i18n';
import {
  discoveryOrder,
  initialPrompts,
  prompts,
  promptsPtBr,
  type GuideLink,
  type Prompt,
  type PromptId,
} from '@/content/byte-prompts';
import { CONTACT_EMAIL } from '@/lib/site';

type ChatMessage = {
  id: number;
  role: 'byte' | 'visitor';
  text: string;
  links?: GuideLink[];
};


const initialMessage: ChatMessage = {
  id: 0,
  role: 'byte',
  text: "Hey, I'm Byte. The rabbit shape isn't random. I know a few things about João that did not fit on the page. Pick a question.",
};

const initialMessagePtBr: ChatMessage = {
  id: 0,
  role: 'byte',
  text: 'Oi, sou o Byte. O formato de coelho não é por acaso. Sei algumas coisas sobre o João que não couberam na página. Escolha uma pergunta.',
};

function getNextSuggestions(currentId: PromptId, askedIds: PromptId[], promptSet: Record<PromptId, Prompt>) {
  const asked = new Set(askedIds);
  const unlocked: PromptId[] = askedIds.length >= 3 ? ['byte-secret'] : [];
  const candidates = [...promptSet[currentId].next, ...unlocked, ...discoveryOrder];

  return Array.from(new Set(candidates)).filter((id) => !asked.has(id)).slice(0, 4);
}

export function ByteGuide() {
  const locale = useLocale();
  const pt = locale === 'pt-BR';
  const promptSet = pt ? promptsPtBr : prompts;
  const localizedInitialMessage = pt ? initialMessagePtBr : initialMessage;
  const [isOpen, setIsOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([localizedInitialMessage]);
  const [askedIds, setAskedIds] = useState<PromptId[]>([]);
  const [suggestions, setSuggestions] = useState<PromptId[]>(initialPrompts);
  const [isTyping, setIsTyping] = useState(false);
  const [isEmailCopied, setIsEmailCopied] = useState(false);
  const [mascotMood, setMascotMood] = useState<ByteMood>('idle');
  const pathname = usePathname();
  const [isHeroVisible, setIsHeroVisible] = useState(isHomePath(pathname));
  const prefersReducedMotion = useReducedMotion();
  const launcherRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const responseTimerRef = useRef<number>();
  const teaserTimerRef = useRef<number>();
  const teaserHideTimerRef = useRef<number>();
  const mascotTimerRef = useRef<number>();
  const sleepTimerRef = useRef<number>();
  const copyTimerRef = useRef<number>();
  const messageIdRef = useRef(1);
  const hasTeasedRef = useRef(false);
  const previousLocaleRef = useRef(locale);

  const cueMascot = useCallback((nextMood: ByteMood, duration?: number) => {
    window.clearTimeout(mascotTimerRef.current);
    setMascotMood(nextMood);

    if (duration) {
      mascotTimerRef.current = window.setTimeout(() => setMascotMood('idle'), duration);
    }
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    cueMascot('idle');
    window.requestAnimationFrame(() => launcherRef.current?.focus());
  }, [cueMascot]);

  const open = () => {
    window.clearTimeout(teaserTimerRef.current);
    window.clearTimeout(teaserHideTimerRef.current);
    setShowTeaser(false);
    setIsOpen(true);
    cueMascot('greeting', 900);
  };

  useEffect(() => {
    // The mascot only sits next to the teaser while the hero is on screen; past
    // that it detaches and peeks from the right edge, so the bubble would point
    // at nothing. Greet once per visit, and only from the docked position.
    if (hasTeasedRef.current || isOpen || !isHomePath(pathname) || !isHeroVisible) return;

    teaserTimerRef.current = window.setTimeout(() => {
      hasTeasedRef.current = true;
      setShowTeaser(true);
      cueMascot('greeting', 900);
      teaserHideTimerRef.current = window.setTimeout(() => setShowTeaser(false), 7200);
    }, 650);

    return () => {
      window.clearTimeout(teaserTimerRef.current);
      window.clearTimeout(teaserHideTimerRef.current);
    };
  }, [cueMascot, isHeroVisible, isOpen, pathname]);

  useEffect(() => {
    const hero = document.getElementById('home');
    if (!hero) {
      setIsHeroVisible(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio > 0.18;
        setIsHeroVisible(visible);
        if (!visible) setShowTeaser(false);
      },
      { threshold: [0, 0.18, 0.4] },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    window.clearTimeout(sleepTimerRef.current);
    if (isOpen || mascotMood !== 'idle') return;

    sleepTimerRef.current = window.setTimeout(() => setMascotMood('sleeping'), 18_000);
    return () => window.clearTimeout(sleepTimerRef.current);
  }, [isOpen, mascotMood]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.requestAnimationFrame(() => closeRef.current?.focus());
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [close, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const body = document.body;
    const root = document.documentElement;
    const previousBodyOverflow = body.style.overflow;
    const previousRootOverflow = root.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - root.clientWidth;

    body.style.overflow = 'hidden';
    root.style.overflow = 'hidden';
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      body.style.overflow = previousBodyOverflow;
      root.style.overflow = previousRootOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [isOpen]);

  useEffect(() => {
    transcriptRef.current?.scrollTo({
      top: transcriptRef.current.scrollHeight,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, [isTyping, messages, prefersReducedMotion]);

  useEffect(
    () => () => {
      window.clearTimeout(responseTimerRef.current);
      window.clearTimeout(teaserTimerRef.current);
      window.clearTimeout(teaserHideTimerRef.current);
      window.clearTimeout(mascotTimerRef.current);
      window.clearTimeout(sleepTimerRef.current);
      window.clearTimeout(copyTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    if (previousLocaleRef.current === locale) return;

    previousLocaleRef.current = locale;
    window.clearTimeout(responseTimerRef.current);
    messageIdRef.current = 1;
    setMessages([localizedInitialMessage]);
    setAskedIds([]);
    setSuggestions(initialPrompts);
    setIsTyping(false);
  }, [locale, localizedInitialMessage]);

  const ask = (id: PromptId) => {
    if (isTyping) return;

    const prompt = promptSet[id];
    const nextAskedIds = [...askedIds, id];
    const visitorMessage: ChatMessage = {
      id: messageIdRef.current++,
      role: 'visitor',
      text: prompt.question,
    };

    setMessages((current) => [...current, visitorMessage]);
    setAskedIds(nextAskedIds);
    setSuggestions([]);
    setIsTyping(true);
    cueMascot('thinking');

    responseTimerRef.current = window.setTimeout(
      () => {
        setMessages((current) => [
          ...current,
          {
            id: messageIdRef.current++,
            role: 'byte',
            text: prompt.answer,
            links: prompt.links,
          },
        ]);
        setSuggestions(getNextSuggestions(id, nextAskedIds, promptSet));
        setIsTyping(false);
        cueMascot('greeting', 900);
      },
      prefersReducedMotion ? 0 : 520,
    );
  };

  const reset = () => {
    window.clearTimeout(responseTimerRef.current);
    messageIdRef.current = 1;
    setMessages([localizedInitialMessage]);
    setAskedIds([]);
    setSuggestions(initialPrompts);
    setIsTyping(false);
    setIsEmailCopied(false);
    cueMascot('greeting', 900);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setIsEmailCopied(true);
      window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setIsEmailCopied(false), 2200);
    } catch {
      setIsEmailCopied(false);
    }
  };

  const handleGuideAction = (action: NonNullable<GuideLink['action']>) => {
    if (action === 'copy-email') {
      void copyEmail();
      return;
    }

    setIsEmailCopied(false);
    setMessages((current) => [
      ...current,
      {
        id: messageIdRef.current++,
        role: 'byte',
        text: pt ? `Claro. Você pode enviar um e-mail diretamente para o João em ${CONTACT_EMAIL}.` : `Of course. You can email João directly at ${CONTACT_EMAIL}.`,
        links: [{ label: pt ? 'Copiar e-mail' : 'Copy email', action: 'copy-email' }],
      },
    ]);
    cueMascot('greeting', 700);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            aria-hidden="true"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.22 }}
            onClick={close}
            className="fixed inset-0 z-[80] bg-black/65 backdrop-blur-[6px]"
          />
        )}
      </AnimatePresence>

      <div
        className={`fixed z-[90] flex ${
          isOpen
            ? 'inset-0 flex-row items-end gap-3 sm:inset-auto sm:bottom-4 sm:right-5 sm:flex-row-reverse'
            : 'bottom-2 right-2 flex-col items-end gap-2 sm:bottom-4 sm:right-5'
        }`}
      >
      <AnimatePresence>
        {isOpen && (
          <motion.section
            role="dialog"
            aria-label={pt ? 'Byte, um guia sobre o João' : 'Byte, a scripted guide to João'}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-dvh w-screen flex-col overflow-hidden bg-zinc-950/95 shadow-2xl shadow-black/70 backdrop-blur-xl sm:h-[min(40rem,calc(100dvh-2rem))] sm:w-[23rem] sm:rounded-3xl sm:border sm:border-white/15"
          >
            <header className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
              <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-2xl border border-sky-300/20 bg-sky-300/[0.07]">
                <Image src="/byte/byte-idle.png" alt="" aria-hidden="true" width={40} height={40} className="h-10 w-10 object-contain" />
                <span aria-hidden="true" className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-zinc-950 bg-emerald-300" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-white">Byte</h2>
                <p className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-emerald-300/80">
                  <motion.span
                    aria-hidden="true"
                    animate={prefersReducedMotion ? undefined : { opacity: [0.55, 1, 0.55], scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.7)]"
                  />
                  {pt ? 'Online' : 'Online'}
                </p>
              </div>
              <button
                type="button"
                onClick={reset}
                className="pressable focus-ring grid h-8 w-8 place-items-center rounded-full text-zinc-600 transition-colors hover:bg-white/[0.06] hover:text-white"
                aria-label={pt ? 'Reiniciar a conversa' : 'Start the conversation over'}
              >
                <FiRefreshCw className="h-3.5 w-3.5" />
              </button>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className="pressable focus-ring grid h-8 w-8 place-items-center rounded-full text-zinc-600 transition-colors hover:bg-white/[0.06] hover:text-white"
                aria-label={pt ? 'Fechar o Byte' : 'Close Byte'}
              >
                <FiX className="h-4 w-4" />
              </button>
            </header>

            <div ref={transcriptRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5" aria-live="polite">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-end gap-2 ${message.role === 'visitor' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role !== 'visitor' &&
                    // Only the first bubble of a run is badged; the rest keep
                    // the indent so the column stays straight.
                    (messages[index - 1]?.role === 'visitor' || index === 0 ? (
                      <ByteAvatar />
                    ) : (
                      <span aria-hidden="true" className="h-7 w-7 shrink-0" />
                    ))}
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-3 text-sm leading-6 ${
                      message.role === 'visitor'
                        ? 'rounded-br-md bg-white text-black'
                        : 'rounded-bl-md border border-white/10 bg-white/[0.045] text-zinc-300'
                    }`}
                  >
                    <p>{message.text}</p>
                    {message.links && (
                      <div className="mt-3 flex flex-wrap gap-2 border-t border-white/10 pt-3">
                        {message.links.map((link) =>
                          link.action ? (
                            <button
                              key={`${link.label}-${link.action}`}
                              type="button"
                              onClick={() => handleGuideAction(link.action!)}
                              className="focus-ring group inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-[11px] font-medium text-zinc-300 transition-colors hover:border-sky-300/30 hover:text-sky-200"
                            >
                              {link.action === 'copy-email' && isEmailCopied ? (pt ? 'Copiado' : 'Copied') : link.label}
                              {link.action === 'copy-email' ? (
                                isEmailCopied ? (
                                  <FiCheck className="h-3 w-3 text-emerald-300" />
                                ) : (
                                  <FiCopy className="h-3 w-3 transition-transform group-hover:scale-110" />
                                )
                              ) : (
                                <FiMessageCircle className="h-3 w-3 text-sky-300" />
                              )}
                            </button>
                          ) : (
                            <a
                              key={link.href}
                              href={link.href}
                              target={link.external ? '_blank' : undefined}
                              rel={link.external ? 'noopener noreferrer' : undefined}
                              onClick={close}
                              className="focus-ring group inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-[11px] font-medium text-zinc-300 transition-colors hover:border-sky-300/30 hover:text-sky-200"
                            >
                              {link.label}
                              <FiArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            </a>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={prefersReducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-end justify-start gap-2"
                  aria-label={pt ? 'Byte está digitando' : 'Byte is typing'}
                >
                  <ByteAvatar />
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.045] px-4 py-3.5">
                    {[0, 1, 2].map((dot) => (
                      <motion.span
                        key={dot}
                        animate={prefersReducedMotion ? undefined : { opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: dot * 0.12 }}
                        className="h-1 w-1 rounded-full bg-zinc-500"
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="border-t border-white/10 bg-black/25 px-3 py-3">
              <div className="mb-2 px-1 text-[9px] uppercase tracking-[0.16em] text-zinc-700">
                <span>{pt ? 'Perguntas sugeridas' : 'Suggested questions'}</span>
              </div>
              <div className="space-y-1.5">
                {suggestions.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => ask(id)}
                    className="focus-ring group flex w-full items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-2.5 text-left text-xs text-zinc-400 transition-colors hover:border-white/15 hover:bg-white/[0.05] hover:text-white"
                  >
                    <span>{promptSet[id].question}</span>
                    <FiMessageCircle className="h-3.5 w-3.5 shrink-0 text-zinc-700 transition-colors group-hover:text-sky-300" />
                  </button>
                ))}
                {!isTyping && suggestions.length === 0 && (
                  <p className="py-3 text-center text-xs text-zinc-600">{pt ? 'Você encontrou tudo. Recomeçar?' : 'You found everything. Start over?'}</p>
                )}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTeaser && !isOpen && (
          <motion.button
            type="button"
            onClick={open}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="focus-ring absolute bottom-3 right-[7.25rem] whitespace-nowrap rounded-full sm:right-[9.25rem] border border-white/[0.12] bg-zinc-950/95 px-3.5 py-2 text-left shadow-xl shadow-black/40 backdrop-blur-xl"
          >
            <span className="block text-xs font-medium text-zinc-200">{pt ? 'Oi, sou o Byte.' : <>Hey, I&apos;m Byte.</>}</span>
          </motion.button>
        )}
      </AnimatePresence>

      <div className={isOpen ? 'hidden sm:block' : 'block'}>
        <ByteMascot
          buttonRef={launcherRef}
          mood={mascotMood}
          isOpen={isOpen}
          compact={!isOpen && !isHeroVisible}
          onWake={() => {
            if (mascotMood === 'sleeping') cueMascot('idle');
          }}
          onClick={() => (isOpen ? close() : open())}
          openLabel={pt ? 'Conversar com o Byte' : 'Talk to Byte'}
          closeLabel={pt ? 'Fechar o Byte' : 'Close Byte'}
        />
      </div>
      </div>
    </>
  );
}

function ByteAvatar() {
  return (
    <span
      aria-hidden="true"
      className="grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-full border border-sky-300/20 bg-sky-300/[0.07]"
    >
      <Image src="/byte/byte-idle.png" alt="" aria-hidden="true" width={28} height={28} className="h-7 w-7 object-contain" />
    </span>
  );
}
