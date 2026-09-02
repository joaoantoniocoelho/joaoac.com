export type PromptId =
  | 'now'
  | 'experience'
  | 'stack'
  | 'resume'
  | 'projects'
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
  | 'why-rabbit'
  | 'byte-secret'
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

export const initialPrompts: PromptId[] = ['now', 'experience', 'resume', 'why-rabbit'];

export const discoveryOrder: PromptId[] = [
  'stack',
  'projects',
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
    question: "What's he working on right now?",
    answer:
      'An internal AI engineering platform at ADP: agents that plan, implement, validate and review code changes across several LLM providers. His part is the architecture and how the agents collaborate without burning the model budget.',
    links: [{ label: 'View experience', href: '/experiences' }],
    next: ['experience', 'stack', 'resume', 'contact'],
  },
  experience: {
    question: 'Where has he worked?',
    answer:
      'ADP (AI platform and tax products for US freelancers), SAP (Ariba procurement, AI-powered recommendations) and Bazk, a payments gateway handling 400+ transactions a minute. The full timeline is one click away.',
    links: [{ label: 'View experience', href: '/experiences' }],
    next: ['now', 'work-style', 'resume', 'contact'],
  },
  stack: {
    question: 'What does he actually work with?',
    answer:
      'Mostly Node.js/TypeScript and Java/Spring Boot on AWS, with PostgreSQL and MongoDB underneath. React and Flutter when the problem reaches a screen. Lately, a lot of LLMs and agents.',
    next: ['now', 'tech-opinion', 'projects', 'learning-now'],
  },
  resume: {
    question: 'Can I get his resume?',
    answer: 'One page, no progress bars, no photo of anyone but me on this site. Here it is.',
    links: [{ label: 'Download resume', href: '/resume' }],
    next: ['experience', 'work-style', 'contact', 'projects'],
  },
  projects: {
    question: 'Has he built anything on his own?',
    answer:
      'Two products, both live and both early. Revisa Aí turns medical study PDFs into flashcards; Ao Redor compares what surrounds a rental before you book. He built every layer of each, which explains the tab count.',
    links: [{ label: 'See projects', href: '/projects' }],
    next: ['stack', 'random-fact', 'blog', 'contact'],
  },
  blog: {
    question: 'Does he write?',
    answer:
      'Yes: engineering, AI-assisted development and application security. Publishing cadence is a known issue. A fix is in progress.',
    links: [{ label: 'Read the blog', href: '/blog' }],
    next: ['learning-now', 'tech-opinion', 'projects', 'contact'],
  },
  'work-style': {
    question: "What's João like to work with?",
    answer:
      'He asks why until the problem is clear, then picks the simplest solution that will still make sense in six months. He fixes causes; silencing symptoms is not on the menu.',
    next: ['favorite-problems', 'when-stuck', 'ideal-project', 'resume'],
  },
  'favorite-problems': {
    question: 'What kind of problems does he enjoy?',
    answer:
      'The ambiguous kind: unclear edges, competing trade-offs, systems that need to scale, and enough room to improve both the architecture and the product.',
    next: ['work-style', 'ideal-project', 'now', 'experience'],
  },
  'when-stuck': {
    question: 'What does he do when he gets stuck?',
    answer:
      'Reduce the problem until only one assumption can be wrong, add visibility, read the internals, test again. If that fails, take a short break and come back with fewer opinions.',
    next: ['work-style', 'tech-opinion', 'favorite-problems', 'stack'],
  },
  'tech-opinion': {
    question: 'Does he have a tech opinion?',
    answer:
      'A clever abstraction is rarely worth it if the next person needs a map to understand it. Clear and boring ages better than impressive and mysterious.',
    next: ['when-stuck', 'stack', 'blog', 'site-secret'],
  },
  'learning-now': {
    question: "What's he learning right now?",
    answer:
      'Cybersecurity, ahead of an MBA at USP/Esalq starting in October 2026. Also whatever the agents broke this week; evaluating them properly turned out to be a deep hole.',
    next: ['now', 'blog', 'tech-opinion', 'experience'],
  },
  'away-from-keyboard': {
    question: 'What happens away from the keyboard?',
    answer:
      'Running, videogames, or time with his dogs. Debugging occasionally continues in the background anyway.',
    next: ['random-fact', 'not-on-site', 'site-secret', 'contact'],
  },
  'ideal-project': {
    question: "What's his ideal team?",
    answer:
      'People who care about quality without turning every decision into ceremony, a product worth shaping, and a real technical challenge underneath it. International teams are a plus; he has been in them for years.',
    next: ['favorite-problems', 'work-style', 'experience', 'contact'],
  },
  'not-on-site': {
    question: "Tell me something that isn't on the site.",
    answer:
      'He went from intern to Developer II in two years at his first fintech, and defended his thesis with the highest grade while shipping at ADP. He does not bring this up. I do.',
    next: ['experience', 'resume', 'random-fact', 'why-rabbit'],
  },
  'random-fact': {
    question: 'Give me a random João fact.',
    answer:
      'His definition of a quick experiment is optimistic. It usually has a domain name before it has a README.',
    next: ['projects', 'not-on-site', 'away-from-keyboard', 'byte-secret'],
  },
  'site-secret': {
    question: 'Is anything hidden on this site?',
    answer:
      'Press / or Cmd + K. João left a quick navigation panel there for people who test keyboard shortcuts before reading instructions.',
    next: ['why-rabbit', 'byte-secret', 'tech-opinion', 'contact'],
  },
  'why-rabbit': {
    question: 'Why are you a rabbit?',
    answer:
      "Because João's last name, Coelho, means rabbit in Portuguese. I am part guide, part surname joke, and the only one here allowed to have ears this dramatic.",
    next: ['byte-secret', 'not-on-site', 'site-secret', 'now'],
  },
  'byte-secret': {
    question: "What shouldn't Byte tell me?",
    answer: "The browser tab count. I've seen the number. My clearance level ends there.",
    next: ['random-fact', 'projects', 'site-secret', 'contact'],
  },
  contact: {
    question: 'How can I reach him?',
    answer:
      'Email is the most direct route, and he reads every message. Senior backend or AI engineering roles, questions about something he wrote, and genuinely hard problems get the fastest replies.',
    links: [
      { label: 'Send an email', action: 'reveal-email' },
      { label: 'Open LinkedIn', href: 'https://linkedin.com/in/joaoac', external: true },
    ],
    next: ['resume', 'experience', 'now', 'why-rabbit'],
  },
};

export const promptsPtBr: Record<PromptId, Prompt> = {
  now: {
    question: 'No que ele está trabalhando agora?',
    answer:
      'Numa plataforma interna de engenharia com IA na ADP: agentes que planejam, implementam, validam e revisam mudanças de código usando vários provedores de LLM. A parte dele é a arquitetura e como os agentes colaboram sem queimar o orçamento de modelos.',
    links: [{ label: 'Ver experiência', href: '/pt-BR/experiences' }],
    next: ['experience', 'stack', 'resume', 'contact'],
  },
  experience: {
    question: 'Onde ele já trabalhou?',
    answer:
      'ADP (plataforma de IA e produtos de impostos para freelancers nos EUA), SAP (Ariba, procurement e recomendações com IA) e Bazk, um gateway de pagamentos com mais de 400 transações por minuto. A linha do tempo completa está a um clique.',
    links: [{ label: 'Ver experiência', href: '/pt-BR/experiences' }],
    next: ['now', 'work-style', 'resume', 'contact'],
  },
  stack: {
    question: 'Com o que ele trabalha de verdade?',
    answer:
      'Principalmente Node.js/TypeScript e Java/Spring Boot na AWS, com PostgreSQL e MongoDB por baixo. React e Flutter quando o problema chega à tela. Ultimamente, muito LLM e agente.',
    next: ['now', 'tech-opinion', 'projects', 'learning-now'],
  },
  resume: {
    question: 'Posso ver o currículo dele?',
    answer: 'Uma página, sem barras de progresso e sem foto de ninguém além de mim neste site. Aqui está.',
    links: [{ label: 'Baixar currículo', href: '/resume' }],
    next: ['experience', 'work-style', 'contact', 'projects'],
  },
  projects: {
    question: 'Ele construiu algo por conta própria?',
    answer:
      'Dois produtos, ambos no ar e ambos no começo. O Revisa Aí transforma PDFs de Medicina em flashcards; o Ao Redor compara o entorno de uma hospedagem antes da reserva. Ele construiu todas as camadas dos dois, o que explica a quantidade de abas.',
    links: [{ label: 'Ver projetos', href: '/pt-BR/projects' }],
    next: ['stack', 'random-fact', 'blog', 'contact'],
  },
  blog: {
    question: 'Ele escreve?',
    answer:
      'Sim: engenharia, desenvolvimento assistido por IA e segurança de aplicações. A frequência de publicação é um problema conhecido. Uma correção está em andamento.',
    links: [{ label: 'Ler o blog', href: '/pt-BR/blog' }],
    next: ['learning-now', 'tech-opinion', 'projects', 'contact'],
  },
  'work-style': {
    question: 'Como é trabalhar com o João?',
    answer:
      'Ele pergunta "por quê?" até o problema ficar claro e então escolhe a solução mais simples que ainda fará sentido daqui a seis meses. Ele corrige causas; silenciar sintomas não está no cardápio.',
    next: ['favorite-problems', 'when-stuck', 'ideal-project', 'resume'],
  },
  'favorite-problems': {
    question: 'De que tipo de problema ele gosta?',
    answer:
      'Dos ambíguos: limites pouco claros, trade-offs em conflito, sistemas que precisam escalar e espaço suficiente para melhorar tanto a arquitetura quanto o produto.',
    next: ['work-style', 'ideal-project', 'now', 'experience'],
  },
  'when-stuck': {
    question: 'O que ele faz quando fica travado?',
    answer:
      'Reduz o problema até que só uma hipótese possa estar errada, adiciona visibilidade, lê os internos, testa de novo. Se não funcionar, faz uma pausa curta e volta com menos opiniões.',
    next: ['work-style', 'tech-opinion', 'favorite-problems', 'stack'],
  },
  'tech-opinion': {
    question: 'Ele tem alguma opinião sobre tecnologia?',
    answer:
      'Uma abstração inteligente raramente vale a pena se a próxima pessoa precisar de um mapa para entendê-la. O claro e sem graça envelhece melhor que o impressionante e misterioso.',
    next: ['when-stuck', 'stack', 'blog', 'site-secret'],
  },
  'learning-now': {
    question: 'O que ele está aprendendo agora?',
    answer:
      'Cibersegurança, antes de um MBA na USP/Esalq que começa em outubro de 2026. E o que os agentes quebraram esta semana; avaliá-los direito se revelou um buraco fundo.',
    next: ['now', 'blog', 'tech-opinion', 'experience'],
  },
  'away-from-keyboard': {
    question: 'O que acontece longe do teclado?',
    answer:
      'Corrida, videogames ou tempo com os cachorros. O debugging às vezes continua em segundo plano mesmo assim.',
    next: ['random-fact', 'not-on-site', 'site-secret', 'contact'],
  },
  'ideal-project': {
    question: 'Qual é o time ideal para ele?',
    answer:
      'Pessoas que se importam com qualidade sem transformar toda decisão em cerimônia, um produto que valha a pena moldar e um desafio técnico real por baixo. Times internacionais são um bônus; ele está neles há anos.',
    next: ['favorite-problems', 'work-style', 'experience', 'contact'],
  },
  'not-on-site': {
    question: 'Conte algo que não está no site.',
    answer:
      'Ele foi de estagiário a Developer II em dois anos na primeira fintech, e defendeu o TCC com nota máxima enquanto entregava na ADP. Ele não comenta isso. Eu comento.',
    next: ['experience', 'resume', 'random-fact', 'why-rabbit'],
  },
  'random-fact': {
    question: 'Conte uma curiosidade aleatória sobre o João.',
    answer:
      'A definição dele de experimento rápido é otimista. Normalmente tem domínio registrado antes de ter README.',
    next: ['projects', 'not-on-site', 'away-from-keyboard', 'byte-secret'],
  },
  'site-secret': {
    question: 'Existe algo escondido neste site?',
    answer:
      'Pressione / ou Cmd + K. O João deixou ali um painel de navegação rápida para quem testa atalhos de teclado antes de ler as instruções.',
    next: ['why-rabbit', 'byte-secret', 'tech-opinion', 'contact'],
  },
  'why-rabbit': {
    question: 'Por que você é um coelho?',
    answer:
      'Porque o sobrenome do João é Coelho. Sou parte guia, parte piada com o sobrenome e o único aqui autorizado a ter orelhas tão dramáticas.',
    next: ['byte-secret', 'not-on-site', 'site-secret', 'now'],
  },
  'byte-secret': {
    question: 'O que o Byte não deveria me contar?',
    answer: 'O número de abas do navegador. Eu vi o número. Meu nível de acesso termina aí.',
    next: ['random-fact', 'projects', 'site-secret', 'contact'],
  },
  contact: {
    question: 'Como posso falar com ele?',
    answer:
      'E-mail é o caminho mais direto, e ele lê todas as mensagens. Vagas sênior de backend ou engenharia de IA, perguntas sobre algo que ele escreveu e problemas difíceis de verdade recebem resposta mais rápido.',
    links: [
      { label: 'Enviar um e-mail', action: 'reveal-email' },
      { label: 'Abrir LinkedIn', href: 'https://linkedin.com/in/joaoac', external: true },
    ],
    next: ['resume', 'experience', 'now', 'why-rabbit'],
  },
};
