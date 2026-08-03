import type { CollectionConfig } from "payload";

import { logVerwijdering, logWijziging } from "../logHooks";
import { isActief } from "../rechten";

/**
 * Alle afbeeldingen. Opslag gaat naar de Railway-bucket (S3-compatible)
 * via @payloadcms/storage-s3 — niet naar de lokale schijf, die na elke
 * deploy leeg is.
 */
export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Afbeelding", plural: "Afbeeldingen" },
  admin: {
    // Technische API-tab verbergen: beheerders hebben er niets aan.
    hideAPIURL: true,
    group: "Inhoud",
    description:
      "Alle foto's van de website. Upload hier nieuwe beelden en kies ze daarna in een pagina.",
  },
  access: {
    read: () => true,
    create: ({ req }) => isActief(req.user),
    update: ({ req }) => isActief(req.user),
    delete: ({ req }) => isActief(req.user),
  },
  hooks: {
    afterChange: [logWijziging("media", "filename")],
    afterDelete: [logVerwijdering("media", "filename")],
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
