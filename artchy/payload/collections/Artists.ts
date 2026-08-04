import type { CollectionConfig } from "payload";

import { logVerwijdering, logWijziging } from "../logHooks";
import { isActief } from "../rechten";

/**
 * Adressen die al bestaan op de site; een artiest mag die niet als
 * webadres-naam krijgen, anders verdwijnt zijn pagina achter een
 * bestaande route.
 */
const GERESERVEERDE_SLUGS = [
  "shop",
  "artists",
  "about",
  "how-it-works",
  "checkout",
  "order",
  "product",
  "sandbox",
  "aanmelden",
  "eigenaar",
  "admin",
  "api",
];

/**
 * De artiesten (Josh, Taji, Brass). Wordt gebruikt op de homepage,
 * /artists en in de bio-popups.
 */
export const Artists: CollectionConfig = {
  slug: "artiesten",
  labels: { singular: "Artiest", plural: "Artiesten" },
  admin: {
    // Technische API-tab verbergen: beheerders hebben er niets aan.
    hideAPIURL: true,
    useAsTitle: "naam",
    defaultColumns: ["naam", "subtitel", "volgorde", "_status"],
    group: "Inhoud",
    description:
      "De makers achter ARTCHY. De volgorde bepaalt waar ze op de site staan.",
  },
  access: {
    read: () => true,
    // Alleen goedgekeurde gebruikers mogen schrijven. Wie nog in
    // afwachting is, kan hier niets — ook niet via de API.
    create: ({ req }) => isActief(req.user),
    update: ({ req }) => isActief(req.user),
    delete: ({ req }) => isActief(req.user),
  },
  hooks: {
    afterChange: [logWijziging("artiesten", "naam")],
    afterDelete: [logVerwijdering("artiesten", "naam")],
  },
  versions: { drafts: true, maxPerDoc: 20 },
  defaultSort: "volgorde",
  fields: [
    {
      name: "naam",
      type: "text",
      label: "Naam",
      required: true,
      admin: { description: 'Bijvoorbeeld "Josh". Wordt in hoofdletters getoond.' },
    },
    {
      name: "slug",
      type: "text",
      label: "Webadres-naam",
      required: true,
      unique: true,
      validate: (waarde: unknown) => {
        const slug = String(waarde ?? "").toLowerCase();
        if (!/^[a-z0-9-]+$/.test(slug)) {
          return "Alleen kleine letters, cijfers en streepjes.";
        }
        if (GERESERVEERDE_SLUGS.includes(slug)) {
          return `"${slug}" is al een pagina van de site; kies een andere naam.`;
        }
        return true;
      },
      admin: {
        description:
          'Kleine letters, geen spaties. Bepaalt het adres van de eigen pagina (bijv. "josh" wordt /josh) én de shop-link /shop?type=josh.',
      },
    },
    {
      name: "subtitel",
      type: "text",
      label: "Subtitel",
      required: true,
      admin: {
        description:
          'De gouden regel onder de naam, bijvoorbeeld "The young visionary".',
      },
    },
    {
      name: "tagline",
      type: "textarea",
      label: "Korte omschrijving",
      required: true,
      admin: {
        description:
          "Eén à twee korte zinnen op de kaart. Houd het kort: langere teksten worden afgekapt.",
      },
    },
    {
      name: "bio",
      type: "richText",
      label: "Volledige bio",
      admin: {
        description:
          "De tekst in het pop-upvenster. Gebruik Enter voor een nieuwe alinea.",
      },
    },
    {
      name: "portret",
      type: "upload",
      relationTo: "media",
      label: "Portretfoto",
      admin: {
        description:
          "Staand beeld. Aanbevolen formaat: 1200x1500px (verhouding 4:5), JPG.",
      },
    },
    {
      name: "pagina",
      type: "group",
      label: "Eigen pagina",
      admin: {
        description:
          "De eigen pagina van deze artiest (bijv. /josh). Zelfde opzet als de Taji-pagina.",
      },
      fields: [
        {
          name: "eyebrow",
          type: "text",
          label: "Gouden regel boven de kop",
          admin: { description: 'Bijvoorbeeld "The emotion creature".' },
        },
        {
          name: "kop",
          type: "text",
          label: "Grote kop",
          admin: { description: "Laat leeg om de naam van de artiest te gebruiken." },
        },
        {
          name: "tekst",
          type: "richText",
          label: "Verhaal",
          admin: { description: "Het verhaal op de pagina. Enter geeft een nieuwe alinea." },
        },
        {
          name: "beelden",
          type: "array",
          label: "Beelden",
          maxRows: 4,
          admin: {
            description:
              "Foto's op de pagina. Laat leeg om alleen tekst te tonen.",
          },
          fields: [
            {
              name: "beeld",
              type: "upload",
              relationTo: "media",
              label: "Foto",
              required: true,
            },
          ],
        },
        {
          name: "binnenkort",
          type: "text",
          label: "Binnenkort-regel",
          admin: {
            description: 'Bijvoorbeeld "The full world of Taji is coming soon." Laat leeg om geen regel te tonen.',
          },
        },
        { name: "knopTekst", type: "text", label: "Tekst op de shop-knop" },
        {
          name: "knopLink",
          type: "text",
          label: "Adres van de shop-knop",
          admin: { description: 'Bijvoorbeeld "/shop?type=josh".' },
        },
      ],
    },
    {
      name: "volgorde",
      type: "number",
      label: "Volgorde",
      defaultValue: 1,
      admin: {
        description: "Laag getal staat vooraan (1, 2, 3...).",
        position: "sidebar",
      },
    },
  ],
};
