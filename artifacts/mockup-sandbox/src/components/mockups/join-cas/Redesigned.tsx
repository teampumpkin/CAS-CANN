import './_group.css';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sparkles,
  Heart,
  MapPin,
  Mail,
  CheckCircle2,
  Send,
  ArrowRight,
  Stethoscope,
  Building2,
  Shield,
  ChevronRight,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { casRegistrationSchema, type CASRegistrationForm } from "./schema";

type ChoiceCardProps = {
  selected: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  brand?: "cas" | "cann" | "neutral";
};

function ChoiceCard({ selected, onClick, icon: Icon, title, description, brand = "cas" }: ChoiceCardProps) {
  const ringClass =
    brand === "cann"
      ? "from-pink-500 to-purple-600"
      : brand === "neutral"
      ? "from-slate-400 to-slate-500"
      : "from-[#00AFE6] to-[#00DD89]";
  const iconBg = selected
    ? `bg-gradient-to-tr ${ringClass} text-white`
    : "bg-slate-100 text-slate-500";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative w-full text-left rounded-2xl p-6 transition-all duration-200 border-2 ${
        selected
          ? brand === "cann"
            ? "border-pink-500 bg-pink-50/60 shadow-lg shadow-pink-500/10"
            : "border-[#00AFE6] bg-[#00AFE6]/5 shadow-lg shadow-[#00AFE6]/10"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
      }`}
    >
      {selected && (
        <div
          className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center text-white bg-gradient-to-tr ${ringClass}`}
        >
          <CheckCircle2 className="w-4 h-4" />
        </div>
      )}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${iconBg}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="font-semibold text-base text-slate-900 mb-1">{title}</div>
      <div className="text-sm text-slate-500 leading-relaxed">{description}</div>
    </button>
  );
}

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
    <div className="min-h-screen w-full bg-slate-50 text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white border-b border-slate-100">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00AFE6]/5 via-white to-[#00DD89]/5 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-6 pt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-600 shadow-sm mb-6">
            <Stethoscope className="w-3.5 h-3.5 text-[#00AFE6]" />
            Professional Membership Application
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight leading-tight mb-4">
            Join{" "}
            <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
              CAS &amp; CANN
            </span>
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
            Canada's professional community for amyloidosis care. Membership is free, never shared, and open to all
            allied health professionals.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#00AFE6]" /> Patient-focused
            </span>
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#00DD89]" /> Privacy-first
            </span>
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" /> Evidence-based
            </span>
          </div>
        </div>
      </section>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-3xl mx-auto px-6 py-12 space-y-14">
          {/* SECTION 1 — Community */}
          <section className="space-y-6">
            <SectionHeader number="1" title="Choose your community" subtitle="Select one or both — they're complementary." />
            <FormField
              control={form.control}
              name="wantsMembership"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-slate-700 mb-3 block">
                    Canadian Amyloidosis Society (CAS)
                  </FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <ChoiceCard
                        selected={field.value === "Yes"}
                        onClick={() => field.onChange("Yes")}
                        icon={Sparkles}
                        title="Yes, join CAS"
                        description="Access exclusive resources, events & community"
                        brand="cas"
                      />
                      <ChoiceCard
                        selected={field.value === "No"}
                        onClick={() => field.onChange("No")}
                        icon={ChevronRight}
                        title="No, thank you"
                        description="Continue without joining CAS"
                        brand="neutral"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="wantsCANNMembership"
              render={({ field }) => (
                <FormItem className="pt-2">
                  <FormLabel className="text-sm font-semibold text-slate-700 mb-1 block">
                    Canadian Amyloidosis Nursing Network (CANN)
                  </FormLabel>
                  <p className="text-xs text-slate-500 mb-3">All CANN members are automatically CAS members.</p>
                  <FormControl>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <ChoiceCard
                        selected={field.value === "Yes"}
                        onClick={() => field.onChange("Yes")}
                        icon={Heart}
                        title="Yes, join CANN"
                        description="Connect with nursing peers across Canada"
                        brand="cann"
                      />
                      <ChoiceCard
                        selected={field.value === "No"}
                        onClick={() => field.onChange("No")}
                        icon={ChevronRight}
                        title="No, thank you"
                        description="Continue without joining CANN"
                        brand="neutral"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          {/* SECTION 2 — Member profile */}
          {isMember && (
            <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <SectionHeader number="2" title="Your professional profile" subtitle="So we can serve you better." />
              <div className="bg-white rounded-2xl border border-slate-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                <TextField name="fullName" label="Full Name *" placeholder="Dr. Jane Doe" form={form} />
                <TextField name="email" label="Email *" type="email" placeholder="jane@hospital.ca" form={form} />
                <TextField
                  name="discipline"
                  label="Professional Designation *"
                  placeholder="e.g. Physician, Nurse, Genetic Counsellor"
                  form={form}
                />
                <TextField name="subspecialty" label="Sub-specialty Area *" placeholder="e.g. Cardiology, Hematology" form={form} />
                <div className="md:col-span-2">
                  <TextField name="institution" label="Centre / Clinic / Institution *" placeholder="General Hospital" form={form} />
                </div>
              </div>

              <FormField
                control={form.control}
                name="amyloidosisType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-700 mb-3 block">
                      Primary patient care type *
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="grid grid-cols-2 md:grid-cols-4 gap-3"
                      >
                        {["ATTR", "AL", "Both ATTR and AL", "Other"].map((type) => (
                          <Label
                            key={type}
                            className={`flex items-center justify-center px-4 py-3 rounded-xl border-2 cursor-pointer text-sm font-medium transition-all ${
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
          )}

          {/* SECTION 3 — Map inclusion */}
          {isMember && (
            <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <SectionHeader number="3" title="Services map inclusion" subtitle="Help patients find care near them." />
              <FormField
                control={form.control}
                name="wantsServicesMapInclusion"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <ChoiceCard
                          selected={field.value === "Yes"}
                          onClick={() => field.onChange("Yes")}
                          icon={MapPin}
                          title="Yes, include my centre"
                          description="Listed on the Canadian Amyloidosis Services Map"
                          brand="cas"
                        />
                        <ChoiceCard
                          selected={field.value === "No"}
                          onClick={() => field.onChange("No")}
                          icon={ChevronRight}
                          title="No, thank you"
                          description="Keep my centre off the public map"
                          brand="neutral"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {wantsServicesMapInclusion === "Yes" && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="md:col-span-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Building2 className="w-4 h-4 text-[#00AFE6]" />
                    Public-facing centre details
                  </div>
                  <div className="md:col-span-2">
                    <TextField name="centerName" label="Centre Name" placeholder="Amyloidosis Clinic" form={form} />
                  </div>
                  <div className="md:col-span-2">
                    <TextField name="centerAddress" label="Address" placeholder="123 Hospital St, City, Province" form={form} />
                  </div>
                  <TextField name="centerPhone" label="Phone" placeholder="(555) 555-1234" form={form} />
                  <TextField name="centerFax" label="Fax (Optional)" placeholder="(555) 555-5678" form={form} />
                </div>
              )}
            </section>
          )}

          {/* SECTION 4 — Communications */}
          {isMember && (
            <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <SectionHeader number="4" title="Stay in the loop" subtitle="Optional email updates." />
              <FormField
                control={form.control}
                name="wantsCommunications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-700 mb-3 block">
                      CAS communications
                    </FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <ChoiceCard
                          selected={field.value === "Yes"}
                          onClick={() => field.onChange("Yes")}
                          icon={Mail}
                          title="Yes, keep me updated"
                          description="Newsletter, events & research highlights"
                          brand="cas"
                        />
                        <ChoiceCard
                          selected={field.value === "No"}
                          onClick={() => field.onChange("No")}
                          icon={ChevronRight}
                          title="No, thanks"
                          description="No CAS email updates"
                          brand="neutral"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {wantsCANNMembership === "Yes" && (
                <FormField
                  control={form.control}
                  name="cannCommunications"
                  render={({ field }) => (
                    <FormItem className="pt-2">
                      <FormLabel className="text-sm font-semibold text-slate-700 mb-3 block">
                        CANN communications
                      </FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <ChoiceCard
                            selected={field.value === "Yes"}
                            onClick={() => field.onChange("Yes")}
                            icon={Mail}
                            title="Yes, keep me updated"
                            description="Nursing-specific events & resources"
                            brand="cann"
                          />
                          <ChoiceCard
                            selected={field.value === "No"}
                            onClick={() => field.onChange("No")}
                            icon={ChevronRight}
                            title="No, thanks"
                            description="No CANN email updates"
                            brand="neutral"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </section>
          )}

          {/* SECTION — Non-member contact */}
          {declinedBoth && (
            <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <SectionHeader number="2" title="We'd still love to hear from you" subtitle="Drop us a note — no strings attached." />
              <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-6 space-y-5">
                <TextField name="noMemberName" label="Your Name" placeholder="Jane Doe" form={form} />
                <TextField name="noMemberEmail" label="Email" type="email" placeholder="jane@email.com" form={form} />
                <FormField
                  control={form.control}
                  name="noMemberMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-700">Message (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="How can we help?"
                          className="min-h-[120px] bg-white border-slate-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>
          )}

          {/* Submit */}
          {(isMember || declinedBoth) && (
            <div className="pt-4 flex flex-col items-center gap-3 animate-in fade-in duration-500">
              <Button
                type="submit"
                className="w-full sm:w-auto px-12 py-6 text-base font-semibold rounded-full bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white shadow-lg shadow-[#00AFE6]/30 hover:shadow-xl hover:scale-[1.02] transition-all border-0"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Registration
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <p className="text-xs text-slate-500">By submitting you agree to our privacy policy. Your data is never shared.</p>
            </div>
          )}
        </form>
      </Form>

      {/* Confirmation */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md text-center p-8 rounded-3xl">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-[#00AFE6] to-[#00DD89] flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-2xl font-serif">Thank you!</DialogTitle>
            <DialogDescription className="text-base">
              Your submission has been received.
              <span className="block mt-3 px-3 py-1 bg-slate-100 rounded-md text-xs font-mono inline-block">
                Reference: {submissionId}
              </span>
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => setShowConfirmation(false)}
            className="mt-4 rounded-full px-8 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white border-0"
          >
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SectionHeader({ number, title, subtitle }: { number: string; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-tr from-[#00AFE6] to-[#00DD89] text-white flex items-center justify-center text-sm font-bold">
        {number}
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-900 leading-tight">{title}</h2>
        <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

function TextField({
  name,
  label,
  placeholder,
  type = "text",
  form,
}: {
  name: any;
  label: string;
  placeholder?: string;
  type?: string;
  form: any;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }: any) => (
        <FormItem>
          <FormLabel className="text-sm font-semibold text-slate-700">{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              className="h-11 bg-white border-slate-200 focus-visible:ring-[#00AFE6]/30 focus-visible:border-[#00AFE6]"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
