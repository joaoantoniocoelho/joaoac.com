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
  // Short line for the home page tiles; oneLiner carries the full pitch on the projects page.
  tagline: Localized<string>;
  oneLiner: Localized<string>;
  whatItDoes: Localized<string[]>;
  decisions: Localized<string[]>;
  stack: string;
};

export const projects: Project[] = [
  {
    slug: 'tech-digest',
    status: 'live',
    name: 'tech digest',
    url: 'https://digest.joaoac.com',
    urlLabel: 'digest.joaoac.com',
    tagline: {
      en: 'a short list of tech links, every day.',
      'pt-BR': 'uma seleção diária de links de tecnologia.',
    },
    oneLiner: {
      en: 'tech digest checks a set of sources each day, filters out repeated stories, and emails up to eight links worth opening.',
      'pt-BR':
        'todo dia, o tech digest procura textos em fontes selecionadas, tira as repetições e envia por e-mail até oito links que valem abrir.',
    },
    whatItDoes: {
      en: [
        'jev classifies new articles; a python score picks the ones to send.',
        'it groups repeated stories and sends the list at a set time each day.',
      ],
      'pt-BR': [
        'jev classifica os artigos; uma pontuação em python escolhe os destaques.',
        'agrupa notícias repetidas e envia a seleção no mesmo horário todos os dias.',
      ],
    },
    decisions: {
      en: [
        'jev helps identify what is relevant, but explicit weights decide the final order.',
        'article text is used only during analysis. sqlite keeps the metadata and classifications.',
      ],
      'pt-BR': [
        'jev ajuda a identificar o que interessa; pesos definidos em código decidem a ordem final.',
        'o texto dos artigos só é usado durante a análise. no sqlite ficam os metadados e as classificações.',
      ],
    },
    stack: 'python · jev / typesafe · railway · resend',
  },
  {
    slug: 'alturo',
    status: 'coming-soon',
    name: 'alturo',
    url: 'https://usealturo.app',
    urlLabel: 'usealturo.app',
    tagline: {
      en: 'a little more focus for your reading time.',
      'pt-BR': 'um pouco mais de foco na hora de ler.',
    },
    oneLiner: {
      en: 'alturo helps you make time to read on your iphone, keep track of your books, and watch a giraffe grow as you go.',
      'pt-BR':
        'no alturo, você reserva um tempo para ler, organiza seus livros e vê uma girafa crescer junto com o seu hábito de leitura.',
    },
    whatItDoes: {
      en: [
        'focused reading sessions help you put distractions aside and make more time for books.',
        'keep physical books and ebooks in one library, save notes, and follow the mascot through four stages.',
      ],
      'pt-BR': [
        'sessões de 15 a 60 minutos ajudam você a deixar de lado os apps que mais distraem.',
        'seus livros, trechos e anotações ficam no mesmo lugar. a girafa muda conforme você lê.',
      ],
    },
    decisions: {
      en: [
        'xp, stage, and reading streak are calculated from completed sessions rather than stored as counters.',
        'there is no account or backend. data stays on the device, with icloud sync planned for later.',
      ],
      'pt-BR': [
        'xp, estágio e dias seguidos de leitura são calculados a partir das sessões, sem contadores separados.',
        'não precisa criar conta. os dados ficam no aparelho; a sincronização pelo icloud está planejada para depois.',
      ],
    },
    stack: 'swift · swiftui · swiftdata · next.js · cloudflare workers · resend',
  },
];
