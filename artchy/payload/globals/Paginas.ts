import type { GlobalConfig } from "payload";

import { logGlobalWijziging } from "../logHooks";
import { isActief } from "../rechten";

/**
 * De teksten van de kleinere pagina's: Over ons (/about) en Taji
 * (/taji). Geen concepten: opslaan is hier meteen publiceren, dat
 * houdt het simpel voor twee korte pagina's.
 */
export const Paginas: GlobalConfig = {
  slug: "paginas",
  label: "Overige pagina's",
  admin: {
    hideAPIURL: true,
    group: "Inhoud",
    description:
      "De teksten van de pagina's Artists, How it works, Shop en Over ons. De eigen pagina van een artiest beheer je bij Artiesten. Opslaan is hier meteen zichtbaar.",
  },
  access: {
    read: () => true,
    update: ({ req }) => isActief(req.user),
  },
  hooks: {
    afterChange: [logGlobalWijziging("paginas")],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Artists",
          description: "De pagina /artists en de makerskaarten.",
          fields: [
            {
              name: "artiestenPagina",
              type: "group",
              label: "Artists-pagina",
              fields: [
                {
                  name: "eyebrow",
                  type: "text",
                  label: "Gouden regel boven de kop",
                  admin: { description: 'Bijvoorbeeld "The world of Artchy".' },
                },
                { name: "titel", type: "text", label: "Kop" },
                {
                  name: "subtitel",
                  type: "text",
                  label: "Regel onder de kop",
                  admin: { description: 'Bijvoorbeeld "Tap a creator to read their story."' },
                },
                {
                  name: "kaartLinkTekst",
                  type: "text",
                  label: "Linktekst op elke makerskaart",
                  admin: {
                    description:
                      'Bijvoorbeeld "Learn more". Geldt ook voor de kaarten op de homepage.',
                  },
                },
                {
                  name: "bioPaginaKnopTekst",
                  type: "text",
                  label: "Pagina-knop in het bio-venster",
                  admin: {
                    description:
                      'Link naar de eigen pagina van de maker, bijvoorbeeld "Bekijk de pagina van {naam}".',
                  },
                },
                {
                  name: "bioKnopTekst",
                  type: "text",
                  label: "Knop in het bio-venster",
                  admin: {
                    description:
                      'De naam wordt automatisch ingevuld op de plek van {naam}, bijvoorbeeld "Explore {naam}\'s collection".',
                  },
                },
              ],
            },
          ],
        },
        {
          label: "How it works",
          description: "De pagina /how-it-works.",
          fields: [
            {
              name: "hoe",
              type: "group",
              label: "How it works",
              fields: [
                { name: "titel", type: "text", label: "Kop" },
                { name: "subtitel", type: "text", label: "Regel onder de kop" },
                {
                  name: "stappen",
                  type: "array",
                  label: "De vier stappen",
                  maxRows: 6,
                  fields: [
                    { name: "titel", type: "text", label: "Titel", required: true },
                    { name: "tekst", type: "text", label: "Tekst", required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Shop",
          description: "De koppen en meldingen op /shop.",
          fields: [
            {
              name: "shop",
              type: "group",
              label: "Shop-pagina",
              fields: [
                { name: "titel", type: "text", label: "Kop" },
                {
                  name: "leegTekst",
                  type: "text",
                  label: "Melding bij een lege winkel",
                },
                {
                  name: "geenMatchTekst",
                  type: "text",
                  label: "Melding als geen product bij de filters past",
                },
              ],
            },
          ],
        },
        {
          label: "Over ons",
          description: "De pagina /about.",
          fields: [
            {
              name: "over",
              type: "group",
              label: "Over ons",
              fields: [
                {
                  name: "titel",
                  type: "text",
                  label: "Kop",
                  admin: { description: 'Bijvoorbeeld "A new generation of creativity".' },
                },
                {
                  name: "tekst",
                  type: "textarea",
                  label: "Tekst",
                  admin: {
                    description: "Het verhaal onder de kop. Enter geeft een nieuwe alinea.",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
