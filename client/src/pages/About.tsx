import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  X,
} from "lucide-react";
import ParallaxBackground from "../components/ParallaxBackground";
import { useLanguage } from "@/contexts/LanguageContext";
import facilityImage from "@assets/DSC_0022_1750141054185.jpg";
import diagnosticImage from "@assets/DSC05873_1750141133352.jpg";
import collaborationImage from "@assets/DSC02843_1750141211187.jpg";
import leadershipImage from "@assets/DSC02841_1750141287437.jpg";
import partnershipImage from "@assets/DSC_0022_1750141322198.jpg";
import nowellFinePhoto from "@assets/Nowell_Fine_1772024001282.jpeg";
import margotDavisPhoto from "@assets/Margo_Davis_1772024001281.jpg";
import michelleMezeiPhoto from "@assets/Michelle_Mezei_1772024001282.jpeg";
import victorJimenezPhoto from "@assets/Victor_Jimenez-Zepeda_1772024001277.jpg";
import janVeenhuyzenPhoto from "@assets/Jan_Veenhuyzen_1772024001281.jpg";

type CommitteeMember = {
  name: string;
  institution: string;
  photo?: string;
  description?: string;
};

export default function About() {
  const { t } = useLanguage();
  const [selectedMember, setSelectedMember] = useState<CommitteeMember | null>(null);

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
                The CAS Executive Committee is composed of clinical leaders, researchers, and strategic partner advisors from across Canada.
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
                    Strategic partner advisors
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

              </div>
            </motion.div>
          </div>

          {/* CAS Director */}
          <div className="mb-12">
            <motion.h3 
              className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              CAS Director
            </motion.h3>
            <div className="flex justify-center">
              <motion.div
                className="bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 backdrop-blur-xl rounded-2xl p-6 border border-[#00AFE6]/20 dark:border-[#00AFE6]/30 hover:border-[#00AFE6]/40 dark:hover:border-[#00AFE6]/50 hover:shadow-2xl hover:shadow-[#00AFE6]/20 transition-all duration-300 group w-full max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex gap-5 items-center mb-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden ring-2 ring-[#00AFE6]/30">
                      <img src={nowellFinePhoto} alt="Nowell Fine" className="w-full h-full object-cover object-top" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-base font-bold text-gray-900 dark:text-white mb-0.5 leading-snug">
                      Nowell Fine, MD, SM, FRCPC
                    </h4>
                    <p className="text-[#00AFE6] font-semibold text-sm">
                      University of Calgary
                    </p>
                  </div>
                </div>
                <div className="border-t border-[#00AFE6]/20 pt-4">
                  <p className="text-gray-600 dark:text-white/70 text-sm leading-relaxed line-clamp-3 mb-2">
                    Dr. Fine is a heart failure cardiologist and echocardiologist in the Departments of Cardiac Sciences, Medicine, and Community Health Sciences at the University of Calgary's Cumming School of Medicine. He is the Director of the Amyloidosis Program of Calgary, Director of the Cardiac Amyloidosis Clinic and Co-Principal Investigator for the Canadian Registry for Amyloidosis Research.
                  </p>
                  <button
                    onClick={() => setSelectedMember({
                      name: "Nowell Fine, MD, SM, FRCPC",
                      institution: "University of Calgary",
                      photo: nowellFinePhoto,
                      description: "Dr. Fine is a heart failure cardiologist and echocardiologist in the Departments of Cardiac Sciences, Medicine, and Community Health Sciences at the University of Calgary's Cumming School of Medicine. He is the Director of the Amyloidosis Program of Calgary, Director of the Cardiac Amyloidosis Clinic and Co-Principal Investigator for the Canadian Registry for Amyloidosis Research.",
                    })}
                    className="text-sm font-semibold text-[#00AFE6] hover:text-[#00DD89] transition-colors duration-200 underline underline-offset-2"
                  >
                    Read More
                  </button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* CAS Executive Committee Members */}
          <div>
            <motion.h3 
              className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              CAS Executive Committee Members
            </motion.h3>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  name: "Margot K. Davis, MD, MSc, FRCPC, FCCS",
                  institution: "University of British Columbia",
                  photo: margotDavisPhoto,
                  description: "Dr. Davis is an advanced heart failure and transplant cardiologist at St. Paul's Hospital, a Clinical Associate Professor at the University of British Columbia, and Director of the UBC Cardiac Amyloidosis Clinic and the UBC Cardiology-Oncology Program. Her research focuses on cardiac amyloidosis, heart disease in cancer patients, and advanced heart failure. She is Co-Principal Investigator of the Canadian Registry for Amyloidosis Research, Vice President of the Canadian Heart Failure Society, and Western Regional Director of the Canadian Cardiovascular Society.",
                },
                {
                  name: "Michelle Mezei, BSc(Pharm), MDCM, FRCPC",
                  institution: "University of British Columbia",
                  photo: michelleMezeiPhoto,
                  description: "Dr. Michelle Mezei is a Clinical Professor of Neurology at the University of British Columbia and works as a neurology consultant in the Vancouver Centre for Neuromuscular Disease and Adult Metabolic Diseases Clinic, Vancouver General Hospital. She is the past UBC Neuromuscular Fellowship Director (2008–2024) and ongoing Academic Head of Neuromuscular Clinical Trials. Dr. Mezei has a longstanding special interest in hereditary ATTR polyneuropathy, including as Principal Investigator in several pivotal trials. Additional special interests include myasthenia gravis and mitochondrial disorders. She serves nationally with the Canadian Neurological Sciences Federation (CNSF) as Co-Vice President of the Scientific Program Committee for the Annual Congress, and is a longstanding board member of the Canadian Society of Clinical Neurophysiologists (CSCN). Dr. Mezei's patient advocacy work includes with TTR Amyloidosis Canada and serving on the national board of MitoCanada.",
                },
                {
                  name: "Victor Jimenez-Zepeda, MD, FRCPC",
                  institution: "University of Calgary",
                  photo: victorJimenezPhoto,
                  description: "Dr. Jimenez-Zepeda is an Associate Professor of Medicine at the University of Calgary's Cumming School of Medicine. He leads the clinical program for AL amyloidosis at the Tom Baker Cancer Center and founded the clinic for the assessment of Monoclonal Gammopathy of Clinical and Undetermined Significance and the Amyloid Screening Clinic. He is a member of the International Kidney and Monoclonal Gammopathy Research Group and the International Society of Amyloidosis.",
                },
                {
                  name: "Jan Veenhuyzen, R.N., BScN",
                  institution: "University of Calgary",
                  photo: janVeenhuyzenPhoto,
                  description: "Jan is the program manager of the Amyloidosis Program of Calgary, Libin Cardiovascular Institute, Department of Cardiac Sciences at the University of Calgary. She has 30 years of cardiac nursing experience in diverse practice settings ranging from critical care to ambulatory care, and more than 15 years of clinical research experience. Jan has served in various leadership roles to develop and advance specialized clinical and research programs. Her role with the CAS includes organizational advancement through strategic planning and operational oversight. She is the Chair of the Canadian Amyloidosis Nursing Network (CANN) and past Co-Chair of the Prairie Amyloidosis Nursing Network (PANN).",
                },
                {
                  name: "Genevieve Matte, MD",
                  institution: "Université de Montréal",
                },
                {
                  name: "François Tournoux, MD",
                  institution: "McGill University",
                },
                {
                  name: "Christopher Venner, MD",
                  institution: "University of British Columbia",
                },
              ].map((member, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 backdrop-blur-xl rounded-2xl p-6 border border-[#00AFE6]/20 dark:border-[#00AFE6]/30 hover:border-[#00AFE6]/40 dark:hover:border-[#00AFE6]/50 hover:shadow-2xl hover:shadow-[#00AFE6]/20 transition-all duration-300 group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex gap-5 items-center mb-4">
                    <div className="relative flex-shrink-0">
                      {member.photo ? (
                        <div className="w-32 h-32 rounded-2xl overflow-hidden ring-2 ring-[#00AFE6]/30">
                          <img src={member.photo} alt={member.name} className="w-full h-full object-cover object-top" />
                        </div>
                      ) : (
                        <div className="w-32 h-32 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-2xl flex items-center justify-center">
                          <Users className="w-12 h-12 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-base font-bold text-gray-900 dark:text-white mb-0.5 leading-snug">
                        {member.name}
                      </h4>
                      <p className="text-[#00AFE6] font-semibold text-sm">
                        {member.institution}
                      </p>
                    </div>
                  </div>
                  {member.description && (
                    <div className="border-t border-[#00AFE6]/20 pt-4">
                      <p className="text-gray-600 dark:text-white/70 text-sm leading-relaxed line-clamp-3 mb-2">
                        {member.description}
                      </p>
                      <button
                        onClick={() => setSelectedMember(member)}
                        className="text-sm font-semibold text-[#00AFE6] hover:text-[#00DD89] transition-colors duration-200 underline underline-offset-2"
                      >
                        Read More
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
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
                <div className="aspect-[2/1] relative">
                  <img
                    src={collaborationImage}
                    alt="Healthcare professionals collaborating at workstations, representing our network of connections and coordinated care"
                    className="w-full h-full object-cover object-top"
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

      {/* Bio Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="bg-white dark:bg-gray-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="relative p-6 bg-gradient-to-br from-[#00AFE6]/10 to-[#00DD89]/10 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                <div className="flex gap-6 items-center pr-10">
                  {selectedMember.photo ? (
                    <div className="w-48 h-48 rounded-2xl overflow-hidden ring-2 ring-[#00AFE6]/30 flex-shrink-0">
                      <img src={selectedMember.photo} alt={selectedMember.name} className="w-full h-full object-cover object-top" />
                    </div>
                  ) : (
                    <div className="w-48 h-48 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Users className="w-20 h-20 text-white" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">
                      {selectedMember.name}
                    </h3>
                    <p className="text-[#00AFE6] font-semibold text-sm mt-0.5">
                      {selectedMember.institution}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal body */}
              <div className="p-6">
                <p className="text-gray-600 dark:text-white/70 text-sm leading-relaxed">
                  {selectedMember.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
