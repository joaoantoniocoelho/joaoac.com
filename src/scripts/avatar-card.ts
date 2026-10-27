import { RESTING_TILT, idleTilt, tiltFor, type Tilt } from '../lib/tilt.ts';
import { copyText } from '../lib/clipboard.ts';
import { CONTACT_EMAIL } from '../lib/site.ts';
import { find, prefersReducedMotion } from './dom.ts';

const COPY_FEEDBACK_MS = 2200;

function applyTilt(stage: HTMLElement, tilt: Tilt): void {
  stage.style.setProperty('--rotate-x', `${tilt.rotateX.toFixed(2)}deg`);
  stage.style.setProperty('--rotate-y', `${tilt.rotateY.toFixed(2)}deg`);
  stage.style.setProperty('--glare-x', `${tilt.glareX.toFixed(1)}%`);
  stage.style.setProperty('--glare-y', `${tilt.glareY.toFixed(1)}%`);
}

export function startAvatarCard(): void {
  const stage = find(document, '[data-avatar-card]', HTMLElement);
  if (!stage) return;
  const front = find(stage, '[data-avatar-flip]', HTMLButtonElement);
  const back = find(stage, '[data-avatar-back]', HTMLElement);
  const unflip = find(stage, '[data-avatar-unflip]', HTMLButtonElement);
  const copyEmailButton = find(stage, '[data-copy-email]', HTMLButtonElement);
  const copyEmailLabel = find(stage, '[data-email-copy-label]', HTMLElement);
  const emailFeedback = find(stage, '[data-email-feedback]', HTMLElement);
  const hint = find(document, '[data-avatar-hint]', HTMLElement);
  if (!front || !back || !unflip) return;

  let flipped = false;
  // Replaced below once we know motion is allowed; flipping must work either way.
  let onStateChange = () => {};

  const setFlipped = (nextFlipped: boolean) => {
    flipped = nextFlipped;
    stage.style.setProperty('--flip', flipped ? '180deg' : '0deg');
    front.setAttribute('aria-expanded', String(flipped));
    // Only the visible face is reachable by keyboard and screen readers.
    back.inert = !flipped;
    front.inert = flipped;
    if (hint) hint.textContent = (flipped ? hint.dataset.hintBack : hint.dataset.hintFront) ?? '';
    (flipped ? unflip : front).focus({ preventScroll: true });
    onStateChange();
  };

  front.addEventListener('click', () => {
    setFlipped(true);
  });
  unflip.addEventListener('click', () => {
    setFlipped(false);
  });

  if (copyEmailButton && copyEmailLabel && emailFeedback) {
    let feedbackTimer = 0;
    copyEmailButton.addEventListener('click', () => {
      void copyText(CONTACT_EMAIL, navigator.clipboard).then((copied) => {
        window.clearTimeout(feedbackTimer);
        const message = copied
          ? copyEmailButton.dataset.copiedLabel
          : copyEmailButton.dataset.failedLabel;
        copyEmailButton.dataset.state = copied ? 'copied' : 'failed';
        copyEmailLabel.textContent = message ?? '';
        emailFeedback.textContent = message ?? '';
        feedbackTimer = window.setTimeout(() => {
          delete copyEmailButton.dataset.state;
          copyEmailLabel.textContent = copyEmailButton.dataset.label ?? '';
          emailFeedback.textContent = '';
        }, COPY_FEEDBACK_MS);
      });
    });
  }

  if (prefersReducedMotion()) return;

  // Nobody touching the card: it drifts slowly with the same lean the hover gives. A hovering
  // pointer, a flipped card, a hidden tab or an off-screen card all stop the drift.
  const canHover = window.matchMedia('(hover: hover)').matches;
  let pointerInside = false;
  let onScreen = true;
  let idleFrame = 0;
  let pointerFrame = 0;

  const drift = (time: number) => {
    applyTilt(stage, idleTilt(time));
    idleFrame = window.requestAnimationFrame(drift);
  };

  const syncIdle = () => {
    window.cancelAnimationFrame(idleFrame);
    idleFrame = 0;
    if (pointerInside) return;
    if (flipped || !onScreen || document.hidden) {
      applyTilt(stage, RESTING_TILT);
      return;
    }
    idleFrame = window.requestAnimationFrame(drift);
  };
  onStateChange = syncIdle;

  new IntersectionObserver((entries) => {
    onScreen = entries.some((entry) => entry.isIntersecting);
    syncIdle();
  }).observe(stage);
  document.addEventListener('visibilitychange', syncIdle);

  // Touch screens have no hover, so they only get the drift.
  if (canHover) {
    stage.addEventListener('pointerenter', () => {
      pointerInside = true;
      syncIdle();
    });
    stage.addEventListener('pointermove', (event) => {
      window.cancelAnimationFrame(pointerFrame);
      pointerFrame = window.requestAnimationFrame(() => {
        applyTilt(stage, tiltFor(event.clientX, event.clientY, stage.getBoundingClientRect()));
      });
    });
    stage.addEventListener('pointerleave', () => {
      window.cancelAnimationFrame(pointerFrame);
      pointerInside = false;
      syncIdle();
    });
  }

  syncIdle();
}
