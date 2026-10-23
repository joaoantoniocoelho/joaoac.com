# joaoac.com

personal site and tech digest.

- `/` — [www.joaoac.com](https://www.joaoac.com). static astro site, mdx posts in english and portuguese.
- `digest/` — [digest.joaoac.com](https://digest.joaoac.com). astro rendered on demand, edge-cached, reads the tech digest api.
- `workers/` — redirects `joaoac.com` and `www.digest` to their canonical hosts.

## stack

astro · mdx · typescript · plain css · cloudflare workers · node test runner

## run

```bash
npm ci && npm run dev
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
cd digest && npm run deploy
```

the digest needs `DIGEST_REVALIDATE_TOKEN` (`npx wrangler secret put`), the same token railway sends to `/api/revalidate` after each daily send.
