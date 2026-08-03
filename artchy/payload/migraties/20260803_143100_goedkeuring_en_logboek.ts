import { type MigrateDownArgs, type MigrateUpArgs, sql } from "@payloadcms/db-postgres";

/**
 * Goedkeuringssysteem en activiteitenlogboek (PR #4):
 * - users.status (in afwachting / goedgekeurd / geweigerd / geblokkeerd);
 * - rol "eigenaar" als extra enum-waarde;
 * - inloggeschiedenis uitgebreid met naam, actie, onderdeel, details
 *   en verborgen, plus indexen om te kunnen filteren.
 *
 * Alles is idempotent (IF NOT EXISTS), dus opnieuw draaien kan geen
 * kwaad. Bestaande data blijft staan; bestaande gebruikers worden op
 * "goedgekeurd" gezet zodat niemand zichzelf buitensluit, en oude
 * logregels krijgen met terugwerkende kracht een actie.
 *
 * De eigenaarsrol wordt hier alleen TOEGEVOEGD aan het enum; het
 * toekennen gebeurt in de volgende migratie. Postgres staat niet toe
 * dat een enum-waarde in dezelfde transactie wordt gebruikt als
 * waarin hij is toegevoegd, en elke migratie draait in zijn eigen
 * transactie.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE public.enum_users_status AS ENUM
        ('in-afwachting', 'goedgekeurd', 'geweigerd', 'geblokkeerd');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE public.enum_inloggeschiedenis_actie AS ENUM
        ('ingelogd', 'uitgelogd', 'inloggen-mislukt', 'aangemaakt',
         'gewijzigd', 'verwijderd', 'gepubliceerd', 'aanmelding-ontvangen',
         'goedgekeurd', 'geweigerd', 'geblokkeerd', 'rol-gewijzigd');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    ALTER TYPE public.enum_users_rol ADD VALUE IF NOT EXISTS 'eigenaar' BEFORE 'beheerder';

    ALTER TABLE public.users
      ADD COLUMN IF NOT EXISTS status public.enum_users_status
        DEFAULT 'in-afwachting'::public.enum_users_status NOT NULL;

    -- Wie er al was, had al toegang: niemand buitensluiten.
    UPDATE public.users SET status = 'goedgekeurd';

    ALTER TABLE public.inloggeschiedenis
      ADD COLUMN IF NOT EXISTS naam character varying,
      ADD COLUMN IF NOT EXISTS actie public.enum_inloggeschiedenis_actie,
      ADD COLUMN IF NOT EXISTS onderdeel character varying,
      ADD COLUMN IF NOT EXISTS details character varying,
      ADD COLUMN IF NOT EXISTS verborgen boolean DEFAULT false;

    -- Oude regels waren alleen in- en uitlogpogingen.
    UPDATE public.inloggeschiedenis
      SET actie = CASE WHEN resultaat = 'mislukt'
        THEN 'inloggen-mislukt'::public.enum_inloggeschiedenis_actie
        ELSE 'ingelogd'::public.enum_inloggeschiedenis_actie END
      WHERE actie IS NULL;
    UPDATE public.inloggeschiedenis SET verborgen = false WHERE verborgen IS NULL;

    CREATE INDEX IF NOT EXISTS inloggeschiedenis_tijdstip_idx
      ON public.inloggeschiedenis USING btree (tijdstip);
    CREATE INDEX IF NOT EXISTS inloggeschiedenis_naam_idx
      ON public.inloggeschiedenis USING btree (naam);
    CREATE INDEX IF NOT EXISTS inloggeschiedenis_email_idx
      ON public.inloggeschiedenis USING btree (email);
    CREATE INDEX IF NOT EXISTS inloggeschiedenis_actie_idx
      ON public.inloggeschiedenis USING btree (actie);
    CREATE INDEX IF NOT EXISTS inloggeschiedenis_onderdeel_idx
      ON public.inloggeschiedenis USING btree (onderdeel);
    CREATE INDEX IF NOT EXISTS inloggeschiedenis_verborgen_idx
      ON public.inloggeschiedenis USING btree (verborgen);
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE public.users DROP COLUMN IF EXISTS status;
    ALTER TABLE public.inloggeschiedenis
      DROP COLUMN IF EXISTS naam,
      DROP COLUMN IF EXISTS actie,
      DROP COLUMN IF EXISTS onderdeel,
      DROP COLUMN IF EXISTS details,
      DROP COLUMN IF EXISTS verborgen;
    DROP TYPE IF EXISTS public.enum_users_status;
    DROP TYPE IF EXISTS public.enum_inloggeschiedenis_actie;
  `);
}
