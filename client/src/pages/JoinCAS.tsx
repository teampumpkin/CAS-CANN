import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Heart, 
  Users, 
  Mail, 
  Phone, 
  ArrowRight,
  Check,
  UserPlus,
  BookOpen,
  Shield,
  Star,
  Handshake,
  Stethoscope,
  Upload,
  Vote,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  FileText,
  Network,
  Gift,
  UserCheck,
  Globe,
  Calendar,
  Award,
  Gavel,
  Languages,
  Info,
  MapPin,
  Building,
  GraduationCap,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const membershipBenefits = [
  {
    icon: Upload,
    title: "Resource Upload Rights",
    description: "Submit and share clinical tools, protocols, and educational materials with the entire CAS community"
  },
  {
    icon: Vote,
    title: "Governance Voice",
    description: "Participate in CAS governance decisions and vote on important policy matters affecting amyloidosis care"
  },
  {
    icon: Network,
    title: "Professional Network",
    description: "Access to exclusive professional network of amyloidosis specialists across Canada"
  },
  {
    icon: Gift,
    title: "Premium Tools Access",
    description: "Early access to new clinical tools, research findings, and professional development resources"
  },
  {
    icon: Calendar,
    title: "Priority Event Access",
    description: "Priority registration for conferences, webinars, and professional development events"
  },
  {
    icon: Award,
    title: "Recognition & Listing",
    description: "Professional recognition and listing in the CAS member directory with your specialization"
  }
];

const whoCanJoin = [
  {
    icon: Stethoscope,
    title: "Healthcare Professionals",
    description: "Physicians, nurses, allied health professionals involved in amyloidosis care",
    requirements: "Must have active healthcare license and clinical experience"
  },
  {
    icon: BookOpen,
    title: "Researchers & Academics",
    description: "Scientists, academics, and research professionals studying amyloidosis",
    requirements: "Must be affiliated with recognized research institution"
  },
  {
    icon: Shield,
    title: "Healthcare Administrators",
    description: "Healthcare system leaders and administrators managing amyloidosis programs",
    requirements: "Must hold leadership role in healthcare organization"
  },
  {
    icon: Users,
    title: "Patient Advocates",
    description: "Patient representatives and advocacy group leaders",
    requirements: "Must represent patient community or advocacy organization"
  }
];

const approvalProcess = [
  {
    step: 1,
    title: "Application Review",
    description: "Initial review of application and credentials verification",
    timeline: "3-5 business days"
  },
  {
    step: 2,
    title: "Credential Verification",
    description: "Verification of professional credentials and organizational affiliation",
    timeline: "5-7 business days"
  },
  {
    step: 3,
    title: "Committee Approval",
    description: "Final review by CAS membership committee",
    timeline: "7-10 business days"
  },
  {
    step: 4,
    title: "Welcome & Onboarding",
    description: "Welcome package and access to member resources",
    timeline: "1-2 business days"
  }
];

// Form validation schema
const membershipFormSchema = z.object({
  wantsMembership: z.enum(["yes", "no"], {
    required_error: "Please indicate if you want to become a member.",
  }),
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  discipline: z.string().min(2, "Please specify your professional discipline."),
  position: z.string().min(2, "Please specify your current position."),
  institution: z.string().min(2, "Please specify your institution/workplace."),
  address: z.string().min(5, "Please provide your complete address."),
  city: z.string().min(2, "Please specify your city."),
  province: z.string().min(2, "Please select your province."),
  postalCode: z.string().min(5, "Please provide a valid postal code."),
  yearsExperience: z.string().min(1, "Please specify your years of experience."),
  amyloidosisExperience: z.string().optional(),
  includeInMap: z.enum(["yes", "no"], {
    required_error: "Please indicate if you want to be included in the services map.",
  }),
  specializations: z.array(z.string()).optional(),
  additionalInfo: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
});

type MembershipFormData = z.infer<typeof membershipFormSchema>;

export default function JoinCAS() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MembershipFormData>({
    resolver: zodResolver(membershipFormSchema),
    defaultValues: {
      wantsMembership: undefined,
      fullName: "",
      email: "",
      phone: "",
      discipline: "",
      position: "",
      institution: "",
      address: "",
      city: "",
      province: "",
      postalCode: "",
      yearsExperience: "",
      amyloidosisExperience: "",
      includeInMap: undefined,
      specializations: [],
      additionalInfo: "",
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: MembershipFormData) => {
    setIsSubmitting(true);
    try {
      // Here you would typically submit to your backend
      console.log("Form Data:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Application Submitted Successfully!",
        description: "Thank you for your membership application. We'll review it within 2-3 weeks and contact you with updates.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
              <span className="text-sm font-medium text-gray-900 dark:text-white/90">Professional Membership</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-rosarivo mb-6 leading-tight text-gray-900 dark:text-white">
              Join the{" "}
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Canadian Amyloidosis Society
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Become part of Canada's premier professional network for amyloidosis care. Access exclusive clinical tools, contribute to governance decisions, and collaborate with leading experts across the country.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => document.getElementById('join-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-10 py-6 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-[#00AFE6]/25 transition-all duration-300 group"
              >
                <span>Register for Membership</span>
                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                variant="outline"
                onClick={() => document.getElementById('why-join')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-[#00AFE6]/30 text-[#00AFE6] hover:bg-[#00AFE6]/10 px-8 py-6 rounded-2xl font-semibold text-lg"
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
              Why Join <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">CAS?</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-white/70 max-w-3xl mx-auto">
              CAS membership provides exclusive access to professional tools, governance participation, and a network of Canada's leading amyloidosis experts.
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
                      <CardTitle className="text-gray-900 dark:text-white">{benefit.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-white/70">{benefit.description}</p>
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
              Who Can <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">Join?</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-white/70 max-w-3xl mx-auto">
              CAS membership is open to qualified professionals who contribute to amyloidosis care, research, and patient advocacy in Canada.
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
                      <CardTitle className="text-gray-900 dark:text-white">{category.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-white/70 mb-4">{category.description}</p>
                    <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-3xl">
                      <p className="text-sm text-gray-600 dark:text-white/60">
                        <strong>Requirements:</strong> {category.requirements}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What Happens Next Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-rosarivo text-gray-900 dark:text-white mb-4">
              What Happens <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">Next?</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-white/70 max-w-3xl mx-auto">
              Our comprehensive review process ensures that all members meet professional standards while providing a streamlined approval experience.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <Alert className="bg-[#00AFE6]/10 border-[#00AFE6]/30 mb-8">
              <Clock className="w-4 h-4 text-[#00AFE6]" />
              <AlertDescription className="text-gray-900 dark:text-white/90">
                <strong>Total Review Time: 2-3 weeks</strong> - We aim to process applications as quickly as possible while maintaining high standards.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {approvalProcess.map((process, index) => (
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
                        <div className="w-8 h-8 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full flex items-center justify-center text-white font-bold">
                          {process.step}
                        </div>
                        <CardTitle className="text-gray-900 dark:text-white">{process.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-white/70 mb-3">{process.description}</p>
                      <Badge variant="secondary" className="bg-[#00AFE6]/10 text-[#00AFE6] border-[#00AFE6]/30">
                        {process.timeline}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section id="join-form" className="py-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-white/10">
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
                Register for <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">CAS</span>
              </h2>
              <p className="text-gray-600 dark:text-white/70 max-w-2xl mx-auto mb-8">
                Join Canada's leading professional network for amyloidosis care. Please provide accurate information to help us process your application efficiently.
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
                  <strong>Terms of Participation & Privacy Policy:</strong> By applying, you agree to abide by our professional standards and governance framework. All personal information is handled according to our privacy policy.
                </AlertDescription>
              </Alert>

              <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#00AFE6]/5 via-transparent to-[#00DD89]/5" />
                
                {/* Form Header */}
                <div className="relative bg-gradient-to-r from-[#00AFE6] to-[#00DD89] p-8 text-center">
                  {/* Floating elements */}
                  <div className="absolute top-4 left-4 w-8 h-8 bg-white/10 rounded-full blur-sm animate-pulse" />
                  <div className="absolute bottom-4 right-4 w-6 h-6 bg-white/10 rounded-full blur-sm animate-pulse delay-1000" />
                  
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3 font-rosarivo">
                    CAS Registration Form
                  </h3>
                  <p className="text-white/90 text-sm max-w-md mx-auto">
                    Complete your professional application below. All fields are secure and confidential.
                  </p>
                  
                  {/* Progress indicators */}
                  <div className="flex justify-center gap-2 mt-6">
                    <div className="w-2 h-2 bg-white/40 rounded-full" />
                    <div className="w-8 h-2 bg-white/60 rounded-full" />
                    <div className="w-2 h-2 bg-white/40 rounded-full" />
                  </div>
                </div>

                {/* Custom Registration Form */}
                <div className="relative bg-white dark:bg-gray-800">
                  {/* Form frame decoration */}
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent dark:from-gray-700/50 pointer-events-none" />
                  
                  <div className="p-8">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        
                        {/* Section 1: Membership Interest */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                            <div className="w-8 h-8 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Membership Interest</h4>
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="wantsMembership"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel className="text-base font-medium">I would like to become a member of the Canadian Amyloidosis Society (CAS) *</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex gap-6"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="yes" id="yes" />
                                      <label htmlFor="yes" className="cursor-pointer">Yes</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="no" id="no" />
                                      <label htmlFor="no" className="cursor-pointer">No</label>
                                    </div>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Section 2: Personal Information */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                            <div className="w-8 h-8 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h4>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="fullName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name (first and last) *</FormLabel>
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
                                  <FormLabel>Email Address *</FormLabel>
                                  <FormControl>
                                    <Input type="email" placeholder="your.email@example.com" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone Number</FormLabel>
                                  <FormControl>
                                    <Input type="tel" placeholder="(555) 123-4567" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        {/* Section 3: Professional Information */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                            <div className="w-8 h-8 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Professional Information</h4>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="discipline"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Discipline (physician, nursing, genetic counsellor, etc) *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., Physician, Nurse, Genetic Counsellor" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="position"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Current Position *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., Cardiologist, Clinical Nurse" {...field} />
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
                                  <FormLabel>Institution/Workplace *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Hospital, clinic, or organization name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="yearsExperience"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Years of Experience *</FormLabel>
                                  <FormControl>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select experience level" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="0-2">0-2 years</SelectItem>
                                        <SelectItem value="3-5">3-5 years</SelectItem>
                                        <SelectItem value="6-10">6-10 years</SelectItem>
                                        <SelectItem value="11-15">11-15 years</SelectItem>
                                        <SelectItem value="16-20">16-20 years</SelectItem>
                                        <SelectItem value="20+">20+ years</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        {/* Section 4: Location Information */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                            <div className="w-8 h-8 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Location Information</h4>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField
                              control={form.control}
                              name="address"
                              render={({ field }) => (
                                <FormItem className="md:col-span-3">
                                  <FormLabel>Address *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Street address" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>City *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="City" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="province"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Province/Territory *</FormLabel>
                                  <FormControl>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select province" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="AB">Alberta</SelectItem>
                                        <SelectItem value="BC">British Columbia</SelectItem>
                                        <SelectItem value="MB">Manitoba</SelectItem>
                                        <SelectItem value="NB">New Brunswick</SelectItem>
                                        <SelectItem value="NL">Newfoundland and Labrador</SelectItem>
                                        <SelectItem value="NS">Nova Scotia</SelectItem>
                                        <SelectItem value="ON">Ontario</SelectItem>
                                        <SelectItem value="PE">Prince Edward Island</SelectItem>
                                        <SelectItem value="QC">Quebec</SelectItem>
                                        <SelectItem value="SK">Saskatchewan</SelectItem>
                                        <SelectItem value="NT">Northwest Territories</SelectItem>
                                        <SelectItem value="NU">Nunavut</SelectItem>
                                        <SelectItem value="YT">Yukon</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="postalCode"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Postal Code *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="A1A 1A1" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="includeInMap"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel className="text-base font-medium">I would like my center/clinic to be included in the Canadian Amyloidosis Services Map *</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex gap-6"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="yes" id="map-yes" />
                                      <label htmlFor="map-yes" className="cursor-pointer">Yes</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="no" id="map-no" />
                                      <label htmlFor="map-no" className="cursor-pointer">No</label>
                                    </div>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Section 5: Additional Information */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                            <div className="w-8 h-8 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full flex items-center justify-center text-white text-sm font-bold">5</div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Additional Information</h4>
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="amyloidosisExperience"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Experience with Amyloidosis Patients</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Briefly describe your experience with amyloidosis patients, research, or related work (optional)"
                                    rows={4}
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="additionalInfo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Additional Information</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Any additional information you'd like to share about your interest in CAS membership (optional)"
                                    rows={3}
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Terms Agreement */}
                        <div className="space-y-6">
                          <FormField
                            control={form.control}
                            name="agreeToTerms"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-gray-50 dark:bg-gray-900">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="cursor-pointer">
                                    I agree to the terms and conditions *
                                  </FormLabel>
                                  <FormDescription>
                                    By submitting this application, I agree to abide by CAS professional standards and governance framework. All personal information will be handled according to our privacy policy.
                                  </FormDescription>
                                  <FormMessage />
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                          <Button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white font-semibold py-6 px-8 rounded-xl hover:shadow-2xl hover:shadow-[#00AFE6]/25 transition-all duration-300 transform hover:scale-105"
                          >
                            {isSubmitting ? (
                              <div className="flex items-center justify-center gap-3">
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                Processing Application...
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-3">
                                <Send className="w-5 h-5" />
                                Submit CAS Membership Application
                              </div>
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </div>

                {/* Enhanced Form Footer */}
                <div className="relative p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700">
                  {/* Trust indicators with enhanced design */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <motion.div 
                      className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">Secure & Encrypted</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">SSL protected</p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">5-10 Minutes</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Average completion</p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">Review in 2-3 Weeks</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Professional review</p>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Help section */}
                  <div className="text-center p-4 bg-[#00AFE6]/5 rounded-xl border border-[#00AFE6]/20">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Need assistance with your application?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button 
                        onClick={() => window.open('https://forms.office.com/Pages/ResponsePage.aspx?id=7KAJxuOlMUaWhhkigL2RUV3g_7vFhtBCm2WYpb7e-YpUMUZNOTlCQ1dTNVJaV09NUzBJUFpCMzg5UC4u', '_blank')}
                        className="inline-flex items-center gap-2 text-[#00AFE6] hover:text-[#00DD89] font-medium transition-colors duration-200"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open in new window
                      </button>
                      <a 
                        href="mailto:info@amyloid.ca"
                        className="inline-flex items-center gap-2 text-[#00AFE6] hover:text-[#00DD89] font-medium transition-colors duration-200"
                      >
                        <Mail className="w-4 h-4" />
                        Email support
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}