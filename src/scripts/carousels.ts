import { carouselEdges, carouselStep } from '../lib/carousel.ts';
import { find, findAll, prefersReducedMotion } from './dom.ts';

export function startCarousels(): void {
  for (const controls of findAll(document, '[data-carousel]', HTMLElement)) {
    const root = controls.closest('[data-carousel-root]');
    if (!root) continue;
    const track = find(root, '[data-carousel-track]', HTMLOListElement);
    const previous = find(controls, '[data-carousel-prev]', HTMLButtonElement);
    const next = find(controls, '[data-carousel-next]', HTMLButtonElement);
    if (!track || !previous || !next) continue;

    const updateButtons = () => {
      const { atStart, atEnd } = carouselEdges(
        track.scrollLeft,
        track.scrollWidth,
        track.clientWidth,
      );
      previous.disabled = atStart;
      next.disabled = atEnd;
    };

    const scroll = (direction: -1 | 1) => {
      const item = track.firstElementChild;
      if (!(item instanceof HTMLElement)) return;
      const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
      track.scrollBy({
        left: direction * carouselStep(item.getBoundingClientRect().width, gap),
        behavior: prefersReducedMotion() ? 'instant' : 'smooth',
      });
    };

    previous.addEventListener('click', () => {
      scroll(-1);
    });
    next.addEventListener('click', () => {
      scroll(1);
    });
    track.addEventListener('scroll', updateButtons, { passive: true });
    new ResizeObserver(updateButtons).observe(track);
    updateButtons();
  }
}
