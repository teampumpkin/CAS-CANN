import './_group.css';
import { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { casRegistrationSchema, type CASRegistrationForm } from "./schema";

/* ---------- shared atoms (uniform styling) ---------- */

const FIELD_INPUT =
  "h-11 bg-white border-slate-200 rounded-lg focus-visible:ring-2 focus-visible:ring-[#00AFE6]/30 focus-visible:border-[#00AFE6] transition-colors";
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
}: {
  name: any;
  label: string;
  placeholder?: string;
  description?: string;
  type?: string;
  form: any;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }: any) => (
        <FormItem>
          <FormLabel className={FIELD_LABEL}>{label}</FormLabel>
          {description && <p className="text-xs text-slate-500 -mt-1">{description}</p>}
          <FormControl>
            <Input {...field} type={type} placeholder={placeholder} className={FIELD_INPUT} />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5">
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h2 className="text-xs uppercase tracking-wider font-semibold text-slate-500">{title}</h2>
          )}
          {description && <p className="text-sm text-slate-600">{description}</p>}
        </div>
      )}
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

/* ---------- main component ---------- */

export function Redesigned() {
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const form = useForm<CASRegistrationForm>({
    resolver: zodResolver(casRegistrationSchema),
    mode: "onTouched",
    defaultValues: {
      wantsMembership: undefined,
      wantsCANNMembership: undefined,
      fullName: "",
      email: "",
      discipline: "",
      subspecialty: "",
      amyloidosisType: undefined,
      institution: "",
      wantsServicesMapInclusion: undefined,
      centerName: "",
      centerAddress: "",
      centerPhone: "",
      centerFax: "",
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
  const isMember = wantsMembership === "Yes" || wantsCANNMembership === "Yes";
  const declinedBoth = wantsMembership === "No" && wantsCANNMembership === "No";

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

        {/* Unified form card */}
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

              {/* Member profile */}
              {isMember && (
                <Section title="Your Information">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <TextField
                        name="fullName"
                        label="3. Full Name (First and Last) *"
                        placeholder="Enter your full name"
                        form={form}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <TextField
                        name="email"
                        label="4. Email Address *"
                        type="email"
                        placeholder="Enter your email address"
                        form={form}
                      />
                    </div>
                    <TextField
                      name="discipline"
                      label="5. Professional designation *"
                      description="e.g. physician, nurse, genetic counsellor, other"
                      placeholder="Enter your professional designation"
                      form={form}
                    />
                    <TextField
                      name="subspecialty"
                      label="6. Sub-specialty Area of Focus *"
                      description="e.g., Cardiology, Hematology, Neurology"
                      placeholder="Enter your sub-specialty"
                      form={form}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="amyloidosisType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={FIELD_LABEL}>
                          7. In my practice, I primarily care for patients with the following type(s) of amyloidosis: *
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
                    label="8. Centre or Clinic Name / Institution *"
                    placeholder="Enter your institution name"
                    form={form}
                  />
                </Section>
              )}

              {/* Services map */}
              {isMember && (
                <Section title="Services Map">
                  <FormField
                    control={form.control}
                    name="wantsServicesMapInclusion"
                    render={({ field }) => (
                      <FormItem>
                        <QuestionRow label="9. Would you like your centre/clinic included in the Canadian Amyloidosis Services Map?">
                          <YesNo value={field.value as any} onChange={field.onChange} accent="cas" />
                        </QuestionRow>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {wantsServicesMapInclusion === "Yes" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 animate-in fade-in slide-in-from-top-1 duration-300">
                      <div className="sm:col-span-2">
                        <TextField
                          name="centerName"
                          label="Center or Clinic Name"
                          placeholder="Enter your center or clinic name"
                          form={form}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <TextField
                          name="centerAddress"
                          label="Center or Clinic Address"
                          placeholder="Enter your center or clinic address"
                          form={form}
                        />
                      </div>
                      <TextField
                        name="centerPhone"
                        label="Center or Clinic Phone Number"
                        placeholder="Enter your center or clinic phone number"
                        form={form}
                      />
                      <TextField
                        name="centerFax"
                        label="Center or Clinic Fax Number"
                        placeholder="Enter your center or clinic fax number"
                        form={form}
                      />
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
                        <QuestionRow label="10. I would like to receive communication from the Canadian Amyloidosis Society (CAS): *">
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
                            <QuestionRow label="11. I would like to receive communication from the Canadian Amyloidosis Nursing Network (CANN): *">
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

              {/* Non-member contact */}
              {declinedBoth && (
                <Section title="Non-member Contact">
                  <TextField
                    name="noMemberName"
                    label="Name *"
                    placeholder="Enter your name"
                    form={form}
                  />
                  <TextField
                    name="noMemberEmail"
                    label="Email *"
                    type="email"
                    placeholder="Enter your email"
                    form={form}
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

            {/* Submit footer */}
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
