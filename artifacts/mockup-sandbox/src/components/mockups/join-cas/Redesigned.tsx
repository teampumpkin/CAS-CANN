import './_group.css';
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserPlus,
  CheckCircle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Users,
  Heart,
  Mail,
  Sparkles,
  MapPin,
  Building2,
  Stethoscope,
  Network
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
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
import { cn } from "@/lib/utils";
import { casRegistrationSchema, type CASRegistrationForm } from "./schema";

const STEPS = [
  { id: "membership", title: "Membership" },
  { id: "profile", title: "Profile Info" },
  { id: "preferences", title: "Preferences" },
];

export function Redesigned() {
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

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

  const { watch, trigger } = form;
  const wantsMembership = watch("wantsMembership");
  const wantsCANNMembership = watch("wantsCANNMembership");
  const wantsServicesMapInclusion = watch("wantsServicesMapInclusion");

  const isMember = wantsMembership === "Yes" || wantsCANNMembership === "Yes";
  const isDeclinedBoth = wantsMembership === "No" && wantsCANNMembership === "No";

  // Dynamic steps based on first selection
  const activeSteps = isDeclinedBoth
    ? [{ id: "membership", title: "Membership" }, { id: "contact", title: "Contact Us" }]
    : STEPS;

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    
    if (currentStep === 0) {
      fieldsToValidate = ['wantsMembership', 'wantsCANNMembership'];
    } else if (currentStep === 1 && isMember) {
      fieldsToValidate = ['fullName', 'email', 'discipline', 'subspecialty', 'amyloidosisType', 'institution'];
    }
    
    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid) {
      setCurrentStep(s => Math.min(s + 1, activeSteps.length - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep(s => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (data: CASRegistrationForm) => {
    setIsSubmitting(true);
    console.log("[Mockup] CAS Registration submission:", data);
    await new Promise((r) => setTimeout(r, 600));
    setSubmissionId("CAS-" + Math.random().toString(36).slice(2, 10).toUpperCase());
    setShowConfirmationModal(true);
    form.reset();
    setCurrentStep(0);
    setIsSubmitting(false);
  };

  // Custom Selection Card component for Yes/No
  const SelectionCard = ({ 
    field, 
    value, 
    icon: Icon, 
    title, 
    description,
    brand = "default" 
  }: any) => {
    const isSelected = field.value === value;
    
    return (
      <Label
        htmlFor={`${field.name}-${value}`}
        className={cn(
          "relative flex flex-col items-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 text-center gap-3",
          isSelected 
            ? brand === 'cann' 
              ? "border-pink-500 bg-pink-50/50 dark:bg-pink-950/20" 
              : "border-[#00AFE6] bg-[#00AFE6]/5 dark:bg-[#00AFE6]/10"
            : "border-muted hover:border-muted-foreground/30 hover:bg-muted/50",
        )}
      >
        <FormControl>
          <RadioGroupItem value={value} id={`${field.name}-${value}`} className="sr-only" />
        </FormControl>
        
        <div className={cn(
          "p-3 rounded-full transition-colors",
          isSelected 
            ? brand === 'cann' ? "bg-pink-100 text-pink-600 dark:bg-pink-900/50" : "bg-[#00AFE6]/10 text-[#00AFE6]"
            : "bg-muted text-muted-foreground"
        )}>
          <Icon className="w-6 h-6" />
        </div>
        
        <div>
          <div className="font-semibold text-lg">{title}</div>
          {description && <div className="text-sm text-muted-foreground mt-1 font-normal">{description}</div>}
        </div>

        {isSelected && (
          <div className="absolute top-4 right-4">
            <CheckCircle2 className={cn(
              "w-5 h-5",
              brand === 'cann' ? "text-pink-500" : "text-[#00AFE6]"
            )} />
          </div>
        )}
      </Label>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-[#00AFE6]/20">
      {/* Refined Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00AFE6] to-[#00DD89] flex items-center justify-center">
              <Network className="w-4 h-4 text-white" />
            </div>
            <span className="font-rosarivo text-xl font-bold tracking-tight">CAS &amp; CANN</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-12 pb-32">
        <div className="max-w-3xl mx-auto">
          
          {/* Wizard Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-rosarivo font-bold mb-4 tracking-tight">
              Registration
            </h1>
            
            {/* Progress Stepper */}
            <div className="mt-8">
              <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-muted/60" />
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-[#00AFE6] to-[#00DD89] transition-all duration-500"
                  style={{ width: `${(currentStep / (activeSteps.length - 1)) * 100}%` }}
                />
                
                {activeSteps.map((step, index) => {
                  const isActive = index === currentStep;
                  const isCompleted = index < currentStep;
                  
                  return (
                    <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ring-4 ring-background",
                        isActive ? "bg-[#00AFE6] text-white shadow-md shadow-[#00AFE6]/20 scale-110" : 
                        isCompleted ? "bg-[#00DD89] text-white" : 
                        "bg-muted text-muted-foreground"
                      )}>
                        {isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                      </div>
                      <span className={cn(
                        "text-xs font-medium absolute -bottom-6 w-max text-center transition-colors",
                        isActive ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Form Content */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentStep}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 20 }}
                  animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="space-y-10"
                >
                  
                  {/* STEP 1: MEMBERSHIP */}
                  {currentStep === 0 && (
                    <div className="space-y-12">
                      <div className="space-y-2">
                        <h2 className="text-2xl font-rosarivo font-semibold">Community Selection</h2>
                        <p className="text-muted-foreground">Select the organizations you would like to join.</p>
                      </div>

                      <FormField
                        control={form.control}
                        name="wantsMembership"
                        render={({ field }) => (
                          <FormItem className="space-y-4">
                            <FormLabel className="text-base font-semibold flex items-center gap-2">
                              Canadian Amyloidosis Society (CAS)
                            </FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                              >
                                <SelectionCard 
                                  field={field} 
                                  value="Yes" 
                                  icon={CheckCircle2} 
                                  title="Yes, join CAS" 
                                />
                                <SelectionCard 
                                  field={field} 
                                  value="No" 
                                  icon={ChevronRight} 
                                  title="No, thank you" 
                                />
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="w-full h-px bg-border/40" />

                      <FormField
                        control={form.control}
                        name="wantsCANNMembership"
                        render={({ field }) => (
                          <FormItem className="space-y-4">
                            <div className="space-y-1">
                              <FormLabel className="text-base font-semibold flex items-center gap-2">
                                Canadian Amyloidosis Nursing Network (CANN)
                              </FormLabel>
                              <FormDescription>
                                All CANN members are automatically members of CAS.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                              >
                                <SelectionCard 
                                  field={field} 
                                  value="Yes" 
                                  icon={Heart} 
                                  title="Yes, join CANN" 
                                  brand="cann"
                                />
                                <SelectionCard 
                                  field={field} 
                                  value="No" 
                                  icon={ChevronRight} 
                                  title="No, thank you" 
                                />
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* STEP 2: PROFILE (If Member) */}
                  {currentStep === 1 && isMember && (
                    <div className="space-y-8">
                      <div className="space-y-2">
                        <h2 className="text-2xl font-rosarivo font-semibold">Professional Profile</h2>
                        <p className="text-muted-foreground">Tell us about your practice and expertise.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input className="h-12 bg-muted/30" placeholder="Dr. Jane Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input className="h-12 bg-muted/30" type="email" placeholder="jane@hospital.ca" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="discipline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Professional Designation</FormLabel>
                              <FormControl>
                                <Input className="h-12 bg-muted/30" placeholder="e.g. Physician, Nurse" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="subspecialty"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sub-specialty</FormLabel>
                              <FormControl>
                                <Input className="h-12 bg-muted/30" placeholder="e.g. Cardiology" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="institution"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Institution / Clinic Name</FormLabel>
                              <FormControl>
                                <Input className="h-12 bg-muted/30" placeholder="General Hospital" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="pt-4">
                        <FormField
                          control={form.control}
                          name="amyloidosisType"
                          render={({ field }) => (
                            <FormItem className="space-y-4">
                              <FormLabel className="text-base font-semibold">
                                Primary Patient Care Type
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                                >
                                  {["ATTR", "AL", "Both ATTR and AL", "Other"].map((type) => (
                                    <Label
                                      key={type}
                                      className={cn(
                                        "flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors",
                                        field.value === type 
                                          ? "border-[#00AFE6] bg-[#00AFE6]/5" 
                                          : "hover:bg-muted/50 border-border"
                                      )}
                                    >
                                      <FormControl>
                                        <RadioGroupItem value={type} />
                                      </FormControl>
                                      <span className="font-medium">{type}</span>
                                    </Label>
                                  ))}
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 2 (Alt): NON-MEMBER CONTACT */}
                  {currentStep === 1 && isDeclinedBoth && (
                    <div className="space-y-8">
                      <div className="space-y-2">
                        <h2 className="text-2xl font-rosarivo font-semibold">Stay in Touch</h2>
                        <p className="text-muted-foreground">You opted not to join at this time, but we'd love to hear from you.</p>
                      </div>

                      <div className="p-6 bg-muted/30 rounded-2xl border border-border/50 space-y-6">
                        <FormField
                          control={form.control}
                          name="noMemberName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input className="h-12 bg-background" placeholder="Your name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="noMemberEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input className="h-12 bg-background" type="email" placeholder="Your email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="noMemberMessage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message (Optional)</FormLabel>
                              <FormControl>
                                <Textarea className="min-h-[120px] bg-background resize-y" placeholder="How can we help?" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 3: PREFERENCES & MAP (If Member) */}
                  {currentStep === 2 && isMember && (
                    <div className="space-y-12">
                      <div className="space-y-2">
                        <h2 className="text-2xl font-rosarivo font-semibold">Services Map & Communications</h2>
                        <p className="text-muted-foreground">Help patients find care and stay updated.</p>
                      </div>

                      <FormField
                        control={form.control}
                        name="wantsServicesMapInclusion"
                        render={({ field }) => (
                          <FormItem className="space-y-4">
                            <FormLabel className="text-base font-semibold">
                              Include your centre in the Canadian Amyloidosis Services Map?
                            </FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                              >
                                <SelectionCard field={field} value="Yes" icon={MapPin} title="Yes, include my centre" />
                                <SelectionCard field={field} value="No" icon={ChevronRight} title="No, thank you" />
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <AnimatePresence>
                        {wantsServicesMapInclusion === "Yes" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, y: -20 }}
                            animate={{ opacity: 1, height: "auto", y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -20 }}
                            className="overflow-hidden"
                          >
                            <div className="p-6 bg-[#00AFE6]/5 border border-[#00AFE6]/20 rounded-2xl grid gap-6 md:grid-cols-2 mt-4">
                              <FormField control={form.control} name="centerName" render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                  <FormLabel>Centre Name</FormLabel>
                                  <FormControl><Input className="bg-background h-11" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )} />
                              <FormField control={form.control} name="centerAddress" render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                  <FormLabel>Address</FormLabel>
                                  <FormControl><Input className="bg-background h-11" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )} />
                              <FormField control={form.control} name="centerPhone" render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone</FormLabel>
                                  <FormControl><Input className="bg-background h-11" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )} />
                              <FormField control={form.control} name="centerFax" render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Fax</FormLabel>
                                  <FormControl><Input className="bg-background h-11" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )} />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="w-full h-px bg-border/40" />

                      <FormField
                        control={form.control}
                        name="wantsCommunications"
                        render={({ field }) => (
                          <FormItem className="space-y-4">
                            <FormLabel className="text-base font-semibold">
                              Receive communications from CAS?
                            </FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                              >
                                <Label className={cn("flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors", field.value === "Yes" ? "border-[#00AFE6] bg-[#00AFE6]/5" : "hover:bg-muted/50")}>
                                  <FormControl><RadioGroupItem value="Yes" /></FormControl>
                                  <span className="font-medium">Yes, keep me updated</span>
                                </Label>
                                <Label className={cn("flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors", field.value === "No" ? "border-[#00AFE6] bg-[#00AFE6]/5" : "hover:bg-muted/50")}>
                                  <FormControl><RadioGroupItem value="No" /></FormControl>
                                  <span className="font-medium">No</span>
                                </Label>
                              </RadioGroup>
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
                            <FormItem className="space-y-4">
                              <FormLabel className="text-base font-semibold">
                                Receive communications from CANN?
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                                >
                                  <Label className={cn("flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors", field.value === "Yes" ? "border-pink-500 bg-pink-50/50 dark:bg-pink-950/20" : "hover:bg-muted/50")}>
                                    <FormControl><RadioGroupItem value="Yes" /></FormControl>
                                    <span className="font-medium">Yes, keep me updated</span>
                                  </Label>
                                  <Label className={cn("flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors", field.value === "No" ? "border-pink-500 bg-pink-50/50 dark:bg-pink-950/20" : "hover:bg-muted/50")}>
                                    <FormControl><RadioGroupItem value="No" /></FormControl>
                                    <span className="font-medium">No</span>
                                  </Label>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>

              {/* Navigation Controls */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t z-40">
                <div className="container mx-auto px-4 sm:px-6 max-w-3xl flex justify-between items-center gap-4">
                  {currentStep > 0 ? (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="lg"
                      onClick={prevStep}
                      className="rounded-full px-6"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  ) : (
                    <div /> // spacer
                  )}

                  {currentStep < activeSteps.length - 1 ? (
                    <Button 
                      type="button" 
                      size="lg"
                      onClick={nextStep}
                      className="rounded-full px-8 bg-foreground hover:bg-foreground/90 text-background"
                    >
                      Continue
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      size="lg"
                      disabled={isSubmitting}
                      className="rounded-full px-8 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:opacity-90 text-white font-medium border-0"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Registration"}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>

        </div>
      </main>

      <Dialog open={showConfirmationModal} onOpenChange={setShowConfirmationModal}>
        <DialogContent className="sm:max-w-md text-center p-8 rounded-3xl">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <DialogTitle className="text-2xl font-rosarivo mb-2">Thank you!</DialogTitle>
            <DialogDescription className="text-base text-center">
              Your submission has been received successfully.
              <br/><br/>
              <span className="inline-block px-3 py-1 bg-muted rounded-md text-xs font-mono mt-2">
                Reference: {submissionId}
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex justify-center">
            <Button onClick={() => setShowConfirmationModal(false)} className="rounded-full px-8">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
