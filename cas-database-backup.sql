--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (415ebe8)
-- Dumped by pg_dump version 16.9

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
-- Name: log_status; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.log_status AS ENUM (
    'success',
    'failed',
    'in_progress'
);


ALTER TYPE public.log_status OWNER TO neondb_owner;

--
-- Name: operation; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.operation AS ENUM (
    'received',
    'field_sync',
    'crm_push',
    'retry_attempt'
);


ALTER TYPE public.operation OWNER TO neondb_owner;

--
-- Name: processing_status; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.processing_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed'
);


ALTER TYPE public.processing_status OWNER TO neondb_owner;

--
-- Name: sync_status; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.sync_status AS ENUM (
    'pending',
    'synced',
    'failed'
);


ALTER TYPE public.sync_status OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: field_mappings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.field_mappings (
    id integer NOT NULL,
    zoho_module character varying(100) NOT NULL,
    field_name character varying(255) NOT NULL,
    field_type character varying(50) NOT NULL,
    is_custom_field boolean DEFAULT false NOT NULL,
    picklist_values jsonb,
    is_required boolean DEFAULT false NOT NULL,
    max_length integer,
    last_synced_at timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.field_mappings OWNER TO neondb_owner;

--
-- Name: field_mappings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.field_mappings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.field_mappings_id_seq OWNER TO neondb_owner;

--
-- Name: field_mappings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.field_mappings_id_seq OWNED BY public.field_mappings.id;


--
-- Name: field_metadata_cache; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.field_metadata_cache (
    id integer NOT NULL,
    zoho_module character varying(100) NOT NULL,
    field_api_name character varying(255) NOT NULL,
    field_label character varying(255) NOT NULL,
    data_type character varying(50) NOT NULL,
    is_custom_field boolean DEFAULT false NOT NULL,
    is_required boolean DEFAULT false NOT NULL,
    max_length integer,
    picklist_values jsonb,
    field_metadata jsonb,
    last_synced timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.field_metadata_cache OWNER TO neondb_owner;

--
-- Name: field_metadata_cache_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.field_metadata_cache_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.field_metadata_cache_id_seq OWNER TO neondb_owner;

--
-- Name: field_metadata_cache_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.field_metadata_cache_id_seq OWNED BY public.field_metadata_cache.id;


--
-- Name: form_configurations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.form_configurations (
    id integer NOT NULL,
    form_name character varying(255) NOT NULL,
    zoho_module character varying(100) DEFAULT 'Leads'::character varying NOT NULL,
    field_mappings jsonb,
    is_active boolean DEFAULT true NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.form_configurations OWNER TO neondb_owner;

--
-- Name: form_configurations_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.form_configurations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.form_configurations_id_seq OWNER TO neondb_owner;

--
-- Name: form_configurations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.form_configurations_id_seq OWNED BY public.form_configurations.id;


--
-- Name: form_submissions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.form_submissions (
    id integer NOT NULL,
    form_name character varying(255) NOT NULL,
    submission_data jsonb NOT NULL,
    source_form character varying(255) NOT NULL,
    zoho_module character varying(100) DEFAULT 'Leads'::character varying NOT NULL,
    zoho_crm_id character varying(100),
    processing_status public.processing_status DEFAULT 'pending'::public.processing_status NOT NULL,
    sync_status public.sync_status DEFAULT 'pending'::public.sync_status NOT NULL,
    error_message text,
    retry_count integer DEFAULT 0 NOT NULL,
    last_retry_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    next_retry_at timestamp without time zone,
    last_sync_at timestamp without time zone
);


ALTER TABLE public.form_submissions OWNER TO neondb_owner;

--
-- Name: form_submissions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.form_submissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.form_submissions_id_seq OWNER TO neondb_owner;

--
-- Name: form_submissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.form_submissions_id_seq OWNED BY public.form_submissions.id;


--
-- Name: oauth_tokens; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.oauth_tokens (
    id integer NOT NULL,
    provider character varying(50) NOT NULL,
    access_token text,
    refresh_token text,
    expires_at timestamp without time zone,
    scope text,
    token_type character varying(50) DEFAULT 'Bearer'::character varying,
    is_active boolean DEFAULT true NOT NULL,
    last_refreshed timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.oauth_tokens OWNER TO neondb_owner;

--
-- Name: oauth_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.oauth_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.oauth_tokens_id_seq OWNER TO neondb_owner;

--
-- Name: oauth_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.oauth_tokens_id_seq OWNED BY public.oauth_tokens.id;


--
-- Name: resources; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.resources (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    file_url character varying(500) NOT NULL,
    file_name character varying(255) NOT NULL,
    file_type character varying(50) NOT NULL,
    file_size character varying(50),
    amyloidosis_type character varying(50) NOT NULL,
    resource_type character varying(100) NOT NULL,
    category character varying(100) NOT NULL,
    audience character varying(100) NOT NULL,
    language character varying(10) DEFAULT 'en'::character varying NOT NULL,
    region character varying(50) DEFAULT 'national'::character varying NOT NULL,
    is_public boolean DEFAULT true NOT NULL,
    requires_login boolean DEFAULT false NOT NULL,
    submitted_by character varying(255),
    moderated_by character varying(255),
    is_approved boolean DEFAULT false NOT NULL,
    tags text[],
    download_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.resources OWNER TO neondb_owner;

--
-- Name: resources_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.resources_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resources_id_seq OWNER TO neondb_owner;

--
-- Name: resources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.resources_id_seq OWNED BY public.resources.id;


--
-- Name: submission_logs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.submission_logs (
    id integer NOT NULL,
    submission_id integer NOT NULL,
    operation public.operation NOT NULL,
    status public.log_status NOT NULL,
    details jsonb,
    error_message text,
    duration integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.submission_logs OWNER TO neondb_owner;

--
-- Name: submission_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.submission_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.submission_logs_id_seq OWNER TO neondb_owner;

--
-- Name: submission_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.submission_logs_id_seq OWNED BY public.submission_logs.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: field_mappings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.field_mappings ALTER COLUMN id SET DEFAULT nextval('public.field_mappings_id_seq'::regclass);


--
-- Name: field_metadata_cache id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.field_metadata_cache ALTER COLUMN id SET DEFAULT nextval('public.field_metadata_cache_id_seq'::regclass);


--
-- Name: form_configurations id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.form_configurations ALTER COLUMN id SET DEFAULT nextval('public.form_configurations_id_seq'::regclass);


--
-- Name: form_submissions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.form_submissions ALTER COLUMN id SET DEFAULT nextval('public.form_submissions_id_seq'::regclass);


--
-- Name: oauth_tokens id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.oauth_tokens ALTER COLUMN id SET DEFAULT nextval('public.oauth_tokens_id_seq'::regclass);


--
-- Name: resources id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.resources ALTER COLUMN id SET DEFAULT nextval('public.resources_id_seq'::regclass);


--
-- Name: submission_logs id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.submission_logs ALTER COLUMN id SET DEFAULT nextval('public.submission_logs_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: field_mappings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.field_mappings (id, zoho_module, field_name, field_type, is_custom_field, picklist_values, is_required, max_length, last_synced_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: field_metadata_cache; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.field_metadata_cache (id, zoho_module, field_api_name, field_label, data_type, is_custom_field, is_required, max_length, picklist_values, field_metadata, last_synced, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: form_configurations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.form_configurations (id, form_name, zoho_module, field_mappings, is_active, description, created_at, updated_at) FROM stdin;
1	Join CANN Today	Leads	{"fullName": {"fieldType": "text", "zohoField": "fullName", "isRequired": false, "description": "Full name of the applicant"}, "discipline": {"fieldType": "text", "zohoField": "discipline", "isRequired": false, "description": "Professional discipline (nurse, physician, etc.)"}, "emailAddress": {"fieldType": "email", "zohoField": "emailAddress", "isRequired": false, "description": "Email address of the applicant"}, "subspecialty": {"fieldType": "text", "zohoField": "subspecialty", "isRequired": false, "description": "Sub-specialty area of focus"}, "institutionFax": {"fieldType": "text", "zohoField": "institutionFax", "isRequired": false, "description": "Institution fax number"}, "followUpConsent": {"fieldType": "picklist", "zohoField": "followUpConsent", "isRequired": false, "description": "Consent for follow-up contact by CAS"}, "institutionName": {"fieldType": "text", "zohoField": "institutionName", "isRequired": false, "description": "Center or clinic name/institution"}, "institutionPhone": {"fieldType": "phone", "zohoField": "institutionPhone", "isRequired": false, "description": "Institution phone number"}, "membershipRequest": {"fieldType": "picklist", "zohoField": "membershipRequest", "isRequired": true, "description": "Whether user wants CAS membership"}, "institutionAddress": {"fieldType": "text", "zohoField": "institutionAddress", "isRequired": false, "description": "Full address of institution"}, "mapInstitutionName": {"fieldType": "text", "zohoField": "mapInstitutionName", "isRequired": false, "description": "Institution name for services map"}, "servicesMapConsent": {"fieldType": "picklist", "zohoField": "servicesMapConsent", "isRequired": true, "description": "Consent for including center in services map"}, "communicationConsent": {"fieldType": "picklist", "zohoField": "communicationConsent", "isRequired": false, "description": "Consent for communication from CAS"}}	t	Canadian Amyloidosis Nursing Network membership application form	2025-09-21 13:46:00.377788	2025-09-21 13:46:00.377788
\.


--
-- Data for Name: form_submissions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.form_submissions (id, form_name, submission_data, source_form, zoho_module, zoho_crm_id, processing_status, sync_status, error_message, retry_count, last_retry_at, created_at, updated_at, next_retry_at, last_sync_at) FROM stdin;
2	Join CANN Today	{"fullName": "Nurse Emily Chen", "discipline": "Nurse Practitioner", "emailAddress": "emily.chen@vancouver.ca", "subspecialty": "Hematology/Oncology", "institutionFax": "+1-604-875-4112", "followUpConsent": "Yes", "institutionName": "VGH Hematology Clinic", "institutionPhone": "+1-604-875-4111", "membershipRequest": "Yes, I want to join CAS", "institutionAddress": "899 West 12th Avenue, Vancouver, BC V5Z 1M9", "mapInstitutionName": "Vancouver General Hospital - Hematology Department", "servicesMapConsent": "Yes", "communicationConsent": "Yes"}	Join CANN Today	Leads	\N	processing	pending	\N	0	\N	2025-09-21 13:46:21.926102	2025-09-21 13:46:21.964	\N	\N
8	test_icann_form	{"name": "Test User", "email": "test@example.com", "organization": "Test Org"}	test_icann_form	Leads	\N	failed	failed	Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field name: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field email: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field organization: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	1	\N	2025-09-27 11:27:39.23572	2025-09-27 11:41:28.971	\N	\N
7	test_integration	{"email": "test@example.com", "company": "Test Company", "message": "Testing CRM integration", "lastName": "User", "firstName": "Test"}	test_integration	Leads	\N	failed	failed	Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field email: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field company: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field message: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field lastname: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field firstname: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	1	\N	2025-09-26 14:05:54.044997	2025-09-27 11:41:30.374	\N	\N
6	Join CANN Today	{"fullName": "Local Test", "discipline": "Nurse", "emailAddress": "local@test.ca"}	Join CANN Today	Leads	\N	failed	failed	Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field fullname: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field discipline: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field emailaddress: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	1	\N	2025-09-26 13:09:01.823381	2025-09-27 11:41:31.7	\N	\N
3	Join CANN Today	{"fullName": "Development Test", "discipline": "Nurse", "emailAddress": "devtest@cann.ca", "subspecialty": "Oncology", "membershipRequest": "Yes, I want to join CAS"}	Join CANN Today	Leads	\N	failed	failed	Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field fullname: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field discipline: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field emailaddress: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field subspecialty: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field membershiprequest: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	1	\N	2025-09-21 14:45:42.143578	2025-09-27 11:41:35.744	\N	\N
1	Join CANN Today	{"fullName": "Dr. Sarah Johnson", "discipline": "Nurse", "emailAddress": "sarah.johnson@hospital.ca", "subspecialty": "Cardiology", "institutionFax": "+1-416-340-3132", "followUpConsent": "Yes", "institutionName": "Toronto General Hospital", "institutionPhone": "+1-416-340-3131", "membershipRequest": "Yes, I want to join CAS", "institutionAddress": "200 Elizabeth St, Toronto, ON M5G 2C4", "mapInstitutionName": "Toronto General Hospital Cardiology Unit", "servicesMapConsent": "Yes", "communicationConsent": "Yes"}	Join CANN Today	Leads	\N	failed	failed	Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field fullname: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field discipline: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field emailaddress: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field subspecialty: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field institutionfax: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field followupconsent: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field institutionname: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field institutionphone: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field membershiprequest: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field institutionaddress: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field mapinstitutionname: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field servicesmapconsent: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field communicationconsent: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	1	\N	2025-09-21 13:45:33.800454	2025-09-27 11:41:37.299	\N	\N
15	Join CANN Today	{"fullName": "krutik test", "discipline": "doctor", "emailAddress": "k@tp.com", "subspecialty": "ok", "otherInterest": "", "institutionFax": "", "amyloidosisType": "ATTR", "areasOfInterest": "Case presentations/discussion", "followUpConsent": "Yes", "institutionName": "test", "institutionPhone": "", "membershipRequest": "Yes, I want to join CAS", "presentationTopic": "", "institutionAddress": "", "mapInstitutionName": "test", "presentingInterest": "no", "servicesMapConsent": "Yes", "communicationConsent": "Yes", "otherAmyloidosisType": ""}	Join CANN Today	Leads	\N	completed	pending	\N	0	\N	2025-09-29 11:34:12.209471	2025-09-29 11:34:12.298	\N	\N
16	Join CANN Today	{"fullName": "Krutik test", "discipline": "Doctor", "emailAddress": "krutik@tp.com", "subspecialty": "heart", "otherInterest": "", "institutionFax": "", "amyloidosisType": "AL", "areasOfInterest": "Case presentations/discussion", "followUpConsent": "No", "institutionName": "test", "institutionPhone": "", "membershipRequest": "Yes, I want to join CAS", "presentationTopic": "", "institutionAddress": "", "mapInstitutionName": "test", "presentingInterest": "no", "servicesMapConsent": "Yes", "communicationConsent": "No", "otherAmyloidosisType": ""}	Join CANN Today	Leads	\N	failed	failed	No refresh token available. Please complete OAuth authorization first via /api/oauth/zoho/setup	0	\N	2025-09-29 11:42:35.684718	2025-09-29 11:42:35.781	\N	\N
17	Join CANN Today	{"fullName": "E2E Test User", "discipline": "Physician", "emailAddress": "e2e-test@example.com", "subspecialty": "Cardiology", "otherInterest": "", "institutionFax": "", "amyloidosisType": "ATTR", "areasOfInterest": "Case presentations/discussion", "followUpConsent": "Yes", "institutionName": "Test Medical Center", "institutionPhone": "", "membershipRequest": "Yes, I want to join CAS", "presentationTopic": "Not presenting at this time", "institutionAddress": "", "mapInstitutionName": "Test Medical Center", "presentingInterest": "yes", "servicesMapConsent": "Yes", "communicationConsent": "Yes", "otherAmyloidosisType": ""}	Join CANN Today	Leads	\N	failed	failed	No refresh token available. Please complete OAuth authorization first via /api/oauth/zoho/setup	0	\N	2025-09-29 11:50:53.22249	2025-09-29 11:50:53.382	\N	\N
5	Join CANN Today	{"fullName": "CRM Test User", "discipline": "Nurse", "emailAddress": "test.crm@example.ca", "subspecialty": "Cardiology"}	Join CANN Today	Leads	\N	failed	failed	Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field fullname: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field discipline: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field emailaddress: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field subspecialty: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	1	\N	2025-09-26 13:05:30.807271	2025-09-27 11:41:33.043	\N	\N
4	Join CANN Today	{"fullName": "Test Integration Check", "discipline": "Nurse", "emailAddress": "test@check.ca", "subspecialty": "Cardiology"}	Join CANN Today	Leads	\N	failed	failed	Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field fullname: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field discipline: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field emailaddress: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field subspecialty: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	1	\N	2025-09-26 12:48:24.464931	2025-09-27 11:41:34.382	\N	\N
12	oauth_test_lead	{"name": "Test User OAuth Flow", "email": "test+1759043592@amyloid.ca", "company": "CAS Testing Department", "message": "Testing OAuth integration and lead sync - 1759043592"}	oauth_test_lead	Leads	\N	failed	failed	Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field name: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field email: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field company: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field message: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	1	\N	2025-09-28 07:13:12.635806	2025-09-28 07:14:09.611	\N	\N
9	oauth_test_form	{"name": "OAuth Test User", "email": "test@amyloid.ca", "status": "testing_after_oauth_success"}	oauth_test_form	Leads	\N	failed	failed	Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field name: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field email: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field status: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	0	\N	2025-09-27 11:41:37.618797	2025-09-27 11:41:37.892	\N	\N
10	contact	{"name": "Test User", "email": "test@example.com", "message": "Testing form submission"}	contact	Leads	\N	failed	failed	Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field name: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field email: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field message: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	0	\N	2025-09-27 20:42:48.62707	2025-09-27 20:42:48.934	\N	\N
13	verification_test	{"name": "OAuth Verification Test", "email": "verification+1759044470@amyloid.ca", "company": "CAS Verification", "message": "Systematic verification test - 1759044470"}	verification_test	Leads	\N	failed	failed	Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field name: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field email: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field company: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field message: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	1	\N	2025-09-28 07:27:50.677678	2025-09-28 07:28:09.812	\N	\N
11	production_test	{"name": "OAuth Test", "email": "oauth@amyloid.ca", "purpose": "final verification"}	production_test	Leads	\N	failed	failed	Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field name: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field email: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field purpose: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	0	\N	2025-09-27 20:47:23.970196	2025-09-27 20:47:24.256	\N	\N
14	Join CANN Today	{"fullName": "Krutik test", "discipline": "Doctor", "emailAddress": "krutik.patel@teampumpkin.com", "subspecialty": "test", "otherInterest": "", "institutionFax": "", "amyloidosisType": "AL", "areasOfInterest": "Case presentations/discussion", "followUpConsent": "Yes", "institutionName": "test", "institutionPhone": "", "membershipRequest": "Yes, I want to join CAS", "presentationTopic": "", "institutionAddress": "", "mapInstitutionName": "test", "presentingInterest": "no", "servicesMapConsent": "Yes", "communicationConsent": "Yes", "otherAmyloidosisType": ""}	Join CANN Today	Leads	\N	completed	pending	\N	0	\N	2025-09-29 11:03:49.133387	2025-09-29 11:03:49.226	\N	\N
18	Join CANN Today	{"fullName": "Krutik test", "discipline": "Doctor", "emailAddress": "krutik@tp.com", "subspecialty": "heart", "otherInterest": "", "institutionFax": "", "amyloidosisType": "AL", "areasOfInterest": "Understanding PYP in amyloidosis", "followUpConsent": "No", "institutionName": "test", "institutionPhone": "", "membershipRequest": "Yes, I want to join CAS", "presentationTopic": "", "institutionAddress": "", "mapInstitutionName": "test", "presentingInterest": "no", "servicesMapConsent": "Yes", "communicationConsent": "No", "otherAmyloidosisType": ""}	Join CANN Today	Leads	\N	failed	failed	No refresh token available. Please complete OAuth authorization first via /api/oauth/zoho/setup	0	\N	2025-09-29 11:57:32.399859	2025-09-29 11:57:32.528	\N	\N
19	Join CANN Today	{"fullName": "Krutik test", "discipline": "Doctor", "emailAddress": "krutik5436@gmail.com", "subspecialty": "test", "otherInterest": "", "institutionFax": "", "amyloidosisType": "Both", "areasOfInterest": "Mental health considerations for amyloidosis and heart failure patients", "followUpConsent": "No", "institutionName": "test", "institutionPhone": "", "membershipRequest": "Yes, I want to join CAS", "presentationTopic": "", "institutionAddress": "", "mapInstitutionName": "test", "presentingInterest": "no", "servicesMapConsent": "Yes", "communicationConsent": "No", "otherAmyloidosisType": ""}	Join CANN Today	Leads	\N	failed	failed	No refresh token available. Please complete OAuth authorization first via /api/oauth/zoho/setup	0	\N	2025-09-29 12:01:59.84153	2025-09-29 12:01:59.974	\N	\N
20	Join CANN Today	{"fullName": "Krutik test", "discipline": "nurse", "emailAddress": "monty@tp.com", "subspecialty": "test", "otherInterest": "", "institutionFax": "", "amyloidosisType": "ATTR", "areasOfInterest": "Mental health considerations for amyloidosis and heart failure patients, Understanding PYP in amyloidosis", "followUpConsent": "No", "institutionName": "test", "institutionPhone": "", "membershipRequest": "Yes, I want to join CAS", "presentationTopic": "", "institutionAddress": "", "mapInstitutionName": "test", "presentingInterest": "no", "servicesMapConsent": "Yes", "communicationConsent": "No", "otherAmyloidosisType": ""}	Join CANN Today	Leads	\N	failed	failed	Authentication failed. Please re-authorize the application.	0	\N	2025-09-29 12:12:29.293305	2025-09-29 12:12:29.948	\N	\N
21	Join CANN Today	{"fullName": "Krutik test", "discipline": "Doctor", "emailAddress": "krutik@tp.com", "subspecialty": "test", "otherInterest": "", "institutionFax": "", "amyloidosisType": "ATTR", "areasOfInterest": "Case presentations/discussion", "followUpConsent": "No", "institutionName": "test", "institutionPhone": "", "membershipRequest": "Yes, I want to join CAS", "presentationTopic": "", "institutionAddress": "", "mapInstitutionName": "test", "presentingInterest": "no", "servicesMapConsent": "Yes", "communicationConsent": "No", "otherAmyloidosisType": ""}	Join CANN Today	Leads	\N	failed	failed	Authentication failed. Please re-authorize the application.	0	\N	2025-09-29 12:34:31.876881	2025-09-29 12:34:32.589	\N	\N
22	Join CANN Today	{"fullName": "Krutik test", "discipline": "Doctor", "emailAddress": "krutik.patel@teampumpkin.com", "subspecialty": "heart", "otherInterest": "", "institutionFax": "", "amyloidosisType": "AL", "areasOfInterest": "Genetic testing/counseling", "followUpConsent": "No", "institutionName": "test", "institutionPhone": "", "membershipRequest": "Yes, I want to join CAS", "presentationTopic": "", "institutionAddress": "", "mapInstitutionName": "test", "presentingInterest": "no", "servicesMapConsent": "Yes", "communicationConsent": "No", "otherAmyloidosisType": ""}	Join CANN Today	Leads	\N	failed	failed	Authentication failed. Please re-authorize the application.	0	\N	2025-09-29 12:55:42.879964	2025-09-29 12:55:43.443	\N	\N
27	routing-fixed-test	{"email": "fixed@routing.com", "message": "Testing with correct field names", "fullName": "Routing Fixed User"}	routing-fixed-test	Leads	\N	failed	failed	Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field email: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field message: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field fullname: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	0	\N	2025-09-29 17:13:23.271747	2025-09-29 17:13:23.719	\N	\N
23	test-dr-ramdev	{"email": "test@example.com", "fullName": "Dr Ramdev", "discipline": "Doctor"}	Web Form: test-dr-ramdev	Leads	\N	failed	failed	Exceeded maximum retry attempts (5)	5	2025-11-19 04:53:08.56	2025-09-29 16:20:25.602478	2025-11-19 04:55:58.451	2025-11-19 04:55:48.56	\N
26	pipeline-final-test	{"email": "final@test.com", "phone": "+1-555-123-4567", "message": "Database pipeline working perfectly", "fullName": "Final Test User"}	Web Form: pipeline-final-test	Leads	\N	failed	failed	Exceeded maximum retry attempts (5)	5	2025-11-19 04:52:18.557	2025-09-29 16:59:59.624713	2025-11-19 04:55:08.45	2025-11-19 04:54:58.557	\N
25	database-pipeline-test	{"email": "pipelinetest@fixed.com", "message": "Testing the fixed database integration pipeline", "fullName": "Pipeline Fix Test"}	Web Form: database-pipeline-test	Leads	\N	failed	failed	Exceeded maximum retry attempts (5)	5	2025-11-19 04:52:48.56	2025-09-29 16:59:08.057736	2025-11-19 04:55:38.452	2025-11-19 04:55:28.56	\N
24	test-dr-ramdev	{"email": "ramdev@example.com", "message": "Testing form submission fix", "fullName": "Dr Ramdev", "discipline": "Doctor"}	Web Form: test-dr-ramdev	Leads	\N	failed	failed	Exceeded maximum retry attempts (5)	5	2025-11-19 04:52:48.719	2025-09-29 16:21:12.379805	2025-11-19 04:55:38.498	2025-11-19 04:55:28.719	\N
28	production-readiness-test	{"email": "production@amyloid.ca", "phone": "+1-416-555-0123", "message": "Final test before live deployment - all routing conflicts resolved!", "fullName": "Production Ready User", "organization": "Canadian Amyloidosis Society"}	production-readiness-test	Leads	\N	failed	failed	Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field email: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field phone: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field message: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field fullname: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field organization: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	0	\N	2025-09-29 17:15:15.788853	2025-09-29 17:15:16.295	\N	\N
29	simple-crm-test	{"Email": "john.smith@test.com", "Phone": "+1-555-123-4567", "Company": "Test Company", "Last_Name": "Smith", "First_Name": "John", "Lead_Source": "Website"}	simple-crm-test	Leads	\N	failed	failed	Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field email: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field phone: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field company: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field lastname: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field firstname: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field leadsource: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	0	\N	2025-09-29 17:23:38.470989	2025-09-29 17:23:39.077	\N	\N
\.


--
-- Data for Name: oauth_tokens; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.oauth_tokens (id, provider, access_token, refresh_token, expires_at, scope, token_type, is_active, last_refreshed, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: resources; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.resources (id, title, description, file_url, file_name, file_type, file_size, amyloidosis_type, resource_type, category, audience, language, region, is_public, requires_login, submitted_by, moderated_by, is_approved, tags, download_count, created_at, updated_at) FROM stdin;
4	AA Amyloidosis Treatment Protocol	Evidence-based treatment protocol for AA amyloidosis management including anti-inflammatory strategies.	https://example.com/aa-treatment-protocol.docx	aa-treatment-protocol.docx	DOCX	856 KB	AA	tool	guidelines	clinician	en	national	t	t	Canadian Rheumatology Association	\N	t	{AA,treatment,protocol,inflammation}	34	2025-06-16 20:29:24.921435	2025-06-16 20:29:24.921435
5	Caregiver Support Webinar Series	Monthly webinar series addressing common challenges faced by amyloidosis caregivers and family members.	https://example.com/caregiver-webinar-series.mp4	caregiver-webinar-june-2024.mp4	MP4	245 MB	General	visual	webinars	caregiver	en	national	t	f	CAS Support Services	\N	t	{caregiver,webinar,support,family}	89	2025-06-16 20:29:24.921435	2025-06-16 20:29:24.921435
6	Research Abstract: Novel AL Biomarkers	Latest research findings on novel biomarkers for early AL amyloidosis detection and monitoring.	https://example.com/al-biomarkers-research.pdf	al-biomarkers-abstract-2024.pdf	PDF	1.1 MB	AL	research	articles	researcher	en	national	t	f	Dr. Michael Thompson, University of Toronto	\N	t	{research,biomarkers,AL,detection}	23	2025-06-16 20:29:24.921435	2025-06-16 20:29:24.921435
7	Guide de l'amylose ATTR	Guide complet en français pour les patients atteints d'amylose ATTR cardiaque.	https://example.com/guide-attr-fr.pdf	guide-attr-cardiaque-fr.pdf	PDF	2.1 MB	ATTR	article	education	patient	fr	QC	t	f	Société québécoise d'amylose	\N	t	{ATTR,français,cardiaque,patient}	41	2025-06-16 20:29:24.921435	2025-06-16 20:29:24.921435
8	Clinical Trial Opportunities Database	Comprehensive database of ongoing amyloidosis clinical trials across Canada with eligibility criteria.	https://example.com/clinical-trials-db.xlsx	amyloidosis-trials-canada-2024.xlsx	XLSX	2.8 MB	General	tool	libraries	clinician	en	national	t	f	Canadian Clinical Trials Network	\N	t	{"clinical trials",database,research,eligibility}	156	2025-06-16 20:29:24.921435	2025-06-16 20:29:24.921435
1	AL Amyloidosis Diagnosis Checklist	Comprehensive checklist for clinicians to guide AL amyloidosis diagnosis including laboratory tests, imaging, and biopsy procedures.	https://example.com/al-diagnosis-checklist.pdf	al-diagnosis-checklist.pdf	PDF	2.3 MB	AL	tool	toolkit	clinician	en	national	t	f	Dr. Sarah Chen, Toronto General Hospital	\N	t	{diagnosis,checklist,AL,clinical}	46	2025-06-16 20:29:24.921435	2025-06-16 20:29:24.921435
2	ATTR Cardiac Amyloidosis Patient Guide	Educational material for patients newly diagnosed with ATTR cardiac amyloidosis. Covers treatment options, lifestyle modifications, and support resources.	https://example.com/attr-patient-guide.pdf	attr-patient-guide.pdf	PDF	1.8 MB	ATTR	article	education	patient	en	national	t	f	CAS Education Committee	\N	t	{ATTR,cardiac,patient,education}	129	2025-06-16 20:29:24.921435	2025-06-16 20:29:24.921435
3	Amyloidosis Referral Pathway - Ontario	Step-by-step referral pathway for suspected amyloidosis cases in Ontario healthcare system.	https://example.com/on-referral-pathway.pdf	ontario-referral-pathway.pdf	PDF	1.2 MB	General	pathway	guidelines	clinician	en	ON	t	f	Ontario Amyloidosis Network	\N	t	{referral,pathway,ontario,guidelines}	68	2025-06-16 20:29:24.921435	2025-06-16 20:29:24.921435
\.


--
-- Data for Name: submission_logs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.submission_logs (id, submission_id, operation, status, details, error_message, duration, created_at) FROM stdin;
1	1	received	success	{"formName": "Join CANN Today", "fieldCount": 13, "targetModule": "Leads"}	\N	142	2025-09-21 13:45:33.84252
2	1	field_sync	in_progress	{"module": "Leads", "formName": "Join CANN Today", "fieldCount": 13}	\N	\N	2025-09-21 13:45:33.892284
3	1	field_sync	failed	{"error": "Field sync failed: Zoho API v8 Error 401: Authentication failed"}	Field sync failed: Zoho API v8 Error 401: Authentication failed	1665	2025-09-21 13:45:35.576561
4	2	received	success	{"formName": "Join CANN Today", "fieldCount": 13, "targetModule": "Leads"}	\N	128	2025-09-21 13:46:21.953984
5	2	field_sync	in_progress	{"module": "Leads", "formName": "Join CANN Today", "fieldCount": 13}	\N	\N	2025-09-21 13:46:22.002683
6	3	received	success	{"formName": "Join CANN Today", "fieldCount": 5, "targetModule": "Leads"}	\N	693	2025-09-21 14:45:42.214778
7	3	field_sync	in_progress	{"module": "Leads", "formName": "Join CANN Today", "fieldCount": 5}	\N	\N	2025-09-21 14:45:42.281175
8	3	field_sync	failed	{"error": "Field sync failed: Zoho API v8 Error 401: Authentication failed"}	Field sync failed: Zoho API v8 Error 401: Authentication failed	1020	2025-09-21 14:45:43.299816
9	4	received	success	{"formName": "Join CANN Today", "fieldCount": 4, "targetModule": "Leads"}	\N	228	2025-09-26 12:48:24.515706
10	4	field_sync	in_progress	{"module": "Leads", "formName": "Join CANN Today", "fieldCount": 4}	\N	\N	2025-09-26 12:48:24.575819
11	4	field_sync	failed	{"error": "Field sync failed: Zoho API v8 Error 401: Authentication failed"}	Field sync failed: Zoho API v8 Error 401: Authentication failed	1034	2025-09-26 12:48:25.609107
12	5	received	success	{"formName": "Join CANN Today", "fieldCount": 4, "targetModule": "Leads"}	\N	193	2025-09-26 13:05:30.840756
13	5	field_sync	in_progress	{"module": "Leads", "formName": "Join CANN Today", "fieldCount": 4}	\N	\N	2025-09-26 13:05:30.896285
14	5	field_sync	failed	{"error": "Field sync failed: Zoho API v8 Error 401: Authentication failed"}	Field sync failed: Zoho API v8 Error 401: Authentication failed	1007	2025-09-26 13:05:31.90363
15	6	received	success	{"formName": "Join CANN Today", "fieldCount": 3, "targetModule": "Leads"}	\N	573	2025-09-26 13:09:01.875908
16	6	field_sync	in_progress	{"module": "Leads", "formName": "Join CANN Today", "fieldCount": 3}	\N	\N	2025-09-26 13:09:01.936677
17	6	field_sync	failed	{"error": "Field sync failed: Zoho API v8 Error 401: Authentication failed"}	Field sync failed: Zoho API v8 Error 401: Authentication failed	1687	2025-09-26 13:09:03.62382
18	7	received	success	{"formName": "test_integration", "fieldCount": 5, "targetModule": "Leads"}	\N	2649	2025-09-26 14:05:54.099578
19	7	field_sync	in_progress	{"module": "Leads", "formName": "test_integration", "fieldCount": 5}	\N	\N	2025-09-26 14:05:54.165245
20	7	field_sync	failed	{"error": "Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect"}	Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	238	2025-09-26 14:05:54.403607
21	8	received	success	{"formName": "test_icann_form", "fieldCount": 3, "targetModule": "Leads"}	\N	250	2025-09-27 11:27:39.273013
22	8	field_sync	in_progress	{"module": "Leads", "formName": "test_icann_form", "fieldCount": 3}	\N	\N	2025-09-27 11:27:39.333915
23	8	field_sync	failed	{"error": "Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect"}	Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	193	2025-09-27 11:27:39.526759
24	8	retry_attempt	in_progress	{"attempt": 1, "maxRetries": 3, "previousError": "Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field name: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field email: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field organization: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect"}	\N	\N	2025-09-27 11:41:28.72582
25	8	field_sync	in_progress	{"module": "Leads", "formName": "test_icann_form", "fieldCount": 3}	\N	\N	2025-09-27 11:41:28.763429
26	8	field_sync	failed	{"error": "Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect"}	Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	186	2025-09-27 11:41:28.958911
27	8	retry_attempt	failed	{"error": "Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field name: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field email: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field organization: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect", "attempt": 1}	Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field name: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field email: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field organization: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	349	2025-09-27 11:41:29.021609
28	7	retry_attempt	in_progress	{"attempt": 1, "maxRetries": 3, "previousError": "Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field email: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field company: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field message: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field lastname: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field firstname: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect"}	\N	\N	2025-09-27 11:41:30.121092
29	7	field_sync	in_progress	{"module": "Leads", "formName": "test_integration", "fieldCount": 5}	\N	\N	2025-09-27 11:41:30.145363
30	7	field_sync	failed	{"error": "Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect"}	Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	219	2025-09-27 11:41:30.365317
57	10	field_sync	failed	{"error": "Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect"}	Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	182	2025-09-27 20:42:48.923621
31	7	retry_attempt	failed	{"error": "Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field email: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field company: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field message: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field lastname: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field firstname: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect", "attempt": 1}	Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field email: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field company: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field message: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field lastname: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field firstname: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	365	2025-09-27 11:41:30.413495
32	6	retry_attempt	in_progress	{"attempt": 1, "maxRetries": 3, "previousError": "Field sync failed: Failed to create field Source_Form: Zoho API v8 Error 401: Authentication failed; Failed to create field fullname: Zoho API v8 Error 401: Authentication failed; Failed to create field discipline: Zoho API v8 Error 401: Authentication failed; Failed to create field emailaddress: Zoho API v8 Error 401: Authentication failed; Field sync failed: Zoho API v8 Error 401: Authentication failed"}	\N	\N	2025-09-27 11:41:31.492968
33	6	field_sync	in_progress	{"module": "Leads", "formName": "Join CANN Today", "fieldCount": 3}	\N	\N	2025-09-27 11:41:31.520511
34	6	field_sync	failed	{"error": "Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect"}	Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	171	2025-09-27 11:41:31.691315
35	6	retry_attempt	failed	{"error": "Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field fullname: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field discipline: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field emailaddress: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect", "attempt": 1}	Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field fullname: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field discipline: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field emailaddress: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	308	2025-09-27 11:41:31.748675
36	5	retry_attempt	in_progress	{"attempt": 1, "maxRetries": 3, "previousError": "Field sync failed: Failed to create field Source_Form: Zoho API v8 Error 401: Authentication failed; Failed to create field fullname: Zoho API v8 Error 401: Authentication failed; Failed to create field discipline: Zoho API v8 Error 401: Authentication failed; Failed to create field emailaddress: Zoho API v8 Error 401: Authentication failed; Failed to create field subspecialty: Zoho API v8 Error 401: Authentication failed; Field sync failed: Zoho API v8 Error 401: Authentication failed"}	\N	\N	2025-09-27 11:41:32.820801
37	5	field_sync	in_progress	{"module": "Leads", "formName": "Join CANN Today", "fieldCount": 4}	\N	\N	2025-09-27 11:41:32.844489
38	5	field_sync	failed	{"error": "Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect"}	Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	190	2025-09-27 11:41:33.034724
39	5	retry_attempt	failed	{"error": "Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field fullname: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field discipline: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field emailaddress: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field subspecialty: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect", "attempt": 1}	Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field fullname: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field discipline: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field emailaddress: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field subspecialty: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	312	2025-09-27 11:41:33.083503
40	4	retry_attempt	in_progress	{"attempt": 1, "maxRetries": 3, "previousError": "Field sync failed: Failed to create field Source_Form: Zoho API v8 Error 401: Authentication failed; Failed to create field fullname: Zoho API v8 Error 401: Authentication failed; Failed to create field discipline: Zoho API v8 Error 401: Authentication failed; Failed to create field emailaddress: Zoho API v8 Error 401: Authentication failed; Failed to create field subspecialty: Zoho API v8 Error 401: Authentication failed; Field sync failed: Zoho API v8 Error 401: Authentication failed"}	\N	\N	2025-09-27 11:41:34.154779
41	4	field_sync	in_progress	{"module": "Leads", "formName": "Join CANN Today", "fieldCount": 4}	\N	\N	2025-09-27 11:41:34.178641
42	4	field_sync	failed	{"error": "Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect"}	Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	194	2025-09-27 11:41:34.373394
59	11	field_sync	in_progress	{"module": "Leads", "formName": "production_test", "fieldCount": 3}	\N	\N	2025-09-27 20:47:24.078846
138	24	crm_push	failed	\N	Exceeded maximum retry attempts (5)	\N	2025-11-19 04:55:38.539732
139	23	crm_push	failed	\N	Exceeded maximum retry attempts (5)	\N	2025-11-19 04:55:58.488752
43	4	retry_attempt	failed	{"error": "Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field fullname: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field discipline: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field emailaddress: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field subspecialty: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect", "attempt": 1}	Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field fullname: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field discipline: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field emailaddress: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field subspecialty: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	315	2025-09-27 11:41:34.425033
44	3	retry_attempt	in_progress	{"attempt": 1, "maxRetries": 3, "previousError": "Field sync failed: Failed to create field Source_Form: Zoho API v8 Error 401: Authentication failed; Failed to create field fullname: Zoho API v8 Error 401: Authentication failed; Failed to create field discipline: Zoho API v8 Error 401: Authentication failed; Failed to create field emailaddress: Zoho API v8 Error 401: Authentication failed; Failed to create field subspecialty: Zoho API v8 Error 401: Authentication failed; Failed to create field membershiprequest: Zoho API v8 Error 401: Authentication failed; Field sync failed: Zoho API v8 Error 401: Authentication failed"}	\N	\N	2025-09-27 11:41:35.496144
45	3	field_sync	in_progress	{"module": "Leads", "formName": "Join CANN Today", "fieldCount": 5}	\N	\N	2025-09-27 11:41:35.520693
46	3	field_sync	failed	{"error": "Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect"}	Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	215	2025-09-27 11:41:35.735363
47	3	retry_attempt	failed	{"error": "Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field fullname: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field discipline: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field emailaddress: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field subspecialty: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field membershiprequest: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect", "attempt": 1}	Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field fullname: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field discipline: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field emailaddress: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field subspecialty: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field membershiprequest: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	334	2025-09-27 11:41:35.782967
48	1	retry_attempt	in_progress	{"attempt": 1, "maxRetries": 3, "previousError": "Field sync failed: Failed to create field Source_Form: Zoho API v8 Error 401: Authentication failed; Failed to create field fullname: Zoho API v8 Error 401: Authentication failed; Failed to create field discipline: Zoho API v8 Error 401: Authentication failed; Failed to create field emailaddress: Zoho API v8 Error 401: Authentication failed; Failed to create field subspecialty: Zoho API v8 Error 401: Authentication failed; Failed to create field institutionfax: Zoho API v8 Error 401: Authentication failed; Failed to create field followupconsent: Zoho API v8 Error 401: Authentication failed; Failed to create field institutionname: Zoho API v8 Error 401: Authentication failed; Failed to create field institutionphone: Zoho API v8 Error 401: Authentication failed; Failed to create field membershiprequest: Zoho API v8 Error 401: Authentication failed; Failed to create field institutionaddress: Zoho API v8 Error 401: Authentication failed; Failed to create field mapinstitutionname: Zoho API v8 Error 401: Authentication failed; Failed to create field servicesmapconsent: Zoho API v8 Error 401: Authentication failed; Failed to create field communicationconsent: Zoho API v8 Error 401: Authentication failed; Field sync failed: Zoho API v8 Error 401: Authentication failed"}	\N	\N	2025-09-27 11:41:36.854757
49	1	field_sync	in_progress	{"module": "Leads", "formName": "Join CANN Today", "fieldCount": 13}	\N	\N	2025-09-27 11:41:36.879139
50	1	field_sync	failed	{"error": "Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect"}	Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	411	2025-09-27 11:41:37.290311
51	1	retry_attempt	failed	{"error": "Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field fullname: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field discipline: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field emailaddress: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field subspecialty: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field institutionfax: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field followupconsent: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field institutionname: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field institutionphone: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field membershiprequest: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field institutionaddress: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field mapinstitutionname: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field servicesmapconsent: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field communicationconsent: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect", "attempt": 1}	Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field fullname: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field discipline: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field emailaddress: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field subspecialty: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field institutionfax: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field followupconsent: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field institutionname: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field institutionphone: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field membershiprequest: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field institutionaddress: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field mapinstitutionname: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field servicesmapconsent: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field communicationconsent: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	529	2025-09-27 11:41:37.336216
52	9	received	success	{"formName": "oauth_test_form", "fieldCount": 3, "targetModule": "Leads"}	\N	53	2025-09-27 11:41:37.644402
53	9	field_sync	in_progress	{"module": "Leads", "formName": "oauth_test_form", "fieldCount": 3}	\N	\N	2025-09-27 11:41:37.696642
54	9	field_sync	failed	{"error": "Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect"}	Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	187	2025-09-27 11:41:37.882877
55	10	received	success	{"formName": "contact", "fieldCount": 3, "targetModule": "Leads"}	\N	180	2025-09-27 20:42:48.675249
56	10	field_sync	in_progress	{"module": "Leads", "formName": "contact", "fieldCount": 3}	\N	\N	2025-09-27 20:42:48.741711
58	11	received	success	{"formName": "production_test", "fieldCount": 3, "targetModule": "Leads"}	\N	73	2025-09-27 20:47:24.016598
60	11	field_sync	failed	{"error": "Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect"}	Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	168	2025-09-27 20:47:24.246129
61	12	received	success	{"formName": "oauth_test_lead", "fieldCount": 4, "targetModule": "Leads"}	\N	596	2025-09-28 07:13:12.689075
62	12	field_sync	in_progress	{"module": "Leads", "formName": "oauth_test_lead", "fieldCount": 4}	\N	\N	2025-09-28 07:13:12.752911
63	12	field_sync	failed	{"error": "Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect"}	Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	210	2025-09-28 07:13:12.961372
64	12	retry_attempt	in_progress	{"attempt": 1, "maxRetries": 3, "previousError": "Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field name: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field email: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field company: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field message: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect"}	\N	\N	2025-09-28 07:14:09.373963
65	12	field_sync	in_progress	{"module": "Leads", "formName": "oauth_test_lead", "fieldCount": 4}	\N	\N	2025-09-28 07:14:09.398764
66	12	field_sync	failed	{"error": "Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect"}	Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	204	2025-09-28 07:14:09.603162
67	12	retry_attempt	failed	{"error": "Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field name: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field email: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field company: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field message: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect", "attempt": 1}	Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field name: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field email: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field company: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field message: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	2414	2025-09-28 07:14:09.651743
68	13	received	success	{"formName": "verification_test", "fieldCount": 4, "targetModule": "Leads"}	\N	183	2025-09-28 07:27:50.730904
69	13	field_sync	in_progress	{"module": "Leads", "formName": "verification_test", "fieldCount": 4}	\N	\N	2025-09-28 07:27:50.799163
70	13	field_sync	failed	{"error": "Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect"}	Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	212	2025-09-28 07:27:51.010185
71	13	retry_attempt	in_progress	{"attempt": 1, "maxRetries": 3, "previousError": "Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field name: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field email: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field company: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field message: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect"}	\N	\N	2025-09-28 07:28:09.586538
72	13	field_sync	in_progress	{"module": "Leads", "formName": "verification_test", "fieldCount": 4}	\N	\N	2025-09-28 07:28:09.609612
73	13	field_sync	failed	{"error": "Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect"}	Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	192	2025-09-28 07:28:09.803203
74	13	retry_attempt	failed	{"error": "Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field name: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field email: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field company: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field message: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect", "attempt": 1}	Field sync failed: Failed to create field Source_Form: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field name: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field email: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field company: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Failed to create field message: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect; Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	312	2025-09-28 07:28:09.852726
75	14	received	success	{"ip": "172.31.81.130", "formName": "Join CANN Today", "requestId": "req_1759143828567_10lgu3694", "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36", "fieldCount": 19, "targetModule": "Leads"}	\N	617	2025-09-29 11:03:49.199662
76	15	received	success	{"ip": "172.31.81.130", "formName": "Join CANN Today", "requestId": "req_1759145651625_pfo7rxlep", "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Replit/1.0.14 Chrome/124.0.6367.119 Electron/30.0.3 Safari/537.36", "fieldCount": 19, "targetModule": "Leads"}	\N	631	2025-09-29 11:34:12.27182
77	16	received	success	{"ip": "172.31.81.130", "formName": "Join CANN Today", "requestId": "req_1759146155527_lvx0xbg0i", "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36", "fieldCount": 19, "targetModule": "Leads"}	\N	185	2025-09-29 11:42:35.727766
78	16	crm_push	failed	{"error": "No refresh token available. Please complete OAuth authorization first via /api/oauth/zoho/setup", "processId": "zoho_16_iz4hh5"}	No refresh token available. Please complete OAuth authorization first via /api/oauth/zoho/setup	0	2025-09-29 11:42:35.824134
79	17	received	success	{"ip": "172.31.81.130", "formName": "Join CANN Today", "requestId": "req_1759146650603_xcfhucloy", "userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36", "fieldCount": 19, "targetModule": "Leads"}	\N	2681	2025-09-29 11:50:53.299089
80	17	crm_push	failed	{"error": "No refresh token available. Please complete OAuth authorization first via /api/oauth/zoho/setup", "processId": "zoho_17_hx3eu9"}	No refresh token available. Please complete OAuth authorization first via /api/oauth/zoho/setup	0	2025-09-29 11:50:53.467663
81	18	received	success	{"ip": "172.31.81.130", "formName": "Join CANN Today", "requestId": "req_1759147049850_ias5w2shf", "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36", "fieldCount": 19, "targetModule": "Leads"}	\N	2592	2025-09-29 11:57:32.457553
82	18	crm_push	failed	{"error": "No refresh token available. Please complete OAuth authorization first via /api/oauth/zoho/setup", "processId": "zoho_18_cgjrxu"}	No refresh token available. Please complete OAuth authorization first via /api/oauth/zoho/setup	0	2025-09-29 11:57:32.570469
83	19	received	success	{"ip": "172.31.81.130", "formName": "Join CANN Today", "requestId": "req_1759147317280_kq4zdb3lt", "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36", "fieldCount": 19, "targetModule": "Leads"}	\N	2606	2025-09-29 12:01:59.902316
84	19	crm_push	failed	{"error": "No refresh token available. Please complete OAuth authorization first via /api/oauth/zoho/setup", "processId": "zoho_19_ovhtes"}	No refresh token available. Please complete OAuth authorization first via /api/oauth/zoho/setup	0	2025-09-29 12:02:00.018052
85	20	received	success	{"ip": "172.31.81.130", "formName": "Join CANN Today", "requestId": "req_1759147948752_ugf647ntp", "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36", "fieldCount": 19, "targetModule": "Leads"}	\N	586	2025-09-29 12:12:29.353807
86	20	crm_push	failed	{"error": "Authentication failed. Please re-authorize the application.", "processId": "zoho_20_w091nq"}	Authentication failed. Please re-authorize the application.	0	2025-09-29 12:12:29.989796
87	21	received	success	{"ip": "172.31.81.130", "formName": "Join CANN Today", "requestId": "req_1759149269327_d4yilkfsl", "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36", "fieldCount": 19, "targetModule": "Leads"}	\N	2593	2025-09-29 12:34:31.934265
88	21	crm_push	failed	{"error": "Authentication failed. Please re-authorize the application.", "processId": "zoho_21_g75e7r"}	Authentication failed. Please re-authorize the application.	0	2025-09-29 12:34:32.63158
89	22	received	success	{"ip": "172.31.81.130", "formName": "Join CANN Today", "requestId": "req_1759150542335_74hwdjgdy", "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36", "fieldCount": 19, "targetModule": "Leads"}	\N	581	2025-09-29 12:55:42.932623
90	22	crm_push	failed	{"error": "Authentication failed. Please re-authorize the application.", "processId": "zoho_22_njf4h9"}	Authentication failed. Please re-authorize the application.	0	2025-09-29 12:55:43.48414
91	23	retry_attempt	in_progress	{"context": {"formName": "test-dr-ramdev", "fieldCount": 3}, "operation": "form_processing", "errorMessage": "Failed to retrieve created submission", "errorClassification": "unknown_error"}	Failed to retrieve created submission	1	2025-09-29 16:20:25.741275
92	23	retry_attempt	success	{"nextRetryAttempt": 1, "errorRecoveryActions": ["Applied conservative retry strategy"], "scheduledRetryAfterMs": 9346}	\N	72	2025-09-29 16:20:25.810586
93	24	retry_attempt	in_progress	{"context": {"formName": "test-dr-ramdev", "fieldCount": 4}, "operation": "form_processing", "errorMessage": "Failed to retrieve created submission", "errorClassification": "unknown_error"}	Failed to retrieve created submission	0	2025-09-29 16:21:12.475782
94	24	retry_attempt	success	{"nextRetryAttempt": 1, "errorRecoveryActions": ["Applied conservative retry strategy"], "scheduledRetryAfterMs": 10911}	\N	50	2025-09-29 16:21:12.526625
95	24	retry_attempt	in_progress	{"retryAttempt": 1, "originalError": null}	\N	\N	2025-09-29 16:21:23.646397
96	24	retry_attempt	in_progress	{"operation": "retry_attempt", "errorMessage": "No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect", "errorClassification": "oauth_invalid"}	No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	0	2025-09-29 16:21:23.720524
97	24	retry_attempt	failed	{"reason": "max_retries_exceeded", "maxRetries": 1, "finalRetryCount": 1}	Max retries (1) exceeded	48	2025-09-29 16:21:23.768065
98	24	retry_attempt	failed	{"retryError": "No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect", "retryAttempt": 1}	No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	\N	2025-09-29 16:21:23.814856
99	25	retry_attempt	in_progress	{"context": {"formName": "database-pipeline-test", "fieldCount": 3}, "operation": "form_processing", "errorMessage": "invalid input syntax for type integer: \\"{\\"id\\":25,\\"formName\\":\\"database-pipeline-test\\",\\"submissionData\\":{\\"email\\":\\"pipelinetest@fixed.com\\",\\"message\\":\\"Testing the fixed database integration pipeline\\",\\"fullName\\":\\"Pipeline Fix Test\\"},\\"sourceForm\\":\\"Web Form: database-pipeline-test\\",\\"zohoModule\\":\\"Leads\\",\\"zohoCrmId\\":null,\\"processingStatus\\":\\"pending\\",\\"syncStatus\\":\\"pending\\",\\"errorMessage\\":null,\\"retryCount\\":0,\\"lastRetryAt\\":null,\\"createdAt\\":\\"2025-09-29T16:59:08.057Z\\",\\"updatedAt\\":\\"2025-09-29T16:59:08.057Z\\"}\\"", "errorClassification": "unknown_error"}	invalid input syntax for type integer: "{"id":25,"formName":"database-pipeline-test","submissionData":{"email":"pipelinetest@fixed.com","message":"Testing the fixed database integration pipeline","fullName":"Pipeline Fix Test"},"sourceForm":"Web Form: database-pipeline-test","zohoModule":"Leads","zohoCrmId":null,"processingStatus":"pending","syncStatus":"pending","errorMessage":null,"retryCount":0,"lastRetryAt":null,"createdAt":"2025-09-29T16:59:08.057Z","updatedAt":"2025-09-29T16:59:08.057Z"}"	0	2025-09-29 16:59:08.286415
100	25	retry_attempt	success	{"nextRetryAttempt": 1, "errorRecoveryActions": ["Applied conservative retry strategy"], "scheduledRetryAfterMs": 9102}	\N	65	2025-09-29 16:59:08.355921
101	25	retry_attempt	in_progress	{"retryAttempt": 1, "originalError": null}	\N	\N	2025-09-29 16:59:17.579481
102	25	retry_attempt	in_progress	{"operation": "retry_attempt", "errorMessage": "No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect", "errorClassification": "oauth_invalid"}	No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	0	2025-09-29 16:59:17.629404
103	25	retry_attempt	failed	{"reason": "max_retries_exceeded", "maxRetries": 1, "finalRetryCount": 1}	Max retries (1) exceeded	52	2025-09-29 16:59:17.682278
104	25	retry_attempt	failed	{"retryError": "No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect", "retryAttempt": 1}	No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	\N	2025-09-29 16:59:17.732909
105	26	retry_attempt	in_progress	{"context": {"formName": "pipeline-final-test", "fieldCount": 4}, "operation": "form_processing", "errorMessage": "No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect", "errorClassification": "oauth_invalid"}	No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	0	2025-09-29 16:59:59.744057
106	26	retry_attempt	success	{"nextRetryAttempt": 1, "errorRecoveryActions": ["Marked for manual OAuth re-authentication"], "scheduledRetryAfterMs": 5000}	\N	51	2025-09-29 16:59:59.792995
107	26	retry_attempt	in_progress	{"retryAttempt": 1, "originalError": null}	\N	\N	2025-09-29 17:00:04.918091
108	26	retry_attempt	in_progress	{"operation": "retry_attempt", "errorMessage": "No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect", "errorClassification": "oauth_invalid"}	No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	2	2025-09-29 17:00:04.969214
109	26	retry_attempt	failed	{"reason": "max_retries_exceeded", "maxRetries": 1, "finalRetryCount": 1}	Max retries (1) exceeded	54	2025-09-29 17:00:05.022191
110	26	retry_attempt	failed	{"retryError": "No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect", "retryAttempt": 1}	No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	\N	2025-09-29 17:00:05.078053
111	27	received	success	{"formName": "routing-fixed-test", "fieldCount": 3, "targetModule": "Leads"}	\N	2652	2025-09-29 17:13:23.328015
112	27	field_sync	in_progress	{"module": "Leads", "formName": "routing-fixed-test", "fieldCount": 3}	\N	\N	2025-09-29 17:13:23.396097
113	27	field_sync	failed	{"error": "Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect"}	Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	312	2025-09-29 17:13:23.707501
114	28	received	success	{"formName": "production-readiness-test", "fieldCount": 5, "targetModule": "Leads"}	\N	157	2025-09-29 17:15:15.82896
115	28	field_sync	in_progress	{"module": "Leads", "formName": "production-readiness-test", "fieldCount": 5}	\N	\N	2025-09-29 17:15:15.89137
116	28	field_sync	failed	{"error": "Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect"}	Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	390	2025-09-29 17:15:16.282279
117	29	received	success	{"formName": "simple-crm-test", "fieldCount": 6, "targetModule": "Leads"}	\N	714	2025-09-29 17:23:38.53241
118	29	field_sync	in_progress	{"module": "Leads", "formName": "simple-crm-test", "fieldCount": 6}	\N	\N	2025-09-29 17:23:38.60398
119	29	field_sync	failed	{"error": "Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect"}	Field sync failed: No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	460	2025-09-29 17:23:39.064063
120	26	retry_attempt	failed	{"retryCount": 3, "nextRetryAt": "2025-11-19T04:50:41.250Z", "backoffSeconds": 40}	No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	\N	2025-11-19 04:50:01.29692
121	25	retry_attempt	failed	{"retryCount": 2, "nextRetryAt": "2025-11-19T04:50:21.505Z", "backoffSeconds": 20}	No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	\N	2025-11-19 04:50:02.106414
122	24	retry_attempt	failed	{"retryCount": 2, "nextRetryAt": "2025-11-19T04:50:25.850Z", "backoffSeconds": 20}	No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	\N	2025-11-19 04:50:06.115439
123	23	retry_attempt	failed	{"retryCount": 1, "nextRetryAt": "2025-11-19T04:50:16.602Z", "backoffSeconds": 10}	No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	\N	2025-11-19 04:50:06.643364
124	23	retry_attempt	failed	{"retryCount": 2, "nextRetryAt": "2025-11-19T04:50:38.550Z", "backoffSeconds": 20}	No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	\N	2025-11-19 04:50:18.588584
125	25	retry_attempt	failed	{"retryCount": 3, "nextRetryAt": "2025-11-19T04:51:08.550Z", "backoffSeconds": 40}	No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	\N	2025-11-19 04:50:28.587934
126	24	retry_attempt	failed	{"retryCount": 3, "nextRetryAt": "2025-11-19T04:51:08.708Z", "backoffSeconds": 40}	No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	\N	2025-11-19 04:50:28.745776
127	26	retry_attempt	failed	{"retryCount": 4, "nextRetryAt": "2025-11-19T04:52:08.556Z", "backoffSeconds": 80}	No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	\N	2025-11-19 04:50:48.593509
128	23	retry_attempt	failed	{"retryCount": 3, "nextRetryAt": "2025-11-19T04:51:28.714Z", "backoffSeconds": 40}	No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	\N	2025-11-19 04:50:48.752404
129	25	retry_attempt	failed	{"retryCount": 4, "nextRetryAt": "2025-11-19T04:52:38.554Z", "backoffSeconds": 80}	No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	\N	2025-11-19 04:51:18.591464
130	24	retry_attempt	failed	{"retryCount": 4, "nextRetryAt": "2025-11-19T04:52:38.709Z", "backoffSeconds": 80}	No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	\N	2025-11-19 04:51:18.745636
131	23	retry_attempt	failed	{"retryCount": 4, "nextRetryAt": "2025-11-19T04:52:58.554Z", "backoffSeconds": 80}	No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	\N	2025-11-19 04:51:38.595959
132	26	retry_attempt	failed	{"retryCount": 5, "nextRetryAt": "2025-11-19T04:54:58.557Z", "backoffSeconds": 160}	No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	\N	2025-11-19 04:52:18.594471
133	25	retry_attempt	failed	{"retryCount": 5, "nextRetryAt": "2025-11-19T04:55:28.560Z", "backoffSeconds": 160}	No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	\N	2025-11-19 04:52:48.597767
134	24	retry_attempt	failed	{"retryCount": 5, "nextRetryAt": "2025-11-19T04:55:28.719Z", "backoffSeconds": 160}	No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	\N	2025-11-19 04:52:48.757571
135	23	retry_attempt	failed	{"retryCount": 5, "nextRetryAt": "2025-11-19T04:55:48.560Z", "backoffSeconds": 160}	No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect	\N	2025-11-19 04:53:08.597407
136	26	crm_push	failed	\N	Exceeded maximum retry attempts (5)	\N	2025-11-19 04:55:08.487607
137	25	crm_push	failed	\N	Exceeded maximum retry attempts (5)	\N	2025-11-19 04:55:38.489796
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, username, password) FROM stdin;
\.


--
-- Name: field_mappings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.field_mappings_id_seq', 1, false);


--
-- Name: field_metadata_cache_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.field_metadata_cache_id_seq', 1, false);


--
-- Name: form_configurations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.form_configurations_id_seq', 1, true);


--
-- Name: form_submissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.form_submissions_id_seq', 29, true);


--
-- Name: oauth_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.oauth_tokens_id_seq', 6, true);


--
-- Name: resources_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.resources_id_seq', 8, true);


--
-- Name: submission_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.submission_logs_id_seq', 139, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: field_mappings field_mappings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.field_mappings
    ADD CONSTRAINT field_mappings_pkey PRIMARY KEY (id);


--
-- Name: field_metadata_cache field_metadata_cache_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.field_metadata_cache
    ADD CONSTRAINT field_metadata_cache_pkey PRIMARY KEY (id);


--
-- Name: form_configurations form_configurations_form_name_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.form_configurations
    ADD CONSTRAINT form_configurations_form_name_unique UNIQUE (form_name);


--
-- Name: form_configurations form_configurations_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.form_configurations
    ADD CONSTRAINT form_configurations_pkey PRIMARY KEY (id);


--
-- Name: form_submissions form_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.form_submissions
    ADD CONSTRAINT form_submissions_pkey PRIMARY KEY (id);


--
-- Name: oauth_tokens oauth_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.oauth_tokens
    ADD CONSTRAINT oauth_tokens_pkey PRIMARY KEY (id);


--
-- Name: resources resources_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_pkey PRIMARY KEY (id);


--
-- Name: submission_logs submission_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.submission_logs
    ADD CONSTRAINT submission_logs_pkey PRIMARY KEY (id);


--
-- Name: field_metadata_cache unique_module_field_api; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.field_metadata_cache
    ADD CONSTRAINT unique_module_field_api UNIQUE (zoho_module, field_api_name);


--
-- Name: field_mappings unique_zoho_module_field; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.field_mappings
    ADD CONSTRAINT unique_zoho_module_field UNIQUE (zoho_module, field_name);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_unique UNIQUE (username);


--
-- Name: idx_field_mappings_zoho_module; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_field_mappings_zoho_module ON public.field_mappings USING btree (zoho_module);


--
-- Name: idx_field_metadata_last_synced; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_field_metadata_last_synced ON public.field_metadata_cache USING btree (last_synced);


--
-- Name: idx_field_metadata_module; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_field_metadata_module ON public.field_metadata_cache USING btree (zoho_module);


--
-- Name: idx_form_submissions_form_name; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_form_submissions_form_name ON public.form_submissions USING btree (form_name);


--
-- Name: idx_form_submissions_processing_status; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_form_submissions_processing_status ON public.form_submissions USING btree (processing_status);


--
-- Name: idx_form_submissions_sync_status; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_form_submissions_sync_status ON public.form_submissions USING btree (sync_status);


--
-- Name: idx_form_submissions_zoho_crm_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_form_submissions_zoho_crm_id ON public.form_submissions USING btree (zoho_crm_id);


--
-- Name: idx_form_submissions_zoho_module; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_form_submissions_zoho_module ON public.form_submissions USING btree (zoho_module);


--
-- Name: idx_oauth_tokens_active; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_oauth_tokens_active ON public.oauth_tokens USING btree (is_active);


--
-- Name: idx_oauth_tokens_provider; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_oauth_tokens_provider ON public.oauth_tokens USING btree (provider);


--
-- Name: idx_submission_logs_submission_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_submission_logs_submission_id ON public.submission_logs USING btree (submission_id);


--
-- Name: submission_logs submission_logs_submission_id_form_submissions_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.submission_logs
    ADD CONSTRAINT submission_logs_submission_id_form_submissions_id_fk FOREIGN KEY (submission_id) REFERENCES public.form_submissions(id) ON DELETE CASCADE;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

