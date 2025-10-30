import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserPlus,
  CheckCircle,
  Send,
  Users,
  Heart,
  Mail,
  Building2,
  Stethoscope,
  GraduationCap,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { casRegistrationSchema, type CASRegistrationForm } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const educationalInterestOptions = [
  "Mental health considerations for amyloidosis and heart failure patients",
  "Case presentations/discussion",
  "Understanding PYP in amyloidosis",
  "Genetic testing/counseling",
  "Program start-up and multi-disciplinary engagement",
  "Pathology and amyloidosis (mass spectrometry)",
  "Diet, exercise, and/or cardiac rehab considerations",
  "Multi-system involvement and clinical implications",
  "Patient support groups: awareness, initiation, and lessons learned",
  "Patient and Healthcare Professional Q&A - open forum",
  "A Day in the Life – short presentations from various clinics",
];

interface SubmissionResponse {
  submissionId: string;
  status: string;
  message: string;
}

export default function JoinCAS() {
  const { toast } = useToast();
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [submissionType, setSubmissionType] = useState<'cann' | 'cas' | 'contact' | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const form = useForm<CASRegistrationForm>({
    resolver: zodResolver(casRegistrationSchema),
    defaultValues: {
      wantsMembership: undefined,
      wantsCANNMembership: undefined,
      fullName: "",
      email: "",
      discipline: "",
      subspecialty: "",
      institution: "",
      wantsCommunications: undefined,
      wantsServicesMapInclusion: undefined,
      amyloidosisType: undefined,
      cannCommunications: undefined,
      educationalInterests: [],
      otherEducationalInterest: "",
      interestedInPresenting: undefined,
      noMemberName: "",
      noMemberEmail: "",
      noMemberMessage: "",
    },
  });

  // Watch form values for conditional rendering
  const wantsMembership = form.watch("wantsMembership");
  const wantsCANNMembership = form.watch("wantsCANNMembership");
  const educationalInterests = form.watch("educationalInterests") || [];
  
  // Check if user is a member (either CAS or CANN)
  const isMember = wantsMembership === "Yes" || wantsCANNMembership === "Yes";

  // Submit form mutation
  const submitMutation = useMutation({
    mutationFn: async (formData: CASRegistrationForm): Promise<SubmissionResponse> => {
      const isCANNMember = formData.wantsCANNMembership === "Yes";
      const formName = isCANNMember ? "CAS & CANN Registration" : "CAS Registration";
      
      const response = await apiRequest("POST", "/api/cas-cann-registration", {
        formData: formData,
        formName: formName,
      });
      return await response.json();
    },
    onSuccess: (data) => {
      setSubmissionId(data.submissionId);
      
      // Determine submission type
      const formValues = form.getValues();
      if (formValues.wantsCANNMembership === "Yes") {
        setSubmissionType('cann');
      } else if (formValues.wantsMembership === "Yes") {
        setSubmissionType('cas');
      } else {
        setSubmissionType('contact');
      }
      
      setShowConfirmationModal(true);
      const isCANNMember = formValues.wantsCANNMembership === "Yes";
      toast({
        title: "Registration Submitted Successfully!",
        description: isCANNMember 
          ? "Your CAS & CANN membership registration has been received."
          : "Your CAS membership registration has been received.",
      });
      form.reset();
    },
    onError: (error) => {
      console.error("Form submission error:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again or contact us directly.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: CASRegistrationForm) => {
    try {
      await submitMutation.mutateAsync(data);
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
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
                Professional Membership Application
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold font-rosarivo mb-6 text-gray-900 dark:text-white leading-tight">
              Join{" "}
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                CAS & CANN
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4 max-w-2xl mx-auto leading-relaxed">
              Become part of Canada's premier professional network for amyloidosis care and nursing excellence.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Heart className="w-4 h-4 text-[#00AFE6]" />
                <span>Patient-Focused</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4 text-[#00DD89]" />
                <span>Collaborative Network</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Sparkles className="w-4 h-4 text-[#00AFE6]" />
                <span>Evidence-Based</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16 -mt-12">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.3, duration: 0.6 }}
          >
            <Card className="shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/5" />
                <div className="relative z-10">
                  <CardTitle className="text-3xl font-bold mb-2">Registration Form</CardTitle>
                  <CardDescription className="text-white/90 text-base">
                    Complete the form below to join our professional community
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-8 md:p-12">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8 md:space-y-10">
                    
                    {/* Question 1: CAS Membership */}
                    <FormField
                      control={form.control}
                      name="wantsMembership"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">
                            1. I would like to become a member of the Canadian Amyloidosis Society (CAS).
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex gap-6"
                              data-testid="radio-cas-membership"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Yes" id="cas-yes" data-testid="radio-cas-yes" />
                                <Label htmlFor="cas-yes">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="No" id="cas-no" data-testid="radio-cas-no" />
                                <Label htmlFor="cas-no">No</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Question 2: CANN Membership */}
                    <FormField
                      control={form.control}
                      name="wantsCANNMembership"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">
                            2. I would like to become a member of the Canadian Amyloidosis Nursing Network (CANN).
                          </FormLabel>
                          <FormDescription>
                            All CANN members will also be members of the CAS.
                          </FormDescription>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex gap-6"
                              data-testid="radio-cann-membership"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Yes" id="cann-yes" data-testid="radio-cann-yes" />
                                <Label htmlFor="cann-yes">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="No" id="cann-no" data-testid="radio-cann-no" />
                                <Label htmlFor="cann-no">No</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator className="my-8" />

                    {/* Questions 3-9: Member Information (shown when either Q1 or Q2 = "Yes") */}
                    <AnimatePresence>
                      {isMember && (
                        <motion.div
                          initial={shouldReduceMotion ? {} : { opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={shouldReduceMotion ? {} : { opacity: 0 }}
                          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="bg-gradient-to-br from-[#E6F8FF] to-[#F0FBFF] dark:from-[#00AFE6]/10 dark:to-[#00AFE6]/5 p-4 sm:p-6 md:p-8 rounded-2xl border border-[#00AFE6]/20 space-y-4 sm:space-y-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00AFE6] to-[#00DD89] flex items-center justify-center shadow-md">
                                <Users className="w-5 h-5 text-white" />
                              </div>
                              <h3 className="text-2xl font-bold text-[#12465B] dark:text-white">
                                Registrant Information and CAS Questions
                              </h3>
                            </div>

                        {/* Question 3: Full Name */}
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>3. Full Name (First and Last) *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter your full name" 
                                  {...field} 
                                  data-testid="input-full-name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Question 4: Email */}
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>4. Email Address *</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="Enter your email address" 
                                  {...field} 
                                  data-testid="input-email"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Question 5: Discipline */}
                        <FormField
                          control={form.control}
                          name="discipline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>5. Discipline / Professional Designation or Nursing Role (If also registering for CANN membership) *</FormLabel>
                              <FormDescription>
                                e.g., Physician, Nurse Practitioner, Nurse Clinician, Educator, Researcher, Administrator
                              </FormDescription>
                              <FormControl>
                                <Input 
                                  placeholder="Enter your discipline" 
                                  {...field} 
                                  data-testid="input-discipline"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Question 6: Sub-specialty */}
                        <FormField
                          control={form.control}
                          name="subspecialty"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>6. Sub-specialty Area of Focus *</FormLabel>
                              <FormDescription>
                                e.g., Cardiology, Hematology, Neurology
                              </FormDescription>
                              <FormControl>
                                <Input 
                                  placeholder="Enter your sub-specialty" 
                                  {...field} 
                                  data-testid="input-subspecialty"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Question 7: Institution */}
                        <FormField
                          control={form.control}
                          name="institution"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>7. Centre or Clinic Name / Institution *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter your institution name" 
                                  {...field} 
                                  data-testid="input-institution"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Question 8: CAS Communications */}
                        <FormField
                          control={form.control}
                          name="wantsCommunications"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>8. Would you like to receive CAS emails/newsletters? *</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="flex gap-6"
                                  data-testid="radio-communications"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Yes" id="comm-yes" data-testid="radio-communications-yes" />
                                    <Label htmlFor="comm-yes">Yes</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="No" id="comm-no" data-testid="radio-communications-no" />
                                    <Label htmlFor="comm-no">No</Label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Question 9: Services Map */}
                        <FormField
                          control={form.control}
                          name="wantsServicesMapInclusion"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>9. Would you like your centre/clinic included in the Canadian Amyloidosis Services Map?</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="flex gap-6"
                                  data-testid="radio-services-map"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Yes" id="map-yes" data-testid="radio-services-map-yes" />
                                    <Label htmlFor="map-yes">Yes</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="No" id="map-no" data-testid="radio-services-map-no" />
                                    <Label htmlFor="map-no">No</Label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Separator className="my-8" />

                    {/* CANN Questions (shown only when Q2 = "Yes") */}
                    <AnimatePresence>
                      {wantsCANNMembership === "Yes" && (
                        <motion.div
                          initial={shouldReduceMotion ? {} : { opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={shouldReduceMotion ? {} : { opacity: 0 }}
                          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="bg-gradient-to-br from-[#E8FFF5] to-[#F0FFF9] dark:from-[#00DD89]/10 dark:to-[#00DD89]/5 p-4 sm:p-6 md:p-8 rounded-2xl border border-[#00DD89]/20 space-y-4 sm:space-y-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00DD89] to-[#00AFE6] flex items-center justify-center shadow-md">
                                <Stethoscope className="w-5 h-5 text-white" />
                              </div>
                              <h3 className="text-2xl font-bold text-[#045941] dark:text-white">
                                CANN Questions
                              </h3>
                            </div>

                        {/* Question 10: Amyloidosis Type */}
                        <FormField
                          control={form.control}
                          name="amyloidosisType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>10. In my nursing practice, I primarily care for patients with the following type of amyloidosis: *</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="space-y-3"
                                  data-testid="radio-amyloidosis-type"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="ATTR" id="type-attr" data-testid="radio-type-attr" />
                                    <Label htmlFor="type-attr">ATTR</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="AL" id="type-al" data-testid="radio-type-al" />
                                    <Label htmlFor="type-al">AL</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Both ATTR and AL" id="type-both" data-testid="radio-type-both" />
                                    <Label htmlFor="type-both">Both ATTR and AL</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Other" id="type-other" data-testid="radio-type-other" />
                                    <Label htmlFor="type-other">Other</Label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Question 11: CANN Communications */}
                        <FormField
                          control={form.control}
                          name="cannCommunications"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>11. I would like to receive communication from the Canadian Amyloidosis Nursing Network (CANN): *</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="flex gap-6"
                                  data-testid="radio-cann-communications"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Yes" id="cann-comm-yes" data-testid="radio-cann-comm-yes" />
                                    <Label htmlFor="cann-comm-yes">Yes</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="No" id="cann-comm-no" data-testid="radio-cann-comm-no" />
                                    <Label htmlFor="cann-comm-no">No</Label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Question 12: Educational Interests */}
                        <FormField
                          control={form.control}
                          name="educationalInterests"
                          render={() => (
                            <FormItem>
                              <div className="mb-4">
                                <FormLabel className="text-base">12. Educational Interests (select all that apply):</FormLabel>
                              </div>
                              <div className="space-y-3">
                                {educationalInterestOptions.map((option) => (
                                  <FormField
                                    key={option}
                                    control={form.control}
                                    name="educationalInterests"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={option}
                                          className="flex flex-row items-start space-x-3 space-y-0"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(option)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...field.value || [], option])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value) => value !== option
                                                      )
                                                    )
                                              }}
                                              data-testid={`checkbox-interest-${option.substring(0, 20).toLowerCase().replace(/\s+/g, '-')}`}
                                            />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                            {option}
                                          </FormLabel>
                                        </FormItem>
                                      )
                                    }}
                                  />
                                ))}
                                
                                {/* Other option with text input */}
                                <FormField
                                  control={form.control}
                                  name="otherEducationalInterest"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                      <FormControl>
                                        <div className="flex items-center gap-3">
                                          <span className="text-sm">Other:</span>
                                          <Input
                                            placeholder="Specify other interest"
                                            {...field}
                                            className="flex-1"
                                            data-testid="input-other-interest"
                                          />
                                        </div>
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Question 13: Interest in Presenting */}
                        <FormField
                          control={form.control}
                          name="interestedInPresenting"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>13. I would be interested in presenting to CANN members at an Educational Series event: *</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="flex gap-6"
                                  data-testid="radio-presenting"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Yes" id="present-yes" data-testid="radio-presenting-yes" />
                                    <Label htmlFor="present-yes">Yes</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="No" id="present-no" data-testid="radio-presenting-no" />
                                    <Label htmlFor="present-no">No</Label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Separator className="my-8" />

                    {/* Non-member Contact Fallback (shown only when both Q1 = No AND Q2 = No) */}
                    <AnimatePresence>
                      {!isMember && wantsMembership === "No" && wantsCANNMembership === "No" && (
                        <motion.div
                          initial={shouldReduceMotion ? {} : { opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={shouldReduceMotion ? {} : { opacity: 0 }}
                          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/10 p-4 sm:p-6 md:p-8 rounded-2xl border border-amber-300/30 space-y-4 sm:space-y-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
                                <Mail className="w-5 h-5 text-white" />
                              </div>
                              <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                                Non-member Contact
                              </h3>
                            </div>

                        <FormField
                          control={form.control}
                          name="noMemberName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter your name" 
                                  {...field} 
                                  data-testid="input-no-member-name"
                                />
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
                              <FormLabel>Email *</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email"
                                  placeholder="Enter your email" 
                                  {...field} 
                                  data-testid="input-no-member-email"
                                />
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
                              <FormLabel>Message / Reason for Contact</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Please share why you're reaching out" 
                                  {...field} 
                                  rows={4}
                                  data-testid="textarea-no-member-message"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <motion.div 
                      className="flex justify-center pt-10"
                      initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.2 }}
                    >
                      <Button
                        type="submit"
                        size="lg"
                        disabled={submitMutation.isPending}
                        className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-full px-12 py-6 text-lg font-semibold shadow-lg"
                        data-testid="button-submit"
                      >
                        {submitMutation.isPending ? (
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Submitting Registration Form...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <Send className="w-5 h-5" />
                            <span>Submit Registration Form</span>
                          </div>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmationModal} onOpenChange={setShowConfirmationModal}>
        <DialogContent className="w-[90vw] sm:max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <DialogTitle className="text-center text-xl sm:text-2xl">
              {submissionType === 'cann' && "CANN Membership Registration Submitted!"}
              {submissionType === 'cas' && "CAS Membership Registration Submitted!"}
              {submissionType === 'contact' && "Contact Form Submitted!"}
            </DialogTitle>
            <DialogDescription className="text-center text-sm sm:text-base">
              {submissionType === 'cann' && "Thank you for registering for CANN membership! You are now also a member of CAS. We've received your submission and will be in touch soon with membership details."}
              {submissionType === 'cas' && "Thank you for registering for CAS membership! We've received your submission and will be in touch soon with membership details."}
              {submissionType === 'contact' && "Thank you for contacting us! We've received your message and will get back to you as soon as possible."}
            </DialogDescription>
          </DialogHeader>
          {submissionId && (
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              Reference ID: {submissionId}
            </div>
          )}
          <div className="flex justify-center mt-4">
            <Button onClick={() => setShowConfirmationModal(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
