import { copyText } from '../lib/clipboard.ts';
import { findAll } from './dom.ts';

const FEEDBACK_MS = 1600;

function flash(button: HTMLButtonElement, label: string | undefined): void {
  if (!label) return;
  const original = button.textContent;
  button.replaceChildren(label);
  window.setTimeout(() => {
    button.replaceChildren(original);
  }, FEEDBACK_MS);
}

// Code blocks copy their own text; share buttons copy the URL they carry.
export function startCopyButtons(): void {
  findAll(document, '[data-copy-code]', HTMLButtonElement).forEach((button) => {
    button.addEventListener('click', () => {
      const code = button.parentElement?.querySelector('pre')?.textContent ?? '';
      void copyText(code.replace(/\n$/, ''), navigator.clipboard).then((copied) => {
        if (copied) flash(button, button.dataset.copiedLabel);
      });
    });
  });

  findAll(document, '[data-copy-url]', HTMLButtonElement).forEach((button) => {
    button.addEventListener('click', () => {
      const url = button.dataset.copyUrl ?? window.location.href;
      void copyText(url, navigator.clipboard).then((copied) => {
        if (copied) flash(button, button.dataset.copiedLabel);
      });
    });
  });
}
