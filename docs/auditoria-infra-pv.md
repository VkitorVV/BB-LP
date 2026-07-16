# Auditoria e readaptacao segura da infraestrutura da nova PV

Data: 2026-07-16
Branch: `codex/auditoria-infra-pv`

## Escopo

Esta migracao tratou a nova pagina como fluxo critico de tracking, nao como ajuste visual.
Nao houve deploy e nao foram alterados precos, copies comerciais, IDs de checkout ou webhook.

## Ponto de restauracao

Foi criado um commit WIP antes das alteracoes desta auditoria:

- `4f45fde WIP backup before infrastructure audit`

## Arquitetura encontrada

- App Next.js 15 com App Router.
- PV principal em `app/page.tsx`, com componentes em `components/`.
- Trackers client-side em `components/ClientTrackers.tsx`, `SectionTracker.tsx` e `PresenceTracker.tsx`.
- APIs internas em `app/api/*`.
- Painel em `app/funil/page.tsx`.
- Supabase via `lib/supabaseAdmin.ts`.
- Webhook Wiapy em `app/api/wiapy-webhook/route.ts`.

## Configuracao centralizada

Foi criado um registry tipado em `lib/trackingConfig.ts` com a ordem real da nova pagina:

1. `hero`
2. `marca-nao-aparece`
3. `se-a-marca-nao-sai`
4. `material-por-dentro`
5. `cta-material-por-dentro`
6. `com-o-mapa-voce-vai`
7. `carrossel-cortes`
8. `veja-tudo-que-recebe`
9. `precos-acesso`
10. `prova-social`
11. `garantia`
12. `faq`
13. `cta-final`
14. `rodape`

Aliases historicos preservados:

- `oferta -> precos-acesso`
- `planos -> precos-acesso`

`#planos` continua sendo a ancora visual. O ID oficial rastreado e `precos-acesso`.

## Tracking client-side

Foi criado `lib/clientTracking.ts` para centralizar:

- `session_id` em `sessionStorage`;
- atribuicao/UTMs em URL + `sessionStorage`;
- montagem de checkout com `session_id` e `sid`;
- URLs oficiais da Wiapy vindas do registry.

CTAs internos agora rolam para `#planos`, mas registram destino logico `precos-acesso`.

## GA4, UTMify e pixel

- O `page_view` manual por secao foi removido.
- O `page_view` fica apenas no `gtag('config')` do layout.
- `section_reached` permanece como evento separado.
- `utms/latest.js` segue no layout antes do pixel.
- `window.pixelId` segue `6a4b090cd0b0714e73bcc2f6`.
- O preload antigo da hero foi trocado para `mockup-hero-sf.webp`.

## Checkouts e popup

Taxonomia preservada:

- `plano_basico_popup_open`
- `plano_basico`
- `kit_completo`
- `kit_desconto_popup`

Links preservados:

- Basico: `https://pay.wiapy.com/iUoMvXq0sJr-`
- Upgrade popup: `https://pay.wiapy.com/8To4z6HioR`
- Kit normal: `https://pay.wiapy.com/MaYsqe4pqwN`

`button_location`:

- `oferta` nos botoes principais da secao de precos;
- `popup_upgrade` nos botoes dentro do popup.

## APIs

`/api/track-click`:

- agora aceita `clickKind: internal_cta` sem exigir checkout real;
- grava `checkout_type: internal_cta` para CTA interno;
- preserva os eventos de checkout atuais.

`/api/track-section`:

- canonicaliza `oferta` e `planos` para `precos-acesso`;
- usa o registry quando possivel.

`/api/funnel-dashboard`:

- usa a nova ordem das secoes;
- soma historico antigo via alias;
- mantem paginacao acima de 100 registros;
- calcula receita quando `funnel_purchases.amount` existe;
- faz fallback sem derrubar o painel se `amount`/`created_at` ainda nao existirem no Supabase real.

`/api/funnel-export`:

- tambem tenta exportar `amount`;
- cai para queries menores se o schema real ainda estiver atrasado.

`/api/wiapy-webhook`:

- mantem `Purchase` apenas para `status === 'paid'`;
- mantem GA4 server-side no webhook;
- mantem idempotencia por `payment_id`;
- mantem associacao por `session_id/sid` quando vier no webhook;
- mantem fallback por clique recente;
- agora grava `amount` em `funnel_purchases` quando a coluna existe.

## Supabase

Nao foi criada migracao destrutiva.
O arquivo `supabase/schema.sql` ja contem `ADD COLUMN IF NOT EXISTS` para `funnel_purchases.amount` e `created_at`.

Durante teste local, `.env.local` nao tinha `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY`, entao as rotas de tracking registraram aviso local e retornaram 200. Isso nao altera producao, desde que as envs estejam configuradas no ambiente real.

## Env vars documentadas

`.env.example` foi atualizado com placeholders seguros para:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_CLARITY_PROJECT_ID`
- `GA4_API_SECRET`
- `WIAPY_WEBHOOK_SECRET`
- `FUNNEL_DASHBOARD_TOKEN`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `DISABLE_HMR`

Nenhum valor privado foi incluido.

## Validacao executada

- `npm run lint`: passou com 2 warnings antigos de `<img>` em `MarcaNaoAparece` e `PrecosAcesso`.
- `npx tsc --noEmit`: passou.
- `npm run build`: passou.
- Smoke HTTP em producao local:
  - `/` respondeu 200;
  - 14 secoes com `data-track-section` foram renderizadas na ordem nova;
  - `mockup-hero-sf.webp` presente e preload antigo removido;
  - `pixelId` encontrado uma vez no layout;
  - assets criticos responderam 200:
    - hero atual;
    - seta verde animada;
    - `mapa-marcação.webp`.

## Observacoes de validacao

- A automacao do navegador interno timeoutou em dev por compilacao lenta e requests locais; a validacao final foi feita com build aprovado + servidor de producao local + checks HTTP.
- Nao foram feitos cliques reais em checkout externo para evitar abrir/transmitir URLs para Wiapy durante a auditoria.
- Popup/checkout foram validados por codigo, atributos semanticos e preservacao dos slugs oficiais.

## Residuos classificados

Necessario:

- `components/PrecosAcesso.tsx`
- `components/SectionTracker.tsx`
- `components/PresenceTracker.tsx`
- `lib/trackingConfig.ts`
- `lib/clientTracking.ts`

Historico ou legado nao importado na PV atual:

- `components/Oferta.tsx`
- `components/CTAIntermediario.tsx`
- componentes antigos como `Beneficios`, `Bonus`, `Comparativo`, `IdealPara`, `OQueRecebe`, `OfferCountdown`, `ComoAcessar`

Incerto, nao removido:

- assets antigos de oferta/versoes anteriores;
- CSS global legado de carrosseis;
- componentes antigos nao importados que podem servir como rollback/referencia.

Removidos:

- nenhum arquivo foi removido nesta etapa.

## Riscos residuais

- Se o Supabase real ainda nao tiver `funnel_purchases.amount`/`created_at`, o painel carrega com fallback, mas receita pode ficar zerada ate rodar o SQL idempotente do schema.
- O lint avisa sobre dois `<img>` existentes. Trocar por `next/image` pode alterar renderizacao visual; deixado para uma tarefa separada.
- O plugin Next no ESLint foi configurado manualmente para contornar incompatibilidade do patch Rushstack com ESLint 9; o lint roda e aplica regras do plugin, mas o build mostra aviso informativo de deteccao.
