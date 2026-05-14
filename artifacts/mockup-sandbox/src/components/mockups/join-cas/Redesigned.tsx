import './_group.css';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stethoscope, CheckCircle2, Send } from "lucide-react";
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
  "h-11 bg-white border border-slate-200 rounded-lg focus-visible:ring-2 focus-visible:ring-[#00AFE6]/30 focus-visible:border-[#00AFE6] transition-colors";
const FIELD_INPUT_READONLY =
  "h-11 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 cursor-not-allowed";
const FIELD_LABEL = "text-sm font-medium text-slate-800";

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
  const idleClass = "bg-white text-slate-600 border-slate-200 hover:border-slate-300";
  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 gap-1">
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
              className="w-[--radix-popover-trigger-width] p-0 z-[100] bg-white border border-slate-200 shadow-lg"
              align="start"
              sideOffset={4}
              collisionPadding={12}
            >
              <Command>
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
              className="w-[--radix-popover-trigger-width] p-0 z-[100] bg-white border border-slate-200 shadow-lg"
              align="start"
              sideOffset={4}
              collisionPadding={12}
            >
              <Command shouldFilter={true}>
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
            <SelectContent className="z-[100] max-h-[240px] bg-white border border-slate-200 shadow-lg" position="popper" sideOffset={4}>
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
    <section className="space-y-5">
      {title && <h2 className="text-xs uppercase tracking-wider font-semibold text-slate-500">{title}</h2>}
      <div className="space-y-5">{children}</div>
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
        <div className={FIELD_LABEL}>{label}</div>
        {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
      </div>
      <div className="flex-shrink-0 pt-0.5">{children}</div>
    </div>
  );
}

/* ---------- main ---------- */

export function Redesigned() {
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
    <div className="min-h-screen w-full bg-slate-100 text-slate-900 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-600 shadow-sm mb-4">
            <Stethoscope className="w-3.5 h-3.5 text-[#00AFE6]" />
            Professional Membership Application
          </div>
          <h1 className="text-4xl font-serif font-bold tracking-tight leading-tight">
            Join{" "}
            <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
              CAS &amp; CANN
            </span>
          </h1>
          <p className="text-sm text-slate-600 mt-3 max-w-md mx-auto">
            Become part of Canada's premier professional network for amyloidosis care.
          </p>
        </div>

        {/* Unified form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="px-8 sm:px-10 pt-8 pb-2">
              <h3 className="text-lg font-serif font-semibold text-slate-900">Registration Form</h3>
              <p className="text-sm text-slate-500 mt-0.5">
                Complete the form below to join our professional community.
              </p>
            </div>

            <div className="px-8 sm:px-10 pb-8 sm:pb-10 pt-6 space-y-10 divide-y divide-slate-100 [&>*:not(:first-child)]:pt-10">
              {/* Membership */}
              <Section title="Membership">
                <FormField
                  control={form.control}
                  name="wantsMembership"
                  render={({ field }) => (
                    <FormItem>
                      <QuestionRow label="1. I would like to become a member of the Canadian Amyloidosis Society (CAS).">
                        <YesNo value={field.value as any} onChange={field.onChange} accent="cas" />
                      </QuestionRow>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <div className="h-px bg-slate-100" />

                <FormField
                  control={form.control}
                  name="wantsCANNMembership"
                  render={({ field }) => (
                    <FormItem>
                      <QuestionRow
                        label="2. I would like to become a member of the Canadian Amyloidosis Nursing Network (CANN)."
                        description="All CANN members will also be members of the CAS."
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
                <Section title="Your Information">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <TextField name="firstName" label="First Name" placeholder="Jane" form={form} required inputFilter={ALPHA_FILTER} filterWarning="Numbers and symbols are not allowed in this field." />
                    <TextField name="lastName" label="Last Name" placeholder="Doe" form={form} required inputFilter={ALPHA_FILTER} filterWarning="Numbers and symbols are not allowed in this field." />
                    <TextField
                      name="primaryEmail"
                      label="Primary Email Address"
                      type="email"
                      placeholder="jane@hospital.ca"
                      form={form}
                      required
                    />
                    <TextField
                      name="secondaryEmail"
                      label="Secondary Email Address"
                      type="email"
                      placeholder="jane.doe@gmail.com (optional)"
                      form={form}
                    />
                    <TextField
                      name="discipline"
                      label="Professional Designation"
                      description="e.g. physician, nurse, genetic counsellor, other"
                      placeholder="Enter your professional designation"
                      form={form}
                      required
                      inputFilter={ALPHA_FILTER}
                      filterWarning="Numbers and symbols are not allowed in this field."
                    />
                    <TextField
                      name="subspecialty"
                      label="Sub-specialty Area of Focus"
                      description="e.g., Cardiology, Hematology, Neurology"
                      placeholder="Enter your sub-specialty"
                      form={form}
                      required
                      inputFilter={ALPHA_FILTER}
                      filterWarning="Numbers and symbols are not allowed in this field."
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="amyloidosisType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={FIELD_LABEL}>
                          In my practice, I primarily care for patients with the following type(s) of amyloidosis:
                          <span className="text-[#00AFE6]"> *</span>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-wrap gap-2 mt-3"
                          >
                            {["ATTR", "AL", "Both ATTR and AL", "Other"].map((type) => (
                              <Label
                                key={type}
                                className={`flex-1 min-w-[120px] flex items-center justify-center h-11 px-4 rounded-lg border cursor-pointer text-sm font-medium whitespace-nowrap transition-all ${
                                  field.value === type
                                    ? "border-[#00AFE6] bg-[#00AFE6]/5 text-[#00AFE6]"
                                    : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                                }`}
                              >
                                <RadioGroupItem value={type} className="sr-only" />
                                {type}
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
                    label="Clinic or Centre Name / Institution"
                    placeholder="Enter your institution name"
                    form={form}
                    required
                  />
                </Section>
              )}

              {/* Services Map */}
              {isMember && (
                <Section title="Services Map">
                  <FormField
                    control={form.control}
                    name="wantsServicesMapInclusion"
                    render={({ field }) => (
                      <FormItem>
                        <QuestionRow
                          label="Would you like your centre/clinic included in the Canadian Amyloidosis Services Map?"
                          description="Helps patients across Canada find specialised care near them."
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
                        label="Street Name"
                        placeholder="123 Hospital Street"
                        form={form}
                        required
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <TextField
                          name="postalCode"
                          label="Postal Code"
                          placeholder="M5G 2C4"
                          form={form}
                          required
                          inputFilter={POSTAL_FILTER}
                          maxLength={7}
                          filterWarning="Only letters and numbers (Canadian postal format)."
                        />
                        <div className="hidden sm:block" />
                        <ProvinceCombobox form={form} mismatch={provinceMismatch} />
                        <CityCombobox form={form} selectedProvince={provinceValue} mismatch={cityMismatch} />
                        <PhonePair
                          form={form}
                          codeName="phoneCode"
                          numberName="phoneNumber"
                          label="Phone"
                          placeholder="555-1234"
                          required
                        />
                        <PhonePair
                          form={form}
                          codeName="faxCode"
                          numberName="faxNumber"
                          label="Fax"
                          placeholder="555-5678"
                        />
                      </div>
                    </div>
                  )}
                </Section>
              )}

              {/* Communications */}
              {isMember && (
                <Section title="Communications">
                  <FormField
                    control={form.control}
                    name="wantsCommunications"
                    render={({ field }) => (
                      <FormItem>
                        <QuestionRow label="I would like to receive communication from the Canadian Amyloidosis Society (CAS): *">
                          <YesNo value={field.value as any} onChange={field.onChange} accent="cas" />
                        </QuestionRow>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {wantsCANNMembership === "Yes" && (
                    <>
                      <div className="h-px bg-slate-100" />
                      <FormField
                        control={form.control}
                        name="cannCommunications"
                        render={({ field }) => (
                          <FormItem>
                            <QuestionRow label="I would like to receive communication from the Canadian Amyloidosis Nursing Network (CANN): *">
                              <YesNo value={field.value as any} onChange={field.onChange} accent="cann" />
                            </QuestionRow>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </Section>
              )}

              {/* Non-member */}
              {declinedBoth && (
                <Section title="Non-member Contact">
                  <TextField name="noMemberName" label="Name" placeholder="Enter your name" form={form} required />
                  <TextField
                    name="noMemberEmail"
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    form={form}
                    required
                  />
                  <FormField
                    control={form.control}
                    name="noMemberMessage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={FIELD_LABEL}>Message / Reason for Contact</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Please share why you're reaching out"
                            className="min-h-[110px] bg-white border-slate-200 rounded-lg focus-visible:ring-2 focus-visible:ring-[#00AFE6]/30 focus-visible:border-[#00AFE6]"
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
              <div className="bg-slate-50 border-t border-slate-100 px-8 sm:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-500 text-center sm:text-left">
                  Your information is kept private and never shared.
                </p>
                <Button
                  type="submit"
                  className="px-8 h-11 text-sm font-semibold rounded-lg bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white shadow-md hover:shadow-lg hover:brightness-105 transition-all border-0"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Registration Form
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>

      {/* Confirmation */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md text-center p-8 rounded-3xl">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-[#00AFE6] to-[#00DD89] flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-2xl font-serif">Membership Registration Submitted!</DialogTitle>
            <DialogDescription className="text-base">
              We've received your form submission and we will be in touch soon with membership details.
              <span className="block mt-3 px-3 py-1 bg-slate-100 rounded-md text-xs font-mono inline-block">
                Reference ID: {submissionId}
              </span>
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => setShowConfirmation(false)}
            className="mt-4 rounded-full px-8 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white border-0"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
