import { copyText } from '../lib/clipboard.ts';
import { CONTACT_EMAIL } from '../lib/site.ts';
import { find } from './dom.ts';

const COPY_FEEDBACK_MS = 2200;

export function startLinkContact(): void {
  const button = find(document, '[data-copy-email]', HTMLButtonElement);
  const label = find(document, '[data-email-copy-label]', HTMLElement);
  const feedback = find(document, '[data-email-feedback]', HTMLElement);
  if (!button || !label || !feedback) return;

  let timer = 0;
  button.addEventListener('click', () => {
    void copyText(CONTACT_EMAIL, navigator.clipboard).then((copied) => {
      window.clearTimeout(timer);
      const message = copied ? button.dataset.copiedLabel : button.dataset.failedLabel;
      button.dataset.state = copied ? 'copied' : 'failed';
      label.textContent = message ?? '';
      feedback.textContent = message ?? '';
      timer = window.setTimeout(() => {
        delete button.dataset.state;
        label.textContent = button.dataset.label ?? '';
        feedback.textContent = '';
      }, COPY_FEEDBACK_MS);
    });
  });
}
