export type Localized<T> = {
  en: T;
  'pt-BR': T;
};

export type ProjectStatus = 'live' | 'coming-soon';

export type Project = {
  slug: string;
  status: ProjectStatus;
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
    status: 'live',
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
  {
    slug: 'alturo',
    status: 'coming-soon',
    name: 'Alturo',
    url: 'https://usealturo.app',
    urlLabel: 'usealturo.app',
    oneLiner: {
      en: 'A reading companion for iPhone: focus sessions, a personal library, and a giraffe that evolves with the time you read.',
      'pt-BR': 'Um companheiro de leitura para iPhone: sessões de foco, biblioteca pessoal e uma girafa que evolui com o tempo que você lê.',
    },
    whatItDoes: {
      en: [
        'Timed reading sessions of 15 to 60 minutes, built to keep chosen apps out of the way.',
        'A library of physical books and ebooks, a notebook for excerpts and reflections, and a mascot with four stages.',
      ],
      'pt-BR': [
        'Sessões de leitura de 15 a 60 minutos, pensadas para deixar de lado os apps escolhidos.',
        'Biblioteca de livros físicos e ebooks, caderno de trechos e reflexões e um mascote com quatro estágios.',
      ],
    },
    decisions: {
      en: [
        'XP, stage, and streak are always derived from the sessions, never stored as counters.',
        'No backend and no account: data stays on the device and, later, in the user’s own iCloud.',
      ],
      'pt-BR': [
        'XP, estágio e sequência são sempre calculados a partir das sessões, nunca salvos como contador.',
        'Sem backend e sem conta: os dados ficam no aparelho e, depois, no iCloud do próprio usuário.',
      ],
    },
    stack: 'Swift · SwiftUI · SwiftData · Next.js · Cloudflare Workers · Resend',
  },
];
