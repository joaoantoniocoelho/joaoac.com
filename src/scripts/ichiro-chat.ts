import { parseChatData, type ChatAction, type ChatData, type ChatLink } from '../lib/chat-data.ts';
import { copyText } from '../lib/clipboard.ts';
import { nextSuggestions } from '../lib/ichiro.ts';
import { element, find, prefersReducedMotion } from './dom.ts';

const SECRET_PROMPT = 'ichiro-secret';
const ANSWER_DELAY_MS = 520;
const MOOD_RESET_MS = 900;
const COPIED_RESET_MS = 2200;

type Parts = {
  root: HTMLElement;
  panel: HTMLElement;
  launcher: HTMLButtonElement;
  mood: HTMLImageElement;
  transcript: HTMLElement;
  suggestions: HTMLElement;
  typing: HTMLTemplateElement;
  close: HTMLButtonElement;
  reset: HTMLButtonElement;
};

function findParts(): Parts | null {
  const root = find(document, '[data-ichiro]', HTMLElement);
  if (!root) return null;
  const parts = {
    root,
    panel: find(root, '[data-ichiro-panel]', HTMLElement),
    launcher: find(root, '[data-ichiro-launcher]', HTMLButtonElement),
    mood: find(root, '[data-ichiro-mood]', HTMLImageElement),
    transcript: find(root, '[data-ichiro-transcript]', HTMLElement),
    suggestions: find(root, '[data-ichiro-suggestions]', HTMLElement),
    typing: find(root, '[data-ichiro-typing]', HTMLTemplateElement),
    close: find(root, '[data-ichiro-close]', HTMLButtonElement),
    reset: find(root, '[data-ichiro-reset]', HTMLButtonElement),
  };
  const { panel, launcher, mood, transcript, suggestions, typing, close, reset } = parts;
  if (!panel || !launcher || !mood || !transcript || !suggestions || !typing || !close || !reset) {
    return null;
  }
  return { root, panel, launcher, mood, transcript, suggestions, typing, close, reset };
}

function readData(root: HTMLElement): ChatData | null {
  const script = find(root, '[data-ichiro-data]', HTMLScriptElement);
  return script ? parseChatData(script.textContent) : null;
}

export function startIchiroChat(): void {
  const parts = findParts();
  if (!parts) return;
  const data = readData(parts.root);
  if (!data) return;

  let askedIds: string[] = [];
  let busy = false;
  let answerTimer = 0;
  let moodTimer = 0;

  const setMood = (mood: keyof ChatData['moods'], resetAfterMs?: number) => {
    window.clearTimeout(moodTimer);
    parts.mood.src = data.moods[mood];
    if (!resetAfterMs) return;
    moodTimer = window.setTimeout(() => {
      setMood('idle');
    }, resetAfterMs);
  };

  const scrollToEnd = () => {
    parts.transcript.scrollTo({
      top: parts.transcript.scrollHeight,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  };

  const renderLink = (link: ChatLink): HTMLElement => {
    const { action, href } = link;
    if (action) {
      const button = element('button', 'bubble-link', link.label);
      button.type = 'button';
      button.addEventListener('click', () => void handleAction(action, button));
      return button;
    }
    const anchor = element('a', 'bubble-link', link.label);
    anchor.href = href ?? '/';
    if (link.external) {
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
    }
    return anchor;
  };

  const addMessage = (from: 'ichiro' | 'visitor', text: string, links: ChatLink[] = []) => {
    const bubble = element('div', `bubble from-${from}`);
    bubble.append(element('p', '', text));
    if (links.length > 0) {
      const row = element('div', 'bubble-links');
      row.append(...links.map(renderLink));
      bubble.append(row);
    }
    parts.transcript.append(bubble);
    scrollToEnd();
  };

  const renderSuggestions = (ids: string[]) => {
    parts.suggestions.replaceChildren(
      ...ids.map((id) => {
        const chip = element('button', 'chip', data.prompts[id]?.question ?? '');
        chip.type = 'button';
        chip.addEventListener('click', () => {
          ask(id);
        });
        return chip;
      }),
    );
    if (ids.length === 0 && !busy)
      parts.suggestions.append(element('p', 'done', data.strings.done));
  };

  const ask = (id: string) => {
    const prompt = data.prompts[id];
    if (busy || !prompt) return;
    busy = true;
    askedIds = [...askedIds, id];
    addMessage('visitor', prompt.question);
    renderSuggestions([]);
    const typing = parts.typing.content.cloneNode(true);
    parts.transcript.append(typing);
    scrollToEnd();
    setMood('thinking');

    answerTimer = window.setTimeout(
      () => {
        parts.transcript.querySelector('.typing')?.remove();
        addMessage('ichiro', prompt.answer, prompt.links);
        busy = false;
        renderSuggestions(
          nextSuggestions({
            currentId: id,
            askedIds,
            graph: data.prompts,
            discoveryOrder: data.discoveryOrder,
            secretId: SECRET_PROMPT,
          }),
        );
        setMood('greeting', MOOD_RESET_MS);
      },
      prefersReducedMotion() ? 0 : ANSWER_DELAY_MS,
    );
  };

  const handleAction = async (action: ChatAction, button: HTMLButtonElement) => {
    if (action === 'reveal-email') {
      addMessage('ichiro', `${data.strings.emailAnswer} ${data.email}.`, [
        { label: data.strings.copyEmail, action: 'copy-email' },
      ]);
      return;
    }
    const copied = await copyText(data.email, navigator.clipboard);
    if (!copied) return;
    button.replaceChildren(data.strings.copied);
    window.setTimeout(() => {
      button.replaceChildren(data.strings.copyEmail);
    }, COPIED_RESET_MS);
  };

  const restart = () => {
    window.clearTimeout(answerTimer);
    busy = false;
    askedIds = [];
    parts.transcript.replaceChildren();
    addMessage('ichiro', data.greeting);
    renderSuggestions(data.initialPrompts);
  };

  const isOpen = () => !parts.panel.hidden;

  const setOpen = (open: boolean) => {
    parts.panel.hidden = !open;
    parts.launcher.setAttribute('aria-expanded', String(open));
    parts.launcher.setAttribute(
      'aria-label',
      (open ? parts.launcher.dataset.labelClose : parts.launcher.dataset.labelOpen) ?? '',
    );
    if (open) {
      setMood('greeting', MOOD_RESET_MS);
      parts.close.focus();
      return;
    }
    setMood('idle');
    parts.launcher.focus();
  };

  parts.launcher.addEventListener('click', () => {
    setOpen(!isOpen());
  });
  parts.close.addEventListener('click', () => {
    setOpen(false);
  });
  parts.reset.addEventListener('click', restart);
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) setOpen(false);
  });

  restart();
}
