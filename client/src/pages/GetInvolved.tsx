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
  Stethoscope
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
    description: "Become a member of our growing community. Clinicians, researchers, and health system leaders are especially encouraged to register.",
    action: "Register Now",
    color: "from-[#00AFE6] to-[#00DD89]"
  },
  {
    icon: Upload,
    title: "Contribute Resources",
    description: "Upload clinical tools or patient education materials through our structured portal to help the community.",
    action: "Upload Resource",
    color: "from-[#00AFE6] to-[#00DD89]"
  },
  {
    icon: MessageSquare,
    title: "Share Your Story",
    description: "Help raise awareness by sharing a lived experience, reflection, or clinical journey with the community.",
    action: "Share Story",
    color: "from-[#00AFE6] to-[#00DD89]"
  },
  {
    icon: Gift,
    title: "Support the Mission",
    description: "We welcome support from aligned organizations, philanthropic partners, and volunteers. Donations support CAS initiatives.",
    action: "Donate Now",
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
    title: "Amyloidosis Research Symposium 2025",
    date: "2025-08-15",
    time: "9:00 AM - 5:00 PM",
    location: "Toronto Convention Centre",
    type: "Conference",
    description: "Annual symposium bringing together leading researchers and clinicians to discuss latest advances in amyloidosis research and treatment.",
    image: "/api/placeholder/400/250",
    registrationUrl: "https://example.com/symposium-2025"
  },
  {
    id: 2,
    title: "Patient & Caregiver Workshop",
    date: "2025-07-20",
    time: "1:00 PM - 4:00 PM",
    location: "Virtual Event",
    type: "Workshop",
    description: "Interactive workshop focused on navigation tools, support resources, and connecting with other families affected by amyloidosis.",
    image: "/api/placeholder/400/250",
    registrationUrl: "https://example.com/workshop-2025"
  },
  {
    id: 3,
    title: "Clinical Guidelines Update Webinar",
    date: "2025-06-30",
    time: "7:00 PM - 8:30 PM",
    location: "Online",
    type: "Webinar",
    description: "Review of updated diagnostic and treatment guidelines for amyloidosis, featuring expert panel discussion and Q&A.",
    image: "/api/placeholder/400/250",
    registrationUrl: "https://example.com/webinar-guidelines"
  }
];

const recentEvents = [
  {
    id: 1,
    title: "World Amyloidosis Day 2024",
    date: "2024-10-26",
    description: "Global awareness campaign highlighting the importance of early diagnosis and access to care.",
    image: "/api/placeholder/300/200",
    attendees: 150
  },
  {
    id: 2,
    title: "Cross-Canada Clinical Network Meeting",
    date: "2024-09-15",
    description: "Healthcare providers from across Canada gathered to discuss regional care coordination strategies.",
    image: "/api/placeholder/300/200",
    attendees: 75
  }
];

const pastEvents = [
  {
    id: 1,
    title: "Amyloidosis Research Symposium 2024",
    date: "2024-08-20",
    description: "Annual symposium brought together leading researchers and clinicians to discuss advances in amyloidosis research and treatment.",
    image: "/api/placeholder/300/200",
    attendees: 200,
    location: "Vancouver Convention Centre",
    type: "Conference"
  },
  {
    id: 2,
    title: "Patient & Caregiver Workshop Series",
    date: "2024-06-15",
    description: "Interactive workshop series focused on navigation tools, support resources, and connecting families affected by amyloidosis.",
    image: "/api/placeholder/300/200",
    attendees: 85,
    location: "Virtual Event",
    type: "Workshop"
  },
  {
    id: 3,
    title: "Clinical Guidelines Webinar",
    date: "2024-05-30",
    description: "Review of diagnostic and treatment guidelines for amyloidosis, featuring expert panel discussion and Q&A.",
    image: "/api/placeholder/300/200",
    attendees: 120,
    location: "Online",
    type: "Webinar"
  },
  {
    id: 4,
    title: "CAS Annual General Meeting",
    date: "2024-03-12",
    description: "Annual meeting featuring organizational updates, strategic planning, and member recognition.",
    image: "/api/placeholder/300/200",
    attendees: 65,
    location: "Toronto, ON",
    type: "Meeting"
  },
  {
    id: 5,
    title: "Rare Disease Awareness Month Event",
    date: "2024-02-28",
    description: "Special event highlighting amyloidosis as part of Rare Disease Awareness Month activities.",
    image: "/api/placeholder/300/200",
    attendees: 95,
    location: "Calgary, AB",
    type: "Awareness Event"
  }
];

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
            
            <h1 className="text-4xl lg:text-6xl font-bold font-rosarivo mb-6 leading-tight">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {participationWays.map((way, index) => (
              <motion.div
                key={way.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
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
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className={`bg-gradient-to-r ${way.color} hover:opacity-90 text-white border-0`}>
                                {way.action}
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-gray-800/90 backdrop-blur-xl border-white/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="text-white text-2xl">Join the Canadian Amyloidosis Society</DialogTitle>
                              </DialogHeader>
                              
                              <Form {...membershipForm}>
                                <form onSubmit={membershipForm.handleSubmit(onMembershipSubmit)} className="space-y-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                      control={membershipForm.control}
                                      name="firstName"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-white/90">First Name *</FormLabel>
                                          <FormControl>
                                            <Input {...field} className="bg-white/10 border-white/30 text-white" />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />

                                    <FormField
                                      control={membershipForm.control}
                                      name="lastName"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-white/90">Last Name *</FormLabel>
                                          <FormControl>
                                            <Input {...field} className="bg-white/10 border-white/30 text-white" />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>

                                  <FormField
                                    control={membershipForm.control}
                                    name="email"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-white/90">Email Address *</FormLabel>
                                        <FormControl>
                                          <Input {...field} type="email" className="bg-white/10 border-white/30 text-white" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                      control={membershipForm.control}
                                      name="role"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-white/90">Role *</FormLabel>
                                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                              <SelectTrigger className="bg-white/10 border-white/30 text-white">
                                                <SelectValue placeholder="Select your role" />
                                              </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                              <SelectItem value="clinician">Clinician</SelectItem>
                                              <SelectItem value="researcher">Researcher</SelectItem>
                                              <SelectItem value="patient">Patient</SelectItem>
                                              <SelectItem value="caregiver">Caregiver</SelectItem>
                                              <SelectItem value="administrator">Healthcare Administrator</SelectItem>
                                              <SelectItem value="student">Student</SelectItem>
                                              <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                          </Select>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />

                                    <FormField
                                      control={membershipForm.control}
                                      name="province"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-white/90">Province/Territory *</FormLabel>
                                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                              <SelectTrigger className="bg-white/10 border-white/30 text-white">
                                                <SelectValue placeholder="Select province" />
                                              </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                              {provinces.map(province => (
                                                <SelectItem key={province.value} value={province.value}>
                                                  {province.label}
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
                                    control={membershipForm.control}
                                    name="organization"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-white/90">Organization (Optional)</FormLabel>
                                        <FormControl>
                                          <Input {...field} placeholder="Hospital, university, or organization name" className="bg-white/10 border-white/30 text-white" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <div>
                                    <FormLabel className="text-white/90 mb-3 block">Areas of Interest *</FormLabel>
                                    <div className="grid grid-cols-2 gap-3">
                                      {membershipInterests.map((interest) => (
                                        <div key={interest} className="flex items-center space-x-2">
                                          <Checkbox
                                            id={interest}
                                            checked={selectedInterests.includes(interest)}
                                            onCheckedChange={() => handleInterestToggle(interest)}
                                            className="border-white/30"
                                          />
                                          <label
                                            htmlFor={interest}
                                            className="text-sm text-white/90 cursor-pointer"
                                          >
                                            {interest}
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                    {membershipForm.formState.errors.interests && (
                                      <p className="text-red-400 text-sm mt-1">
                                        {membershipForm.formState.errors.interests.message}
                                      </p>
                                    )}
                                  </div>

                                  <div className="space-y-4">
                                    <FormField
                                      control={membershipForm.control}
                                      name="privacyConsent"
                                      render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value}
                                              onCheckedChange={field.onChange}
                                              className="border-white/30"
                                            />
                                          </FormControl>
                                          <div className="space-y-1 leading-none">
                                            <FormLabel className="text-white/90 text-sm">
                                              I agree to the Privacy Policy *
                                            </FormLabel>
                                            <p className="text-xs text-white/60">
                                              Your information will be used solely for CAS membership communications and activities.
                                            </p>
                                          </div>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />

                                    <FormField
                                      control={membershipForm.control}
                                      name="codeOfConduct"
                                      render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value}
                                              onCheckedChange={field.onChange}
                                              className="border-white/30"
                                            />
                                          </FormControl>
                                          <div className="space-y-1 leading-none">
                                            <FormLabel className="text-white/90 text-sm">
                                              I agree to the Code of Conduct *
                                            </FormLabel>
                                            <p className="text-xs text-white/60">
                                              I commit to respectful, professional, and collaborative participation in CAS activities.
                                            </p>
                                          </div>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>

                                  <Button
                                    type="submit"
                                    disabled={membershipMutation.isPending}
                                    className="w-full bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/150 hover:to-[#00DD89]/150 text-white border-0"
                                  >
                                    {membershipMutation.isPending ? (
                                      <>
                                        <Users className="w-4 h-4 mr-2 animate-spin" />
                                        Submitting...
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Join CAS
                                      </>
                                    )}
                                  </Button>
                                </form>
                              </Form>
                            </DialogContent>
                          </Dialog>
                        )}

                        {way.title === "Contribute Resources" && (
                          <Button 
                            onClick={() => window.location.href = '/upload-resource'}
                            className={`bg-gradient-to-r ${way.color} hover:opacity-90 text-white border-0`}
                          >
                            {way.action}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        )}

                        {way.title === "Share Your Story" && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className={`bg-gradient-to-r ${way.color} hover:opacity-90 text-white border-0`}>
                                {way.action}
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-gray-800/90 backdrop-blur-xl border-white/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="text-white text-2xl">Share Your Story</DialogTitle>
                              </DialogHeader>
                              
                              <Form {...storyForm}>
                                <form onSubmit={storyForm.handleSubmit(onStorySubmit)} className="space-y-6">
                                  <FormField
                                    control={storyForm.control}
                                    name="title"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-white/90">Story Title *</FormLabel>
                                        <FormControl>
                                          <Input {...field} placeholder="Give your story a meaningful title" className="bg-white/10 border-white/30 text-white" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={storyForm.control}
                                    name="storyType"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-white/90">Story Type *</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                          <FormControl>
                                            <SelectTrigger className="bg-white/10 border-white/30 text-white">
                                              <SelectValue placeholder="Select story type" />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                            <SelectItem value="patient">Patient Experience</SelectItem>
                                            <SelectItem value="caregiver">Caregiver Journey</SelectItem>
                                            <SelectItem value="clinical">Clinical Reflection</SelectItem>
                                            <SelectItem value="research">Research Experience</SelectItem>
                                            <SelectItem value="advocacy">Advocacy Story</SelectItem>
                                          </SelectContent>
                                        </Select>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={storyForm.control}
                                    name="content"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-white/90">Your Story *</FormLabel>
                                        <FormControl>
                                          <Textarea 
                                            {...field}
                                            placeholder="Share your experience, insights, or reflections. Your story can help others in the amyloidosis community..."
                                            rows={8}
                                            className="bg-white/10 border-white/30 text-white placeholder-white/50"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                      control={storyForm.control}
                                      name="authorName"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-white/90">Your Name *</FormLabel>
                                          <FormControl>
                                            <Input {...field} placeholder="How would you like to be credited?" className="bg-white/10 border-white/30 text-white" />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />

                                    <FormField
                                      control={storyForm.control}
                                      name="authorRole"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-white/90">Role (Optional)</FormLabel>
                                          <FormControl>
                                            <Input {...field} placeholder="e.g., Patient, Caregiver, Physician" className="bg-white/10 border-white/30 text-white" />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>

                                  <div className="space-y-4">
                                    <FormField
                                      control={storyForm.control}
                                      name="canFeature"
                                      render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value}
                                              onCheckedChange={field.onChange}
                                              className="border-white/30"
                                            />
                                          </FormControl>
                                          <div className="space-y-1 leading-none">
                                            <FormLabel className="text-white/90 text-sm">
                                              CAS may feature this story
                                            </FormLabel>
                                            <p className="text-xs text-white/60">
                                              Allow CAS to use this story in awareness campaigns, newsletters, or events.
                                            </p>
                                          </div>
                                        </FormItem>
                                      )}
                                    />

                                    <FormField
                                      control={storyForm.control}
                                      name="privacyConsent"
                                      render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value}
                                              onCheckedChange={field.onChange}
                                              className="border-white/30"
                                            />
                                          </FormControl>
                                          <div className="space-y-1 leading-none">
                                            <FormLabel className="text-white/90 text-sm">
                                              I agree to the Privacy Policy *
                                            </FormLabel>
                                            <p className="text-xs text-white/60">
                                              I understand how my story will be used and shared by CAS.
                                            </p>
                                          </div>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>

                                  <Button
                                    type="submit"
                                    disabled={storyMutation.isPending}
                                    className="w-full bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/150 hover:to-[#00DD89]/150 text-white border-0"
                                  >
                                    {storyMutation.isPending ? (
                                      <>
                                        <MessageSquare className="w-4 h-4 mr-2 animate-spin" />
                                        Submitting...
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Submit Story
                                      </>
                                    )}
                                  </Button>
                                </form>
                              </Form>
                            </DialogContent>
                          </Dialog>
                        )}

                        {way.title === "Support the Mission" && (
                          <Button 
                            onClick={() => window.open('https://www.ucalgary.ca/medicine/ways-give', '_blank')}
                            className={`bg-gradient-to-r ${way.color} hover:opacity-90 text-white border-0`}
                          >
                            {way.action}
                            <ExternalLink className="w-4 h-4 ml-2" />
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
      <section className="py-32 bg-gray-900 border-t border-white/10 relative overflow-hidden">
        {/* Advanced Frost Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] via-transparent to-white/[0.02]"></div>
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
              <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 mb-8">
                <Shield className="w-5 h-5 text-[#00AFE6]" />
                <span className="text-white/90 font-medium">Membership</span>
              </div>
              <h2 className="text-5xl lg:text-6xl font-bold font-rosarivo mb-6">
                <span className="text-white">Why Join </span>
                <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                  CAS?
                </span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Member Benefits Card */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white/5 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-[0_0_60px_rgba(0,175,230,0.1)] transition-all duration-500 h-full group">
                  <CardContent className="p-10">
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white font-rosarivo">Member Benefits</h3>
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
                          <div className="w-10 h-10 bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center group-hover/item:bg-white/10 transition-all duration-300">
                            <benefit.icon className="w-5 h-5 text-[#00AFE6] group-hover/item:text-white transition-colors duration-300" />
                          </div>
                          <span className="text-white/80 group-hover/item:text-white transition-colors duration-300 leading-relaxed">
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
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white/5 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-[0_0_60px_rgba(0,221,137,0.1)] transition-all duration-500 h-full group">
                  <CardContent className="p-10">
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#00DD89] to-[#00AFE6] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white font-rosarivo">Participation Notes</h3>
                      </div>
                      <div className="w-16 h-0.5 bg-gradient-to-r from-[#00DD89] to-[#00AFE6] rounded-full"></div>
                    </div>
                    
                    <div className="space-y-6">
                      {[
                        "Membership in CAS is voluntary and non-financial. There are no membership fees or obligations.",
                        "Participation is governed by our Membership Policy and Code of Conduct, which ensure respectful and professional collaboration.",
                        "Your privacy is protected - we only use your information for CAS communications and activities, and you can unsubscribe at any time."
                      ].map((note, index) => (
                        <motion.div
                          key={index}
                          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <p className="text-white/80 leading-relaxed">
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
                        <span className="text-white font-semibold">Ready to Get Started?</span>
                      </div>
                      <p className="text-white/70 text-sm">
                        Join our community of healthcare professionals, researchers, and advocates working together to advance amyloidosis awareness and care.
                      </p>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CANN Section */}
      <section className="py-24 bg-gray-900 border-t border-white/10 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
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
                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 mb-6">
                  <Network className="w-5 h-5 text-[#00AFE6]" />
                  <span className="text-sm font-medium text-white/90">Professional Network</span>
                </div>
                
                <h2 className="crawford-section-title mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    Canadian Amyloidosis
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                    Nursing Network
                  </span>
                </h2>
                
                <p className="text-lg text-white/70 leading-relaxed mb-8">
                  The field of amyloidosis has experienced tremendous growth in recent years. Within this multidisciplinary community, nurses play a vital role in enhancing the quality, accessibility, and coordination of healthcare services for amyloidosis patients.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full mt-3 flex-shrink-0" />
                    <p className="text-white/70">Unite amyloidosis nurses across the country through professional development</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full mt-3 flex-shrink-0" />
                    <p className="text-white/70">Knowledge translation and best practice sharing</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full mt-3 flex-shrink-0" />
                    <p className="text-white/70">Facilitate collaboration while supporting patients with amyloidosis</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 border border-[#00AFE6]/20 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Join the Movement</h3>
                  <p className="text-white/80 mb-6">We invite you to join this exciting movement!</p>
                  <a href="/join-cann" className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-8 py-4 rounded-full font-medium hover:shadow-2xl hover:shadow-[#00AFE6]/25 transition-all duration-300 flex items-center gap-2 inline-flex">
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
                <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10">
                  <div className="aspect-[4/5] relative">
                    <img 
                      src={healthcareProfessionalImg} 
                      alt="Healthcare professional working in amyloidosis care"
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Stats Overlay */}
                    <motion.div
                      className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl shadow-2xl"
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    >
                      <div className="px-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <motion.div
                            className="text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                          >
                            <div className="text-2xl font-bold bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                              50+
                            </div>
                            <div className="text-xs text-white/80">Nursing Professionals</div>
                          </motion.div>
                          
                          <motion.div
                            className="text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                          >
                            <div className="text-2xl font-bold bg-gradient-to-r from-[#00DD89] to-[#00AFE6] bg-clip-text text-transparent">
                              10
                            </div>
                            <div className="text-xs text-white/80">Provinces Connected</div>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Floating accent elements */}
                  <motion.div
                    className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-2xl flex items-center justify-center"
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

      {/* Events Section */}
      <section id="events" className="py-24 bg-gray-900 border-t border-white/10 relative overflow-hidden">
        {/* Frost Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01]"></div>
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
            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 mb-8">
              <Calendar className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-white/90 font-medium">Community</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold font-rosarivo mb-6">
              <span className="text-white">Events & </span>
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Community
              </span>
            </h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
              Join us at upcoming events and see highlights from our recent community gatherings.
            </p>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-2xl inline-flex">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === "overview"
                      ? "bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white shadow-lg"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Upcoming Events
                </button>
                <button
                  onClick={() => setActiveTab("recent")}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === "recent"
                      ? "bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white shadow-lg"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Recent Events
                </button>
                <button
                  onClick={() => setActiveTab("past")}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === "past"
                      ? "bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white shadow-lg"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Past Events
                </button>
              </div>
            </div>

            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 backdrop-blur-xl border border-[#00AFE6]/20 dark:border-[#00AFE6]/30 hover:border-[#00AFE6]/40 dark:hover:border-[#00AFE6]/50 hover:shadow-2xl hover:shadow-[#00AFE6]/20 transition-all duration-500 h-full group">
                      <div className="aspect-[4/3] bg-gradient-to-br from-[#00AFE6]/10 via-transparent to-[#00DD89]/10 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(0,175,230,0.1),transparent)]"></div>
                        <Calendar className="w-12 h-12 text-white/60 group-hover:text-white/80 transition-colors duration-300 relative z-10" />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="text-[#00AFE6] border-[#00AFE6]/30">
                            {event.type}
                          </Badge>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-white mb-2">{event.title}</h3>
                        
                        <div className="space-y-2 mb-4 text-sm text-white/70">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatEventDate(event.date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        
                        <p className="text-white/70 text-sm mb-6 line-clamp-3">
                          {event.description}
                        </p>
                        
                        <Button 
                          onClick={() => window.open(event.registrationUrl, '_blank')}
                          className="w-full bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/150 hover:to-[#00DD89]/150 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
                        >
                          Register Now
                          <ExternalLink className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </CardContent>
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
                    <Card className="bg-gradient-to-br from-[#00DD89]/15 to-[#00AFE6]/15 dark:from-[#00DD89]/20 to-[#00AFE6]/20 backdrop-blur-xl border border-[#00DD89]/20 dark:border-[#00DD89]/30 hover:border-[#00DD89]/40 dark:hover:border-[#00DD89]/50 hover:shadow-2xl hover:shadow-[#00DD89]/20 transition-all duration-500 overflow-hidden group">
                      <div className="aspect-[4/3] bg-gradient-to-br from-[#00DD89]/10 via-transparent to-[#00AFE6]/10 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,221,137,0.1),transparent)]"></div>
                        <Users className="w-12 h-12 text-white/60 group-hover:text-white/80 transition-colors duration-300 relative z-10" />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="outline" className="text-white/70 border-white/30">
                            {formatEventDate(event.date)}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-white/60">
                            <Users className="w-4 h-4" />
                            <span>{event.attendees} attendees</span>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-white mb-3">{event.title}</h3>
                        <p className="text-white/70 text-sm">{event.description}</p>
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
                    <Card className="bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 backdrop-blur-xl border border-[#00AFE6]/20 dark:border-[#00AFE6]/30 hover:border-[#00AFE6]/40 dark:hover:border-[#00AFE6]/50 hover:shadow-2xl hover:shadow-[#00AFE6]/20 transition-all duration-500 overflow-hidden group">
                      <div className="aspect-[4/3] bg-gradient-to-br from-[#00AFE6]/10 via-transparent to-[#00DD89]/10 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,175,230,0.1),transparent)]"></div>
                        <Calendar className="w-12 h-12 text-white/60 group-hover:text-white/80 transition-colors duration-300 relative z-10" />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="outline" className="text-[#00AFE6] border-[#00AFE6]/30">
                            {event.type}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-white/60">
                            <Users className="w-4 h-4" />
                            <span>{event.attendees} attendees</span>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-white mb-2">{event.title}</h3>
                        
                        <div className="space-y-2 mb-4 text-sm text-white/70">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatEventDate(event.date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        
                        <p className="text-white/70 text-sm line-clamp-3">
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