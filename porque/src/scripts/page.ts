const flipper = document.querySelector<HTMLElement>('[data-flipper]');
const back = document.querySelector<HTMLElement>('[data-back]');

// The back face is out of the tab order and the accessibility tree until the card is flipped.
function setFlipped(on: boolean): void {
  if (!flipper || !back) return;
  flipper.classList.toggle('on', on);
  back.setAttribute('aria-hidden', String(!on));
  for (const el of back.querySelectorAll<HTMLElement>('button, a')) {
    el.tabIndex = on ? 0 : -1;
  }
  const front = flipper.querySelector<HTMLElement>('.front');
  front?.toggleAttribute('inert', on);
  back.toggleAttribute('inert', !on);
}

setFlipped(false);

// "descobrir" first offers the guess, once; after that it just turns the card, like the app.
const phone = document.querySelector<HTMLElement>('[data-phone]');
const sheet = phone?.querySelector<HTMLElement>('[data-sheet]');
const verdict = phone?.querySelector<HTMLElement>('[data-verdict]');
let guessed = false;

function closeSheet(): void {
  if (sheet) sheet.hidden = true;
  document.querySelector<HTMLElement>('[data-flip-open]')?.focus({ preventScroll: true });
}

function finishGuess(choice: HTMLElement | null): void {
  guessed = true;
  if (sheet) sheet.hidden = true;
  if (choice && verdict) {
    const ok = choice.dataset.right === 'true';
    verdict.hidden = false;
    verdict.textContent = ok ? '✓ acertou.' : 'boa aposta, mas não.';
  }
  setFlipped(true);
}

document.querySelector('[data-flip-open]')?.addEventListener('click', () => {
  if (guessed || !sheet) {
    setFlipped(true);
    return;
  }
  sheet.hidden = false;
  sheet.querySelector<HTMLElement>('[data-guess]')?.focus({ preventScroll: true });
});
sheet?.querySelectorAll<HTMLElement>('[data-guess]').forEach((button) => {
  button.addEventListener('click', () => {
    finishGuess(button);
  });
});
sheet?.querySelector('[data-guess-skip]')?.addEventListener('click', () => {
  finishGuess(null);
});
sheet?.querySelector('[data-sheet-close]')?.addEventListener('click', closeSheet);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && sheet && !sheet.hidden) closeSheet();
});
document.querySelector('[data-flip-close]')?.addEventListener('click', () => {
  setFlipped(false);
});

const highlights = document.querySelectorAll('.hl');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.8 },
  );
  highlights.forEach((el) => {
    observer.observe(el);
  });
} else {
  highlights.forEach((el) => {
    el.classList.add('in');
  });
}

document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
  const root = document.documentElement;
  const dark = root.dataset.theme !== 'dark';
  if (dark) root.dataset.theme = 'dark';
  else delete root.dataset.theme;
  try {
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  } catch {
    /* storage blocked: the choice lasts until reload */
  }
});
