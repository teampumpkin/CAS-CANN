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
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import healthcareProfessionalImg from '@assets/DSC02826_1750068895453.jpg';
import summitSaveTheDateImg from '@assets/2025 Amyloidosis Summit Save the Date_page-0001_1753250815238.jpg';

const membershipFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  role: z.string().min(1, "Please select your role"),
  organization: z.string().optional(),
  province: z.string().min(1, "Please select your province"),
  interests: z.array(z.string()).min(1, "Please select at least one area of interest"),
  privacyConsent: z.boolean().refine(val => val === true, "You must agree to the privacy policy"),
  codeOfConduct: z.boolean().refine(val => val === true, "You must agree to the code of conduct"),
});

type MembershipFormData = z.infer<typeof membershipFormSchema>;

const storyFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  storyType: z.string().min(1, "Please select story type"),
  content: z.string().min(50, "Story must be at least 50 characters"),
  authorName: z.string().min(2, "Please provide your name"),
  authorRole: z.string().optional(),
  canFeature: z.boolean(),
  privacyConsent: z.boolean().refine(val => val === true, "You must agree to the privacy policy"),
});

type StoryFormData = z.infer<typeof storyFormSchema>;

const participationWays = [
  {
    icon: UserPlus,
    title: "Join CAS",
    description: "CAS membership is exclusively for healthcare professionals including clinicians, researchers, and health system leaders.",
    action: "Register Now",
    color: "from-[#00AFE6] to-[#00DD89]"
  }
];

const membershipInterests = [
  "Clinical Research",
  "Patient Education",
  "Resource Development",
  "Policy Advocacy",
  "Event Organization",
  "Fundraising",
  "Awareness Campaigns",
  "Professional Development"
];

const provinces = [
  { value: "BC", label: "British Columbia" },
  { value: "AB", label: "Alberta" },
  { value: "SK", label: "Saskatchewan" },
  { value: "MB", label: "Manitoba" },
  { value: "ON", label: "Ontario" },
  { value: "QC", label: "Quebec" },
  { value: "NB", label: "New Brunswick" },
  { value: "NS", label: "Nova Scotia" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "YT", label: "Yukon" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NU", label: "Nunavut" }
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

export default function GetInvolved() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const { toast } = useToast();

  const membershipForm = useForm<MembershipFormData>({
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
    }
  });

  const storyForm = useForm<StoryFormData>({
    resolver: zodResolver(storyFormSchema),
    defaultValues: {
      title: "",
      storyType: "",
      content: "",
      authorName: "",
      authorRole: "",
      canFeature: false,
      privacyConsent: false,
    }
  });

  const membershipMutation = useMutation({
    mutationFn: async (data: MembershipFormData) => {
      return await apiRequest('/api/membership', 'POST', data);
    },
    onSuccess: () => {
      toast({
        title: "Membership Application Submitted",
        description: "Thank you for joining CAS! You'll receive a confirmation email shortly.",
      });
      membershipForm.reset();
      setSelectedInterests([]);
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    }
  });

  const storyMutation = useMutation({
    mutationFn: async (data: StoryFormData) => {
      return await apiRequest('/api/stories', 'POST', data);
    },
    onSuccess: () => {
      toast({
        title: "Story Submitted",
        description: "Thank you for sharing your story! It will be reviewed before publication.",
      });
      storyForm.reset();
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your story. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleInterestToggle = (interest: string) => {
    const updated = selectedInterests.includes(interest)
      ? selectedInterests.filter(i => i !== interest)
      : [...selectedInterests, interest];
    
    setSelectedInterests(updated);
    membershipForm.setValue('interests', updated);
  };

  const onMembershipSubmit = async (data: MembershipFormData) => {
    membershipMutation.mutate(data);
  };

  const onStorySubmit = async (data: StoryFormData) => {
    storyMutation.mutate(data);
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 dark:bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/60 via-cyan-50/40 to-slate-100/60 dark:from-gray-800 dark:via-gray-900 dark:to-black" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-gray-200/10 dark:via-white/5 to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 backdrop-blur-xl rounded-full px-6 py-3 border border-[#00AFE6]/20 mb-6 shadow-lg">
              <Users className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-sm font-medium text-gray-800 dark:text-white/90">Get Involved</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-rosarivo mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                Join Our Mission
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                To Improve Awareness, Diagnosis, and Care
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed max-w-3xl mx-auto">
              The Canadian Amyloidosis Society is powered by people who care. Whether you're a clinician, researcher, patient, caregiver, or ally—you have a role to play in accelerating change.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Ways to Participate */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 backdrop-blur-xl border border-[#00AFE6]/20 rounded-full px-6 py-3 mb-8 shadow-lg">
              <Users className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-gray-800 dark:text-white/90 font-medium">Get Involved</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold font-rosarivo mb-6">
              <span className="text-gray-800 dark:text-white">Ways to </span>
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Participate
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-white/70 max-w-3xl mx-auto">
              Choose how you'd like to contribute to our mission of improving amyloidosis care across Canada.
            </p>
          </motion.div>

          <div className="flex justify-center max-w-4xl mx-auto">
            {participationWays.map((way, index) => (
              <motion.div
                key={way.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="w-full max-w-lg"
              >
                <Card className={`backdrop-blur-xl border transition-all duration-300 h-full group hover:shadow-2xl ${
                  index === 0 
                    ? 'bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 border-[#00AFE6]/20 dark:border-[#00AFE6]/30 hover:border-[#00AFE6]/40 dark:hover:border-[#00AFE6]/50 hover:shadow-[#00AFE6]/20'
                    : index === 1
                    ? 'bg-gradient-to-br from-[#00DD89]/15 to-[#00AFE6]/15 dark:from-[#00DD89]/20 to-[#00AFE6]/20 border-[#00DD89]/20 dark:border-[#00DD89]/30 hover:border-[#00DD89]/40 dark:hover:border-[#00DD89]/50 hover:shadow-[#00DD89]/20'
                    : index === 2
                    ? 'bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 border-[#00AFE6]/20 dark:border-[#00AFE6]/30 hover:border-[#00AFE6]/40 dark:hover:border-[#00AFE6]/50 hover:shadow-[#00AFE6]/20'
                    : 'bg-gradient-to-br from-[#00DD89]/15 to-[#00AFE6]/15 dark:from-[#00DD89]/20 to-[#00AFE6]/20 border-[#00DD89]/20 dark:border-[#00DD89]/30 hover:border-[#00DD89]/40 dark:hover:border-[#00DD89]/50 hover:shadow-[#00DD89]/20'
                }`}>
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${way.color} group-hover:scale-110 transition-transform duration-300`}>
                        <way.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">{way.title}</h3>
                        <p className="mb-6 leading-relaxed text-gray-600 dark:text-white/70">{way.description}</p>
                        
                        {way.title === "Join CAS" && (
                          <Button 
                            onClick={() => window.location.href = '/join-cas'}
                            className={`bg-gradient-to-r ${way.color} hover:opacity-90 text-white border-0`}
                          >
                            {way.action}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        )}

                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Benefits */}
      <section className="py-32 bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-white/10 relative overflow-hidden">
        {/* Advanced Frost Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-transparent to-cyan-100/20 dark:from-gray-800/50 dark:via-transparent dark:to-gray-700/30"></div>
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-gradient-to-r from-[#00AFE6]/3 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-gradient-to-l from-[#00DD89]/3 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.01),transparent)]"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 backdrop-blur-xl border border-[#00AFE6]/20 rounded-full px-6 py-3 mb-8 shadow-lg">
                <Shield className="w-5 h-5 text-[#00AFE6]" />
                <span className="text-gray-800 dark:text-white/90 font-medium">Membership</span>
              </div>
              <h2 className="text-5xl lg:text-6xl font-bold font-rosarivo mb-6">
                <span className="text-gray-800 dark:text-white">Why Join </span>
                <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                  CAS?
                </span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
              {/* Member Benefits Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="bg-gradient-to-br from-blue-50/95 to-cyan-50/95 dark:from-gray-800/95 dark:to-gray-700/95 backdrop-blur-xl border border-[#00AFE6]/20 dark:border-white/20 shadow-2xl hover:shadow-[0_0_60px_rgba(0,175,230,0.1)] transition-all duration-500 h-full group">
                  <CardContent className="p-10">
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white font-rosarivo">Member Benefits</h3>
                      </div>
                      <div className="w-16 h-0.5 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full"></div>
                    </div>
                    
                    <div className="space-y-6">
                      {[
                        { icon: Mail, text: "Periodic updates on amyloidosis research and initiatives" },
                        { icon: Users, text: "Invitations to contribute resources and expertise" },
                        { icon: Shield, text: "Recognition as contributor on shared resources" },
                        { icon: Calendar, text: "Early access to events and educational content" }
                      ].map((benefit, index) => (
                        <motion.div
                          key={index}
                          className="flex items-start gap-4 group/item"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <div className="w-10 h-10 bg-blue-100/60 dark:bg-white/5 backdrop-blur-xl border border-[#00AFE6]/20 dark:border-white/20 rounded-xl flex items-center justify-center group-hover/item:bg-blue-200/60 dark:group-hover/item:bg-white/10 transition-all duration-300">
                            <benefit.icon className="w-5 h-5 text-[#00AFE6] group-hover/item:text-gray-700 dark:group-hover/item:text-white transition-colors duration-300" />
                          </div>
                          <span className="text-gray-700 dark:text-white/80 group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors duration-300 leading-relaxed">
                            {benefit.text}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Participation Notes Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Card className="bg-gradient-to-br from-green-50/95 to-emerald-50/95 dark:from-gray-800/95 dark:to-gray-700/95 backdrop-blur-xl border border-[#00DD89]/20 dark:border-white/20 shadow-2xl hover:shadow-[0_0_60px_rgba(0,221,137,0.1)] transition-all duration-500 h-full group">
                  <CardContent className="p-10">
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#00DD89] to-[#00AFE6] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white font-rosarivo">Participation Notes</h3>
                      </div>
                      <div className="w-16 h-0.5 bg-gradient-to-r from-[#00DD89] to-[#00AFE6] rounded-full"></div>
                    </div>
                    
                    <div className="space-y-6">
                      {[
                        "Membership in CAS is voluntary and non-financial. There are no membership fees or obligations.",
                        "CAS is governed by an Executive Committee – a dedicated group of Canadian amyloidosis experts collaborating in a leadership role to advance the mission of CAS and serve its members.",
                        "Your privacy is protected - we only use your information for CAS communications and activities, and you can unsubscribe at any time."
                      ].map((note, index) => (
                        <motion.div
                          key={index}
                          className="bg-green-100/60 dark:bg-white/5 backdrop-blur-xl border border-[#00DD89]/20 dark:border-white/10 rounded-2xl p-6 hover:bg-green-200/60 dark:hover:bg-white/10 hover:border-[#00DD89]/30 dark:hover:border-white/20 transition-all duration-300"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <p className="text-gray-700 dark:text-white/80 leading-relaxed">
                            {note}
                          </p>
                        </motion.div>
                      ))}
                    </div>

                    <motion.div
                      className="mt-8 p-6 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 backdrop-blur-xl border border-white/10 rounded-2xl"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.9 }}
                      viewport={{ once: true }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <CheckCircle className="w-5 h-5 text-[#00AFE6]" />
                        <span className="text-gray-800 dark:text-white font-semibold">Ready to Get Started?</span>
                      </div>
                      <p className="text-gray-600 dark:text-white/70 text-sm mb-4">
                        Join our community of healthcare professionals, researchers, and advocates working together to advance amyloidosis awareness and care.
                      </p>
                      <Button 
                        onClick={() => window.location.href = '/join-cas'}
                        className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:opacity-90 text-white border-0 px-6 py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-2"
                        data-testid="button-join-cas"
                      >
                        Join CAS
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CANN Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-pink-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-white/10 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-100/20 dark:via-gray-700/20 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Content Column - Left Side */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500/10 to-purple-600/10 backdrop-blur-xl rounded-full px-6 py-3 border border-pink-500/20 mb-6 shadow-lg">
                  <Network className="w-5 h-5 text-pink-600" />
                  <span className="text-sm font-medium text-gray-800 dark:text-white/90">Professional Network</span>
                </div>
                
                <h2 className="crawford-section-title mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                    Canadian Amyloidosis
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                    Nursing Network
                  </span>
                </h2>
                
                <p className="text-lg text-gray-600 dark:text-white/70 leading-relaxed mb-8">
                  The field of amyloidosis has experienced tremendous growth in recent years. Within this multidisciplinary community, nurses play a vital role in enhancing the quality, accessibility, and coordination of healthcare services for amyloidosis patients.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-pink-600 rounded-full mt-3 flex-shrink-0" />
                    <p className="text-gray-600 dark:text-white/70">CANN is an affiliate of the Canadian Amyloidosis Society (CAS)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-pink-600 rounded-full mt-3 flex-shrink-0" />
                    <p className="text-gray-600 dark:text-white/70">Unite amyloidosis nurses across the country through professional development</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-pink-600 rounded-full mt-3 flex-shrink-0" />
                    <p className="text-gray-600 dark:text-white/70">Knowledge translation and best practice sharing</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-pink-600 rounded-full mt-3 flex-shrink-0" />
                    <p className="text-gray-600 dark:text-white/70">Facilitate collaboration while supporting patients with amyloidosis</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-pink-500/10 to-purple-600/10 border border-pink-500/20 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Join the Movement</h3>
                  <p className="text-gray-600 dark:text-white/80 mb-6">We invite you to join this exciting movement!</p>
                  <a href="/cann" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-medium hover:shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 flex items-center gap-2 inline-flex">
                    Learn About CANN
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
              
              {/* Image Column - Right Side */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="relative bg-pink-50/80 dark:bg-gray-700/50 backdrop-blur-xl rounded-3xl overflow-hidden border border-pink-500/20 dark:border-white/10 shadow-xl">
                  <div className="aspect-[4/5] relative">
                    <img 
                      src={healthcareProfessionalImg} 
                      alt="Healthcare professional working in amyloidosis care"
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Network Info Overlay */}
                    <motion.div
                      className="absolute bottom-6 left-6 right-6 bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 text-white rounded-2xl shadow-2xl"
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    >
                      <div className="px-6 py-4">
                        <div className="text-center">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                          >
                            <div className="text-lg font-bold text-white mb-1">
                              Dedicated Nursing Network
                            </div>
                            <div className="text-sm text-gray-300">Connecting nurses across Canada</div>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Floating accent elements */}
                  <motion.div
                    className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center"
                    animate={{ 
                      y: [0, -8, 0],
                      rotate: [0, 5, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Stethoscope className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2025 Canadian Amyloidosis Summit Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-white/10 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-transparent to-cyan-100/20 dark:from-gray-800/50 dark:via-transparent dark:to-gray-700/30"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00AFE6]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00DD89]/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 backdrop-blur-xl border border-[#00AFE6]/20 rounded-full px-6 py-3 shadow-lg">
                <Calendar className="w-5 h-5 text-[#00AFE6]" />
                <span className="text-gray-800 dark:text-white/90 font-medium">Featured Event</span>
              </div>
              
              {/* Status Badge */}
              <motion.div 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 backdrop-blur-xl border border-[#00AFE6]/20 rounded-full px-4 py-2"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="w-2 h-2 bg-[#00AFE6] rounded-full animate-pulse" />
                <span className="text-sm font-medium text-[#00AFE6] dark:text-[#00AFE6]">Registration is open</span>
              </motion.div>
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-rosarivo mb-8 leading-tight">
              <span className="text-gray-800 dark:text-white">2025 Canadian </span>
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Amyloidosis Summit
              </span>
            </h2>
            
            <p className="text-lg sm:text-xl text-gray-600 dark:text-white/70 max-w-4xl mx-auto leading-relaxed px-4">
              Registration is open
            </p>
          </motion.div>

          <div className="max-w-7xl mx-auto">
            {/* Larger, Centered Save the Date Image */}
            <motion.div
              className="relative mb-16 flex justify-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/25 dark:to-[#00DD89]/25 backdrop-blur-xl rounded-3xl p-8 border border-[#00AFE6]/30 shadow-2xl max-w-4xl w-full">
                <img 
                  src={summitSaveTheDateImg} 
                  alt="Save the Date - 2025 Canadian Amyloidosis Summit"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00AFE6]/5 to-transparent rounded-3xl pointer-events-none" />
                
                {/* Floating accent elements around the image */}
                <motion.div
                  className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-3xl flex items-center justify-center shadow-2xl"
                  animate={{ 
                    y: [0, -12, 0],
                    rotate: [0, 8, 0]
                  }}
                  transition={{ 
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Calendar className="w-8 h-8 text-white" />
                </motion.div>
                
                <motion.div
                  className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-r from-[#00DD89] to-[#00AFE6] rounded-3xl flex items-center justify-center shadow-2xl"
                  animate={{ 
                    y: [0, 12, 0],
                    rotate: [0, -8, 0]
                  }}
                  transition={{ 
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2.5
                  }}
                >
                  <MapPin className="w-8 h-8 text-white" />
                </motion.div>
              </div>
            </motion.div>

            {/* Summit Information Card - Centered Below Image */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-xl rounded-3xl p-10 border border-gray-200/50 dark:border-white/20 shadow-2xl max-w-2xl w-full">
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 font-rosarivo">Event Details</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                    <div className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-[#00AFE6]/10 to-[#00DD89]/10 rounded-2xl border border-[#00AFE6]/20">
                      <Calendar className="w-8 h-8 text-[#00AFE6]" />
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-500 dark:text-white/60 mb-1">Dates</p>
                        <p className="text-gray-800 dark:text-white font-semibold">October 31 - November 2, 2025</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-[#00DD89]/10 to-[#00AFE6]/10 rounded-2xl border border-[#00DD89]/20">
                      <MapPin className="w-8 h-8 text-[#00DD89]" />
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-500 dark:text-white/60 mb-1">Location</p>
                        <p className="text-gray-800 dark:text-white font-semibold">Toronto, ON</p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-white/70 mb-10 leading-relaxed text-lg">
                    Join us for the 2025 Canadian Amyloidosis Summit, hosted by CAS and Transthyretin Amyloidosis Canada (TAC). Registration is open through the TAC website.
                  </p>
                  
                  <div className="space-y-4">
                    <Button 
                      onClick={() => window.open('https://madhattr.ca/events/', '_blank')}
                      className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/90 hover:to-[#00DD89]/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group px-8 py-4 text-lg font-semibold rounded-2xl"
                    >
                      Register Now
                      <ExternalLink className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                    
                    <p className="text-sm text-gray-500 dark:text-white/50">
                      Registration is open
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-24 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-white/10 relative overflow-hidden">
        {/* Frost Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-transparent to-cyan-100/20 dark:from-gray-800/30 dark:via-transparent dark:to-gray-700/20"></div>
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
              <Calendar className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-gray-800 dark:text-white/90 font-medium">Events</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-rosarivo mb-6 leading-tight">
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Events
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-white/70 max-w-3xl mx-auto leading-relaxed px-4">
              Join us at upcoming events and see highlights from our recent community gatherings.
            </p>
            

          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto px-4">
            <div className="flex justify-center mb-6 sm:mb-8 overflow-x-auto pb-2">
              <div className="bg-gradient-to-r from-gray-100/80 to-blue-100/60 dark:bg-white/5 backdrop-blur-xl border border-[#00AFE6]/20 dark:border-white/20 rounded-2xl p-1 sm:p-2 shadow-2xl inline-flex min-w-max">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base whitespace-nowrap ${
                    activeTab === "overview"
                      ? "bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white shadow-lg"
                      : "text-gray-600 dark:text-white/80 hover:text-gray-800 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/10"
                  }`}
                >
                  Upcoming Events
                </button>
                <button
                  onClick={() => setActiveTab("recent")}
                  className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base whitespace-nowrap ${
                    activeTab === "recent"
                      ? "bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white shadow-lg"
                      : "text-gray-600 dark:text-white/80 hover:text-gray-800 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/10"
                  }`}
                >
                  Recent Events
                </button>
                <button
                  onClick={() => setActiveTab("past")}
                  className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base whitespace-nowrap ${
                    activeTab === "past"
                      ? "bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white shadow-lg"
                      : "text-gray-600 dark:text-white/80 hover:text-gray-800 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/10"
                  }`}
                >
                  Past Events
                </button>
              </div>
            </div>

            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="h-full"
                  >
                    <Card className="bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-xl border border-gray-200/60 dark:border-white/20 hover:border-[#00AFE6]/50 dark:hover:border-[#00AFE6]/60 hover:shadow-2xl hover:shadow-[#00AFE6]/15 transition-all duration-500 h-full flex flex-col rounded-3xl overflow-hidden">
                      <div className="p-6 flex flex-col flex-1">
                        {/* Badge */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-[#00AFE6]/20 to-[#00DD89]/20 rounded-2xl flex items-center justify-center">
                            <Calendar className="w-8 h-8 text-[#00AFE6]" />
                          </div>
                          <Badge className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white border-0 px-2 py-1 text-xs font-medium rounded">
                            {event.type}
                          </Badge>
                        </div>
                        
                        {/* Title */}
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white leading-snug mb-6">
                          {event.title}
                        </h3>
                        
                        {/* Event Details */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/70">
                            <Calendar className="w-4 h-4" />
                            <span>{formatEventDate(event.date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/70">
                            <Clock className="w-4 h-4" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/70">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        
                        {/* Description */}
                        <p className="text-gray-600 dark:text-white/70 text-sm leading-relaxed flex-1 mb-6 line-clamp-3">
                          {event.description}
                        </p>
                        
                        {/* Membership info and Join button - Show only for first card */}
                        {index === 0 && (
                          <div className="space-y-4">
                            <div className="text-center p-4 bg-gradient-to-r from-[#00AFE6]/5 to-[#00DD89]/5 rounded-xl border border-[#00AFE6]/20">
                              <p className="text-sm font-medium text-gray-700 dark:text-white/90 mb-1">
                                Registration not required.
                              </p>
                              <p className="text-xs text-gray-600 dark:text-white/70">
                                Zoom details are sent to CAS members
                              </p>
                            </div>
                            <Button 
                              onClick={() => window.location.href = '/join-cas'}
                              className="w-full bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/90 hover:to-[#00DD89]/90 text-white border-0 shadow-lg hover:shadow-xl hover:shadow-[#00AFE6]/25 transition-all duration-300 group/btn py-3 rounded-2xl font-semibold text-sm"
                              data-testid="button-join-cas"
                            >
                              Join CAS
                              <Users className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                            </Button>
                          </div>
                        )}
                        
                        {/* Register button - Show for all cards except the first one */}
                        {index !== 0 && (
                          <Button 
                            onClick={() => window.open(event.registrationUrl, '_blank')}
                            className="w-full bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/90 hover:to-[#00DD89]/90 text-white border-0 shadow-lg hover:shadow-xl hover:shadow-[#00AFE6]/25 transition-all duration-300 group/btn py-3 rounded-2xl font-semibold text-sm"
                          >
                            Register Now
                            <ExternalLink className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                          </Button>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="recent" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {recentEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-xl border border-gray-200/60 dark:border-white/20 hover:border-[#00DD89]/50 dark:hover:border-[#00DD89]/60 hover:shadow-2xl hover:shadow-[#00DD89]/15 transition-all duration-500 h-full group rounded-3xl overflow-hidden">
                      
                      {/* Enhanced Header */}
                      <div className="relative p-8 pb-6 bg-gradient-to-br from-[#00DD89]/10 via-[#00AFE6]/5 to-transparent">
                        <div className="absolute top-4 right-4">
                          <div className="flex items-center gap-2 text-sm bg-gradient-to-r from-[#00DD89]/20 to-[#00AFE6]/20 px-3 py-1 rounded-full border border-[#00DD89]/20">
                            <Users className="w-4 h-4 text-[#00DD89]" />
                            <span className="text-gray-600 dark:text-white/80 font-medium">{event.attendees}</span>
                          </div>
                        </div>
                        
                        <div className="w-16 h-16 bg-gradient-to-br from-[#00DD89]/20 to-[#00AFE6]/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                          <Users className="w-8 h-8 text-[#00DD89] group-hover:text-[#00AFE6] transition-colors duration-300" />
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 leading-tight group-hover:text-[#00DD89] transition-colors duration-300">
                          {event.title}
                        </h3>
                        
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#00DD89]/5 to-[#00AFE6]/5 rounded-xl border border-[#00DD89]/10">
                          <Calendar className="w-5 h-5 text-[#00DD89] flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-700 dark:text-white/80">{formatEventDate(event.date)}</span>
                        </div>
                      </div>

                      <CardContent className="p-8 pt-0">
                        <p className="text-gray-600 dark:text-white/70 text-sm leading-relaxed">
                          {event.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="past" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pastEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-xl border border-gray-200/60 dark:border-white/20 hover:border-[#00AFE6]/50 dark:hover:border-[#00AFE6]/60 hover:shadow-2xl hover:shadow-[#00AFE6]/15 transition-all duration-500 h-full group rounded-3xl overflow-hidden">
                      
                      {/* Enhanced Header */}
                      <div className="relative p-8 pb-6 bg-gradient-to-br from-[#00AFE6]/10 via-[#00DD89]/5 to-transparent">
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white border-0 px-3 py-1 text-xs font-medium rounded-full">
                            {event.type}
                          </Badge>
                        </div>
                        
                        <div className="w-16 h-16 bg-gradient-to-br from-[#00AFE6]/20 to-[#00DD89]/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                          <Calendar className="w-8 h-8 text-[#00AFE6] group-hover:text-[#00DD89] transition-colors duration-300" />
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 leading-tight group-hover:text-[#00AFE6] transition-colors duration-300">
                          {event.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 text-sm bg-gradient-to-r from-[#00AFE6]/5 to-[#00DD89]/5 px-3 py-2 rounded-xl border border-[#00AFE6]/10">
                          <Users className="w-4 h-4 text-[#00AFE6]" />
                          <span className="text-gray-600 dark:text-white/80 font-medium">{event.attendees} attendees</span>
                        </div>
                      </div>

                      <CardContent className="p-8 pt-0 flex flex-col flex-1">
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#00AFE6]/5 to-[#00DD89]/5 rounded-xl border border-[#00AFE6]/10">
                            <Calendar className="w-5 h-5 text-[#00AFE6] flex-shrink-0" />
                            <span className="text-sm font-medium text-gray-700 dark:text-white/80">{formatEventDate(event.date)}</span>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#00DD89]/5 to-[#00AFE6]/5 rounded-xl border border-[#00DD89]/10">
                            <MapPin className="w-5 h-5 text-[#00DD89] flex-shrink-0" />
                            <span className="text-sm font-medium text-gray-700 dark:text-white/80">{event.location}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 dark:text-white/70 text-sm leading-relaxed flex-1">
                          {event.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}