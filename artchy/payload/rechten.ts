/**
 * Rollen en toegangsregels op één plek.
 *
 * De regels hier gelden in de hele API, niet alleen in het
 * adminpaneel: wie geen toegang heeft, krijgt ook via de REST- en
 * GraphQL-API niets te zien.
 */

export type Rol = "eigenaar" | "beheerder" | "redacteur";
export type GebruikerStatus =
  | "in-afwachting"
  | "goedgekeurd"
  | "geweigerd"
  | "geblokkeerd";

type Gebruiker = {
  id?: number | string;
  rol?: Rol;
  status?: GebruikerStatus;
} | null;

export function isEigenaar(user: unknown): boolean {
  return (user as Gebruiker)?.rol === "eigenaar";
}

export function isBeheerder(user: unknown): boolean {
  const rol = (user as Gebruiker)?.rol;
  return rol === "eigenaar" || rol === "beheerder";
}

/**
 * Alleen goedgekeurde gebruikers tellen mee. Iemand die net is
 * aangemeld (in afwachting), geweigerd of geblokkeerd is, komt hier
 * nooit doorheen — ook niet als de rol wel klopt.
 */
export function isActief(user: unknown): boolean {
  const u = user as Gebruiker;
  if (!u) return false;
  return u.status === "goedgekeurd";
}

export function isActieveEigenaar(user: unknown): boolean {
  return isActief(user) && isEigenaar(user);
}

export function isActieveBeheerder(user: unknown): boolean {
  return isActief(user) && isBeheerder(user);
}

/** Elke ingelogde, goedgekeurde gebruiker (dus ook een redacteur). */
export function isActieveGebruiker(user: unknown): boolean {
  return isActief(user);
}

export const ROL_OPTIES = [
  {
    label: "Eigenaar (volledige zeggenschap, kan niet worden verwijderd)",
    value: "eigenaar",
  },
  { label: "Beheerder (alles, inclusief gebruikers)", value: "beheerder" },
  { label: "Redacteur (alleen teksten en foto's)", value: "redacteur" },
];

export const STATUS_OPTIES = [
  { label: "In afwachting van goedkeuring", value: "in-afwachting" },
  { label: "Goedgekeurd", value: "goedgekeurd" },
  { label: "Geweigerd", value: "geweigerd" },
  { label: "Geblokkeerd", value: "geblokkeerd" },
];
