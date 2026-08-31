# joaoac.com

Personal website for João Coelho, a software engineer focused on backend systems, cloud products, AI experiments, and thoughtful digital experiences.

[Visit the website](https://joaoac.com)

![joaoac.com preview](./public/og.png)

## Overview

The site brings together professional experience, selected writing, technical interests, and contact information in a focused, interactive portfolio.

It is designed to feel expressive without becoming distracting: motion supports the content, ambient colors respond to each section, and every interaction has a reduced-motion alternative.

## Highlights

- Responsive, dark-first interface with ambient scroll-based color transitions
- Animated professional timeline with a dedicated experience page
- Active-section navigation and keyboard command menu (`/` or `⌘ K`)
- Byte, an animated rabbit guide with a predefined conversational flow
- Live Medium articles with hourly revalidation and graceful fallback
- Accessible motion through `prefers-reduced-motion`
- Responsive interactions designed for keyboard, pointer, and touch

## Stack

- [Next.js](https://nextjs.org/) with the App Router
- [React](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Icons](https://react-icons.github.io/react-icons/)

## Local development

```bash
git clone git@github.com:joaoantoniocoelho/joaoac.com.git
cd joaoac.com
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

No environment variables are required for local development.

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create an optimized production build |
| `npm start` | Run the production build |
| `npm run lint` | Run the Next.js linter |

## Structure

```text
app/          Routes, metadata, and global styles
components/   Page sections, interactions, and shared UI
data/         Professional experience content
services/     External content integrations
public/       Static images and Byte sprites
lib/          Shared utilities
```

Professional experience is maintained in `data/experiences.json`. Recent writing is loaded from João's Medium feed and revalidated every hour.
