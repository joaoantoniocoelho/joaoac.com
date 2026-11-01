/* global process, console, fetch */
// One-off: creates the Resend contact properties the waitlist writes (utm_source, utm_medium,
// utm_campaign). Safe to re-run: existing keys are skipped. WRITES to Resend.
//   RESEND_API_KEY=... node scripts/create-utm-properties.mjs
const KEYS = ['utm_source', 'utm_medium', 'utm_campaign'];
const key = process.env.RESEND_API_KEY;
if (!key) {
  console.error('defina RESEND_API_KEY');
  process.exit(1);
}
const headers = { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };
const list = await fetch('https://api.resend.com/contact-properties', { headers });
if (!list.ok) throw new Error(`listar propriedades: HTTP ${list.status}`);
const existing = new Set((await list.json()).data.map((p) => p.key));
for (const k of KEYS) {
  if (existing.has(k)) {
    console.log(`${k}: já existe`);
    continue;
  }
  const res = await fetch('https://api.resend.com/contact-properties', {
    method: 'POST',
    headers,
    body: JSON.stringify({ key: k, type: 'string' }),
  });
  console.log(`${k}: ${res.ok ? 'criada' : `erro HTTP ${res.status} ${await res.text()}`}`);
}
