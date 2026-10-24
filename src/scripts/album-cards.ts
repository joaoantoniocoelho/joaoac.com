import { find, findAll } from './dom.ts';

export function startAlbumCards(): void {
  for (const card of findAll(document, '[data-album-card]', HTMLElement)) {
    const front = find(card, '[data-album-flip]', HTMLButtonElement);
    const back = find(card, '[data-album-back]', HTMLElement);
    const close = find(card, '[data-album-unflip]', HTMLButtonElement);
    if (!front || !back || !close) continue;

    const setFlipped = (flipped: boolean) => {
      card.classList.toggle('is-flipped', flipped);
      front.setAttribute('aria-expanded', String(flipped));
      front.inert = flipped;
      back.inert = !flipped;
      (flipped ? close : front).focus({ preventScroll: true });
    };

    front.addEventListener('click', () => {
      setFlipped(true);
    });
    close.addEventListener('click', () => {
      setFlipped(false);
    });
  }
}
