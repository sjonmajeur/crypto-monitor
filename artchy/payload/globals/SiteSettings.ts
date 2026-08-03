import type { GlobalConfig } from "payload";

/**
 * Menu, footer en socials — alles wat op elke pagina staat.
 */
export const SiteSettings: GlobalConfig = {
  slug: "site-instellingen",
  label: "Footer & algemeen",
  admin: {
    // Technische API-tab verbergen: beheerders hebben er niets aan.
    hideAPIURL: true,
    group: "Inhoud",
    description:
      "Het menu bovenaan, de footer en de social-links. Deze staan op elke pagina.",
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  versions: { drafts: true, max: 20 },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Menu",
          fields: [
            {
              name: "menu",
              type: "array",
              label: "Menu-items bovenaan",
              admin: {
                description:
                  'De links in de balk bovenaan. "Artists" heeft automatisch een uitklapmenu met de artiesten.',
              },
              fields: [
                { name: "label", type: "text", label: "Tekst", required: true },
                {
                  name: "link",
                  type: "text",
                  label: "Adres (link)",
                  required: true,
                  admin: { description: 'Bijvoorbeeld "/shop".' },
                },
              ],
            },
          ],
        },
        {
          label: "Footer",
          fields: [
            { name: "merknaam", type: "text", label: "Merknaam onderaan" },
            { name: "merkOndertitel", type: "text", label: "Regel onder de merknaam" },
            { name: "merkZin", type: "textarea", label: "Korte zin" },
            {
              name: "footerMenu",
              type: "array",
              label: 'Kolom "Menu"',
              fields: [
                { name: "label", type: "text", label: "Tekst", required: true },
                { name: "link", type: "text", label: "Adres (link)", required: true },
              ],
            },
            {
              name: "footerInfo",
              type: "array",
              label: 'Kolom "Info"',
              fields: [
                { name: "label", type: "text", label: "Tekst", required: true },
                {
                  name: "link",
                  type: "text",
                  label: "Adres (mag leeg blijven)",
                  admin: {
                    description:
                      "Laat leeg als er nog geen pagina is; de tekst wordt dan zonder link getoond.",
                  },
                },
              ],
            },
            { name: "copyright", type: "text", label: "Copyright-regel links" },
            { name: "slogan", type: "text", label: "Regel rechtsonder" },
          ],
        },
        {
          label: "Sociale media",
          fields: [
            {
              name: "socials",
              type: "group",
              label: "Links naar sociale media",
              admin: {
                description: "Laat een veld leeg om dat icoon te verbergen.",
              },
              fields: [
                { name: "instagram", type: "text", label: "Instagram-URL" },
                { name: "tiktok", type: "text", label: "TikTok-URL" },
                { name: "youtube", type: "text", label: "YouTube-URL" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
