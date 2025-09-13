import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import {
  Users,
  Heart,
  Upload,
  MessageSquare,
  Calendar,
  ExternalLink,
  CheckCircle,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  Shield,
  UserPlus,
  Gift,
  Network,
  Stethoscope,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import healthcareProfessionalImg from "@assets/DSC02826_1750068895453.jpg";

const membershipFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  role: z.string().min(1, "Please select your role"),
  organization: z.string().optional(),
  province: z.string().min(1, "Please select your province"),
  interests: z
    .array(z.string())
    .min(1, "Please select at least one area of interest"),
  privacyConsent: z
    .boolean()
    .refine((val) => val === true, "You must agree to the privacy policy"),
  codeOfConduct: z
    .boolean()
    .refine((val) => val === true, "You must agree to the code of conduct"),
});

type MembershipFormData = z.infer<typeof membershipFormSchema>;

const provinces = [
  "Alberta",
  "British Columbia", 
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Northwest Territories",
  "Nova Scotia",
  "Nunavut",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Yukon",
];

const roles = [
  "Cardiologist",
  "Hematologist",
  "Nephrologist",
  "Neurologist",
  "Pathologist",
  "Nuclear Medicine Physician",
  "Radiologist",
  "Family Medicine Physician",
  "Internal Medicine Physician",
  "Nurse",
  "Nurse Practitioner",
  "Pharmacist",
  "Researcher",
  "Laboratory Technician",
  "Other Healthcare Professional",
  "Patient",
  "Caregiver",
  "Other",
];

const interestAreas = [
  "Cardiac Amyloidosis",
  "Hereditary Amyloidosis",
  "Light Chain Amyloidosis",
  "Clinical Research",
  "Basic Science Research",
  "Patient Education",
  "Healthcare Professional Education",
  "Clinical Guidelines",
  "Quality Improvement",
  "Other",
];

const upcomingEvents = [
  {
    id: 1,
    title: "CAS Journal Club - September Session",
    date: "2025-09-25",
    time: "3:00 PM - 4:00 PM MST",
    location: "Virtual Event",
    type: "Journal Club",
    description: "National initiative launched May 8, 2025, fostering learning and discussion around recent research and publications in amyloidosis. One-hour virtual session designed for CAS members to deepen clinical and scientific knowledge through collaborative discussion. ✅ Confirmed session.",
    image: "/api/placeholder/400/250",
    registrationUrl: "#",
    confirmed: true
  },
  {
    id: 2,
    title: "CANN Educational Series",
    date: "2025-10-07",
    time: "2:00 – 3:00 PM MST",
    location: "Virtual Event", 
    type: "Educational Series",
    description: "Organized by the Canadian Amyloidosis Nursing Network (CANN), these events occur regularly 3-4 times per year.This educational series provides ongoing professional development opportunities for nurses and healthcare professionals engaged in amyloidosis care. Topic, speaker, and exact date are coordinated by the CANN Executive Committee. Visit the CANN Events page for more details.",
    image: "/api/placeholder/400/250",
    registrationUrl: "#"
  },
  {
    id: 3,
    title: "CAS Journal Club - November Session",
    date: "2025-11-27",
    time: "3:00 PM - 4:00 PM MST",
    location: "Virtual Event",
    type: "Journal Club", 
    description: "Continuing the national journal club initiative for CAS members. One-hour virtual session focusing on recent amyloidosis research and publications. Registration and access details to be confirmed.",
    image: "/api/placeholder/400/250",
    registrationUrl: "#"
  }
];

const recentEvents: any[] = [];
const pastEvents: any[] = [];

const formatEventDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function GetInvolved() {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  const form = useForm<MembershipFormData>({
    resolver: zodResolver(membershipFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      organization: "",
      province: "",
      interests: [],
      privacyConsent: false,
      codeOfConduct: false,
    },
  });

  const membershipMutation = useMutation({
    mutationFn: async (data: MembershipFormData) => {
      return apiRequest("/api/membership", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Thank you for your membership application. We'll review it and get back to you soon.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Application Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: MembershipFormData) => {
    membershipMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{ backgroundImage: `url(${healthcareProfessionalImg})` }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00AFE6]/20 via-white/50 to-[#00DD89]/15 dark:from-[#00AFE6]/30 dark:via-gray-900/50 dark:to-[#00DD89]/25" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-20 w-72 h-72 bg-[#00AFE6]/10 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-96 h-96 bg-[#00DD89]/10 rounded-full blur-3xl"
            animate={{
              x: [0, -120, 0],
              y: [0, 80, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00AFE6]/20 to-[#00DD89]/20 backdrop-blur-sm border border-[#00AFE6]/30 rounded-full px-6 py-2 mb-6"
          >
            <Heart className="w-4 h-4 text-[#00AFE6]" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Join Our Community</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 font-rosarivo"
          >
            <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
              Get Involved
            </span>
            <br />
            <span className="text-gray-800 dark:text-white">
              with CAS
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed"
          >
            Join a growing community of healthcare professionals, researchers, patients, and caregivers 
            committed to advancing amyloidosis care in Canada.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button 
              className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/90 hover:to-[#00DD89]/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group px-8 py-3 text-lg"
              onClick={() => document.getElementById('membership')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Become a Member
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            
            <Button 
              variant="outline" 
              className="border-2 border-[#00AFE6] text-[#00AFE6] hover:bg-[#00AFE6] hover:text-white transition-all duration-300 px-8 py-3 text-lg"
              onClick={() => document.getElementById('volunteer')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Volunteer With Us
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Membership Section */}
      <section id="membership" className="py-24 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-transparent to-cyan-100/20 dark:from-gray-800/50 dark:via-transparent dark:to-gray-700/30"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00AFE6]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00DD89]/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 backdrop-blur-xl border border-[#00AFE6]/20 rounded-full px-6 py-3 mb-8 shadow-lg">
              <UserPlus className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-gray-800 dark:text-white/90 font-medium">Membership</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-rosarivo mb-6 leading-tight">
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Join CAS
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-white/70 max-w-3xl mx-auto leading-relaxed px-4">
              Become part of a community dedicated to advancing amyloidosis care and research across Canada.
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Benefits Section */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 font-rosarivo">
                    Member Benefits
                  </h3>
                  <div className="space-y-6">
                    {[
                      {
                        icon: Network,
                        title: "Professional Network",
                        description: "Connect with healthcare professionals, researchers, and experts across Canada working in amyloidosis care."
                      },
                      {
                        icon: MessageSquare,
                        title: "Knowledge Sharing",
                        description: "Access to educational resources, clinical guidelines, and the latest research findings in amyloidosis."
                      },
                      {
                        icon: Calendar,
                        title: "Exclusive Events",
                        description: "Priority access to conferences, workshops, webinars, and continuing education opportunities."
                      },
                      {
                        icon: Shield,
                        title: "Clinical Support",
                        description: "Collaboration opportunities and access to expert consultation for complex cases."
                      }
                    ].map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-4 p-6 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-[#00AFE6]/20 to-[#00DD89]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                          <benefit.icon className="w-6 h-6 text-[#00AFE6]" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                            {benefit.title}
                          </h4>
                          <p className="text-gray-600 dark:text-white/70 text-sm leading-relaxed">
                            {benefit.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Membership Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 dark:border-white/20 shadow-2xl"
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 font-rosarivo">
                    Membership Application
                  </h3>
                  <p className="text-gray-600 dark:text-white/70">
                    Fill out the form below to join the Canadian Amyloidosis Society
                  </p>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-white/90">
                              First Name *
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your first name" 
                                {...field}
                                className="bg-white/70 dark:bg-gray-800/70 border-gray-300/50 dark:border-white/20 focus:border-[#00AFE6] dark:focus:border-[#00AFE6] transition-all duration-300"
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
                            <FormLabel className="text-gray-700 dark:text-white/90">
                              Last Name *
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your last name" 
                                {...field}
                                className="bg-white/70 dark:bg-gray-800/70 border-gray-300/50 dark:border-white/20 focus:border-[#00AFE6] dark:focus:border-[#00AFE6] transition-all duration-300"
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
                          <FormLabel className="text-gray-700 dark:text-white/90">
                            Email Address *
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="Enter your email address" 
                              {...field}
                              className="bg-white/70 dark:bg-gray-800/70 border-gray-300/50 dark:border-white/20 focus:border-[#00AFE6] dark:focus:border-[#00AFE6] transition-all duration-300"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-white/90">
                              Role/Profession *
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white/70 dark:bg-gray-800/70 border-gray-300/50 dark:border-white/20 focus:border-[#00AFE6] dark:focus:border-[#00AFE6] transition-all duration-300">
                                  <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {roles.map((role) => (
                                  <SelectItem key={role} value={role}>
                                    {role}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="province"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-white/90">
                              Province/Territory *
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white/70 dark:bg-gray-800/70 border-gray-300/50 dark:border-white/20 focus:border-[#00AFE6] dark:focus:border-[#00AFE6] transition-all duration-300">
                                  <SelectValue placeholder="Select your province" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {provinces.map((province) => (
                                  <SelectItem key={province} value={province}>
                                    {province}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="organization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-white/90">
                            Organization/Institution
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your organization (optional)" 
                              {...field}
                              className="bg-white/70 dark:bg-gray-800/70 border-gray-300/50 dark:border-white/20 focus:border-[#00AFE6] dark:focus:border-[#00AFE6] transition-all duration-300"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="interests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-white/90">
                            Areas of Interest * (Select all that apply)
                          </FormLabel>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-300/50 dark:border-white/20">
                            {interestAreas.map((area) => (
                              <div key={area} className="flex items-center space-x-2">
                                <Checkbox
                                  id={area}
                                  checked={field.value?.includes(area)}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    if (checked) {
                                      field.onChange([...currentValues, area]);
                                    } else {
                                      field.onChange(currentValues.filter((value) => value !== area));
                                    }
                                  }}
                                  className="border-[#00AFE6] data-[state=checked]:bg-[#00AFE6] data-[state=checked]:border-[#00AFE6]"
                                />
                                <label
                                  htmlFor={area}
                                  className="text-sm text-gray-700 dark:text-white/80 cursor-pointer"
                                >
                                  {area}
                                </label>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-300/50 dark:border-white/20">
                      <FormField
                        control={form.control}
                        name="privacyConsent"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="border-[#00AFE6] data-[state=checked]:bg-[#00AFE6] data-[state=checked]:border-[#00AFE6] mt-1"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm text-gray-700 dark:text-white/80 cursor-pointer">
                                I agree to the privacy policy and consent to the collection and use of my personal information *
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="codeOfConduct"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="border-[#00AFE6] data-[state=checked]:bg-[#00AFE6] data-[state=checked]:border-[#00AFE6] mt-1"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm text-gray-700 dark:text-white/80 cursor-pointer">
                                I agree to abide by the CAS code of conduct and professional standards *
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={membershipMutation.isPending}
                      className="w-full bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/90 hover:to-[#00DD89]/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group py-3 text-lg font-semibold"
                    >
                      {membershipMutation.isPending ? (
                        "Submitting..."
                      ) : (
                        <>
                          Submit Application
                          <CheckCircle className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform duration-300" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Section */}
      <section id="volunteer" className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/30 via-transparent to-blue-100/20 dark:from-gray-800/30 dark:via-transparent dark:to-gray-700/20"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00DD89]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#00AFE6]/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00DD89]/10 to-[#00AFE6]/10 backdrop-blur-xl border border-[#00DD89]/20 rounded-full px-6 py-3 mb-8 shadow-lg">
              <Heart className="w-5 h-5 text-[#00DD89]" />
              <span className="text-gray-800 dark:text-white/90 font-medium">Volunteer</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-rosarivo mb-6 leading-tight">
              <span className="bg-gradient-to-r from-[#00DD89] to-[#00AFE6] bg-clip-text text-transparent">
                Make a Difference
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-white/70 max-w-3xl mx-auto leading-relaxed px-4">
              Join our volunteer team and contribute to advancing amyloidosis care and awareness across Canada.
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: MessageSquare,
                  title: "Education & Outreach",
                  description: "Help develop educational materials, organize webinars, and support community outreach programs.",
                  color: "from-[#00DD89]/20 to-[#00AFE6]/20"
                },
                {
                  icon: Upload,
                  title: "Content Creation",
                  description: "Contribute to our knowledge base by creating articles, case studies, and educational resources.",
                  color: "from-[#00AFE6]/20 to-[#00DD89]/20"
                },
                {
                  icon: Network,
                  title: "Research Support",
                  description: "Assist with research initiatives, data collection, and analysis to advance amyloidosis understanding.",
                  color: "from-[#00DD89]/20 to-[#00AFE6]/20"
                },
                {
                  icon: Calendar,
                  title: "Event Coordination",
                  description: "Help organize conferences, workshops, and community events to bring professionals together.",
                  color: "from-[#00AFE6]/20 to-[#00DD89]/20"
                },
                {
                  icon: Gift,
                  title: "Patient Support",
                  description: "Contribute to patient education initiatives and support programs for those affected by amyloidosis.",
                  color: "from-[#00DD89]/20 to-[#00AFE6]/20"
                },
                {
                  icon: Shield,
                  title: "Quality Assurance",
                  description: "Help review and validate clinical guidelines, educational materials, and research protocols.",
                  color: "from-[#00AFE6]/20 to-[#00DD89]/20"
                }
              ].map((opportunity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Card className="bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-xl border border-gray-200/60 dark:border-white/20 hover:border-[#00AFE6]/50 dark:hover:border-[#00AFE6]/60 hover:shadow-2xl hover:shadow-[#00AFE6]/15 transition-all duration-500 h-full group-hover:scale-105 rounded-3xl overflow-hidden">
                    <CardContent className="p-8">
                      <div className={`w-16 h-16 bg-gradient-to-br ${opportunity.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <opportunity.icon className="w-8 h-8 text-[#00AFE6] group-hover:text-[#00DD89] transition-colors duration-300" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 leading-tight group-hover:text-[#00AFE6] transition-colors duration-300">
                        {opportunity.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-white/70 text-sm leading-relaxed mb-6">
                        {opportunity.description}
                      </p>
                      
                      <Button 
                        variant="outline" 
                        className="w-full border-2 border-[#00AFE6]/50 text-[#00AFE6] hover:bg-[#00AFE6] hover:text-white transition-all duration-300 group-hover:border-[#00DD89]/50 group-hover:text-[#00DD89] group-hover:hover:bg-[#00DD89]"
                      >
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mt-16"
            >
              <div className="bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-xl rounded-3xl p-12 border border-gray-200/50 dark:border-white/20 shadow-2xl max-w-4xl mx-auto">
                <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 font-rosarivo">
                  Ready to Get Started?
                </h3>
                <p className="text-gray-600 dark:text-white/70 mb-8 text-lg leading-relaxed">
                  Contact us to learn more about volunteer opportunities and how you can contribute 
                  to advancing amyloidosis care in Canada.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    className="bg-gradient-to-r from-[#00DD89] to-[#00AFE6] hover:from-[#00DD89]/90 hover:to-[#00AFE6]/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group px-8 py-3 text-lg"
                  >
                    Contact Us
                    <Mail className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform duration-300" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="border-2 border-[#00AFE6] text-[#00AFE6] hover:bg-[#00AFE6] hover:text-white transition-all duration-300 px-8 py-3 text-lg"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contribute Content Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-white/10 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-transparent to-cyan-100/20 dark:from-gray-800/50 dark:via-transparent dark:to-gray-700/30"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00AFE6]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00DD89]/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 backdrop-blur-xl border border-[#00AFE6]/20 rounded-full px-6 py-3 mb-8 shadow-lg">
              <Upload className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-gray-800 dark:text-white/90 font-medium">Contribute</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-rosarivo mb-6 leading-tight">
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Share Your Expertise
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-white/70 max-w-3xl mx-auto leading-relaxed px-4">
              Help build our knowledge base by contributing educational content, case studies, and research insights.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: MessageSquare,
                  title: "Educational Articles",
                  description: "Write articles about amyloidosis diagnosis, treatment, and management for healthcare professionals.",
                  button: "Submit Article"
                },
                {
                  icon: AlertCircle,
                  title: "Case Studies",
                  description: "Share interesting cases that could help other professionals in their clinical practice.",
                  button: "Submit Case"
                },
                {
                  icon: Network,
                  title: "Research Findings",
                  description: "Present your research results and findings to advance the field of amyloidosis care.",
                  button: "Share Research"
                },
                {
                  icon: Stethoscope,
                  title: "Clinical Guidelines",
                  description: "Contribute to the development and refinement of clinical practice guidelines.",
                  button: "Join Guidelines"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Card className="bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-xl border border-gray-200/60 dark:border-white/20 hover:border-[#00AFE6]/50 dark:hover:border-[#00AFE6]/60 hover:shadow-2xl hover:shadow-[#00AFE6]/15 transition-all duration-500 h-full group-hover:scale-105 rounded-3xl overflow-hidden">
                    <CardContent className="p-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#00AFE6]/20 to-[#00DD89]/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <item.icon className="w-8 h-8 text-[#00AFE6] group-hover:text-[#00DD89] transition-colors duration-300" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 leading-tight group-hover:text-[#00AFE6] transition-colors duration-300">
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-white/70 text-sm leading-relaxed mb-6">
                        {item.description}
                      </p>
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/90 hover:to-[#00DD89]/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
                      >
                        {item.button}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Submission Guidelines */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mt-16"
            >
              <div className="bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-xl rounded-3xl p-10 border border-gray-200/50 dark:border-white/20 shadow-2xl">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 font-rosarivo">
                    Submission Guidelines
                  </h3>
                  <p className="text-gray-600 dark:text-white/70 leading-relaxed">
                    All submissions undergo peer review to ensure quality and accuracy
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {[
                    {
                      step: "1",
                      title: "Prepare Content",
                      description: "Follow our formatting guidelines and ensure content is original and evidence-based"
                    },
                    {
                      step: "2", 
                      title: "Submit for Review",
                      description: "Submit through our portal where it will be reviewed by our editorial board"
                    },
                    {
                      step: "3",
                      title: "Publication",
                      description: "Approved content is published and shared with the CAS community"
                    }
                  ].map((step, index) => (
                    <div key={index} className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                        {step.step}
                      </div>
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                        {step.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-white/70 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <Button 
                    className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/90 hover:to-[#00DD89]/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group px-8 py-3 text-lg"
                  >
                    View Full Guidelines
                    <ExternalLink className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Professional Development Section */}
      <section className="py-24 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-white/10 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/30 via-transparent to-blue-100/20 dark:from-gray-800/30 dark:via-transparent dark:to-gray-700/20"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00DD89]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#00AFE6]/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00DD89]/10 to-[#00AFE6]/10 backdrop-blur-xl border border-[#00DD89]/20 rounded-full px-6 py-3 mb-8 shadow-lg">
              <Stethoscope className="w-5 h-5 text-[#00DD89]" />
              <span className="text-gray-800 dark:text-white/90 font-medium">Professional Development</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-rosarivo mb-6 leading-tight">
              <span className="bg-gradient-to-r from-[#00DD89] to-[#00AFE6] bg-clip-text text-transparent">
                Advance Your Expertise
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-white/70 max-w-3xl mx-auto leading-relaxed px-4">
              Access continuing education opportunities, certifications, and mentorship programs 
              designed for amyloidosis care professionals.
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Programs List */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                {[
                  {
                    icon: Calendar,
                    title: "Continuing Education Credits",
                    description: "Earn CME/CNE credits through our accredited educational programs and conferences."
                  },
                  {
                    icon: Network,
                    title: "Mentorship Program",
                    description: "Connect with experienced professionals for guidance in amyloidosis care and research."
                  },
                  {
                    icon: Shield,
                    title: "Certification Programs",
                    description: "Specialized certification tracks for different aspects of amyloidosis diagnosis and treatment."
                  },
                  {
                    icon: MessageSquare,
                    title: "Clinical Discussions",
                    description: "Regular case discussion forums and multidisciplinary team meetings."
                  }
                ].map((program, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 p-6 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-[#00DD89]/20 to-[#00AFE6]/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <program.icon className="w-6 h-6 text-[#00DD89] group-hover:text-[#00AFE6] transition-colors duration-300" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-[#00DD89] transition-colors duration-300">
                        {program.title}
                      </h4>
                      <p className="text-gray-600 dark:text-white/70 text-sm leading-relaxed">
                        {program.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Call to Action Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-xl rounded-3xl p-10 border border-gray-200/50 dark:border-white/20 shadow-2xl relative overflow-hidden"
              >
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00DD89]/10 to-[#00AFE6]/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#00AFE6]/10 to-[#00DD89]/10 rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#00DD89]/20 to-[#00AFE6]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Stethoscope className="w-10 h-10 text-[#00DD89]" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 font-rosarivo">
                      Start Your Journey
                    </h3>
                    <p className="text-gray-600 dark:text-white/70 leading-relaxed">
                      Whether you're new to amyloidosis care or looking to advance your expertise, 
                      we have programs tailored to your needs.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Button 
                      className="w-full bg-gradient-to-r from-[#00DD89] to-[#00AFE6] hover:from-[#00DD89]/90 hover:to-[#00AFE6]/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group py-3 text-lg font-semibold"
                    >
                      Explore Programs
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-2 border-[#00AFE6]/50 text-[#00AFE6] hover:bg-[#00AFE6] hover:text-white transition-all duration-300"
                    >
                      Contact Coordinator
                    </Button>
                  </div>

                  {/* Floating accent elements */}
                  <motion.div
                    className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center"
                    animate={{
                      y: [0, -8, 0],
                      rotate: [0, 5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Stethoscope className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}