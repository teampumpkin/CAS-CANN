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
  MapPin, 
  Calendar, 
  Star, 
  Shield, 
  BookOpen, 
  ArrowRight,
  Check,
  UserPlus,
  Globe,
  Award,
  Handshake,
  Building,
  GraduationCap,
  Stethoscope
} from "lucide-react";
import { Link } from "wouter";
import ParallaxBackground from "@/components/ParallaxBackground";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Form schemas
const membershipFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter your address"),
  city: z.string().min(2, "Please enter your city"),
  province: z.string().min(2, "Please enter your province"),
  postalCode: z.string().min(6, "Please enter a valid postal code"),
  membershipType: z.enum(["individual", "family", "professional", "corporate", "student"]),
  interests: z.array(z.string()).min(1, "Please select at least one area of interest"),
  experience: z.enum(["patient", "caregiver", "healthcare", "researcher", "advocate", "other"]),
  howHeard: z.string().min(1, "Please tell us how you heard about CAS"),
  additionalInfo: z.string().optional(),
  newsletter: z.boolean().default(true),
  terms: z.boolean().refine(val => val === true, "You must accept the terms and conditions")
});

type MembershipFormData = z.infer<typeof membershipFormSchema>;

const membershipTypes = [
  {
    id: "individual",
    name: "Individual Membership",
    price: "$25/year",
    description: "For patients, caregivers, and individuals affected by amyloidosis",
    benefits: [
      "Access to educational resources",
      "Quarterly newsletter",
      "Member events and webinars",
      "Support group access",
      "Advocacy updates"
    ],
    icon: Users,
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "family",
    name: "Family Membership",
    price: "$40/year",
    description: "For families dealing with amyloidosis together",
    benefits: [
      "All individual benefits",
      "Family event access",
      "Caregiver resources",
      "Multiple newsletter subscriptions",
      "Family support networks"
    ],
    icon: Heart,
    color: "from-green-500 to-emerald-500"
  },
  {
    id: "professional",
    name: "Healthcare Professional",
    price: "$50/year",
    description: "For healthcare providers and medical professionals",
    benefits: [
      "Professional development resources",
      "Clinical guidelines access",
      "Medical webinars and CME",
      "Research collaboration opportunities",
      "Professional networking"
    ],
    icon: Stethoscope,
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "corporate",
    name: "Corporate Membership",
    price: "Contact us",
    description: "For organizations and healthcare institutions",
    benefits: [
      "Institutional resources",
      "Staff training materials",
      "Corporate sponsorship opportunities",
      "Research partnerships",
      "Custom collaboration options"
    ],
    icon: Building,
    color: "from-orange-500 to-red-500"
  },
  {
    id: "student",
    name: "Student Membership",
    price: "$15/year",
    description: "For students pursuing healthcare or research careers",
    benefits: [
      "Educational resources",
      "Mentorship opportunities",
      "Student events",
      "Career guidance",
      "Research opportunities"
    ],
    icon: GraduationCap,
    color: "from-teal-500 to-blue-500"
  }
];

const interestAreas = [
  "Patient Support",
  "Caregiver Resources",
  "Medical Research",
  "Fundraising Events",
  "Advocacy & Awareness",
  "Educational Programs",
  "Volunteer Opportunities",
  "Newsletter Contributions",
  "Community Outreach",
  "Policy Development"
];

export default function JoinCAS() {
  const [selectedMembership, setSelectedMembership] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<MembershipFormData>({
    resolver: zodResolver(membershipFormSchema),
    defaultValues: {
      interests: [],
      newsletter: true,
      terms: false
    }
  });

  const membershipMutation = useMutation({
    mutationFn: async (data: MembershipFormData) => {
      return await apiRequest("POST", "/api/membership", data);
    },
    onSuccess: () => {
      toast({
        title: "Membership Application Submitted!",
        description: "Thank you for joining CAS. We'll be in touch soon with membership details.",
      });
      reset();
      setSelectedMembership(null);
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

  const onSubmit = async (data: MembershipFormData) => {
    membershipMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <ParallaxBackground className="relative py-32 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 mb-6">
              <UserPlus className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-sm font-medium text-white/90">Join Our Community</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold font-rosarivo mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Become a Member of the
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Canadian Amyloidosis Society
              </span>
            </h1>
            
            <p className="text-xl text-white/70 leading-relaxed max-w-3xl mx-auto mb-8">
              Join a community dedicated to supporting patients, advancing research, and raising awareness about amyloidosis. Together, we can make a difference in the lives of those affected by this condition.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => document.getElementById('membership-types')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Choose Membership
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <Link href="/about" className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300">
                Learn About CAS
                <BookOpen className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </ParallaxBackground>

      {/* Benefits Section */}
      <section className="py-24 bg-gray-900 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-6">
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Why Join
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                CAS?
              </span>
            </h2>
            
            <p className="text-xl text-white/70 leading-relaxed max-w-3xl mx-auto">
              Membership with CAS provides access to resources, support, and a community of people who understand your journey.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Community Support",
                description: "Connect with patients, caregivers, and families who share similar experiences and challenges.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: BookOpen,
                title: "Educational Resources",
                description: "Access comprehensive information about amyloidosis, treatments, and latest research developments.",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Shield,
                title: "Advocacy Power",
                description: "Join our efforts to improve awareness, funding, and healthcare policies for amyloidosis patients.",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: Calendar,
                title: "Exclusive Events",
                description: "Participate in member-only webinars, support groups, and educational conferences.",
                color: "from-orange-500 to-red-500"
              },
              {
                icon: Star,
                title: "Research Updates",
                description: "Stay informed about the latest clinical trials, treatment options, and medical breakthroughs.",
                color: "from-teal-500 to-blue-500"
              },
              {
                icon: Handshake,
                title: "Professional Network",
                description: "Connect with healthcare professionals, researchers, and organizations in the amyloidosis community.",
                color: "from-pink-500 to-purple-500"
              }
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${benefit.color} rounded-xl flex items-center justify-center mb-4`}>
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                <p className="text-white/70">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Types Section */}
      <section id="membership-types" className="py-24 bg-gray-800 border-t border-white/10">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-6">
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Choose Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Membership Type
              </span>
            </h2>
            
            <p className="text-xl text-white/70 leading-relaxed max-w-3xl mx-auto">
              Select the membership that best fits your situation and goals within the amyloidosis community.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {membershipTypes.map((type, index) => (
              <motion.div
                key={type.id}
                className={`bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 cursor-pointer transition-all duration-300 ${
                  selectedMembership === type.id ? 'ring-2 ring-[#00AFE6] bg-white/10' : 'hover:bg-white/10'
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                onClick={() => setSelectedMembership(type.id)}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-r ${type.color} rounded-xl flex items-center justify-center`}>
                    <type.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{type.price}</div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">{type.name}</h3>
                <p className="text-white/70 mb-6">{type.description}</p>
                
                <div className="space-y-3">
                  {type.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-[#00DD89] flex-shrink-0" />
                      <span className="text-white/80 text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
                
                {selectedMembership === type.id && (
                  <motion.div
                    className="mt-6 p-4 bg-[#00AFE6]/20 border border-[#00AFE6]/30 rounded-xl"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-2 text-[#00AFE6] font-medium">
                      <Check className="w-4 h-4" />
                      Selected
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Form Section */}
      {selectedMembership && (
        <motion.section
          className="py-24 bg-gray-900 border-t border-white/10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold font-rosarivo mb-4">
                  <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    Complete Your
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                    Membership Application
                  </span>
                </h2>
                <p className="text-white/70">
                  Fill out the form below to join the Canadian Amyloidosis Society
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#00AFE6]" />
                    Personal Information
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white/80 font-medium mb-2">First Name</label>
                      <input
                        {...register("firstName")}
                        type="text"
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00AFE6]"
                        placeholder="Enter your first name"
                      />
                      {errors.firstName && (
                        <p className="text-red-400 text-sm mt-1">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white/80 font-medium mb-2">Last Name</label>
                      <input
                        {...register("lastName")}
                        type="text"
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00AFE6]"
                        placeholder="Enter your last name"
                      />
                      {errors.lastName && (
                        <p className="text-red-400 text-sm mt-1">{errors.lastName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white/80 font-medium mb-2">Email</label>
                      <input
                        {...register("email")}
                        type="email"
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00AFE6]"
                        placeholder="Enter your email address"
                      />
                      {errors.email && (
                        <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white/80 font-medium mb-2">Phone</label>
                      <input
                        {...register("phone")}
                        type="tel"
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00AFE6]"
                        placeholder="Enter your phone number"
                      />
                      {errors.phone && (
                        <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-white/80 font-medium mb-2">Address</label>
                      <input
                        {...register("address")}
                        type="text"
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00AFE6]"
                        placeholder="Enter your street address"
                      />
                      {errors.address && (
                        <p className="text-red-400 text-sm mt-1">{errors.address.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white/80 font-medium mb-2">City</label>
                      <input
                        {...register("city")}
                        type="text"
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00AFE6]"
                        placeholder="Enter your city"
                      />
                      {errors.city && (
                        <p className="text-red-400 text-sm mt-1">{errors.city.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white/80 font-medium mb-2">Province</label>
                      <select
                        {...register("province")}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00AFE6]"
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
                        <p className="text-red-400 text-sm mt-1">{errors.province.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white/80 font-medium mb-2">Postal Code</label>
                      <input
                        {...register("postalCode")}
                        type="text"
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00AFE6]"
                        placeholder="Enter your postal code"
                      />
                      {errors.postalCode && (
                        <p className="text-red-400 text-sm mt-1">{errors.postalCode.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-[#00AFE6]" />
                    Membership Details
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-white/80 font-medium mb-2">Selected Membership</label>
                      <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white">
                        {membershipTypes.find(t => t.id === selectedMembership)?.name} - {membershipTypes.find(t => t.id === selectedMembership)?.price}
                      </div>
                      <input type="hidden" {...register("membershipType")} value={selectedMembership} />
                    </div>

                    <div>
                      <label className="block text-white/80 font-medium mb-2">Your Experience</label>
                      <select
                        {...register("experience")}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00AFE6]"
                      >
                        <option value="">Select your primary role</option>
                        <option value="patient">Patient</option>
                        <option value="caregiver">Caregiver/Family Member</option>
                        <option value="healthcare">Healthcare Professional</option>
                        <option value="researcher">Researcher</option>
                        <option value="advocate">Advocate</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.experience && (
                        <p className="text-red-400 text-sm mt-1">{errors.experience.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white/80 font-medium mb-3">Areas of Interest (Select all that apply)</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {interestAreas.map((interest) => (
                          <label
                            key={interest}
                            className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                              selectedInterests.includes(interest)
                                ? 'bg-[#00AFE6]/20 border-[#00AFE6]/50 text-white'
                                : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                            }`}
                            onClick={() => handleInterestToggle(interest)}
                          >
                            <input
                              type="checkbox"
                              checked={selectedInterests.includes(interest)}
                              onChange={() => handleInterestToggle(interest)}
                              className="sr-only"
                            />
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                              selectedInterests.includes(interest)
                                ? 'bg-[#00AFE6] border-[#00AFE6]'
                                : 'border-white/40'
                            }`}>
                              {selectedInterests.includes(interest) && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <span className="text-sm">{interest}</span>
                          </label>
                        ))}
                      </div>
                      {errors.interests && (
                        <p className="text-red-400 text-sm mt-1">{errors.interests.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white/80 font-medium mb-2">How did you hear about CAS?</label>
                      <input
                        {...register("howHeard")}
                        type="text"
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00AFE6]"
                        placeholder="e.g., Healthcare provider, website, social media, etc."
                      />
                      {errors.howHeard && (
                        <p className="text-red-400 text-sm mt-1">{errors.howHeard.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white/80 font-medium mb-2">Additional Information (Optional)</label>
                      <textarea
                        {...register("additionalInfo")}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00AFE6] h-24 resize-none"
                        placeholder="Tell us anything else you'd like us to know..."
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#00AFE6]" />
                    Preferences & Agreements
                  </h3>
                  
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register("newsletter")}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        watch("newsletter") ? 'bg-[#00AFE6] border-[#00AFE6]' : 'border-white/40'
                      }`}>
                        {watch("newsletter") && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-white/80">
                        Subscribe to our newsletter for updates and resources
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register("terms")}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                        watch("terms") ? 'bg-[#00AFE6] border-[#00AFE6]' : 'border-white/40'
                      }`}>
                        {watch("terms") && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-white/80">
                        I agree to the <Link href="/terms" className="text-[#00AFE6] hover:underline">Terms and Conditions</Link> and <Link href="/privacy" className="text-[#00AFE6] hover:underline">Privacy Policy</Link> of the Canadian Amyloidosis Society
                      </span>
                    </label>
                    {errors.terms && (
                      <p className="text-red-400 text-sm">{errors.terms.message}</p>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <motion.button
                    type="submit"
                    disabled={membershipMutation.isPending}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {membershipMutation.isPending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        Submit Membership Application
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </div>
        </motion.section>
      )}

      {/* Contact Section */}
      <section className="py-24 bg-gray-800 border-t border-white/10">
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold font-rosarivo mb-6">
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Questions About
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Membership?
              </span>
            </h2>
            
            <p className="text-xl text-white/70 leading-relaxed mb-8">
              We're here to help you find the right membership option and answer any questions you may have.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <Mail className="w-8 h-8 text-[#00AFE6] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Email Us</h3>
                <p className="text-white/70 mb-4">Send us your questions via email</p>
                <Link href="/contact" className="text-[#00AFE6] hover:text-white transition-colors">
                  membership@canadianamyloidosis.ca
                </Link>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <Phone className="w-8 h-8 text-[#00DD89] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Call Us</h3>
                <p className="text-white/70 mb-4">Speak with our membership team</p>
                <Link href="/contact" className="text-[#00DD89] hover:text-white transition-colors">
                  1-800-CAS-INFO
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}