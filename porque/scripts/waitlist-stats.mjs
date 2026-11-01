/* global process, console, fetch, setTimeout, URLSearchParams */
// Read-only: counts waitlist contacts by utm_source / utm_medium.
//   RESEND_API_KEY=... node scripts/waitlist-stats.mjs [segment_id]
const SEGMENT =
  process.argv[2] ?? process.env.RESEND_SEGMENT_ID ?? 'd78cac12-ddbc-48a6-a340-4bf516997c38';
const key = process.env.RESEND_API_KEY;
if (!key) {
  console.error('defina RESEND_API_KEY');
  process.exit(1);
}
const headers = { Authorization: `Bearer ${key}` };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(path) {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`https://api.resend.com${path}`, { headers });
    if (res.status === 429 && attempt < 5) {
      await sleep(1000 * (attempt + 1));
      continue;
    }
    if (!res.ok) throw new Error(`GET ${path}: HTTP ${res.status}`);
    return res.json();
  }
}

const contacts = [];
let after;
do {
  const qs = new URLSearchParams({ segment_id: SEGMENT, limit: '100' });
  if (after) qs.set('after', after);
  const page = await get(`/contacts?${qs}`);
  contacts.push(...page.data);
  after = page.has_more ? page.data.at(-1)?.id : undefined;
} while (after);

// The list endpoint omits properties, so fetch each contact (throttled for Resend's rate limit).
const bySource = new Map();
const byPair = new Map();
const bump = (m, k) => m.set(k, (m.get(k) ?? 0) + 1);
for (const c of contacts) {
  const full = await get(`/contacts/${c.id}`);
  await sleep(250);
  const p = full.properties ?? {};
  const source = p.utm_source || 'direto';
  const medium = p.utm_medium || (p.utm_source ? '(sem medium)' : 'direto');
  bump(bySource, source);
  bump(byPair, `${source} / ${medium}`);
}

const print = (title, m) => {
  console.log(`\n${title}`);
  for (const [k, n] of [...m].sort((a, b) => b[1] - a[1]))
    console.log(`  ${String(n).padStart(5)}  ${k}`);
};
console.log(`lista de espera do por quê: ${contacts.length} inscritos`);
print('por utm_source', bySource);
print('por utm_source / utm_medium', byPair);
