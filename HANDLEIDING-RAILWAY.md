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
| `BUCKET_NAME` | De naam van de bucket, bijv. `artchy-media`. **Alleen de naam**, geen adres |
| `BUCKET_ACCESS_KEY_ID` | Uit de bucket-variabelen |
| `BUCKET_SECRET_ACCESS_KEY` | Uit de bucket-variabelen |
| `BUCKET_ENDPOINT` | Het adres van de bucket **mét** `https://` en **zonder** de bucketnaam erachter, bijv. `https://bucket-production-1234.up.railway.app` |
| `BUCKET_REGION` | De regio uit de bucket-variabelen (Railway noemt die `REGION` of `AWS_REGION`), bijv. `us-west-1` |
| `BUCKET_PUBLIC_HOSTNAME` | Optioneel. Hetzelfde adres als `BUCKET_ENDPOINT` maar zónder `https://`. Laat je hem leeg, dan leidt de site hem zelf af |

> **Belangrijk bij `BUCKET_ENDPOINT`:** zonder `https://` ervoor mislukt
> elke upload met de melding *"Something went wrong."*, omdat de
> opslagsoftware er geen geldig adres van kan maken. Staat de bucketnaam
> er wél achter, dan komt die naam twee keer in het adres en zijn de
> foto's na het uploaden niet zichtbaar. De site corrigeert beide
> vormen tegenwoordig zelf, maar vul hem het liefst meteen goed in.

> **Tip:** Railway kan variabelen automatisch koppelen. Typ in het
> waardeveld `${{` en kies dan de Postgres- of bucket-service uit de
> lijst; dan blijft de waarde altijd kloppen.

4. Controleer dat deze er ook staan (van eerdere stappen):
   `NEXT_PUBLIC_SANDBOX`, `SHOPIFY_STORE_DOMAIN`,
   `SHOPIFY_STOREFRONT_ACCESS_TOKEN`.

## Stap 3b — E-mail aanzetten (Resend)

Het paneel stuurt zelf e-mails: een melding als iemand toegang aanvraagt,
en een bericht aan die persoon zodra je hem goedkeurt of weigert. Daar is
één gratis account voor nodig.

1. Ga naar **resend.com** en maak een account aan (gratis plan volstaat).
2. Klik links op **API Keys** → **Create API Key**. Geef hem een naam
   (bijv. `ARTCHY`), rechten **Sending access**, en klik op **Add**.
3. Kopieer de sleutel die verschijnt (begint met `re_`). Je ziet hem maar
   één keer.
4. Zet in Railway bij je website-service deze variabelen:

| Naam | Waarde |
| --- | --- |
| `RESEND_API_KEY` | De sleutel die je net kopieerde (`re_...`) |
| `RESEND_FROM_ADDRESS` | Het afzenderadres, bijv. `beheer@artchy.nl` |
| `RESEND_FROM_NAME` | De afzendernaam, bijv. `ARTCHY` |

5. Wil je vanaf je eigen domein versturen? Klik in Resend op **Domains**
   → **Add Domain**, vul `artchy.nl` in en zet de DNS-regels die Resend
   toont bij je domeinprovider. Zolang dat niet is gedaan, gebruik je als
   `RESEND_FROM_ADDRESS` het testadres `onboarding@resend.dev`.

> Vul je `RESEND_API_KEY` niet in, dan blijft het paneel gewoon werken:
> er gaan alleen geen e-mails uit. Je ziet nieuwe aanmeldingen dan zelf
> bij **Gebruikers**.

## Stap 4 — Deployen

1. Klik bij de website-service op **Deploy** / **Redeploy**.
2. Wacht tot de deploy groen is (± 3 minuten).

Bij deze eerste start gebeurt er automatisch twee dingen: de database
krijgt de juiste tabellen (uit `artchy/payload/schema.sql`), en het CMS
wordt gevuld met de teksten die nu op de site staan (inclusief Josh,
Taji en Brass). Je begint dus niet met een leeg paneel.

## Stap 5 — Het eerste beheerdersaccount aanmaken

1. Ga naar **jouw-website-adres/admin**.
2. Je krijgt automatisch het scherm **Create first user**.
3. Vul je naam, e-mailadres en een sterk wachtwoord in en klik op
   **Create**.
4. Je bent meteen ingelogd. Dit eerste account krijgt automatisch de
   hoogste rol en staat meteen op *Goedgekeurd*.

> Dit scherm verschijnt maar één keer. Daarna melden nieuwe mensen zich
> zelf aan via **/aanmelden** en keur jij ze goed bij **Gebruikers**.

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
`BUCKET_PUBLIC_HOSTNAME` klopt niet. Laat hem leeg (dan wordt hij
afgeleid uit `BUCKET_ENDPOINT`) of vul exact dezelfde host in, zonder
`https://`. Daarna redeployen.

**Uploaden mislukt met "Something went wrong."**
Bijna altijd `BUCKET_ENDPOINT`. Controleer op deze volgorde:

1. Begint de waarde met `https://`? Zo niet, zet het ervoor.
2. Staat de bucketnaam achter het adres (`.../artchy-media`)? Haal dat
   stuk weg — dat hoort in `BUCKET_NAME`.
3. Staat er een `/` op het eind? Haal die weg.
4. Is `BUCKET_REGION` gevuld met de regio uit de bucket-variabelen?
5. Kloppen `BUCKET_ACCESS_KEY_ID` en `BUCKET_SECRET_ACCESS_KEY`?

Redeploy daarna. In de logs van de website-service staat bij het starten
één regel die vertelt wat de app gebruikt:
`Media-opslag: https://... /... (regio ...)`. Staat er in plaats daarvan
*"Bucket niet volledig ingesteld"*, dan mist er nog een variabele.

**Ik kan niet inloggen**
Gebruik **Forgot password** op de loginpagina. Werkt dat niet, dan kan
een andere beheerder je wachtwoord opnieuw instellen via **Gebruikers**.


---

## Voor de ontwikkelaar: schema bijwerken

De tabellen worden bij een lege database aangemaakt uit
`artchy/payload/schema.sql`. Payload werkt het schema namelijk alleen
automatisch bij buiten productie.

Voeg je later velden toe aan een collectie of global, genereer dit
bestand dan opnieuw:

```bash
cd artchy
# 1. draai de dev-server één keer tegen een (test)database:
DATABASE_URI=postgresql://... PAYLOAD_SECRET=... npm run dev
# 2. dump het bijgewerkte schema:
pg_dump "$DATABASE_URI" --schema-only --no-owner --no-privileges \
  --no-comments | grep -v '^\\restrict\|^\\unrestrict' \
  > payload/schema.sql
```

Bij een bestaande productiedatabase moeten nieuwe kolommen daarna
handmatig worden toegevoegd (`ALTER TABLE ...`), of laat Payload dat
doen door de dev-server één keer tegen die database te draaien.
