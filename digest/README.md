# Tech Digest landing

Aplicação Next.js independente dentro do repositório `joaoac.com`. A Vercel deve usar `digest` como **Root Directory**. O site principal continua como outro projeto, com a raiz do repositório como Root Directory.

## Desenvolvimento

```bash
cd digest
npm ci
cp .env.example .env.local
npm run dev
```

`NEXT_PUBLIC_DIGEST_API_URL` aponta para a API pública. A landing envia `POST /subscribe` com JSON e `POST /unsubscribe/{token}` sem corpo, somente após confirmação. Ela não envia credenciais nem chama jobs. O formulário de inscrição (landing e páginas de edição) também envia `acquisition_source` (parâmetro `ref`, ou `direct` quando a visita não tem `ref` nem UTM), `acquisition_url` (origem e caminho da página, sem query) e, quando presentes, `utm_source`/`utm_medium`/`utm_campaign`. A primeira URL da sessão com `ref` ou UTM fica no `sessionStorage` e tem prioridade no envio, para a origem não se perder na navegação interna. Os valores são truncados aos limites do backend; se a API ainda responder 413, o formulário reenvia só o e-mail. O link de cancelamento não tem prefixo de idioma. A página usa a preferência salva no navegador ou seu idioma para escolher entre inglês e pt-BR; o botão troca o idioma sem alterar o token nem a URL.

As páginas `/digest` e `/digest/YYYY-MM-DD` usam `GET /digests?page=N` e
`GET /digests/YYYY-MM-DD` na API do Railway. Publique a API antes do site: o site
espera a resposta paginada (`editions`, `page`, `has_more`) e os campos
`older_date`/`newer_date` da edição. Novas edições entram no arquivo após o envio
diário e a invalidação do cache.
O arquivo mostra 20 edições por página, com URLs `/digest?page=N`; um `page`
inválido redireciona para a primeira página e uma página além do fim retorna 404.
As mesmas páginas existem em português em `/pt-BR/digest` e
`/pt-BR/digest/YYYY-MM-DD`. Os links mantêm o idioma atual, e o switch do header
leva à mesma página no outro idioma. O conteúdo dos artigos vem da API e não é
traduzido.
Ao final de cada edição, o bloco "Share this digest" oferece copiar o link, X e
LinkedIn. Os links apontam para a URL canônica da edição no idioma atual com
`ref=share` (copiar), `ref=x` ou `ref=linkedin`, que entram como
`acquisition_source` na inscrição de quem chegar por eles. Não há código de
indicação por usuário.
Testes unitários: `npm test` (runner nativo do Node, sem dependências).
A home em inglês e em português mostra até três artigos da edição mais recente e
links para a edição completa e para o arquivo. Se a API estiver indisponível, a
home mantém a amostra ilustrativa atual.

As páginas de edição são geradas e guardadas na primeira visita (`generateStaticParams`
retorna `[]`). O arquivo é gerado no build. Os dados da API e as páginas têm
revalidação de uma hora como fallback. Após um envio, Railway chama
`POST /api/revalidate` com `DIGEST_REVALIDATE_TOKEN` via Bearer e as datas da edição
nova e da anterior. O endpoint invalida o arquivo, ambas as edições e os dados
compartilhados; a regeneração ocorre na próxima visita. Configure o mesmo token
nas variáveis de ambiente dos dois serviços.

## Configuração de produção

1. **Vercel:** importe o mesmo repositório como um **novo projeto** `tech-digest-landing`. Defina **Root Directory** como `digest`, framework Next.js, install command `npm ci` e build command `npm run build`. Crie a variável **Production** `NEXT_PUBLIC_DIGEST_API_URL=https://api.digest.joaoac.com`. Adicione `digest.joaoac.com` em **Settings → Domains**. Mantenha `joaoac.com` e `www.joaoac.com` somente no projeto Vercel do site principal.
2. **Railway:** no serviço da API já existente, adicione `api.digest.joaoac.com` em **Settings → Public Networking → Custom Domain**. Registre os valores **CNAME e TXT de verificação** exibidos pelo Railway. Defina `PUBLIC_BASE_URL=https://digest.joaoac.com` para que os próximos e-mails usem a landing. Links antigos no host da API continuam válidos. Não altere `CORS_ALLOWED_ORIGINS` se a lista padrão descrita pela API está ativa; se a variável já estiver definida, preserve os localhost e acrescente `https://digest.joaoac.com` caso falte.
3. **Cloudflare DNS:** crie o CNAME `digest` com o destino **exato indicado pelo projeto Vercel** e o CNAME `api.digest` com o destino indicado pelo Railway. Crie também o TXT de verificação com nome e valor exatos mostrados no Railway. Use **DNS only** (nuvem cinza) para `api.digest`, que é um subdomínio de segundo nível; isso permite o certificado direto do Railway sem exigir Cloudflare Advanced Certificate Manager. Pode usar DNS only para `digest` também. Não altere os registros atuais do apex ou `www`.
4. Confirme HTTPS e as rotas `/`, `/pt-BR`, `/unsubscribe` e `/unsubscribe/{token}` no novo domínio. Teste inscrição com um e-mail seu e cancelamento usando um token de um e-mail de teste. Não abra o link de cancelamento como teste de POST: a ação só ocorre ao clicar no botão.

Os destinos de CNAME são específicos da configuração de cada projeto e devem ser copiados dos painéis. Nenhum registro DNS foi alterado neste repositório.
