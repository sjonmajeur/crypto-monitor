import type { GlobalConfig } from "payload";

const beeldHint = (formaat: string) =>
  `Aanbevolen formaat: ${formaat}. Laat leeg om de huidige foto van de site te blijven gebruiken.`;

/**
 * Alle teksten en beelden van de homepage, in dezelfde volgorde als de
 * pagina zelf. Elk veld heeft een Nederlandse uitleg voor beheerders.
 */
export const Homepage: GlobalConfig = {
  slug: "homepage",
  label: "Homepage",
  admin: {
    // Technische API-tab verbergen: beheerders hebben er niets aan.
    hideAPIURL: true,
    group: "Inhoud",
    description:
      "Alles wat op de voorpagina staat. Wijzigingen zijn pas zichtbaar op de site nadat je op Publiceren klikt.",
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  versions: { drafts: true, max: 20 },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Bovenkant",
          description: "De balk bovenaan en de grote foto met tekst.",
          fields: [
            {
              name: "aankondiging",
              type: "group",
              label: "Aankondigingsbalk",
              fields: [
                {
                  name: "accentTekst",
                  type: "text",
                  label: "Tekst in goud",
                  admin: { description: 'Bijvoorbeeld "Limited drop".' },
                },
                {
                  name: "tekst",
                  type: "text",
                  label: "Tekst erachter",
                  admin: { description: 'Bijvoorbeeld "now live".' },
                },
                {
                  name: "tweedeTekst",
                  type: "text",
                  label: "Tekst na de stip",
                  admin: {
                    description: 'Bijvoorbeeld "Free shipping above €100".',
                  },
                },
              ],
            },
            {
              name: "hero",
              type: "group",
              label: "Grote foto bovenaan (hero)",
              fields: [
                {
                  name: "eyebrow",
                  type: "text",
                  label: "Kleine gouden regel boven de titel",
                  admin: { description: 'Bijvoorbeeld "Wearable art platform".' },
                },
                {
                  name: "titelRegels",
                  type: "array",
                  label: "Titel (één regel per blok)",
                  admin: {
                    description:
                      "De grote titel wordt per blok op een nieuwe regel gezet, bijv. WHERE / IMAGINATION / BECOMES IDENTITY.",
                  },
                  fields: [
                    { name: "regel", type: "text", label: "Regel", required: true },
                  ],
                },
                {
                  name: "knopTekst",
                  type: "text",
                  label: "Tekst op de knop",
                  admin: { description: 'Bijvoorbeeld "Shop the drop".' },
                },
                {
                  name: "knopLink",
                  type: "text",
                  label: "Adres van de knop",
                  admin: { description: 'Bijvoorbeeld "/shop".' },
                },
                {
                  name: "afbeelding",
                  type: "upload",
                  relationTo: "media",
                  label: "Foto (breed scherm)",
                  admin: { description: beeldHint("2300x630px, liggend") },
                },
                {
                  name: "afbeeldingMobiel",
                  type: "upload",
                  relationTo: "media",
                  label: "Foto (telefoon)",
                  admin: { description: beeldHint("1000x1400px, staand") },
                },
              ],
            },
          ],
        },
        {
          label: "Collecties",
          description: "De drie kaarten onder de grote foto.",
          fields: [
            {
              name: "collectiesTitel",
              type: "text",
              label: "Kop boven de kaarten",
              admin: { description: 'Bijvoorbeeld "Featured collections".' },
            },
            {
              name: "collecties",
              type: "array",
              label: "Collectiekaarten",
              maxRows: 6,
              admin: {
                description: "Drie kaarten geeft het mooiste beeld (één rij).",
              },
              fields: [
                { name: "titel", type: "text", label: "Titel", required: true },
                {
                  name: "tagline",
                  type: "textarea",
                  label: "Korte omschrijving",
                  admin: { description: "Twee tot drie korte regels." },
                },
                {
                  name: "link",
                  type: "text",
                  label: "Adres (link)",
                  admin: { description: 'Bijvoorbeeld "/shop?type=josh".' },
                },
                {
                  name: "afbeelding",
                  type: "upload",
                  relationTo: "media",
                  label: "Foto",
                  admin: { description: beeldHint("1200x1200px, vierkant") },
                },
              ],
            },
          ],
        },
        {
          label: "Hoe het werkt",
          description: 'De lichte sectie "How art becomes fashion".',
          fields: [
            { name: "stappenTitel", type: "text", label: "Kop" },
            { name: "stappenSubtitel", type: "text", label: "Regel onder de kop" },
            {
              name: "stappen",
              type: "array",
              label: "Stappen",
              maxRows: 4,
              admin: { description: "Vier stappen passen precies op één rij." },
              fields: [
                { name: "titel", type: "text", label: "Titel", required: true },
                { name: "tekst", type: "textarea", label: "Uitleg" },
              ],
            },
          ],
        },
        {
          label: "Drop",
          description: "De zwarte sectie met de aftelklok.",
          fields: [
            { name: "dropEyebrow", type: "text", label: "Kleine gouden regel" },
            { name: "dropTitel", type: "textarea", label: "Grote kop" },
            { name: "dropSubregel", type: "text", label: "Regel onder de kop" },
            {
              name: "dropEinddatum",
              type: "date",
              label: "Einddatum aftelklok",
              admin: {
                date: { pickerAppearance: "dayAndTime" },
                description:
                  "De klok telt af naar dit moment. Staat de datum in het verleden, dan toont de klok nullen.",
              },
            },
            { name: "dropKnopTekst", type: "text", label: "Tekst op de knop" },
            { name: "dropKnopLink", type: "text", label: "Adres van de knop" },
            {
              name: "dropAfbeelding",
              type: "upload",
              relationTo: "media",
              label: "Foto",
              admin: { description: beeldHint("1000x1000px, vierkant") },
            },
          ],
        },
        {
          label: "Verhaal & community",
          description: "De onderste twee secties.",
          fields: [
            { name: "creatorsEyebrow", type: "text", label: "Kleine gouden regel bij de makers" },
            { name: "creatorsTitel", type: "text", label: "Kop bij de makers" },
            { name: "verhaalTitel", type: "text", label: "Kop van het verhaal" },
            {
              name: "verhaalTekst",
              type: "textarea",
              label: "Tekst van het verhaal",
              admin: { description: "Eén alinea van ongeveer 4 tot 6 regels." },
            },
            {
              name: "verhaalAfbeelding",
              type: "upload",
              relationTo: "media",
              label: "Foto bij het verhaal",
              admin: { description: beeldHint("1600x900px, liggend") },
            },
            { name: "communityTitel", type: "text", label: "Kop van de nieuwsbrief" },
            { name: "communityTekst", type: "text", label: "Regel onder de kop" },
            { name: "communityKnopTekst", type: "text", label: "Tekst op de knop" },
          ],
        },
      ],
    },
  ],
};
