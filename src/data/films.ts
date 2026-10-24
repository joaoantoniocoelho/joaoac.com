import type { Localized } from './projects.ts';

export type Film = {
  slug: string;
  title: Localized<string>;
  year: number;
};

export const favoriteFilms: Film[] = [
  {
    slug: 'no-country-for-old-men',
    title: { en: 'no country for old men', 'pt-BR': 'onde os fracos não têm vez' },
    year: 2007,
  },
  {
    slug: 'scarface',
    title: { en: 'scarface', 'pt-BR': 'scarface' },
    year: 1983,
  },
  {
    slug: 'a-series-of-unfortunate-events',
    title: { en: 'a series of unfortunate events', 'pt-BR': 'desventuras em série' },
    year: 2004,
  },
];
