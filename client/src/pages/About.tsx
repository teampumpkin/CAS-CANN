import { motion } from "framer-motion";
import {
  Users,
  Target,
  Heart,
  Shield,
  BookOpen,
  Network,
  UserCheck,
  Globe,
  ArrowRight,
  Stethoscope,
  Building2,
  Award,
  FileText,
  Search,
  Lightbulb,
  UserPlus,
  ExternalLink,
  Download,
  CheckCircle,
} from "lucide-react";
import ParallaxBackground from "../components/ParallaxBackground";
import { useLanguage } from "@/contexts/LanguageContext";
import facilityImage from "@assets/DSC_0022_1750141054185.jpg";
import diagnosticImage from "@assets/DSC05873_1750141133352.jpg";
import collaborationImage from "@assets/DSC02843_1750141211187.jpg";
import leadershipImage from "@assets/DSC02841_1750141287437.jpg";
import partnershipImage from "@assets/DSC_0022_1750141322198.jpg";

export default function About() {
  const { t } = useLanguage();

  const values = [
    {
      icon: Heart,
      title: t("about.values.patientCentered.title"),
      description: t("about.values.patientCentered.description"),
    },
    {
      icon: Network,
      title: t("about.values.collaborative.title"),
      description: t("about.values.collaborative.description"),
    },
    {
      icon: BookOpen,
      title: t("about.values.evidenceInformed.title"),
      description: t("about.values.evidenceInformed.description"),
    },
    {
      icon: Shield,
      title: t("about.values.transparent.title"),
      description: t("about.values.transparent.description"),
    },
  ];

  const services = [
    t("about.services.directory"),
    t("about.services.diagnosis"),
    t("about.services.information"),
    t("about.services.resources"),
    t("about.services.committee"),
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section with Parallax */}
      <ParallaxBackground className="min-h-screen flex items-center relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#00AFE6]/30 rounded-full blur-3xl -translate-x-48 -translate-y-48" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00DD89]/30 rounded-full blur-3xl translate-x-48 translate-y-48" />
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-[#00AFE6]/15 rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-[#00DD89]/15 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />

        {/* Animated Brand Elements */}
        <motion.div
          className="absolute top-20 left-20 w-16 h-16 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-12 h-12 bg-gradient-to-r from-[#00DD89] to-[#00AFE6] rounded-full opacity-25"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/3 w-8 h-8 bg-[#00AFE6]/40 rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            {/* Hero Content */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.6, -0.05, 0.01, 0.99] }}
            >
              <motion.div
                className="inline-block mb-6 mx-auto"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="flex items-center gap-2 bg-gradient-to-r from-[#00AFE6]/20 to-[#00DD89]/20 backdrop-blur-xl rounded-full px-4 py-2 border border-[#00AFE6]/30 shadow-lg shadow-[#00AFE6]/10 mx-auto">
                  <Heart className="w-4 h-4 text-[#00AFE6]" />
                  <span className="text-sm font-medium text-gray-700 dark:text-white/90">
                    {t("about.hero.badge")}
                  </span>
                  <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full animate-pulse" />
                </div>
              </motion.div>

              <motion.h1
                className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-rosarivo mb-8 leading-[1.2]"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <span className="bg-gradient-to-r from-gray-900 via-gray-900 to-gray-700 dark:from-white dark:via-white dark:to-white/70 bg-clip-text text-transparent">
                  {t("about.hero.title.connecting")}
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                  {t("about.hero.title.healthcare")}
                </span>
                <br />
                <span className="bg-gradient-to-r from-gray-900 via-gray-900 to-gray-700 dark:from-white dark:via-white dark:to-white/70 bg-clip-text text-transparent">
                  {t("about.hero.title.canada")}
                </span>
              </motion.h1>

              <motion.p
                className="text-xl text-gray-600 dark:text-white/70 leading-relaxed mb-6 mx-auto max-w-3xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Building a national platform for clinical practice support.
              </motion.p>

              <motion.p
                className="text-lg text-gray-600 dark:text-white/70 leading-relaxed mb-10 mx-auto max-w-4xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Founded by healthcare professionals for healthcare
                professionals. We unite clinicians, researchers, and
                institutions to advance amyloidosis care through
                multidisciplinary collaboration.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </ParallaxBackground>

      {/* Executive Committee Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 backdrop-blur-xl rounded-full px-6 py-3 border border-[#00AFE6]/20 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Award className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-sm font-medium text-gray-700 dark:text-white/90">
                Leadership
              </span>
            </motion.div>

            <h2 className="crawford-section-title mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                Executive Committee
              </span>
            </h2>
          </motion.div>

          {/* Leadership Image and Stats */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
            {/* Content Column - Left Side */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="text-lg text-gray-600 dark:text-white/70 leading-relaxed mb-6">
                The CAS Executive Committee is composed of clinical leaders,
                researchers, strategic partners, and lived-experience advisors
                from across Canada. This group guides platform strategy, ensures
                ethical oversight, and supports resource curation while
                advancing clinical practice and patient outcomes.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full mt-3 flex-shrink-0" />
                  <p className="text-gray-600 dark:text-white/70">
                    Clinical leaders from across Canada
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full mt-3 flex-shrink-0" />
                  <p className="text-gray-600 dark:text-white/70">
                    Research specialists and academic partners
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full mt-3 flex-shrink-0" />
                  <p className="text-gray-600 dark:text-white/70">
                    Strategic partners and lived-experience advisors
                  </p>
                </div>
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
                <div className="aspect-[3/2] relative">
                  <img
                    src={leadershipImage}
                    alt="Healthcare professionals collaborating, representing the Executive Committee's leadership and expertise"
                    className="w-full h-full object-cover"
                  />

                  {/* Leadership Stats Overlay */}
                  <motion.div
                    className="absolute bottom-6 left-6 right-6 bg-white/90 dark:bg-white/10 backdrop-blur-xl border border-gray-200 dark:border-white/20 rounded-2xl shadow-2xl"
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
                            8
                          </div>
                          <div className="text-xs text-gray-600 dark:text-white/80">
                            Committee Members
                          </div>
                        </motion.div>

                        <motion.div
                          className="text-center"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.7 }}
                        >
                          <div className="text-2xl font-bold bg-gradient-to-r from-[#00DD89] to-[#00AFE6] bg-clip-text text-transparent">
                            3
                          </div>
                          <div className="text-xs text-gray-600 dark:text-white/80">
                            Specialties
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Floating accent elements */}
                <motion.div
                  className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-purple-500 to-[#00AFE6] rounded-2xl flex items-center justify-center"
                  animate={{
                    y: [0, -8, 0],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                >
                  <Award className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Committee Members */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Sarah Chen",
                title: "Medical Director",
                institution: "Toronto General Hospital",
                specialty: "Cardiology & Amyloidosis",
                image: leadershipImage,
                bio: "Leading expert in cardiac amyloidosis with 15+ years of experience in diagnosis and treatment.",
              },
              {
                name: "Dr. Michael Thompson",
                title: "Clinical Research Lead",
                institution: "Vancouver General Hospital",
                specialty: "Hematology & Oncology",
                image: collaborationImage,
                bio: "Specializes in AL amyloidosis and plasma cell disorders, active researcher in novel therapies.",
              },
              {
                name: "Dr. Jennifer Walsh",
                title: "Patient Care Coordinator",
                institution: "McGill University Health Centre",
                specialty: "Nephrology & Research",
                image: diagnosticImage,
                bio: "Expert in renal amyloidosis and biomarker development, leads national research initiatives.",
              },
              {
                name: "Dr. David Kumar",
                title: "Technology Integration",
                institution: "Calgary Foothills Hospital",
                specialty: "Internal Medicine",
                image: facilityImage,
                bio: "Develops clinical practice guidelines and diagnostic pathways for amyloidosis care.",
              },
              {
                name: "Dr. Lisa Martinez",
                title: "Community Outreach",
                institution: "The Ottawa Hospital",
                specialty: "Pathology & Diagnostics",
                image: partnershipImage,
                bio: "Leads educational initiatives and professional development programs for clinicians.",
              },
              {
                name: "Dr. Robert Fraser",
                title: "Quality Assurance",
                institution: "Health Sciences Centre, Winnipeg",
                specialty: "Digital Health & AI",
                image: leadershipImage,
                bio: "Pioneers digital health solutions and AI applications in amyloidosis diagnosis.",
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 backdrop-blur-xl rounded-2xl p-6 border border-[#00AFE6]/20 dark:border-[#00AFE6]/30 hover:border-[#00AFE6]/40 dark:hover:border-[#00AFE6]/50 hover:shadow-2xl hover:shadow-[#00AFE6]/20 hover:scale-105 transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="relative mb-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-[#00DD89] to-[#00AFE6] rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-[#00AFE6] font-semibold text-sm mb-2">
                    {member.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image Column - Left Side */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10">
                <div className="aspect-[3/2] relative">
                  <img
                    src={diagnosticImage}
                    alt="Healthcare professional using diagnostic equipment, representing our vision for timely and accurate diagnosis"
                    className="w-full h-full object-cover object-top"
                  />

                  {/* Floating accent elements */}
                  <motion.div
                    className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-2xl flex items-center justify-center"
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
                    <Heart className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Content Column - Right Side */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Target className="w-5 h-5 text-[#00AFE6]" />
                <span className="text-sm font-medium text-gray-700 dark:text-white/90">
                  Our Vision
                </span>
              </motion.div>

              <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-6 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                  A Better
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                  Future
                </span>
              </h2>

              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#00AFE6]/20 to-[#00DD89]/20 rounded-full blur-2xl -translate-y-12 translate-x-12" />

                <div className="relative z-10">
                  <blockquote className="text-xl text-gray-700 dark:text-white/90 leading-relaxed font-medium italic border-l-4 border-[#00AFE6] pl-6 mb-6">
                    "A Canada where every person affected by amyloidosis
                    receives timely, accurate diagnosis and high-quality care."
                  </blockquote>

                  <p className="text-gray-600 dark:text-white/70 leading-relaxed">
                    We envision a healthcare system where amyloidosis is
                    recognized early, managed effectively, and where patients
                    and families receive the support they need throughout their
                    journey.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 mb-6">
              <Shield className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-sm font-medium text-gray-700 dark:text-white/90">
                Our Values
              </span>
            </div>
            <h2 className="crawford-section-title mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                Guided by
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Core Principles
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="backdrop-blur-xl rounded-2xl p-8 border transition-all duration-300 group hover:shadow-2xl bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 border-[#00AFE6]/20 dark:border-[#00AFE6]/30 hover:from-[#00AFE6]/12 hover:to-[#00DD89]/12 dark:hover:from-[#00AFE6]/20 dark:hover:to-[#00DD89]/20 hover:border-[#00AFE6]/40 dark:hover:border-[#00AFE6]/50 hover:shadow-[#00AFE6]/25 dark:hover:shadow-[#00AFE6]/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 font-rosarivo text-gray-900 dark:text-white">
                      {value.title}
                    </h3>
                    <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                      {value.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 mb-6">
                <Globe className="w-5 h-5 text-[#00AFE6]" />
                <span className="text-sm font-medium text-gray-700 dark:text-white/90">
                  What We Do
                </span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-6 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                  Building
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                  Connections
                </span>
              </h2>

              <p className="text-lg text-gray-600 dark:text-white/70 leading-relaxed mb-8">
                We create pathways for collaboration, knowledge sharing, and
                coordinated care across Canada's amyloidosis community.
              </p>
            </motion.div>

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
                    src={collaborationImage}
                    alt="Healthcare professionals collaborating at workstations, representing our network of connections and coordinated care"
                    className="w-full h-full object-cover"
                  />

                  {/* Services Overlay */}
                  {/* <motion.div
                    className="absolute bottom-6 left-6 right-6 bg-white/90 dark:bg-white/10 backdrop-blur-xl border border-gray-200 dark:border-white/20 rounded-2xl shadow-2xl"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">
                        Our Services
                      </h3>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {services.slice(0, 3).map((service, index) => (
                          <motion.div
                            key={index}
                            className="flex items-start gap-2"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.6,
                              delay: 0.6 + index * 0.1,
                            }}
                            viewport={{ once: true }}
                          >
                            <div className="w-1.5 h-1.5 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full mt-2 flex-shrink-0" />
                            <p className="text-xs text-gray-600 dark:text-white/80 leading-relaxed">
                              {service}
                            </p>
                          </motion.div>
                        ))}
                        <div className="text-xs text-gray-500 dark:text-white/60 pt-1">
                          +{services.length - 3} more services
                        </div>
                      </div>
                    </div>
                  </motion.div> */}
                </div>

                {/* Floating accent elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-[#00DD89] to-[#00AFE6] rounded-2xl flex items-center justify-center"
                  animate={{
                    y: [0, -8, 0],
                    rotate: [0, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Network className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
