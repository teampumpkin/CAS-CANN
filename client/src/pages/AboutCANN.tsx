import { motion } from "framer-motion";
import { useEffect } from "react";
import { useScrollAnimations } from "@/hooks/use-scroll-animations";
import { Link } from "wouter";
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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ParallaxBackground from "../components/ParallaxBackground";
import healthcareProfessionalImg from "@assets/DSC02826_1750068895453.jpg";
import medicalTeamImg from "@assets/DSC02841_1750068895454.jpg";
import medicalResearchImg from "@assets/DSC02841_1750068895454.jpg";
import cannLogoImg from "@assets/CANN-RGB-dark-theme_1756219144378.png";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AboutCANN() {
  const { language, t } = useLanguage();
  useScrollAnimations();

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
      title: t('aboutCANN.mission.title'),
      description: t('aboutCANN.heroDescription'),
      keyPoints: [
        t('aboutCANN.mission.keyPoint1'),
        t('aboutCANN.mission.keyPoint2'),
        t('aboutCANN.mission.keyPoint3'),
        t('aboutCANN.mission.keyPoint4'),
      ],
    },
    objectives: [
      {
        title: t('aboutCANN.objectives.education.title'),
        description: t('aboutCANN.objectives.education.description'),
        icon: GraduationCap,
        color: "from-pink-500 to-rose-500",
      },
      {
        title: t('aboutCANN.objectives.networking.title'),
        description: t('aboutCANN.objectives.networking.description'),
        icon: Network,
        color: "from-purple-500 to-pink-500",
      },
      {
        title: t('aboutCANN.objectives.knowledge.title'),
        description: t('aboutCANN.objectives.knowledge.description'),
        icon: BookOpen,
        color: "from-fuchsia-500 to-purple-500",
      },
      {
        title: t('aboutCANN.objectives.advocacy.title'),
        description: t('aboutCANN.objectives.advocacy.description'),
        icon: Heart,
        color: "from-violet-500 to-fuchsia-500",
      },
    ],
    network: {
      coverage: t('aboutCANN.nationalCoverage'),
      centers: t('aboutCANN.unitingCenters'),
      provinces: t('aboutCANN.network.provinces'),
      territories: t('aboutCANN.network.territories'),
    },
    achievements: [
      {
        title: t('aboutCANN.achievements.research.title'),
        description: t('aboutCANN.achievements.research.description'),
        stat: "12+",
        label: t('aboutCANN.achievements.research.label'),
      },
      {
        title: t('aboutCANN.achievements.training.title'),
        description: t('aboutCANN.achievements.training.description'),
        stat: "200+",
        label: t('aboutCANN.achievements.training.label'),
      },
      {
        title: t('aboutCANN.achievements.patient.title'),
        description: t('aboutCANN.achievements.patient.description'),
        stat: "40%",
        label: t('aboutCANN.achievements.patient.label'),
      },
      {
        title: t('aboutCANN.achievements.knowledge.title'),
        description: t('aboutCANN.achievements.knowledge.description'),
        stat: "35+",
        label: t('aboutCANN.achievements.knowledge.label'),
      },
    ],
  };

  const keyPillars = [
    {
      icon: GraduationCap,
      title: t('aboutCANN.pillars.professionalDevelopment.title'),
      description: t('aboutCANN.pillars.professionalDevelopment.description'),
      color: "from-pink-400 to-rose-400",
    },
    {
      icon: Globe,
      title: t('aboutCANN.pillars.nationalCollaboration.title'),
      description: t('aboutCANN.pillars.nationalCollaboration.description'),
      color: "from-purple-400 to-pink-400",
    },
    {
      icon: Heart,
      title: t('aboutCANN.pillars.patientImpact.title'),
      description: t('aboutCANN.pillars.patientImpact.description'),
      color: "from-fuchsia-400 to-purple-400",
    },
  ];

  const membershipBenefits = [
    {
      icon: Network,
      title: t('aboutCANN.benefits.professionalNetwork.title'),
      description: t('aboutCANN.benefits.professionalNetwork.description'),
      color: "from-pink-400 to-rose-400",
    },
    {
      icon: BookOpen,
      title: t('aboutCANN.benefits.educationalResources.title'),
      description: t('aboutCANN.benefits.educationalResources.description'),
      color: "from-purple-400 to-pink-400",
    },
    {
      icon: Users,
      title: t('aboutCANN.benefits.knowledgeSharing.title'),
      description: t('aboutCANN.benefits.knowledgeSharing.description'),
      color: "from-fuchsia-400 to-purple-400",
    },
    {
      icon: Award,
      title: t('aboutCANN.benefits.professionalDev.title'),
      description: t('aboutCANN.benefits.professionalDev.description'),
      color: "from-violet-400 to-fuchsia-400",
    },
    {
      icon: Globe,
      title: t('aboutCANN.benefits.nationalCoverage.title'),
      description: t('aboutCANN.benefits.nationalCoverage.description'),
      color: "from-pink-400 to-rose-400",
    },
    {
      icon: Heart,
      title: t('aboutCANN.benefits.patientImpact.title'),
      description: t('aboutCANN.benefits.patientImpact.description'),
      color: "from-rose-400 to-pink-400",
    },
  ];

  const membershipRequirements = [
    t('aboutCANN.joinCANN.req1'),
    t('aboutCANN.joinCANN.req2'),
    t('aboutCANN.joinCANN.req3'),
  ];

  const portalFeatures = [
    t('aboutCANN.portalFeatures.feature1'),
    t('aboutCANN.portalFeatures.feature2'),
    t('aboutCANN.portalFeatures.feature3'),
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
                  {t('aboutCANN.badge')}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-rosarivo mb-6 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                  {t('aboutCANN.heroTitle.about')}
                </span>
                <br />
                <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  {t('aboutCANN.heroTitle.network')}
                </span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed max-w-3xl mx-auto">
                {t('aboutCANN.heroDescription')}
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
                    {t('aboutCANN.mission.badge')}
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-rosarivo mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                    {t('aboutCANN.mission.title')}
                  </span>
                </h2>

                <div className="space-y-6 text-gray-600 dark:text-white/70 leading-relaxed">
                  <p className="text-lg">
                    {t('aboutCANN.mission.description')}
                  </p>
                </div>

                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 mt-8">
                  {t('aboutCANN.keyPillars')}
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
                    {t('aboutCANN.networkImpact')}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-pink-600 font-medium">
                        {t('aboutCANN.coverage')}
                      </span>
                      <div className="text-gray-700 dark:text-white/80">
                        {t('aboutCANN.nationalCoverage')}
                      </div>
                    </div>
                    <div>
                      <span className="text-pink-600 font-medium">
                        {t('aboutCANN.centers')}
                      </span>
                      <div className="text-gray-700 dark:text-white/80">
                        {t('aboutCANN.unitingCenters')}
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
                              {t('aboutCANN.provinces')}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                              {networkData.network.territories}
                            </div>
                            <div className="text-xs text-gray-700 dark:text-white/80">
                              {t('aboutCANN.territories')}
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
                {t('aboutCANN.objectivesTitle')}
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed max-w-3xl mx-auto">
              {t('aboutCANN.objectivesSubtitle')}
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
                  {t('aboutCANN.membershipBenefitsTitle')}
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed max-w-3xl mx-auto">
                {t('aboutCANN.membershipBenefitsSubtitle')}
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

              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 sm:p-8 mb-8 text-left max-w-md mx-auto sm:max-w-lg">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 text-left">
                  Membership Requirements
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {membershipRequirements.map((requirement, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base text-left">
                        {requirement}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Link href="/join-cas">
                <Button
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-pink-500/25 transition-all duration-300"
                  data-testid="button-register-cann"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Register for CANN membership
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Member Portal Section - Commented out for now
      <section className="py-24 bg-white dark:bg-gray-900 relative">
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
                  Member Portal Access
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed max-w-3xl mx-auto">
                Access exclusive resources and connect with fellow members through our dedicated portal.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      */}
    </div>
  );
}
