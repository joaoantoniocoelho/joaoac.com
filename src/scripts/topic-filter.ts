import { find, findAll } from './dom.ts';

const ALL = 'all';

export function startTopicFilter(): void {
  const group = find(document, '[data-topic-filters]', HTMLElement);
  if (!group) return;
  const buttons = findAll(group, 'button[data-topic]', HTMLButtonElement);
  const tiles = findAll(document, 'a[data-topic]', HTMLAnchorElement);

  const select = (topic: string) => {
    buttons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.topic === topic));
    });
    for (const tile of tiles) {
      tile.hidden = topic !== ALL && tile.dataset.topic !== topic;
    }
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      select(button.dataset.topic ?? ALL);
    });
  });
}
