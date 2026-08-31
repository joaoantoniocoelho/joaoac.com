"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FiArrowUpRight, FiMessageCircle, FiRefreshCw, FiX } from 'react-icons/fi';
import { PiRabbit } from 'react-icons/pi';

type PromptId =
  | 'not-on-site'
  | 'work-style'
  | 'favorite-problems'
  | 'random-fact'
  | 'when-stuck'
  | 'tech-opinion'
  | 'learning-now'
  | 'away-from-keyboard'
  | 'ideal-project'
  | 'experience'
  | 'contact'
  | 'site-secret'
  | 'byte-secret';

type GuideLink = {
  label: string;
  href: string;
  external?: boolean;
};

type Prompt = {
  question: string;
  answer: string;
  links?: GuideLink[];
  next: PromptId[];
};

type ChatMessage = {
  id: number;
  role: 'byte' | 'visitor';
  text: string;
  links?: GuideLink[];
};

const prompts: Record<PromptId, Prompt> = {
  'not-on-site': {
    question: "Tell me something that isn't on the site.",
    answer:
      'João keeps a mental queue of things he wants to understand. It grows considerably faster than it gets resolved. Curiosity is less of a trait and more of a maintenance issue.',
    next: ['random-fact', 'work-style', 'tech-opinion', 'site-secret'],
  },
  'work-style': {
    question: "What's João like to work with?",
    answer:
      'He asks why until the problem becomes clear, then looks for the simplest solution that will still make sense six months later. He cares about fixing the cause, not just silencing the symptom.',
    next: ['favorite-problems', 'when-stuck', 'ideal-project', 'experience'],
  },
  'favorite-problems': {
    question: 'What kind of problems does he enjoy?',
    answer:
      'The ambiguous kind. Systems with unclear edges, competing trade-offs, and enough room to improve both the architecture and the product are usually the ones that keep his attention.',
    next: ['work-style', 'ideal-project', 'learning-now', 'experience'],
  },
  'random-fact': {
    question: 'Give me a random João fact.',
    answer:
      'His definition of a quick experiment is optimistic. It often becomes a working prototype before he notices the scope changed.',
    next: ['not-on-site', 'away-from-keyboard', 'when-stuck', 'tech-opinion'],
  },
  'when-stuck': {
    question: 'What does he do when he gets stuck?',
    answer:
      'Reduce the problem until only one assumption can be wrong, add visibility, read the internals, and test again. If that fails, take a short break and come back with fewer opinions.',
    next: ['work-style', 'tech-opinion', 'favorite-problems', 'learning-now'],
  },
  'tech-opinion': {
    question: 'Does he have a tech opinion?',
    answer:
      'A clever abstraction is rarely worth it if the next person needs a map to understand it. Clear and boring usually ages better than impressive and mysterious.',
    next: ['when-stuck', 'ideal-project', 'learning-now', 'site-secret'],
  },
  'learning-now': {
    question: "What's he learning right now?",
    answer:
      'AI engineering, agents, LLMs, RAG, developer tooling, and cybersecurity are taking most of the curiosity budget right now.',
    next: ['favorite-problems', 'tech-opinion', 'ideal-project', 'experience'],
  },
  'away-from-keyboard': {
    question: 'What happens away from the keyboard?',
    answer:
      'Usually running, videogames, or time with his dogs. The debugging process occasionally continues in the background anyway.',
    next: ['random-fact', 'not-on-site', 'site-secret', 'contact'],
  },
  'ideal-project': {
    question: "What's his ideal project?",
    answer:
      'Something useful with a real technical challenge, room to shape the product, and people who care about quality without turning every decision into ceremony.',
    next: ['favorite-problems', 'work-style', 'experience', 'contact'],
  },
  experience: {
    question: 'Where has he worked?',
    answer:
      'His path goes from full-stack product work to backend systems, cloud architecture, mobile, and AI tooling. The complete timeline has the details.',
    links: [{ label: 'View experience', href: '/experiences' }],
    next: ['work-style', 'favorite-problems', 'ideal-project', 'contact'],
  },
  contact: {
    question: 'How can I reach him?',
    answer:
      'Email is the most direct route. LinkedIn also works if you prefer a little professional context first.',
    links: [
      { label: 'Send an email', href: 'mailto:joaoantonioscoelho@gmail.com' },
      { label: 'Open LinkedIn', href: 'https://linkedin.com/in/joaoac', external: true },
    ],
    next: ['work-style', 'ideal-project', 'experience', 'site-secret'],
  },
  'site-secret': {
    question: 'Is anything hidden on this site?',
    answer:
      'Press / or Cmd + K. João left a quick navigation panel there for people who test keyboard shortcuts before reading instructions.',
    next: ['not-on-site', 'random-fact', 'tech-opinion', 'contact'],
  },
  'byte-secret': {
    question: "What shouldn't Byte tell me?",
    answer:
      "A repository described as just a test has never stayed just a test for very long. That's all the access my clearance level allows.",
    next: ['random-fact', 'site-secret', 'ideal-project', 'contact'],
  },
};

const initialSuggestions: PromptId[] = [
  'not-on-site',
  'work-style',
  'favorite-problems',
  'random-fact',
];

const discoveryOrder: PromptId[] = [
  'when-stuck',
  'tech-opinion',
  'learning-now',
  'away-from-keyboard',
  'ideal-project',
  'experience',
  'contact',
  'site-secret',
];

const initialMessage: ChatMessage = {
  id: 0,
  role: 'byte',
  text: "Hey, I'm Byte. I know a few things about João that did not fit on the page. Pick a question.",
};

function getNextSuggestions(currentId: PromptId, askedIds: PromptId[]) {
  const asked = new Set(askedIds);
  const unlocked: PromptId[] = askedIds.length >= 3 ? ['byte-secret'] : [];
  const candidates = [...prompts[currentId].next, ...unlocked, ...discoveryOrder];

  return Array.from(new Set(candidates)).filter((id) => !asked.has(id)).slice(0, 4);
}

export function ByteGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [askedIds, setAskedIds] = useState<PromptId[]>([]);
  const [suggestions, setSuggestions] = useState<PromptId[]>(initialSuggestions);
  const [isTyping, setIsTyping] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const launcherRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const responseTimerRef = useRef<number>();
  const teaserTimerRef = useRef<number>();
  const messageIdRef = useRef(1);

  const close = useCallback(() => {
    setIsOpen(false);
    window.requestAnimationFrame(() => launcherRef.current?.focus());
  }, []);

  const open = () => {
    window.clearTimeout(teaserTimerRef.current);
    setShowTeaser(false);
    setIsOpen(true);

    try {
      window.sessionStorage.setItem('byte-teaser-seen', 'true');
    } catch {
      // The guide still works when browser storage is unavailable.
    }
  };

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem('byte-teaser-seen')) return;
      teaserTimerRef.current = window.setTimeout(() => {
        setShowTeaser(true);
        window.sessionStorage.setItem('byte-teaser-seen', 'true');
      }, 3200);
    } catch {
      teaserTimerRef.current = window.setTimeout(() => setShowTeaser(true), 3200);
    }

    return () => window.clearTimeout(teaserTimerRef.current);
  }, []);

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
    transcriptRef.current?.scrollTo({
      top: transcriptRef.current.scrollHeight,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, [isTyping, messages, prefersReducedMotion]);

  useEffect(
    () => () => {
      window.clearTimeout(responseTimerRef.current);
      window.clearTimeout(teaserTimerRef.current);
    },
    [],
  );

  const ask = (id: PromptId) => {
    if (isTyping) return;

    const prompt = prompts[id];
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
        setSuggestions(getNextSuggestions(id, nextAskedIds));
        setIsTyping(false);
      },
      prefersReducedMotion ? 0 : 520,
    );
  };

  const reset = () => {
    window.clearTimeout(responseTimerRef.current);
    messageIdRef.current = 1;
    setMessages([initialMessage]);
    setAskedIds([]);
    setSuggestions(initialSuggestions);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-5 right-4 z-[90] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            role="dialog"
            aria-label="Byte, a scripted guide to João"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-[min(38rem,calc(100dvh-7rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-white/15 bg-zinc-950/95 shadow-2xl shadow-black/70 backdrop-blur-xl sm:w-[23rem]"
          >
            <header className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
              <span className="relative grid h-10 w-10 place-items-center rounded-2xl border border-sky-300/20 bg-sky-300/[0.07] text-sky-200">
                <PiRabbit className="h-5 w-5" aria-hidden="true" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-zinc-950 bg-emerald-300" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-white">Byte</h2>
                <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">Scripted guide · Online</p>
              </div>
              <button
                type="button"
                onClick={reset}
                className="pressable focus-ring grid h-8 w-8 place-items-center rounded-full text-zinc-600 transition-colors hover:bg-white/[0.06] hover:text-white"
                aria-label="Start the conversation over"
              >
                <FiRefreshCw className="h-3.5 w-3.5" />
              </button>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className="pressable focus-ring grid h-8 w-8 place-items-center rounded-full text-zinc-600 transition-colors hover:bg-white/[0.06] hover:text-white"
                aria-label="Close Byte"
              >
                <FiX className="h-4 w-4" />
              </button>
            </header>

            <div ref={transcriptRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5" aria-live="polite">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'visitor' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-3 text-sm leading-6 ${
                      message.role === 'visitor'
                        ? 'rounded-br-md bg-white text-black'
                        : 'rounded-bl-md border border-white/10 bg-white/[0.045] text-zinc-300'
                    }`}
                  >
                    <p>{message.text}</p>
                    {message.links && (
                      <div className="mt-3 flex flex-wrap gap-2 border-t border-white/10 pt-3">
                        {message.links.map((link) => (
                          <a
                            key={link.href}
                            href={link.href}
                            target={link.external ? '_blank' : undefined}
                            rel={link.external ? 'noopener noreferrer' : undefined}
                            className="focus-ring group inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-[11px] font-medium text-zinc-300 transition-colors hover:border-sky-300/30 hover:text-sky-200"
                          >
                            {link.label}
                            <FiArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={prefersReducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                  aria-label="Byte is typing"
                >
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
                <span>Suggested questions</span>
              </div>
              <div className="space-y-1.5">
                {suggestions.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => ask(id)}
                    className="focus-ring group flex w-full items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-2.5 text-left text-xs text-zinc-400 transition-colors hover:border-white/15 hover:bg-white/[0.05] hover:text-white"
                  >
                    <span>{prompts[id].question}</span>
                    <FiMessageCircle className="h-3.5 w-3.5 shrink-0 text-zinc-700 transition-colors group-hover:text-sky-300" />
                  </button>
                ))}
                {!isTyping && suggestions.length === 0 && (
                  <p className="py-3 text-center text-xs text-zinc-600">You found everything. Start over?</p>
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
            className="focus-ring rounded-2xl border border-white/[0.12] bg-zinc-950/95 px-3.5 py-2.5 text-left shadow-xl shadow-black/40 backdrop-blur-xl"
          >
            <span className="block text-xs font-medium text-zinc-200">Curious about João?</span>
            <span className="mt-0.5 block text-[10px] text-zinc-600">Byte knows a few things.</span>
          </motion.button>
        )}
      </AnimatePresence>

      <button
        ref={launcherRef}
        type="button"
        onClick={() => (isOpen ? close() : open())}
        aria-label={isOpen ? 'Close Byte' : 'Talk to Byte'}
        aria-expanded={isOpen}
        className="pressable focus-ring group relative grid h-14 w-14 place-items-center rounded-2xl border border-white/15 bg-zinc-950/95 text-zinc-200 shadow-xl shadow-black/50 backdrop-blur-xl transition-colors hover:border-sky-300/30 hover:text-sky-200"
      >
        <PiRabbit className="h-6 w-6 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden="true" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-zinc-950 bg-emerald-300" />
      </button>
    </div>
  );
}
