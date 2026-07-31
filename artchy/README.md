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

## Routes

```
/               home: hero, featured collections, how it works, drop, creators
/shop           PLP met filters en sortering (echte Shopify-producten)
/artists        de creators (Josh, Taji, Brass)
/taji           de wereld van Taji
/how-it-works   how art becomes fashion
/about          a new generation of creativity
```

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
