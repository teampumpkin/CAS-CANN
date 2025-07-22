import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
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
  Info
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/contexts/LanguageContext";

// Form schema
const joinFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  city: z.string().min(2, "Please enter your city"),
  province: z.string().min(2, "Please enter your province"),
  role: z.enum(["clinician", "researcher", "administrator", "patient", "caregiver", "advocate", "other"]),
  specialty: z.string().optional(),
  organization: z.string().optional(),
  interests: z.array(z.string()).min(1, "Please select at least one area of interest"),
  howHeard: z.string().min(1, "Please tell us how you heard about CAS"),
  message: z.string().optional(),
  newsletter: z.boolean().default(true),
  termsOfParticipation: z.boolean().refine(val => val === true, "You must accept the Terms of Participation"),
  privacyPolicy: z.boolean().refine(val => val === true, "You must accept the Privacy Policy")
});

type JoinFormData = z.infer<typeof joinFormSchema>;

const interestAreas = [
  "Clinical Practice Tools",
  "Diagnostic Pathways", 
  "Research Collaboration",
  "Resource Development",
  "Clinical Guidelines",
  "Professional Education",
  "Policy Development",
  "Quality Improvement",
  "Patient Education",
  "Healthcare System Integration"
];

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

export default function JoinCAS() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const { toast } = useToast();
  const { language } = useLanguage();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<JoinFormData>({
    resolver: zodResolver(joinFormSchema),
    defaultValues: {
      interests: [],
      newsletter: true,
      termsOfParticipation: false,
      privacyPolicy: false
    }
  });

  const joinMutation = useMutation({
    mutationFn: async (data: JoinFormData) => {
      return await apiRequest("POST", "/api/join", data);
    },
    onSuccess: () => {
      toast({
        title: "Welcome to CAS!",
        description: "Thank you for joining our community. We'll be in touch soon.",
      });
      reset();
      setSelectedInterests([]);
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleInterestToggle = (interest: string) => {
    const updatedInterests = selectedInterests.includes(interest)
      ? selectedInterests.filter(i => i !== interest)
      : [...selectedInterests, interest];
    
    setSelectedInterests(updatedInterests);
    setValue("interests", updatedInterests);
  };

  const onSubmit = async (data: JoinFormData) => {
    joinMutation.mutate(data);
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
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-rosarivo mb-6 leading-tight text-gray-900 dark:text-white">
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
                <span>Apply for Membership</span>
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
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

      {/* Join Form Section */}
      <section id="join-form" className="py-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-white/10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Complete Your <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">Application</span>
              </h2>
              <p className="text-gray-600 dark:text-white/70 max-w-2xl mx-auto">
                Join Canada's leading professional network for amyloidosis care. Please provide accurate information to help us process your application efficiently.
              </p>
            </div>

            <Alert className="bg-[#00AFE6]/10 border-[#00AFE6]/30 mb-8">
              <AlertCircle className="w-4 h-4 text-[#00AFE6]" />
              <AlertDescription className="text-gray-900 dark:text-white/90">
                <strong>Terms of Participation & Privacy Policy:</strong> By applying, you agree to abide by our professional standards and governance framework. All personal information is handled according to our privacy policy.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Information */}
              <Card className="bg-white dark:bg-white/10 border-gray-200 dark:border-white/20">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#00AFE6]" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 dark:text-white/80 font-medium mb-2">First Name *</label>
                      <input
                        {...register("firstName")}
                        type="text"
                        className="w-full bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00AFE6]"
                        placeholder="Enter your first name"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-700 dark:text-white/80 font-medium mb-2">Last Name *</label>
                      <input
                        {...register("lastName")}
                        type="text"
                        className="w-full bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00AFE6]"
                        placeholder="Enter your last name"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-700 dark:text-white/80 font-medium mb-2">Email *</label>
                      <input
                        {...register("email")}
                        type="email"
                        className="w-full bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00AFE6]"
                        placeholder="Enter your email address"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-700 dark:text-white/80 font-medium mb-2">Phone *</label>
                      <input
                        {...register("phone")}
                        type="tel"
                        className="w-full bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00AFE6]"
                        placeholder="Enter your phone number"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-700 dark:text-white/80 font-medium mb-2">City *</label>
                      <input
                        {...register("city")}
                        type="text"
                        className="w-full bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00AFE6]"
                        placeholder="Enter your city"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-700 dark:text-white/80 font-medium mb-2">Province *</label>
                      <select
                        {...register("province")}
                        className="w-full bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00AFE6]"
                      >
                        <option value="">Select Province</option>
                        <option value="AB">Alberta</option>
                        <option value="BC">British Columbia</option>
                        <option value="MB">Manitoba</option>
                        <option value="NB">New Brunswick</option>
                        <option value="NL">Newfoundland and Labrador</option>
                        <option value="NS">Nova Scotia</option>
                        <option value="ON">Ontario</option>
                        <option value="PE">Prince Edward Island</option>
                        <option value="QC">Quebec</option>
                        <option value="SK">Saskatchewan</option>
                        <option value="NT">Northwest Territories</option>
                        <option value="NU">Nunavut</option>
                        <option value="YT">Yukon</option>
                      </select>
                      {errors.province && (
                        <p className="text-red-500 text-sm mt-1">{errors.province.message}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Information */}
              <Card className="bg-white dark:bg-white/10 border-gray-200 dark:border-white/20">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-[#00AFE6]" />
                    Professional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 dark:text-white/80 font-medium mb-2">Role *</label>
                      <select
                        {...register("role")}
                        className="w-full bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00AFE6]"
                      >
                        <option value="">Select your role</option>
                        <option value="clinician">Clinician/Healthcare Professional</option>
                        <option value="researcher">Researcher/Academic</option>
                        <option value="administrator">Healthcare Administrator</option>
                        <option value="patient">Patient</option>
                        <option value="caregiver">Caregiver/Family Member</option>
                        <option value="advocate">Patient Advocate</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.role && (
                        <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-700 dark:text-white/80 font-medium mb-2">Specialty (if applicable)</label>
                      <input
                        {...register("specialty")}
                        type="text"
                        className="w-full bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00AFE6]"
                        placeholder="e.g., Cardiology, Nephrology, etc."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-gray-700 dark:text-white/80 font-medium mb-2">Organization (if applicable)</label>
                      <input
                        {...register("organization")}
                        type="text"
                        className="w-full bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00AFE6]"
                        placeholder="Hospital, clinic, research institution, etc."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Areas of Interest */}
              <Card className="bg-white dark:bg-white/10 border-gray-200 dark:border-white/20">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <Heart className="w-5 h-5 text-[#00AFE6]" />
                    Areas of Interest
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-gray-700 dark:text-white/80 font-medium mb-3">Select all areas that apply to you *</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {interestAreas.map((interest) => (
                        <label
                          key={interest}
                          className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                            selectedInterests.includes(interest)
                              ? 'bg-[#00AFE6]/10 border-[#00AFE6]/50 text-[#00AFE6] dark:text-[#00AFE6]'
                              : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/20 text-gray-700 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10'
                          }`}
                          onClick={() => handleInterestToggle(interest)}
                        >
                          <div className="flex items-center">
                            <Checkbox
                              checked={selectedInterests.includes(interest)}
                              onChange={() => handleInterestToggle(interest)}
                              className="data-[state=checked]:bg-[#00AFE6] data-[state=checked]:border-[#00AFE6]"
                            />
                          </div>
                          <span className="text-sm font-medium">{interest}</span>
                        </label>
                      ))}
                    </div>
                    {errors.interests && (
                      <p className="text-red-500 text-sm mt-1">{errors.interests.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-white/80 font-medium mb-2">How did you hear about CAS? *</label>
                    <input
                      {...register("howHeard")}
                      type="text"
                      className="w-full bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00AFE6]"
                      placeholder="e.g., Healthcare provider, website, social media, colleague, etc."
                    />
                    {errors.howHeard && (
                      <p className="text-red-500 text-sm mt-1">{errors.howHeard.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-white/80 font-medium mb-2">Additional Message (optional)</label>
                    <textarea
                      {...register("message")}
                      rows={4}
                      className="w-full bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00AFE6]"
                      placeholder="Tell us more about your interest in joining CAS..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Terms and Conditions */}
              <Card className="bg-white dark:bg-white/10 border-gray-200 dark:border-white/20">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <Gavel className="w-5 h-5 text-[#00AFE6]" />
                    Terms and Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        {...register("termsOfParticipation")}
                        className="mt-1 data-[state=checked]:bg-[#00AFE6] data-[state=checked]:border-[#00AFE6]"
                      />
                      <div className="flex-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-white/80">
                          I agree to the Terms of Participation *
                        </label>
                        <p className="text-sm text-gray-600 dark:text-white/60 mt-1">
                          I understand and agree to abide by CAS professional standards, governance framework, and participation guidelines.{" "}
                          <Link href="/terms-of-participation" className="text-[#00AFE6] hover:underline">
                            Read Terms of Participation
                            <ExternalLink className="w-3 h-3 inline ml-1" />
                          </Link>
                        </p>
                      </div>
                    </div>
                    {errors.termsOfParticipation && (
                      <p className="text-red-500 text-sm">{errors.termsOfParticipation.message}</p>
                    )}

                    <div className="flex items-start gap-3">
                      <Checkbox
                        {...register("privacyPolicy")}
                        className="mt-1 data-[state=checked]:bg-[#00AFE6] data-[state=checked]:border-[#00AFE6]"
                      />
                      <div className="flex-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-white/80">
                          I agree to the Privacy Policy *
                        </label>
                        <p className="text-sm text-gray-600 dark:text-white/60 mt-1">
                          I understand how my personal information will be collected, used, and protected.{" "}
                          <Link href="/privacy-policy" className="text-[#00AFE6] hover:underline">
                            Read Privacy Policy
                            <ExternalLink className="w-3 h-3 inline ml-1" />
                          </Link>
                        </p>
                      </div>
                    </div>
                    {errors.privacyPolicy && (
                      <p className="text-red-500 text-sm">{errors.privacyPolicy.message}</p>
                    )}

                    <div className="flex items-start gap-3">
                      <Checkbox
                        {...register("newsletter")}
                        className="mt-1 data-[state=checked]:bg-[#00AFE6] data-[state=checked]:border-[#00AFE6]"
                      />
                      <div className="flex-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-white/80">
                          Subscribe to CAS Newsletter (optional)
                        </label>
                        <p className="text-sm text-gray-600 dark:text-white/60 mt-1">
                          Receive updates about events, resources, and important announcements.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Language Status & Translation Disclaimer */}
              <Alert className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-2">
                    <Languages className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      language === 'en' 
                        ? 'bg-green-500/20 text-green-700 dark:text-green-300' 
                        : 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
                    }`}>
                      {language === 'en' ? 'Available' : 'Disponible'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <AlertDescription className="text-sm">
                      <div className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                        {language === 'en' ? 'Language Status' : 'Statut de la langue'}
                      </div>
                      <p className="text-blue-700 dark:text-blue-300">
                        {language === 'en' 
                          ? 'This form is available in English. French support is coming soon. You may submit your application in French, and we will respond in your preferred language.'
                          : 'Ce formulaire est disponible en anglais. Le support français arrive bientôt. Vous pouvez soumettre votre candidature en français, et nous répondrons dans votre langue préférée.'
                        }
                      </p>
                    </AlertDescription>
                  </div>
                </div>
              </Alert>

              {/* Submit Button */}
              <div className="text-center">
                <Button
                  type="submit"
                  disabled={joinMutation.isPending}
                  className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-12 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-[#00AFE6]/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {joinMutation.isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      Submit Membership Application
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
                <p className="text-sm text-gray-600 dark:text-white/60 mt-4">
                  We'll review your application and get back to you within 2-3 weeks.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}