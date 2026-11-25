<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Tech Digest site

This folder is the public site at `digest.joaoac.com` (Astro on Cloudflare Workers): the landing page, the archive of editions and the unsubscribe page, in `en` and `pt-BR` (`src/lib/copy.ts`).

It has no data of its own. Everything comes from the Tech Digest API (`DIGEST_API_URL`, `https://api.digest.joaoac.com`), which lives in the `tech-digest` repository and runs on a VPS. That repository's `AGENTS.md` and `docs/production.md` describe the pipeline, the schedule and how production is operated.

- `POST /subscribe`: signup form (`src/scripts/signup.ts`), with acquisition attribution.
- `GET /digests?page=N` and `GET /digests/<date>`: archive and edition pages (`src/lib/editions.ts`). An edition may carry `note`, an authorial note that is always written in English; only its label and call to action follow the page locale.
- `/unsubscribe/<token>`: confirmation page and `POST` to the API.
- `POST /api/revalidate` (this site): the API calls it after sending an edition, authenticated with the secret shared as `DIGEST_REVALIDATE_TOKEN`, so cached pages refresh right away.

The emails are English only and are rendered by the API, not here. The email design mirrors this site's tokens (`src/styles/global.css`), so a visual change here usually needs the matching change in `tech-digest/app/email.py`.

API responses are validated before rendering: fields the API does not send yet must stay optional, so the site and the API can be deployed in any order.
