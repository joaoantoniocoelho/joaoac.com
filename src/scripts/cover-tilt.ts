import { RESTING_TILT, tiltFor, type Tilt } from '../lib/tilt.ts';
import { findAll, prefersReducedMotion } from './dom.ts';

function applyTilt(stage: HTMLElement, tilt: Tilt): void {
  stage.style.setProperty('--rotate-x', `${tilt.rotateX.toFixed(2)}deg`);
  stage.style.setProperty('--rotate-y', `${tilt.rotateY.toFixed(2)}deg`);
  stage.style.setProperty('--glare-x', `${tilt.glareX.toFixed(1)}%`);
  stage.style.setProperty('--glare-y', `${tilt.glareY.toFixed(1)}%`);
}

export function startCoverTilt(): void {
  if (prefersReducedMotion() || !window.matchMedia('(hover: hover)').matches) return;

  for (const stage of findAll(document, '[data-tilt-stage]', HTMLElement)) {
    let frame = 0;
    stage.addEventListener('pointermove', (event) => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        applyTilt(stage, tiltFor(event.clientX, event.clientY, stage.getBoundingClientRect()));
      });
    });
    stage.addEventListener('pointerleave', () => {
      window.cancelAnimationFrame(frame);
      applyTilt(stage, RESTING_TILT);
    });
  }
}
