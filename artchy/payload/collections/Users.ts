import type { AccessResult, CollectionConfig } from "payload";

import { ipUitHeaders, logActiviteit } from "../activiteitenlog";
import { stuurGoedgekeurdMail, stuurGeweigerdMail } from "../email";
import {
  isActieveBeheerder,
  isActieveEigenaar,
  isEigenaar,
  ROL_OPTIES,
  STATUS_OPTIES,
} from "../rechten";

/**
 * Beheerders van de site.
 *
 * Beveiliging zit in de access-regels en hooks, niet in de UI:
 * - alleen een eigenaar kan de rol "eigenaar" toekennen of intrekken;
 * - alleen een eigenaar keurt nieuwe aanmeldingen goed;
 * - een eigenaar kan niet door een ander worden verwijderd, gewijzigd
 *   of geblokkeerd;
 * - de laatste eigenaar kan nooit worden verwijderd;
 * - wie niet goedgekeurd is, kan niets (ook niet via de API).
 */
export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Gebruiker", plural: "Gebruikers" },
  auth: true,
  admin: {
    hideAPIURL: true,
    useAsTitle: "email",
    defaultColumns: ["naam", "email", "rol", "status"],
    group: "Beheer",
    description:
      "Wie mag inloggen op dit paneel. Nieuwe aanmeldingen staan op 'in afwachting' en kunnen niets tot ze zijn goedgekeurd.",
  },
  access: {
    // Alleen beheerders en eigenaren beheren gebruikers.
    create: ({ req }) => isActieveBeheerder(req.user),
    read: ({ req }): AccessResult => {
      // Eigenaren zien iedereen.
      if (isActieveEigenaar(req.user)) return true;
      // Andere beheerders zien de eigenaar(s) bewust niet: wie de site
      // bezit blijft privé. Ze zien wel zichzelf en alle anderen.
      if (isActieveBeheerder(req.user)) {
        return { rol: { not_equals: "eigenaar" } };
      }
      // Ingelogde niet-beheerders zien alleen zichzelf (nodig voor
      // "Mijn account").
      if (req.user) return { id: { equals: req.user.id } };
      return false;
    },
    update: ({ req, id }) => {
      // Jezelf bijwerken mag altijd (bijv. je eigen naam).
      if (req.user?.id === id) return true;
      return isActieveBeheerder(req.user);
    },
    delete: ({ req }) => isActieveBeheerder(req.user),
    // Alleen goedgekeurde gebruikers komen het adminpaneel binnen.
    admin: ({ req }) =>
      Boolean(req.user) &&
      (req.user as { status?: string })?.status === "goedgekeurd",
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
      name: "status",
      type: "select",
      label: "Status",
      required: true,
      defaultValue: "in-afwachting",
      options: STATUS_OPTIES,
      access: {
        // Beheerders keuren goed, weigeren of blokkeren. Een eigenaar
        // blijft buiten schot: die kan alleen door een eigenaar worden
        // gewijzigd (zie de beforeChange-hook).
        update: ({ req }) => isActieveBeheerder(req.user),
      },
      admin: {
        description:
          "Zet op 'Goedgekeurd' om iemand toegang te geven; kies daarna de juiste rol.",
        position: "sidebar",
      },
    },
    {
      name: "rol",
      type: "select",
      label: "Rol",
      required: true,
      defaultValue: "redacteur",
      options: ROL_OPTIES,
      access: {
        // Rollen wijzigen mag alleen door beheerders; de extra
        // beperking rond "eigenaar" zit in de beforeChange-hook.
        update: ({ req }) => isActieveBeheerder(req.user),
      },
      admin: {
        description:
          "Beheerder kan alles beheren; redacteur past alleen teksten en foto's aan.",
        position: "sidebar",
        components: {
          Field: "@/payload/components/RolVeld#RolVeld",
        },
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, originalDoc, req }) => {
        const huidigeGebruiker = req.user;

        // 1. De allereerste gebruiker is altijd eigenaar én goedgekeurd.
        if (operation === "create") {
          try {
            const { totalDocs } = await req.payload.count({
              collection: "users",
            });
            if (totalDocs === 0) {
              return { ...data, rol: "eigenaar", status: "goedgekeurd" };
            }
          } catch {
            // Database (nog) niet beschikbaar: invoer laten staan.
          }
        }

        // 2. Alleen een eigenaar mag de eigenaarsrol toekennen of
        //    intrekken — ongeacht wat de UI meestuurt.
        const wordtEigenaar = data?.rol === "eigenaar";
        const wasEigenaar = originalDoc?.rol === "eigenaar";
        if (
          (wordtEigenaar && !wasEigenaar) ||
          (wasEigenaar && data?.rol && data.rol !== "eigenaar")
        ) {
          if (!isActieveEigenaar(huidigeGebruiker)) {
            throw new Error(
              "Alleen een eigenaar kan de eigenaarsrol toekennen of intrekken.",
            );
          }
        }

        // 3. Een eigenaar kan niet door een ander worden gewijzigd
        //    (rol, status of blokkade).
        if (
          operation === "update" &&
          wasEigenaar &&
          huidigeGebruiker?.id !== originalDoc?.id &&
          !isActieveEigenaar(huidigeGebruiker)
        ) {
          throw new Error(
            "Een eigenaar kan alleen door zichzelf of een andere eigenaar worden gewijzigd.",
          );
        }

        // 4. De laatste eigenaar mag zijn eigen rol niet weggeven.
        if (
          operation === "update" &&
          wasEigenaar &&
          data?.rol &&
          data.rol !== "eigenaar"
        ) {
          const { totalDocs } = await req.payload.count({
            collection: "users",
            where: { rol: { equals: "eigenaar" } },
          });
          if (totalDocs <= 1) {
            throw new Error(
              "Dit is de laatste eigenaar; die rol kan niet worden ingetrokken.",
            );
          }
        }

        return data;
      },
    ],
    beforeDelete: [
      async ({ id, req }) => {
        const doc = (await req.payload.findByID({
          collection: "users",
          id,
          overrideAccess: true,
        })) as { rol?: string; email?: string };

        if (doc?.rol === "eigenaar") {
          // Een eigenaar kan alleen door een eigenaar worden verwijderd…
          if (!isActieveEigenaar(req.user)) {
            throw new Error("Een eigenaar kan niet door een ander worden verwijderd.");
          }
          // …en nooit als het de laatste is.
          const { totalDocs } = await req.payload.count({
            collection: "users",
            where: { rol: { equals: "eigenaar" } },
          });
          if (totalDocs <= 1) {
            throw new Error(
              "Dit is de laatste eigenaar; die kan niet worden verwijderd.",
            );
          }
        }
      },
    ],
    afterChange: [
      async ({ doc, operation, previousDoc, req }) => {
        const ip = ipUitHeaders(req.headers);
        const door = req.user as
          | { id?: number; naam?: string; email?: string; rol?: string }
          | null;
        // Handelingen van een eigenaar blijven privé, en handelingen
        // die over een eigenaar gaan ook — inclusief het allereerste
        // account, dat zonder ingelogde gebruiker wordt aangemaakt.
        const verborgen = isEigenaar(door) || isEigenaar(doc);

        if (operation === "create") {
          logActiviteit(req.payload, {
            gebruikerId: door?.id ?? null,
            naam: door?.naam ?? doc.naam,
            email: door?.email ?? doc.email,
            actie: "aangemaakt",
            onderdeel: `Gebruiker: ${doc.naam ?? doc.email}`,
            ipAdres: ip,
            verborgen,
          });
          return doc;
        }

        // Statuswijziging: goedkeuren, weigeren of blokkeren.
        if (previousDoc && previousDoc.status !== doc.status) {
          const acties: Record<string, "goedgekeurd" | "geweigerd" | "geblokkeerd"> =
            {
              goedgekeurd: "goedgekeurd",
              geweigerd: "geweigerd",
              geblokkeerd: "geblokkeerd",
            };
          const actie = acties[doc.status as string];
          if (actie) {
            logActiviteit(req.payload, {
              gebruikerId: door?.id ?? null,
              naam: door?.naam ?? null,
              email: door?.email ?? null,
              actie,
              onderdeel: `Gebruiker: ${doc.naam ?? doc.email}`,
              details: `Status: ${previousDoc.status} → ${doc.status}`,
              ipAdres: ip,
              verborgen,
            });

            if (actie === "goedgekeurd") {
              void stuurGoedgekeurdMail(req.payload, {
                naam: doc.naam,
                email: doc.email,
              });
            }
            if (actie === "geweigerd") {
              void stuurGeweigerdMail(req.payload, {
                naam: doc.naam,
                email: doc.email,
              });
            }
          }
        }

        // Rolwijziging apart loggen.
        if (previousDoc && previousDoc.rol !== doc.rol) {
          logActiviteit(req.payload, {
            gebruikerId: door?.id ?? null,
            naam: door?.naam ?? null,
            email: door?.email ?? null,
            actie: "rol-gewijzigd",
            onderdeel: `Gebruiker: ${doc.naam ?? doc.email}`,
            details: `Rol: ${previousDoc.rol} → ${doc.rol}`,
            ipAdres: ip,
            verborgen,
          });
        }

        return doc;
      },
    ],
    afterLogin: [
      async ({ req, user }) => {
        logActiviteit(req.payload, {
          gebruikerId: user.id as number,
          naam: (user as { naam?: string }).naam,
          email: user.email,
          actie: "ingelogd",
          onderdeel: "Beheerpaneel",
          ipAdres: ipUitHeaders(req.headers),
          verborgen: isEigenaar(user),
        });
      },
    ],
    afterLogout: [
      async ({ req }) => {
        const u = req.user as { id?: number; naam?: string; email?: string } | null;
        logActiviteit(req.payload, {
          gebruikerId: u?.id ?? null,
          naam: u?.naam ?? null,
          email: u?.email ?? null,
          actie: "uitgelogd",
          onderdeel: "Beheerpaneel",
          ipAdres: ipUitHeaders(req.headers),
          verborgen: isEigenaar(u),
        });
      },
    ],
  },
};

export { isEigenaar };
