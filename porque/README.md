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

### Origem (UTM)

Em qualquer página, `src/scripts/utm.ts` guarda no `localStorage` (`porque_utm`) os primeiros
`utm_source`, `utm_medium` e `utm_campaign` da visita (minúsculas, `[a-z0-9._-]`, até 64
caracteres; valores já guardados não são sobrescritos). Ao se inscrever, eles vão junto com o
e-mail e o Worker grava como propriedades do contato no Resend.

As propriedades precisam existir no Resend antes (uma vez só):

```sh
RESEND_API_KEY=... node scripts/create-utm-properties.mjs
```

Sem elas, o Resend recusa o contato com propriedades e o Worker repete a inscrição sem UTM (o
e-mail nunca se perde, só a origem).

Contagem por origem (somente leitura; quem chegou sem UTM aparece como `direto`):

```sh
RESEND_API_KEY=... node scripts/waitlist-stats.mjs
```

Local: copie `.dev.vars.example` para `.dev.vars` e rode `npm run preview`.
