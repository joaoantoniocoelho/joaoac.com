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
      en: 'A concise email digest about software engineering and technology.',
      'pt-BR': 'Um resumo por e-mail, direto ao ponto, sobre engenharia de software e tecnologia.',
    },
    whatItDoes: {
      en: [
        'Brings selected technology reading into one email.',
        'Subscribe and unsubscribe with one click, without an account.',
      ],
      'pt-BR': [
        'Reúne leituras selecionadas sobre tecnologia em um e-mail.',
        'Inscrição e cancelamento em um clique, sem criar conta.',
      ],
    },
    decisions: {
      en: ['A small, focused subscription flow with a clear way to leave.'],
      'pt-BR': ['Um fluxo de inscrição simples, com cancelamento claro.'],
    },
    stack: 'Next.js on Vercel · API on Railway',
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
