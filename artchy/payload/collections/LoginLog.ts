import type { AccessResult, CollectionConfig } from "payload";

import { isActieveBeheerder, isActieveEigenaar } from "../rechten";

/**
 * Alleen-lezen activiteitenlogboek: in- en uitloggen, wijzigingen aan
 * content en alle beheerdershandelingen. Regels ontstaan uitsluitend
 * automatisch en kunnen door niemand worden aangepast of verwijderd —
 * ook niet door een eigenaar.
 */
export const LoginLog: CollectionConfig = {
  slug: "inloggeschiedenis",
  labels: { singular: "Activiteit", plural: "Activiteitenlogboek" },
  admin: {
    hideAPIURL: true,
    useAsTitle: "email",
    defaultColumns: ["tijdstip", "naam", "actie", "onderdeel", "ipAdres"],
    group: "Beheer",
    description:
      "Wie heeft wat gedaan, en wanneer. Deze lijst wordt automatisch bijgehouden en kan niet worden gewijzigd.",
    hidden: ({ user }) => !isActieveBeheerder(user),
    pagination: { defaultLimit: 50 },
  },
  access: {
    // Een eigenaar ziet het volledige logboek.
    read: ({ req }): AccessResult => {
      if (isActieveEigenaar(req.user)) return true;
      // Beheerders zien alles behalve wat een eigenaar heeft gedaan:
      // die regels blijven privé.
      if (isActieveBeheerder(req.user)) {
        return { verborgen: { not_equals: true } };
      }
      return false;
    },
    // Niemand kan regels toevoegen, wijzigen of verwijderen — het
    // logboek is bedoeld als betrouwbare documentatie.
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  defaultSort: "-tijdstip",
  fields: [
    {
      name: "tijdstip",
      type: "date",
      label: "Tijdstip",
      index: true,
      admin: {
        readOnly: true,
        date: {
          pickerAppearance: "dayAndTime",
          displayFormat: "d MMM yyyy HH:mm",
        },
      },
    },
    {
      name: "naam",
      type: "text",
      label: "Naam",
      index: true,
      admin: { readOnly: true },
    },
    {
      name: "email",
      type: "text",
      label: "E-mailadres",
      index: true,
      admin: { readOnly: true },
    },
    {
      name: "actie",
      type: "select",
      label: "Actie",
      index: true,
      options: [
        { label: "Ingelogd", value: "ingelogd" },
        { label: "Uitgelogd", value: "uitgelogd" },
        { label: "Inloggen mislukt", value: "inloggen-mislukt" },
        { label: "Aangemaakt", value: "aangemaakt" },
        { label: "Gewijzigd", value: "gewijzigd" },
        { label: "Verwijderd", value: "verwijderd" },
        { label: "Gepubliceerd", value: "gepubliceerd" },
        { label: "Aanmelding ontvangen", value: "aanmelding-ontvangen" },
        { label: "Goedgekeurd", value: "goedgekeurd" },
        { label: "Geweigerd", value: "geweigerd" },
        { label: "Geblokkeerd", value: "geblokkeerd" },
        { label: "Rol gewijzigd", value: "rol-gewijzigd" },
      ],
      admin: { readOnly: true },
    },
    {
      name: "onderdeel",
      type: "text",
      label: "Onderdeel",
      index: true,
      admin: {
        readOnly: true,
        description: 'Bijvoorbeeld "Homepage" of "Artiest: Brass".',
      },
    },
    {
      name: "details",
      type: "text",
      label: "Toelichting",
      admin: { readOnly: true },
    },
    {
      name: "ipAdres",
      type: "text",
      label: "IP-adres",
      admin: { readOnly: true },
    },
    {
      name: "gebruiker",
      type: "relationship",
      relationTo: "users",
      label: "Gebruiker",
      admin: { readOnly: true },
    },
    {
      name: "verborgen",
      type: "checkbox",
      label: "Alleen zichtbaar voor de eigenaar",
      defaultValue: false,
      index: true,
      admin: {
        readOnly: true,
        // Alleen een eigenaar ziet dit vinkje; voor een beheerder
        // bestaat het niet, want die krijgt deze regels sowieso niet.
        condition: (_data, _sibling, { user }) =>
          (user as { rol?: string } | null)?.rol === "eigenaar",
        position: "sidebar",
      },
    },
    {
      name: "resultaat",
      type: "select",
      label: "Resultaat",
      options: [
        { label: "Gelukt", value: "gelukt" },
        { label: "Mislukt", value: "mislukt" },
      ],
      admin: { readOnly: true, position: "sidebar" },
    },
  ],
  timestamps: true,
};
