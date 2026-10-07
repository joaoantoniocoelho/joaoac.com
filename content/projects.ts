export type Localized<T> = {
  en: T;
  'pt-BR': T;
};

export type Project = {
  slug: string;
  name: string;
  url: string;
  urlLabel: string;
  oneLiner: Localized<string>;
  whatItDoes: Localized<string[]>;
  decisions: Localized<string[]>;
  stack: string;
};

export const projects: Project[] = [
  {
    slug: 'tech-digest',
    name: 'Tech Digest',
    url: 'https://digest.joaoac.com',
    urlLabel: 'digest.joaoac.com',
    oneLiner: {
      en: 'A daily tech digest that monitors selected sources, classifies and ranks articles, removes duplicate stories, and emails up to eight links worth opening.',
      'pt-BR': 'Um digest diário de tecnologia que monitora fontes selecionadas, classifica e ranqueia artigos, remove histórias repetidas e envia por e-mail até oito links que valem a leitura.',
    },
    whatItDoes: {
      en: [
        'Jev classifies recent articles; deterministic Python scoring ranks them.',
        'Semantic deduplication, scheduled delivery, and one-click subscriptions.',
      ],
      'pt-BR': [
        'Jev classifica artigos recentes; uma pontuação determinística em Python define o ranking.',
        'Deduplicação semântica, entrega agendada e inscrição com um clique.',
      ],
    },
    decisions: {
      en: [
        'Jev identifies interests; deterministic weights decide the final ranking.',
        'Article text is processed temporarily while SQLite stores metadata and classification results.',
      ],
      'pt-BR': [
        'Jev identifica interesses; pesos determinísticos definem o ranking final.',
        'O texto dos artigos é processado temporariamente; o SQLite guarda metadados e resultados da classificação.',
      ],
    },
    stack: 'Python · Jev / TypeSafe · Railway · Resend',
  },
];
