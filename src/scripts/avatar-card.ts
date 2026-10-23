import { RESTING_TILT, tiltFor, type Tilt } from '../lib/tilt.ts';
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

  const setFlipped = (flipped: boolean) => {
    stage.style.setProperty('--flip', flipped ? '180deg' : '0deg');
    front.setAttribute('aria-expanded', String(flipped));
    // Only the visible face is reachable by keyboard and screen readers.
    back.inert = !flipped;
    front.inert = flipped;
    if (hint) hint.textContent = (flipped ? hint.dataset.hintBack : hint.dataset.hintFront) ?? '';
    (flipped ? unflip : front).focus({ preventScroll: true });
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

  // Tilting only makes sense with a hovering pointer; touch screens just flip.
  if (prefersReducedMotion() || !window.matchMedia('(hover: hover)').matches) return;

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
