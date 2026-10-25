import { find, findAll } from './dom.ts';

export function startBookshelf(): void {
  for (const card of findAll(document, '[data-book-card]', HTMLElement)) {
    const front = find(card, '[data-book-flip]', HTMLButtonElement);
    const back = find(card, '[data-book-back]', HTMLButtonElement);
    if (!front || !back) continue;

    const setFlipped = (flipped: boolean) => {
      card.classList.toggle('is-flipped', flipped);
      front.setAttribute('aria-expanded', String(flipped));
      // Only the visible face is reachable by keyboard and screen readers.
      back.inert = !flipped;
      front.inert = flipped;
      (flipped ? back : front).focus({ preventScroll: true });
    };

    front.addEventListener('click', () => {
      setFlipped(true);
    });
    back.addEventListener('click', () => {
      setFlipped(false);
    });
  }
}
