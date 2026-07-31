# DECISIONS

Log van aannames en defaults die zijn ingevuld waar bron 1 (Figma) of
bron 2 (de opdrachtbrief) geen antwoord gaf. Drie kolommen, zoals
afgesproken.

| Wat ontbrak | Wat ik koos | Waar het echte antwoord vandaan komt |
| --- | --- | --- |
| Figma-file-URL / geselecteerde frames — de Figma MCP-tools vereisen een fileKey + node-id en er is nog geen URL gedeeld | Volledige designrichting uit de opdrachtbrief: palet (paper/stone/moss/clay/ink/glass), Instrument Serif + Inter, fluid type via clamp() | Deel een Figma-URL mét node-id (rechtsklik frame → Copy link to selection); dan haal ik tokens op via get_variable_defs en vervang de brief-defaults |
| Figma-tokens voor spacing, radii en de exacte card-anatomie | Card: beeld 4:5, tekstregel eronder (titel links serif, prijs rechts in clay), geen radius, geen schaduw | Zelfde Figma-URL; get_design_context op het product-card-component |
| Eigen repo `glaswerk-shop` (gh repo create) — deze sessie heeft geen `gh` CLI en GitHub-toegang is beperkt tot `sjonmajeur/crypto-monitor` | Project scaffolded in submap `glaswerk-shop/` van crypto-monitor, op de aangewezen branch `claude/glaswerk-webshop-shopify-xfllpp`; bestaande crypto-bestanden onaangeraakt | Geef de sessie toegang tot een nieuwe repo (of maak `glaswerk-shop` aan en koppel hem), dan verhuis ik de map met behoud van historie |
| shadcn/ui-registry onbereikbaar — netwerkpolicy blokkeert ui.shadcn.com (403 op de proxy) | shadcn-conventie handmatig opgezet: components.json, `cn()` in lib/utils.ts, button/badge/skeleton in components/ui/ met cva — identieke API als de registry-versies | Netwerkpolicy verruimen met ui.shadcn.com, of accepteer de handmatige componenten (functioneel gelijk) |
| Shopify MCP-calls vereisen interactieve goedkeuring die er in deze autonome run niet was; Storefront-keys ontbreken | Datalaag gebouwd tegen het officiële Storefront API-schema (2025-07) met zod-validatie; home toont zonder keys een config-melding, géén mock-producten | Keur de Shopify MCP-calls goed en/of vul SHOPIFY_STORE_DOMAIN + SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local |
| Storefront API-versie | 2025-07 als default, overschrijfbaar via env | Shopify admin → welke API-versie de store-app gebruikt |
| Copy op de tijdelijke home (stap 1-preview) | Korte NL-tekst, gemarkeerd met `data-placeholder="true"` | Merkverhaal/copy uit Figma of van jou |
| Prijsnotatie | `Intl.NumberFormat("nl-NL")`, hele bedragen zonder decimalen (€ 24), anders twee decimalen | Bevestig gewenste notatie |

**Nooit verzonnen (bewust):** prijzen, voorraad, varianten en SKU's. Die
komen uitsluitend uit Shopify; zonder keys faalt de weergave hard met een
duidelijke melding in plaats van mock-data.
