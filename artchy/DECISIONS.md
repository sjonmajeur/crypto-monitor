# DECISIONS

## Koerswijziging 2026-07-31: ARTCHY

De opdrachtgever heeft per screenshot + expliciet akkoord bepaald dat het
ARTCHY-model (donkere wearable art-shop) het ontwerp is. De
glaswerk-designrichting uit de oorspronkelijke brief vervalt daarmee;
regels die niet designgebonden zijn (Shopify-koppeling, kwaliteitseisen,
geen mock-data, DECISIONS-logging) blijven gelden.

| Wat ontbrak | Wat ik koos | Waar het echte antwoord vandaan komt |
| --- | --- | --- |
| Figma-variabelen — het model is een screenshot (JPG), geen Figma-URL | Tokens op het oog uit het beeld: coal #0A0A0A, night #141414, line #2A2A2A, bone #F2EFEA, gold #C9A227, snow #FFF, ash #A3A3A3 | Figma-link met node-id van het ARTCHY-bestand → get_variable_defs |
| Exacte fonts van het model | Anton (display, condensed uppercase) + Inter (UI) via next/font | Figma-file (font-namen staan in de inspector) |
| Beeldmateriaal (hero, collectiebeelden, creator-portretten, drop-shot, storybeeld) | Gemarkeerde placeholder-vlakken (`data-placeholder`) in night-grijs met label | Losse assets van de opdrachtgever of exports uit de Figma-file |
| Drop-einddatum voor de countdown | 2026-08-31 22:00 CEST als placeholder-constante in app/page.tsx | Echte drop-planning (Shopify of opdrachtgever) |
| Collectie-indeling (Josh/Taji/Brass) in Shopify onbekend — MCP-koppeling verlopen | Homepage linkt naar /shop?type=… op basis van productType; teksten per collectie uit de screenshot overgenomen | Shopify-collecties zodra de connector geherautoriseerd is |
| Newsletter-integratie | Formulier als niet-gekoppelde placeholder | Welke mailinglijst (Shopify Email, Klaviyo, …) |
| Footer-infolinks (FAQ, Shipping, Returns, T&C, Privacy) | Tekst zonder link, gemarkeerd als placeholder | Bestaande beleidspagina's in Shopify (shop.policies) |
| Brand-iconen (Instagram/TikTok/YouTube) — lucide levert geen brand-iconen meer | Inline SVG's voor Instagram/YouTube, muzieknoot voor TikTok; sociale URL's zijn nog `#` | Echte social-URL's van de opdrachtgever |
| Taal van de UI | Engels, conform het model (config-meldingen voor de developer nog NL) | Bevestig of alles EN moet zijn |
| Routes | Nav uit het model: /shop (PLP), /artists, /taji, /how-it-works, /about; /collectie en /over zijn hernoemd | Figma-file / sitemap van de opdrachtgever |
| Echte fotografie voor de homepage | Zelf gegenereerde donkere placeholder-JPG's in public/ (hero, collection-*, creator-*, drop-hoodie, generation) met TAJI-kleuraccenten en een "vervang mij"-label in beeld; bestandsnamen liggen vast zodat echte beelden 1-op-1 vervangen zonder codewijziging | Echte fotografie/renders van de opdrachtgever, zelfde bestandsnamen |
| Drop-einddatum countdown | 2026-08-15 22:00 CEST (~2 weken na oplevering), constante DROP_ENDS_AT in app/page.tsx | Echte drop-planning |
| Newsletter-submit | Alleen een success-melding client-side, geen mailinglijst-koppeling | Keuze mailingprovider (Shopify Email, Klaviyo, …) |

## Oorspronkelijke log (glaswerk-fase)

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
| Shopify MCP-token verlopen tijdens stap 2 — catalogus (glastypes, inhoud-waarden) kon niet gelezen worden | Filters leiden zichzelf af uit de live data: glastype = `productType`, inhoud = productoptie "Inhoud"/"Volume" (of ml/cl-tags zoals "350ml"), genormaliseerd naar ml | Herautoriseer de Shopify-connector in je claude.ai-instellingen; dan verifieer ik de aannames tegen de echte producten |
| Bron voor "inhoud in ml" niet gedefinieerd in Figma of brief | Optie-naam matcht op inhoud/volume/capacity, waarde op `<getal> ml\|cl\|l`; tags als fallback | Hoe inhoud in Shopify is vastgelegd (optie, metafield of tag) |
| Sorteeropties niet gespecificeerd | Nieuwste (default), prijs laag–hoog, prijs hoog–laag | Figma-frame van de PLP-filterbalk |
| Catalogusgrootte onbekend | PLP haalt max. 100 producten in één call en filtert/sorteert server-side (passend bij ambachtelijk aanbod); URL-searchParams dragen de filterstaat | Werkelijk aantal producten in de store; boven ~100 bouw ik paginering + Storefront-side filtering |
| Filterbalk-ontwerp ontbreekt (geen Figma) | Sobere balk boven het grid: toggle-knoppen per glastype en inhoud (aria-pressed), select voor sorteren, resultaat-teller met aria-live | Figma-frame van de PLP |

| Zichtbaarheid van de eigenaar niet gespecificeerd, later aangescherpt: naam mag nergens opduiken | Eigenaarsaccounts zijn uitgefilterd in de leesregels van *Gebruikers* én van het logboek (`verborgen`-vlag). De eerste beheerder ziet zichzelf als hoogste rol; de optie "Eigenaar" bestaat in zijn keuzelijst niet | Bevestig of de eigenaar ook onzichtbaar moet blijven in toekomstige exports/rapportages |
| Wie mag aanmeldingen goedkeuren? Eerst "alleen de eigenaar", daarna "de beheerder moet echte rechten hebben" | Beheerders keuren goed, weigeren en blokkeren. Alleen een eigenaar kan de eigenaarsrol toekennen/intrekken en een eigenaar wijzigen of verwijderen; de laatste eigenaar kan nooit weg | Bevestig dat een beheerder inderdaad zelfstandig mag goedkeuren |
| Adres van de privé-inlogpagina van de eigenaar niet opgegeven | `/aanmelden` is publiek; `/eigenaar` is de privé-ingang: nergens gelinkt, `noindex`, en alleen een goedgekeurde eigenaar komt erdoor. Mislukte pogingen daar zijn alleen voor de eigenaar zichtbaar | Geef een ander pad door als je een minder voor de hand liggend adres wilt |
| Regio van de Railway-bucket onbekend | Default `us-east-1` in plaats van `auto` — `auto` bestaat alleen bij Cloudflare R2 en laat de SDK naar `s3.auto.amazonaws.com` zoeken | Vul `BUCKET_REGION` met de regio uit de bucket-variabelen van Railway |
| Exacte vorm van `BUCKET_ENDPOINT` bij Railway Object Storage niet te verifiëren (netwerkpolicy blokkeert railway.com) | De waarde wordt genormaliseerd: `https://` wordt toegevoegd als het ontbreekt, een slash op het eind en een meegekopieerde bucketnaam worden verwijderd. `forcePathStyle` blijft aan (MinIO-achtige opslag) | Plak de bucket-variabelen uit Railway; dan controleer ik de exacte vorm |
| Afzenderadres voor e-mail niet opgegeven | `RESEND_FROM_ADDRESS`, met terugval `beheer@artchy.nl`; zonder `RESEND_API_KEY` gaan er geen mails uit en blijft de rest werken | Kies het definitieve afzenderadres en verifieer het domein bij Resend |

| Live bleek de database al te bestaan; de schema.sql-aanpak draaide alleen op een lege database en liet /admin crashen op de nieuwe kolommen | Vervangen door echte migraties (`payload/migraties/`, `prodMigrations`): bij het opstarten in productie draait Payload automatisch wat nog niet is geweest. Bestaande gebruikers worden op "goedgekeurd" gezet en de oudste gebruiker wordt eigenaar; oude logregels krijgen met terugwerkende kracht een actie en eigenaarsregels worden verborgen | Controleer na de deploy of jouw account inderdaad de eigenaar is geworden |

**Nooit verzonnen (bewust):** prijzen, voorraad, varianten en SKU's. Die
komen uitsluitend uit Shopify; zonder keys faalt de weergave hard met een
duidelijke melding in plaats van mock-data.
