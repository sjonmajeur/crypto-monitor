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
      "De teksten van de pagina's Over ons en Taji. Opslaan is hier meteen zichtbaar op de site.",
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
        {
          label: "Taji",
          description: "De pagina /taji.",
          fields: [
            {
              name: "taji",
              type: "group",
              label: "Taji",
              fields: [
                {
                  name: "eyebrow",
                  type: "text",
                  label: "Gouden regel boven de kop",
                  admin: { description: 'Bijvoorbeeld "The emotion creature".' },
                },
                { name: "titel", type: "text", label: "Kop" },
                {
                  name: "tekst",
                  type: "textarea",
                  label: "Tekst",
                  admin: { description: "Enter geeft een nieuwe alinea." },
                },
                {
                  name: "binnenkort",
                  type: "text",
                  label: "Binnenkort-regel",
                  admin: {
                    description: 'Bijvoorbeeld "The full world of Taji is coming soon."',
                  },
                },
                { name: "knopTekst", type: "text", label: "Tekst op de shop-knop" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
