export type ChatAction = 'reveal-email' | 'copy-email';

export type ChatLink = { label: string; href?: string; external?: boolean; action?: ChatAction };

export type ChatPrompt = { question: string; answer: string; links: ChatLink[]; next: string[] };

export type ChatData = {
  greeting: string;
  prompts: Record<string, ChatPrompt>;
  initialPrompts: string[];
  discoveryOrder: string[];
  email: string;
  strings: {
    emailAnswer: string;
    copyEmail: string;
    copied: string;
    done: string;
    restart: string;
    you: string;
  };
  moods: Record<Mood, string>;
};

export const MOODS = ['idle', 'blink', 'talking', 'thinking', 'greeting', 'sleeping'] as const;

export type Mood = (typeof MOODS)[number];

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

function parseStrings(value: unknown): ChatData['strings'] | null {
  if (!isRecord(value)) return null;
  const { emailAnswer, copyEmail, copied, done, restart, you } = value;
  if (typeof emailAnswer !== 'string' || typeof copyEmail !== 'string') return null;
  if (typeof copied !== 'string' || typeof done !== 'string') return null;
  if (typeof restart !== 'string' || typeof you !== 'string') return null;
  return { emailAnswer, copyEmail, copied, done, restart, you };
}

function parseMoods(value: unknown): ChatData['moods'] | null {
  if (!isRecord(value)) return null;
  const { idle, blink, talking, thinking, greeting, sleeping } = value;
  if (typeof idle !== 'string' || typeof blink !== 'string' || typeof talking !== 'string') {
    return null;
  }
  if (typeof thinking !== 'string' || typeof greeting !== 'string') return null;
  if (typeof sleeping !== 'string') return null;
  return { idle, blink, talking, thinking, greeting, sleeping };
}

function parseAction(value: unknown): ChatAction | undefined {
  return value === 'reveal-email' || value === 'copy-email' ? value : undefined;
}

function parseLink(value: unknown): ChatLink | null {
  if (!isRecord(value) || typeof value.label !== 'string') return null;
  const href = typeof value.href === 'string' ? value.href : undefined;
  const action = parseAction(value.action);
  if (!href && !action) return null;
  return {
    label: value.label,
    ...(href ? { href } : {}),
    ...(action ? { action } : {}),
    ...(value.external === true ? { external: true } : {}),
  };
}

function parsePrompt(value: unknown): ChatPrompt | null {
  if (!isRecord(value)) return null;
  if (typeof value.question !== 'string' || typeof value.answer !== 'string') return null;
  if (!isStringArray(value.next)) return null;
  const rawLinks: unknown[] = Array.isArray(value.links) ? value.links : [];
  const links = rawLinks.map(parseLink);
  if (links.some((link) => link === null)) return null;
  return {
    question: value.question,
    answer: value.answer,
    next: value.next,
    links: links.filter((link): link is ChatLink => link !== null),
  };
}

function parsePrompts(value: unknown): Record<string, ChatPrompt> | null {
  if (!isRecord(value)) return null;
  const entries = Object.entries(value).map(([id, prompt]) => [id, parsePrompt(prompt)] as const);
  if (entries.some(([, prompt]) => prompt === null)) return null;
  return Object.fromEntries(
    entries.filter((entry): entry is readonly [string, ChatPrompt] => entry[1] !== null),
  );
}

function referencesExist(data: ChatData): boolean {
  const ids = [
    ...data.initialPrompts,
    ...data.discoveryOrder,
    ...Object.values(data.prompts).flatMap((prompt) => prompt.next),
  ];
  return ids.every((id) => id in data.prompts);
}

// The page embeds this JSON at build time; parsing it defensively keeps a bad edit from breaking the page.
export function parseChatData(raw: string): ChatData | null {
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isRecord(value) || typeof value.greeting !== 'string' || typeof value.email !== 'string') {
    return null;
  }
  const prompts = parsePrompts(value.prompts);
  const strings = parseStrings(value.strings);
  const moods = parseMoods(value.moods);
  if (!prompts || !strings || !moods) return null;
  if (!isStringArray(value.initialPrompts) || !isStringArray(value.discoveryOrder)) return null;

  const data: ChatData = {
    greeting: value.greeting,
    email: value.email,
    prompts,
    strings,
    moods,
    initialPrompts: value.initialPrompts,
    discoveryOrder: value.discoveryOrder,
  };
  return referencesExist(data) ? data : null;
}
