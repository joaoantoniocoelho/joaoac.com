import type { Localized } from './projects.ts';

export type ReadingStatus = 'reading' | 'next' | 'finished';

export type Book = {
  slug: string;
  title: Localized<string>;
  author: string;
  status: ReadingStatus;
  finishedIn?: number;
  note?: Localized<string>;
};

// Reading log, oldest first. Add new books at the end and move their status along as you read;
// the home shelf picks the current read, the next one in line and the latest finished from here.
// Covers are picked up from src/assets/books/<slug>.jpg (or .png/.webp); without one the shelf draws a plain cover.
export const readingLog: Book[] = [
  {
    slug: 'the-law',
    title: { en: 'the law', 'pt-BR': 'a lei' },
    author: 'frédéric bastiat',
    status: 'finished',
    finishedIn: 2026,
    note: {
      en: 'a book that made me think more about freedom, the role of the state, and what happens when the law serves particular interests.',
      'pt-BR':
        'um livro que me fez pensar mais sobre liberdade, o papel do estado e o que acontece quando a lei passa a servir a interesses particulares.',
    },
  },
  {
    slug: 'the-art-of-being-right',
    title: { en: 'the art of being right', 'pt-BR': 'a arte de ter razão' },
    author: 'arthur schopenhauer',
    status: 'reading',
  },
  {
    slug: 'second-treatise-of-government',
    title: {
      en: 'second treatise of government',
      'pt-BR': 'segundo tratado sobre o governo civil',
    },
    author: 'john locke',
    status: 'next',
  },
];
