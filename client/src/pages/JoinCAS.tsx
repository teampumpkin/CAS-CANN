import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserPlus,
  CheckCircle,
  Send,
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
      setShowConfirmationModal(true);
      const isCANNMember = form.getValues("wantsCANNMembership") === "Yes";
      toast({
        title: "Application Submitted Successfully!",
        description: isCANNMember 
          ? "Your CAS & CANN membership application has been received."
          : "Your CAS membership application has been received.",
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
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 bg-[#00AFE6]/10 rounded-full px-6 py-3 border border-[#00AFE6]/20 mb-6">
              <UserPlus className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Professional Membership
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold font-rosarivo mb-6 text-gray-900 dark:text-white">
              Join{" "}
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                CAS and CANN
              </span>
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Become part of Canada's premier professional network for amyloidosis care and nursing excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white">
                <CardTitle className="text-2xl">CAS and CANN Registration Form</CardTitle>
                <CardDescription className="text-white/90">
                  Complete the form below to join our professional community
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    
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
                            If "Yes" is selected, additional CANN questions will appear at the end of this form. Selecting "Yes" for CANN automatically includes CAS membership.
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

                    {/* Questions 3-8: Member Information (shown when either Q1 or Q2 = "Yes") */}
                    {isMember && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg space-y-6">
                        <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-4">
                          Member Information
                        </h3>

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
                    )}

                    {/* Question 10: CANN Additional Questions (shown only when Q2 = "Yes") */}
                    {wantsCANNMembership === "Yes" && (
                      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg space-y-6">
                        <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-4">
                          10. CANN Additional Questions
                        </h3>

                        {/* Question 10a: Amyloidosis Type */}
                        <FormField
                          control={form.control}
                          name="amyloidosisType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>10a. In my nursing practice, I primarily care for patients with the following type of amyloidosis: *</FormLabel>
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

                        {/* Question 10b: CANN Communications */}
                        <FormField
                          control={form.control}
                          name="cannCommunications"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>10b. I would like to receive communication from the Canadian Amyloidosis Nursing Network (CANN): *</FormLabel>
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

                        {/* Question 10c: Educational Interests */}
                        <FormField
                          control={form.control}
                          name="educationalInterests"
                          render={() => (
                            <FormItem>
                              <div className="mb-4">
                                <FormLabel className="text-base">10c. Educational Interests (select all that apply):</FormLabel>
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

                        {/* Question 10d: Interest in Presenting */}
                        <FormField
                          control={form.control}
                          name="interestedInPresenting"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>10d. I would be interested in presenting to CANN members at an Educational Series event: *</FormLabel>
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
                    )}

                    {/* Question 11: Non-member Contact Fallback (shown only when both Q1 = No AND Q2 = No) */}
                    {!isMember && wantsMembership === "No" && wantsCANNMembership === "No" && (
                      <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg space-y-6">
                        <h3 className="text-xl font-semibold text-amber-800 dark:text-amber-200 mb-4">
                          11. Non-member Contact
                        </h3>

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
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-center pt-6">
                      <Button
                        type="submit"
                        size="lg"
                        disabled={submitMutation.isPending}
                        className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white hover:opacity-90 transition-opacity"
                        data-testid="button-submit"
                      >
                        {submitMutation.isPending ? (
                          <>Submitting...</>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            Submit Application
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmationModal} onOpenChange={setShowConfirmationModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <DialogTitle className="text-center text-2xl">Application Submitted!</DialogTitle>
            <DialogDescription className="text-center">
              Thank you for your application. We've received your submission and will be in touch soon.
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
