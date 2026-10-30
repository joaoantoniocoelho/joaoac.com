import { normalizeEmail } from '../lib/waitlist.ts';

const MESSAGES = {
  loading: 'enviando…',
  subscribed: 'pronto! você está na lista. avisamos assim que o app chegar.',
  already: 'esse e-mail já está na lista. é só aguardar a novidade.',
  invalid: 'confira o e-mail: parece que falta alguma coisa.',
  error: 'não deu certo agora. tente de novo em instantes.',
} as const;

type State = keyof typeof MESSAGES;

function isResult(value: unknown): value is Exclude<State, 'loading'> {
  return typeof value === 'string' && value !== 'loading' && value in MESSAGES;
}

for (const form of document.querySelectorAll<HTMLFormElement>('[data-waitlist]')) {
  const input = form.querySelector<HTMLInputElement>('input[name="email"]');
  const site = form.querySelector<HTMLInputElement>('input[name="site"]');
  const submit = form.querySelector<HTMLButtonElement>('[data-wl-submit]');
  const msg = form.querySelector<HTMLElement>('[data-wl-msg]');

  const show = (state: State): void => {
    form.dataset.state = state;
    if (msg) msg.textContent = MESSAGES[state];
    if (submit) submit.disabled = state === 'loading';
    input?.setAttribute('aria-invalid', String(state === 'invalid'));
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = normalizeEmail(input?.value);
    if (!email) {
      show('invalid');
      input?.focus();
      return;
    }
    show('loading');
    fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, site: site?.value ?? '' }),
    })
      .then(async (res) => {
        const data: unknown = await res.json().catch(() => null);
        const status = data && typeof data === 'object' && 'status' in data ? data.status : null;
        const state: State = isResult(status) ? status : 'error';
        show(state);
        if ((state === 'subscribed' || state === 'already') && input) input.value = '';
      })
      .catch(() => {
        show('error');
      });
  });
}
