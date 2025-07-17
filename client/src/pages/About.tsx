import { motion } from 'framer-motion';
import { Users, Target, Heart, Shield, BookOpen, Network, UserCheck, Globe, ArrowRight, Stethoscope, Building2, Award } from 'lucide-react';
import ParallaxBackground from '../components/ParallaxBackground';
import { useLanguage } from '@/contexts/LanguageContext';
import facilityImage from '@assets/DSC_0022_1750141054185.jpg';
import diagnosticImage from '@assets/DSC05873_1750141133352.jpg';
import collaborationImage from '@assets/DSC02843_1750141211187.jpg';
import leadershipImage from '@assets/DSC02841_1750141287437.jpg';
import partnershipImage from '@assets/DSC_0022_1750141322198.jpg';

export default function About() {
  const { t } = useLanguage();
  
  const values = [
    {
      icon: Heart,
      title: t('about.values.patientCentered.title'),
      description: t('about.values.patientCentered.description')
    },
    {
      icon: Network,
      title: t('about.values.collaborative.title'),
      description: t('about.values.collaborative.description')
    },
    {
      icon: BookOpen,
      title: t('about.values.evidenceInformed.title'),
      description: t('about.values.evidenceInformed.description')
    },
    {
      icon: Shield,
      title: t('about.values.transparent.title'),
      description: t('about.values.transparent.description')
    }
  ];

  const services = [
    t('about.services.directory'),
    t('about.services.diagnosis'),
    t('about.services.information'),
    t('about.services.resources'),
    t('about.services.committee')
  ];

  const partners = [
    { 
      name: 'Transthyretin Amyloidosis Canada (TAC)', 
      shortName: 'TAC',
      url: 'https://madhattr.ca/',
      description: 'Patient and family support network for transthyretin amyloidosis'
    },
    { 
      name: 'Canadian Amyloidosis Network (CANN)', 
      shortName: 'CANN',
      url: '#',
      description: 'National network for amyloidosis research and care'
    },
    { 
      name: 'Amyloidosis Research Consortium (ARC)', 
      shortName: 'ARC',
      url: 'https://arci.org/about-amyloidosis/al-amyloidosis/',
      description: 'International amyloidosis research network'
    },
    { 
      name: 'International Society of Amyloidosis (ISA)', 
      shortName: 'ISA',
      url: 'https://www.isaamyloidosis.org/',
      description: 'Global amyloidosis medical society'
    }
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
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-12 h-12 bg-gradient-to-r from-[#00DD89] to-[#00AFE6] rounded-full opacity-25"
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/3 w-8 h-8 bg-[#00AFE6]/40 rounded-full"
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.6, -0.05, 0.01, 0.99] }}
            >
              <motion.div
                className="inline-block mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="flex items-center gap-2 bg-gradient-to-r from-[#00AFE6]/20 to-[#00DD89]/20 backdrop-blur-xl rounded-full px-4 py-2 border border-[#00AFE6]/30 shadow-lg shadow-[#00AFE6]/10">
                  <Heart className="w-4 h-4 text-[#00AFE6]" />
                  <span className="text-sm font-medium text-gray-700 dark:text-white/90">{t('about.hero.badge')}</span>
                  <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full animate-pulse" />
                </div>
              </motion.div>
              
              <motion.h1
                className="text-5xl lg:text-7xl font-bold font-rosarivo mb-8 leading-none"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <span className="bg-gradient-to-r from-gray-900 via-gray-900 to-gray-700 dark:from-white dark:via-white dark:to-white/70 bg-clip-text text-transparent">
                  {t('about.hero.title.connecting')}
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                  {t('about.hero.title.healthcare')}
                </span>
                <br />
                <span className="bg-gradient-to-r from-gray-900 via-gray-900 to-gray-700 dark:from-white dark:via-white dark:to-white/70 bg-clip-text text-transparent">
                  {t('about.hero.title.canada')}
                </span>
              </motion.h1>
              
              <motion.p
                className="text-xl text-gray-600 dark:text-white/70 leading-relaxed mb-10 max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                {t('about.hero.description')}
              </motion.p>
              
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <button className="group bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-8 py-4 rounded-full font-medium hover:shadow-2xl hover:shadow-[#00AFE6]/25 transition-all duration-300 flex items-center gap-2 hover:scale-105 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00DD89] to-[#00AFE6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10">{t('about.hero.ourMission')}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
                </button>
                <button className="bg-gradient-to-r from-gray-200/20 to-gray-300/10 dark:from-white/10 dark:to-white/5 backdrop-blur-xl text-gray-700 dark:text-white px-8 py-4 rounded-full font-medium border border-[#00AFE6]/30 hover:bg-gradient-to-r hover:from-[#00AFE6]/20 hover:to-[#00DD89]/20 hover:border-[#00AFE6]/50 transition-all duration-300 hover:scale-105 shadow-lg shadow-[#00AFE6]/5">
                  {t('about.hero.getInvolved')}
                </button>
              </motion.div>
            </motion.div>
            
            {/* Hero Visual */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <div className="relative">
                {/* Main visual card */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-[#00AFE6]/20 shadow-2xl shadow-[#00AFE6]/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00AFE6]/10 to-[#00DD89]/10 rounded-full blur-2xl -translate-y-16 translate-x-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#00DD89]/10 to-[#00AFE6]/10 rounded-full blur-xl translate-y-12 -translate-x-12" />
                  <div className="relative z-10">
                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <motion.div 
                        className="bg-gradient-to-r from-[#00AFE6]/20 to-[#00DD89]/20 rounded-2xl p-6 text-center border border-[#00AFE6]/30 hover:border-[#00AFE6]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#00AFE6]/20"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Stethoscope className="w-8 h-8 text-[#00AFE6] mx-auto mb-3" />
                        <div className="text-2xl font-bold bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">50+</div>
                        <div className="text-sm text-gray-600 dark:text-white/70">Clinicians</div>
                      </motion.div>
                      <motion.div 
                        className="bg-gradient-to-r from-[#00DD89]/20 to-[#00AFE6]/20 rounded-2xl p-6 text-center border border-[#00DD89]/30 hover:border-[#00DD89]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#00DD89]/20"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Building2 className="w-8 h-8 text-[#00DD89] mx-auto mb-3" />
                        <div className="text-2xl font-bold bg-gradient-to-r from-[#00DD89] to-[#00AFE6] bg-clip-text text-transparent">25+</div>
                        <div className="text-sm text-gray-600 dark:text-white/70">Institutions</div>
                      </motion.div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6]/20 to-[#00DD89]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#00AFE6]/30">
                        <Award className="w-6 h-6 text-[#00AFE6]" />
                      </div>
                      <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent mb-2">National Platform</h3>
                      <p className="text-gray-600 dark:text-white/60 text-sm">Connecting the amyloidosis community across Canada</p>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <motion.div
                  className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#00AFE6]/25 border border-[#00AFE6]/30"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Heart className="w-8 h-8 text-white" />
                </motion.div>
                
                <motion.div
                  className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-[#00DD89]/20 to-[#00AFE6]/20 backdrop-blur-xl rounded-xl border border-[#00DD89]/30 flex items-center justify-center shadow-lg shadow-[#00DD89]/20"
                  animate={{ 
                    x: [0, 10, 0],
                    y: [0, -5, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                >
                  <Users className="w-6 h-6 text-[#00DD89]" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </ParallaxBackground>

      {/* Who We Are Section */}
      <section className="py-24 relative bg-gray-50 dark:bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-100/20 dark:via-white/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content Column - Left Side */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Users className="w-5 h-5 text-[#00AFE6]" />
                <span className="text-sm font-medium text-gray-700 dark:text-white/90">Who We Are</span>
              </motion.div>
              
              <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-6 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                  Clinician-Led,
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                  Patient-Informed
                </span>
              </h2>
              
              <p className="text-lg text-gray-600 dark:text-white/70 leading-relaxed mb-8">
                The Canadian Amyloidosis Society (CAS) is dedicated to increasing awareness, accelerating diagnosis, and improving coordinated care for people living with amyloidosis. We serve as a national platform to connect, align, and support individuals and institutions working across the amyloidosis spectrum.
              </p>
              
              <div className="flex gap-4">
                <div className="bg-gradient-to-r from-[#00AFE6]/20 to-[#00DD89]/20 rounded-xl p-4 flex-1">
                  <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">100%</div>
                  <div className="text-sm text-gray-600 dark:text-white/70">Clinician-Led</div>
                </div>
                <div className="bg-gradient-to-r from-[#00DD89]/20 to-[#00AFE6]/20 rounded-xl p-4 flex-1">
                  <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Canada</div>
                  <div className="text-sm text-gray-600 dark:text-white/70">Nationwide</div>
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
                <div className="aspect-[4/5] relative">
                  <img 
                    src={facilityImage} 
                    alt="Modern healthcare facility representing the Canadian Amyloidosis Society's clinical network"
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
                          <div className="text-xs text-gray-600 dark:text-white/80">Expert Clinicians</div>
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
                          <div className="text-xs text-gray-600 dark:text-white/80">Provinces</div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
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
                <div className="aspect-[4/5] relative">
                  <img 
                    src={diagnosticImage} 
                    alt="Healthcare professional using diagnostic equipment, representing our vision for timely and accurate diagnosis"
                    className="w-full h-full object-cover"
                  />
                  
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
                <span className="text-sm font-medium text-gray-700 dark:text-white/90">Our Vision</span>
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
                    "A Canada where every person affected by amyloidosis receives timely, accurate diagnosis and high-quality care."
                  </blockquote>
                  
                  <p className="text-gray-600 dark:text-white/70 leading-relaxed">
                    We envision a healthcare system where amyloidosis is recognized early, managed effectively, and where patients and families receive the support they need throughout their journey.
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
              <span className="text-sm font-medium text-gray-700 dark:text-white/90">Our Values</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-6">
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
                className={`backdrop-blur-xl rounded-2xl p-8 border transition-all duration-300 group hover:shadow-2xl ${
                  index === 0 
                    ? 'bg-gradient-to-br from-pink-50/95 to-rose-50/95 dark:from-pink-900/25 dark:to-rose-900/25 border-pink-200/50 dark:border-pink-400/30 hover:from-pink-100/95 hover:to-rose-100/95 dark:hover:from-pink-800/35 dark:hover:to-rose-800/35 hover:border-pink-300/60 dark:hover:border-pink-300/40 hover:shadow-pink-200/40 dark:hover:shadow-pink-500/25'
                    : index === 1
                    ? 'bg-gradient-to-br from-emerald-50/95 to-green-50/95 dark:from-emerald-900/25 dark:to-green-900/25 border-emerald-200/50 dark:border-emerald-400/30 hover:from-emerald-100/95 hover:to-green-100/95 dark:hover:from-emerald-800/35 dark:hover:to-green-800/35 hover:border-emerald-300/60 dark:hover:border-emerald-300/40 hover:shadow-emerald-200/40 dark:hover:shadow-emerald-500/25'
                    : index === 2
                    ? 'bg-gradient-to-br from-blue-50/95 to-indigo-50/95 dark:from-blue-900/25 dark:to-indigo-900/25 border-blue-200/50 dark:border-blue-400/30 hover:from-blue-100/95 hover:to-indigo-100/95 dark:hover:from-blue-800/35 dark:hover:to-indigo-800/35 hover:border-blue-300/60 dark:hover:border-blue-300/40 hover:shadow-blue-200/40 dark:hover:shadow-blue-500/25'
                    : 'bg-gradient-to-br from-purple-50/95 to-violet-50/95 dark:from-purple-900/25 dark:to-violet-900/25 border-purple-200/50 dark:border-purple-400/30 hover:from-purple-100/95 hover:to-violet-100/95 dark:hover:from-purple-800/35 dark:hover:to-violet-800/35 hover:border-purple-300/60 dark:hover:border-purple-300/40 hover:shadow-purple-200/40 dark:hover:shadow-purple-500/25'
                }`}
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
                    <h3 className={`text-xl font-semibold mb-3 font-rosarivo ${
                      index === 0 
                        ? 'text-pink-900 dark:text-pink-100'
                        : index === 1
                        ? 'text-emerald-900 dark:text-emerald-100'
                        : index === 2
                        ? 'text-blue-900 dark:text-blue-100'
                        : 'text-purple-900 dark:text-purple-100'
                    }`}>{value.title}</h3>
                    <p className={`leading-relaxed ${
                      index === 0 
                        ? 'text-pink-700 dark:text-pink-300'
                        : index === 1
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : index === 2
                        ? 'text-blue-700 dark:text-blue-300'
                        : 'text-purple-700 dark:text-purple-300'
                    }`}>{value.description}</p>
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
                <span className="text-sm font-medium text-gray-700 dark:text-white/90">What We Do</span>
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
                We create pathways for collaboration, knowledge sharing, and coordinated care across Canada's amyloidosis community.
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
                  <motion.div
                    className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl shadow-2xl"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Our Services</h3>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {services.slice(0, 3).map((service, index) => (
                          <motion.div
                            key={index}
                            className="flex items-start gap-2"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                            viewport={{ once: true }}
                          >
                            <div className="w-1.5 h-1.5 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full mt-2 flex-shrink-0" />
                            <p className="text-xs text-gray-600 dark:text-white/80 leading-relaxed">{service}</p>
                          </motion.div>
                        ))}
                        <div className="text-xs text-gray-500 dark:text-white/60 pt-1">+{services.length - 3} more services</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Floating accent elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-[#00DD89] to-[#00AFE6] rounded-2xl flex items-center justify-center"
                  animate={{ 
                    y: [0, -8, 0],
                    rotate: [0, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Network className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Executive Committee Section */}
      <section className="py-24 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content Column - Left Side */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <UserCheck className="w-5 h-5 text-[#00AFE6]" />
                <span className="text-sm font-medium text-gray-700 dark:text-white/90">Leadership</span>
              </motion.div>
              
              <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-6 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                  Executive
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                  Committee
                </span>
              </h2>
              
              <p className="text-lg text-gray-600 dark:text-white/70 leading-relaxed mb-8">
                The CAS Executive Committee is composed of clinical leaders, researchers, strategic partners, and lived-experience advisors. This group guides platform strategy, ensures ethical oversight, and supports resource curation.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full mt-3 flex-shrink-0" />
                  <p className="text-gray-600 dark:text-white/70">Clinical leaders from across Canada</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full mt-3 flex-shrink-0" />
                  <p className="text-gray-600 dark:text-white/70">Research specialists and academic partners</p>
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
                <div className="aspect-[4/5] relative">
                  <img 
                    src={leadershipImage} 
                    alt="Healthcare professionals collaborating, representing the Executive Committee's leadership and expertise"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Leadership Stats Overlay */}
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
                            12
                          </div>
                          <div className="text-xs text-gray-600 dark:text-white/80">Committee Members</div>
                        </motion.div>
                        
                        <motion.div
                          className="text-center"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.7 }}
                        >
                          <div className="text-2xl font-bold bg-gradient-to-r from-[#00DD89] to-[#00AFE6] bg-clip-text text-transparent">
                            5
                          </div>
                          <div className="text-xs text-gray-600 dark:text-white/80">Specialties</div>
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
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                >
                  <Award className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-24 pb-32 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-white/10">
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
                <div className="aspect-[4/5] relative">
                  <img 
                    src={partnershipImage} 
                    alt="Modern healthcare complex representing our strategic partnerships and institutional collaborations"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Partnership Stats Overlay */}
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
                            15+
                          </div>
                          <div className="text-xs text-gray-600 dark:text-white/80">Strategic Partners</div>
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
                          <div className="text-xs text-gray-600 dark:text-white/80">Countries</div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Floating accent elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-green-500 to-[#00DD89] rounded-2xl flex items-center justify-center"
                  animate={{ 
                    y: [0, -8, 0],
                    rotate: [0, -5, 0]
                  }}
                  transition={{ 
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                >
                  <Users className="w-6 h-6 text-white" />
                </motion.div>
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
                <Network className="w-5 h-5 text-[#00AFE6]" />
                <span className="text-sm font-medium text-gray-700 dark:text-white/90">Our Partners</span>
              </motion.div>
              
              <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-6 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                  Strategic
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                  Partnerships
                </span>
              </h2>
              
              <p className="text-lg text-gray-600 dark:text-white/70 leading-relaxed mb-8">
                We collaborate with leading organizations, research institutions, and healthcare networks to amplify our impact and accelerate progress in amyloidosis care across Canada and internationally.
              </p>
              
              <div className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl mb-8">
                <motion.div
                  className="text-center mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-xl rounded-full px-6 py-3 border border-white/30 mb-4">
                    <Network className="w-5 h-5 text-[#00AFE6]" />
                    <span className="text-sm font-medium text-gray-700 dark:text-white/90">Strategic Alliances</span>
                  </div>
                  <h3 className="text-2xl font-bold font-rosarivo text-gray-800 dark:text-white mb-2">
                    <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                      Global
                    </span>
                    {' '}
                    <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                      Partners
                    </span>
                  </h3>
                  <p className="text-gray-600 dark:text-white/70 text-sm max-w-md mx-auto">
                    Collaborating with leading organizations to advance amyloidosis care worldwide
                  </p>
                </motion.div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {partners.map((partner, index) => (
                    <motion.a
                      key={partner.shortName}
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative group"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -8 }}
                    >
                      <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-500 group-hover:bg-white/10 overflow-hidden">
                        {/* Background Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00AFE6]/5 via-transparent to-[#00DD89]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Content */}
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#00AFE6]/30 to-[#00DD89]/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all duration-500 shadow-lg">
                              <span className="text-xl font-bold text-white drop-shadow-lg">{partner.shortName}</span>
                            </div>
                            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-[#00AFE6]/20 transition-all duration-300">
                              <svg className="w-4 h-4 text-white/60 group-hover:text-[#00AFE6] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <h4 className="text-gray-800 dark:text-white font-bold text-lg group-hover:text-[#00AFE6] transition-colors duration-300 leading-tight">
                              {partner.name}
                            </h4>
                            <p className="text-gray-600 dark:text-white/80 text-sm leading-relaxed group-hover:text-gray-800 dark:group-hover:text-white transition-colors duration-300">
                              {partner.description}
                            </p>
                          </div>
                        </div>
                        
                        {/* Floating Elements */}
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200" />
                        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-r from-[#00DD89] to-[#00AFE6] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300" />
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full mt-3 flex-shrink-0" />
                  <p className="text-gray-600 dark:text-white/70">International amyloidosis organizations</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full mt-3 flex-shrink-0" />
                  <p className="text-gray-600 dark:text-white/70">Leading Canadian research institutions</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full mt-3 flex-shrink-0" />
                  <p className="text-gray-600 dark:text-white/70">Healthcare networks and specialty centers</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}