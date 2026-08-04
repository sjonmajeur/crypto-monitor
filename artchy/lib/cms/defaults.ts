/**
 * De huidige teksten van de site. Deze gelden zolang het CMS leeg is of
 * onbereikbaar — zo blijft de site er exact hetzelfde uitzien.
 */

export type HomepageContent = {
  aankondiging: { accentTekst: string; tekst: string; tweedeTekst: string };
  hero: {
    eyebrow: string;
    titelRegels: string[];
    knopTekst: string;
    knopLink: string;
    afbeelding: string | null;
    afbeeldingAlt: string;
    afbeeldingMobiel: string | null;
  };
  collectiesTitel: string;
  collectiesLinkTekst: string;
  kaartLinkTekst: string;
  collecties: Array<{
    titel: string;
    tagline: string;
    link: string;
    afbeelding: string | null;
  }>;
  stappenTitel: string;
  stappenSubtitel: string;
  stappen: Array<{ titel: string; tekst: string }>;
  dropEyebrow: string;
  dropTitel: string;
  dropSubregel: string;
  dropEinddatum: string;
  dropKnopTekst: string;
  dropKnopLink: string;
  klokLabels: { dagen: string; uren: string; minuten: string; seconden: string };
  dropAfbeelding: string | null;
  creatorsEyebrow: string;
  creatorsTitel: string;
  creatorsLinkTekst: string;
  verhaalTitel: string;
  verhaalTekst: string;
  verhaalAfbeelding: string | null;
  communityTitel: string;
  communityTekst: string;
  communityKnopTekst: string;
  communityPlaceholder: string;
  communityBevestiging: string;
};

export type SiteSettingsContent = {
  menu: Array<{ label: string; href: string }>;
  merknaam: string;
  logo: string | null;
  kolomTitels: { menu: string; info: string; volg: string };
  merkOndertitel: string;
  merkZin: string;
  footerMenu: Array<{ label: string; href: string }>;
  footerInfo: Array<{ label: string; href: string }>;
  copyright: string;
  slogan: string;
  socials: { instagram: string; tiktok: string; youtube: string };
};

export const DEFAULT_HOMEPAGE: HomepageContent = {
  aankondiging: {
    accentTekst: "Limited drop",
    tekst: "now live",
    tweedeTekst: "Free shipping above €100",
  },
  hero: {
    eyebrow: "Wearable art platform",
    titelRegels: ["Where", "Imagination", "Becomes identity."],
    knopTekst: "Shop the drop",
    knopLink: "/shop",
    afbeelding: null,
    afbeeldingAlt: "Man met TAJI-hoodie voor de skyline bij avondlicht",
    afbeeldingMobiel: null,
  },
  collectiesTitel: "Featured collections",
  collectiesLinkTekst: "Explore all collections",
  kaartLinkTekst: "Explore collection",
  collecties: [
    {
      titel: "Josh",
      tagline: "Fearless creativity born from manga, heroes and imagination.",
      link: "/shop?type=josh",
      afbeelding: null,
    },
    {
      titel: "Taji",
      tagline: "The emotion creature. Wear your feelings. That's TAJI.",
      link: "/shop?type=taji",
      afbeelding: null,
    },
    {
      titel: "Brass",
      tagline: "Luxury meets identity. Timeless art, crafted to last.",
      link: "/shop?type=brass",
      afbeelding: null,
    },
  ],
  stappenTitel: "How art becomes fashion",
  stappenSubtitel: "This is how we turn art into limited wearable pieces.",
  stappen: [
    { titel: "Choose", tekst: "Discover art from our creators." },
    { titel: "Unlock", tekst: "The community unlocks the design." },
    { titel: "Produce", tekst: "We produce limited editions, never mass." },
    { titel: "Wear", tekst: "You wear more than clothing. You wear art." },
  ],
  dropEyebrow: "Limited release",
  dropTitel: "This drop is produced only for the community.",
  dropSubregel: "Once it's gone, it never returns.",
  dropEinddatum: "2026-08-15T22:00:00+02:00",
  dropKnopTekst: "View collection",
  dropKnopLink: "/shop",
  klokLabels: { dagen: "Days", uren: "Hrs", minuten: "Mins", seconden: "Secs" },
  dropAfbeelding: null,
  creatorsEyebrow: "The world of Artchy",
  creatorsTitel: "Meet the creators.",
  creatorsLinkTekst: "View all creators",
  verhaalTitel: "A new generation of creativity",
  verhaalTekst:
    "Artchy is built on a unique collaboration between generations. From the raw imagination of young artist Josh, to the refined luxury vision of designer Brass, we connect creativity, culture, and identity through fashion. This is more than clothing. This is wearable art.",
  verhaalAfbeelding: null,
  communityTitel: "Join the Artchy community",
  communityTekst:
    "Be the first to access drops, exclusive releases, and artist stories.",
  communityKnopTekst: "Join the community",
  communityPlaceholder: "Enter your email",
  communityBevestiging: "You're in — welcome to the community.",
};

export const DEFAULT_SITE_SETTINGS: SiteSettingsContent = {
  menu: [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "How it works", href: "/how-it-works" },
    { label: "About", href: "/about" },
  ],
  merknaam: "Artchy",
  logo: null,
  kolomTitels: { menu: "Menu", info: "Info", volg: "Follow us" },
  merkOndertitel: "Wearable art platform",
  merkZin: "Where imagination\nbecomes identity.",
  footerMenu: [
    { label: "Shop", href: "/shop" },
    { label: "Artists", href: "/artists" },
    { label: "Taji", href: "/taji" },
    { label: "How it Works", href: "/how-it-works" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/about" },
  ],
  footerInfo: [
    { label: "FAQ", href: "" },
    { label: "Shipping", href: "" },
    { label: "Returns", href: "" },
    { label: "Terms & Conditions", href: "" },
    { label: "Privacy Policy", href: "" },
  ],
  copyright: "© 2024 ARTCHY. All rights reserved.",
  slogan: "Built with passion. Designed for the culture.",
  socials: { instagram: "#", tiktok: "#", youtube: "#" },
};

/** Artiest-teksten zolang het CMS leeg is. */
export const DEFAULT_ARTISTS = [
  {
    naam: "Josh",
    subtitel: "The young visionary",
    tagline: "Raw imagination. Limitless creativity.",
    bio: [
      "Josh is fourteen, and his sketchbooks don't close. Raised on manga panels, superhero arcs and late-night drawing sessions, he fills page after page with characters that refuse to sit still — heroes, monsters, and everything in between.",
      "His work is raw on purpose. No polish, no filter — just the direct line from imagination to ink. The rough edges most brands would sand away are exactly what Artchy prints.",
      "Every Josh drop starts as a drawing that made him grin. If the community unlocks it, it becomes a limited piece you can wear — and then it's gone.",
    ],
    foto: "creator-josh.jpg",
  },
  {
    naam: "Taji",
    subtitel: "The emotion creature",
    tagline: "Born from imagination. Powered by emotion.",
    bio: [
      "Taji was born in the margins of Josh's sketchbook — the emotion creature. Part fox, part storm of paint, it escaped the page before the ink was dry.",
      "Taji doesn't do words. It wears feelings as colors: joy splashes yellow, courage burns red, calm settles into teal. Every piece in the Taji collection captures a single mood, caught mid-burst.",
      "Wear your feelings. That's TAJI.",
    ],
    foto: "creator-taji.jpg",
  },
  {
    naam: "Brass",
    subtitel: "The luxury artist",
    tagline: "Collaborations with global brands.",
    bio: [
      "Brass spent a decade designing for global houses — the kind of studios where a millimeter is a debate. He brought that discipline to Artchy, and kept the soul.",
      "His pieces are quiet luxury with a signature: refined cuts, heavyweight fabrics, details you notice the second time. Timeless art, crafted to last.",
      "For every drop, Brass takes Josh's raw energy and gives it an edge you can wear anywhere — from the block to the gallery.",
    ],
    foto: "creator-brass.jpg",
  },
];

export const DEFAULT_PAGINAS = {
  artiestenPagina: {
    eyebrow: "The world of Artchy",
    titel: "Meet the creators.",
    subtitel: "Tap a creator to read their story.",
    kaartLinkTekst: "Learn more",
    bioPaginaKnopTekst: "Bekijk de pagina van {naam}",
    bioKnopTekst: "Explore {naam}'s collection",
  },
  hoe: {
    titel: "How art becomes fashion",
    subtitel: "This is how we turn art into limited wearable pieces.",
    stappen: [
      { titel: "Choose", tekst: "Discover art from our creators." },
      { titel: "Unlock", tekst: "The community unlocks the design." },
      { titel: "Produce", tekst: "We produce limited editions, never mass." },
      { titel: "Wear", tekst: "You wear more than clothing. You wear art." },
    ],
  },
  shop: {
    titel: "Shop",
    leegTekst: "No products in the store yet.",
    geenMatchTekst: "No products match these filters.",
  },
  over: {
    titel: "A new generation of creativity",
    tekst:
      "Artchy is built on a unique collaboration between generations. From the raw imagination of young artist Josh, to the refined luxury vision of designer Brass, we connect creativity, culture, and identity through fashion. This is more than clothing. This is wearable art.",
  },
};

/**
 * Eerste versie van de eigen pagina per artiest: gebruikt bij het
 * vullen van een lege installatie en als terugval zonder CMS.
 */
export const DEFAULT_ARTIEST_PAGINAS: Record<
  string,
  {
    eyebrow: string;
    kop: string;
    alineas: string[];
    binnenkort: string;
    knopTekst: string;
    knopLink: string;
  }
> = {
  taji: {
    eyebrow: "The emotion creature",
    kop: "Taji",
    alineas: [
      "Born from imagination. Powered by emotion. Wear your feelings — that's TAJI.",
    ],
    binnenkort: "The full world of Taji is coming soon.",
    knopTekst: "Shop the Taji collection",
    knopLink: "/shop?type=taji",
  },
  josh: {
    eyebrow: "The young visionary",
    kop: "Josh",
    alineas: [
      "Raw imagination. Limitless creativity. Josh draws worlds the way only a kid can — without rules, without limits.",
      "Every piece starts as a sketch at the kitchen table and ends as wearable art.",
    ],
    binnenkort: "The full world of Josh is coming soon.",
    knopTekst: "Shop the Josh collection",
    knopLink: "/shop?type=josh",
  },
  brass: {
    eyebrow: "The luxury artist",
    kop: "Brass",
    alineas: [
      "Refined lines, timeless black, collaborations with global brands. Brass turns streetwear into luxury.",
      "His designs carry the calm confidence of a craftsman who lets the work speak.",
    ],
    binnenkort: "The full world of Brass is coming soon.",
    knopTekst: "Shop the Brass collection",
    knopLink: "/shop?type=brass",
  },
};

export type PaginasContent = typeof DEFAULT_PAGINAS;
