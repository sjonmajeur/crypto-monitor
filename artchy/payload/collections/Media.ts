import type { CollectionConfig } from "payload";

/**
 * Alle afbeeldingen. Opslag gaat naar de Railway-bucket (S3-compatible)
 * via @payloadcms/storage-s3 — niet naar de lokale schijf, die na elke
 * deploy leeg is.
 */
export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Afbeelding", plural: "Afbeeldingen" },
  admin: {
    group: "Inhoud",
    description:
      "Alle foto's van de website. Upload hier nieuwe beelden en kies ze daarna in een pagina.",
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  upload: {
    mimeTypes: ["image/*"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Alt-tekst (beschrijving)",
      required: true,
      admin: {
        description:
          "Korte beschrijving van wat er op de foto staat. Wordt voorgelezen door schermlezers en getoond als de foto niet laadt.",
      },
    },
  ],
};
