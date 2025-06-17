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
  Handshake
} from "lucide-react";
import { Link } from "wouter";
import ParallaxBackground from "@/components/ParallaxBackground";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Form schema
const joinFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  city: z.string().min(2, "Please enter your city"),
  province: z.string().min(2, "Please enter your province"),
  interests: z.array(z.string()).min(1, "Please select at least one area of interest"),
  experience: z.enum(["patient", "caregiver", "healthcare", "researcher", "advocate", "other"]),
  howHeard: z.string().min(1, "Please tell us how you heard about CAS"),
  message: z.string().optional(),
  newsletter: z.boolean().default(true),
  terms: z.boolean().refine(val => val === true, "You must accept the terms and conditions")
});

type JoinFormData = z.infer<typeof joinFormSchema>;

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
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const { toast } = useToast();

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
      terms: false
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
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gray-900 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-gray-900/20" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00AFE6]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00DD89]/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-5xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl rounded-full px-6 py-3 border border-white/10 mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <UserPlus className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-sm font-medium text-white/90">Join Our Community</span>
            </motion.div>
            
            <motion.h1 
              className="text-5xl lg:text-7xl font-bold font-rosarivo mb-8 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="block bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent mb-2">
                Join the
              </span>
              <span className="block bg-gradient-to-r from-[#00AFE6] via-[#00C5D7] to-[#00DD89] bg-clip-text text-transparent">
                Canadian Amyloidosis Society
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl lg:text-2xl text-white/70 leading-relaxed max-w-4xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Become part of a supportive community dedicated to advancing research, improving care, and raising awareness about amyloidosis across Canada.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <motion.button
                onClick={() => document.getElementById('join-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-10 py-5 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-[#00AFE6]/25 transition-all duration-300 group"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Join CAS Today</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.div
                className="text-white/60 text-sm"
                whileHover={{ scale: 1.02 }}
              >
                <Link href="/about" className="inline-flex items-center gap-2 hover:text-white/80 transition-colors">
                  Learn more about CAS
                  <BookOpen className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </section>

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
                Our Community?
              </span>
            </h2>
            
            <p className="text-xl text-white/70 leading-relaxed max-w-3xl mx-auto">
              Joining CAS connects you with a supportive community and provides access to valuable resources.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Community Support",
                description: "Connect with patients, caregivers, and families who understand your journey.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: BookOpen,
                title: "Educational Resources",
                description: "Access comprehensive information about amyloidosis and latest research.",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Shield,
                title: "Advocacy & Awareness",
                description: "Join our efforts to improve healthcare policies and funding for amyloidosis.",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: Star,
                title: "Events & Programs",
                description: "Participate in webinars, support groups, and educational conferences.",
                color: "from-orange-500 to-red-500"
              },
              {
                icon: Heart,
                title: "Research Updates",
                description: "Stay informed about clinical trials and new treatment options.",
                color: "from-teal-500 to-blue-500"
              },
              {
                icon: Handshake,
                title: "Professional Network",
                description: "Connect with healthcare professionals and researchers in the field.",
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

      {/* Join Form Section */}
      <section id="join-form" className="py-24 bg-gray-800 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold font-rosarivo mb-4">
                <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  Complete Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                  Application
                </span>
              </h2>
              <p className="text-white/70">
                Fill out the form below to join the Canadian Amyloidosis Society
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-[#00AFE6]" />
                  Tell Us About Yourself
                </h3>
                
                <div className="space-y-6">
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
                    <div className="grid grid-cols-2 gap-3">
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
                    <label className="block text-white/80 font-medium mb-2">Message (Optional)</label>
                    <textarea
                      {...register("message")}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00AFE6] h-24 resize-none"
                      placeholder="Tell us anything else you'd like us to know..."
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
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
                  disabled={joinMutation.isPending}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {joinMutation.isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Joining CAS...
                    </>
                  ) : (
                    <>
                      Join the Canadian Amyloidosis Society
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-900 border-t border-white/10">
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold font-rosarivo mb-6">
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Questions About
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Joining CAS?
              </span>
            </h2>
            
            <p className="text-white/70 leading-relaxed mb-8">
              We're here to help you get involved and answer any questions you may have.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <Mail className="w-8 h-8 text-[#00AFE6] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Email Us</h3>
                <p className="text-white/70 mb-4">Send us your questions via email</p>
                <Link href="/contact" className="text-[#00AFE6] hover:text-white transition-colors">
                  info@canadianamyloidosis.ca
                </Link>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <Phone className="w-8 h-8 text-[#00DD89] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Call Us</h3>
                <p className="text-white/70 mb-4">Speak with our team</p>
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