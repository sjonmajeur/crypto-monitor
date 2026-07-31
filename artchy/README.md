# ARTCHY

Wearable art platform — where imagination becomes identity. Webshop voor
limited wearable art-drops, naar het originele ARTCHY-model van de
opdrachtgever. Next.js App Router + TypeScript + Tailwind CSS v4 +
shadcn/ui-conventie, gekoppeld aan Shopify via de Storefront API.

## Installatie

```bash
cd artchy
npm install
```

## Environment invullen

```bash
cp .env.example .env.local
```

Vul daarna in `.env.local` in:

| Variabele | Waarde |
| --- | --- |
| `SHOPIFY_STORE_DOMAIN` | `jouw-shop.myshopify.com` (zonder `https://`) |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Storefront API access token uit de Shopify admin |
| `SHOPIFY_STOREFRONT_API_VERSION` | optioneel, default `2025-07` |

Zonder deze keys start de app wel, maar toont hij een configuratiemelding
in plaats van producten. Er wordt nooit mock-productdata getoond.

## Development

```bash
npm run dev      # dev-server op http://localhost:3000
npm run build    # productie-build (moet foutloos slagen)
npm run lint     # eslint
```

## Design

Bron van waarheid is het ARTCHY-model van de opdrachtgever (screenshot,
2026-07-31). Een Figma-file-URL is **nog niet gekoppeld**; zodra die er
is, komt de link hier te staan en worden de design-tokens in
`app/globals.css` vervangen door de exacte Figma-variabelen. Zie
`DECISIONS.md` voor alle aannames die tot die tijd gelden.

## Sandbox (testmodus)

Zet in `.env.local` (en op Netlify) `NEXT_PUBLIC_SANDBOX=true`. Dan:

- verschijnt een vaste balk "SANDBOX — testmodus, geen echte betalingen";
- bestaat `/sandbox` met de testkaarten (uitklapbaar, met kopieerknop),
  de laatste 10 testorders uit de Admin API, de webhook-log, een knop
  "Vul cart met demo-items" en "Reset sandbox" (annuleert + verwijdert
  testorders en zet de voorraad terug naar de vastgelegde startwaarden).

Staat de variabele uit, dan bestaat `/sandbox` niet (404) en is de balk
weg — zelfde build, één codepad.

De webhook `orders/create` wijst naar `/api/webhooks/orders/create` en
wordt geverifieerd met HMAC (`SHOPIFY_WEBHOOK_SECRET`). Testorders nooit
fulfillen: altijd annuleren en archiveren/verwijderen (de reset-knop doet
dat goed).

### Testmodus uitzetten vóór livegang

1. Shopify admin → **Settings → Payments**.
2. Staat de **Bogus Gateway** (Test payment provider) actief: verwijder
   die en activeer een echte provider (bijv. Shopify Payments).
3. Gebruik je Shopify Payments: open **Manage** en zet **Test mode** UIT.
4. Zet `NEXT_PUBLIC_SANDBOX` uit (of verwijder de env var) en redeploy —
   daarmee verdwijnen de sandbox-balk en `/sandbox`.
5. Controleer met een kleine echte betaling dat er géén "test" badge op
   de order in de admin staat, en refund die daarna.

Let op: een development store kan geen echte betalingen ontvangen totdat
het plan is omgezet; testmodus aan laten staan op een live store
blokkeert juist echte orders.

## Routes

```
/               home: hero, featured collections, how it works, drop, creators
/shop           PLP met filters en sortering (echte Shopify-producten)
/artists        de creators (Josh, Taji, Brass)
/taji           de wereld van Taji
/how-it-works   how art becomes fashion
/about          a new generation of creativity
/product/[h]    PDP: varianten via optie-knoppen, add to cart
/order/bedankt  bevestiging na checkout (leest webhook-log)
/sandbox        testmodus-dashboard (alleen met NEXT_PUBLIC_SANDBOX=true)
```

Cart en checkout lopen via de Storefront Cart API (cartCreate,
cartLinesAdd/Update/Remove); het cart-id staat in een httpOnly-cookie en
afrekenen is een redirect naar `cart.checkoutUrl` — er is geen eigen
checkout of betaalflow.

## Structuur

```
app/                  routes (App Router, server components)
components/ui/        shadcn/ui-basiscomponenten
components/product/   product card e.d.
lib/shopify/          alle Storefront API-calls (getypeerd + zod)
lib/format.ts         prijs- en tekstformattering
```

Componenten praten nooit rechtstreeks met de Shopify API — alles loopt via
`lib/shopify/`.
