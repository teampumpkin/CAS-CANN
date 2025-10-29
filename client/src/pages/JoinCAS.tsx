import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  UserPlus,
  BookOpen,
  Vote,
  Network,
  Gift,
  Calendar,
  Stethoscope,
  Info,
  FileText,
  Send,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

const membershipBenefits = [
  {
    icon: Vote,
    title: "Amyloidosis Updates",
    description:
      "Updates from important news and developments from the world of amyloidosis in Canada and internationally.",
  },
  {
    icon: Network,
    title: "Professional Network",
    description:
      "Access to exclusive professional network of amyloidosis specialists across Canada",
  },
  {
    icon: Gift,
    title: "Clinical Tools Access",
    description:
      "Access to new clinical tools, research findings, and professional development resources",
  },
  {
    icon: Calendar,
    title: "Event Access",
    description:
      "Notification and registration for conferences, webinars, and professional development events",
  },
];

const whoCanJoin = [
  {
    icon: Stethoscope,
    title: "Healthcare Professionals",
    description:
      "Physicians, nurses, allied health professionals involved in amyloidosis care",
  },
  {
    icon: BookOpen,
    title: "Researchers & Academics",
    description:
      "Scientists, academics, and research professionals studying amyloidosis",
  },
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
      wantsCANNMembership: undefined, // NEW: CANN membership question
      // "Yes" membership path (for CAS or CANN members)
      fullName: "",
      email: "",
      discipline: "",
      subspecialty: "",
      institution: "",
      wantsCommunications: undefined,
      wantsServicesMapInclusion: undefined,
      centerName: "",
      centerAddress: "",
      centerPhone: "",
      centerFax: "",
      allowsContact: undefined,
      // "No" membership path
      noMemberWantsServicesMap: undefined,
      noMemberCenterName: "",
      noMemberCenterAddress: "",
      noMemberCenterPhone: "",
      noMemberCenterFax: "",
      noMemberAllowsContact: undefined,
      noMemberEmail: "",
      noMemberDiscipline: "",
      noMemberSubspecialty: "",
      noMemberCenterNameForContact: "",
      noMemberWantsCommunications: undefined,
    },
  });

  // Watch form values for conditional rendering
  const wantsMembership = form.watch("wantsMembership");
  const wantsCANNMembership = form.watch("wantsCANNMembership");
  const wantsServicesMapInclusion = form.watch("wantsServicesMapInclusion");
  const noMemberAllowsContact = form.watch("noMemberAllowsContact");
  
  // Check if user is a member (either CAS or CANN)
  const isMember = wantsMembership === "Yes" || wantsCANNMembership === "Yes";

  // Submit form mutation
  const submitMutation = useMutation({
    mutationFn: async (formData: CASRegistrationForm): Promise<SubmissionResponse> => {
      // Determine form name based on CANN membership selection
      const isCANNMember = formData.wantsCANNMembership === "Yes";
      const formName = isCANNMember ? "CAS & CANN Registration" : "CAS Registration";
      const formSource = isCANNMember ? "CAS & CANN Registration Form" : "CAS Registration Form";
      
      const response = await apiRequest("POST", "/api/submit-form", {
        form_name: formName,
        data: formData,
      });
      return response as unknown as SubmissionResponse;
    },
    onSuccess: (data) => {
      setSubmissionId(data.submissionId);
      setShowConfirmationModal(true);
      const isCANNMember = form.getValues("wantsCANNMembership") === "Yes";
      toast({
        title: "Application Submitted Successfully!",
        description: isCANNMember 
          ? "Your CAS & CANN membership application has been received and sent to our CRM system."
          : "Your CAS membership application has been received and sent to our CRM system.",
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
      <section className="relative py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 dark:block hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00AFE6]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00DD89]/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 bg-[#00AFE6]/10 backdrop-blur-xl rounded-full px-6 py-3 border border-[#00AFE6]/20 mb-6">
              <UserPlus className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-sm font-medium text-gray-900 dark:text-white/90">
                Professional Membership
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-rosarivo mb-6 leading-tight text-gray-900 dark:text-white">
              Join{" "}
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                CAS and CANN
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Become part of Canada's premier professional network for
              amyloidosis care and nursing excellence. Access clinical tools, collaborate
              with leading experts, and join specialized nursing education programs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() =>
                  document
                    .getElementById("join-form")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-10 py-6 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-[#00AFE6]/25 transition-all duration-300 group"
                data-testid="button-register-membership"
              >
                <span>Register for Membership</span>
                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  document
                    .getElementById("why-join")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="border-[#00AFE6]/30 text-[#00AFE6] hover:bg-[#00AFE6]/10 px-8 py-6 rounded-2xl font-semibold text-lg"
                data-testid="button-learn-more"
              >
                Learn More
                <BookOpen className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Join Section */}
      <section id="why-join" className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-rosarivo text-gray-900 dark:text-white mb-4">
              Why Join{" "}
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                CAS?
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-white/70 max-w-3xl mx-auto">
              CAS membership provides access to professional tools, governance
              participation, and a network of Canada's leading amyloidosis
              experts.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {membershipBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white dark:bg-white/10 border-gray-200 dark:border-white/20 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center">
                        <benefit.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-gray-900 dark:text-white">
                        {benefit.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-white/70">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Can Join Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-rosarivo text-gray-900 dark:text-white mb-4">
              Who Can{" "}
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Join?
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-white/70 max-w-3xl mx-auto">
              CAS membership is open to professionals who contribute to
              amyloidosis care, research, and patient advocacy in Canada.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whoCanJoin.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white dark:bg-white/10 border-gray-200 dark:border-white/20 hover:shadow-lg transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center">
                        <category.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-gray-900 dark:text-white">
                        {category.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-white/70 mb-4">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section
        id="join-form"
        className="py-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-white/10"
      >
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-rosarivo text-gray-900 dark:text-white mb-4">
                Register for{" "}
                <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                  CAS
                </span>
              </h2>
              <p className="text-gray-600 dark:text-white/70 max-w-2xl mx-auto mb-8">
                Join Canada's leading professional network for amyloidosis care
                by submitting the registration form below.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Alert className="bg-[#00AFE6]/10 border-[#00AFE6]/30 mb-8">
                <Info className="w-4 h-4 text-[#00AFE6]" />
                <AlertDescription className="text-gray-900 dark:text-white/90">
                  <strong>Terms of Participation & Privacy Policy:</strong> By
                  applying, you agree to abide by our professional standards and
                  governance framework. All personal information is handled
                  according to our privacy policy.
                </AlertDescription>
              </Alert>

              <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#00AFE6]/5 via-transparent to-[#00DD89]/5" />

                {/* Form Header */}
                <div className="relative bg-gradient-to-r from-[#00AFE6] to-[#00DD89] p-4 text-center">
                  {/* Floating elements */}
                  <div className="absolute top-3 left-3 w-6 h-6 bg-white/10 rounded-full blur-sm animate-pulse" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 bg-white/10 rounded-full blur-sm animate-pulse delay-1000" />

                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                  </motion.div>

                  <h3 className="text-xl font-bold text-white mb-2 font-rosarivo">
                    CAS and CANN Registration Form
                  </h3>
                  <p className="text-white/90 text-sm max-w-sm mx-auto leading-relaxed">
                    Complete the registration form below for CAS and/or CANN membership. All fields are secure and confidential.
                  </p>

                  {/* Progress indicators */}
                  <div className="flex justify-center gap-1.5 mt-4">
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                    <div className="w-6 h-1.5 bg-white/60 rounded-full" />
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                  </div>
                </div>

                {/* Registration Form */}
                <div className="relative bg-white dark:bg-gray-800">
                  {/* Form frame decoration */}
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent dark:from-gray-700/50 pointer-events-none" />

                  <div className="p-8">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Question 1: Main membership question */}
                        <FormField
                          control={form.control}
                          name="wantsMembership"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-base font-medium text-gray-900 dark:text-white">
                                1. I would like to become a member of the Canadian Amyloidosis Society (CAS)
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="flex flex-col space-y-2"
                                  data-testid="radio-wants-membership"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Yes" id="membership-yes" />
                                    <label
                                      htmlFor="membership-yes"
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-white/80"
                                    >
                                      Yes
                                    </label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="No" id="membership-no" />
                                    <label
                                      htmlFor="membership-no"
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-white/80"
                                    >
                                      No
                                    </label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Question 2: CANN membership question (NEW) */}
                        <FormField
                          control={form.control}
                          name="wantsCANNMembership"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-base font-medium text-gray-900 dark:text-white">
                                2. I would like to become a member of the Canadian Amyloidosis Nursing Network (CANN)
                              </FormLabel>
                              <FormDescription className="text-sm text-gray-500 dark:text-gray-400">
                                Note: CANN members automatically become CAS members
                              </FormDescription>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="flex flex-col space-y-2"
                                  data-testid="radio-wants-cann-membership"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Yes" id="cann-yes" />
                                    <label
                                      htmlFor="cann-yes"
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-white/80"
                                    >
                                      Yes
                                    </label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="No" id="cann-no" />
                                    <label
                                      htmlFor="cann-no"
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-white/80"
                                    >
                                      No
                                    </label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Show member questions if either CAS or CANN membership selected */}
                        {isMember && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6 border-t border-gray-200 dark:border-gray-700 pt-6"
                          >
                            {/* Member Path - Questions 3-9 (for CAS or CANN members) */}
                            <FormField
                              control={form.control}
                              name="fullName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-base font-medium text-gray-900 dark:text-white">
                                    3. Full name (first and last)
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter your name"
                                      {...field}
                                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                      data-testid="input-full-name"
                                    />
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
                                  <FormLabel className="text-base font-medium text-gray-900 dark:text-white">
                                    4. Email address
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="email"
                                      placeholder="Enter your email address"
                                      {...field}
                                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
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
                                  <FormLabel className="text-base font-medium text-gray-900 dark:text-white">
                                    5. Discipline (Include nursing designation/role if also registering for CANN)
                                  </FormLabel>
                                  <FormDescription className="text-sm text-gray-500 dark:text-gray-400">
                                    Example: Physician, Registered Nurse, Genetic Counsellor, etc.
                                  </FormDescription>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter your discipline"
                                      {...field}
                                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
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
                                  <FormLabel className="text-base font-medium text-gray-900 dark:text-white">
                                    6. Sub-specialty area of focus (cardiology, hematology, neurology, etc)
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter your answer"
                                      {...field}
                                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                      data-testid="input-subspecialty"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="institution"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-base font-medium text-gray-900 dark:text-white">
                                    7. Centre or Clinic Name/Institution
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter your answer"
                                      {...field}
                                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                      data-testid="input-institution"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="wantsCommunications"
                              render={({ field }) => (
                                <FormItem className="space-y-3">
                                  <FormLabel className="text-base font-medium text-gray-900 dark:text-white">
                                    8. I would like to receive communication from the Canadian Amyloidosis Society (email, newsletters)
                                  </FormLabel>
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      value={field.value}
                                      className="flex flex-col space-y-2"
                                      data-testid="radio-wants-communications"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Yes" id="communications-yes" />
                                        <label
                                          htmlFor="communications-yes"
                                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-white/80"
                                        >
                                          Yes
                                        </label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="No" id="communications-no" />
                                        <label
                                          htmlFor="communications-no"
                                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-white/80"
                                        >
                                          No
                                        </label>
                                      </div>
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="wantsServicesMapInclusion"
                              render={({ field }) => (
                                <FormItem className="space-y-3">
                                  <FormLabel className="text-base font-medium text-gray-900 dark:text-white">
                                    9. I would like my centre/clinic to be included in the Canadian Amyloidosis Services Map
                                  </FormLabel>
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      value={field.value}
                                      className="flex flex-col space-y-2"
                                      data-testid="radio-wants-services-map"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Yes" id="services-map-yes" />
                                        <label
                                          htmlFor="services-map-yes"
                                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-white/80"
                                        >
                                          Yes
                                        </label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="No" id="services-map-no" />
                                        <label
                                          htmlFor="services-map-no"
                                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-white/80"
                                        >
                                          No
                                        </label>
                                      </div>
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Questions 9-13: Show only when wantsServicesMapInclusion is "Yes" */}
                            {wantsServicesMapInclusion === "Yes" && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6 border-t border-gray-200 dark:border-gray-700 pt-6 ml-4"
                              >
                                <FormField
                                  control={form.control}
                                  name="centerName"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-base font-medium text-gray-900 dark:text-white">
                                        9. Centre or Clinic Name/Institution
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Enter your answer"
                                          {...field}
                                          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                          data-testid="input-center-name"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="centerAddress"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-base font-medium text-gray-900 dark:text-white">
                                        10. Centre or Clinic Address
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Enter your answer"
                                          {...field}
                                          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                          data-testid="input-center-address"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="centerPhone"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-base font-medium text-gray-900 dark:text-white">
                                        11. Centre or Clinic Phone Number
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          type="tel"
                                          placeholder="Enter your answer"
                                          {...field}
                                          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                          data-testid="input-center-phone"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="centerFax"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-base font-medium text-gray-900 dark:text-white">
                                        12. Centre or Clinic Fax Number
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          type="tel"
                                          placeholder="Enter your answer"
                                          {...field}
                                          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                          data-testid="input-center-fax"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="allowsContact"
                                  render={({ field }) => (
                                    <FormItem className="space-y-3">
                                      <FormLabel className="text-base font-medium text-gray-900 dark:text-white">
                                        13. I may be contacted, if needed, by the CAS to provide information for the Canadian Amyloidosis Services Map
                                      </FormLabel>
                                      <FormControl>
                                        <RadioGroup
                                          onValueChange={field.onChange}
                                          value={field.value}
                                          className="flex flex-col space-y-2"
                                          data-testid="radio-allows-contact"
                                        >
                                          <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Yes" id="contact-yes" />
                                            <label
                                              htmlFor="contact-yes"
                                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-white/80"
                                            >
                                              Yes
                                            </label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="No" id="contact-no" />
                                            <label
                                              htmlFor="contact-no"
                                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-white/80"
                                            >
                                              No
                                            </label>
                                          </div>
                                        </RadioGroup>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </motion.div>
                            )}
                          </motion.div>
                        )}

                        {/* Non-Member Path - Questions 2-12 (shown when neither CAS nor CANN selected) */}
                        {!isMember && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6 border-t border-gray-200 dark:border-gray-700 pt-6"
                          >
                            {/* Question 2: Services Map for Non-Members */}
                            <FormField
                              control={form.control}
                              name="noMemberWantsServicesMap"
                              render={({ field }) => (
                                <FormItem className="space-y-3">
                                  <FormLabel className="text-base font-medium text-gray-900 dark:text-white">
                                    2. I would like my centre/clinic to be included in the Canadian Amyloidosis Services Map
                                  </FormLabel>
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      value={field.value}
                                      className="flex flex-col space-y-2"
                                      data-testid="radio-no-member-wants-services-map"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Yes" id="no-member-services-map-yes" />
                                        <label
                                          htmlFor="no-member-services-map-yes"
                                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-white/80"
                                        >
                                          Yes
                                        </label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="No" id="no-member-services-map-no" />
                                        <label
                                          htmlFor="no-member-services-map-no"
                                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-white/80"
                                        >
                                          No
                                        </label>
                                      </div>
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Questions 3-6: Center Details (Always Required for Non-Members) */}
                            <FormField
                              control={form.control}
                              name="noMemberCenterName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-base font-medium text-gray-900 dark:text-white">
                                    3. Centre or Clinic Name/Institution
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter your answer"
                                      {...field}
                                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                      data-testid="input-no-member-center-name"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="noMemberCenterAddress"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-base font-medium text-gray-900 dark:text-white">
                                    4. Centre or Clinic Address
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter your answer"
                                      {...field}
                                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                      data-testid="input-no-member-center-address"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="noMemberCenterPhone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-base font-medium text-gray-900 dark:text-white">
                                    5. Centre or Clinic Phone Number
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="tel"
                                      placeholder="Enter your answer"
                                      {...field}
                                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                      data-testid="input-no-member-center-phone"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="noMemberCenterFax"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-base font-medium text-gray-900 dark:text-white">
                                    6. Centre or Clinic Fax Number
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="tel"
                                      placeholder="Enter your answer"
                                      {...field}
                                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                      data-testid="input-no-member-center-fax"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Question 7: Allow Contact for Services Map */}
                            <FormField
                              control={form.control}
                              name="noMemberAllowsContact"
                              render={({ field }) => (
                                <FormItem className="space-y-3">
                                  <FormLabel className="text-base font-medium text-gray-900 dark:text-white">
                                    7. I may be contacted, if needed, by the CAS to provide information for the Canadian Amyloidosis Services Map
                                  </FormLabel>
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      value={field.value}
                                      className="flex flex-col space-y-2"
                                      data-testid="radio-no-member-allows-contact"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Yes" id="no-member-contact-yes" />
                                        <label
                                          htmlFor="no-member-contact-yes"
                                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-white/80"
                                        >
                                          Yes
                                        </label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="No" id="no-member-contact-no" />
                                        <label
                                          htmlFor="no-member-contact-no"
                                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-white/80"
                                        >
                                          No
                                        </label>
                                      </div>
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Questions 8-12: Show only when noMemberAllowsContact is "Yes" */}
                            {noMemberAllowsContact === "Yes" && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6 border-t border-gray-200 dark:border-gray-700 pt-6 ml-4"
                              >
                                <FormField
                                  control={form.control}
                                  name="noMemberEmail"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-base font-medium text-gray-900 dark:text-white">
                                        8. Email address
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          type="email"
                                          placeholder="Enter your answer"
                                          {...field}
                                          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                          data-testid="input-no-member-email"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="noMemberDiscipline"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-base font-medium text-gray-900 dark:text-white">
                                        9. Discipline (physician, nursing, genetic counsellor, etc)
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Enter your answer"
                                          {...field}
                                          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                          data-testid="input-no-member-discipline"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="noMemberSubspecialty"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-base font-medium text-gray-900 dark:text-white">
                                        10. Sub-specialty area of focus (cardiology, hematology, neurology, etc)
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Enter your answer"
                                          {...field}
                                          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                          data-testid="input-no-member-subspecialty"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="noMemberCenterNameForContact"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-base font-medium text-gray-900 dark:text-white">
                                        11. Centre or Clinic Name/Institution
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Enter your answer"
                                          {...field}
                                          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                          data-testid="input-no-member-center-name-contact"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="noMemberWantsCommunications"
                                  render={({ field }) => (
                                    <FormItem className="space-y-3">
                                      <FormLabel className="text-base font-medium text-gray-900 dark:text-white">
                                        12. I would like to receive communication from the Canadian Amyloidosis Society (email, newsletters)
                                      </FormLabel>
                                      <FormControl>
                                        <RadioGroup
                                          onValueChange={field.onChange}
                                          value={field.value}
                                          className="flex flex-col space-y-2"
                                          data-testid="radio-no-member-wants-communications"
                                        >
                                          <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Yes" id="no-member-communications-yes" />
                                            <label
                                              htmlFor="no-member-communications-yes"
                                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-white/80"
                                            >
                                              Yes
                                            </label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="No" id="no-member-communications-no" />
                                            <label
                                              htmlFor="no-member-communications-no"
                                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-white/80"
                                            >
                                              No
                                            </label>
                                          </div>
                                        </RadioGroup>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </motion.div>
                            )}
                          </motion.div>
                        )}


                        {/* Submit Button */}
                        <div className="flex justify-center pt-8">
                          <Button
                            type="submit"
                            disabled={submitMutation.isPending}
                            className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-[#00AFE6]/25 transition-all duration-300 group min-w-[200px]"
                            data-testid="button-submit-form"
                          >
                            {submitMutation.isPending ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                                />
                                <span>Submitting...</span>
                              </>
                            ) : (
                              <>
                                <span>Submit Registration</span>
                                <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Confirmation Modal */}
      <Dialog
        open={showConfirmationModal}
        onOpenChange={setShowConfirmationModal}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Thank you for your registration!
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300 mt-4 text-base leading-relaxed">
              Your registration form has been successfully submitted to the Canadian Amyloidosis Society.
              <br />
              <br />
              Thank you for your interest in joining our professional community. We will review your application and be in touch soon.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-6">
            <Button
              onClick={() => {
                setShowConfirmationModal(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white hover:shadow-lg hover:shadow-[#00AFE6]/25 transition-all duration-300"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Continue to CAS Website
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowConfirmationModal(false)}
              className="border-gray-300 dark:border-gray-600"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}