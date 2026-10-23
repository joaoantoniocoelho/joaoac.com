export type PromptId =
  | 'now'
  | 'experience'
  | 'stack'
  | 'blog'
  | 'work-style'
  | 'favorite-problems'
  | 'when-stuck'
  | 'tech-opinion'
  | 'learning-now'
  | 'away-from-keyboard'
  | 'ideal-project'
  | 'not-on-site'
  | 'random-fact'
  | 'site-secret'
  | 'meet-ichiro'
  | 'ichiro-secret'
  | 'contact';

export type GuideLink = {
  label: string;
  href?: string;
  external?: boolean;
  action?: 'reveal-email' | 'copy-email';
};

export type Prompt = {
  question: string;
  answer: string;
  links?: GuideLink[];
  next: PromptId[];
};

export const initialPrompts: PromptId[] = ['now', 'experience', 'blog', 'meet-ichiro'];

export const discoveryOrder: PromptId[] = [
  'stack',
  'blog',
  'work-style',
  'favorite-problems',
  'when-stuck',
  'tech-opinion',
  'learning-now',
  'away-from-keyboard',
  'ideal-project',
  'not-on-site',
  'random-fact',
  'site-secret',
  'contact',
];

export const prompts: Record<PromptId, Prompt> = {
  now: {
    question: 'what is joão working on now?',
    answer:
      'at ADP, he works on an internal ai platform for software teams. the agents help plan, write, test, and review code. joão focuses on the architecture and on getting them to work together without wasting model calls.',
    links: [{ label: 'view experience', href: '/experiences' }],
    next: ['experience', 'stack', 'contact'],
  },
  experience: {
    question: 'where has he worked?',
    answer:
      'he is at ADP now. before that, he worked on procurement software at SAP and payment systems at Bazk. the about page has the longer version.',
    links: [{ label: 'view experience', href: '/experiences' }],
    next: ['now', 'work-style', 'contact'],
  },
  stack: {
    question: 'what does he work with?',
    answer:
      'mostly Node.js, TypeScript, Java, and Spring Boot on AWS. PostgreSQL and MongoDB show up often too. he has also worked with React and Flutter, and lately with ai agents.',
    next: ['now', 'tech-opinion', 'learning-now'],
  },
  blog: {
    question: 'does he write?',
    answer:
      'yes. he writes when he has something worth working through, usually about software, ai, or security.',
    links: [{ label: 'read the blog', href: '/blog' }],
    next: ['learning-now', 'tech-opinion', 'contact'],
  },
  'work-style': {
    question: "what's joão like to work with?",
    answer:
      'he asks a lot of questions up front. once the problem is clear, he would rather build the simple thing that works than add layers nobody needs.',
    next: ['favorite-problems', 'when-stuck', 'ideal-project'],
  },
  'favorite-problems': {
    question: 'what kind of problems does he like?',
    answer:
      'the ones that are still a bit messy: unclear requirements, awkward trade-offs, or a system that needs to grow without getting harder to use.',
    next: ['work-style', 'ideal-project', 'now', 'experience'],
  },
  'when-stuck': {
    question: 'what does he do when he gets stuck?',
    answer:
      'he makes the problem smaller, checks what he assumed, and tries to get better evidence. a short break helps too, though he tends to keep thinking about it.',
    next: ['work-style', 'tech-opinion', 'favorite-problems', 'stack'],
  },
  'tech-opinion': {
    question: 'any strong opinions about code?',
    answer:
      'if the next person needs a diagram to understand an abstraction, it might be making things worse. clear code is easier to live with.',
    next: ['when-stuck', 'stack', 'blog', 'site-secret'],
  },
  'learning-now': {
    question: "what's he learning right now?",
    answer:
      'cybersecurity and how to tell whether an ai agent is actually doing a good job. both give him plenty to study.',
    next: ['now', 'blog', 'tech-opinion', 'experience'],
  },
  'away-from-keyboard': {
    question: 'what happens away from the keyboard?',
    answer:
      'running, videogames, and time with us dogs. i make sure that last one gets enough attention.',
    next: ['random-fact', 'not-on-site', 'site-secret', 'contact'],
  },
  'ideal-project': {
    question: 'what kind of team suits him?',
    answer:
      'a team that cares about the product, talks openly about trade-offs, and leaves room to solve hard technical problems. he has enjoyed working with people across countries, too.',
    next: ['favorite-problems', 'work-style', 'experience', 'contact'],
  },
  'not-on-site': {
    question: 'tell me something that is not on the site.',
    answer:
      'he went from intern to developer II in two years at Bazk. his university thesis also got the highest grade. he rarely brings either up, so i will.',
    next: ['experience', 'random-fact', 'meet-ichiro'],
  },
  'random-fact': {
    question: 'a random joão fact?',
    answer: 'his idea of a quick experiment tends to acquire a domain name before it has a README.',
    next: ['not-on-site', 'away-from-keyboard', 'ichiro-secret'],
  },
  'site-secret': {
    question: 'anything hidden on this site?',
    answer: 'click the pixel portrait on the home page. the card flips over.',
    next: ['meet-ichiro', 'ichiro-secret', 'tech-opinion', 'contact'],
  },
  'meet-ichiro': {
    question: 'and who are you?',
    answer:
      "i'm ichiro, joão's shiba inu. i keep an eye on the house and, now, this site. the pixel version of me is quieter. the toy monkey comes everywhere.",
    next: ['ichiro-secret', 'not-on-site', 'site-secret', 'now'],
  },
  'ichiro-secret': {
    question: 'what is ichiro not supposed to tell me?',
    answer: "how many browser tabs joão has open. i have seen the number. let's leave it there.",
    next: ['random-fact', 'site-secret', 'contact'],
  },
  contact: {
    question: 'how can i contact him?',
    answer:
      'email works best. you can ask about his work, the posts, or something you would like to build together.',
    links: [
      { label: 'send an email', action: 'reveal-email' },
      { label: 'open linkedin', href: 'https://linkedin.com/in/joaoac', external: true },
    ],
    next: ['experience', 'now', 'meet-ichiro'],
  },
};

export const promptsPtBr: Record<PromptId, Prompt> = {
  now: {
    question: 'no que o joão trabalha hoje?',
    answer:
      'na ADP, ele trabalha numa plataforma interna de ia para times de software. os agentes ajudam a planejar, escrever, testar e revisar código. o joão cuida da arquitetura e de como eles trabalham juntos sem gastar chamadas de modelo à toa.',
    links: [{ label: 'ver experiência', href: '/pt-BR/experiences' }],
    next: ['experience', 'stack', 'contact'],
  },
  experience: {
    question: 'onde ele já trabalhou?',
    answer:
      'hoje ele está na ADP. antes, trabalhou com software para compras na SAP e com pagamentos na Bazk. a página sobre conta essa história com mais calma.',
    links: [{ label: 'ver experiência', href: '/pt-BR/experiences' }],
    next: ['now', 'work-style', 'contact'],
  },
  stack: {
    question: 'quais tecnologias ele usa?',
    answer:
      'principalmente Node.js, TypeScript, Java e Spring Boot na AWS. PostgreSQL e MongoDB também aparecem bastante. já trabalhou com React e Flutter e, mais recentemente, com agentes de ia.',
    next: ['now', 'tech-opinion', 'learning-now'],
  },
  blog: {
    question: 'ele escreve?',
    answer:
      'escreve quando tem algo que vale organizar em texto, geralmente sobre software, ia ou segurança.',
    links: [{ label: 'ler o blog', href: '/pt-BR/blog' }],
    next: ['learning-now', 'tech-opinion', 'contact'],
  },
  'work-style': {
    question: 'como é trabalhar com o joão?',
    answer:
      'ele faz bastante pergunta no começo. quando entende o problema, prefere construir a solução mais simples que funcione, sem camadas que ninguém precisa.',
    next: ['favorite-problems', 'when-stuck', 'ideal-project'],
  },
  'favorite-problems': {
    question: 'que tipo de problema ele gosta de resolver?',
    answer:
      'os que ainda estão meio bagunçados: requisitos pouco claros, escolhas difíceis ou um sistema que precisa crescer sem ficar cada vez mais complicado.',
    next: ['work-style', 'ideal-project', 'now', 'experience'],
  },
  'when-stuck': {
    question: 'o que ele faz quando fica travado?',
    answer:
      'tenta diminuir o problema, conferir as hipóteses e juntar mais evidências. uma pausa curta também ajuda, embora ele continue pensando no assunto.',
    next: ['work-style', 'tech-opinion', 'favorite-problems', 'stack'],
  },
  'tech-opinion': {
    question: 'alguma opinião forte sobre código?',
    answer:
      'se a próxima pessoa precisa de um diagrama para entender uma abstração, talvez ela esteja atrapalhando. código claro dá menos trabalho para todo mundo.',
    next: ['when-stuck', 'stack', 'blog', 'site-secret'],
  },
  'learning-now': {
    question: 'o que ele está aprendendo agora?',
    answer:
      'cibersegurança e como saber se um agente de ia está mesmo fazendo um bom trabalho. os dois assuntos ainda rendem bastante estudo.',
    next: ['now', 'blog', 'tech-opinion', 'experience'],
  },
  'away-from-keyboard': {
    question: 'o que acontece longe do teclado?',
    answer:
      'corrida, videogame e tempo com a gente, os cachorros. eu me certifico de que essa última parte não falte.',
    next: ['random-fact', 'not-on-site', 'site-secret', 'contact'],
  },
  'ideal-project': {
    question: 'em que tipo de time ele gosta de trabalhar?',
    answer:
      'num time que se importa com o produto, conversa abertamente sobre as escolhas e tem espaço para resolver problemas técnicos difíceis. ele também gosta de trabalhar com gente de outros países.',
    next: ['favorite-problems', 'work-style', 'experience', 'contact'],
  },
  'not-on-site': {
    question: 'me conta algo que não está no site.',
    answer:
      'na Bazk, ele foi de estagiário a desenvolvedor II em dois anos. o TCC dele também recebeu nota máxima. ele quase nunca fala disso, então falo eu.',
    next: ['experience', 'random-fact', 'meet-ichiro'],
  },
  'random-fact': {
    question: 'uma curiosidade sobre o joão?',
    answer: 'um experimento rápido do joão costuma ganhar domínio antes de ganhar README.',
    next: ['not-on-site', 'away-from-keyboard', 'ichiro-secret'],
  },
  'site-secret': {
    question: 'tem algo escondido neste site?',
    answer: 'clique no retrato em pixels na página inicial. o card vira.',
    next: ['meet-ichiro', 'ichiro-secret', 'tech-opinion', 'contact'],
  },
  'meet-ichiro': {
    question: 'e você, quem é?',
    answer:
      'sou o ichiro, o shiba inu do joão. fico de olho na casa e agora neste site também. minha versão em pixels é mais quieta. o macaquinho de brinquedo me acompanha em todo lugar.',
    next: ['ichiro-secret', 'not-on-site', 'site-secret', 'now'],
  },
  'ichiro-secret': {
    question: 'o que você não deveria me contar?',
    answer:
      'quantas abas o joão deixa abertas no navegador. eu já vi o número. melhor parar por aqui.',
    next: ['random-fact', 'site-secret', 'contact'],
  },
  contact: {
    question: 'como posso falar com ele?',
    answer:
      'por e-mail. pode perguntar sobre o trabalho dele, algum texto ou uma ideia que vocês possam construir juntos.',
    links: [
      { label: 'enviar um e-mail', action: 'reveal-email' },
      { label: 'abrir linkedin', href: 'https://linkedin.com/in/joaoac', external: true },
    ],
    next: ['experience', 'now', 'meet-ichiro'],
  },
};
