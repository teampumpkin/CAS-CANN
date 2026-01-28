import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Clock, AlertCircle, Users, Mail, MapPin, Phone } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// CANN Membership Form Schema with conditional validation
const cannMembershipSchema = z.object({
  membershipRequest: z.enum(["Yes", "No"], {
    required_error: "Please indicate if you would like to become a member",
  }),
  fullName: z.string().optional(),
  emailAddress: z.string().optional(),
  discipline: z.string().optional(),
  subspecialty: z.string().optional(),
  institutionName: z.string().optional(),
  communicationConsent: z.enum(["Yes", "No"]).optional(),
  servicesMapConsent: z.enum(["Yes", "No"], {
    required_error: "Please indicate if you would like your center included in the services map",
  }),
  mapInstitutionName: z.string().optional(),
  institutionAddress: z.string().optional(),
  institutionPhone: z.string().optional(),
  institutionFax: z.string().optional(),
  followUpConsent: z.enum(["Yes", "No"]).optional(),
}).refine((data) => {
  // If membership request is Yes, these fields are required
  if (data.membershipRequest === "Yes") {
    return data.fullName && 
           data.emailAddress && 
           data.discipline && 
           data.subspecialty && 
           data.institutionName && 
           data.communicationConsent;
  }
  return true;
}, {
  message: "All membership fields are required when requesting membership",
  path: ["fullName"]
}).refine((data) => {
  // If services map consent is Yes, these fields are required
  if (data.servicesMapConsent === "Yes") {
    return data.mapInstitutionName && 
           data.institutionAddress && 
           data.institutionPhone && 
           data.institutionFax && 
           data.followUpConsent;
  }
  return true;
}, {
  message: "All clinic information is required for services map inclusion",
  path: ["mapInstitutionName"]
});

type CANNMembershipFormData = z.infer<typeof cannMembershipSchema>;

interface FormSubmission {
  id: string;
  formName: string;
  status: string;
  submittedAt: string;
  submissionData: Record<string, any>;
}

interface SubmissionResponse {
  submissionId: string;
  status: string;
  message: string;
}

export default function CANNMembershipForm() {
  const { toast } = useToast();
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const form = useForm<CANNMembershipFormData>({
    resolver: zodResolver(cannMembershipSchema),
    defaultValues: {
      membershipRequest: undefined,
      servicesMapConsent: undefined,
    },
  });

  const watchMembershipRequest = form.watch("membershipRequest");
  const watchServicesMapConsent = form.watch("servicesMapConsent");

  // Submit form mutation
  const submitMutation = useMutation({
    mutationFn: async (formData: CANNMembershipFormData): Promise<SubmissionResponse> => {
      const response = await apiRequest("/api/submit-form", "POST", {
        formName: "Join CANN Today",
        formData: formData,
        metadata: {
          source: "CANN Membership Form",
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }
      });
      return response as unknown as SubmissionResponse;
    },
    onSuccess: (data) => {
      setSubmissionId(data.submissionId);
      toast({
        title: "Application Submitted Successfully!",
        description: "Your CANN membership application has been received. You'll receive a confirmation email shortly.",
      });
      // Reset form after successful submission
      form.reset();
    },
    onError: (error) => {
      console.error("Form submission error:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Query submission status if we have an ID
  const { data: submissionStatus } = useQuery<FormSubmission>({
    queryKey: ["/api/form-submission", submissionId],
    enabled: !!submissionId,
    refetchInterval: submissionId ? 2000 : false,
  });

  const onSubmit = async (data: CANNMembershipFormData) => {
    try {
      await submitMutation.mutateAsync(data);
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const renderStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "processing":
        return <Clock className="h-5 w-5 text-pink-500 animate-spin" />;
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Users className="h-8 w-8 text-pink-500" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Join CANN Today
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Canadian Amyloidosis Nursing Network
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Unite with nursing professionals dedicated to advancing amyloidosis care across Canada
          </p>
        </div>

        {/* Success Message */}
        {submissionId && submissionStatus && (
          <Card className="mb-8 border-green-200 bg-green-50 dark:bg-green-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                {renderStatusIcon(submissionStatus.status)}
                Application Status: {submissionStatus.status}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 dark:text-green-300">
                Submission ID: {submissionId}
              </p>
              {submissionStatus?.submittedAt && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  Submitted: {new Date(submissionStatus.submittedAt).toLocaleString()}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Main Form */}
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl">CANN Membership Application</CardTitle>
            <CardDescription className="text-pink-100">
              Membership is free and open to all nursing professionals engaged in amyloidosis care
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Membership Request */}
                <FormField
                  control={form.control}
                  name="membershipRequest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Membership Request *
                      </FormLabel>
                      <FormDescription>
                        Would you like to become a member of the Canadian Amyloidosis Society (CAS)?
                      </FormDescription>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex gap-6"
                          data-testid="radio-membership-request"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Yes" id="membership-yes" data-testid="radio-membership-yes" />
                            <Label htmlFor="membership-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="No" id="membership-no" data-testid="radio-membership-no" />
                            <Label htmlFor="membership-no">No</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Conditional Membership Fields */}
                {watchMembershipRequest === "Yes" && (
                  <>
                    <Separator />
                    <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-lg space-y-6">
                      <h3 className="text-lg font-semibold text-pink-800 dark:text-pink-200">
                        Membership Information
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name *</FormLabel>
                              <FormDescription>First and last name</FormDescription>
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

                        <FormField
                          control={form.control}
                          name="emailAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email Address *
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="your.email@example.com" 
                                  {...field} 
                                  data-testid="input-email"
                                />
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
                              <FormLabel>Discipline *</FormLabel>
                              <FormDescription>Physician, nursing, genetic counsellor, etc.</FormDescription>
                              <FormControl>
                                <Input 
                                  placeholder="e.g., Registered Nurse" 
                                  {...field} 
                                  data-testid="input-discipline"
                                />
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
                              <FormLabel>Sub-specialty Area *</FormLabel>
                              <FormDescription>Cardiology, hematology, neurology, etc.</FormDescription>
                              <FormControl>
                                <Input 
                                  placeholder="e.g., Cardiology" 
                                  {...field} 
                                  data-testid="input-subspecialty"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="institutionName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Center or Clinic Name/Institution *</FormLabel>
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

                      <FormField
                        control={form.control}
                        name="communicationConsent"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Communication Consent *</FormLabel>
                            <FormDescription>
                              Would you like to receive communication from the Canadian Amyloidosis Society (emails, newsletters)?
                            </FormDescription>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="flex gap-6"
                                data-testid="radio-communication-consent"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="Yes" id="comm-yes" data-testid="radio-communication-yes" />
                                  <Label htmlFor="comm-yes">Yes</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="No" id="comm-no" data-testid="radio-communication-no" />
                                  <Label htmlFor="comm-no">No</Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}

                <Separator />

                {/* Services Map Section */}
                <FormField
                  control={form.control}
                  name="servicesMapConsent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Canadian Amyloidosis Services Map *
                      </FormLabel>
                      <FormDescription>
                        Would you like your center/clinic to be included in the Canadian Amyloidosis Services Map?
                      </FormDescription>
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

                {/* Conditional Services Map Fields */}
                {watchServicesMapConsent === "Yes" && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg space-y-6">
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                      Clinic/Institution Information
                    </h3>
                    
                    <FormField
                      control={form.control}
                      name="mapInstitutionName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Center or Clinic Name/Institution *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter clinic/institution name for the map" 
                              {...field} 
                              data-testid="input-map-institution"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="institutionAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Center or Clinic Address *
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Complete address including city and province" 
                              {...field} 
                              data-testid="input-institution-address"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="institutionPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              Phone Number *
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="(xxx) xxx-xxxx" 
                                {...field} 
                                data-testid="input-institution-phone"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="institutionFax"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fax Number *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="(xxx) xxx-xxxx" 
                                {...field} 
                                data-testid="input-institution-fax"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="followUpConsent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Follow-up Contact Consent *</FormLabel>
                          <FormDescription>
                            May the CAS contact you, if needed, to provide information for the Canadian Amyloidosis Services Map?
                          </FormDescription>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex gap-6"
                              data-testid="radio-followup-consent"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Yes" id="followup-yes" data-testid="radio-followup-yes" />
                                <Label htmlFor="followup-yes">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="No" id="followup-no" data-testid="radio-followup-no" />
                                <Label htmlFor="followup-no">No</Label>
                              </div>
                            </RadioGroup>
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
                    className="w-full md:w-auto px-12 py-3 text-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                    data-testid="button-submit"
                  >
                    {submitMutation.isPending ? (
                      <>
                        <Clock className="mr-2 h-5 w-5 animate-spin" />
                        Submitting Application...
                      </>
                    ) : (
                      "Submit CANN Membership Application"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Footer Information */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Your information will be securely processed and stored in accordance with privacy regulations.
          </p>
          <p className="mt-2">
            For questions about CANN membership, please contact the Canadian Amyloidosis Society.
          </p>
        </div>
      </div>
    </div>
  );
}