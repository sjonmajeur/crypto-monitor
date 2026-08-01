# Handleiding: zelf teksten en foto's aanpassen

Deze handleiding is voor de eigenaar van de ARTCHY-site. Je hebt **geen
programmeerkennis nodig** — alles gaat via de GitHub-website in de
browser. Twee dingen kun je zelf aanpassen: **foto's** en de
**artiest-teksten** (naam, subtitel, tagline en bio).

---

## 1. Een foto vervangen

Alle vervangbare foto's staan in de map `artchy/public/` en hebben een
vaste naam. Vervang je een bestand door een nieuw bestand **met exact
dezelfde naam**, dan verschijnt de nieuwe foto automatisch overal op de
site waar hij gebruikt wordt.

| Bestandsnaam | Waar hij staat |
| --- | --- |
| `hero.jpg` | grote foto bovenaan de homepage (desktop) |
| `hero-mobile.jpg` | grote foto bovenaan de homepage (telefoon) |
| `collection-josh.jpg` | kaart "Josh" bij Featured Collections |
| `collection-taji.jpg` | kaart "Taji" bij Featured Collections |
| `collection-brass.jpg` | kaart "Brass" bij Featured Collections |
| `drop-hoodie.jpg` | hoodie-foto in de drop-sectie |
| `creator-josh.jpg` | portret van Josh (homepage, Artists-pagina en bio-popup) |
| `creator-taji.jpg` | TAJI-artwork (homepage, Artists-pagina en bio-popup) |
| `creator-brass.jpg` | portret van Brass (homepage, Artists-pagina en bio-popup) |
| `generation.jpg` | foto bij "A new generation of creativity" |
| `logo-taji.png` | het logo-figuurtje in de menubalk |

**Eisen aan de foto:**
- Formaat: `.jpg` (het logo is `.png`)
- Liefst **minimaal 1000 pixels breed**
- Portretten (`creator-…`) liefst **staand** (hoger dan breed)
- De bestandsnaam moet **exact** kloppen, inclusief kleine letters en
  streepje — dus `creator-josh.jpg`, niet `Creator-Josh.JPG`

**Stap voor stap:**

1. Ga naar de repository op github.com en log in.
2. Klik op de map **`artchy`**, daarna op de map **`public`**.
3. Klik rechtsboven op **"Add file"** → **"Upload files"**.
4. Sleep je nieuwe foto in het venster (of klik "choose your files").
   Zorg dat hij **precies dezelfde naam** heeft als het bestand dat je
   wilt vervangen — GitHub overschrijft dan het oude bestand.
5. Klik onderaan op de groene knop **"Commit changes"**.

Klaar — zie hieronder bij "Wat gebeurt er daarna?".

---

## 2. Artiest-teksten aanpassen (naam, subtitel, tagline, bio)

Alle teksten van de drie artiesten staan in één bestand:
**`artchy/content/artists.json`**. Wat daar staat, verschijnt
automatisch op de homepage, op de Artists-pagina én in de bio-popups.

**Stap voor stap:**

1. Ga naar de repository op github.com.
2. Klik naar **`artchy`** → **`content`** → **`artists.json`**.
3. Klik rechtsboven op het **potlood-icoon** ("Edit this file").
4. Pas de tekst aan **tussen de aanhalingstekens**. Bijvoorbeeld:
   `"tagline": "Raw imagination. Limitless creativity."` — je wijzigt
   alleen het stuk tussen de tweede set aanhalingstekens.
5. De bio bestaat uit losse alinea's: elke alinea staat tussen zijn
   eigen aanhalingstekens, met een komma erachter (behalve de laatste).
   Wil je een alinea toevoegen? Kopieer een bestaande regel, plak hem
   eronder en pas de tekst aan.
6. Klik rechtsboven op de groene knop **"Commit changes"** (twee keer:
   eerst de knop, dan bevestigen).

**⚠️ Let op — de valkuilen van dit bestand:**
- **Laat alle aanhalingstekens, komma's en haakjes staan.** Verwijder
  je er per ongeluk één, dan doet de site het niet meer na de volgende
  deploy. Twijfel je? Maak de wijziging ongedaan en probeer opnieuw.
- Gebruik **geen** gewone aanhalingstekens ín je tekst; gebruik dan een
  apostrof (') of schrijf de zin anders.
- Wijzig je de **naam** van een artiest, dan verandert ook zijn
  shop-filterlink (bijv. `/shop?type=josh`). Even melden bij je
  developer als je een naam wijzigt.
- De regel die begint met `"_uitleg"` is uitleg — laten staan, mag ook
  weg, maar niets ertussenin slopen.

---

## 3. Wat gebeurt er daarna?

1. Je wijziging komt met de "Commit changes"-knop op de **main-branch**
   van de repository.
2. **Railway bouwt de site opnieuw.** Is de Railway GitHub App
   geïnstalleerd, dan gebeurt dat automatisch binnen ± 5 minuten. Zo
   niet: open het Railway-dashboard → je project → klik **"Deploy"** /
   **"Redeploy"** bij de service.
3. Na een paar minuten staat de wijziging live. De site is zo gebouwd
   dat bezoekers **altijd de nieuwste versie** zien — een gewone
   refresh volstaat, geen harde refresh nodig.

**Iets kapot?** Geen paniek: op GitHub kun je bij het bestand via
"History" elke eerdere versie terugzetten, of vraag je developer om de
laatste commit terug te draaien.
