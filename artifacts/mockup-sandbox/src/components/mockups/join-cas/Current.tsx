import './_group.css';
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
  Sparkles,
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
import { casRegistrationSchema, type CASRegistrationForm } from "./schema";

export function Current() {
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CASRegistrationForm>({
    resolver: zodResolver(casRegistrationSchema),
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

  const onSubmit = async (data: CASRegistrationForm) => {
    setIsSubmitting(true);
    console.log("[Mockup] CAS Registration submission:", data);
    await new Promise((r) => setTimeout(r, 400));
    setSubmissionId("MOCKUP-" + Math.random().toString(36).slice(2, 10).toUpperCase());
    setShowConfirmationModal(true);
    form.reset();
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
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
                CAS &amp; CANN
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4 max-w-2xl mx-auto leading-relaxed">
              Become part of Canada's premier professional network for amyloidosis care.
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
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Yes" id="cas-yes" />
                                <Label htmlFor="cas-yes">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="No" id="cas-no" />
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
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Yes" id="cann-yes" />
                                <Label htmlFor="cann-yes">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="No" id="cann-no" />
                                <Label htmlFor="cann-no">No</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Questions 3-10: Member Information */}
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
                            <FormField
                              control={form.control}
                              name="fullName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>3. Full Name (First and Last) *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your full name" {...field} />
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
                                  <FormLabel>4. Email Address *</FormLabel>
                                  <FormControl>
                                    <Input type="email" placeholder="Enter your email address" {...field} />
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
                                  <FormLabel>5. Professional designation *</FormLabel>
                                  <FormDescription>
                                    e.g. physician, nurse, genetic counsellor, other
                                  </FormDescription>
                                  <FormControl>
                                    <Input placeholder="Enter your professional designation" {...field} />
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
                                  <FormLabel>6. Sub-specialty Area of Focus *</FormLabel>
                                  <FormDescription>
                                    e.g., Cardiology, Hematology, Neurology
                                  </FormDescription>
                                  <FormControl>
                                    <Input placeholder="Enter your sub-specialty" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="amyloidosisType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>7. In my practice, I primarily care for patients with the following type(s) of amyloidosis: *</FormLabel>
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      value={field.value}
                                      className="space-y-3"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="ATTR" id="type-attr" />
                                        <Label htmlFor="type-attr">ATTR</Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="AL" id="type-al" />
                                        <Label htmlFor="type-al">AL</Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Both ATTR and AL" id="type-both" />
                                        <Label htmlFor="type-both">Both ATTR and AL</Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Other" id="type-other" />
                                        <Label htmlFor="type-other">Other</Label>
                                      </div>
                                    </RadioGroup>
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
                                  <FormLabel>8. Centre or Clinic Name / Institution *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your institution name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

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
                                    >
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Yes" id="map-yes" />
                                        <Label htmlFor="map-yes">Yes</Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="No" id="map-no" />
                                        <Label htmlFor="map-no">No</Label>
                                      </div>
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <AnimatePresence>
                              {wantsServicesMapInclusion === "Yes" && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3, ease: "easeInOut" }}
                                  className="overflow-hidden"
                                >
                                  <div className="pl-4 border-l-2 border-primary/30 space-y-4 mt-2">
                                    <FormField
                                      control={form.control}
                                      name="centerName"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Center or Clinic Name</FormLabel>
                                          <FormControl>
                                            <Input {...field} placeholder="Enter your center or clinic name" />
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
                                          <FormLabel>Center or Clinic Address</FormLabel>
                                          <FormControl>
                                            <Input {...field} placeholder="Enter your center or clinic address" />
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
                                          <FormLabel>Center or Clinic Phone Number</FormLabel>
                                          <FormControl>
                                            <Input {...field} placeholder="Enter your center or clinic phone number" />
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
                                          <FormLabel>Center or Clinic Fax Number</FormLabel>
                                          <FormControl>
                                            <Input {...field} placeholder="Enter your center or clinic fax number" />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            <FormField
                              control={form.control}
                              name="wantsCommunications"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>10. I would like to receive communication from the Canadian Amyloidosis Society (CAS): *</FormLabel>
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      value={field.value}
                                      className="flex gap-6"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Yes" id="comm-yes" />
                                        <Label htmlFor="comm-yes">Yes</Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="No" id="comm-no" />
                                        <Label htmlFor="comm-no">No</Label>
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

                    {/* Question 11: CANN Communications */}
                    <AnimatePresence>
                      {wantsCANNMembership === "Yes" && (
                        <motion.div
                          initial={shouldReduceMotion ? {} : { opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={shouldReduceMotion ? {} : { opacity: 0 }}
                          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="bg-gradient-to-br from-[#E6F8FF] to-[#F0FBFF] dark:from-[#00AFE6]/10 dark:to-[#00AFE6]/5 p-4 sm:p-6 md:p-8 rounded-2xl border border-[#00AFE6]/20 shadow-sm">
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
                                    >
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Yes" id="cann-comm-yes" />
                                        <Label htmlFor="cann-comm-yes">Yes</Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="No" id="cann-comm-no" />
                                        <Label htmlFor="cann-comm-no">No</Label>
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

                    {/* Non-member Contact Fallback */}
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
                                    <Input placeholder="Enter your name" {...field} />
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
                                    <Input type="email" placeholder="Enter your email" {...field} />
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
                                    <Textarea placeholder="Please share why you're reaching out" {...field} rows={4} />
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
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-full px-12 py-6 text-lg font-semibold shadow-lg"
                      >
                        {isSubmitting ? (
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
              Membership Registration Submitted!
            </DialogTitle>
            <DialogDescription className="text-center text-sm sm:text-base">
              We've received your form submission and we will be in touch soon with membership details.
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
