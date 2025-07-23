import { motion } from 'framer-motion';
import { Heart, AlertTriangle, Search, Microscope, Stethoscope, Activity, Brain, Droplets, Users, ArrowRight, Shield, Clock, Target, Hospital, ChevronDown, ChevronRight, MapPin, BookOpen, ExternalLink, Zap, Lightbulb, ArrowDown, CheckCircle, XCircle, AlertCircle, FileText, TrendingUp, Calendar, UserCheck } from 'lucide-react';
import { Link } from 'wouter';
import { useState } from 'react';
import ParallaxBackground from '../components/ParallaxBackground';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AboutAmyloidosis() {
  const { t } = useLanguage();
  const [expandedType, setExpandedType] = useState<string | null>(null);

  const toggleType = (type: string) => {
    setExpandedType(expandedType === type ? null : type);
  };

  const warningSignsData = [
    {
      category: t('aboutAmyloidosis.cardiacSymptoms'),
      icon: Heart,
      color: 'bg-red-500/20 border-red-500/30 text-red-400',
      signs: ['Shortness of breath', 'Chest pain', 'Irregular heartbeat', 'Swelling in legs/ankles', 'Fatigue during normal activities']
    },
    {
      category: t('aboutAmyloidosis.neurologicalSymptoms'),
      icon: Brain,
      color: 'bg-gradient-to-r from-[#00AFE6] to-[#00DD89]/20 border-blue-500/30 text-blue-400',
      signs: ['Numbness in hands/feet', 'Tingling sensations', 'Muscle weakness', 'Carpal tunnel syndrome', 'Balance problems']
    },
    {
      category: t('aboutAmyloidosis.gastrointestinalSymptoms'),
      icon: Activity,
      color: 'bg-gradient-to-r from-[#00DD89] to-[#00AFE6]/20 border-green-500/30 text-green-400',
      signs: ['Persistent diarrhea', 'Nausea and vomiting', 'Abdominal pain', 'Loss of appetite', 'Malabsorption symptoms']
    },
    {
      category: t('aboutAmyloidosis.genitourinarySymptoms'),
      icon: Droplets,
      color: 'bg-[#00AFE6]/20 border-[#00AFE6]/30 text-[#00AFE6]',
      signs: ['Proteinuria (protein in urine)', 'Decreased urine output', 'Kidney dysfunction', 'Urinary retention', 'Bladder problems']
    },
    {
      category: t('aboutAmyloidosis.systemicSymptoms'),
      icon: Microscope,
      color: 'bg-[#00DD89]/20 border-[#00DD89]/30 text-[#00DD89]',
      signs: ['Unexplained weight loss', 'Enlarged tongue', 'Easy bruising', 'Changes in skin texture', 'Chronic fatigue']
    }
  ];

  const amyloidosisTypes = [
    {
      id: 'al',
      type: 'AL (Light-Chain) Amyloidosis',
      subtitle: 'Caused by abnormal plasma cells producing light chains',
      icon: Heart,
      color: 'from-[#00AFE6] to-[#00DD89]',
      borderColor: 'border-[#00AFE6]/30',
      prevalence: 'Often diagnosed after age 50; affects both men and women',
      urgency: 'Related to multiple myeloma (10-15% overlap)',
      symptoms: ['Leg swelling', 'Fatigue', 'Irregular heartbeat', 'Enlarged tongue', 'Skin changes (bruising, purple patches around eyes)'],
      diagnosis: ['Tissue biopsy', 'Blood/urine tests for light chains', 'Bone marrow biopsy', 'Imaging tests (ECG, MRI, echocardiogram)'],
      treatment: ['Chemotherapy', 'Steroids', 'Proteasome inhibitors', 'Monoclonal antibodies', 'Stem cell transplant (in select cases)', 'Supportive care to manage symptoms and organ function'],
      warningSign: 'Target abnormal plasma cells with various therapies'
    },
    {
      id: 'attr',
      type: 'ATTR (Transthyretin) Amyloidosis',
      subtitle: 'Two forms: Hereditary (hATTR) and Wild-type (ATTRwt)',
      icon: Brain,
      color: 'from-[#00AFE6] to-[#00DD89]',
      borderColor: 'border-[#00AFE6]/30',
      prevalence: 'hATTR: Over 120 TTR mutations known',
      urgency: 'ATTRwt: Non-inherited, develops with age, primarily affects men over 60',
      symptoms: ['Heart issues: palpitations, fainting, fatigue', 'Nerve issues: numbness, walking difficulty', 'GI symptoms: nausea, weight loss'],
      diagnosis: ['Genetic testing for TTR mutations', 'Biopsies, imaging (MRI, scans)', 'Protein testing'],
      treatment: ['TTR stabilizers: Tafamidis (Vyndaqel), Acoramidis (Attruby)', 'Gene silencers: Patisiran (Onpattro), Vutrisiran (Amvuttra)', 'Supportive care for symptoms and organ protection'],
      warningSign: 'Wild-type often causes heart failure and carpal tunnel syndrome'
    },
    {
      id: 'other',
      type: 'Rare Types of Amyloidosis',
      subtitle: 'AA, ALECT2, Aβ2M, and other rare forms',
      icon: Microscope,
      color: 'from-[#00DD89] to-[#00AFE6]',
      borderColor: 'border-[#00DD89]/30',
      prevalence: 'Variable prevalence by geographic and ethnic background',
      urgency: 'Different underlying causes and affected organs',
      symptoms: ['AA: Linked to long-standing inflammation, mostly affects kidneys', 'ALECT2: More common in Mexican, Punjabi, Native American, Middle Eastern descent', 'Aβ2M: Seen in long-term dialysis patients, affects bones and joints'],
      diagnosis: ['Biopsies, blood and urine analysis', 'Imaging: ECG, MRI, echocardiograms', 'Genetic testing for hereditary types', 'Specialized testing: mass spectrometry, immunohistochemistry'],
      treatment: ['AA: Treat underlying disease to reduce SAA protein', 'ALECT2: Often underdiagnosed, mainly affects kidneys', 'Aβ2M: Becoming rarer due to improved dialysis techniques', 'Supportive care and research ongoing for most types'],
      warningSign: 'Early diagnosis is critical for better outcomes'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Medical Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-gray-400 rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border-2 border-gray-400 rounded-full"></div>
          <div className="absolute bottom-32 left-32 w-28 h-28 border-2 border-gray-400 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-20 h-20 border-2 border-gray-400 rounded-full"></div>
        </div>
        
        {/* Floating Medical Elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-16 h-16 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full opacity-20"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/3 w-12 h-12 bg-gradient-to-r from-[#00DD89] to-[#00AFE6] rounded-full opacity-20"
          animate={{
            y: [0, 15, 0],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/3 w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full opacity-20"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 90, 180],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500/10 to-orange-500/10 backdrop-blur-xl rounded-full px-5 py-3 border border-red-500/20 mb-8">
                <UserCheck className="w-5 h-5 text-red-500" />
                <span className="text-sm font-semibold text-red-700 dark:text-red-400 tracking-wide">{t('aboutAmyloidosis.hero.badge')}</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold font-rosarivo mb-8 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                  {t('aboutAmyloidosis.hero.title.understanding')}
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                  {t('aboutAmyloidosis.hero.title.amyloidosis')}
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed mb-8">
                Amyloidosis refers to a group of rare diseases caused by abnormal protein deposits (called amyloid) building up in organs and tissues. These misfolded proteins disrupt normal body functions, leading to serious health complications.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="#clinical-red-flags" className="group bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-[#00AFE6]/25 transition-all duration-300 flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5" />
                  Clinical Red Flags
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/directory" className="bg-gray-900/10 dark:bg-white/10 backdrop-blur-xl text-gray-900 dark:text-white px-8 py-4 rounded-xl font-semibold border border-gray-900/20 dark:border-white/20 hover:bg-gray-900/20 dark:hover:bg-white/20 transition-all duration-300 flex items-center gap-3">
                  <MapPin className="w-5 h-5" />
                  Find Specialists
                </Link>
              </div>
              
              <div className="bg-red-50/80 dark:bg-red-900/20 backdrop-blur-xl rounded-xl p-6 border border-red-200/50 dark:border-red-400/30">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">Professional Use Only</h3>
                    <p className="text-red-800 dark:text-red-300 text-sm leading-relaxed">
                      This content is intended for healthcare professionals and should not be used for self-diagnosis or as a substitute for professional medical advice, diagnosis, or treatment.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Right Column - Medical Visual */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative bg-gradient-to-br from-white/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 dark:border-gray-400/30">
                {/* Medical Diagram */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Amyloidosis at a Glance</h3>
                  
                  <div className="grid grid-cols-2 gap-6">
                    {/* AL Amyloidosis */}
                    <div className="bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/30 dark:to-[#00DD89]/30 rounded-2xl p-6 border border-[#00AFE6]/50 dark:border-[#00AFE6]/30">
                      <Heart className="w-8 h-8 text-[#00AFE6] mx-auto mb-4" />
                      <h4 className="font-bold text-[#00AFE6] dark:text-[#00AFE6] mb-2">AL Amyloidosis</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">70% of cases</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Plasma cell disorder</p>
                    </div>
                    
                    {/* ATTR Amyloidosis */}
                    <div className="bg-gradient-to-br from-[#00DD89]/15 to-[#00AFE6]/15 dark:from-[#00DD89]/30 dark:to-[#00AFE6]/30 rounded-2xl p-6 border border-[#00DD89]/50 dark:border-[#00DD89]/30">
                      <Brain className="w-8 h-8 text-[#00DD89] mx-auto mb-4" />
                      <h4 className="font-bold text-[#00DD89] dark:text-[#00DD89] mb-2">ATTR Amyloidosis</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">25% of cases</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Transthyretin protein</p>
                    </div>
                  </div>
                </div>
                
                {/* Key Statistics */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200/50 dark:border-gray-400/30">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#00AFE6] mb-1">6-24</div>
                    <div className="text-xs text-gray-600 dark:text-white/60">months survival (untreated AL)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#00DD89] mb-1">25+</div>
                    <div className="text-xs text-gray-600 dark:text-white/60">treatment centers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#00AFE6] mb-1">1:100K</div>
                    <div className="text-xs text-gray-600 dark:text-white/60">prevalence</div>
                  </div>
                </div>
              </div>
              
              {/* Floating Medical Icons */}
              <motion.div
                className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full flex items-center justify-center shadow-xl"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Microscope className="w-8 h-8 text-white" />
              </motion.div>
              
              <motion.div
                className="absolute -bottom-6 -left-6 w-14 h-14 bg-gradient-to-r from-[#00DD89] to-[#00AFE6] rounded-full flex items-center justify-center shadow-xl"
                animate={{
                  y: [0, 8, 0],
                  rotate: [0, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Stethoscope className="w-7 h-7 text-white" />
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-8 h-12 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 dark:bg-gray-600 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>
      
      {/* Simplified Pathophysiology Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 relative">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="crawford-section-title mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                What Is
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Amyloidosis?
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed max-w-3xl mx-auto mb-12">
              What is Amyloid? Amyloid forms when proteins in the body misfold, clump together, and deposit in different organs. As amyloid builds up, it can lead to organ damage and reduced quality of life.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Simple Explanation */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 backdrop-blur-xl rounded-2xl p-8 border border-[#00AFE6]/20 dark:border-[#00AFE6]/30">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#00AFE6] dark:text-[#00AFE6]">Normal Proteins</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                  Think of proteins like tiny workers in your body. Normally, they have specific shapes that help them do their jobs—like carrying oxygen, fighting infections, or helping your heart pump blood.
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 backdrop-blur-xl rounded-2xl p-8 border border-[#00AFE6]/20 dark:border-[#00AFE6]/30">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#00DD89] to-[#00AFE6] rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#00DD89] dark:text-[#00DD89]">Misfolded Proteins</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                  In amyloidosis, these protein workers get "misfolded"—like origami that's been folded wrong. When this happens, they can't do their jobs properly and start clumping together instead.
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 backdrop-blur-xl rounded-2xl p-8 border border-[#00AFE6]/20 dark:border-[#00AFE6]/30">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#00AFE6] dark:text-[#00AFE6]">Amyloid Deposits</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                  These clumps, called "amyloid deposits," build up in organs like your heart, kidneys, or nerves. This buildup interferes with how these organs work, causing the symptoms of amyloidosis.
                </p>
              </div>
            </motion.div>

            {/* Visual Representation */}
            <motion.div
              className="bg-gradient-to-br from-gray-50/95 to-white/95 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50 dark:border-gray-400/30"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center">Simple Visual Process</h3>
              
              <div className="space-y-8">
                {/* Step 1 */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Healthy Proteins</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Proteins maintain their proper shape and function normally</p>
                  </div>
                </div>
                
                {/* Arrow */}
                <div className="flex justify-center">
                  <ArrowDown className="w-6 h-6 text-gray-400" />
                </div>
                
                {/* Step 2 */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#00DD89] to-[#00AFE6] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Protein Misfolding</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Proteins lose their proper shape and can't work correctly</p>
                  </div>
                </div>
                
                {/* Arrow */}
                <div className="flex justify-center">
                  <ArrowDown className="w-6 h-6 text-gray-400" />
                </div>
                
                {/* Step 3 */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Amyloid Buildup</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Misfolded proteins clump together in organs, causing problems</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 rounded-xl border border-[#00AFE6]/20">
                <div className="flex items-center gap-3 mb-3">
                  <Lightbulb className="w-5 h-5 text-[#00AFE6]" />
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100">Key Takeaway</h4>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  Amyloidosis isn't a single disease—it's a group of conditions caused by different proteins folding incorrectly. The type depends on which protein is misfolding and where it accumulates in your body.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* General Symptoms Section */}
      <section className="py-24 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="crawford-section-title mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                General
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Symptoms
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed max-w-3xl mx-auto mb-12">
              Symptoms vary based on the type of amyloidosis and which organs are affected. Symptoms can often resemble other conditions, leading to delayed diagnosis.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              className="grid md:grid-cols-2 gap-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {[
                { icon: Heart, symptom: "Fatigue", description: "Persistent tiredness and lack of energy" },
                { icon: TrendingUp, symptom: "Weight loss", description: "Unexplained loss of body weight" },
                { icon: Droplets, symptom: "Swelling in legs/ankles", description: "Fluid retention causing visible swelling" },
                { icon: Brain, symptom: "Shortness of breath", description: "Difficulty breathing during normal activities" },
                { icon: Activity, symptom: "Numbness or tingling in hands/feet", description: "Loss of sensation or pins and needles feeling" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/25 dark:to-[#00DD89]/25 backdrop-blur-xl rounded-2xl p-6 border border-[#00AFE6]/30"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#00AFE6] dark:text-[#00AFE6] mb-2">{item.symptom}</h3>
                      <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Amyloidosis Types - Collapsible Sections */}
      <section className="py-24 bg-white dark:bg-gray-900 relative">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="crawford-section-title mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                Types of
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Amyloidosis
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed max-w-3xl mx-auto">
              Each type is named with "A" followed by the protein responsible. For example: AL Amyloidosis (from light chain proteins), ATTR Amyloidosis (from transthyretin protein), AA, ALECT2, Aβ2M, and other rare forms.
            </p>
          </motion.div>

          <div className="space-y-6">
            {amyloidosisTypes.map((type, index) => (
              <motion.div
                id={`${type.id}-amyloidosis`}
                key={type.id}
                className={`backdrop-blur-xl rounded-2xl border ${type.borderColor} overflow-hidden ${
                  index === 0 
                    ? 'bg-gradient-to-br from-red-50/95 to-pink-50/95 dark:from-red-900/25 dark:to-pink-900/25 border-red-400/30'
                    : index === 1
                    ? 'bg-gradient-to-br from-blue-50/95 to-cyan-50/95 dark:from-blue-900/25 dark:to-cyan-900/25 border-blue-400/30'
                    : 'bg-gradient-to-br from-purple-50/95 to-violet-50/95 dark:from-purple-900/25 dark:to-violet-900/25 border-purple-400/30'
                } bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/25 dark:to-[#00DD89]/25 border-[#00AFE6]/30`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Header - Always Visible */}
                <div
                  className="p-6 cursor-pointer hover:bg-gray-900/5 dark:hover:bg-white/5 transition-colors duration-300"
                  onClick={() => toggleType(type.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 bg-gradient-to-r ${type.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <type.icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className={`text-xl font-bold mb-1 ${
                          index === 0 
                            ? 'text-red-800 dark:text-red-100'
                            : index === 1
                            ? 'text-blue-800 dark:text-blue-100'
                            : 'text-purple-800 dark:text-purple-100'
                        }`}>{type.type}</h3>
                        <p className={`text-sm ${
                          index === 0 
                            ? 'text-red-600 dark:text-red-300'
                            : index === 1
                            ? 'text-blue-600 dark:text-blue-300'
                            : 'text-purple-600 dark:text-purple-300'
                        }`}>{type.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-gray-500 dark:text-white/50 text-xs uppercase tracking-wide">Prevalence</p>
                        <p className="text-gray-800 dark:text-white font-medium text-sm">{type.prevalence}</p>
                      </div>
                      {expandedType === type.id ? (
                        <ChevronDown className="w-6 h-6 text-gray-600 dark:text-white/60" />
                      ) : (
                        <ChevronRight className="w-6 h-6 text-gray-600 dark:text-white/60" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expandable Content */}
                <motion.div
                  className={`overflow-hidden ${expandedType === type.id ? 'border-t border-gray-200/40 dark:border-white/10' : ''}`}
                  initial={false}
                  animate={{ 
                    height: expandedType === type.id ? 'auto' : 0,
                    opacity: expandedType === type.id ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-6 space-y-8">
                    {/* Urgency Badge */}
                    <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${type.color}/20 rounded-full px-4 py-2 border ${type.borderColor}`}>
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium text-gray-700 dark:text-white">{type.urgency}</span>
                    </div>

                    {/* Warning Sign Callout */}
                    <div className="bg-[#00AFE6]/10 dark:bg-[#00AFE6]/20 border border-[#00AFE6]/30 dark:border-[#00AFE6]/30 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-[#00AFE6] dark:text-[#00AFE6] mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-[#00AFE6] dark:text-[#00AFE6] font-semibold mb-2">Key Warning Sign</h4>
                          <p className="text-gray-700 dark:text-white/80 text-sm">{type.warningSign}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                      {/* Symptoms */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <Stethoscope className="w-5 h-5 text-[#00AFE6]" />
                          Symptoms
                        </h4>
                        <ul className="space-y-2 mb-4">
                          {type.symptoms.map((symptom, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-[#00AFE6] rounded-full mt-2 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-white/80 text-sm">{symptom}</span>
                            </li>
                          ))}
                        </ul>
                        <Link href="/resources?category=symptoms" className="text-[#00AFE6] hover:text-[#00DD89] text-sm flex items-center gap-1 transition-colors">
                          <BookOpen className="w-3 h-3" />
                          Symptom Resources
                        </Link>
                      </div>

                      {/* Diagnosis */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <Search className="w-5 h-5 text-[#00DD89]" />
                          Diagnosis
                        </h4>
                        <ul className="space-y-2 mb-4">
                          {type.diagnosis.map((test, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-[#00DD89] rounded-full mt-2 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-white/80 text-sm">{test}</span>
                            </li>
                          ))}
                        </ul>
                        <Link href="/directory" className="text-[#00DD89] hover:text-[#00AFE6] text-sm flex items-center gap-1 transition-colors">
                          <MapPin className="w-3 h-3" />
                          Find Testing Centers
                        </Link>
                      </div>

                      {/* Treatment */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <Target className="w-5 h-5 text-[#00AFE6]" />
                          Treatment
                        </h4>
                        <ul className="space-y-2 mb-4">
                          {type.treatment.map((treatment, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-[#00AFE6] rounded-full mt-2 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-white/80 text-sm">{treatment}</span>
                            </li>
                          ))}
                        </ul>
                        <Link href="/resources?category=treatment" className="text-[#00AFE6] hover:text-[#00DD89] text-sm flex items-center gap-1 transition-colors">
                          <Target className="w-3 h-3" />
                          Treatment Guides
                        </Link>
                      </div>
                    </div>

                    {/* Learn More Button for Detail Pages */}
                    <div className="pt-8 border-t border-gray-200/40 dark:border-white/10 text-center">
                      <Link 
                        href={
                          type.id === 'al' ? '/amyloidosis-types/al-light-chain-amyloidosis' :
                          type.id === 'attr' ? '/amyloidosis-types/attr-transthyretin-amyloidosis' :
                          '/amyloidosis-types/other-amyloidosis-types'
                        }
                        className={`inline-flex items-center gap-2 bg-gradient-to-r ${type.color} text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 group`}
                      >
                        Learn More About {type.type.split(' ')[0]}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Clinical Red Flags Checklist */}
      <section id="clinical-red-flags" className="py-24 bg-gray-50 dark:bg-gray-900 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-[#00AFE6]/10 backdrop-blur-xl rounded-full px-4 py-2 border border-[#00AFE6]/20 mb-6">
              <AlertTriangle className="w-4 h-4 text-[#00AFE6]" />
              <span className="text-sm font-medium text-[#00AFE6] dark:text-[#00AFE6]">{t('aboutAmyloidosis.warningSignsTitle')}</span>
            </div>
            
            <h2 className="crawford-section-title mb-6">
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                {t('aboutAmyloidosis.warningSignsSubtitle')}
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed max-w-3xl mx-auto mb-8">
              {t('aboutAmyloidosis.warningSignsSubtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* High-Risk Presentations */}
            <motion.div
              className="bg-gradient-to-br from-[#00AFE6]/10 to-[#00DD89]/10 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 backdrop-blur-xl rounded-2xl p-8 border border-[#00AFE6]/30 dark:border-[#00AFE6]/40"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#00AFE6] dark:text-[#00AFE6]">High-Risk Presentations</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">Immediate amyloidosis evaluation recommended</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  'Heart failure with preserved ejection fraction + proteinuria',
                  'Bilateral carpal tunnel syndrome in patients &gt;50 years',
                  'Unexplained cardiomyopathy with low-voltage ECG',
                  'Nephrotic syndrome with cardiac symptoms',
                  'Peripheral neuropathy + autonomic dysfunction',
                  'Enlarged tongue (macroglossia) with systemic symptoms',
                  'Easy bruising + periorbital purpura',
                  'Family history of polyneuropathy or cardiomyopathy',
                  'Chronic inflammatory disease with proteinuria',
                  'Restrictive cardiomyopathy with granular sparkling on echo'
                ].map((flag, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-[#00AFE6] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">{flag}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Supporting Clinical Features */}
            <motion.div
              className="bg-gradient-to-br from-[#00DD89]/10 to-[#00AFE6]/10 dark:from-[#00DD89]/20 dark:to-[#00AFE6]/20 backdrop-blur-xl rounded-2xl p-8 border border-[#00DD89]/30 dark:border-[#00DD89]/40"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-[#00DD89] to-[#00AFE6] rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#00DD89] dark:text-[#00DD89]">Supporting Features</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">Consider amyloidosis in differential diagnosis</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  'Unexplained weight loss &gt;10% in 6 months',
                  'Chronic diarrhea with malabsorption',
                  'Orthostatic hypotension without clear cause',
                  'Hoarse voice with systemic symptoms',
                  'Shoulder pad sign (amyloid shoulder arthropathy)',
                  'Chronic fatigue with multi-organ involvement',
                  'Recurrent soft tissue bleeding',
                  'Hepatomegaly with cardiac or renal symptoms',
                  'Delayed gastric emptying + neuropathy',
                  'Skin thickening (scleroderma-like) with cardiac symptoms'
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[#00DD89] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Clinical Pearls */}
          <motion.div
            className="mt-12 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 backdrop-blur-xl rounded-2xl p-8 border border-[#00AFE6]/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Clinical Pearls</h3>
                <p className="text-gray-600 dark:text-white/70 text-sm">Key diagnostic considerations</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#00AFE6] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-white/80 text-sm">
                    <strong>Think amyloidosis</strong> when multiple organ systems are affected simultaneously
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#00DD89] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-white/80 text-sm">
                    <strong>Age matters:</strong> ATTR more common &gt;60 years, AL can occur at any age
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#00AFE6] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-white/80 text-sm">
                    <strong>Gender patterns:</strong> Wild-type ATTR predominantly affects elderly men
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#00DD89] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-white/80 text-sm">
                    <strong>Early referral</strong> to specialist centers improves outcomes significantly
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 backdrop-blur-xl rounded-full px-4 py-2 border border-[#00AFE6]/20 mb-6">
              <FileText className="w-4 h-4 text-[#00AFE6]" />
              <span className="text-sm font-medium text-gray-700 dark:text-white/90">Clinical Comparison</span>
            </div>
            
            <h2 className="crawford-section-title mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                AL vs ATTR vs Wild Type
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed max-w-3xl mx-auto">
              Clinical features comparison for differential diagnosis
            </p>
          </motion.div>

          <motion.div
            className="overflow-x-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="min-w-full bg-gradient-to-br from-gray-50/95 to-white/95 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-400/30 overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">Clinical Feature</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#00AFE6] dark:text-[#00AFE6]">AL Amyloidosis</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#00DD89] dark:text-[#00DD89]">ATTR Hereditary</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#00AFE6] dark:text-[#00AFE6]">ATTR Wild Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {[
                    {
                      feature: 'Age of Onset',
                      al: '40-70 years (peak 60s)',
                      hattr: '20-70 years (variable)',
                      wtattr: '&gt;60 years (usually &gt;70)'
                    },
                    {
                      feature: 'Gender',
                      al: 'M:F = 2:1',
                      hattr: 'Equal M:F',
                      wtattr: 'Predominantly male (95%)'
                    },
                    {
                      feature: 'Inheritance',
                      al: 'Acquired (plasma cell)',
                      hattr: 'Autosomal dominant',
                      wtattr: 'Age-related (sporadic)'
                    },
                    {
                      feature: 'Cardiac Involvement',
                      al: 'HF, low voltage ECG, LV wall thickness',
                      hattr: 'Conduction defects, arrhythmias',
                      wtattr: 'HF, conduction defects, AFib'
                    },
                    {
                      feature: 'Neurological',
                      al: 'Peripheral neuropathy (15%)',
                      hattr: 'Prominent sensorimotor neuropathy',
                      wtattr: 'Carpal tunnel syndrome'
                    },
                    {
                      feature: 'Renal Involvement',
                      al: 'Proteinuria, nephrotic syndrome',
                      hattr: 'Rare renal involvement',
                      wtattr: 'Minimal renal involvement'
                    },
                    {
                      feature: 'GI Symptoms',
                      al: 'Diarrhea, malabsorption',
                      hattr: 'Gastroparesis, diarrhea',
                      wtattr: 'Rare GI involvement'
                    },
                    {
                      feature: 'Red Flag Signs',
                      al: 'Macroglossia, periorbital purpura',
                      hattr: 'Family history, early neuropathy',
                      wtattr: 'Elderly male, bilateral CTS'
                    },
                    {
                      feature: 'Key Diagnostic Test',
                      al: 'Serum/urine free light chains',
                      hattr: 'Genetic testing (TTR gene)',
                      wtattr: 'DPD/PYP scintigraphy'
                    },
                    {
                      feature: 'Treatment',
                      al: 'Chemotherapy, ASCT',
                      hattr: 'Tafamidis, gene therapy',
                      wtattr: 'Tafamidis, supportive care'
                    },
                    {
                      feature: 'Prognosis (untreated)',
                      al: '6-24 months if advanced',
                      hattr: '5-15 years (variable)',
                      wtattr: '2-6 years from diagnosis'
                    }
                  ].map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{row.feature}</td>
                      <td className="px-6 py-4 text-sm text-red-700 dark:text-red-300">{row.al}</td>
                      <td className="px-6 py-4 text-sm text-blue-700 dark:text-blue-300">{row.hattr}</td>
                      <td className="px-6 py-4 text-sm text-green-700 dark:text-green-300">{row.wtattr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stepwise Diagnostic Pathway */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 backdrop-blur-xl rounded-full px-4 py-2 border border-[#00AFE6]/20 mb-6">
              <TrendingUp className="w-4 h-4 text-[#00AFE6]" />
              <span className="text-sm font-medium text-gray-700 dark:text-white/90">Diagnostic Pathway</span>
            </div>
            
            <h2 className="crawford-section-title mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                Stepwise Diagnostic Approach
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed max-w-3xl mx-auto">
              Evidence-based diagnostic pathway for suspected amyloidosis
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {[
              {
                step: '1',
                title: 'Clinical Suspicion',
                description: 'Evaluate red flags and clinical presentation',
                actions: [
                  'Multi-organ involvement assessment',
                  'Family history inquiry',
                  'Age and gender considerations',
                  'Characteristic symptom complex'
                ],
                color: 'from-red-500 to-orange-500',
                bgColor: 'from-red-50/95 to-orange-50/95 dark:from-red-900/25 dark:to-orange-900/25',
                borderColor: 'border-red-200/50 dark:border-red-400/30'
              },
              {
                step: '2',
                title: 'Initial Laboratory Tests',
                description: 'Screen for amyloidogenic proteins',
                actions: [
                  'Serum and urine free light chains',
                  'Serum protein electrophoresis (SPEP)',
                  'Immunofixation electrophoresis',
                  'Complete blood count, chemistry panel'
                ],
                color: 'from-blue-500 to-cyan-500',
                bgColor: 'from-blue-50/95 to-cyan-50/95 dark:from-blue-900/25 dark:to-cyan-900/25',
                borderColor: 'border-blue-200/50 dark:border-blue-400/30'
              },
              {
                step: '3',
                title: 'Cardiac Assessment',
                description: 'Evaluate cardiac involvement',
                actions: [
                  'Echocardiography (wall thickness, strain)',
                  'ECG (low voltage, conduction defects)',
                  'Cardiac biomarkers (NT-proBNP, troponin)',
                  'Consider cardiac MRI if available'
                ],
                color: 'from-green-500 to-emerald-500',
                bgColor: 'from-green-50/95 to-emerald-50/95 dark:from-green-900/25 dark:to-emerald-900/25',
                borderColor: 'border-green-200/50 dark:border-green-400/30'
              },
              {
                step: '4',
                title: 'Tissue Diagnosis',
                description: 'Confirm amyloid deposits',
                actions: [
                  'Abdominal fat pad biopsy (first-line)',
                  'Congo red staining with polarized light',
                  'Organ biopsy if fat pad negative',
                  'Mass spectrometry for typing'
                ],
                color: 'from-purple-500 to-violet-500',
                bgColor: 'from-purple-50/95 to-violet-50/95 dark:from-purple-900/25 dark:to-violet-900/25',
                borderColor: 'border-purple-200/50 dark:border-purple-400/30'
              },
              {
                step: '5',
                title: 'Subtype Classification',
                description: 'Determine amyloid type for treatment',
                actions: [
                  'If AL: Hematology referral, bone marrow biopsy',
                  'If ATTR: Genetic testing for hATTR',
                  'DPD/PYP scintigraphy for ATTR',
                  'Specialist center consultation'
                ],
                color: 'from-orange-500 to-amber-500',
                bgColor: 'from-orange-50/95 to-amber-50/95 dark:from-orange-900/25 dark:to-amber-900/25',
                borderColor: 'border-orange-200/50 dark:border-orange-400/30'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className={`mb-8 bg-gradient-to-br ${step.bgColor} backdrop-blur-xl rounded-2xl p-8 border ${step.borderColor} relative`}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold text-xl">{step.step}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                    <p className="text-gray-600 dark:text-white/70 mb-6">{step.description}</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      {step.actions.map((action, actionIndex) => (
                        <div key={actionIndex} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-white/80">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {index < 4 && (
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 bg-white dark:bg-gray-900 rounded-full border-4 border-gray-200 dark:border-gray-600 flex items-center justify-center">
                      <ArrowDown className="w-4 h-4 text-gray-600 dark:text-white/60" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Clinical Guidelines Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 backdrop-blur-xl rounded-full px-4 py-2 border border-[#00AFE6]/20 mb-6">
              <BookOpen className="w-4 h-4 text-[#00AFE6]" />
              <span className="text-sm font-medium text-gray-700 dark:text-white/90">Clinical Guidelines</span>
            </div>
            
            <h2 className="crawford-section-title mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                Evidence-Based Guidelines
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed max-w-3xl mx-auto">
              Access authoritative clinical guidelines from leading organizations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Canadian Cardiovascular Society',
                description: 'Canadian guidelines for cardiac amyloidosis diagnosis and management',
                url: 'https://www.ccs.ca',
                icon: Heart,
                color: 'from-red-500 to-pink-500',
                bgColor: 'from-red-50/95 to-pink-50/95 dark:from-red-900/25 dark:to-pink-900/25',
                borderColor: 'border-red-200/50 dark:border-red-400/30'
              },
              {
                title: 'Mayo Clinic Guidelines',
                description: 'Comprehensive amyloidosis diagnostic and treatment protocols',
                url: 'https://www.mayoclinic.org',
                icon: Microscope,
                color: 'from-blue-500 to-cyan-500',
                bgColor: 'from-blue-50/95 to-cyan-50/95 dark:from-blue-900/25 dark:to-cyan-900/25',
                borderColor: 'border-blue-200/50 dark:border-blue-400/30'
              },
              {
                title: 'NHS Clinical Guidelines',
                description: 'UK National Health Service amyloidosis management guidelines',
                url: 'https://www.nhs.uk',
                icon: FileText,
                color: 'from-green-500 to-emerald-500',
                bgColor: 'from-green-50/95 to-emerald-50/95 dark:from-green-900/25 dark:to-emerald-900/25',
                borderColor: 'border-green-200/50 dark:border-green-400/30'
              }
            ].map((guideline, index) => (
              <motion.div
                key={index}
                className={`bg-gradient-to-br ${guideline.bgColor} backdrop-blur-xl rounded-2xl p-8 border ${guideline.borderColor} hover:scale-105 transition-all duration-300 group`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${guideline.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-6`}>
                  <guideline.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{guideline.title}</h3>
                <p className="text-gray-600 dark:text-white/70 leading-relaxed mb-6">{guideline.description}</p>
                
                <a
                  href={guideline.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 bg-gradient-to-r ${guideline.color} text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300`}
                >
                  <span>Access Guidelines</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white dark:bg-gray-900 relative border-t border-gray-200 dark:border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
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
                Take Action
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Today
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed max-w-3xl mx-auto mb-12">
              Early detection and proper care can make a significant difference. Connect with specialists and access resources to support your journey.
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <motion.div
                className="bg-gradient-to-br from-blue-50/95 to-indigo-50/95 dark:from-blue-900/25 dark:to-indigo-900/25 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/50 dark:border-blue-400/30"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <MapPin className="w-12 h-12 text-[#00AFE6] mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-100 mb-4">Find Expert Care</h3>
                <p className="text-blue-600 dark:text-blue-300 mb-6">
                  Connect with amyloidosis specialists and treatment centers across Canada.
                </p>
                <Link href="/directory" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                  Find a Clinic
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-emerald-50/95 to-green-50/95 dark:from-emerald-900/25 dark:to-green-900/25 backdrop-blur-xl rounded-2xl p-8 border border-emerald-200/50 dark:border-emerald-400/30"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <BookOpen className="w-12 h-12 text-[#00DD89] mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-emerald-800 dark:text-emerald-100 mb-4">Access Resources</h3>
                <p className="text-emerald-600 dark:text-emerald-300 mb-6">
                  Explore educational materials, treatment guides, and support resources.
                </p>
                <Link href="/resources" className="inline-flex items-center gap-2 bg-gray-900/10 dark:bg-white/10 border border-gray-900/20 dark:border-white/20 text-gray-900 dark:text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-900/20 dark:hover:bg-white/20 transition-all duration-300">
                  View Resources
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Related Resources & Detailed Links Section */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-white/10">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold font-rosarivo text-gray-900 dark:text-white mb-4">
              Explore More <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">Resources</span>
            </h2>
            <p className="text-gray-600 dark:text-white/70 max-w-2xl mx-auto">
              Access comprehensive information, find specialists, and connect with support networks across Canada.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Diagnostic Information */}
            <motion.div
              className="bg-gradient-to-br from-blue-50/95 to-cyan-50/95 dark:from-blue-900/25 dark:to-cyan-900/25 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 dark:border-blue-400/30"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-blue-800 dark:text-blue-100">Diagnostic Resources</h3>
              </div>
              <ul className="space-y-3 mb-6">
                <li>
                  <Link href="/resources?category=diagnostic-tests" className="text-sm text-blue-700 dark:text-white/80 hover:text-[#00AFE6] flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-[#00AFE6] rounded-full" />
                    Diagnostic Test Information
                  </Link>
                </li>
                <li>
                  <Link href="/resources?category=biopsy-guides" className="text-sm text-blue-700 dark:text-white/80 hover:text-[#00AFE6] flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-[#00AFE6] rounded-full" />
                    Biopsy Preparation Guides
                  </Link>
                </li>
                <li>
                  <Link href="/resources?category=lab-results" className="text-sm text-blue-700 dark:text-white/80 hover:text-[#00AFE6] flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-[#00AFE6] rounded-full" />
                    Understanding Lab Results
                  </Link>
                </li>
              </ul>
              <Link href="/directory?specialty=diagnostic" className="inline-flex items-center gap-2 text-[#00AFE6] hover:text-blue-600 dark:hover:text-white transition-colors text-sm font-medium">
                <MapPin className="w-4 h-4" />
                Find Diagnostic Centers
              </Link>
            </motion.div>

            {/* Treatment Information */}
            <motion.div
              className="bg-gradient-to-br from-emerald-50/95 to-green-50/95 dark:from-emerald-900/25 dark:to-green-900/25 backdrop-blur-xl rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-400/30"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-100">Treatment Options</h3>
              </div>
              <ul className="space-y-3 mb-6">
                <li>
                  <Link href="/resources?category=chemotherapy" className="text-sm text-emerald-700 dark:text-white/80 hover:text-[#00DD89] flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-[#00DD89] rounded-full" />
                    Chemotherapy Information
                  </Link>
                </li>
                <li>
                  <Link href="/resources?category=stem-cell" className="text-sm text-emerald-700 dark:text-white/80 hover:text-[#00DD89] flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-[#00DD89] rounded-full" />
                    Stem Cell Transplant Guide
                  </Link>
                </li>
                <li>
                  <Link href="/resources?category=clinical-trials" className="text-sm text-emerald-700 dark:text-white/80 hover:text-[#00DD89] flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-[#00DD89] rounded-full" />
                    Clinical Trial Opportunities
                  </Link>
                </li>
              </ul>
              <Link href="/directory?specialty=treatment" className="inline-flex items-center gap-2 text-[#00DD89] hover:text-emerald-600 dark:hover:text-white transition-colors text-sm font-medium">
                <Hospital className="w-4 h-4" />
                Find Treatment Centers
              </Link>
            </motion.div>

            {/* Support & Care */}
            <motion.div
              className="bg-gradient-to-br from-[#00AFE6]/10 to-[#00DD89]/10 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 backdrop-blur-xl rounded-2xl p-6 border border-[#00AFE6]/30 dark:border-[#00AFE6]/40"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#00AFE6] dark:text-[#00AFE6]">Support & Care</h3>
              </div>
              <ul className="space-y-3 mb-6">
                <li>
                  <Link href="/resources?category=patient-support" className="text-sm text-gray-700 dark:text-white/80 hover:text-[#00AFE6] flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-[#00AFE6] rounded-full" />
                    Patient Support Groups
                  </Link>
                </li>
                <li>
                  <Link href="/resources?category=caregiver-guides" className="text-sm text-gray-700 dark:text-white/80 hover:text-[#00AFE6] flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-[#00AFE6] rounded-full" />
                    Caregiver Resources
                  </Link>
                </li>
                <li>
                  <Link href="/resources?category=financial-assistance" className="text-sm text-gray-700 dark:text-white/80 hover:text-[#00AFE6] flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-[#00AFE6] rounded-full" />
                    Financial Assistance
                  </Link>
                </li>
              </ul>
              <Link href="/contact" className="inline-flex items-center gap-2 text-[#00AFE6] hover:text-[#00DD89] dark:hover:text-white transition-colors text-sm font-medium">
                <Users className="w-4 h-4" />
                Get Connected
              </Link>
            </motion.div>

            {/* Research & Education */}
            <motion.div
              className="bg-gradient-to-br from-[#00DD89]/10 to-[#00AFE6]/10 dark:from-[#00DD89]/20 dark:to-[#00AFE6]/20 backdrop-blur-xl rounded-2xl p-6 border border-[#00DD89]/30 dark:border-[#00DD89]/40"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#00DD89] to-[#00AFE6] rounded-xl flex items-center justify-center">
                  <Microscope className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#00DD89] dark:text-[#00DD89]">Research & Education</h3>
              </div>
              <ul className="space-y-3 mb-6">
                <li>
                  <Link href="/resources?category=research-updates" className="text-sm text-gray-700 dark:text-white/80 hover:text-[#00DD89] flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-[#00DD89] rounded-full" />
                    Latest Research Updates
                  </Link>
                </li>
                <li>
                  <Link href="/resources?category=medical-publications" className="text-sm text-gray-700 dark:text-white/80 hover:text-[#00DD89] flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-[#00DD89] rounded-full" />
                    Medical Publications
                  </Link>
                </li>
                <li>
                  <Link href="/resources?category=educational-materials" className="text-sm text-gray-700 dark:text-white/80 hover:text-[#00DD89] flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-[#00DD89] rounded-full" />
                    Educational Materials
                  </Link>
                </li>
              </ul>
              <Link href="/get-involved" className="inline-flex items-center gap-2 text-[#00DD89] hover:text-[#00AFE6] dark:hover:text-white transition-colors text-sm font-medium">
                <Heart className="w-4 h-4" />
                Support Research
              </Link>
            </motion.div>

            {/* Healthcare Professionals */}
            <motion.div
              className="bg-gradient-to-br from-[#00AFE6]/10 to-[#00DD89]/10 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 backdrop-blur-xl rounded-2xl p-6 border border-[#00AFE6]/30 dark:border-[#00AFE6]/40"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#00AFE6] dark:text-[#00AFE6]">For Healthcare Professionals</h3>
              </div>
              <ul className="space-y-3 mb-6">
                <li>
                  <Link href="/resources?category=clinical-guidelines" className="text-sm text-gray-700 dark:text-white/80 hover:text-[#00AFE6] flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-[#00AFE6] rounded-full" />
                    Clinical Guidelines
                  </Link>
                </li>
                <li>
                  <Link href="/resources?category=diagnostic-tools" className="text-sm text-gray-700 dark:text-white/80 hover:text-[#00AFE6] flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-[#00AFE6] rounded-full" />
                    Diagnostic Tools
                  </Link>
                </li>
                <li>
                  <Link href="/resources?category=continuing-education" className="text-sm text-gray-700 dark:text-white/80 hover:text-[#00AFE6] flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-[#00AFE6] rounded-full" />
                    Continuing Education
                  </Link>
                </li>
              </ul>
              <Link href="/resources?audience=healthcare-professionals" className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-600 dark:hover:text-white transition-colors text-sm font-medium">
                <Stethoscope className="w-4 h-4" />
                Professional Resources
              </Link>
            </motion.div>

            {/* Emergency Information */}
            <motion.div
              className="bg-gradient-to-br from-red-50/95 to-pink-50/95 dark:from-red-900/25 dark:to-pink-900/25 backdrop-blur-xl rounded-2xl p-6 border border-red-200/50 dark:border-red-400/30"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-red-800 dark:text-red-100">Emergency Information</h3>
              </div>
              <ul className="space-y-3 mb-6">
                <li>
                  <Link href="/resources?category=emergency-symptoms" className="text-sm text-red-700 dark:text-white/80 hover:text-red-400 flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-red-400 rounded-full" />
                    Emergency Symptoms Guide
                  </Link>
                </li>
                <li>
                  <Link href="/resources?category=when-to-call-doctor" className="text-sm text-red-700 dark:text-white/80 hover:text-red-400 flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-red-400 rounded-full" />
                    When to Call Your Doctor
                  </Link>
                </li>
                <li>
                  <Link href="/resources?category=emergency-contacts" className="text-sm text-red-700 dark:text-white/80 hover:text-red-400 flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-red-400 rounded-full" />
                    Emergency Contact List
                  </Link>
                </li>
              </ul>
              <Link href="/directory?urgent=true" className="inline-flex items-center gap-2 text-red-400 hover:text-red-600 dark:hover:text-white transition-colors text-sm font-medium">
                <Hospital className="w-4 h-4" />
                Find Emergency Care
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Persistent Disclaimer */}
      <div className="bg-gray-200 dark:bg-gray-800 border-t border-gray-300 dark:border-white/10 py-6 sticky bottom-0 z-50">
        <div className="container mx-auto px-6">
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-[#00AFE6] mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-gray-800 dark:text-white/90 text-sm leading-relaxed">
                <strong className="text-[#00AFE6]">Medical Disclaimer:</strong> This information is for educational purposes only and should not replace professional medical advice. 
                Always consult with qualified healthcare providers for diagnosis, treatment recommendations, and medical decisions. 
                Amyloidosis is a complex condition requiring specialized medical expertise.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}