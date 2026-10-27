# joaoac.com

joão coelho's corner of the web: i build software and write about what i learn along the way.

- `/` — [www.joaoac.com](https://www.joaoac.com). home, writing (mdx posts in english and portuguese), projects, experience and a few things outside of code. static astro site.
- `digest/` — [digest.joaoac.com](https://digest.joaoac.com). the tech digest: a short list of tech links, every day. astro rendered on demand, edge-cached, reads the tech digest api.
- `porque/` — [porque.app](https://porque.app). landing page for por quê?, an iphone app with one interesting question a day. static astro.
- `workers/` — redirects `joaoac.com` and `www.digest` to their canonical hosts.

## stack

astro · mdx · typescript · plain css · cloudflare workers · node test runner

## run

```bash
npm ci && npm run dev
cd porque && npm ci && npm run dev
cd digest && npm ci && npm run dev   # needs .dev.vars, see .dev.vars.example
scripts/check                        # format, lint, types, tests and build
```

## write

- posts: `src/content/posts/<slug>.mdx` and `<slug>.pt-BR.mdx`
- projects, experience, ichiro: `src/data/`
- interface copy: `src/lib/ui.ts`, `digest/src/lib/copy.ts`

## deploy

```bash
npm run deploy             # site
npm run deploy:redirect    # redirects
cd porque && npm run deploy
cd digest && npm run deploy
```

the digest needs `DIGEST_REVALIDATE_TOKEN` (`npx wrangler secret put`), the same token railway sends to `/api/revalidate` after each daily send.
