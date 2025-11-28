import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Users, MapPin, ArrowLeft, CheckCircle, Loader2, Clock, Sparkles } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ParallaxBackground from "@/components/ParallaxBackground";

const registrationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  institution: z.string().min(1, "Centre or Clinic Name/Institution is required"),
  isCannMember: z.enum(["yes", "no"], {
    required_error: "Please indicate if you are a CANN member",
  }),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

export default function CANNTownhallRegistration() {
  const [, setLocation] = useLocation();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      institution: "",
      isCannMember: undefined,
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegistrationForm) => {
      const response = await apiRequest("POST", "/api/events/cann-townhall/register", {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        institution: data.institution,
        isCannMember: data.isCannMember === "yes",
      });
      return response.json();
    },
    onSuccess: () => {
      setShowSuccessDialog(true);
      form.reset();
    },
    onError: (error) => {
      console.error("Registration error:", error);
    },
  });

  const onSubmit = (data: RegistrationForm) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header />
      
      {/* Hero Section with Parallax Background */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-24 pb-12">
        <ParallaxBackground />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-[#00AFE6]/20 via-white to-[#00DD89]/15 dark:from-[#00AFE6]/30 dark:via-gray-900 dark:to-[#00DD89]/25" />
        
        {/* Floating Accent Elements */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-[#00AFE6]/20 to-[#00DD89]/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-48 h-48 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-full blur-2xl"
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 backdrop-blur-sm px-4 py-2 rounded-full border border-[#00AFE6]/30 dark:border-[#00AFE6]/40 mb-6"
            >
              <Sparkles className="w-4 h-4 text-[#00AFE6]" />
              <span className="text-sm font-medium bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Virtual Workshop
              </span>
            </motion.div>

            <h1 className="font-rosarivo text-4xl md:text-5xl lg:text-6xl font-bold mb-6" data-testid="text-event-title">
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                CANN Townhall
              </span>
              <br />
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                Ideation Workshop
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-white/70 max-w-2xl mx-auto mb-8 leading-relaxed">
              We want to hear from you! This live session will be professionally facilitated, 
              designed to understand the needs of new/current CANN members and shape future direction.
            </p>

            {/* Event Details Cards */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-5 py-3 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Date</div>
                  <div className="font-semibold text-gray-900 dark:text-white">January 22, 2026</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-5 py-3 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Time</div>
                  <div className="font-semibold text-gray-900 dark:text-white">5:00 - 6:30 PM MST</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-5 py-3 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Location</div>
                  <div className="font-semibold text-gray-900 dark:text-white">Virtual Event</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section className="relative py-16 bg-gradient-to-br from-gray-50/80 to-white/80 dark:from-gray-800/80 dark:to-gray-900/80">
        {/* Background accents */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl -translate-x-48 -translate-y-48" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00AFE6]/5 rounded-full blur-3xl translate-x-48 translate-y-48" />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Button
              variant="ghost"
              onClick={() => setLocation("/cann-resources")}
              className="mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              data-testid="button-back-events"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to CANN Resources/Events
            </Button>

            <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-[#00AFE6]/10 dark:from-pink-500/20 dark:via-purple-500/20 dark:to-[#00AFE6]/20 p-8 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Event Registration
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Complete the form below to register
                    </p>
                  </div>
                </div>

                {/* CANN Members Notice */}
                <div className="bg-[#00AFE6]/10 dark:bg-[#00AFE6]/20 border border-[#00AFE6]/30 dark:border-[#00AFE6]/40 rounded-xl p-4">
                  <p className="text-[#00AFE6] dark:text-[#00AFE6] text-sm">
                    <strong>Note:</strong> This event is exclusively for CANN members. 
                    If you are not yet a CANN member, please{" "}
                    <a 
                      href="/join-cas" 
                      className="text-pink-500 hover:underline font-medium"
                      data-testid="link-join-cann"
                    >
                      join CANN first
                    </a>.
                  </p>
                </div>
              </div>

              {/* Form Body */}
              <div className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                              First Name <span className="text-pink-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter your first name"
                                className="h-12 bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:border-pink-500 focus:ring-pink-500/20 rounded-xl"
                                data-testid="input-first-name"
                              />
                            </FormControl>
                            <FormMessage className="text-pink-500" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                              Last Name <span className="text-pink-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter your last name"
                                className="h-12 bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:border-pink-500 focus:ring-pink-500/20 rounded-xl"
                                data-testid="input-last-name"
                              />
                            </FormControl>
                            <FormMessage className="text-pink-500" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                            Email Address <span className="text-pink-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="Enter your email address"
                              className="h-12 bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:border-pink-500 focus:ring-pink-500/20 rounded-xl"
                              data-testid="input-email"
                            />
                          </FormControl>
                          <FormMessage className="text-pink-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="institution"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                            Centre or Clinic Name/Institution <span className="text-pink-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter your institution name"
                              className="h-12 bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:border-pink-500 focus:ring-pink-500/20 rounded-xl"
                              data-testid="input-institution"
                            />
                          </FormControl>
                          <FormMessage className="text-pink-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isCannMember"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                            I am a CANN member <span className="text-pink-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex gap-4"
                            >
                              <label 
                                htmlFor="cann-yes" 
                                className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 cursor-pointer transition-all ${
                                  field.value === "yes" 
                                    ? "border-pink-500 bg-pink-50 dark:bg-pink-900/20" 
                                    : "border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-800"
                                }`}
                              >
                                <RadioGroupItem 
                                  value="yes" 
                                  id="cann-yes"
                                  className="text-pink-500"
                                  data-testid="radio-cann-member-yes"
                                />
                                <span className="text-gray-700 dark:text-gray-300 font-medium">
                                  Yes
                                </span>
                              </label>
                              <label 
                                htmlFor="cann-no" 
                                className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 cursor-pointer transition-all ${
                                  field.value === "no" 
                                    ? "border-pink-500 bg-pink-50 dark:bg-pink-900/20" 
                                    : "border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-800"
                                }`}
                              >
                                <RadioGroupItem 
                                  value="no" 
                                  id="cann-no"
                                  className="text-pink-500"
                                  data-testid="radio-cann-member-no"
                                />
                                <span className="text-gray-700 dark:text-gray-300 font-medium">
                                  No
                                </span>
                              </label>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage className="text-pink-500" />
                        </FormItem>
                      )}
                    />

                    <div className="pt-6">
                      <Button
                        type="submit"
                        disabled={registerMutation.isPending}
                        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-pink-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/30"
                        data-testid="button-submit-registration"
                      >
                        {registerMutation.isPending ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Registering...
                          </>
                        ) : (
                          "Register for Event"
                        )}
                      </Button>
                    </div>

                    {registerMutation.isError && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl p-4 text-red-700 dark:text-red-300 text-sm" 
                        data-testid="text-error-message"
                      >
                        An error occurred while registering. Please try again.
                      </motion.div>
                    )}
                  </form>
                </Form>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="mx-auto mb-4 w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/30"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>
            <DialogTitle className="text-center text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-success-title">
              Registration Successful!
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 dark:text-gray-400 text-base leading-relaxed" data-testid="text-success-message">
              Thank you for registering for the CANN Townhall. Further details about this event will be provided to you via email.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-6">
            <Button
              onClick={() => {
                setShowSuccessDialog(false);
                setLocation("/cann-resources");
              }}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg shadow-pink-500/25"
              data-testid="button-close-success"
            >
              Back to CANN Resources/Events
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
