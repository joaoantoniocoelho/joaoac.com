import { acquisitionFields } from '../lib/acquisition.ts';
import { readEntryAttribution } from '../lib/entry-attribution.ts';
import {
  isValidEmail,
  shouldRetryWithoutAttribution,
  subscribeBody,
  subscribeOutcome,
  type SubscribeBody,
  type SubscribeOutcome,
} from '../lib/subscribe.ts';
import { find, findAll } from './dom.ts';

type Messages = Record<SubscribeOutcome | 'subscribing', string>;

function readMessages(raw: string | undefined): Messages | null {
  if (!raw) return null;
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof value !== 'object' || value === null) return null;
  const read = (key: string) => {
    const message: unknown = Reflect.get(value, key);
    return typeof message === 'string' ? message : '';
  };
  return {
    success: read('success'),
    invalid: read('invalid'),
    rate: read('rate'),
    unavailable: read('unavailable'),
    subscribing: read('subscribing'),
  };
}

async function postSubscribe(apiUrl: string, body: SubscribeBody): Promise<number> {
  const response = await fetch(`${apiUrl}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return response.status;
}

async function subscribe(apiUrl: string, email: string): Promise<SubscribeOutcome> {
  try {
    // Read at submit time so the page itself stays cacheable.
    const body = subscribeBody(
      email,
      acquisitionFields(window.location.href, readEntryAttribution()),
    );
    const status = await postSubscribe(apiUrl, body);
    const finalStatus = shouldRetryWithoutAttribution(status, body)
      ? await postSubscribe(apiUrl, { email })
      : status;
    return subscribeOutcome(finalStatus);
  } catch {
    return 'unavailable';
  }
}

function startForm(form: HTMLFormElement): void {
  const input = find(form, 'input[type=email]', HTMLInputElement);
  const button = find(form, 'button[type=submit]', HTMLButtonElement);
  const message = find(form, '.message', HTMLElement);
  const messages = readMessages(form.dataset.messages);
  const apiUrl = form.dataset.api;
  if (!input || !button || !message || !messages || !apiUrl) return;
  const idleLabel = button.textContent;

  const show = (outcome: SubscribeOutcome) => {
    message.dataset.kind = outcome === 'success' ? 'success' : 'error';
    message.textContent = messages[outcome];
    input.setAttribute('aria-invalid', String(outcome === 'invalid'));
  };

  input.addEventListener('input', () => {
    message.textContent = '';
    input.removeAttribute('aria-invalid');
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (button.disabled) return;
    const email = input.value.trim();
    if (!isValidEmail(email)) {
      show('invalid');
      return;
    }
    // readOnly instead of disabled keeps focus on the field, so a keyboard user can fix an error in place.
    input.readOnly = true;
    button.disabled = true;
    button.textContent = messages.subscribing;
    void subscribe(apiUrl, email).then((outcome) => {
      show(outcome);
      input.readOnly = false;
      button.disabled = false;
      button.textContent = idleLabel;
      if (outcome === 'success') input.value = '';
    });
  });
}

export function startSignupForms(): void {
  findAll(document, 'form[data-signup-form]', HTMLFormElement).forEach(startForm);
}
