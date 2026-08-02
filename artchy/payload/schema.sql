--
-- PostgreSQL database dump
--


-- Dumped from database version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: enum__artiesten_v_version_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__artiesten_v_version_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum__homepage_v_version_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__homepage_v_version_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum__site_instellingen_v_version_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__site_instellingen_v_version_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum_artiesten_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_artiesten_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum_homepage_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_homepage_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum_inloggeschiedenis_resultaat; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_inloggeschiedenis_resultaat AS ENUM (
    'gelukt',
    'mislukt'
);


--
-- Name: enum_site_instellingen_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_site_instellingen_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum_users_rol; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_users_rol AS ENUM (
    'beheerder',
    'redacteur'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _artiesten_v; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._artiesten_v (
    id integer NOT NULL,
    parent_id integer,
    version_naam character varying,
    version_slug character varying,
    version_subtitel character varying,
    version_tagline character varying,
    version_bio jsonb,
    version_portret_id integer,
    version_volgorde numeric DEFAULT 1,
    version_updated_at timestamp(3) with time zone,
    version_created_at timestamp(3) with time zone,
    version__status public.enum__artiesten_v_version_status DEFAULT 'draft'::public.enum__artiesten_v_version_status,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    latest boolean
);


--
-- Name: _artiesten_v_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._artiesten_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _artiesten_v_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._artiesten_v_id_seq OWNED BY public._artiesten_v.id;


--
-- Name: _homepage_v; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._homepage_v (
    id integer NOT NULL,
    version_aankondiging_accent_tekst character varying,
    version_aankondiging_tekst character varying,
    version_aankondiging_tweede_tekst character varying,
    version_hero_eyebrow character varying,
    version_hero_knop_tekst character varying,
    version_hero_knop_link character varying,
    version_hero_afbeelding_id integer,
    version_hero_afbeelding_mobiel_id integer,
    version_collecties_titel character varying,
    version_stappen_titel character varying,
    version_stappen_subtitel character varying,
    version_drop_eyebrow character varying,
    version_drop_titel character varying,
    version_drop_subregel character varying,
    version_drop_einddatum timestamp(3) with time zone,
    version_drop_knop_tekst character varying,
    version_drop_knop_link character varying,
    version_drop_afbeelding_id integer,
    version_creators_eyebrow character varying,
    version_creators_titel character varying,
    version_verhaal_titel character varying,
    version_verhaal_tekst character varying,
    version_verhaal_afbeelding_id integer,
    version_community_titel character varying,
    version_community_tekst character varying,
    version_community_knop_tekst character varying,
    version__status public.enum__homepage_v_version_status DEFAULT 'draft'::public.enum__homepage_v_version_status,
    version_updated_at timestamp(3) with time zone,
    version_created_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    latest boolean
);


--
-- Name: _homepage_v_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._homepage_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _homepage_v_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._homepage_v_id_seq OWNED BY public._homepage_v.id;


--
-- Name: _homepage_v_version_collecties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._homepage_v_version_collecties (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    titel character varying,
    tagline character varying,
    link character varying,
    afbeelding_id integer,
    _uuid character varying
);


--
-- Name: _homepage_v_version_collecties_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._homepage_v_version_collecties_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _homepage_v_version_collecties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._homepage_v_version_collecties_id_seq OWNED BY public._homepage_v_version_collecties.id;


--
-- Name: _homepage_v_version_hero_titel_regels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._homepage_v_version_hero_titel_regels (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    regel character varying,
    _uuid character varying
);


--
-- Name: _homepage_v_version_hero_titel_regels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._homepage_v_version_hero_titel_regels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _homepage_v_version_hero_titel_regels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._homepage_v_version_hero_titel_regels_id_seq OWNED BY public._homepage_v_version_hero_titel_regels.id;


--
-- Name: _homepage_v_version_stappen; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._homepage_v_version_stappen (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    titel character varying,
    tekst character varying,
    _uuid character varying
);


--
-- Name: _homepage_v_version_stappen_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._homepage_v_version_stappen_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _homepage_v_version_stappen_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._homepage_v_version_stappen_id_seq OWNED BY public._homepage_v_version_stappen.id;


--
-- Name: _site_instellingen_v; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._site_instellingen_v (
    id integer NOT NULL,
    version_merknaam character varying,
    version_merk_ondertitel character varying,
    version_merk_zin character varying,
    version_copyright character varying,
    version_slogan character varying,
    version_socials_instagram character varying,
    version_socials_tiktok character varying,
    version_socials_youtube character varying,
    version__status public.enum__site_instellingen_v_version_status DEFAULT 'draft'::public.enum__site_instellingen_v_version_status,
    version_updated_at timestamp(3) with time zone,
    version_created_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    latest boolean
);


--
-- Name: _site_instellingen_v_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._site_instellingen_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _site_instellingen_v_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._site_instellingen_v_id_seq OWNED BY public._site_instellingen_v.id;


--
-- Name: _site_instellingen_v_version_footer_info; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._site_instellingen_v_version_footer_info (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    label character varying,
    link character varying,
    _uuid character varying
);


--
-- Name: _site_instellingen_v_version_footer_info_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._site_instellingen_v_version_footer_info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _site_instellingen_v_version_footer_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._site_instellingen_v_version_footer_info_id_seq OWNED BY public._site_instellingen_v_version_footer_info.id;


--
-- Name: _site_instellingen_v_version_footer_menu; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._site_instellingen_v_version_footer_menu (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    label character varying,
    link character varying,
    _uuid character varying
);


--
-- Name: _site_instellingen_v_version_footer_menu_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._site_instellingen_v_version_footer_menu_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _site_instellingen_v_version_footer_menu_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._site_instellingen_v_version_footer_menu_id_seq OWNED BY public._site_instellingen_v_version_footer_menu.id;


--
-- Name: _site_instellingen_v_version_menu; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._site_instellingen_v_version_menu (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    label character varying,
    link character varying,
    _uuid character varying
);


--
-- Name: _site_instellingen_v_version_menu_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._site_instellingen_v_version_menu_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _site_instellingen_v_version_menu_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._site_instellingen_v_version_menu_id_seq OWNED BY public._site_instellingen_v_version_menu.id;


--
-- Name: artiesten; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.artiesten (
    id integer NOT NULL,
    naam character varying,
    slug character varying,
    subtitel character varying,
    tagline character varying,
    bio jsonb,
    portret_id integer,
    volgorde numeric DEFAULT 1,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    _status public.enum_artiesten_status DEFAULT 'draft'::public.enum_artiesten_status
);


--
-- Name: artiesten_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.artiesten_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: artiesten_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.artiesten_id_seq OWNED BY public.artiesten.id;


--
-- Name: homepage; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.homepage (
    id integer NOT NULL,
    aankondiging_accent_tekst character varying,
    aankondiging_tekst character varying,
    aankondiging_tweede_tekst character varying,
    hero_eyebrow character varying,
    hero_knop_tekst character varying,
    hero_knop_link character varying,
    hero_afbeelding_id integer,
    hero_afbeelding_mobiel_id integer,
    collecties_titel character varying,
    stappen_titel character varying,
    stappen_subtitel character varying,
    drop_eyebrow character varying,
    drop_titel character varying,
    drop_subregel character varying,
    drop_einddatum timestamp(3) with time zone,
    drop_knop_tekst character varying,
    drop_knop_link character varying,
    drop_afbeelding_id integer,
    creators_eyebrow character varying,
    creators_titel character varying,
    verhaal_titel character varying,
    verhaal_tekst character varying,
    verhaal_afbeelding_id integer,
    community_titel character varying,
    community_tekst character varying,
    community_knop_tekst character varying,
    _status public.enum_homepage_status DEFAULT 'draft'::public.enum_homepage_status,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: homepage_collecties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.homepage_collecties (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    titel character varying,
    tagline character varying,
    link character varying,
    afbeelding_id integer
);


--
-- Name: homepage_hero_titel_regels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.homepage_hero_titel_regels (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    regel character varying
);


--
-- Name: homepage_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.homepage_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: homepage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.homepage_id_seq OWNED BY public.homepage.id;


--
-- Name: homepage_stappen; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.homepage_stappen (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    titel character varying,
    tekst character varying
);


--
-- Name: inloggeschiedenis; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.inloggeschiedenis (
    id integer NOT NULL,
    gebruiker_id integer,
    email character varying,
    tijdstip timestamp(3) with time zone,
    ip_adres character varying,
    resultaat public.enum_inloggeschiedenis_resultaat,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: inloggeschiedenis_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.inloggeschiedenis_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: inloggeschiedenis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.inloggeschiedenis_id_seq OWNED BY public.inloggeschiedenis.id;


--
-- Name: media; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.media (
    id integer NOT NULL,
    alt character varying NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    url character varying,
    thumbnail_u_r_l character varying,
    filename character varying,
    mime_type character varying,
    filesize numeric,
    width numeric,
    height numeric,
    focal_x numeric,
    focal_y numeric
);


--
-- Name: media_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.media_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.media_id_seq OWNED BY public.media.id;


--
-- Name: payload_kv; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_kv (
    id integer NOT NULL,
    key character varying NOT NULL,
    data jsonb NOT NULL
);


--
-- Name: payload_kv_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_kv_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_kv_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_kv_id_seq OWNED BY public.payload_kv.id;


--
-- Name: payload_locked_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_locked_documents (
    id integer NOT NULL,
    global_slug character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: payload_locked_documents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_locked_documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_locked_documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_locked_documents_id_seq OWNED BY public.payload_locked_documents.id;


--
-- Name: payload_locked_documents_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_locked_documents_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    users_id integer,
    media_id integer,
    artiesten_id integer,
    inloggeschiedenis_id integer
);


--
-- Name: payload_locked_documents_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_locked_documents_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_locked_documents_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_locked_documents_rels_id_seq OWNED BY public.payload_locked_documents_rels.id;


--
-- Name: payload_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_migrations (
    id integer NOT NULL,
    name character varying,
    batch numeric,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: payload_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_migrations_id_seq OWNED BY public.payload_migrations.id;


--
-- Name: payload_preferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_preferences (
    id integer NOT NULL,
    key character varying,
    value jsonb,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: payload_preferences_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_preferences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_preferences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_preferences_id_seq OWNED BY public.payload_preferences.id;


--
-- Name: payload_preferences_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_preferences_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    users_id integer
);


--
-- Name: payload_preferences_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_preferences_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_preferences_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_preferences_rels_id_seq OWNED BY public.payload_preferences_rels.id;


--
-- Name: site_instellingen; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.site_instellingen (
    id integer NOT NULL,
    merknaam character varying,
    merk_ondertitel character varying,
    merk_zin character varying,
    copyright character varying,
    slogan character varying,
    socials_instagram character varying,
    socials_tiktok character varying,
    socials_youtube character varying,
    _status public.enum_site_instellingen_status DEFAULT 'draft'::public.enum_site_instellingen_status,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: site_instellingen_footer_info; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.site_instellingen_footer_info (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    label character varying,
    link character varying
);


--
-- Name: site_instellingen_footer_menu; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.site_instellingen_footer_menu (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    label character varying,
    link character varying
);


--
-- Name: site_instellingen_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.site_instellingen_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: site_instellingen_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.site_instellingen_id_seq OWNED BY public.site_instellingen.id;


--
-- Name: site_instellingen_menu; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.site_instellingen_menu (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    label character varying,
    link character varying
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    naam character varying NOT NULL,
    rol public.enum_users_rol DEFAULT 'redacteur'::public.enum_users_rol NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    email character varying NOT NULL,
    reset_password_token character varying,
    reset_password_expiration timestamp(3) with time zone,
    salt character varying,
    hash character varying,
    login_attempts numeric DEFAULT 0,
    lock_until timestamp(3) with time zone
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users_sessions (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    created_at timestamp(3) with time zone,
    expires_at timestamp(3) with time zone NOT NULL
);


--
-- Name: _artiesten_v id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._artiesten_v ALTER COLUMN id SET DEFAULT nextval('public._artiesten_v_id_seq'::regclass);


--
-- Name: _homepage_v id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._homepage_v ALTER COLUMN id SET DEFAULT nextval('public._homepage_v_id_seq'::regclass);


--
-- Name: _homepage_v_version_collecties id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._homepage_v_version_collecties ALTER COLUMN id SET DEFAULT nextval('public._homepage_v_version_collecties_id_seq'::regclass);


--
-- Name: _homepage_v_version_hero_titel_regels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._homepage_v_version_hero_titel_regels ALTER COLUMN id SET DEFAULT nextval('public._homepage_v_version_hero_titel_regels_id_seq'::regclass);


--
-- Name: _homepage_v_version_stappen id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._homepage_v_version_stappen ALTER COLUMN id SET DEFAULT nextval('public._homepage_v_version_stappen_id_seq'::regclass);


--
-- Name: _site_instellingen_v id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._site_instellingen_v ALTER COLUMN id SET DEFAULT nextval('public._site_instellingen_v_id_seq'::regclass);


--
-- Name: _site_instellingen_v_version_footer_info id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._site_instellingen_v_version_footer_info ALTER COLUMN id SET DEFAULT nextval('public._site_instellingen_v_version_footer_info_id_seq'::regclass);


--
-- Name: _site_instellingen_v_version_footer_menu id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._site_instellingen_v_version_footer_menu ALTER COLUMN id SET DEFAULT nextval('public._site_instellingen_v_version_footer_menu_id_seq'::regclass);


--
-- Name: _site_instellingen_v_version_menu id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._site_instellingen_v_version_menu ALTER COLUMN id SET DEFAULT nextval('public._site_instellingen_v_version_menu_id_seq'::regclass);


--
-- Name: artiesten id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.artiesten ALTER COLUMN id SET DEFAULT nextval('public.artiesten_id_seq'::regclass);


--
-- Name: homepage id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homepage ALTER COLUMN id SET DEFAULT nextval('public.homepage_id_seq'::regclass);


--
-- Name: inloggeschiedenis id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inloggeschiedenis ALTER COLUMN id SET DEFAULT nextval('public.inloggeschiedenis_id_seq'::regclass);


--
-- Name: media id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media ALTER COLUMN id SET DEFAULT nextval('public.media_id_seq'::regclass);


--
-- Name: payload_kv id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_kv ALTER COLUMN id SET DEFAULT nextval('public.payload_kv_id_seq'::regclass);


--
-- Name: payload_locked_documents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents ALTER COLUMN id SET DEFAULT nextval('public.payload_locked_documents_id_seq'::regclass);


--
-- Name: payload_locked_documents_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels ALTER COLUMN id SET DEFAULT nextval('public.payload_locked_documents_rels_id_seq'::regclass);


--
-- Name: payload_migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_migrations ALTER COLUMN id SET DEFAULT nextval('public.payload_migrations_id_seq'::regclass);


--
-- Name: payload_preferences id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences ALTER COLUMN id SET DEFAULT nextval('public.payload_preferences_id_seq'::regclass);


--
-- Name: payload_preferences_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences_rels ALTER COLUMN id SET DEFAULT nextval('public.payload_preferences_rels_id_seq'::regclass);


--
-- Name: site_instellingen id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_instellingen ALTER COLUMN id SET DEFAULT nextval('public.site_instellingen_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: _artiesten_v _artiesten_v_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._artiesten_v
    ADD CONSTRAINT _artiesten_v_pkey PRIMARY KEY (id);


--
-- Name: _homepage_v _homepage_v_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._homepage_v
    ADD CONSTRAINT _homepage_v_pkey PRIMARY KEY (id);


--
-- Name: _homepage_v_version_collecties _homepage_v_version_collecties_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._homepage_v_version_collecties
    ADD CONSTRAINT _homepage_v_version_collecties_pkey PRIMARY KEY (id);


--
-- Name: _homepage_v_version_hero_titel_regels _homepage_v_version_hero_titel_regels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._homepage_v_version_hero_titel_regels
    ADD CONSTRAINT _homepage_v_version_hero_titel_regels_pkey PRIMARY KEY (id);


--
-- Name: _homepage_v_version_stappen _homepage_v_version_stappen_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._homepage_v_version_stappen
    ADD CONSTRAINT _homepage_v_version_stappen_pkey PRIMARY KEY (id);


--
-- Name: _site_instellingen_v _site_instellingen_v_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._site_instellingen_v
    ADD CONSTRAINT _site_instellingen_v_pkey PRIMARY KEY (id);


--
-- Name: _site_instellingen_v_version_footer_info _site_instellingen_v_version_footer_info_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._site_instellingen_v_version_footer_info
    ADD CONSTRAINT _site_instellingen_v_version_footer_info_pkey PRIMARY KEY (id);


--
-- Name: _site_instellingen_v_version_footer_menu _site_instellingen_v_version_footer_menu_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._site_instellingen_v_version_footer_menu
    ADD CONSTRAINT _site_instellingen_v_version_footer_menu_pkey PRIMARY KEY (id);


--
-- Name: _site_instellingen_v_version_menu _site_instellingen_v_version_menu_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._site_instellingen_v_version_menu
    ADD CONSTRAINT _site_instellingen_v_version_menu_pkey PRIMARY KEY (id);


--
-- Name: artiesten artiesten_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.artiesten
    ADD CONSTRAINT artiesten_pkey PRIMARY KEY (id);


--
-- Name: homepage_collecties homepage_collecties_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homepage_collecties
    ADD CONSTRAINT homepage_collecties_pkey PRIMARY KEY (id);


--
-- Name: homepage_hero_titel_regels homepage_hero_titel_regels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homepage_hero_titel_regels
    ADD CONSTRAINT homepage_hero_titel_regels_pkey PRIMARY KEY (id);


--
-- Name: homepage homepage_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homepage
    ADD CONSTRAINT homepage_pkey PRIMARY KEY (id);


--
-- Name: homepage_stappen homepage_stappen_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homepage_stappen
    ADD CONSTRAINT homepage_stappen_pkey PRIMARY KEY (id);


--
-- Name: inloggeschiedenis inloggeschiedenis_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inloggeschiedenis
    ADD CONSTRAINT inloggeschiedenis_pkey PRIMARY KEY (id);


--
-- Name: media media_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id);


--
-- Name: payload_kv payload_kv_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_kv
    ADD CONSTRAINT payload_kv_pkey PRIMARY KEY (id);


--
-- Name: payload_locked_documents payload_locked_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents
    ADD CONSTRAINT payload_locked_documents_pkey PRIMARY KEY (id);


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_pkey PRIMARY KEY (id);


--
-- Name: payload_migrations payload_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_migrations
    ADD CONSTRAINT payload_migrations_pkey PRIMARY KEY (id);


--
-- Name: payload_preferences payload_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences
    ADD CONSTRAINT payload_preferences_pkey PRIMARY KEY (id);


--
-- Name: payload_preferences_rels payload_preferences_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_pkey PRIMARY KEY (id);


--
-- Name: site_instellingen_footer_info site_instellingen_footer_info_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_instellingen_footer_info
    ADD CONSTRAINT site_instellingen_footer_info_pkey PRIMARY KEY (id);


--
-- Name: site_instellingen_footer_menu site_instellingen_footer_menu_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_instellingen_footer_menu
    ADD CONSTRAINT site_instellingen_footer_menu_pkey PRIMARY KEY (id);


--
-- Name: site_instellingen_menu site_instellingen_menu_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_instellingen_menu
    ADD CONSTRAINT site_instellingen_menu_pkey PRIMARY KEY (id);


--
-- Name: site_instellingen site_instellingen_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_instellingen
    ADD CONSTRAINT site_instellingen_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_sessions users_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_sessions
    ADD CONSTRAINT users_sessions_pkey PRIMARY KEY (id);


--
-- Name: _artiesten_v_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _artiesten_v_created_at_idx ON public._artiesten_v USING btree (created_at);


--
-- Name: _artiesten_v_latest_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _artiesten_v_latest_idx ON public._artiesten_v USING btree (latest);


--
-- Name: _artiesten_v_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _artiesten_v_parent_idx ON public._artiesten_v USING btree (parent_id);


--
-- Name: _artiesten_v_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _artiesten_v_updated_at_idx ON public._artiesten_v USING btree (updated_at);


--
-- Name: _artiesten_v_version_version__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _artiesten_v_version_version__status_idx ON public._artiesten_v USING btree (version__status);


--
-- Name: _artiesten_v_version_version_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _artiesten_v_version_version_created_at_idx ON public._artiesten_v USING btree (version_created_at);


--
-- Name: _artiesten_v_version_version_portret_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _artiesten_v_version_version_portret_idx ON public._artiesten_v USING btree (version_portret_id);


--
-- Name: _artiesten_v_version_version_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _artiesten_v_version_version_slug_idx ON public._artiesten_v USING btree (version_slug);


--
-- Name: _artiesten_v_version_version_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _artiesten_v_version_version_updated_at_idx ON public._artiesten_v USING btree (version_updated_at);


--
-- Name: _homepage_v_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _homepage_v_created_at_idx ON public._homepage_v USING btree (created_at);


--
-- Name: _homepage_v_latest_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _homepage_v_latest_idx ON public._homepage_v USING btree (latest);


--
-- Name: _homepage_v_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _homepage_v_updated_at_idx ON public._homepage_v USING btree (updated_at);


--
-- Name: _homepage_v_version_collecties_afbeelding_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _homepage_v_version_collecties_afbeelding_idx ON public._homepage_v_version_collecties USING btree (afbeelding_id);


--
-- Name: _homepage_v_version_collecties_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _homepage_v_version_collecties_order_idx ON public._homepage_v_version_collecties USING btree (_order);


--
-- Name: _homepage_v_version_collecties_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _homepage_v_version_collecties_parent_id_idx ON public._homepage_v_version_collecties USING btree (_parent_id);


--
-- Name: _homepage_v_version_hero_titel_regels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _homepage_v_version_hero_titel_regels_order_idx ON public._homepage_v_version_hero_titel_regels USING btree (_order);


--
-- Name: _homepage_v_version_hero_titel_regels_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _homepage_v_version_hero_titel_regels_parent_id_idx ON public._homepage_v_version_hero_titel_regels USING btree (_parent_id);


--
-- Name: _homepage_v_version_hero_version_hero_afbeelding_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _homepage_v_version_hero_version_hero_afbeelding_idx ON public._homepage_v USING btree (version_hero_afbeelding_id);


--
-- Name: _homepage_v_version_hero_version_hero_afbeelding_mobiel_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _homepage_v_version_hero_version_hero_afbeelding_mobiel_idx ON public._homepage_v USING btree (version_hero_afbeelding_mobiel_id);


--
-- Name: _homepage_v_version_stappen_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _homepage_v_version_stappen_order_idx ON public._homepage_v_version_stappen USING btree (_order);


--
-- Name: _homepage_v_version_stappen_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _homepage_v_version_stappen_parent_id_idx ON public._homepage_v_version_stappen USING btree (_parent_id);


--
-- Name: _homepage_v_version_version__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _homepage_v_version_version__status_idx ON public._homepage_v USING btree (version__status);


--
-- Name: _homepage_v_version_version_drop_afbeelding_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _homepage_v_version_version_drop_afbeelding_idx ON public._homepage_v USING btree (version_drop_afbeelding_id);


--
-- Name: _homepage_v_version_version_verhaal_afbeelding_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _homepage_v_version_version_verhaal_afbeelding_idx ON public._homepage_v USING btree (version_verhaal_afbeelding_id);


--
-- Name: _site_instellingen_v_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _site_instellingen_v_created_at_idx ON public._site_instellingen_v USING btree (created_at);


--
-- Name: _site_instellingen_v_latest_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _site_instellingen_v_latest_idx ON public._site_instellingen_v USING btree (latest);


--
-- Name: _site_instellingen_v_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _site_instellingen_v_updated_at_idx ON public._site_instellingen_v USING btree (updated_at);


--
-- Name: _site_instellingen_v_version_footer_info_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _site_instellingen_v_version_footer_info_order_idx ON public._site_instellingen_v_version_footer_info USING btree (_order);


--
-- Name: _site_instellingen_v_version_footer_info_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _site_instellingen_v_version_footer_info_parent_id_idx ON public._site_instellingen_v_version_footer_info USING btree (_parent_id);


--
-- Name: _site_instellingen_v_version_footer_menu_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _site_instellingen_v_version_footer_menu_order_idx ON public._site_instellingen_v_version_footer_menu USING btree (_order);


--
-- Name: _site_instellingen_v_version_footer_menu_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _site_instellingen_v_version_footer_menu_parent_id_idx ON public._site_instellingen_v_version_footer_menu USING btree (_parent_id);


--
-- Name: _site_instellingen_v_version_menu_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _site_instellingen_v_version_menu_order_idx ON public._site_instellingen_v_version_menu USING btree (_order);


--
-- Name: _site_instellingen_v_version_menu_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _site_instellingen_v_version_menu_parent_id_idx ON public._site_instellingen_v_version_menu USING btree (_parent_id);


--
-- Name: _site_instellingen_v_version_version__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _site_instellingen_v_version_version__status_idx ON public._site_instellingen_v USING btree (version__status);


--
-- Name: artiesten__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX artiesten__status_idx ON public.artiesten USING btree (_status);


--
-- Name: artiesten_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX artiesten_created_at_idx ON public.artiesten USING btree (created_at);


--
-- Name: artiesten_portret_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX artiesten_portret_idx ON public.artiesten USING btree (portret_id);


--
-- Name: artiesten_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX artiesten_slug_idx ON public.artiesten USING btree (slug);


--
-- Name: artiesten_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX artiesten_updated_at_idx ON public.artiesten USING btree (updated_at);


--
-- Name: homepage__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX homepage__status_idx ON public.homepage USING btree (_status);


--
-- Name: homepage_collecties_afbeelding_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX homepage_collecties_afbeelding_idx ON public.homepage_collecties USING btree (afbeelding_id);


--
-- Name: homepage_collecties_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX homepage_collecties_order_idx ON public.homepage_collecties USING btree (_order);


--
-- Name: homepage_collecties_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX homepage_collecties_parent_id_idx ON public.homepage_collecties USING btree (_parent_id);


--
-- Name: homepage_drop_afbeelding_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX homepage_drop_afbeelding_idx ON public.homepage USING btree (drop_afbeelding_id);


--
-- Name: homepage_hero_hero_afbeelding_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX homepage_hero_hero_afbeelding_idx ON public.homepage USING btree (hero_afbeelding_id);


--
-- Name: homepage_hero_hero_afbeelding_mobiel_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX homepage_hero_hero_afbeelding_mobiel_idx ON public.homepage USING btree (hero_afbeelding_mobiel_id);


--
-- Name: homepage_hero_titel_regels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX homepage_hero_titel_regels_order_idx ON public.homepage_hero_titel_regels USING btree (_order);


--
-- Name: homepage_hero_titel_regels_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX homepage_hero_titel_regels_parent_id_idx ON public.homepage_hero_titel_regels USING btree (_parent_id);


--
-- Name: homepage_stappen_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX homepage_stappen_order_idx ON public.homepage_stappen USING btree (_order);


--
-- Name: homepage_stappen_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX homepage_stappen_parent_id_idx ON public.homepage_stappen USING btree (_parent_id);


--
-- Name: homepage_verhaal_afbeelding_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX homepage_verhaal_afbeelding_idx ON public.homepage USING btree (verhaal_afbeelding_id);


--
-- Name: inloggeschiedenis_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX inloggeschiedenis_created_at_idx ON public.inloggeschiedenis USING btree (created_at);


--
-- Name: inloggeschiedenis_gebruiker_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX inloggeschiedenis_gebruiker_idx ON public.inloggeschiedenis USING btree (gebruiker_id);


--
-- Name: inloggeschiedenis_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX inloggeschiedenis_updated_at_idx ON public.inloggeschiedenis USING btree (updated_at);


--
-- Name: media_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX media_created_at_idx ON public.media USING btree (created_at);


--
-- Name: media_filename_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX media_filename_idx ON public.media USING btree (filename);


--
-- Name: media_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX media_updated_at_idx ON public.media USING btree (updated_at);


--
-- Name: payload_kv_key_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX payload_kv_key_idx ON public.payload_kv USING btree (key);


--
-- Name: payload_locked_documents_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_created_at_idx ON public.payload_locked_documents USING btree (created_at);


--
-- Name: payload_locked_documents_global_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_global_slug_idx ON public.payload_locked_documents USING btree (global_slug);


--
-- Name: payload_locked_documents_rels_artiesten_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_artiesten_id_idx ON public.payload_locked_documents_rels USING btree (artiesten_id);


--
-- Name: payload_locked_documents_rels_inloggeschiedenis_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_inloggeschiedenis_id_idx ON public.payload_locked_documents_rels USING btree (inloggeschiedenis_id);


--
-- Name: payload_locked_documents_rels_media_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_media_id_idx ON public.payload_locked_documents_rels USING btree (media_id);


--
-- Name: payload_locked_documents_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_order_idx ON public.payload_locked_documents_rels USING btree ("order");


--
-- Name: payload_locked_documents_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_parent_idx ON public.payload_locked_documents_rels USING btree (parent_id);


--
-- Name: payload_locked_documents_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_path_idx ON public.payload_locked_documents_rels USING btree (path);


--
-- Name: payload_locked_documents_rels_users_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_users_id_idx ON public.payload_locked_documents_rels USING btree (users_id);


--
-- Name: payload_locked_documents_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_updated_at_idx ON public.payload_locked_documents USING btree (updated_at);


--
-- Name: payload_migrations_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_migrations_created_at_idx ON public.payload_migrations USING btree (created_at);


--
-- Name: payload_migrations_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_migrations_updated_at_idx ON public.payload_migrations USING btree (updated_at);


--
-- Name: payload_preferences_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_created_at_idx ON public.payload_preferences USING btree (created_at);


--
-- Name: payload_preferences_key_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_key_idx ON public.payload_preferences USING btree (key);


--
-- Name: payload_preferences_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_rels_order_idx ON public.payload_preferences_rels USING btree ("order");


--
-- Name: payload_preferences_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_rels_parent_idx ON public.payload_preferences_rels USING btree (parent_id);


--
-- Name: payload_preferences_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_rels_path_idx ON public.payload_preferences_rels USING btree (path);


--
-- Name: payload_preferences_rels_users_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_rels_users_id_idx ON public.payload_preferences_rels USING btree (users_id);


--
-- Name: payload_preferences_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_updated_at_idx ON public.payload_preferences USING btree (updated_at);


--
-- Name: site_instellingen__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX site_instellingen__status_idx ON public.site_instellingen USING btree (_status);


--
-- Name: site_instellingen_footer_info_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX site_instellingen_footer_info_order_idx ON public.site_instellingen_footer_info USING btree (_order);


--
-- Name: site_instellingen_footer_info_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX site_instellingen_footer_info_parent_id_idx ON public.site_instellingen_footer_info USING btree (_parent_id);


--
-- Name: site_instellingen_footer_menu_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX site_instellingen_footer_menu_order_idx ON public.site_instellingen_footer_menu USING btree (_order);


--
-- Name: site_instellingen_footer_menu_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX site_instellingen_footer_menu_parent_id_idx ON public.site_instellingen_footer_menu USING btree (_parent_id);


--
-- Name: site_instellingen_menu_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX site_instellingen_menu_order_idx ON public.site_instellingen_menu USING btree (_order);


--
-- Name: site_instellingen_menu_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX site_instellingen_menu_parent_id_idx ON public.site_instellingen_menu USING btree (_parent_id);


--
-- Name: users_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_created_at_idx ON public.users USING btree (created_at);


--
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_idx ON public.users USING btree (email);


--
-- Name: users_sessions_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_sessions_order_idx ON public.users_sessions USING btree (_order);


--
-- Name: users_sessions_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_sessions_parent_id_idx ON public.users_sessions USING btree (_parent_id);


--
-- Name: users_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_updated_at_idx ON public.users USING btree (updated_at);


--
-- Name: _artiesten_v _artiesten_v_parent_id_artiesten_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._artiesten_v
    ADD CONSTRAINT _artiesten_v_parent_id_artiesten_id_fk FOREIGN KEY (parent_id) REFERENCES public.artiesten(id) ON DELETE SET NULL;


--
-- Name: _artiesten_v _artiesten_v_version_portret_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._artiesten_v
    ADD CONSTRAINT _artiesten_v_version_portret_id_media_id_fk FOREIGN KEY (version_portret_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _homepage_v_version_collecties _homepage_v_version_collecties_afbeelding_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._homepage_v_version_collecties
    ADD CONSTRAINT _homepage_v_version_collecties_afbeelding_id_media_id_fk FOREIGN KEY (afbeelding_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _homepage_v_version_collecties _homepage_v_version_collecties_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._homepage_v_version_collecties
    ADD CONSTRAINT _homepage_v_version_collecties_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._homepage_v(id) ON DELETE CASCADE;


--
-- Name: _homepage_v _homepage_v_version_drop_afbeelding_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._homepage_v
    ADD CONSTRAINT _homepage_v_version_drop_afbeelding_id_media_id_fk FOREIGN KEY (version_drop_afbeelding_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _homepage_v _homepage_v_version_hero_afbeelding_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._homepage_v
    ADD CONSTRAINT _homepage_v_version_hero_afbeelding_id_media_id_fk FOREIGN KEY (version_hero_afbeelding_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _homepage_v _homepage_v_version_hero_afbeelding_mobiel_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._homepage_v
    ADD CONSTRAINT _homepage_v_version_hero_afbeelding_mobiel_id_media_id_fk FOREIGN KEY (version_hero_afbeelding_mobiel_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _homepage_v_version_hero_titel_regels _homepage_v_version_hero_titel_regels_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._homepage_v_version_hero_titel_regels
    ADD CONSTRAINT _homepage_v_version_hero_titel_regels_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._homepage_v(id) ON DELETE CASCADE;


--
-- Name: _homepage_v_version_stappen _homepage_v_version_stappen_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._homepage_v_version_stappen
    ADD CONSTRAINT _homepage_v_version_stappen_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._homepage_v(id) ON DELETE CASCADE;


--
-- Name: _homepage_v _homepage_v_version_verhaal_afbeelding_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._homepage_v
    ADD CONSTRAINT _homepage_v_version_verhaal_afbeelding_id_media_id_fk FOREIGN KEY (version_verhaal_afbeelding_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _site_instellingen_v_version_footer_info _site_instellingen_v_version_footer_info_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._site_instellingen_v_version_footer_info
    ADD CONSTRAINT _site_instellingen_v_version_footer_info_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._site_instellingen_v(id) ON DELETE CASCADE;


--
-- Name: _site_instellingen_v_version_footer_menu _site_instellingen_v_version_footer_menu_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._site_instellingen_v_version_footer_menu
    ADD CONSTRAINT _site_instellingen_v_version_footer_menu_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._site_instellingen_v(id) ON DELETE CASCADE;


--
-- Name: _site_instellingen_v_version_menu _site_instellingen_v_version_menu_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._site_instellingen_v_version_menu
    ADD CONSTRAINT _site_instellingen_v_version_menu_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._site_instellingen_v(id) ON DELETE CASCADE;


--
-- Name: artiesten artiesten_portret_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.artiesten
    ADD CONSTRAINT artiesten_portret_id_media_id_fk FOREIGN KEY (portret_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: homepage_collecties homepage_collecties_afbeelding_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homepage_collecties
    ADD CONSTRAINT homepage_collecties_afbeelding_id_media_id_fk FOREIGN KEY (afbeelding_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: homepage_collecties homepage_collecties_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homepage_collecties
    ADD CONSTRAINT homepage_collecties_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.homepage(id) ON DELETE CASCADE;


--
-- Name: homepage homepage_drop_afbeelding_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homepage
    ADD CONSTRAINT homepage_drop_afbeelding_id_media_id_fk FOREIGN KEY (drop_afbeelding_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: homepage homepage_hero_afbeelding_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homepage
    ADD CONSTRAINT homepage_hero_afbeelding_id_media_id_fk FOREIGN KEY (hero_afbeelding_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: homepage homepage_hero_afbeelding_mobiel_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homepage
    ADD CONSTRAINT homepage_hero_afbeelding_mobiel_id_media_id_fk FOREIGN KEY (hero_afbeelding_mobiel_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: homepage_hero_titel_regels homepage_hero_titel_regels_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homepage_hero_titel_regels
    ADD CONSTRAINT homepage_hero_titel_regels_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.homepage(id) ON DELETE CASCADE;


--
-- Name: homepage_stappen homepage_stappen_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homepage_stappen
    ADD CONSTRAINT homepage_stappen_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.homepage(id) ON DELETE CASCADE;


--
-- Name: homepage homepage_verhaal_afbeelding_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homepage
    ADD CONSTRAINT homepage_verhaal_afbeelding_id_media_id_fk FOREIGN KEY (verhaal_afbeelding_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: inloggeschiedenis inloggeschiedenis_gebruiker_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inloggeschiedenis
    ADD CONSTRAINT inloggeschiedenis_gebruiker_id_users_id_fk FOREIGN KEY (gebruiker_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_artiesten_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_artiesten_fk FOREIGN KEY (artiesten_id) REFERENCES public.artiesten(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_inloggeschiedenis_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_inloggeschiedenis_fk FOREIGN KEY (inloggeschiedenis_id) REFERENCES public.inloggeschiedenis(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_media_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_media_fk FOREIGN KEY (media_id) REFERENCES public.media(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.payload_locked_documents(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_users_fk FOREIGN KEY (users_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payload_preferences_rels payload_preferences_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.payload_preferences(id) ON DELETE CASCADE;


--
-- Name: payload_preferences_rels payload_preferences_rels_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_users_fk FOREIGN KEY (users_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: site_instellingen_footer_info site_instellingen_footer_info_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_instellingen_footer_info
    ADD CONSTRAINT site_instellingen_footer_info_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.site_instellingen(id) ON DELETE CASCADE;


--
-- Name: site_instellingen_footer_menu site_instellingen_footer_menu_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_instellingen_footer_menu
    ADD CONSTRAINT site_instellingen_footer_menu_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.site_instellingen(id) ON DELETE CASCADE;


--
-- Name: site_instellingen_menu site_instellingen_menu_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_instellingen_menu
    ADD CONSTRAINT site_instellingen_menu_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.site_instellingen(id) ON DELETE CASCADE;


--
-- Name: users_sessions users_sessions_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_sessions
    ADD CONSTRAINT users_sessions_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


