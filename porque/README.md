# porque-landing

Landing page do por quê (porque.app): Astro estático servido pelo Worker `porque-landing`.

## Lista de espera

O formulário (`src/components/Waitlist.astro`) envia para `POST /api/waitlist`, tratado por
`src/worker/index.ts` (só `/api/*` passa pelo script; o resto são assets estáticos). O e-mail vira
um contato no Resend, no segmento `RESEND_SEGMENT_ID`.

Respostas: `201 {status:"subscribed"}`, `200 {status:"already"}`, `400 {status:"invalid"}`,
`502 {status:"error"}`. O campo `site` é um honeypot: se vier preenchido, a resposta é sucesso
falso e nada é gravado.

### Variáveis

| nome                  | tipo           | onde                                                      |
| --------------------- | -------------- | --------------------------------------------------------- |
| `RESEND_API_KEY`      | secret         | `npx wrangler secret put RESEND_API_KEY`                  |
| `RESEND_SEGMENT_ID`   | var            | `wrangler.jsonc` (segmento "General")                     |
| `WAITLIST_FROM_EMAIL` | var (opcional) | remetente num domínio verificado; sem ele, nada é enviado |

Local: copie `.dev.vars.example` para `.dev.vars` e rode `npm run preview`.
