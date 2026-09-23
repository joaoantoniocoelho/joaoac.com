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
  {
    slug: 'revisa-ai',
    name: 'Revisa Aí',
    url: 'https://revisaai.app',
    urlLabel: 'revisaai.app',
    oneLiner: {
      en: 'Turns medical study PDFs into flashcards ready for spaced repetition.',
      'pt-BR': 'Transforma PDFs de Medicina em flashcards prontos para repetição espaçada.',
    },
    whatItDoes: {
      en: [
        'Upload lecture notes, slides or summaries; the file is processed and discarded.',
        'Generates question-and-answer cards with clinical explanations, with three depth levels and an optional "beyond the PDF" mode that flags AI-added cards separately.',
        'Review in-app with spaced repetition or export to Anki (.apkg).',
      ],
      'pt-BR': [
        'Envie apostilas, slides ou resumos; o arquivo é processado e descartado.',
        'Gera cards de pergunta e resposta com explicação clínica, em três níveis de profundidade, com modo opcional "além do PDF" que marca separadamente os cards complementares.',
        'Revise no app com repetição espaçada ou exporte para o Anki (.apkg).',
      ],
    },
    decisions: {
      en: [
        'I chose question-and-answer cards to help students practice recall, rather than reread excerpts.',
        'AI-added content is always labeled so students can tell source material from complement.',
      ],
      'pt-BR': [
        'Escolhi cards de pergunta e resposta para exercitar a memória, em vez de apenas reler trechos do material.',
        'Conteúdo adicionado pela IA é sempre rotulado para o estudante distinguir material original de complemento.',
      ],
    },
    stack: 'Next.js on Vercel · Node.js · MongoDB · Gemini · Redis · BullMQ',
  },
];
