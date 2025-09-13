import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useScrollAnimations } from "@/hooks/use-scroll-animations";
import {
  Network,
  Users,
  BookOpen,
  GraduationCap,
  LogIn,
  CheckCircle,
  Award,
  Globe,
  ArrowRight,
  UserPlus,
  Heart,
  Search,
  Target,
  MapPin,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// Dialog components no longer needed for inline form
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
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ParallaxBackground from "../components/ParallaxBackground";
import healthcareProfessionalImg from "@assets/DSC02826_1750068895453.jpg";
import medicalTeamImg from "@assets/DSC02841_1750068895454.jpg";
import medicalResearchImg from "@assets/DSC02841_1750068895454.jpg";
import cannLogoImg from "@assets/CANN-RGB-dark-theme_1756219144378.png";
import { useLanguage } from "@/contexts/LanguageContext";

// Form validation schema
const joinCANNSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  professionalDesignation: z.string().min(2, "Please enter your professional designation"),
  subspecialty: z.string().min(2, "Please enter your subspecialty area"),
  amyloidosisType: z.enum(["ATTR", "AL", "Both"], {
    required_error: "Please select an amyloidosis type",
  }),
  institution: z.string().min(2, "Please enter your institution name"),
  communicationConsent: z.enum(["yes", "no"], {
    required_error: "Please select your communication preference",
  }),
  areasOfInterest: z.array(z.string()).min(1, "Please select at least one area of interest"),
  otherInterest: z.string().optional(),
  presentingInterest: z.enum(["yes", "no"], {
    required_error: "Please indicate your presenting interest",
  }),
  presentationTopic: z.string().optional(),
}).refine((data) => {
  // If presenting interest is "yes", topic is required
  if (data.presentingInterest === "yes" && !data.presentationTopic?.trim()) {
    return false;
  }
  return true;
}, {
  message: "Please provide a presentation topic",
  path: ["presentationTopic"],
});

const areasOfInterestOptions = [
  "Mental health considerations for amyloidosis and heart failure patients",
  "Case presentations/discussion",
  "Understanding PYP in amyloidosis",
  "Genetic testing/counseling",
  "Program start-up and multi-disciplinary engagement - how to start an amyloidosis program?",
  "Pathology and amyloidosis (mass spectrometry)",
  "Diet, exercise and/or cardiac rehab considerations for amyloidosis patients",
  "Multi-system involvement and clinical implications (neurological, G.I., others)",
  "Patient support groups: awareness, initiation and development, lessons learned",
  "Patient and Healthcare Professional Q&A - open forum for discussion",
  "'A Day in the Life' - multiple short presentations from various clinics to share local experience - process, flow, pearls and pitfalls",
  "Other"
];

export default function AboutCANN() {
  const { language } = useLanguage();
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  useScrollAnimations();

  // Form setup
  const form = useForm<z.infer<typeof joinCANNSchema>>({
    resolver: zodResolver(joinCANNSchema),
    defaultValues: {
      fullName: "",
      email: "",
      professionalDesignation: "",
      subspecialty: "",
      institution: "",
      areasOfInterest: [],
      otherInterest: "",
      presentationTopic: "",
    },
  });

  const watchPresentingInterest = form.watch("presentingInterest");
  const watchAreasOfInterest = form.watch("areasOfInterest");

  const onSubmit = (values: z.infer<typeof joinCANNSchema>) => {
    console.log("Form submitted:", values);
    // TODO: Handle form submission
    setShowRegistrationForm(false);
    form.reset();
    // Show success message or redirect
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll to top when component mounts
  useEffect(() => {
    // Handle hash-based navigation
    if (window.location.hash) {
      setTimeout(() => {
        const element = document.getElementById(
          window.location.hash.substring(1),
        );
        if (element) {
          // Calculate offset for fixed header (header is about 96px tall)
          const headerHeight = 96;
          const elementPosition = element.offsetTop - headerHeight;
          window.scrollTo({
            top: elementPosition,
            behavior: "smooth",
          });
        }
      }, 300);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const networkData = {
    mission: {
      title: "Connecting Healthcare Professionals",
      description:
        "The Canadian Amyloidosis Nursing Network (CANN) is founded by nurses, for nurses. This purpose driven professional network is dedicated to supporting amyloidosis nurses and advancing nursing care for amyloidosis patients across Canada.",
      keyPoints: [
        "Multidisciplinary approach to amyloidosis care",
        "Knowledge sharing and best practice development",
        "Collaborative research initiatives and clinical trials",
        "Professional development and training programs",
      ],
    },
    objectives: [
      {
        title: "Education and Professional Development",
        description:
          "Focus on meeting the unique learning needs of amyloidosis nurses with tailored educational sessions and resources.",
        icon: GraduationCap,
        color: "from-pink-500 to-rose-500",
      },
      {
        title: "Networking and Collaboration",
        description:
          "Facilitate communication and connection of nurses across the country.",
        icon: Network,
        color: "from-purple-500 to-pink-500",
      },
      {
        title: "Knowledge Translation",
        description:
          "Uniting nurses to share and develop best practices,tools and resources to improve care delivery and grow nursing expertise.",
        icon: BookOpen,
        color: "from-fuchsia-500 to-purple-500",
      },
      {
        title: "Patient Advocacy",
        description:
          "Facilitate and enhance support for our patients and their caregivers.",
        icon: Heart,
        color: "from-violet-500 to-fuchsia-500",
      },
    ],
    network: {
      coverage: "National Coverage",
      centers: "25+ Healthcare Centers",
      provinces: "All 10 Provinces",
      territories: "3 Territories",
    },
    achievements: [
      {
        title: "Research Excellence",
        description:
          "Leading 12 active research projects and clinical trials across multiple amyloidosis types.",
        stat: "12+",
        label: "Active Studies",
      },
      {
        title: "Professional Training",
        description:
          "Trained over 200 healthcare professionals in specialized amyloidosis care and diagnosis.",
        stat: "200+",
        label: "Professionals Trained",
      },
      {
        title: "Patient Impact",
        description:
          "Improved care pathways have reduced average diagnosis time by 40% in network centers.",
        stat: "40%",
        label: "Faster Diagnosis",
      },
      {
        title: "Knowledge Sharing",
        description:
          "Published 35+ peer-reviewed articles and clinical guidelines through network collaboration.",
        stat: "35+",
        label: "Publications",
      },
    ],
  };

  const keyPillars = [
    {
      icon: GraduationCap,
      title: "Professional Development",
      description:
        "Advance your knowledge and expertise in amyloidosis nursing through curated educational sessions and resources.",
      color: "from-pink-400 to-rose-400",
    },
    {
      icon: Globe,
      title: "National Collaboration",
      description:
        "Connect with nursing colleagues across Canada to share knowledge and best practices.",
      color: "from-purple-400 to-pink-400",
    },
    {
      icon: Heart,
      title: "Patient Impact",
      description:
        "Improve patient outcomes through advocacy and collaborative support.",
      color: "from-fuchsia-400 to-purple-400",
    },
  ];

  const membershipBenefits = [
    {
      icon: Network,
      title: "Professional Network",
      description:
        "Connect with amyloidosis nursing professionals across Canada.",
      color: "from-pink-400 to-rose-400",
    },
    {
      icon: BookOpen,
      title: "Educational Resources",
      description:
        "Access to educational materials, live virtual educational sessions and recordings.",
      color: "from-purple-400 to-pink-400",
    },
    {
      icon: Users,
      title: "Knowledge Sharing",
      description:
        "Share best practices, clinical resources and learn from experienced colleagues.",
      color: "from-fuchsia-400 to-purple-400",
    },
    {
      icon: Award,
      title: "Professional Development",
      description:
        "Benefit from a network dedicated to meeting the unique learning needs of its nursing members.",
      color: "from-violet-400 to-fuchsia-400",
    },
    {
      icon: Globe,
      title: "National Coverage",
      description:
        "Be part of a network spanning all provinces and territories.",
      color: "from-pink-400 to-rose-400",
    },
    {
      icon: Heart,
      title: "Patient Impact",
      description:
        "Unite with Canadian nursing colleagues to improve patient outcomes through collaborative care.",
      color: "from-rose-400 to-pink-400",
    },
  ];

  const membershipRequirements = [
    "Active nursing license in Canada",
    "Interest and/or expertise in amyloidosis care",
    "Commitment to professional development",
  ];

  const portalFeatures = [
    "Access live and recorded educational sessions and other materials",
    "Connect with network members, share tools and resources",
    "View upcoming events, obtain schedules and access details for virtual CANN meetings and educational sessions",
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <ParallaxBackground>{null}</ParallaxBackground>

      {/* Hero Section */}
      <section className="py-32 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-black" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-gray-900/5 dark:via-white/5 to-transparent" />

        {/* Floating accent elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-96 h-96 bg-gradient-to-r from-pink-500/10 to-purple-600/10 rounded-full"
              style={{
                left: `${20 + i * 20}%`,
                top: `${10 + i * 15}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center">
              {/* CANN Logo */}
              <div className="mb-8">
                <img
                  src={cannLogoImg}
                  alt="Canadian Amyloidosis Nursing Network Logo"
                  className="h-16 sm:h-20 md:h-24 lg:h-28 xl:h-32 max-w-full w-auto mx-auto object-contain"
                />
              </div>

              <div className="inline-flex items-center gap-3 bg-pink-500/10 dark:bg-pink-400/10 backdrop-blur-xl rounded-full px-6 py-3 border border-pink-500/20 dark:border-pink-400/20 mb-6">
                <Network className="w-5 h-5 text-pink-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-white/90">
                  About Our Network
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-rosarivo mb-6 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                  About the Canadian
                </span>
                <br />
                <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  Amyloidosis Nursing Network
                </span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed max-w-3xl mx-auto">
                {networkData.mission.description}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Overview Section */}
      <section className="py-24 bg-white dark:bg-gray-900 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/5 dark:via-white/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Content Column */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-3 bg-pink-500/10 dark:bg-pink-400/10 backdrop-blur-xl rounded-full px-6 py-3 border border-pink-500/20 dark:border-pink-400/20 mb-6">
                  <Network className="w-5 h-5 text-pink-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-white/90">
                    Our Mission
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-rosarivo mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                    {networkData.mission.title}
                  </span>
                </h2>

                <div className="space-y-6 text-gray-600 dark:text-white/70 leading-relaxed">
                  <p className="text-lg">
                    As an affiliate of the Canadian Amyloidosis Society, we
                    bring together nurses with interest and expertise in
                    amyloidosis, united in our commitment to excellence in
                    amyloidosis care.
                  </p>
                </div>

                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 mt-8">
                  Key Pillars
                </h3>
                <div className="space-y-6">
                  {keyPillars.map((pillar, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${pillar.color} rounded-2xl flex items-center justify-center flex-shrink-0`}
                      >
                        <pillar.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {pillar.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          {pillar.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-pink-500/10 to-purple-600/10 border border-pink-500/20 rounded-2xl p-6 mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Network Impact
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-pink-600 font-medium">
                        Coverage:
                      </span>
                      <div className="text-gray-700 dark:text-white/80">
                        {networkData.network.coverage}
                      </div>
                    </div>
                    <div>
                      <span className="text-pink-600 font-medium">
                        Centers:
                      </span>
                      <div className="text-gray-700 dark:text-white/80">
                        {networkData.network.centers}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Image Column */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="relative bg-gray-900/5 dark:bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-gray-900/10 dark:border-white/10">
                  <div className="aspect-[4/5] relative">
                    <img
                      src={medicalResearchImg}
                      alt="CANN healthcare professionals collaboration"
                      className="w-full h-full object-cover"
                    />

                    <motion.div
                      className="absolute bottom-6 left-6 right-6 bg-gray-900/10 dark:bg-white/10 backdrop-blur-xl border border-gray-900/20 dark:border-white/20 text-gray-900 dark:text-white rounded-2xl shadow-2xl"
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    >
                      <div className="px-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                              {networkData.network.provinces}
                            </div>
                            <div className="text-xs text-gray-700 dark:text-white/80">
                              Provinces
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                              {networkData.network.territories}
                            </div>
                            <div className="text-xs text-gray-700 dark:text-white/80">
                              Territories
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

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
                    <Network className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/5 dark:via-white/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                Network Objectives
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed max-w-3xl mx-auto">
              Four key pillars guide CANN's mission to transform amyloidosis
              care across Canada.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {networkData.objectives.map((objective, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-900/25 backdrop-blur-xl rounded-2xl p-6 border border-gray-900/10 dark:border-white/10 hover:shadow-2xl transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${objective.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <objective.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-pink-600 transition-colors duration-300">
                  {objective.title}
                </h3>
                <p className="text-gray-600 dark:text-white/70 text-sm leading-relaxed">
                  {objective.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Benefits Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/5 dark:via-white/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-6">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                  Membership Benefits
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed max-w-3xl mx-auto">
                Join a network dedicated to advancing amyloidosis nursing care
                across Canada.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {membershipBenefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-gray-900/25 backdrop-blur-xl rounded-2xl p-6 border border-gray-900/10 dark:border-white/10 hover:shadow-2xl transition-all duration-300 group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${benefit.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-pink-600 transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-white/70 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Join CANN Today Section */}
      <section
        id="join-section"
        className="py-24 bg-white dark:bg-gray-900 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/5 dark:via-white/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-3 bg-pink-500/10 dark:bg-pink-400/10 backdrop-blur-xl rounded-full px-6 py-3 border border-pink-500/20 dark:border-pink-400/20 mb-6">
                <UserPlus className="w-5 h-5 text-pink-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-white/90">
                  Join the Network
                </span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-6">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                  Join
                </span>
                <br />
                <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  CANN Today
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed mb-8 max-w-3xl mx-auto">
                Become part of Canada's first dedicated amyloidosis nursing
                network. Membership is free and open to all nursing
                professionals engaged in the field of amyloidosis.
              </p>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Membership Requirements
                </h3>
                <div className="space-y-4">
                  {membershipRequirements.map((requirement, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-pink-600" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {requirement}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {!showRegistrationForm ? (
                <Button 
                  onClick={() => setShowRegistrationForm(true)}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-pink-500/25 transition-all duration-300"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Register for CANN membership
                </Button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl"
                >
                  {/* Registration Form Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                        <UserPlus className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                          Join CANN Today
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Complete your registration for the Canadian Amyloidosis Nursing Network
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowRegistrationForm(false);
                        form.reset();
                      }}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>


                  {/* Join CANN Registration Form */}
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-left">
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                          Personal Information
                        </h4>
                        
                        {/* Full Name */}
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 dark:text-gray-300 text-lg">Full Name (First and Last) *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter your full name" 
                                  className="border-gray-300 dark:border-gray-600 text-base" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Email */}
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 dark:text-gray-300 text-lg">Email Address *</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="Enter your email address" 
                                  className="border-gray-300 dark:border-gray-600 text-base" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Professional Information */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                          Professional Information
                        </h4>

                        {/* Professional Designation */}
                        <FormField
                          control={form.control}
                          name="professionalDesignation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 dark:text-gray-300 text-lg">Professional Designation or Nursing Role *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="e.g., Nurse Practitioner, Nurse Clinician, educator, researcher, administrator" 
                                  className="border-gray-300 dark:border-gray-600 text-base" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Sub-specialty */}
                        <FormField
                          control={form.control}
                          name="subspecialty"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 dark:text-gray-300 text-lg">Sub-specialty Area of Focus *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="e.g., cardiology, hematology, neurology" 
                                  className="border-gray-300 dark:border-gray-600 text-base" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Amyloidosis Type */}
                        <FormField
                          control={form.control}
                          name="amyloidosisType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 dark:text-gray-300 text-lg">
                                In my nursing practice, I primarily care for patients with the following type of amyloidosis *
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-2"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="ATTR" id="attr" />
                                    <label htmlFor="attr" className="text-gray-700 dark:text-gray-300 cursor-pointer">ATTR</label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="AL" id="al" />
                                    <label htmlFor="al" className="text-gray-700 dark:text-gray-300 cursor-pointer">AL</label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Both" id="both" />
                                    <label htmlFor="both" className="text-gray-700 dark:text-gray-300 cursor-pointer">Both ATTR and AL</label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Institution */}
                        <FormField
                          control={form.control}
                          name="institution"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 dark:text-gray-300 text-lg">Center or Clinic Name/Institution *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter your institution name" 
                                  className="border-gray-300 dark:border-gray-600 text-base" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Communication Preferences */}
                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                          Communication Preferences
                        </h4>

                        {/* Communication Consent */}
                        <FormField
                          control={form.control}
                          name="communicationConsent"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 dark:text-gray-300 text-lg">
                                I would like to receive communication from the Canadian Amyloidosis Nursing Network (email, newsletters, CANN educational sessions) *
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-2"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="yes" id="comm-yes" />
                                    <label htmlFor="comm-yes" className="text-gray-700 dark:text-gray-300 cursor-pointer">Yes</label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="no" id="comm-no" />
                                    <label htmlFor="comm-no" className="text-gray-700 dark:text-gray-300 cursor-pointer">No</label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Educational Interests */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                          Educational Interests
                        </h4>

                        {/* Areas of Interest */}
                        <FormField
                          control={form.control}
                          name="areasOfInterest"
                          render={() => (
                            <FormItem>
                              <FormLabel className="text-gray-700 dark:text-gray-300 text-lg">
                                Please indicate potential areas of interest for future Educational Series sessions (select all that apply) *
                              </FormLabel>
                              <div className="space-y-3 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                                {areasOfInterestOptions.map((option) => (
                                  <FormField
                                    key={option}
                                    control={form.control}
                                    name="areasOfInterest"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={option}
                                          className="flex flex-row items-start space-x-3 space-y-0"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(option)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...field.value, option])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value) => value !== option
                                                      )
                                                    )
                                              }}
                                            />
                                          </FormControl>
                                          <FormLabel className="text-sm font-normal text-gray-700 dark:text-gray-300 leading-relaxed cursor-pointer">
                                            {option}
                                          </FormLabel>
                                        </FormItem>
                                      )
                                    }}
                                  />
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Other Interest Field - Shows when "Other" is selected */}
                        {watchAreasOfInterest?.includes("Other") && (
                          <FormField
                            control={form.control}
                            name="otherInterest"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 dark:text-gray-300 text-lg">Please specify other area of interest</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Describe your other area of interest..." 
                                    className="border-gray-300 dark:border-gray-600 text-base" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>

                      {/* Presentation Interest */}
                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                          Presentation Opportunities
                        </h4>

                        {/* Presenting Interest */}
                        <FormField
                          control={form.control}
                          name="presentingInterest"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 dark:text-gray-300 text-lg">
                                I would be interested in presenting to CANN members at one of the Educational Series events *
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-2"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="yes" id="present-yes" />
                                    <label htmlFor="present-yes" className="text-gray-700 dark:text-gray-300 cursor-pointer">Yes</label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="no" id="present-no" />
                                    <label htmlFor="present-no" className="text-gray-700 dark:text-gray-300 cursor-pointer">No</label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Presentation Topic - Shows when presenting interest is "yes" */}
                        {watchPresentingInterest === "yes" && (
                          <FormField
                            control={form.control}
                            name="presentationTopic"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 dark:text-gray-300 text-lg">
                                  I would be interested in presenting to CANN members on the following topic *
                                </FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Describe the topic you would like to present on..." 
                                    className="border-gray-300 dark:border-gray-600 text-base" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowRegistrationForm(false);
                            form.reset();
                          }}
                          className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Submit Registration
                        </Button>
                      </div>
                    </form>
                  </Form>

                  {/* Footer Note */}
                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                      By registering, you agree to join Canada's first dedicated amyloidosis nursing network. 
                      Membership is free and designed for nursing professionals.
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Member Login Section */}
      <section
        id="login"
        className="py-24 bg-gray-50 dark:bg-gray-800 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/5 dark:via-white/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white font-rosarivo">
                  Member Login
                </h2>
                <div className="inline-flex items-center gap-2 bg-pink-500/10 dark:bg-pink-400/10 backdrop-blur-xl rounded-full px-4 py-2 border border-pink-500/20 dark:border-pink-400/20">
                  <div className="w-2 h-2 bg-pink-600 rounded-full"></div>
                  <span className="text-sm font-medium text-pink-600 dark:text-pink-400">
                    Coming Soon
                  </span>
                </div>
              </div>
              <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed mb-8 max-w-3xl mx-auto">
                Access your CANN member portal to view exclusive resources,
                connect with colleagues, and manage your membership.
              </p>

              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Portal Features
                </h3>
                <div className="space-y-4 text-left">
                  {portalFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <ArrowRight className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  disabled
                  className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-8 py-4 rounded-xl font-semibold opacity-60 cursor-not-allowed"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Login to Member Portal
                </Button>
                <Button
                  disabled
                  variant="outline"
                  className="border-gray-400 text-gray-400 dark:text-gray-500 px-8 py-4 rounded-xl font-semibold opacity-60 cursor-not-allowed"
                >
                  New here? Request access
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
