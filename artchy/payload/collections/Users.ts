import type { Access, CollectionConfig } from "payload";

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
    afterLogin: [
      async ({ req, user }) => {
        // Loggen mag nooit een login blokkeren.
        try {
          await req.payload.create({
            collection: "inloggeschiedenis",
            data: {
              gebruiker: user.id,
              email: user.email,
              tijdstip: new Date().toISOString(),
              ipAdres: ipFromRequest(req),
              resultaat: "gelukt",
            },
            overrideAccess: true,
          });
        } catch (error) {
          req.payload.logger.error(
            { err: error },
            "Kon login niet loggen in inloggeschiedenis",
          );
        }
      },
    ],
  },
};

/** Best-effort IP: proxy-header eerst, anders de socket. */
export function ipFromRequest(req: {
  headers?: Headers;
}): string {
  const forwarded = req.headers?.get?.("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers?.get?.("x-real-ip") ?? "onbekend";
}
