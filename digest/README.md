# Tech Digest landing

Aplicação Next.js independente dentro do repositório `joaoac.com`. A Vercel deve usar `digest` como **Root Directory**. O site principal continua como outro projeto, com a raiz do repositório como Root Directory.

## Desenvolvimento

```bash
cd digest
npm ci
cp .env.example .env.local
npm run dev
```

`NEXT_PUBLIC_DIGEST_API_URL` aponta para a API pública. A landing envia `POST /subscribe` com JSON e `POST /unsubscribe/{token}` sem corpo, somente após confirmação. Ela não envia credenciais nem chama jobs. O link de cancelamento não tem prefixo de idioma. A página usa a preferência salva no navegador ou seu idioma para escolher entre inglês e pt-BR; o botão troca o idioma sem alterar o token nem a URL.

## Configuração de produção

1. **Vercel:** importe o mesmo repositório como um **novo projeto** `tech-digest-landing`. Defina **Root Directory** como `digest`, framework Next.js, install command `npm ci` e build command `npm run build`. Crie a variável **Production** `NEXT_PUBLIC_DIGEST_API_URL=https://api.digest.joaoac.com`. Adicione `digest.joaoac.com` em **Settings → Domains**. Mantenha `joaoac.com` e `www.joaoac.com` somente no projeto Vercel do site principal.
2. **Railway:** no serviço da API já existente, adicione `api.digest.joaoac.com` em **Settings → Public Networking → Custom Domain**. Registre os valores **CNAME e TXT de verificação** exibidos pelo Railway. Defina `PUBLIC_BASE_URL=https://digest.joaoac.com` para que os próximos e-mails usem a landing. Links antigos no host da API continuam válidos. Não altere `CORS_ALLOWED_ORIGINS` se a lista padrão descrita pela API está ativa; se a variável já estiver definida, preserve os localhost e acrescente `https://digest.joaoac.com` caso falte.
3. **Cloudflare DNS:** crie o CNAME `digest` com o destino **exato indicado pelo projeto Vercel** e o CNAME `api.digest` com o destino indicado pelo Railway. Crie também o TXT de verificação com nome e valor exatos mostrados no Railway. Use **DNS only** (nuvem cinza) para `api.digest`, que é um subdomínio de segundo nível; isso permite o certificado direto do Railway sem exigir Cloudflare Advanced Certificate Manager. Pode usar DNS only para `digest` também. Não altere os registros atuais do apex ou `www`.
4. Confirme HTTPS e as rotas `/`, `/pt-BR`, `/unsubscribe` e `/unsubscribe/{token}` no novo domínio. Teste inscrição com um e-mail seu e cancelamento usando um token de um e-mail de teste. Não abra o link de cancelamento como teste de POST: a ação só ocorre ao clicar no botão.

Os destinos de CNAME são específicos da configuração de cada projeto e devem ser copiados dos painéis. Nenhum registro DNS foi alterado neste repositório.
