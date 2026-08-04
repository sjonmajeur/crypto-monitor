import { type MigrateDownArgs, type MigrateUpArgs, sql } from "@payloadcms/db-postgres";

/**
 * Elke tekst en elk beeld bewerkbaar: linkteksten en kloklabels op de
 * homepage, nieuwsbriefteksten, koppen van /artists, de volledige
 * /how-it-works (incl. stappen-tabel), de shop-koppen, de
 * footer-kolomtitels en een logo-veld in de navigatie.
 *
 * Idempotent; de homepage- en site-instellingen-globals hebben ook een
 * versietabel (concepten) die dezelfde kolommen nodig heeft.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE public.homepage
      ADD COLUMN IF NOT EXISTS collecties_link_tekst character varying,
      ADD COLUMN IF NOT EXISTS kaart_link_tekst character varying,
      ADD COLUMN IF NOT EXISTS creators_link_tekst character varying,
      ADD COLUMN IF NOT EXISTS klok_labels_dagen character varying,
      ADD COLUMN IF NOT EXISTS klok_labels_uren character varying,
      ADD COLUMN IF NOT EXISTS klok_labels_minuten character varying,
      ADD COLUMN IF NOT EXISTS klok_labels_seconden character varying,
      ADD COLUMN IF NOT EXISTS community_placeholder character varying,
      ADD COLUMN IF NOT EXISTS community_bevestiging character varying;

    ALTER TABLE public._homepage_v
      ADD COLUMN IF NOT EXISTS version_collecties_link_tekst character varying,
      ADD COLUMN IF NOT EXISTS version_kaart_link_tekst character varying,
      ADD COLUMN IF NOT EXISTS version_creators_link_tekst character varying,
      ADD COLUMN IF NOT EXISTS version_klok_labels_dagen character varying,
      ADD COLUMN IF NOT EXISTS version_klok_labels_uren character varying,
      ADD COLUMN IF NOT EXISTS version_klok_labels_minuten character varying,
      ADD COLUMN IF NOT EXISTS version_klok_labels_seconden character varying,
      ADD COLUMN IF NOT EXISTS version_community_placeholder character varying,
      ADD COLUMN IF NOT EXISTS version_community_bevestiging character varying;

    ALTER TABLE public.site_instellingen
      ADD COLUMN IF NOT EXISTS logo_id integer,
      ADD COLUMN IF NOT EXISTS kolom_titels_menu character varying,
      ADD COLUMN IF NOT EXISTS kolom_titels_info character varying,
      ADD COLUMN IF NOT EXISTS kolom_titels_volg character varying;

    ALTER TABLE public._site_instellingen_v
      ADD COLUMN IF NOT EXISTS version_logo_id integer,
      ADD COLUMN IF NOT EXISTS version_kolom_titels_menu character varying,
      ADD COLUMN IF NOT EXISTS version_kolom_titels_info character varying,
      ADD COLUMN IF NOT EXISTS version_kolom_titels_volg character varying;

    DO $$ BEGIN
      ALTER TABLE public.site_instellingen
        ADD CONSTRAINT site_instellingen_logo_id_media_id_fk
        FOREIGN KEY (logo_id) REFERENCES public.media(id) ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE public._site_instellingen_v
        ADD CONSTRAINT _site_instellingen_v_version_logo_id_media_id_fk
        FOREIGN KEY (version_logo_id) REFERENCES public.media(id) ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    ALTER TABLE public.paginas
      ADD COLUMN IF NOT EXISTS artiesten_pagina_eyebrow character varying,
      ADD COLUMN IF NOT EXISTS artiesten_pagina_titel character varying,
      ADD COLUMN IF NOT EXISTS artiesten_pagina_subtitel character varying,
      ADD COLUMN IF NOT EXISTS artiesten_pagina_kaart_link_tekst character varying,
      ADD COLUMN IF NOT EXISTS artiesten_pagina_bio_knop_tekst character varying,
      ADD COLUMN IF NOT EXISTS hoe_titel character varying,
      ADD COLUMN IF NOT EXISTS hoe_subtitel character varying,
      ADD COLUMN IF NOT EXISTS shop_titel character varying,
      ADD COLUMN IF NOT EXISTS shop_leeg_tekst character varying,
      ADD COLUMN IF NOT EXISTS shop_geen_match_tekst character varying;

    CREATE TABLE IF NOT EXISTS public.paginas_hoe_stappen (
      _order integer NOT NULL,
      _parent_id integer NOT NULL,
      id character varying PRIMARY KEY,
      titel character varying NOT NULL,
      tekst character varying NOT NULL
    );
    CREATE INDEX IF NOT EXISTS paginas_hoe_stappen_order_idx
      ON public.paginas_hoe_stappen USING btree (_order);
    CREATE INDEX IF NOT EXISTS paginas_hoe_stappen_parent_id_idx
      ON public.paginas_hoe_stappen USING btree (_parent_id);
    DO $$ BEGIN
      ALTER TABLE public.paginas_hoe_stappen
        ADD CONSTRAINT paginas_hoe_stappen_parent_id_fk
        FOREIGN KEY (_parent_id) REFERENCES public.paginas(id) ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS public.paginas_hoe_stappen;
    ALTER TABLE public.paginas
      DROP COLUMN IF EXISTS artiesten_pagina_eyebrow,
      DROP COLUMN IF EXISTS artiesten_pagina_titel,
      DROP COLUMN IF EXISTS artiesten_pagina_subtitel,
      DROP COLUMN IF EXISTS artiesten_pagina_kaart_link_tekst,
      DROP COLUMN IF EXISTS artiesten_pagina_bio_knop_tekst,
      DROP COLUMN IF EXISTS hoe_titel,
      DROP COLUMN IF EXISTS hoe_subtitel,
      DROP COLUMN IF EXISTS shop_titel,
      DROP COLUMN IF EXISTS shop_leeg_tekst,
      DROP COLUMN IF EXISTS shop_geen_match_tekst;
  `);
}
