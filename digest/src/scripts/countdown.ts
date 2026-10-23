import { formatCountdown, secondsUntilNextEdition } from '../lib/countdown.ts';
import { find, findAll } from './dom.ts';

const TICK_MS = 1000;

export function startCountdown(): void {
  const timer = find(document, '[data-countdown]', HTMLElement);
  if (!timer) return;
  const units = findAll(timer, '[data-unit]', HTMLElement);

  const render = () => {
    const parts = formatCountdown(secondsUntilNextEdition(new Date()));
    for (const unit of units) {
      const key = unit.dataset.unit;
      if (key === 'hours' || key === 'minutes' || key === 'seconds') unit.textContent = parts[key];
    }
  };

  render();
  window.setInterval(render, TICK_MS);
}
