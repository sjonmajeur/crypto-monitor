import { type MigrateDownArgs, type MigrateUpArgs, sql } from "@payloadcms/db-postgres";

/**
 * De oudste bestaande gebruiker wordt eigenaar — dezelfde regel als
 * "het eerste account wordt eigenaar" voor nieuwe installaties, maar
 * dan voor een database die al gebruikers had vóór de eigenaarsrol
 * bestond. Staat er al een eigenaar (of is er nog geen gebruiker),
 * dan gebeurt er niets.
 *
 * Dit staat los van de vorige migratie omdat Postgres een nieuwe
 * enum-waarde pas ná commit laat gebruiken.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    UPDATE public.users SET rol = 'eigenaar'
      WHERE id = (
        SELECT id FROM public.users ORDER BY created_at ASC, id ASC LIMIT 1
      )
      AND NOT EXISTS (SELECT 1 FROM public.users WHERE rol = 'eigenaar');

    -- Oude logregels van de eigenaar met terugwerkende kracht verbergen:
    -- alleen een eigenaar ziet ze nog.
    UPDATE public.inloggeschiedenis SET verborgen = true
      WHERE gebruiker_id IN (SELECT id FROM public.users WHERE rol = 'eigenaar')
         OR email IN (SELECT email FROM public.users WHERE rol = 'eigenaar');
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    UPDATE public.users SET rol = 'beheerder' WHERE rol = 'eigenaar';
  `);
}
