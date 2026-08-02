# Railway instellen voor het adminpaneel

Eenmalige klusjes in het Railway-dashboard. Daarna werkt `/admin` en
kun je alles vanuit de browser beheren. Reken op ongeveer 15 minuten.

> Zonder deze stappen blijft de **website gewoon werken** met de huidige
> teksten en foto's. Alleen `/admin` toont dan de melding "Adminpaneel
> nog niet ingesteld".

---

## Stap 1 — Postgres-database toevoegen

1. Open [railway.com](https://railway.com) en ga naar je project.
2. Klik op **+ New** (of **Create**) → **Database** → **Add PostgreSQL**.
3. Wacht tot de database groen is (± 1 minuut).

## Stap 2 — Bucket voor foto's toevoegen

1. Klik opnieuw op **+ New** → zoek op **Bucket** (Railway Object
   Storage) en voeg die toe.
2. Open de bucket → tabblad **Variables** en laat dit scherm open; je
   hebt de waarden zo nodig.

## Stap 3 — Variabelen zetten bij de website-service

1. Klik op je **website-service** (die met de ARTCHY-app, niet de
   database).
2. Ga naar het tabblad **Variables** → **+ New Variable**.
3. Voeg deze variabelen toe:

| Naam | Waarde |
| --- | --- |
| `DATABASE_URI` | De `DATABASE_URL` van je Postgres-service (kopieer die uit stap 1) |
| `PAYLOAD_SECRET` | Een lange willekeurige tekst, bijv. `k7Qw2xVn8pLm4RtZ9cBd3sYh6uJf1aEg` — verzin er zelf een van 30+ tekens |
| `BUCKET_NAME` | Uit de bucket-variabelen (stap 2) |
| `BUCKET_ACCESS_KEY_ID` | Uit de bucket-variabelen |
| `BUCKET_SECRET_ACCESS_KEY` | Uit de bucket-variabelen |
| `BUCKET_ENDPOINT` | Uit de bucket-variabelen (begint met `https://`) |
| `BUCKET_PUBLIC_HOSTNAME` | Het adres van je bucket zónder `https://`, bijv. `bucket-production-1234.up.railway.app` |

> **Tip:** Railway kan variabelen automatisch koppelen. Typ in het
> waardeveld `${{` en kies dan de Postgres- of bucket-service uit de
> lijst; dan blijft de waarde altijd kloppen.

4. Controleer dat deze er ook staan (van eerdere stappen):
   `NEXT_PUBLIC_SANDBOX`, `SHOPIFY_STORE_DOMAIN`,
   `SHOPIFY_STOREFRONT_ACCESS_TOKEN`.

## Stap 4 — Deployen

1. Klik bij de website-service op **Deploy** / **Redeploy**.
2. Wacht tot de deploy groen is (± 3 minuten).

Bij deze eerste start gebeurt er automatisch twee dingen: de database
krijgt de juiste tabellen, en het CMS wordt gevuld met de teksten die
nu op de site staan (inclusief Josh, Taji en Brass). Je begint dus niet
met een leeg paneel.

## Stap 5 — Het eerste beheerdersaccount aanmaken

1. Ga naar **jouw-website-adres/admin**.
2. Je krijgt automatisch het scherm **Create first user**.
3. Vul je naam, e-mailadres en een sterk wachtwoord in en klik op
   **Create**.
4. Je bent meteen ingelogd. Dit eerste account is de **beheerder**.

> Dit scherm verschijnt maar één keer. Daarna maak je extra gebruikers
> aan via **Gebruikers** in het menu.

## Stap 6 — Controleren

- Open `/admin` → je ziet **Homepage**, **Artiesten**, **Afbeeldingen**,
  **Footer & algemeen** en (als beheerder) **Gebruikers** en
  **Inloggeschiedenis**.
- Klik op **Inloggeschiedenis**: daar staat je eigen login al in.
- Wijzig een tekst op **Homepage**, klik **Publiceren** en ververs de
  website.

Verder gebruik staat in `HANDLEIDING-ADMIN.md`.

---

## Problemen oplossen

**"Adminpaneel nog niet ingesteld"**
`DATABASE_URI` ontbreekt of is verkeerd. Controleer stap 3 en redeploy.

**Foto's verdwijnen na een nieuwe deploy**
De bucket-variabelen ontbreken; uploads gaan dan naar de container, die
bij elke deploy leeg wordt. Controleer stap 2 en 3.

**Foto's laden niet op de website (leeg vlak)**
`BUCKET_PUBLIC_HOSTNAME` ontbreekt of klopt niet. Vul het hostname in
zonder `https://` en redeploy.

**Ik kan niet inloggen**
Gebruik **Forgot password** op de loginpagina. Werkt dat niet, dan kan
een andere beheerder je wachtwoord opnieuw instellen via **Gebruikers**.
