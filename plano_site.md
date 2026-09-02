# Plano de implementação - joaoac.com

Site pessoal e profissional com blog. Sem freelance, sem foto, sem gráficos de skill.

**Premissas técnicas:** Next.js App Router na Vercel, bilíngue (EN em `/`, PT-BR em `/pt-BR`), tema escuro, mascote "Byte", command menu.

**Objetivo em uma frase:** quem abrir o site entende em 30 segundos que você é engenheiro sênior de backend/cloud/IA, encontra o currículo em um clique, vê dois produtos que você levou do zero à produção e percebe que você escreve sobre o que faz.

**Decisões já tomadas**

| Tema | Decisão |
|---|---|
| Posicionamento | Site profissional + blog. Nenhuma menção a freelance, landing pages ou "digital experiences". |
| Blog | Continua no Medium por enquanto. O site mostra uma lista curada (dados locais, sem parsing de RSS). Infra MDX fica como fase opcional futura. |
| Projetos | Revisa Aí e Ao Redor entram como "Side projects", com status honesto ("in production, early stage"). Sem números de usuários. |
| SAP | Sem caso concreto agora; parágrafo atual permanece, highlights entram. |
| MBA | Cybersecurity, USP/Esalq, início outubro 2026, 18 meses. |
| Datas | ADP: março 2025 – presente. SAP: fevereiro 2024 – março 2025. |
| Host canônico | `www.joaoac.com`. |
| Idioma dos posts | EN (como já está no Medium). UI do site continua bilíngue. |

---

## O que ainda depende de você (fora do código)

Itens além dos que você já respondeu. Nenhum bloqueia as fases 1 e 2.

1. **Stack dos dois projetos.** Só sei que o front é Next.js na Vercel. Para os cards de `/projects` preciso confirmar: backend/linguagem, banco, provedor de LLM (Revisa Aí), pipeline de dados OSM/Overpass (Ao Redor), pagamentos (Ao Redor cobra R$ 7,90/12,90), auth por código de e-mail, hospedagem do backend. Marcado como `[CONFIRMAR]` nas copies.
2. **PDF do currículo.** Compilar o LaTeX (`joao_coelho_resume.tex`, salvo junto deste plano) e colocar em `public/joao-coelho-resume.pdf`.
3. **OG image** regenerada em 1200×630 com o novo título.
4. **Google Search Console.** Verificar o domínio e enviar o sitemap depois da Fase 2. Sem isso você não sabe se o blog é indexado.
5. **Analytics.** Escolher uma opção sem cookies (Vercel Analytics, Plausible ou Umami). Necessário para saber se os posts são lidos; hoje não há como medir.
6. **Medium.** Quando voltar a escrever, decidir a ordem de publicação: (a) Medium primeiro e o site linka (status atual, zero esforço) ou (b) site primeiro e importa no Medium com canonical para o site (exige a fase opcional de MDX). Recomendo (b) a partir do primeiro post novo; até lá, (a).
7. **Política da ADP sobre projetos paralelos.** Os produtos já são públicos, então o risco é baixo, mas vale ler a cláusula de atividade externa/propriedade intelectual antes de dar destaque a eles no site e no LinkedIn.
8. **LinkedIn, GitHub, Medium, X** (Fase 6): você executa, o plano diz o quê.
9. **Currículo - opcional.** O bloco da Pling (estágio de 6 meses em 2018) poderia ceder lugar a uma seção "Side Projects" com Revisa Aí e Ao Redor. Para vaga sênior isso sinaliza mais do que um trainee de 2018. Decisão sua; o `.tex` está preparado para a troca ser de três linhas.

---

## Fase 1 - Posicionamento, copy e metadata

Um PR. Muda a primeira impressão e não depende de conteúdo novo.

### 1.1 Metadata global

Arquivo: `app/layout.tsx` (ou layout por locale).

```ts
export const metadata: Metadata = {
  metadataBase: new URL("https://www.joaoac.com"),
  title: {
    default: "João Coelho | Senior Software Engineer - Backend, Cloud & AI",
    template: "%s | João Coelho",
  },
  description:
    "Senior software engineer at ADP writing about backend systems, cloud infrastructure and AI-powered developer tooling. Previously SAP and fintech.",
  authors: [{ name: "João Antonio Stoll Coelho", url: "https://www.joaoac.com" }],
  alternates: {
    canonical: "/",
    languages: { "en-US": "/", "pt-BR": "/pt-BR", "x-default": "/" },
  },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: "João Coelho",
    locale: "en_US",
    alternateLocale: ["pt_BR"],
    title: "João Coelho | Senior Software Engineer",
    description: "Backend systems, cloud infrastructure and AI-powered developer tooling.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "João Coelho - Senior Software Engineer" }],
  },
  twitter: { card: "summary_large_image", creator: "@joaoac_dev" },
};
```

- Remover `keywords`.
- `twitter:creator` hoje é `@joaoac`; o perfil linkado no footer é `@joaoac_dev`. Alinhar.
- PT-BR: `title.default` = "João Coelho | Engenheiro de Software Sênior - Backend, Cloud e IA"; `description` = "Engenheiro de software sênior na ADP escrevendo sobre sistemas backend, infraestrutura em nuvem e ferramentas de desenvolvimento com IA. Antes, SAP e fintech."; `openGraph.locale` = `pt_BR`; `<html lang="pt-BR">`.
- Por página: `/experiences` → title "Experience", description "The teams, products, technical decisions, and lessons behind João Coelho's software engineering career." (já existe, manter). `/projects` → "Projects", "Products João Coelho built end to end, from idea to production." `/blog` → "Writing", "Notes on backend engineering, AI-assisted development and application security."

### 1.2 Host canônico

- `www.joaoac.com` em `metadataBase`, canonical, sitemap, JSON-LD e feed.
- Apex já redireciona 307 para `www`. Trocar para 308 (permanente) na configuração de domínios da Vercel.

### 1.3 Hero

**EN**
- Eyebrow: `Senior Software Engineer · Porto Alegre, Brazil`
- H1: `João Coelho.` (manter animação; ver Fase 5 para `prefers-reduced-motion`)
- Sub-headline: `I build backend systems, cloud infrastructure and AI tooling - and write about what I learn along the way.`
- CTA primário: `Read the writing` → `/#writing` (ou `/blog` quando existir)
- CTA secundário: `Download resume` → `/resume`

**PT-BR**
- Eyebrow: `Engenheiro de Software Sênior · Porto Alegre, Brasil`
- H1: `João Coelho.`
- Sub-headline: `Construo sistemas backend, infraestrutura em nuvem e ferramentas de IA - e escrevo sobre o que aprendo no caminho.`
- CTA primário: `Ler os textos`
- CTA secundário: `Baixar currículo`

### 1.4 About

Manter o texto atual (é o melhor trecho do site) com duas alterações:

**EN** - substituir a frase do MBA por:
`I'm also starting an MBA in Cybersecurity at USP/Esalq in October 2026, so that's becoming a bigger part of what I'm studying and thinking about.`

**PT-BR**:
`Também começo em outubro de 2026 um MBA em Cibersegurança na USP/Esalq, então esse tema tem ocupado uma parte cada vez maior dos meus estudos.`

Remover qualquer menção a landing pages. Blocos "I work with / Things I care about / Exploring lately" permanecem; em "Exploring lately", trocar `RAG` por `Agent evaluation` se você estiver de fato trabalhando nisso, ou manter. Sem inventar.

### 1.5 Contato

**EN**
- Heading: `Let's make it worth remembering.` (manter)
- Body: `Hiring for a senior engineering role, want to talk about something I wrote, or have a hard problem you can't stop thinking about? I read every message.`
- CTAs: `Send me an email` · `Copy email`
- Status: `Available to talk` (manter; não usar "available for hire")
- Elsewhere: LinkedIn · GitHub · Medium · X

**PT-BR**
- Heading: `Vamos fazer valer a lembrança.` (ou manter a tradução atual se preferir)
- Body: `Contratando para uma vaga sênior de engenharia, quer conversar sobre algo que escrevi ou tem um problema difícil que não sai da cabeça? Eu leio todas as mensagens.`
- CTAs: `Me envie um e-mail` · `Copiar e-mail`
- Status: `Disponível para conversar`

### 1.6 Footer

`© 2026 João Coelho. Built with curiosity and a lot of debugging.` (manter). Adicionar link `Resume` e `RSS` (quando existir).

### 1.7 Datas e títulos

- Home e `/experiences`, EN e PT-BR: ADP `March 2025 – Present` / `Março de 2025 – Presente`; SAP `February 2024 – March 2025` / `Fevereiro de 2024 – Março de 2025`.
- Título SAP: `Development Consultant` (igual ao currículo).

### 1.8 Resume

- `public/joao-coelho-resume.pdf`.
- `app/resume/route.ts` com `redirect("/joao-coelho-resume.pdf", 308)` - URL curta e estável para LinkedIn e e-mails.
- Link no hero, menu, command menu e footer.

### 1.9 Página 404

**EN**: heading `This page doesn't exist.` body `The writing does.` links para `/`, `/#writing`, `/experiences`.
**PT-BR**: `Esta página não existe.` / `Os textos existem.`

**Aceite:** `<title>` novo; canonical = URL final; `/resume` entrega `application/pdf`; `grep -i "landing page\|digital experiences"` no HTML das quatro rotas retorna vazio.

---

## Fase 2 - SEO técnico e dados estruturados

Um PR.

### 2.1 `app/robots.ts`

```ts
import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://www.joaoac.com/sitemap.xml",
    host: "https://www.joaoac.com",
  };
}
```

### 2.2 `app/sitemap.ts`

```ts
import type { MetadataRoute } from "next";
const base = "https://www.joaoac.com";
const routes = ["", "/experiences", "/projects"];
export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({
    url: `${base}${r}`,
    lastModified: SITE_LAST_UPDATED, // constante atualizada em deploys de conteúdo, não new Date()
    alternates: { languages: { "en-US": `${base}${r}`, "pt-BR": `${base}/pt-BR${r}`, "x-default": `${base}${r}` } },
  }));
}
```

Quando o blog for MDX (fase opcional), adicionar uma entrada por post.

### 2.3 JSON-LD

No layout raiz, um `<script type="application/ld+json">`:

```ts
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://www.joaoac.com/#person",
      name: "João Antonio Stoll Coelho",
      alternateName: "João Coelho",
      jobTitle: "Senior Software Engineer",
      worksFor: { "@type": "Organization", name: "ADP" },
      url: "https://www.joaoac.com",
      sameAs: [
        "https://linkedin.com/in/joaoac",
        "https://github.com/joaoantoniocoelho",
        "https://medium.com/@joaoac",
        "https://x.com/joaoac_dev",
      ],
      knowsAbout: ["Backend Engineering", "Distributed Systems", "AWS", "Node.js", "TypeScript", "Java", "Spring Boot", "AI Agents", "LLM Integration"],
      alumniOf: { "@type": "CollegeOrUniversity", name: "PUCRS" },
      address: { "@type": "PostalAddress", addressLocality: "Porto Alegre", addressRegion: "RS", addressCountry: "BR" },
    },
    {
      "@type": "WebSite",
      "@id": "https://www.joaoac.com/#website",
      url: "https://www.joaoac.com",
      name: "João Coelho",
      author: { "@id": "https://www.joaoac.com/#person" },
      inLanguage: ["en-US", "pt-BR"],
    },
  ],
};
```

### 2.4 Imagens

- Capas de post: `alt={post.title}`.
- Mascote e decorativos: `alt=""` + `aria-hidden="true"`.

**Aceite:** `/robots.txt` e `/sitemap.xml` 200; Rich Results Test valida `Person`; `hreflang` inclui `x-default`; Search Console com sitemap enviado.

---

## Fase 3 - Writing (lista curada, Medium como origem)

Um PR. Remove a dependência do RSS e os previews quebrados.

### 3.1 Fonte de dados

`content/posts.ts` - lista manual, sem parsing de RSS:

```ts
export type Post = {
  slug: string;          // usado como key e, no futuro, como rota
  title: string;
  description: string;   // escrita à mão, ~140 caracteres
  date: string;          // ISO
  url: string;           // Medium, sem parâmetros de tracking
  tags: string[];
  lang: "en";
};
```

### 3.2 Conteúdo inicial

```ts
export const posts: Post[] = [
  {
    slug: "this-breach-was-preventable",
    title: "This Breach Was Preventable (and Probably in Your Code Too)",
    description: "A public IDOR incident, why this class of bug is so common, and how to keep it out of your own APIs.",
    date: "2025-09-09",
    url: "https://joaoac.medium.com/this-breach-was-preventable-and-probably-in-your-code-too-6a4045f44bed",
    tags: ["security", "apis"],
    lang: "en",
  },
  {
    slug: "coding-in-the-age-of-ai",
    title: "Coding in the Age of AI: Why \"Knowing Code\" Is No Longer Enough",
    description: "What AI-assisted development changes for engineers, why the bar is rising, and which skills still hold value.",
    date: "2025-03-27",
    url: "https://joaoac.medium.com/coding-in-the-age-of-ai-why-knowing-code-is-no-longer-enough-6d9a687c88d5",
    tags: ["ai", "career"],
    lang: "en",
  },
  {
    slug: "the-art-of-clean-code",
    title: "The Art of Clean Code: Principles That You Should Follow",
    description: "Five clean code principles, with examples, to make code easier to read, change and review.",
    date: "2024-01-24",
    url: "https://joaoac.medium.com/the-art-of-clean-code-principles-that-you-should-follow-a43016bd8ccb",
    tags: ["engineering"],
    lang: "en",
  },
];
```

### 3.3 Seção na home

**EN**
- Eyebrow: `03 · Writing`
- Heading: `Things I've been writing about.`
- Sub: `Notes on backend engineering, AI-assisted development and application security. More on the way.`
- Card: título, description, data em texto secundário, tags. Sem thumbnail (as capas do Medium são genéricas e forçam layout).
- Link final: `All posts on Medium →`

**PT-BR**
- `03 · Textos` / `Sobre o que tenho escrito.` / `Notas sobre engenharia backend, desenvolvimento assistido por IA e segurança de aplicações. Mais em breve.` / `Todos os textos no Medium →`

- Remover "Field notes", contadores "0 1 / 0 2", label "Signal", thumbnails e o fetch de RSS.
- Cards linkam para o Medium com `rel="noopener"`, sem `?source=rss…`.

### 3.4 Fase opcional futura - blog no domínio (MDX)

Ativar quando você decidir publicar site-primeiro (item 6 da lista de pendências).

- `content/posts/<slug>/index.mdx` com frontmatter (`title`, `description`, `date`, `updated`, `tags`, `canonical?`, `draft`), validado com zod em `lib/posts.ts`.
- `@next/mdx` ou `next-mdx-remote` + `rehype-pretty-code` + `remark-gfm`.
- Rotas `/blog` e `/blog/[slug]`; `app/feed.xml/route.ts`; `opengraph-image.tsx` por post com `next/og`; `BlogPosting` em JSON-LD.
- Posts antigos importados com `canonical` para o Medium; novos com canonical no site e "import story" no Medium.
- Tipografia de leitura: ~68ch, line-height 1.65, contraste AA no escuro; code blocks com nome de arquivo e botão copiar.
- Fluxo: branch → PR com preview → merge publica; `draft: true` fora do build de produção.

---

## Fase 4 - Experiência e projetos

### 4.1 Highlights por cargo

Adicionar `highlights: string[]` ao modelo de experiência. Renderizar 2–3 bullets acima do parágrafo em `/experiences` e no card da home (substitui o texto truncado com "…").

**ADP - EN**
- `Core engineer on ADP's internal AI Factory: multi-agent orchestration that plans, executes, validates and reviews code changes across multiple LLM providers.`
- `Engineering work previously scoped at several weeks delivered in about one week, with quality and model cost under control.`
- `Before that, one of the main engineers on ADP MyTax (React, Node.js, AWS): bank integrations and automated IRS payments for US freelancers, plus the architecture of the new Flutter mobile app replacing the web platform.`

**ADP - PT-BR**
- `Engenheiro central no AI Factory interno da ADP: orquestração multiagente que planeja, executa, valida e revisa mudanças de código usando múltiplos provedores de LLM.`
- `Trabalho de engenharia antes estimado em várias semanas entregue em cerca de uma, com qualidade e custo de modelos sob controle.`
- `Antes disso, um dos principais engenheiros do ADP MyTax (React, Node.js, AWS): integrações bancárias e pagamentos automatizados ao IRS para freelancers nos EUA, além da arquitetura do novo app mobile em Flutter que substituirá a plataforma web.`

**SAP - EN**
- `AI-powered category strategy recommendations for SAP Ariba Category Management, adopted by customers in automotive, aviation and technology.`
- `Backend on Java, Spring Boot, Node.js and SAP CAP over SAP BTP, with complex business rules and multi-system integrations.`
- `Architecture decisions and code reviews in a global team; supported other developers through hard technical problems.`

**SAP - PT-BR**
- `Recomendações de estratégia de categoria com IA no SAP Ariba Category Management, adotadas por clientes dos setores automotivo, de aviação e de tecnologia.`
- `Backend em Java, Spring Boot, Node.js e SAP CAP sobre SAP BTP, com regras de negócio complexas e integrações entre múltiplos sistemas.`
- `Decisões de arquitetura e code review em time global; apoio a outros desenvolvedores em problemas técnicos difíceis.`

**Bazk - EN**
- `Payment and compliance systems processing 400+ transactions per minute for international gaming platforms.`
- `Designed and built the compliance rules engine (Node.js) that automated fraud and regulatory checks.`
- `Promoted twice in two years: intern → developer I → developer II.`

**Bazk - PT-BR**
- `Sistemas de pagamento e compliance processando mais de 400 transações por minuto para plataformas internacionais de gaming.`
- `Projetei e construí o rules engine de compliance (Node.js) que automatizou checagens de fraude e regulatórias.`
- `Duas promoções em dois anos: estagiário → desenvolvedor I → desenvolvedor II.`

**Pling - EN**
- `Built Universos, a web-scraping news aggregator, end to end with a small team (Node.js, MongoDB, React).`

**Pling - PT-BR**
- `Construí o Universos, agregador de notícias baseado em web scraping, de ponta a ponta com um time pequeno (Node.js, MongoDB, React).`

### 4.2 Parágrafo da SAP

Permanece como está por decisão sua. Deixar um `TODO` no arquivo de conteúdo para quando houver um caso concreto.

### 4.3 `/projects` - Side projects

Nova rota + seção resumida na home (entre Experience e Writing). Título e framing evitam prometer tração.

**EN**
- Eyebrow: `Side projects`
- Heading: `Things I've built from scratch.`
- Sub: `Products I took from idea to production on my own - architecture, AI pipelines, data, UI and everything in between. Both are live, both are early.`

**PT-BR**
- Eyebrow: `Projetos pessoais`
- Heading: `Coisas que construí do zero.`
- Sub: `Produtos que levei da ideia à produção sozinho - arquitetura, pipelines de IA, dados, interface e tudo no meio. Ambos estão no ar, ambos estão no começo.`

Modelo do card: nome, uma frase, "what it does" (2–3 bullets), "what I learned / decisions" (2 bullets), stack, status, link.

**Revisa Aí - EN**
- One-liner: `Turns medical study PDFs into flashcards ready for spaced repetition.`
- What it does:
  - `Upload lecture notes, slides or summaries; the file is processed and discarded.`
  - `Generates question-and-answer cards with clinical explanations, with three depth levels and an optional "beyond the PDF" mode that flags AI-added cards separately.`
  - `Review in-app with spaced repetition or export to Anki (.apkg).`
- Decisions:
  - `Cards are questions that force recall, not highlighted excerpts - the product bet against "just paste it into ChatGPT".`
  - `AI-added content is always labeled so students can tell source material from complement.`
- Stack: `Next.js on Vercel · [CONFIRMAR: backend, banco, provedor de LLM, fila/processamento de PDF]`
- Status: `In production · Portuguese · early stage`
- Link: `revisaai.app`

**Revisa Aí - PT-BR**
- `Transforma PDFs de Medicina em flashcards prontos para repetição espaçada.`
- O que faz: `Envie apostilas, slides ou resumos; o arquivo é processado e descartado.` · `Gera cards de pergunta e resposta com explicação clínica, em três níveis de profundidade, com modo opcional "além do PDF" que marca separadamente os cards complementares.` · `Revise no app com repetição espaçada ou exporte para o Anki (.apkg).`
- Decisões: `Cards são perguntas que exigem recuperar a informação, não trechos recortados - a aposta do produto contra o "joga no ChatGPT".` · `Conteúdo adicionado pela IA é sempre rotulado para o estudante distinguir material original de complemento.`
- Status: `Em produção · Português · fase inicial`

**Ao Redor - EN**
- One-liner: `Compares what surrounds short-term rentals and hotels before you book.`
- What it does:
  - `Side-by-side numbers for each address from OpenStreetMap: street commerce within 250/500 m, walkable street grid, distance to transit, parks and malls.`
  - `Covers nine Brazilian cities; first analysis free, passwordless e-mail login, private reports with revocable share links.`
  - `One-time payment for analysis packs, no subscription.`
- Decisions:
  - `Deliberately no "safety score": the product shows observable facts and distances and refuses to turn them into a single number.`
  - `Reports warn when OSM coverage is thin instead of hiding data gaps.`
- Stack: `Next.js on Vercel · OpenStreetMap data · [CONFIRMAR: backend, banco, pipeline OSM/Overpass, pagamentos, auth]`
- Status: `In production · Portuguese · early stage`
- Link: `aoredor.com`

**Ao Redor - PT-BR**
- `Compara o entorno de hospedagens antes de você reservar.`
- O que faz: `Números lado a lado para cada endereço a partir do OpenStreetMap: comércio de rua a 250/500 m, malha caminhável, distância até transporte, praças e shoppings.` · `Cobre nove cidades brasileiras; primeira análise grátis, login por código de e-mail, relatórios privados com link compartilhável revogável.` · `Pagamento único por pacote de análises, sem assinatura.`
- Decisões: `Sem "nota de segurança" de propósito: o produto mostra fatos e distâncias observáveis e se recusa a reduzi-los a um número.` · `O relatório avisa quando a cobertura do OSM é baixa em vez de esconder a falta de dados.`
- Status: `Em produção · Português · fase inicial`

Cada projeto é também um candidato natural a post no blog (decisões de produto, pipeline de LLM, dados OSM). Isso dá conteúdo ao Writing e prova aos projetos ao mesmo tempo.

### 4.4 About - MBA

Coberto em 1.4.

---

## Fase 5 - Acessibilidade e performance

- Hero: letras do nome começam com `opacity: 0` no SSR. Respeitar `prefers-reduced-motion` (nome estático) e garantir texto visível sem JS (estado inicial visível; classe de animação aplicada após hidratação).
- Lighthouse mobile em `/`, `/experiences`, `/projects`. Alvos: LCP < 2,5 s, CLS < 0,1, a11y ≥ 95, SEO 100.
- Candidatos a `dynamic(() => import(...), { ssr: false })` com carregamento tardio: `ByteGuide`, `DeveloperCommandMenu`, `AmbientBackground`.
- Contraste do texto secundário (datas, descriptions, tags) no tema escuro.
- Foco visível e ordem de tabulação no menu e no command menu.
- Fontes: manter um único `woff2` com preload; `font-display: swap`.

---

## Fase 6 - Consistência externa

- **LinkedIn:** ADP → Mar 2025; SAP → "Development Consultant"; headline `Senior Software Engineer | Backend, Cloud & AI`; site e `/resume` em Destaques; seção Projetos com Revisa Aí e Ao Redor usando as one-liners acima; educação com MBA USP/Esalq (Oct 2026 – 2028).
- **GitHub:** bio + site; fixar repositórios que forem públicos (se os produtos forem privados, um README de perfil com os links basta).
- **Medium:** bio com link para o site. Nos próximos posts, se publicar site-primeiro, usar "import story" para canonical.
- **X:** bio e link.

---

## Ordem de execução

1. Fase 1 (copy, metadata, datas, PDF, 404) - um PR.
2. Fase 2 (robots, sitemap, JSON-LD, alt) - um PR. Em seguida, Search Console + sitemap.
3. Fase 3.1–3.3 (lista curada de posts, remoção do RSS) - um PR.
4. Fase 4.1 e 4.3 (highlights e `/projects`) - um PR. `/projects` pode sair com `[CONFIRMAR]` resolvido ou com a linha de stack reduzida a "Next.js on Vercel" até você confirmar o resto.
5. Fase 5 - Lighthouse antes/depois.
6. Fase 6 - depois do deploy, copiando os textos finais.
7. Fase 3.4 (MDX) - só quando decidir publicar site-primeiro.

## Verificação final

- `curl -s https://www.joaoac.com | grep -o '<title>[^<]*'` → título novo.
- `curl -sI https://www.joaoac.com/resume` → 308 para o PDF; PDF responde `application/pdf`.
- `/robots.txt`, `/sitemap.xml` → 200.
- Rich Results Test → `Person` válido.
- Nenhuma ocorrência de "landing page", "Digital Experiences", "Field notes" ou `?source=rss` no HTML.
- Datas ADP/SAP iguais em site, PDF e LinkedIn.
- Lighthouse mobile na home dentro dos alvos.
