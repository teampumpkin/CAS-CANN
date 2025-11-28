import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Calendar, Users, MapPin, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { eventRegistrationFormSchema, type EventRegistrationForm } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function CANNTownhallRegistration() {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const form = useForm<EventRegistrationForm>({
    resolver: zodResolver(eventRegistrationFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      institution: "",
      isCANNMember: undefined,
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: EventRegistrationForm) => {
      const response = await apiRequest("POST", "/api/events/cann-townhall/register", data);
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

  const onSubmit = (data: EventRegistrationForm) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#00AFE6]/5 dark:from-gray-900 dark:via-gray-800 dark:to-[#00AFE6]/10">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/events">
            <Button
              variant="ghost"
              className="mb-6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              data-testid="link-back-events"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
          </Link>

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-full">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium uppercase tracking-wider opacity-90">
                  CANN Members Only
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold font-rosarivo mb-4">
                CANN Townhall – Ideation Workshop
              </h1>
              <p className="text-lg opacity-90 mb-6">
                Join us for an interactive workshop to shape the future of amyloidosis care in Canada.
              </p>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Date TBD</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Virtual Event</span>
                </div>
              </div>
            </div>

            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Event Registration
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Please fill out the form below to register for this event. Only CANN members can register.
              </p>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300">
                            First Name <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter your first name"
                              className="h-12 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                              data-testid="input-firstName"
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
                          <FormLabel className="text-gray-700 dark:text-gray-300">
                            Last Name <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter your last name"
                              className="h-12 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                              data-testid="input-lastName"
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
                        <FormLabel className="text-gray-700 dark:text-gray-300">
                          Email Address <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="Enter your email address"
                            className="h-12 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
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
                        <FormLabel className="text-gray-700 dark:text-gray-300">
                          Centre or Clinic Name/Institution <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter your institution name"
                            className="h-12 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                            data-testid="input-institution"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isCANNMember"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300">
                          I am a CANN member <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex gap-6 mt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="Yes"
                                id="cann-yes"
                                data-testid="radio-cannMember-yes"
                              />
                              <Label htmlFor="cann-yes" className="cursor-pointer text-gray-700 dark:text-gray-300">
                                Yes
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="No"
                                id="cann-no"
                                data-testid="radio-cannMember-no"
                              />
                              <Label htmlFor="cann-no" className="cursor-pointer text-gray-700 dark:text-gray-300">
                                No
                              </Label>
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
                        "Register Now"
                      )}
                    </Button>
                  </div>

                  {registerMutation.isError && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-center">
                      Registration failed. Please try again.
                    </div>
                  )}
                </form>
              </Form>
            </div>
          </div>
        </motion.div>
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-[#00AFE6]/20 to-[#00DD89]/20 rounded-full">
              <CheckCircle2 className="w-8 h-8 text-[#00DD89]" />
            </div>
            <DialogTitle className="text-center text-xl">Registration Successful!</DialogTitle>
            <DialogDescription className="text-center text-base pt-2">
              Thank you for registering for the CANN Townhall. Further details about this event will be provided to you via email.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Link href="/events">
              <Button
                className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white"
                data-testid="button-back-to-events"
              >
                Back to Events
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
