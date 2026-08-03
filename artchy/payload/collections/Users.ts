import type { Access, CollectionConfig } from "payload";

import { ipUitHeaders, logLoginAttempt } from "../loginLog";

/** Payload typt user pas na codegen; daarom hier een losse check. */
function isBeheerder(user: unknown): boolean {
  return (user as { rol?: string } | null)?.rol === "beheerder";
}

const isAdmin: Access = ({ req }) => isBeheerder(req.user);

/**
 * Beheerders en redacteuren. Bij elke succesvolle login wordt een
 * record in "Inloggeschiedenis" weggeschreven (afterLogin-hook).
 */
export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Gebruiker", plural: "Gebruikers" },
  auth: true,
  admin: {
    // Technische API-tab verbergen: beheerders hebben er niets aan.
    hideAPIURL: true,
    useAsTitle: "email",
    defaultColumns: ["naam", "email", "rol"],
    group: "Beheer",
    description:
      "Wie mag inloggen op dit adminpaneel. Beheerders mogen alles; redacteuren mogen alleen teksten en foto's aanpassen.",
  },
  access: {
    // Alleen beheerders beheren gebruikers; iedereen mag zichzelf lezen.
    create: isAdmin,
    delete: isAdmin,
    update: ({ req, id }) => isBeheerder(req.user) || req.user?.id === id,
    read: () => true,
    admin: () => true,
  },
  fields: [
    {
      name: "naam",
      type: "text",
      label: "Naam",
      required: true,
      admin: { description: "Voor- en achternaam van deze gebruiker." },
    },
    {
      name: "rol",
      type: "select",
      label: "Rol",
      required: true,
      defaultValue: "redacteur",
      options: [
        { label: "Beheerder (alles, inclusief gebruikers)", value: "beheerder" },
        { label: "Redacteur (alleen teksten en foto's)", value: "redacteur" },
      ],
      access: {
        // Alleen een beheerder kan rollen wijzigen.
        update: ({ req }) => isBeheerder(req.user),
      },
      admin: {
        description:
          "Beheerders kunnen ook gebruikers aanmaken en de inloggeschiedenis bekijken.",
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        // De allereerste gebruiker is altijd beheerder, anders kan
        // niemand gebruikers beheren of de inloggeschiedenis inzien.
        if (operation !== "create") return data;
        try {
          const { totalDocs } = await req.payload.count({
            collection: "users",
          });
          if (totalDocs === 0) return { ...data, rol: "beheerder" };
        } catch {
          // Telt de database (nog) niet mee, dan de invoer laten staan.
        }
        return data;
      },
    ],
    afterLogin: [
      async ({ req, user }) => {
        logLoginAttempt(req.payload, {
          gebruikerId: user.id as number,
          email: user.email,
          ipAdres: ipUitHeaders(req.headers),
          resultaat: "gelukt",
        });
      },
    ],
  },
};

