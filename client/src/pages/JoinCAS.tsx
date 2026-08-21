import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserPlus,
  CheckCircle2,
  Send,
  Users,
  Heart,
  Sparkles,
  Check,
  ChevronsUpDown,
  AlertTriangle,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "../contexts/LanguageContext";
import {
  casRegistrationSchema,
  type CASRegistrationForm,
  lookupPostalCode,
} from "./joinCAS.schema";

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
  disabledOption,
}: {
  value?: "Yes" | "No";
  onChange: (v: "Yes" | "No") => void;
  accent?: "cas" | "cann";
  disabledOption?: "Yes" | "No";
}) {
  const activeClass =
    accent === "cann"
      ? "bg-pink-500 text-white border-pink-500 shadow-sm"
      : "bg-[#00AFE6] text-white border-[#00AFE6] shadow-sm";
  const idleClass =
    "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600";
  return (
    <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1 gap-1">
      {(["Yes", "No"] as const).map((opt) => {
        const active = value === opt;
        const disabled = opt === disabledOption;
        return (
          <button
            key={opt}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && onChange(opt)}
            className={`px-5 sm:px-6 h-9 text-sm font-medium rounded-md border transition-all ${
              active ? activeClass : idleClass
            } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
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
const PHONE_FILTER = (v: string) => {
  const digits = v.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
};
const POSTAL_FILTER = (v: string) => {
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

function ProvinceCombobox({ form, mismatch, t }: { form: any; mismatch?: string; t: (k: any) => string }) {
  const [open, setOpen] = useState(false);
  return (
    <FormField
      control={form.control}
      name="province"
      render={({ field }: any) => (
        <FormItem className="flex flex-col">
          <FormLabel className={FIELD_LABEL}>{t("province")}</FormLabel>
          <p className="text-xs text-slate-500 -mt-1">{t("provinceHint")}</p>
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
                  {field.value || t("provincePh")}
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
  t,
}: {
  form: any;
  selectedProvince?: string;
  mismatch?: string;
  t: (k: any) => string;
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
          <FormLabel className={FIELD_LABEL}>{t("city")}</FormLabel>
          <p className="text-xs text-slate-500 -mt-1">{t("cityHint")}</p>
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
                  {field.value || (selectedProvince ? t("cityPh") : t("cityFirst"))}
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
                  placeholder={t("cityPh")}
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
      {title && (
        <h2 className="text-[11px] uppercase tracking-[0.12em] font-medium text-slate-400 dark:text-slate-500">
          {title}
        </h2>
      )}
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function QuestionRow({
  label,
  description,
  children,
  required,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-6 py-1">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-normal text-slate-700 dark:text-slate-200">{label}{required && <span className="text-[#00AFE6]"> *</span>}</div>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</p>
        )}
      </div>
      <div className="flex-shrink-0 sm:pt-0.5">{children}</div>
    </div>
  );
}

/* ---------- i18n (form-body strings only — hero uses the global useLanguage) ---------- */

type Lang = "en" | "fr";
const I18N = {
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
  cannNote: {
    en: "All CANN members will also be members of the CAS.",
    fr: "Tout membre du RCIA est également membre de la SCA.",
  },
  firstName: { en: "First Name", fr: "Prénom" },
  lastName: { en: "Last Name", fr: "Nom de famille" },
  primaryEmail: { en: "Primary Email Address", fr: "Adresse courriel principale" },
  secondaryEmail: { en: "Secondary Email Address", fr: "Adresse courriel secondaire" },
  discipline: { en: "Professional Designation", fr: "Titre professionnel" },
  disciplineHint: {
    en: "e.g. physician, nurse, genetic counsellor, other",
    fr: "p. ex. médecin, infirmier/ère, conseiller/ère en génétique, autre",
  },
  disciplinePh: {
    en: "Enter your professional designation",
    fr: "Saisissez votre titre professionnel",
  },
  subspecialty: { en: "Sub-specialty Area of Focus", fr: "Sous-spécialité" },
  subspecialtyHint: {
    en: "e.g., Cardiology, Hematology, Neurology",
    fr: "p. ex. cardiologie, hématologie, neurologie",
  },
  subspecialtyPh: { en: "Enter your sub-specialty", fr: "Saisissez votre sous-spécialité" },
  amyloidQ: {
    en: "In my practice, I primarily care for patients with the following type(s) of amyloidosis:",
    fr: "Dans ma pratique, je m'occupe principalement de patients atteints du ou des types d'amyloïdose suivants :",
  },
  amyloidBoth: { en: "Both ATTR and AL", fr: "ATTR et AL" },
  amyloidOther: { en: "Other", fr: "Autre" },
  amyloidOtherLabel: { en: "Please specify amyloidosis type", fr: "Veuillez préciser le type d'amylose" },
  amyloidOtherPh: { en: "e.g., AA, ALECT2, hereditary", fr: "ex. AA, ALECT2, héréditaire" },
  institution: {
    en: "Institution name",
    fr: "Nom de l'établissement",
  },
  institutionPh: {
    en: "Enter your institution name",
    fr: "Saisissez le nom de votre établissement",
  },
  servicesQ: {
    en: "Would you like your centre/clinic included in the Canadian Amyloidosis Services Map?",
    fr: "Souhaitez-vous que votre clinique soit incluse dans la carte canadienne des services en amyloïdose ?",
  },
  servicesDesc: {
    en: "Helps patients across Canada find specialised care near them.",
    fr: "Aide les patients à trouver des soins spécialisés près de chez eux.",
  },
  mapClinicName: { en: "Clinic / Centre Name", fr: "Nom de la clinique / du centre" },
  mapClinicNamePh: { en: "Enter the clinic or centre name", fr: "Saisissez le nom de la clinique ou du centre" },
  streetName: { en: "Street Name", fr: "Nom de la rue" },
  postalCode: { en: "Postal Code", fr: "Code postal" },
  province: { en: "Province", fr: "Province" },
  provinceHint: {
    en: "Auto-filled — change if needed",
    fr: "Rempli automatiquement — modifiable",
  },
  provincePh: { en: "Select province", fr: "Sélectionnez une province" },
  city: { en: "City", fr: "Ville" },
  cityHint: {
    en: "Auto-filled — search and select",
    fr: "Rempli automatiquement — recherchez et sélectionnez",
  },
  cityFirst: { en: "Select province first", fr: "Sélectionnez d'abord une province" },
  cityPh: { en: "Search city…", fr: "Rechercher une ville…" },
  phone: { en: "Phone", fr: "Téléphone" },
  fax: { en: "Fax", fr: "Télécopieur" },
  filterPhone: { en: "Digits only (10-digit Canadian number with area code)", fr: "Chiffres uniquement (numéro canadien à 10 chiffres avec indicatif régional)" },
  nmName: { en: "Name", fr: "Nom" },
  nmEmail: { en: "Email", fr: "Courriel" },
  nmMessage: { en: "Message / Reason for Contact", fr: "Message / Motif" },
  nmMessagePh: {
    en: "Please share why you're reaching out",
    fr: "Indiquez la raison de votre prise de contact",
  },
  yourInfoPrivate: {
    en: "Your information is kept private and never shared.",
    fr: "Vos renseignements sont confidentiels et ne sont jamais partagés.",
  },
  submit: { en: "Submit Registration Form", fr: "Envoyer le formulaire" },
  confirmTitle: { en: "Membership Registration Submitted!", fr: "Inscription envoyée !" },
  confirmBody: {
    en: "We've received your form submission and we will be in touch soon with membership details.",
    fr: "Nous avons bien reçu votre formulaire. Vous serez contacté(e) sous peu avec les détails de votre adhésion.",
  },
  refId: { en: "Reference ID", fr: "N° de référence" },
  close: { en: "Close", fr: "Fermer" },
  consentIntro: {
    en: "Optional — your membership goes through either way.",
    fr: "Facultatif — votre adhésion sera traitée dans tous les cas.",
  },
  consentSingleShort: {
    en: "Yes, please send me communications from CAS",
    fr: "Oui, envoyez-moi les communications de la SCA",
  },
  consentSingleShortCANN: { en: " and CANN", fr: " et du RCIA" },
  consentSingleHelp: {
    en: "See what you'll receive and how to unsubscribe",
    fr: "Voir ce que vous recevrez et comment vous désabonner",
  },
  consentLegalShort: {
    en: "By submitting, you agree to our",
    fr: "En soumettant, vous acceptez notre",
  },
  privacyPolicy: { en: "Privacy Policy", fr: "Politique de confidentialité" },
  filterAlpha: {
    en: "Numbers and symbols are not allowed in this field.",
    fr: "Les chiffres et symboles ne sont pas autorisés.",
  },
  filterInstitution: {
    en: "Numbers are not allowed. Use letters and common punctuation only.",
    fr: "Les chiffres ne sont pas autorisés. Lettres et ponctuation seulement.",
  },
  filterPostal: {
    en: "Only letters and numbers (Canadian postal format).",
    fr: "Lettres et chiffres seulement (format canadien).",
  },
  secondaryEmailPh: {
    en: "jane.doe@gmail.com (optional)",
    fr: "jane.doe@gmail.com (facultatif)",
  },
  nmNamePh: { en: "Enter your name", fr: "Saisissez votre nom" },
  nmEmailPh: { en: "Enter your email", fr: "Saisissez votre courriel" },
} as const;

function useFormT(lang: Lang) {
  return (key: keyof typeof I18N) => I18N[key][lang];
}

interface SubmissionResponse {
  submissionId: string;
  status: string;
  message: string;
}

/* ---------- main page ---------- */

export default function JoinCAS() {
  const { toast } = useToast();
  const { t: gT, language } = useLanguage();
  const lang: Lang = language === "fr" ? "fr" : "en";
  const t = useFormT(lang);
  const shouldReduceMotion = useReducedMotion();

  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

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
      amyloidosisTypeOther: "",
      institution: "",
      wantsServicesMapInclusion: undefined,
      mapClinicName: "",
      streetName: "",
      postalCode: "",
      city: "",
      province: "",
      phoneCode: "+1",
      phoneNumber: "",
      faxCode: "+1",
      faxNumber: "",
      // Canadian-only — country code is implicit (+1); UI no longer collects it.
      consentAll: false,
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
  const cityValue = form.watch("city");
  const provinceValue = form.watch("province");
  const isMember = wantsMembership === "Yes" || wantsCANNMembership === "Yes";
  const declinedBoth = wantsMembership === "No" && wantsCANNMembership === "No";

  const postalMatch = postalCode ? lookupPostalCode(postalCode) : null;

  // Auto-fill city + province from postal code prefix — but only when:
  //  (1) the postal prefix actually changes (so we don't loop on every keystroke
  //      that doesn't change the first letter), and
  //  (2) the target field is still empty. We NEVER overwrite a value the user
  //      typed/selected manually, and we NEVER auto-clear on a lookup miss —
  //      mismatches surface as a soft warning under the field instead.
  const lastPostalPrefixRef = useRef<string>("");
  useEffect(() => {
    const prefix = (postalCode || "").trim().toUpperCase().slice(0, 1);
    if (prefix === lastPostalPrefixRef.current) return;
    lastPostalPrefixRef.current = prefix;
    if (!prefix) return;
    const match = lookupPostalCode(postalCode || "");
    if (!match) return;
    if (!form.getValues("city")) form.setValue("city", match.city);
    if (!form.getValues("province")) form.setValue("province", match.province);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postalCode]);

  const provinceMismatch =
    postalMatch && provinceValue && provinceValue !== postalMatch.province
      ? `Postal code "${postalCode}" usually belongs to ${postalMatch.province}.`
      : undefined;
  const cityMismatch =
    postalMatch && cityValue && cityValue !== postalMatch.city
      ? `Postal code "${postalCode}" usually maps to ${postalMatch.city}.`
      : undefined;

  const submitMutation = useMutation({
    mutationFn: async (formData: any): Promise<SubmissionResponse> => {
      const formName = "CAS / CANN Registration";
      const response = await apiRequest("POST", "/api/cas-cann-registration", {
        formData,
        formName,
      });
      return await response.json();
    },
    onSuccess: (data) => {
      setSubmissionId(data.submissionId);
      setShowConfirmation(true);
      toast({
        title: gT("joinCAS.toast.successTitle"),
        description:
          form.getValues("wantsCANNMembership") === "Yes"
            ? gT("joinCAS.toast.successCASCANN")
            : gT("joinCAS.toast.successCAS"),
      });
      form.reset();
    },
    onError: (error) => {
      console.error("Form submission error:", error);
      toast({
        title: gT("joinCAS.toast.errorTitle"),
        description: gT("joinCAS.toast.errorDescription"),
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: CASRegistrationForm) => {
    // Mirror the single bundled consentAll into each per-purpose flag so the
    // backend audit log keeps its 6-key shape. CANN keys stay false if the user
    // is not joining CANN.
    const all = !!data.consentAll;
    const joiningCANN = data.wantsCANNMembership === "Yes";
    const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ").trim();
    // Canadian-only: country code is implicit (+1). Prefix it for the
    // legacy Zoho centerPhone/centerFax mirror so downstream stays consistent.
    const fullPhone = data.phoneNumber?.trim() ? `+1 ${data.phoneNumber.trim()}` : "";
    const fullFax = data.faxNumber?.trim() ? `+1 ${data.faxNumber.trim()}` : "";
    const fullAddress = [data.streetName, data.city, data.province, data.postalCode]
      .filter(Boolean)
      .join(", ")
      .trim();

    // Send both shapes:
    //  - new fields (firstName/lastName/primaryEmail/... + granular consents) for
    //    the consent audit log and future Zoho mapper.
    //  - legacy fields (fullName/email/centerAddress/centerPhone/centerFax/
    //    wantsCommunications/cannCommunications) so the existing server-side
    //    Zoho mapper keeps populating the right fields without changes.
    // If "Other" is selected, embed the user-specified value into amyloidosisType
    // so the existing Zoho mapper receives the actual type text.
    const resolvedAmyloidosisType =
      data.amyloidosisType === "Other" && data.amyloidosisTypeOther?.trim()
        ? `Other: ${data.amyloidosisTypeOther.trim()}`
        : data.amyloidosisType;

    const payload = {
      ...data,
      amyloidosisType: resolvedAmyloidosisType,
      // legacy-shape mirror for back-compat
      fullName,
      email: data.primaryEmail,
      centerName: data.mapClinicName,
      centerAddress: fullAddress,
      centerPhone: fullPhone,
      centerFax: fullFax,
      wantsCommunications: all ? "Yes" : "No",
      cannCommunications: all && joiningCANN ? "Yes" : "No",
      // derived per-purpose consent flags
      consentCASNewsletter: all,
      consentCASEvents: all,
      consentCASResearch: all,
      consentCASFundraising: all,
      consentCANNNewsletter: all && joiningCANN,
      consentCANNEvents: all && joiningCANN,
    };
    await submitMutation.mutateAsync(payload);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section (existing) */}
      <section className="relative py-20 bg-gradient-to-br from-[#00AFE6]/5 via-white to-[#00DD89]/5 dark:from-[#00AFE6]/10 dark:via-gray-900 dark:to-[#00DD89]/10 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 rounded-full px-6 py-3 border border-[#00AFE6]/20 mb-8 shadow-sm"
              initial={shouldReduceMotion ? {} : { scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.2, duration: 0.5 }}
            >
              <UserPlus className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white tracking-wide">
                {gT("joinCAS.badge")}
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-rosarivo mb-6 text-gray-900 dark:text-white leading-tight">
              {gT("joinCAS.title.join")}{" "}
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                {gT("joinCAS.title.casCANN")}
              </span>
            </h1>

            <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 mb-4 max-w-2xl mx-auto leading-relaxed">
              {gT("joinCAS.subtitle")}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Heart className="w-4 h-4 text-[#00AFE6]" />
                <span>{gT("joinCAS.patientFocused")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4 text-[#00DD89]" />
                <span>{gT("joinCAS.collaborativeNetwork")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Sparkles className="w-4 h-4 text-[#00AFE6]" />
                <span>{gT("joinCAS.evidenceBased")}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-12 sm:py-16 -mt-8 sm:-mt-12">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.3, duration: 0.6 }}
          >
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden"
              >
                <div className="px-4 sm:px-8 md:px-10 pt-6 sm:pt-8 pb-2">
                  <h3 className="text-lg font-serif font-semibold text-slate-900 dark:text-slate-100">
                    {t("formTitle")}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    {t("formDesc")}
                  </p>
                </div>

                <div className="px-4 sm:px-8 md:px-10 pb-6 sm:pb-8 md:pb-10 pt-5 space-y-3 divide-y divide-slate-100 dark:divide-slate-800 [&>*:not(:first-child)]:pt-3">
                  {/* Membership */}
                  <Section title={t("sectionMembership")}>
                    <FormField
                      control={form.control}
                      name="wantsMembership"
                      render={({ field }) => (
                        <FormItem>
                          <QuestionRow label={t("qCAS")}>
                            <YesNo
                              value={field.value as any}
                              onChange={field.onChange}
                              accent="cas"
                            />
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
                          <QuestionRow label={t("qCANN")} description={t("cannNote")}>
                            <YesNo
                              value={field.value as any}
                              onChange={field.onChange}
                              accent="cann"
                            />
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
                        <TextField
                          name="firstName"
                          label={t("firstName")}
                          placeholder="Jane"
                          form={form}
                          required
                          inputFilter={ALPHA_FILTER}
                          filterWarning={t("filterAlpha")}
                        />
                        <TextField
                          name="lastName"
                          label={t("lastName")}
                          placeholder="Doe"
                          form={form}
                          required
                          inputFilter={ALPHA_FILTER}
                          filterWarning={t("filterAlpha")}
                        />
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
                          placeholder={t("secondaryEmailPh")}
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
                          filterWarning={t("filterAlpha")}
                        />
                        <TextField
                          name="subspecialty"
                          label={t("subspecialty")}
                          description={t("subspecialtyHint")}
                          placeholder={t("subspecialtyPh")}
                          form={form}
                          required
                          inputFilter={ALPHA_FILTER}
                          filterWarning={t("filterAlpha")}
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

                      {form.watch("amyloidosisType") === "Other" && (
                        <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                          <TextField
                            name="amyloidosisTypeOther"
                            label={t("amyloidOtherLabel")}
                            placeholder={t("amyloidOtherPh")}
                            form={form}
                            required
                          />
                        </div>
                      )}

                      <TextField
                        name="institution"
                        label={t("institution")}
                        placeholder={t("institutionPh")}
                        form={form}
                        required
                        inputFilter={INSTITUTION_FILTER}
                        filterWarning={t("filterInstitution")}
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
                              required
                            >
                              <YesNo
                                value={field.value as any}
                                onChange={field.onChange}
                                accent="cas"
                              />
                            </QuestionRow>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />

                      {wantsServicesMapInclusion === "Yes" && (
                        <div className="space-y-5 animate-in fade-in slide-in-from-top-1 duration-300">
                          <TextField
                            name="mapClinicName"
                            label={t("mapClinicName")}
                            placeholder={t("mapClinicNamePh")}
                            form={form}
                            required
                          />
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
                              filterWarning={t("filterPostal")}
                            />
                            <div className="hidden sm:block" />
                            <ProvinceCombobox form={form} mismatch={provinceMismatch} t={t} />
                            <CityCombobox
                              form={form}
                              selectedProvince={provinceValue}
                              mismatch={cityMismatch}
                              t={t}
                            />
                            <TextField
                              name="phoneNumber"
                              label={t("phone")}
                              placeholder="416-555-1234"
                              form={form}
                              required
                              inputFilter={PHONE_FILTER}
                              maxLength={12}
                              filterWarning={t("filterPhone")}
                            />
                            <TextField
                              name="faxNumber"
                              label={t("fax")}
                              placeholder="416-555-5678"
                              form={form}
                              required
                              inputFilter={PHONE_FILTER}
                              maxLength={12}
                              filterWarning={t("filterPhone")}
                            />
                          </div>
                        </div>
                      )}
                    </Section>
                  )}

                  {/* Communications — single bundled consent. */}
                  {isMember && (
                    <Section title={t("sectionComms")}>
                      <FormField
                        control={form.control}
                        name="consentAll"
                        render={({ field }) => (
                          <FormItem className="flex items-start gap-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={!!field.value}
                                onCheckedChange={field.onChange}
                                className="mt-0.5 data-[state=checked]:bg-[#00AFE6] data-[state=checked]:border-[#00AFE6]"
                              />
                            </FormControl>
                            <div className="flex-1 min-w-0">
                              <FormLabel className="block text-sm font-normal text-slate-700 dark:text-slate-200 cursor-pointer leading-snug">
                                {t("consentSingleShort")}
                                {wantsCANNMembership === "Yes" && (
                                  <span className="text-pink-600 dark:text-pink-400">
                                    {t("consentSingleShortCANN")}
                                  </span>
                                )}
                              </FormLabel>
                              <div className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                {t("consentIntro")}{" "}
                                <a
                                  href="/communications-preferences"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#00AFE6] hover:underline whitespace-nowrap"
                                >
                                  {t("consentSingleHelp")} →
                                </a>
                              </div>
                              <div className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                {t("consentLegalShort")}{" "}
                                <a
                                  href="/privacy-policy"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#00AFE6] hover:underline whitespace-nowrap"
                                >
                                  {t("privacyPolicy")} →
                                </a>
                              </div>
                            </div>
                          </FormItem>
                        )}
                      />
                    </Section>
                  )}

                  {/* Non-member */}
                  {declinedBoth && (
                    <Section title={t("sectionNonMember")}>
                      <TextField
                        name="noMemberName"
                        label={t("nmName")}
                        placeholder={t("nmNamePh")}
                        form={form}
                        required
                      />
                      <TextField
                        name="noMemberEmail"
                        label={t("nmEmail")}
                        type="email"
                        placeholder={t("nmEmailPh")}
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
                  <div className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 px-4 sm:px-8 md:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
                      {t("yourInfoPrivate")}
                    </p>
                    <Button
                      type="submit"
                      disabled={submitMutation.isPending}
                      className="w-full sm:w-auto px-8 h-11 text-sm font-medium rounded-lg bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white shadow-md hover:shadow-lg hover:brightness-105 transition-all border-0 disabled:opacity-60"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {submitMutation.isPending ? "..." : t("submit")}
                    </Button>
                  </div>
                )}
              </form>
            </Form>
          </motion.div>
        </div>
      </section>

      {/* Confirmation */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md text-center p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-[#00AFE6] to-[#00DD89] flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-2xl font-serif text-slate-900 dark:text-slate-100">
              {t("confirmTitle")}
            </DialogTitle>
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
  );
}
