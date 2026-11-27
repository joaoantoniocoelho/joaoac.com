import {
  RESTING_TILT,
  lerpTilt,
  idleTilt,
  isResting,
  scaleTilt,
  tiltFor,
  type Tilt,
} from '../lib/tilt.ts';
import { find, findAll, prefersReducedMotion } from './dom.ts';

// Share of the remaining distance covered each frame: low enough to feel weighty, high enough to
// keep up with the pointer.
const EASE = 0.09;
// Idle cards start at different points of the sway so a page full of them never moves in lockstep.
const IDLE_STAGGER_MS = 2600;

function applyTilt(card: HTMLElement, glare: HTMLElement | null, perspective: string, tilt: Tilt) {
  card.style.setProperty(
    'transform',
    `${perspective}rotateX(${tilt.rotateX.toFixed(3)}deg) rotateY(${tilt.rotateY.toFixed(3)}deg)`,
  );
  if (!glare) return;
  // The glare is twice the card's size, so half the travel keeps it covering the card.
  const x = (tilt.glareX - 50) / 2;
  const y = (tilt.glareY - 50) / 2;
  glare.style.setProperty('transform', `translate(${x.toFixed(2)}%, ${y.toFixed(2)}%)`);
}

// Any element with data-tilt-card leans toward a hovering pointer. Options, all on the element:
// data-tilt-idle drifts slowly while nobody touches it, data-tilt-strength scales the lean and
// data-tilt-perspective sets a perspective for cards whose parent does not provide one.
function startCard(card: HTMLElement, index: number, canHover: boolean): void {
  const glare = find(card, '[data-tilt-glare]', HTMLElement);
  const idle = card.dataset.tiltIdle !== undefined;
  const strength = Number(card.dataset.tiltStrength ?? '1') || 1;
  const perspective = card.dataset.tiltPerspective
    ? `perspective(${card.dataset.tiltPerspective}px) `
    : '';

  let current: Tilt = RESTING_TILT;
  let pointer: Tilt | null = null;
  let onScreen = true;
  let frame = 0;

  const target = (time: number): Tilt =>
    pointer ||
    (idle ? scaleTilt(idleTilt(time + index * IDLE_STAGGER_MS), strength) : RESTING_TILT);

  const step = (time: number) => {
    current = lerpTilt(current, target(time), EASE);
    applyTilt(card, glare, perspective, current);
    frame = idle || pointer || !isResting(current) ? window.requestAnimationFrame(step) : 0;
  };

  // Animates only while there is something to show: on screen, tab visible, and moving or settling.
  const sync = () => {
    window.cancelAnimationFrame(frame);
    frame = 0;
    if (!onScreen || document.hidden) return;
    if (idle || pointer || !isResting(current)) frame = window.requestAnimationFrame(step);
  };

  new IntersectionObserver((entries) => {
    onScreen = entries.some((entry) => entry.isIntersecting);
    sync();
  }).observe(card);
  document.addEventListener('visibilitychange', sync);

  // Touch screens have no hover, so they only get the idle drift.
  if (!canHover) return;
  card.addEventListener('pointermove', (event) => {
    pointer = scaleTilt(
      tiltFor(event.clientX, event.clientY, card.getBoundingClientRect()),
      strength,
    );
    if (!frame) sync();
  });
  card.addEventListener('pointerleave', () => {
    pointer = null;
  });
}

export function startTiltCards(): void {
  if (prefersReducedMotion()) return;
  const canHover = window.matchMedia('(hover: hover)').matches;
  findAll(document, '[data-tilt-card]', HTMLElement).forEach((card, index) => {
    startCard(card, index, canHover);
  });
}
