import type { Access, CollectionConfig } from "payload";

/** Payload typt user pas na codegen; daarom hier een losse check. */
function isBeheerder(user: unknown): boolean {
  return (user as { rol?: string } | null)?.rol === "beheerder";
}

const isAdmin: Access = ({ req }) => isBeheerder(req.user);

/**
 * Alleen-lezen logboek van inlogpogingen. Records worden automatisch
 * aangemaakt door de afterLogin-hook (gelukt) en door de login-route
 * (mislukt). Alleen zichtbaar voor beheerders.
 */
export const LoginLog: CollectionConfig = {
  slug: "inloggeschiedenis",
  labels: { singular: "Inlogpoging", plural: "Inloggeschiedenis" },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "tijdstip", "resultaat", "ipAdres"],
    group: "Beheer",
    description:
      "Automatisch bijgehouden overzicht van inlogpogingen. Deze lijst is alleen-lezen.",
    hidden: ({ user }) => !isBeheerder(user),
  },
  access: {
    read: isAdmin,
    // Records ontstaan alleen automatisch (overrideAccess in de hooks).
    create: () => false,
    update: () => false,
    delete: isAdmin,
  },
  fields: [
    {
      name: "gebruiker",
      type: "relationship",
      relationTo: "users",
      label: "Gebruiker",
      admin: { readOnly: true },
    },
    {
      name: "email",
      type: "text",
      label: "E-mailadres",
      admin: { readOnly: true },
    },
    {
      name: "tijdstip",
      type: "date",
      label: "Tijdstip",
      admin: {
        readOnly: true,
        date: { pickerAppearance: "dayAndTime", displayFormat: "d MMM yyyy HH:mm" },
      },
    },
    {
      name: "ipAdres",
      type: "text",
      label: "IP-adres",
      admin: { readOnly: true },
    },
    {
      name: "resultaat",
      type: "select",
      label: "Resultaat",
      options: [
        { label: "Gelukt", value: "gelukt" },
        { label: "Mislukt", value: "mislukt" },
      ],
      admin: { readOnly: true },
    },
  ],
  timestamps: true,
};
