import './_group.css';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stethoscope, CheckCircle2, Send, MapPin } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { casRegistrationSchema, type CASRegistrationForm, lookupPostalCode } from "./schema";

/* ---------- shared atoms ---------- */

const FIELD_INPUT =
  "h-11 bg-white border-slate-200 rounded-lg focus-visible:ring-2 focus-visible:ring-[#00AFE6]/30 focus-visible:border-[#00AFE6] transition-colors";
const FIELD_INPUT_READONLY =
  "h-11 bg-slate-50 border-slate-200 rounded-lg text-slate-600 cursor-not-allowed";
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

function TextField({
  name,
  label,
  placeholder,
  description,
  type = "text",
  form,
  required,
  readOnly,
}: {
  name: any;
  label: string;
  placeholder?: string;
  description?: string;
  type?: string;
  form: any;
  required?: boolean;
  readOnly?: boolean;
}) {
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
              placeholder={placeholder}
              readOnly={readOnly}
              tabIndex={readOnly ? -1 : undefined}
              className={readOnly ? FIELD_INPUT_READONLY : FIELD_INPUT}
            />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
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
      phone: "",
      fax: "",
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
  const isMember = wantsMembership === "Yes" || wantsCANNMembership === "Yes";
  const declinedBoth = wantsMembership === "No" && wantsCANNMembership === "No";

  // Auto-fill city + province from postal code prefix (mockup demo)
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
                    <TextField name="firstName" label="First Name" placeholder="Jane" form={form} required />
                    <TextField name="lastName" label="Last Name" placeholder="Doe" form={form} required />
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
                    />
                    <TextField
                      name="subspecialty"
                      label="Sub-specialty Area of Focus"
                      description="e.g., Cardiology, Hematology, Neurology"
                      placeholder="Enter your sub-specialty"
                      form={form}
                      required
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
                    <div className="rounded-xl bg-slate-50/60 border border-slate-100 p-5 space-y-5 animate-in fade-in slide-in-from-top-1 duration-300">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-[#00AFE6]" />
                        Address
                      </div>

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
                        />
                        <div /> {/* spacer to keep grid alignment */}
                        <TextField
                          name="city"
                          label="City"
                          description="Auto-filled by postal code"
                          placeholder="—"
                          form={form}
                          readOnly
                        />
                        <TextField
                          name="province"
                          label="Province"
                          description="Auto-filled by postal code"
                          placeholder="—"
                          form={form}
                          readOnly
                        />
                        <TextField
                          name="phone"
                          label="Phone (with area code)"
                          placeholder="(416) 555-1234"
                          form={form}
                          required
                        />
                        <TextField
                          name="fax"
                          label="Fax (with area code)"
                          placeholder="(416) 555-5678"
                          form={form}
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
