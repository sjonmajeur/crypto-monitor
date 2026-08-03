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
2. Vul je e-mailadres en wachtwoord in en klik op **Inloggen**.
3. Wachtwoord vergeten? Klik op **Wachtwoord vergeten?** — je krijgt een
   e-mail om een nieuw wachtwoord in te stellen.

Nog geen account? Ga naar **jouw-website-adres/aanmelden** en vraag
toegang aan. Je kunt pas inloggen nadat een beheerder je heeft
goedgekeurd; je krijgt daar bericht van per e-mail.

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

## 7. Gebruikers beheren

### Iemand vraagt zelf toegang aan

Nieuwe mensen maken zelf een account aan op **jouw-website-adres/aanmelden**.
Ze vullen daar naam, e-mailadres en een wachtwoord in. Zo'n account staat
meteen op **In afwachting van goedkeuring** en kan nog helemaal niets:
geen teksten wijzigen, geen foto's uploaden, geen gebruikers zien. Ook
niet via een omweg — dat is in de software zelf dichtgezet, niet alleen
in de knoppen.

Zodra iemand zich aanmeldt, krijg je een e-mail met de naam, het
e-mailadres, het tijdstip en een directe link naar de aanvraag.

### Iemand goedkeuren

1. Klik in het menu (groep *Beheer*) op **Gebruikers**.
2. Klik op de naam van de persoon die op *In afwachting van goedkeuring*
   staat.
3. Zet rechts **Status** op **Goedgekeurd**.
4. Kies rechts de juiste **Rol**:
   - **Beheerder** — mag alles, inclusief gebruikers goedkeuren en het
     activiteitenlogboek inzien.
   - **Redacteur** — mag teksten en foto's aanpassen, maar geen
     gebruikers beheren.
5. Klik op **Opslaan**.

De persoon krijgt automatisch een e-mail dat hij kan inloggen.

### Iemand weigeren of blokkeren

Zet **Status** op **Geweigerd** (bij een aanvraag die je niet wilt) of op
**Geblokkeerd** (bij iemand die eerder wél toegang had). In beide
gevallen kan die persoon niets meer. Bij *Geweigerd* gaat er een korte,
nette e-mail naar de aanvrager; bij *Geblokkeerd* niet.

### Zelf iemand aanmaken

Kan ook: **Gebruikers** → **Nieuw aanmaken**. Vul naam, e-mailadres en
wachtwoord in, zet Status op *Goedgekeurd* en kies de rol.

---

## 8. Activiteitenlogboek bekijken

Klik in het menu (groep *Beheer*) op **Activiteitenlogboek**. Hierin komt
automatisch elke handeling te staan:

| Kolom | Wat het betekent |
| --- | --- |
| Tijdstip | Wanneer het gebeurde |
| Naam | Wie het deed |
| Actie | Ingelogd, uitgelogd, inloggen mislukt, aangemaakt, gewijzigd, verwijderd, gepubliceerd, aanmelding ontvangen, goedgekeurd, geweigerd, geblokkeerd, rol gewijzigd |
| Onderdeel | Waar het over ging, bijv. *Homepage*, *Artiest: Brass* of *Gebruiker: Tom Jansen* |
| IP-adres | Vanaf welk apparaat/netwerk |

Zoeken kan met de zoekbalk; filteren op actie of onderdeel via de knop
**Filters**.

Dit logboek is **alleen-lezen voor iedereen**. Niemand kan er een regel
in aanpassen of uit verwijderen — ook een beheerder niet. Daardoor is het
bruikbaar als bewijs van wat er is gebeurd.

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

**Iemand heeft zich aangemeld maar kan nog niets.**
Dat klopt: een nieuw account staat op *In afwachting van goedkeuring*.
Ga naar **Gebruikers**, zet de status op *Goedgekeurd* en kies een rol.

**Kan ik een regel uit het activiteitenlogboek verwijderen?**
Nee. Dat kan niemand — juist daarom is het logboek betrouwbaar.

**Kan ik prijzen of producten aanpassen?**
Nee, dat doe je in Shopify. Dit paneel gaat alleen over de teksten en
foto's van de website.
