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
  status: Localized<string>;
};

export const projects: Project[] = [
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
        'Cards are questions that force recall, not highlighted excerpts - the product bet against "just paste it into ChatGPT".',
        'AI-added content is always labeled so students can tell source material from complement.',
      ],
      'pt-BR': [
        'Cards são perguntas que exigem recuperar a informação, não trechos recortados - a aposta do produto contra o "joga no ChatGPT".',
        'Conteúdo adicionado pela IA é sempre rotulado para o estudante distinguir material original de complemento.',
      ],
    },
    stack: 'Next.js on Vercel · Node.js · MongoDB · Gemini · Redis · BullMQ',
    status: {
      en: 'In production · Portuguese · early stage',
      'pt-BR': 'Em produção · Português · fase inicial',
    },
  },
  {
    slug: 'ao-redor',
    name: 'Ao Redor',
    url: 'https://aoredor.com',
    urlLabel: 'aoredor.com',
    oneLiner: {
      en: 'Compares what surrounds short-term rentals and hotels before you book.',
      'pt-BR': 'Compara o entorno de hospedagens antes de você reservar.',
    },
    whatItDoes: {
      en: [
        'Side-by-side numbers for each address from OpenStreetMap: street commerce within 250/500 m, walkable street grid, distance to transit, parks and malls.',
        'Covers nine Brazilian cities; first analysis free, passwordless e-mail login, private reports with revocable share links.',
        'One-time payment for analysis packs, no subscription.',
      ],
      'pt-BR': [
        'Números lado a lado para cada endereço a partir do OpenStreetMap: comércio de rua a 250/500 m, malha caminhável, distância até transporte, praças e shoppings.',
        'Cobre nove cidades brasileiras; primeira análise grátis, login por código de e-mail, relatórios privados com link compartilhável revogável.',
        'Pagamento único por pacote de análises, sem assinatura.',
      ],
    },
    decisions: {
      en: [
        'Deliberately no "safety score": the product shows observable facts and distances and refuses to turn them into a single number.',
        'Reports warn when OSM coverage is thin instead of hiding data gaps.',
      ],
      'pt-BR': [
        'Sem "nota de segurança" de propósito: o produto mostra fatos e distâncias observáveis e se recusa a reduzi-los a um número.',
        'O relatório avisa quando a cobertura do OSM é baixa em vez de esconder a falta de dados.',
      ],
    },
    stack: 'Next.js on Vercel · Node.js · PostgreSQL · OpenStreetMap',
    status: {
      en: 'In production · Portuguese · early stage',
      'pt-BR': 'Em produção · Português · fase inicial',
    },
  },
];
