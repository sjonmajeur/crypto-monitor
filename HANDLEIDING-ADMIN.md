# Handleiding: het adminpaneel gebruiken

Deze handleiding is voor beheerders van de ARTCHY-website. Je hebt
**geen programmeerkennis nodig** en je komt nooit meer in GitHub: alles
gaat via een beveiligd beheerpaneel in de browser.

> **Let op:** producten, prijzen en voorraad staan in **Shopify**, niet
> hier. In dit paneel beheer je de teksten en foto's van de website.

---

## 1. Inloggen

1. Ga naar **jouw-website-adres/admin** (bijvoorbeeld
   `https://artchy.up.railway.app/admin`).
2. Vul je e-mailadres en wachtwoord in en klik op **Login**.
3. Wachtwoord vergeten? Klik op **Forgot password** — je krijgt een
   e-mail om een nieuw wachtwoord in te stellen.

Zie je de melding "Adminpaneel nog niet ingesteld"? Dan mist de
database nog. Volg dan eerst de stappen in `HANDLEIDING-RAILWAY.md`.

---

## 2. Wat kun je aanpassen?

Links in het menu staan twee groepen:

**Inhoud**
- **Homepage** — alle teksten en foto's van de voorpagina.
- **Artiesten** — Josh, Taji en Brass: naam, subtitel, tagline, bio en
  portretfoto.
- **Afbeeldingen** — de fotobibliotheek.
- **Footer & algemeen** — het menu bovenaan, de footer en social-links.

**Beheer** (alleen zichtbaar voor beheerders)
- **Gebruikers** — wie mag inloggen.
- **Inloggeschiedenis** — wie wanneer heeft ingelogd.

---

## 3. Een tekst wijzigen

1. Klik in het menu op **Homepage** (of **Artiesten** → kies een naam).
2. De velden staan gegroepeerd in tabbladen: *Bovenkant*, *Collecties*,
   *Hoe het werkt*, *Drop*, *Verhaal & community*.
3. Klik in een veld en typ je nieuwe tekst. Onder elk veld staat een
   korte uitleg over wat het doet.
4. Klik rechtsboven op **Publiceren** (zie stap 5 over opslaan).

---

## 4. Een foto vervangen

1. Ga naar de pagina waar de foto staat (bijv. **Homepage** →
   tabblad *Bovenkant* → *Foto (breed scherm)*).
2. Klik op **Choose from existing** om een bestaande foto te kiezen, of
   op **Upload** om een nieuwe te uploaden.
3. Sleep je foto in het venster of klik om te bladeren.
4. Vul de **Alt-tekst** in: een korte beschrijving van wat er op de foto
   staat. Dit is verplicht en helpt slechtzienden en Google.
5. Klik op **Save**, daarna op **Publiceren**.

**Aanbevolen formaten** (staan ook bij elk veld vermeld):

| Waar | Formaat |
| --- | --- |
| Grote foto bovenaan (breed scherm) | 2300 × 630 px, liggend |
| Grote foto bovenaan (telefoon) | 1000 × 1400 px, staand |
| Collectiekaart | 1200 × 1200 px, vierkant |
| Portret artiest | 1200 × 1500 px, staand |
| Drop-foto | 1000 × 1000 px, vierkant |
| Verhaal-foto | 1600 × 900 px, liggend |

Gebruik bij voorkeur JPG. Foto's mogen groter zijn dan aanbevolen; ze
worden automatisch verkleind voor bezoekers.

---

## 5. Opslaan versus publiceren — belangrijk

Rechtsboven zie je twee knoppen:

- **Save draft** (concept opslaan) — je wijziging wordt bewaard maar
  bezoekers zien hem **nog niet**. Handig om iets voor te bereiden.
- **Publiceren** — je wijziging gaat **live** op de website.

Onder **Versions** (of *Versies*) zie je alle eerdere versies. Klik op
een oude versie en daarna op **Restore** om terug te gaan naar hoe het
was. Er gaat dus nooit iets definitief verloren.

Na publiceren duurt het meestal enkele seconden tot een paar minuten
voordat je het op de website ziet. Ververs de pagina.

---

## 6. Een artiest toevoegen of wijzigen

1. Klik op **Artiesten**.
2. Klik op een bestaande naam om te wijzigen, of rechtsboven op
   **Create new** voor een nieuwe.
3. Vul in:
   - **Naam** — bijv. `Josh`
   - **Webadres-naam (slug)** — kleine letters zonder spaties, bijv.
     `josh`. Dit bepaalt de link naar de collectie.
   - **Subtitel** — de gouden regel, bijv. `The young visionary`
   - **Korte tagline** — één à twee zinnen op de kaart
   - **Volledige bio** — de tekst in het pop-upvenster; druk op Enter
     voor een nieuwe alinea
   - **Portretfoto** — staand beeld
   - **Volgorde** — 1 staat vooraan
4. Klik op **Publiceren**.

De nieuwe artiest verschijnt automatisch op de homepage, op de
Artists-pagina én in het uitklapmenu bovenaan.

---

## 7. Gebruikers beheren (alleen beheerders)

1. Klik op **Gebruikers** → **Create new**.
2. Vul naam, e-mailadres en een wachtwoord in.
3. Kies de **rol**:
   - **Beheerder** — mag alles, inclusief gebruikers en
     inloggeschiedenis.
   - **Redacteur** — mag teksten en foto's aanpassen, maar geen
     gebruikers beheren.
4. Klik op **Save**.

---

## 8. Inloggeschiedenis bekijken

Klik in het menu (groep *Beheer*) op **Inloggeschiedenis**. Je ziet per
regel: e-mailadres, tijdstip, resultaat (gelukt of mislukt) en het
IP-adres. Deze lijst wordt automatisch bijgehouden en kan niet worden
aangepast — alleen een beheerder kan hem inzien.

---

## 9. Veelgestelde vragen

**Ik zie mijn wijziging niet op de website.**
Heb je op *Publiceren* geklikt (en niet alleen op *Save draft*)? Ververs
daarna de pagina.

**Ik heb per ongeluk iets verwijderd.**
Open het document, ga naar **Versions** en herstel een eerdere versie.

**Mijn foto staat scheef of afgesneden.**
De site snijdt foto's automatisch bij naar een vaste verhouding. Gebruik
het aanbevolen formaat en zet het onderwerp in het midden.

**Kan ik prijzen of producten aanpassen?**
Nee, dat doe je in Shopify. Dit paneel gaat alleen over de teksten en
foto's van de website.
