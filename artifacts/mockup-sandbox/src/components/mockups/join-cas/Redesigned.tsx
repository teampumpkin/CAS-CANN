import './_group.css';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stethoscope, CheckCircle2, Send, Sun, Moon, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { casRegistrationSchema, type CASRegistrationForm, lookupPostalCode } from "./schema";

/* ---------- shared atoms ---------- */

const FIELD_INPUT =
  "h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-[#00AFE6]/30 focus-visible:border-[#00AFE6] transition-colors";
const FIELD_INPUT_READONLY =
  "h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm text-sm text-slate-600 dark:text-slate-400 cursor-not-allowed";
const FIELD_LABEL = "text-[13px] font-normal text-slate-600 dark:text-slate-300";

function YesNo({
  value,
  onChange,
  accent = "cas",
}: {
  value?: "Yes" | "No";
  onChange: (v: "Yes" | "No") => void;
  accent?: "cas" | "cann";
}) {
  const activeClass =
    accent === "cann"
      ? "bg-pink-500 text-white border-pink-500 shadow-sm"
      : "bg-[#00AFE6] text-white border-[#00AFE6] shadow-sm";
  const idleClass = "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600";
  return (
    <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1 gap-1">
      {(["Yes", "No"] as const).map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-6 h-9 text-sm font-medium rounded-md border transition-all ${
              active ? activeClass : idleClass
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- input filters ---------- */
const ALPHA_FILTER = (v: string) => v.replace(/[^A-Za-zÀ-ÿ\s'\-.]/g, "");
const INSTITUTION_FILTER = (v: string) => v.replace(/[^A-Za-zÀ-ÿ\s'\-.,&()/]/g, "");
const DIGITS_FILTER = (v: string) => v.replace(/[^0-9\s\-()+ ]/g, "");
const POSTAL_FILTER = (v: string) => {
  // Canadian postal pattern: A1A 1A1 (auto-uppercase, auto-space after 3 chars)
  const cleaned = v.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
  if (cleaned.length <= 3) return cleaned;
  return cleaned.slice(0, 3) + " " + cleaned.slice(3);
};

function TextField({
  name,
  label,
  placeholder,
  description,
  type = "text",
  form,
  required,
  readOnly,
  inputFilter,
  filterWarning,
  inputMode,
  maxLength,
}: {
  name: any;
  label: string;
  placeholder?: string;
  description?: string;
  type?: string;
  form: any;
  required?: boolean;
  readOnly?: boolean;
  inputFilter?: (v: string) => string;
  filterWarning?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
  maxLength?: number;
}) {
  const [warning, setWarning] = useState<string | null>(null);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }: any) => (
        <FormItem>
          <FormLabel className={FIELD_LABEL}>
            {label}
            {required && <span className="text-[#00AFE6]"> *</span>}
          </FormLabel>
          {description && <p className="text-xs text-slate-500 -mt-1">{description}</p>}
          <FormControl>
            <Input
              {...field}
              type={type}
              inputMode={inputMode}
              maxLength={maxLength}
              onChange={(e) => {
                const raw = e.target.value;
                const next = inputFilter ? inputFilter(raw) : raw;
                if (inputFilter && next !== raw && filterWarning) {
                  setWarning(filterWarning);
                  window.setTimeout(() => setWarning(null), 1800);
                }
                field.onChange(next);
              }}
              placeholder={placeholder}
              readOnly={readOnly}
              tabIndex={readOnly ? -1 : undefined}
              className={readOnly ? FIELD_INPUT_READONLY : FIELD_INPUT}
            />
          </FormControl>
          {warning && (
            <div className="flex items-start gap-1.5 text-xs text-amber-600 mt-1">
              <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-px" />
              <span>{warning}</span>
            </div>
          )}
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}

const CANADIAN_PROVINCES = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Northwest Territories",
  "Nova Scotia",
  "Nunavut",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Yukon",
];

const CITIES_BY_PROVINCE: Record<string, string[]> = {
  "Alberta": ["Calgary", "Edmonton", "Red Deer", "Lethbridge", "St. Albert", "Medicine Hat", "Grande Prairie", "Airdrie", "Fort McMurray"],
  "British Columbia": ["Vancouver", "Victoria", "Surrey", "Burnaby", "Richmond", "Kelowna", "Abbotsford", "Coquitlam", "Kamloops", "Nanaimo"],
  "Manitoba": ["Winnipeg", "Brandon", "Steinbach", "Thompson", "Portage la Prairie"],
  "New Brunswick": ["Moncton", "Saint John", "Fredericton", "Dieppe", "Miramichi"],
  "Newfoundland and Labrador": ["St. John's", "Mount Pearl", "Corner Brook", "Conception Bay South", "Paradise"],
  "Northwest Territories": ["Yellowknife", "Hay River", "Inuvik"],
  "Nova Scotia": ["Halifax", "Sydney", "Dartmouth", "Truro", "New Glasgow"],
  "Nunavut": ["Iqaluit", "Rankin Inlet", "Arviat"],
  "Ontario": ["Toronto", "Ottawa", "Mississauga", "Brampton", "Hamilton", "London", "Markham", "Vaughan", "Kitchener", "Windsor", "Kingston", "Sudbury", "Thunder Bay", "Oakville", "Burlington"],
  "Prince Edward Island": ["Charlottetown", "Summerside", "Stratford", "Cornwall"],
  "Quebec": ["Montreal", "Quebec City", "Laval", "Gatineau", "Longueuil", "Sherbrooke", "Saguenay", "Lévis", "Trois-Rivières"],
  "Saskatchewan": ["Saskatoon", "Regina", "Prince Albert", "Moose Jaw", "Swift Current"],
  "Yukon": ["Whitehorse", "Dawson City", "Watson Lake"],
};

const COUNTRY_CODES: { value: string; label: string; flag: string }[] = [
  { value: "+1", label: "Canada / US", flag: "🇨🇦" },
  { value: "+44", label: "United Kingdom", flag: "🇬🇧" },
  { value: "+91", label: "India", flag: "🇮🇳" },
  { value: "+86", label: "China", flag: "🇨🇳" },
  { value: "+33", label: "France", flag: "🇫🇷" },
  { value: "+49", label: "Germany", flag: "🇩🇪" },
  { value: "+39", label: "Italy", flag: "🇮🇹" },
  { value: "+34", label: "Spain", flag: "🇪🇸" },
  { value: "+61", label: "Australia", flag: "🇦🇺" },
  { value: "+81", label: "Japan", flag: "🇯🇵" },
  { value: "+82", label: "South Korea", flag: "🇰🇷" },
  { value: "+852", label: "Hong Kong", flag: "🇭🇰" },
  { value: "+65", label: "Singapore", flag: "🇸🇬" },
  { value: "+971", label: "UAE", flag: "🇦🇪" },
  { value: "+27", label: "South Africa", flag: "🇿🇦" },
  { value: "+55", label: "Brazil", flag: "🇧🇷" },
  { value: "+52", label: "Mexico", flag: "🇲🇽" },
];

function ProvinceCombobox({ form, mismatch }: { form: any; mismatch?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <FormField
      control={form.control}
      name="province"
      render={({ field }: any) => (
        <FormItem className="flex flex-col">
          <FormLabel className={FIELD_LABEL}>Province</FormLabel>
          <p className="text-xs text-slate-500 -mt-1">Auto-filled — change if needed</p>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <button
                  type="button"
                  className={cn(
                    FIELD_INPUT,
                    "flex items-center justify-between w-full px-3 text-left",
                    !field.value && "text-slate-400"
                  )}
                >
                  {field.value || "Select province"}
                  <ChevronsUpDown className="h-4 w-4 opacity-50 flex-shrink-0" />
                </button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              className="w-[--radix-popover-trigger-width] p-0 z-[100] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg"
              align="start"
              sideOffset={4}
              collisionPadding={12}
            >
              <Command className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                <CommandInput placeholder="Search province…" />
                <CommandList className="max-h-[220px]">
                  <CommandEmpty>No province found.</CommandEmpty>
                  <CommandGroup>
                    {CANADIAN_PROVINCES.map((p) => (
                      <CommandItem
                        key={p}
                        value={p}
                        onSelect={() => {
                          field.onChange(p);
                          setOpen(false);
                        }}
                      >
                        <Check className={cn("mr-2 h-4 w-4", field.value === p ? "opacity-100" : "opacity-0")} />
                        {p}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {mismatch && (
            <div className="flex items-start gap-1.5 text-xs text-amber-600 mt-1">
              <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-px" />
              <span>{mismatch}</span>
            </div>
          )}
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}

function CityCombobox({
  form,
  selectedProvince,
  mismatch,
}: {
  form: any;
  selectedProvince?: string;
  mismatch?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const options = selectedProvince ? CITIES_BY_PROVINCE[selectedProvince] || [] : [];

  return (
    <FormField
      control={form.control}
      name="city"
      render={({ field }: any) => (
        <FormItem className="flex flex-col">
          <FormLabel className={FIELD_LABEL}>City</FormLabel>
          <p className="text-xs text-slate-500 -mt-1">Auto-filled — search and select</p>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <button
                  type="button"
                  className={cn(
                    FIELD_INPUT,
                    "flex items-center justify-between w-full px-3 text-left",
                    !field.value && "text-slate-400"
                  )}
                >
                  {field.value || (selectedProvince ? "Select city" : "Select province first")}
                  <ChevronsUpDown className="h-4 w-4 opacity-50 flex-shrink-0" />
                </button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              className="w-[--radix-popover-trigger-width] p-0 z-[100] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg"
              align="start"
              sideOffset={4}
              collisionPadding={12}
            >
              <Command shouldFilter={true} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                <CommandInput
                  placeholder="Search city…"
                  value={query}
                  onValueChange={setQuery}
                />
                <CommandList className="max-h-[220px]">
                  <CommandEmpty>
                    {query.trim() ? (
                      <button
                        type="button"
                        className="text-sm text-[#00AFE6] hover:underline px-3 py-2"
                        onClick={() => {
                          field.onChange(query.trim());
                          setOpen(false);
                        }}
                      >
                        Use "{query.trim()}"
                      </button>
                    ) : (
                      "No city found."
                    )}
                  </CommandEmpty>
                  {options.length > 0 && (
                    <CommandGroup heading={selectedProvince}>
                      {options.map((c) => (
                        <CommandItem
                          key={c}
                          value={c}
                          onSelect={() => {
                            field.onChange(c);
                            setOpen(false);
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", field.value === c ? "opacity-100" : "opacity-0")} />
                          {c}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {mismatch && (
            <div className="flex items-start gap-1.5 text-xs text-amber-600 mt-1">
              <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-px" />
              <span>{mismatch}</span>
            </div>
          )}
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}

function CountryCodeSelect({ form, name, ariaLabel }: { form: any; name: string; ariaLabel: string }) {
  return (
    <FormField
      control={form.control}
      name={name as any}
      render={({ field }: any) => (
        <FormItem className="space-y-0">
          <Select onValueChange={field.onChange} value={field.value || "+1"}>
            <FormControl>
              <SelectTrigger className={`${FIELD_INPUT} w-[110px]`} aria-label={ariaLabel}>
                <SelectValue placeholder="+1" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="z-[100] max-h-[240px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg text-slate-900 dark:text-slate-100" position="popper" sideOffset={4}>
              {COUNTRY_CODES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  <span className="mr-1">{c.flag}</span> {c.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}

function PhoneNumberField({
  form,
  name,
  placeholder,
  label,
}: {
  form: any;
  name: string;
  placeholder?: string;
  label: string;
}) {
  const [warning, setWarning] = useState<string | null>(null);
  return (
    <FormField
      control={form.control}
      name={name as any}
      render={({ field }: any) => (
        <FormItem className="flex-1 space-y-0">
          <FormControl>
            <Input
              {...field}
              inputMode="tel"
              maxLength={20}
              onChange={(e) => {
                const raw = e.target.value;
                const next = DIGITS_FILTER(raw);
                if (next !== raw) {
                  setWarning("Only digits, spaces, and ( ) - + are allowed.");
                  window.setTimeout(() => setWarning(null), 1800);
                }
                field.onChange(next);
              }}
              placeholder={placeholder}
              className={FIELD_INPUT}
              aria-label={`${label} number`}
            />
          </FormControl>
          {warning && (
            <div className="flex items-start gap-1.5 text-xs text-amber-600 pt-1">
              <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-px" />
              <span>{warning}</span>
            </div>
          )}
          <FormMessage className="text-xs pt-1" />
        </FormItem>
      )}
    />
  );
}

function PhonePair({
  form,
  codeName,
  numberName,
  label,
  placeholder,
  required,
}: {
  form: any;
  codeName: string;
  numberName: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label className={FIELD_LABEL}>
        {label}
        {required && <span className="text-[#00AFE6]"> *</span>}
      </Label>
      <div className="flex gap-2">
        <CountryCodeSelect form={form} name={codeName} ariaLabel={`${label} country code`} />
        <PhoneNumberField
          form={form}
          name={numberName}
          placeholder={placeholder}
          label={label}
        />
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      {title && <h2 className="text-[11px] uppercase tracking-[0.12em] font-medium text-slate-400 dark:text-slate-500">{title}</h2>}
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function QuestionRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-6 py-1">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-normal text-slate-700 dark:text-slate-200">{label}</div>
        {description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</p>}
      </div>
      <div className="flex-shrink-0 pt-0.5">{children}</div>
    </div>
  );
}

/* ---------- i18n ---------- */

type Lang = "en" | "fr";
const I18N: Record<string, { en: string; fr: string }> = {
  badge: { en: "Professional Membership Application", fr: "Demande d'adhésion professionnelle" },
  titleJoin: { en: "Join", fr: "Rejoindre" },
  titleBrand: { en: "CAS & CANN", fr: "la SCA et le RCIA" },
  subtitle: {
    en: "Become part of Canada's premier professional network for amyloidosis care.",
    fr: "Rejoignez le principal réseau professionnel canadien dédié aux soins de l'amyloïdose.",
  },
  formTitle: { en: "Registration Form", fr: "Formulaire d'inscription" },
  formDesc: {
    en: "Complete the form below to join our professional community.",
    fr: "Remplissez le formulaire ci-dessous pour rejoindre notre communauté professionnelle.",
  },
  sectionMembership: { en: "Membership", fr: "Adhésion" },
  sectionProfile: { en: "Your Information", fr: "Vos renseignements" },
  sectionServices: { en: "Services Map", fr: "Carte des services" },
  sectionComms: { en: "Communications", fr: "Communications" },
  sectionNonMember: { en: "Non-member Contact", fr: "Contact (non-membre)" },
  qCAS: {
    en: "1. I would like to become a member of the Canadian Amyloidosis Society (CAS).",
    fr: "1. Je souhaite devenir membre de la Société canadienne de l'amyloïdose (SCA).",
  },
  qCANN: {
    en: "2. I would like to become a member of the Canadian Amyloidosis Nursing Network (CANN).",
    fr: "2. Je souhaite devenir membre du Réseau canadien des infirmières en amyloïdose (RCIA).",
  },
  cannNote: { en: "All CANN members will also be members of the CAS.", fr: "Tout membre du RCIA est également membre de la SCA." },
  firstName: { en: "First Name", fr: "Prénom" },
  lastName: { en: "Last Name", fr: "Nom de famille" },
  primaryEmail: { en: "Primary Email Address", fr: "Adresse courriel principale" },
  secondaryEmail: { en: "Secondary Email Address", fr: "Adresse courriel secondaire" },
  discipline: { en: "Professional Designation", fr: "Titre professionnel" },
  disciplineHint: {
    en: "e.g. physician, nurse, genetic counsellor, other",
    fr: "p. ex. médecin, infirmier/ère, conseiller/ère en génétique, autre",
  },
  disciplinePh: { en: "Enter your professional designation", fr: "Saisissez votre titre professionnel" },
  subspecialty: { en: "Sub-specialty Area of Focus", fr: "Sous-spécialité" },
  subspecialtyHint: { en: "e.g., Cardiology, Hematology, Neurology", fr: "p. ex. cardiologie, hématologie, neurologie" },
  subspecialtyPh: { en: "Enter your sub-specialty", fr: "Saisissez votre sous-spécialité" },
  amyloidQ: {
    en: "In my practice, I primarily care for patients with the following type(s) of amyloidosis:",
    fr: "Dans ma pratique, je m'occupe principalement de patients atteints du ou des types d'amyloïdose suivants :",
  },
  amyloidBoth: { en: "Both ATTR and AL", fr: "ATTR et AL" },
  amyloidOther: { en: "Other", fr: "Autre" },
  institution: { en: "Clinic or Centre Name / Institution", fr: "Nom de la clinique ou de l'établissement" },
  institutionPh: { en: "Enter your institution name", fr: "Saisissez le nom de votre établissement" },
  servicesQ: {
    en: "Would you like your centre/clinic included in the Canadian Amyloidosis Services Map?",
    fr: "Souhaitez-vous que votre clinique soit incluse dans la carte canadienne des services en amyloïdose ?",
  },
  servicesDesc: {
    en: "Helps patients across Canada find specialised care near them.",
    fr: "Aide les patients à trouver des soins spécialisés près de chez eux.",
  },
  streetName: { en: "Street Name", fr: "Nom de la rue" },
  postalCode: { en: "Postal Code", fr: "Code postal" },
  province: { en: "Province", fr: "Province" },
  provinceHint: { en: "Auto-filled — change if needed", fr: "Rempli automatiquement — modifiable" },
  provincePh: { en: "Select province", fr: "Sélectionnez une province" },
  city: { en: "City", fr: "Ville" },
  cityHint: { en: "Auto-filled — search and select", fr: "Rempli automatiquement — recherchez et sélectionnez" },
  cityFirst: { en: "Select province first", fr: "Sélectionnez d'abord une province" },
  cityPh: { en: "Search city…", fr: "Rechercher une ville…" },
  phone: { en: "Phone", fr: "Téléphone" },
  fax: { en: "Fax", fr: "Télécopieur" },
  required: { en: "Required", fr: "Obligatoire" },
  commsCAS: {
    en: "I would like to receive communication from the Canadian Amyloidosis Society (CAS):",
    fr: "Je souhaite recevoir les communications de la SCA :",
  },
  commsCANN: {
    en: "I would like to receive communication from the Canadian Amyloidosis Nursing Network (CANN):",
    fr: "Je souhaite recevoir les communications du RCIA :",
  },
  nmName: { en: "Name", fr: "Nom" },
  nmEmail: { en: "Email", fr: "Courriel" },
  nmMessage: { en: "Message / Reason for Contact", fr: "Message / Motif" },
  nmMessagePh: { en: "Please share why you're reaching out", fr: "Indiquez la raison de votre prise de contact" },
  yourInfoPrivate: { en: "Your information is kept private and never shared.", fr: "Vos renseignements sont confidentiels et ne sont jamais partagés." },
  submit: { en: "Submit Registration Form", fr: "Envoyer le formulaire" },
  confirmTitle: { en: "Membership Registration Submitted!", fr: "Inscription envoyée !" },
  confirmBody: {
    en: "We've received your form submission and we will be in touch soon with membership details.",
    fr: "Nous avons bien reçu votre formulaire. Vous serez contacté(e) sous peu avec les détails de votre adhésion.",
  },
  refId: { en: "Reference ID", fr: "N° de référence" },
  close: { en: "Close", fr: "Fermer" },

  // CASL consent block
  consentIntro: {
    en: "The Canadian Amyloidosis Society would like your permission to contact you. Tick the boxes for the messages you'd like to receive — every box is optional, and your membership goes through regardless of what you choose.",
    fr: "La Société canadienne de l'amyloïdose souhaite votre permission pour vous contacter. Cochez les cases correspondant aux communications que vous désirez recevoir — chaque case est facultative et votre adhésion sera traitée quel que soit votre choix.",
  },
  consentCASGroup: { en: "From CAS — Canadian Amyloidosis Society", fr: "De la SCA — Société canadienne de l'amyloïdose" },
  consentCANNGroup: { en: "From CANN — Canadian Amyloidosis Nursing Network", fr: "Du RCIA — Réseau canadien des infirmières en amyloïdose" },
  cNewsletter: { en: "Newsletter and society updates", fr: "Infolettre et nouvelles de la société" },
  cEvents: { en: "Event invitations (Summit, Journal Club, town halls)", fr: "Invitations aux événements (Sommet, Club de lecture, assemblées)" },
  cResearch: { en: "Research opportunities and surveys", fr: "Possibilités de recherche et sondages" },
  cFundraising: { en: "Fundraising and awareness campaigns", fr: "Collectes de fonds et campagnes de sensibilisation" },
  cCannNews: { en: "CANN newsletter and educational series", fr: "Infolettre RCIA et série éducative" },
  cCannEvents: { en: "CANN event invitations", fr: "Invitations aux événements du RCIA" },
  consentLegalCAS: {
    en: "By submitting this form, you consent to be contacted by the Canadian Amyloidosis Society (CAS) — 123 Example Street, Toronto, ON  M5G 2C4 · info@amyloid.ca · amyloid.ca — for the purposes you have selected above.",
    fr: "En soumettant ce formulaire, vous consentez à être contacté(e) par la Société canadienne de l'amyloïdose (SCA) — 123, rue Exemple, Toronto, ON  M5G 2C4 · info@amyloid.ca · amyloid.ca — aux fins que vous avez sélectionnées ci-dessus.",
  },
  consentLegalCANN: {
    en: "If you selected CANN options, you also consent to be contacted by the Canadian Amyloidosis Nursing Network (CANN), c/o the Canadian Amyloidosis Society — 123 Example Street, Toronto, ON  M5G 2C4 · cann@amyloid.ca · amyloid.ca/cann — and you understand CAS is contacting you on behalf of CANN for those communications.",
    fr: "Si vous avez sélectionné des options du RCIA, vous consentez également à être contacté(e) par le Réseau canadien des infirmières en amyloïdose (RCIA), a/s de la Société canadienne de l'amyloïdose — 123, rue Exemple, Toronto, ON  M5G 2C4 · cann@amyloid.ca · amyloid.ca/cann — et vous comprenez que la SCA vous contacte au nom du RCIA pour ces communications.",
  },
  consentLegalWithdraw: {
    en: "You may withdraw your consent at any time using the unsubscribe link in any email we send, by emailing info@amyloid.ca, or via the email preferences page linked in every message. Withdrawal requests are honoured within 10 business days. See our Privacy Policy for full details on how we collect and use your information.",
    fr: "Vous pouvez retirer votre consentement à tout moment en cliquant sur le lien de désabonnement dans tout courriel que nous envoyons, en écrivant à info@amyloid.ca, ou via la page des préférences de courriel liée à chaque message. Les demandes de retrait sont traitées dans un délai de 10 jours ouvrables. Consultez notre Politique de confidentialité pour plus de détails sur la collecte et l'utilisation de vos renseignements.",
  },
  privacyPolicy: { en: "Privacy Policy", fr: "Politique de confidentialité" },
  consentNoneNote: {
    en: "You haven't selected any communications — that's fine. We'll only contact you about your membership itself.",
    fr: "Vous n'avez sélectionné aucune communication — c'est très bien. Nous vous contacterons uniquement au sujet de votre adhésion.",
  },
};
function useT(lang: Lang) {
  return (key: keyof typeof I18N) => I18N[key][lang];
}

/* ---------- main ---------- */

export function Redesigned() {
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  const [isDark, setIsDark] = useState(false);
  const t = useT(lang);

  const form = useForm<CASRegistrationForm>({
    resolver: zodResolver(casRegistrationSchema),
    mode: "onTouched",
    defaultValues: {
      wantsMembership: undefined,
      wantsCANNMembership: undefined,
      firstName: "",
      lastName: "",
      primaryEmail: "",
      secondaryEmail: "",
      discipline: "",
      subspecialty: "",
      amyloidosisType: undefined,
      institution: "",
      wantsServicesMapInclusion: undefined,
      streetName: "",
      postalCode: "",
      city: "",
      province: "",
      phoneCode: "+1",
      phoneNumber: "",
      faxCode: "+1",
      faxNumber: "",
      wantsCommunications: undefined,
      cannCommunications: undefined,
      consentCASNewsletter: false,
      consentCASEvents: false,
      consentCASResearch: false,
      consentCASFundraising: false,
      consentCANNNewsletter: false,
      consentCANNEvents: false,
      noMemberName: "",
      noMemberEmail: "",
      noMemberMessage: "",
    },
  });

  const wantsMembership = form.watch("wantsMembership");
  const wantsCANNMembership = form.watch("wantsCANNMembership");
  const wantsServicesMapInclusion = form.watch("wantsServicesMapInclusion");
  const postalCode = form.watch("postalCode");
  const consents = form.watch([
    "consentCASNewsletter",
    "consentCASEvents",
    "consentCASResearch",
    "consentCASFundraising",
    "consentCANNNewsletter",
    "consentCANNEvents",
  ]);
  const noConsentTicked = !consents.some(Boolean);

  // Reset CANN consents if user changes CANN membership to No
  useEffect(() => {
    if (wantsCANNMembership !== "Yes") {
      if (form.getValues("consentCANNNewsletter")) form.setValue("consentCANNNewsletter", false);
      if (form.getValues("consentCANNEvents")) form.setValue("consentCANNEvents", false);
    }
  }, [wantsCANNMembership, form]);
  const cityValue = form.watch("city");
  const provinceValue = form.watch("province");
  const isMember = wantsMembership === "Yes" || wantsCANNMembership === "Yes";
  const declinedBoth = wantsMembership === "No" && wantsCANNMembership === "No";

  const postalMatch = postalCode ? lookupPostalCode(postalCode) : null;

  // Auto-fill city + province from postal code prefix (overwrites on postal change; user can then edit)
  useEffect(() => {
    if (!postalCode) {
      form.setValue("city", "");
      form.setValue("province", "");
      return;
    }
    const match = lookupPostalCode(postalCode);
    if (match) {
      form.setValue("city", match.city);
      form.setValue("province", match.province);
    } else {
      form.setValue("city", "");
      form.setValue("province", "");
    }
  }, [postalCode, form]);

  // Mismatch warnings — compare current values to postal-derived values
  const provinceMismatch =
    postalMatch && provinceValue && provinceValue !== postalMatch.province
      ? `Postal code "${postalCode}" usually belongs to ${postalMatch.province}.`
      : undefined;
  const cityMismatch =
    postalMatch && cityValue && cityValue !== postalMatch.city
      ? `Postal code "${postalCode}" usually maps to ${postalMatch.city}.`
      : undefined;

  const onSubmit = (data: CASRegistrationForm) => {
    console.log("[Mockup] Submission:", data);
    setSubmissionId("CAS-" + Math.random().toString(36).slice(2, 10).toUpperCase());
    setShowConfirmation(true);
  };

  return (
    <div className={isDark ? "dark" : ""}>
    <div className="min-h-screen w-full bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 transition-colors">
      <div className="max-w-2xl mx-auto">
        {/* Toggle bar */}
        <div className="flex justify-end gap-2 mb-4">
          <button
            type="button"
            onClick={() => setLang(lang === "en" ? "fr" : "en")}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-sm hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
            aria-label="Toggle language"
          >
            <Languages className="w-3.5 h-3.5" />
            {lang === "en" ? "EN" : "FR"}
          </button>
          <button
            type="button"
            onClick={() => setIsDark(!isDark)}
            className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 shadow-sm hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-sm mb-4">
            <Stethoscope className="w-3.5 h-3.5 text-[#00AFE6]" />
            {t("badge")}
          </div>
          <h1 className="text-4xl font-serif font-bold tracking-tight leading-tight">
            {t("titleJoin")}{" "}
            <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
              {t("titleBrand")}
            </span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 max-w-md mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Unified form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
          >
            <div className="px-8 sm:px-10 pt-8 pb-2">
              <h3 className="text-lg font-serif font-semibold text-slate-900 dark:text-slate-100">{t("formTitle")}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {t("formDesc")}
              </p>
            </div>

            <div className="px-8 sm:px-10 pb-8 sm:pb-10 pt-5 space-y-6 divide-y divide-slate-100 dark:divide-slate-800 [&>*:not(:first-child)]:pt-6">
              {/* Membership */}
              <Section title={t("sectionMembership")}>
                <FormField
                  control={form.control}
                  name="wantsMembership"
                  render={({ field }) => (
                    <FormItem>
                      <QuestionRow label={t("qCAS")}>
                        <YesNo value={field.value as any} onChange={field.onChange} accent="cas" />
                      </QuestionRow>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <div className="h-px bg-slate-100 dark:bg-slate-800" />

                <FormField
                  control={form.control}
                  name="wantsCANNMembership"
                  render={({ field }) => (
                    <FormItem>
                      <QuestionRow
                        label={t("qCANN")}
                        description={t("cannNote")}
                      >
                        <YesNo value={field.value as any} onChange={field.onChange} accent="cann" />
                      </QuestionRow>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </Section>

              {/* Profile */}
              {isMember && (
                <Section title={t("sectionProfile")}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <TextField name="firstName" label={t("firstName")} placeholder="Jane" form={form} required inputFilter={ALPHA_FILTER} filterWarning={lang === "fr" ? "Les chiffres et symboles ne sont pas autorisés." : "Numbers and symbols are not allowed in this field."} />
                    <TextField name="lastName" label={t("lastName")} placeholder="Doe" form={form} required inputFilter={ALPHA_FILTER} filterWarning={lang === "fr" ? "Les chiffres et symboles ne sont pas autorisés." : "Numbers and symbols are not allowed in this field."} />
                    <TextField
                      name="primaryEmail"
                      label={t("primaryEmail")}
                      type="email"
                      placeholder="jane@hospital.ca"
                      form={form}
                      required
                    />
                    <TextField
                      name="secondaryEmail"
                      label={t("secondaryEmail")}
                      type="email"
                      placeholder={lang === "fr" ? "jane.doe@gmail.com (facultatif)" : "jane.doe@gmail.com (optional)"}
                      form={form}
                    />
                    <TextField
                      name="discipline"
                      label={t("discipline")}
                      description={t("disciplineHint")}
                      placeholder={t("disciplinePh")}
                      form={form}
                      required
                      inputFilter={ALPHA_FILTER}
                      filterWarning={lang === "fr" ? "Les chiffres et symboles ne sont pas autorisés." : "Numbers and symbols are not allowed in this field."}
                    />
                    <TextField
                      name="subspecialty"
                      label={t("subspecialty")}
                      description={t("subspecialtyHint")}
                      placeholder={t("subspecialtyPh")}
                      form={form}
                      required
                      inputFilter={ALPHA_FILTER}
                      filterWarning={lang === "fr" ? "Les chiffres et symboles ne sont pas autorisés." : "Numbers and symbols are not allowed in this field."}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="amyloidosisType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={FIELD_LABEL}>
                          {t("amyloidQ")}
                          <span className="text-[#00AFE6]"> *</span>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-wrap gap-2 mt-3"
                          >
                            {[
                              { key: "ATTR", label: "ATTR" },
                              { key: "AL", label: "AL" },
                              { key: "Both ATTR and AL", label: t("amyloidBoth") },
                              { key: "Other", label: t("amyloidOther") },
                            ].map((type) => (
                              <Label
                                key={type.key}
                                className={`flex-1 min-w-[120px] flex items-center justify-center h-11 px-4 rounded-lg border cursor-pointer text-sm font-normal whitespace-nowrap transition-all ${
                                  field.value === type.key
                                    ? "border-[#00AFE6] bg-[#00AFE6]/5 text-[#00AFE6]"
                                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300"
                                }`}
                              >
                                <RadioGroupItem value={type.key} className="sr-only" />
                                {type.label}
                              </Label>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <TextField
                    name="institution"
                    label={t("institution")}
                    placeholder={t("institutionPh")}
                    form={form}
                    required
                    inputFilter={INSTITUTION_FILTER}
                    filterWarning={lang === "fr" ? "Les chiffres ne sont pas autorisés. Lettres et ponctuation seulement." : "Numbers are not allowed. Use letters and common punctuation only."}
                  />
                </Section>
              )}

              {/* Services Map */}
              {isMember && (
                <Section title={t("sectionServices")}>
                  <FormField
                    control={form.control}
                    name="wantsServicesMapInclusion"
                    render={({ field }) => (
                      <FormItem>
                        <QuestionRow
                          label={t("servicesQ")}
                          description={t("servicesDesc")}
                        >
                          <YesNo value={field.value as any} onChange={field.onChange} accent="cas" />
                        </QuestionRow>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {wantsServicesMapInclusion === "Yes" && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-top-1 duration-300">
                      <TextField
                        name="streetName"
                        label={t("streetName")}
                        placeholder="123 Hospital Street"
                        form={form}
                        required
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <TextField
                          name="postalCode"
                          label={t("postalCode")}
                          placeholder="M5G 2C4"
                          form={form}
                          required
                          inputFilter={POSTAL_FILTER}
                          maxLength={7}
                          filterWarning={lang === "fr" ? "Lettres et chiffres seulement (format canadien)." : "Only letters and numbers (Canadian postal format)."}
                        />
                        <div className="hidden sm:block" />
                        <ProvinceCombobox form={form} mismatch={provinceMismatch} />
                        <CityCombobox form={form} selectedProvince={provinceValue} mismatch={cityMismatch} />
                        <PhonePair
                          form={form}
                          codeName="phoneCode"
                          numberName="phoneNumber"
                          label={t("phone")}
                          placeholder="555-1234"
                          required
                        />
                        <PhonePair
                          form={form}
                          codeName="faxCode"
                          numberName="faxNumber"
                          label={t("fax")}
                          placeholder="555-5678"
                        />
                      </div>
                    </div>
                  )}
                </Section>
              )}

              {/* Communications — CASL granular consent */}
              {isMember && (
                <Section title={t("sectionComms")}>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {t("consentIntro")}
                  </p>

                  {/* CAS group */}
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40 p-4 space-y-3">
                    <div className="text-xs font-medium uppercase tracking-wider text-[#00AFE6]">
                      {t("consentCASGroup")}
                    </div>
                    <div className="space-y-2.5">
                      {([
                        ["consentCASNewsletter", t("cNewsletter")],
                        ["consentCASEvents", t("cEvents")],
                        ["consentCASResearch", t("cResearch")],
                        ["consentCASFundraising", t("cFundraising")],
                      ] as const).map(([name, label]) => (
                        <FormField
                          key={name}
                          control={form.control}
                          name={name as any}
                          render={({ field }) => (
                            <FormItem className="flex items-start gap-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={!!field.value}
                                  onCheckedChange={field.onChange}
                                  className="mt-0.5 data-[state=checked]:bg-[#00AFE6] data-[state=checked]:border-[#00AFE6]"
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal text-slate-700 dark:text-slate-200 cursor-pointer leading-snug">
                                {label}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  {/* CANN group — only if joining CANN */}
                  {wantsCANNMembership === "Yes" && (
                    <div className="rounded-xl border border-pink-200 dark:border-pink-900/40 bg-pink-50/40 dark:bg-pink-950/20 p-4 space-y-3">
                      <div className="text-xs font-medium uppercase tracking-wider text-pink-600 dark:text-pink-400">
                        {t("consentCANNGroup")}
                      </div>
                      <div className="space-y-2.5">
                        {([
                          ["consentCANNNewsletter", t("cCannNews")],
                          ["consentCANNEvents", t("cCannEvents")],
                        ] as const).map(([name, label]) => (
                          <FormField
                            key={name}
                            control={form.control}
                            name={name as any}
                            render={({ field }) => (
                              <FormItem className="flex items-start gap-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={!!field.value}
                                    onCheckedChange={field.onChange}
                                    className="mt-0.5 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal text-slate-700 dark:text-slate-200 cursor-pointer leading-snug">
                                  {label}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Helpful note when nothing is ticked */}
                  {noConsentTicked && (
                    <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-lg px-3 py-2">
                      {t("consentNoneNote")}
                    </p>
                  )}

                  {/* CASL legal fine-print block */}
                  <div className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2">
                    <p>{t("consentLegalCAS")}</p>
                    {wantsCANNMembership === "Yes" && <p>{t("consentLegalCANN")}</p>}
                    <p>
                      {t("consentLegalWithdraw")}{" "}
                      <a
                        href="/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00AFE6] hover:underline"
                      >
                        {t("privacyPolicy")} →
                      </a>
                    </p>
                  </div>
                </Section>
              )}

              {/* Non-member */}
              {declinedBoth && (
                <Section title={t("sectionNonMember")}>
                  <TextField name="noMemberName" label={t("nmName")} placeholder={lang === "fr" ? "Saisissez votre nom" : "Enter your name"} form={form} required />
                  <TextField
                    name="noMemberEmail"
                    label={t("nmEmail")}
                    type="email"
                    placeholder={lang === "fr" ? "Saisissez votre courriel" : "Enter your email"}
                    form={form}
                    required
                  />
                  <FormField
                    control={form.control}
                    name="noMemberMessage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={FIELD_LABEL}>{t("nmMessage")}</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder={t("nmMessagePh")}
                            className="min-h-[110px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus-visible:ring-2 focus-visible:ring-[#00AFE6]/30 focus-visible:border-[#00AFE6]"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </Section>
              )}
            </div>

            {/* Submit */}
            {(isMember || declinedBoth) && (
              <div className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 px-8 sm:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
                  {t("yourInfoPrivate")}
                </p>
                <Button
                  type="submit"
                  className="px-8 h-11 text-sm font-medium rounded-lg bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white shadow-md hover:shadow-lg hover:brightness-105 transition-all border-0"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {t("submit")}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>

      {/* Confirmation */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md text-center p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-[#00AFE6] to-[#00DD89] flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-2xl font-serif text-slate-900 dark:text-slate-100">{t("confirmTitle")}</DialogTitle>
            <DialogDescription className="text-base text-slate-600 dark:text-slate-300">
              {t("confirmBody")}
              <span className="block mt-3 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-xs font-mono inline-block">
                {t("refId")}: {submissionId}
              </span>
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => setShowConfirmation(false)}
            className="mt-4 rounded-full px-8 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white border-0"
          >
            {t("close")}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
    </div>
  );
}
