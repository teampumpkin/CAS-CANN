import { useState } from "react";
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
import { Calendar, Users, MapPin, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button
              variant="ghost"
              onClick={() => setLocation("/events")}
              className="mb-6 text-gray-600 hover:text-gray-900"
              data-testid="button-back-events"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] p-8 text-white">
                <h1 className="text-3xl font-bold mb-2" data-testid="text-event-title">
                  CANN Townhall - Ideation Workshop
                </h1>
                <p className="text-white/90 text-lg mb-4">
                  Register for the upcoming CANN Townhall event
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Coming Soon</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>Virtual Event</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>CANN Members Only</span>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
                  <p className="text-amber-800 text-sm">
                    <strong>Note:</strong> This event is exclusively for CANN members. 
                    If you are not yet a CANN member, please{" "}
                    <a 
                      href="/join-cas" 
                      className="text-[#00AFE6] hover:underline font-medium"
                      data-testid="link-join-cann"
                    >
                      join CANN first
                    </a>.
                  </p>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">
                              First Name <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter your first name"
                                className="h-12 border-gray-300 focus:border-[#00AFE6] focus:ring-[#00AFE6]"
                                data-testid="input-first-name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">
                              Last Name <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter your last name"
                                className="h-12 border-gray-300 focus:border-[#00AFE6] focus:ring-[#00AFE6]"
                                data-testid="input-last-name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Email Address <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="Enter your email address"
                              className="h-12 border-gray-300 focus:border-[#00AFE6] focus:ring-[#00AFE6]"
                              data-testid="input-email"
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
                          <FormLabel className="text-gray-700 font-medium">
                            Centre or Clinic Name/Institution <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter your institution name"
                              className="h-12 border-gray-300 focus:border-[#00AFE6] focus:ring-[#00AFE6]"
                              data-testid="input-institution"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isCannMember"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-gray-700 font-medium">
                            I am a CANN member <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex gap-6"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem 
                                  value="yes" 
                                  id="cann-yes"
                                  data-testid="radio-cann-member-yes"
                                />
                                <label 
                                  htmlFor="cann-yes" 
                                  className="text-gray-700 cursor-pointer"
                                >
                                  Yes
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem 
                                  value="no" 
                                  id="cann-no"
                                  data-testid="radio-cann-member-no"
                                />
                                <label 
                                  htmlFor="cann-no" 
                                  className="text-gray-700 cursor-pointer"
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

                    <div className="pt-4">
                      <Button
                        type="submit"
                        disabled={registerMutation.isPending}
                        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/90 hover:to-[#00DD89]/90 text-white rounded-xl shadow-lg"
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
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm" data-testid="text-error-message">
                        An error occurred while registering. Please try again.
                      </div>
                    )}
                  </form>
                </Form>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-center text-xl" data-testid="text-success-title">
              Registration Successful!
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600" data-testid="text-success-message">
              Thank you for registering for the CANN Townhall. Further details about this event will be provided to you via email.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <Button
              onClick={() => {
                setShowSuccessDialog(false);
                setLocation("/events");
              }}
              className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/90 hover:to-[#00DD89]/90 text-white"
              data-testid="button-close-success"
            >
              Back to Events
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
