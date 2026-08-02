import type { CollectionConfig } from "payload";

/**
 * De artiesten (Josh, Taji, Brass). Wordt gebruikt op de homepage,
 * /artists en in de bio-popups.
 */
export const Artists: CollectionConfig = {
  slug: "artiesten",
  labels: { singular: "Artiest", plural: "Artiesten" },
  admin: {
    useAsTitle: "naam",
    defaultColumns: ["naam", "subtitel", "volgorde", "_status"],
    group: "Inhoud",
    description:
      "De makers achter ARTCHY. De volgorde bepaalt waar ze op de site staan.",
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
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
      label: "Webadres-naam (slug)",
      required: true,
      unique: true,
      admin: {
        description:
          'Kleine letters, geen spaties. Bepaalt de link naar de collectie, bijv. "josh" wordt /shop?type=josh.',
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
      label: "Korte tagline",
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
