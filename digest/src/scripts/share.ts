import { copyText } from '../lib/clipboard.ts';
import { find } from './dom.ts';

const FEEDBACK_MS = 2000;

export function startShare(): void {
  const section = find(document, '[data-share]', HTMLElement);
  if (!section) return;
  const button = find(section, '[data-copy-url]', HTMLButtonElement);
  const message = find(section, '[data-share-message]', HTMLElement);
  const manual = find(section, '[data-share-manual]', HTMLInputElement);
  if (!button || !message || !manual) return;
  const idleLabel = button.textContent;
  let resetTimer = 0;

  button.addEventListener('click', () => {
    window.clearTimeout(resetTimer);
    void copyText(button.dataset.copyUrl ?? '', navigator.clipboard).then((copied) => {
      if (!copied) {
        // Without clipboard access the reader still gets the link, selected and ready to copy by hand.
        message.textContent = button.dataset.failed ?? '';
        manual.hidden = false;
        manual.select();
        return;
      }
      button.textContent = button.dataset.copied ?? idleLabel;
      resetTimer = window.setTimeout(() => {
        button.textContent = idleLabel;
      }, FEEDBACK_MS);
    });
  });
}
