import {
  parseChatData,
  type ChatAction,
  type ChatData,
  type ChatLink,
  type Mood,
} from '../lib/chat-data.ts';
import { copyText } from '../lib/clipboard.ts';
import { charsShown, nextSuggestions, typingDuration } from '../lib/ichiro.ts';
import { element, find, prefersReducedMotion } from './dom.ts';

const SECRET_PROMPT = 'ichiro-secret';
// A short pause before answering reads as ichiro thinking it over.
const THINKING_MS = 450;
const GREETING_MS = 700;
const TALK_FRAME_MS = 150;
const BLINK_MS = 140;
const BLINK_EVERY_MIN_MS = 2500;
const BLINK_EVERY_MAX_MS = 5500;
// Left alone with the dialog open, he dozes off until someone moves or types.
const SLEEP_AFTER_MS = 45_000;
const COPIED_RESET_MS = 2200;

type Parts = {
  root: HTMLElement;
  panel: HTMLElement;
  launcher: HTMLButtonElement;
  sprite: HTMLImageElement;
  asked: HTMLElement;
  askedText: HTMLElement;
  typed: HTMLElement;
  rest: HTMLElement;
  live: HTMLElement;
  links: HTMLElement;
  choices: HTMLElement;
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
    sprite: find(root, '[data-ichiro-mood]', HTMLImageElement),
    asked: find(root, '[data-ichiro-asked]', HTMLElement),
    askedText: find(root, '[data-ichiro-asked-text]', HTMLElement),
    typed: find(root, '[data-ichiro-typed]', HTMLElement),
    rest: find(root, '[data-ichiro-rest]', HTMLElement),
    live: find(root, '[data-ichiro-live]', HTMLElement),
    links: find(root, '[data-ichiro-links]', HTMLElement),
    choices: find(root, '[data-ichiro-choices]', HTMLElement),
    close: find(root, '[data-ichiro-close]', HTMLButtonElement),
    reset: find(root, '[data-ichiro-reset]', HTMLButtonElement),
  };
  const { panel, launcher, sprite, asked, askedText, typed, rest, live, links, choices } = parts;
  const { close, reset } = parts;
  if (!panel || !launcher || !sprite || !asked || !askedText || !typed || !rest || !live)
    return null;
  if (!links || !choices || !close || !reset) return null;
  return {
    root,
    panel,
    launcher,
    sprite,
    asked,
    askedText,
    typed,
    rest,
    live,
    links,
    choices,
    close,
    reset,
  };
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
  const animate = !prefersReducedMotion();

  let askedIds: string[] = [];
  let mood: Mood = 'idle';
  let typingFrame = 0;
  let finishTyping: (() => void) | null = null;
  let pendingTimer = 0;
  let blinkTimer = 0;
  let sleepTimer = 0;

  const isOpen = () => !parts.panel.hidden;

  const showMood = (next: Mood) => {
    mood = next;
    parts.sprite.src = data.moods[next];
    parts.sprite.dataset.mood = next;
  };

  // Blinks now and then while idle; any other mood skips the blink and tries again later.
  const scheduleBlink = () => {
    window.clearTimeout(blinkTimer);
    if (!animate || !isOpen()) return;
    const wait = BLINK_EVERY_MIN_MS + Math.random() * (BLINK_EVERY_MAX_MS - BLINK_EVERY_MIN_MS);
    blinkTimer = window.setTimeout(() => {
      if (mood === 'idle') {
        showMood('blink');
        window.setTimeout(() => {
          if (mood === 'blink') showMood('idle');
        }, BLINK_MS);
      }
      scheduleBlink();
    }, wait);
  };

  const scheduleSleep = () => {
    window.clearTimeout(sleepTimer);
    if (!isOpen()) return;
    sleepTimer = window.setTimeout(() => {
      if (!finishTyping) showMood('sleeping');
    }, SLEEP_AFTER_MS);
  };

  // Waves for a moment, then settles back to idle unless something else took over meanwhile.
  const wave = () => {
    showMood('greeting');
    window.setTimeout(() => {
      if (mood === 'greeting') showMood('idle');
    }, GREETING_MS);
  };

  const wakeUp = () => {
    if (mood === 'sleeping') wave();
    scheduleSleep();
  };

  const renderLink = (link: ChatLink): HTMLElement => {
    const { action, href } = link;
    if (action) {
      const button = element('button', 'answer-link chevron-link', link.label);
      button.type = 'button';
      button.addEventListener('click', () => void handleAction(action, button));
      return button;
    }
    const anchor = element('a', 'answer-link chevron-link', link.label);
    anchor.href = href ?? '/';
    if (link.external) {
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
    }
    return anchor;
  };

  const choice = (label: string, onPick: () => void): HTMLButtonElement => {
    const button = element('button', 'choice', label);
    button.type = 'button';
    button.addEventListener('click', onPick);
    return button;
  };

  const setChoices = (buttons: HTMLElement[]) => {
    parts.choices.replaceChildren(...buttons);
  };

  const stopTyping = () => {
    window.cancelAnimationFrame(typingFrame);
    window.clearTimeout(pendingTimer);
    finishTyping = null;
  };

  // Types the line out while the sprite talks. The untyped rest is already in place but invisible,
  // so the box has its final size from the first frame and nothing below it jumps around.
  const say = (text: string, links: ChatLink[], next: () => HTMLElement[]) => {
    stopTyping();
    parts.links.replaceChildren();
    setChoices([]);
    parts.live.textContent = text;

    const done = () => {
      stopTyping();
      parts.typed.textContent = text;
      parts.rest.textContent = '';
      parts.links.replaceChildren(...links.map(renderLink));
      setChoices(next());
      showMood('idle');
      scheduleSleep();
    };

    if (!animate) {
      done();
      return;
    }

    finishTyping = done;
    const started = performance.now();
    const step = (now: number) => {
      const elapsed = now - started;
      const shown = charsShown(text, elapsed);
      parts.typed.textContent = text.slice(0, shown);
      parts.rest.textContent = text.slice(shown);
      showMood(Math.floor(elapsed / TALK_FRAME_MS) % 2 === 0 ? 'talking' : 'idle');
      if (elapsed >= typingDuration(text)) {
        done();
        return;
      }
      typingFrame = window.requestAnimationFrame(step);
    };
    typingFrame = window.requestAnimationFrame(step);
  };

  const questionChoice = (id: string) =>
    choice(data.prompts[id]?.question ?? '', () => {
      ask(id);
    });

  const suggestionsAfter = (id: string): HTMLElement[] => {
    const ids = nextSuggestions({
      currentId: id,
      askedIds,
      graph: data.prompts,
      discoveryOrder: data.discoveryOrder,
      secretId: SECRET_PROMPT,
    });
    if (ids.length === 0) {
      parts.links.append(element('p', 'done', data.strings.done));
      return [choice(data.strings.restart, restart)];
    }
    return ids.map(questionChoice);
  };

  const ask = (id: string) => {
    const prompt = data.prompts[id];
    if (!prompt) return;
    stopTyping();
    askedIds = [...askedIds, id];
    parts.asked.hidden = false;
    parts.askedText.textContent = prompt.question;
    parts.typed.textContent = '';
    parts.rest.textContent = '';
    parts.links.replaceChildren();
    setChoices([]);
    showMood('thinking');
    pendingTimer = window.setTimeout(
      () => {
        say(prompt.answer, prompt.links, () => suggestionsAfter(id));
      },
      animate ? THINKING_MS : 0,
    );
  };

  const handleAction = async (action: ChatAction, button: HTMLButtonElement) => {
    if (action === 'reveal-email') {
      // The same questions stay on offer after the email.
      const current = Array.from(parts.choices.children).filter(
        (child): child is HTMLElement => child instanceof HTMLElement,
      );
      say(
        `${data.strings.emailAnswer} ${data.email}.`,
        [{ label: data.strings.copyEmail, action: 'copy-email' }],
        () => current,
      );
      return;
    }
    const copied = await copyText(data.email, navigator.clipboard);
    if (!copied) return;
    button.replaceChildren(data.strings.copied);
    window.setTimeout(() => {
      button.replaceChildren(data.strings.copyEmail);
    }, COPIED_RESET_MS);
  };

  const greet = () => {
    parts.asked.hidden = true;
    say(data.greeting, [], () => data.initialPrompts.map(questionChoice));
  };

  function restart() {
    askedIds = [];
    greet();
  }

  const setOpen = (open: boolean) => {
    parts.panel.hidden = !open;
    parts.root.dataset.open = String(open);
    parts.launcher.setAttribute('aria-expanded', String(open));
    if (open) {
      const fresh = askedIds.length === 0 && !parts.typed.textContent;
      if (fresh) {
        showMood('greeting');
        pendingTimer = window.setTimeout(greet, animate ? GREETING_MS : 0);
      } else {
        wave();
      }
      scheduleBlink();
      scheduleSleep();
      parts.panel.focus({ preventScroll: true });
      return;
    }
    stopTyping();
    finishTyping = null;
    window.clearTimeout(blinkTimer);
    window.clearTimeout(sleepTimer);
    // Closing mid-answer would leave half a sentence behind; finish it so reopening reads well.
    if (parts.rest.textContent) {
      parts.typed.textContent += parts.rest.textContent;
      parts.rest.textContent = '';
    }
    parts.launcher.focus({ preventScroll: true });
  };

  parts.launcher.addEventListener('click', () => {
    setOpen(true);
  });
  parts.close.addEventListener('click', () => {
    setOpen(false);
  });
  parts.reset.addEventListener('click', restart);

  // A click on the text, or Enter or Space on the dialog, skips to the end of the current line.
  parts.panel.addEventListener('click', (event) => {
    wakeUp();
    if (!finishTyping) return;
    if (event.target instanceof Element && event.target.closest('button, a')) return;
    finishTyping();
  });
  parts.panel.addEventListener('keydown', (event) => {
    wakeUp();
    if (
      finishTyping &&
      event.target === parts.panel &&
      (event.key === 'Enter' || event.key === ' ')
    ) {
      event.preventDefault();
      finishTyping();
    }
  });
  parts.panel.addEventListener('pointermove', wakeUp);
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) setOpen(false);
  });
}
