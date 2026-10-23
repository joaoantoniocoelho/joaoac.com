import { homePath } from '../lib/digest-routes.ts';
import { preferredLocale, unsubscribeOutcome, unsubscribeUrl } from '../lib/unsubscribe.ts';
import { find } from './dom.ts';
import { LOCALE_KEY } from './page.ts';

type State = 'confirm' | 'loading' | 'success' | 'invalid' | 'unavailable';

type Strings = {
  title: string;
  detail: string;
  confirm: string;
  confirming: string;
  success: string;
  invalid: string;
  unavailable: string;
  tryAgain: string;
  back: string;
};

function readStrings(raw: string | undefined, locale: string): Strings | null {
  if (!raw) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  const localized: unknown =
    typeof parsed === 'object' && parsed !== null ? Reflect.get(parsed, locale) : null;
  if (typeof localized !== 'object' || localized === null) return null;
  const read = (key: keyof Strings) => {
    const value: unknown = Reflect.get(localized, key);
    return typeof value === 'string' ? value : '';
  };
  return {
    title: read('title'),
    detail: read('detail'),
    confirm: read('confirm'),
    confirming: read('confirming'),
    success: read('success'),
    invalid: read('invalid'),
    unavailable: read('unavailable'),
    tryAgain: read('tryAgain'),
    back: read('back'),
  };
}

function savedLocale(): string | null {
  try {
    return localStorage.getItem(LOCALE_KEY);
  } catch {
    return null;
  }
}

export function startUnsubscribe(): void {
  const card = find(document, '[data-unsubscribe]', HTMLElement);
  if (!card) return;
  const title = find(card, '[data-text=title]', HTMLElement);
  const detail = find(card, '[data-text=detail]', HTMLElement);
  const back = find(card, '[data-text=back]', HTMLAnchorElement);
  const button = find(card, '[data-unsubscribe-confirm]', HTMLButtonElement);
  const locale = preferredLocale(savedLocale(), navigator.language);
  const strings = readStrings(card.dataset.strings, locale);
  const { api, token } = card.dataset;
  if (!title || !detail || !back || !button || !strings) return;

  document.documentElement.lang = locale;
  back.textContent = strings.back;
  back.href = homePath(locale);

  const render = (state: State) => {
    card.dataset.state = state;
    const headline: Record<State, string> = {
      confirm: strings.title,
      loading: strings.title,
      success: strings.success,
      invalid: strings.invalid,
      unavailable: strings.unavailable,
    };
    title.textContent = headline[state];
    detail.textContent = state === 'confirm' || state === 'loading' ? strings.detail : '';
    button.hidden = state === 'success' || state === 'invalid';
    button.disabled = state === 'loading';
    button.textContent =
      state === 'loading'
        ? strings.confirming
        : state === 'unavailable'
          ? strings.tryAgain
          : strings.confirm;
  };

  render(api && token ? 'confirm' : 'invalid');

  button.addEventListener('click', () => {
    if (!api || !token) return;
    render('loading');
    fetch(unsubscribeUrl(api, token), { method: 'POST' })
      .then((response) => {
        render(unsubscribeOutcome(response.status));
      })
      .catch(() => {
        render('unavailable');
      });
  });
}
