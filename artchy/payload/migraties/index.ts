import * as basis from "./20260803_143000_basis";
import * as goedkeuringEnLogboek from "./20260803_143100_goedkeuring_en_logboek";
import * as eersteEigenaar from "./20260803_143200_eerste_eigenaar";

/**
 * Alle databasemigraties, op volgorde. Payload draait ze automatisch
 * bij het opstarten in productie (prodMigrations in payload.config.ts)
 * en onthoudt in de tabel payload_migrations welke al zijn geweest.
 *
 * Nieuwe schemawijziging? Voeg hier een migratie toe:
 *   npx payload migrate:create <naam>
 * en zet het nieuwe bestand onderaan deze lijst.
 */
export const migraties = [
  { up: basis.up, down: basis.down, name: "20260803_143000_basis" },
  {
    up: goedkeuringEnLogboek.up,
    down: goedkeuringEnLogboek.down,
    name: "20260803_143100_goedkeuring_en_logboek",
  },
  {
    up: eersteEigenaar.up,
    down: eersteEigenaar.down,
    name: "20260803_143200_eerste_eigenaar",
  },
];
