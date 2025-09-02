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
      subtitle: 'Caused by abnormal plasma cells producing light chain fragments of antibodies',
      icon: Heart,
      color: 'from-[#00AFE6] to-[#00DD89]',
      borderColor: 'border-[#00AFE6]/30',
      prevalence: 'Often diagnosed after age 50; affects both men and women',
      urgency: 'Related to multiple myeloma (10-15% overlap)',
      symptoms: ['Leg swelling', 'Fatigue', 'Shortness of breath', 'Enlarged tongue (sometimes)', 'Skin changes (sometimes, i.e., bruising, purple patches around eyes)'],
      diagnosis: ['Bone marrow or other tissue biopsy', 'Blood/urine tests for protein/light chains', 'Imaging tests (MRI, ultrasound, others)'],
      treatment: ['Steroids', 'Proteasome inhibitors', 'Monoclonal antibodies', 'Stem cell transplant (in select cases)', 'Supportive care to manage symptoms and organ function'],
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
      urgency: 'ATTRwt: Non-inherited, develops with age, primarily affects men over 70',
      symptoms: ['Heart issues: shortness of breath, swelling, palpitations, fainting, fatigue', 'Nerve issues: numbness, walking difficulty', 'GI symptoms: nausea, weight loss'],
      diagnosis: ['Genetic testing for TTR mutations', 'Imaging (nuclear scan, MRI, echocardiogram)', 'Biopsies, imaging (MRI, scans)'],
      treatment: ['TTR stabilizers', 'Gene silencers', 'Supportive care for symptoms and organ protection'],
      warningSign: 'Wild-type is more common in Canada and most often causes heart failure and carpal tunnel syndrome'
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
      treatment: ['AA: Treat underlying disease to reduce SAA protein', 'ALECT2: Often under diagnosed, mainly affects kidneys', 'Aβ2M: Becoming rarer due to improved dialysis techniques', 'Supportive care and research ongoing for most types'],
      warningSign: 'Early diagnosis is critical for better outcomes'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
              
              <h1 className="text-[60px] font-bold font-rosarivo mb-6 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                  {t('aboutAmyloidosis.hero.title.understanding')}
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                  {t('aboutAmyloidosis.hero.title.amyloidosis')}
                </span>
              </h1>
              
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-white/80 mb-8 leading-relaxed">
                Learn the signs, understand the types, and take action early.
              </h2>
              
              <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed mb-8">
                Amyloidosis refers to a group of rare diseases caused by abnormal protein deposits (called amyloid) building up in organs and tissues. These misfolded proteins disrupt normal body functions, leading to serious health complications.
              </p>
              

              
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
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Plasma cell disorder</p>
                    </div>
                    
                    {/* ATTR Amyloidosis */}
                    <div className="bg-gradient-to-br from-[#00DD89]/15 to-[#00AFE6]/15 dark:from-[#00DD89]/30 dark:to-[#00AFE6]/30 rounded-2xl p-6 border border-[#00DD89]/50 dark:border-[#00DD89]/30">
                      <Brain className="w-8 h-8 text-[#00DD89] mx-auto mb-4" />
                      <h4 className="font-bold text-[#00DD89] dark:text-[#00DD89] mb-2">ATTR Amyloidosis</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Transthyretin protein</p>
                    </div>
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

          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Cardiac Symptoms */}
              <motion.div
                className="bg-gradient-to-br from-red-50/95 to-pink-50/95 dark:from-red-900/25 dark:to-pink-900/25 backdrop-blur-xl rounded-2xl p-6 border border-red-200/50 dark:border-red-400/30"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-red-700 dark:text-red-300">Cardiac Symptoms</h3>
                </div>
                <div className="space-y-3">
                  {[
                    'Shortness of breath',
                    'Chest pain',
                    'Irregular heartbeat',
                    'Swelling in legs/ankles',
                    'Fatigue during normal activities'
                  ].map((symptom, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-200 text-sm">{symptom}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Neurological Symptoms */}
              <motion.div
                className="bg-gradient-to-br from-blue-50/95 to-indigo-50/95 dark:from-blue-900/25 dark:to-indigo-900/25 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 dark:border-blue-400/30"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300">Neurological Symptoms</h3>
                </div>
                <div className="space-y-3">
                  {[
                    'Numbness in hands/feet',
                    'Tingling sensations',
                    'Muscle weakness',
                    'Carpal tunnel syndrome',
                    'Balance problems'
                  ].map((symptom, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-200 text-sm">{symptom}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Gastrointestinal Symptoms */}
              <motion.div
                className="bg-gradient-to-br from-green-50/95 to-emerald-50/95 dark:from-green-900/25 dark:to-emerald-900/25 backdrop-blur-xl rounded-2xl p-6 border border-green-200/50 dark:border-green-400/30"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-green-700 dark:text-green-300">Gastrointestinal Symptoms</h3>
                </div>
                <div className="space-y-3">
                  {[
                    'Persistent diarrhea',
                    'Nausea and vomiting',
                    'Abdominal pain',
                    'Loss of appetite',
                    'Malabsorption symptoms'
                  ].map((symptom, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-200 text-sm">{symptom}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Renal-urinary Symptoms */}
              <motion.div
                className="bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/25 dark:to-[#00DD89]/25 backdrop-blur-xl rounded-2xl p-6 border border-[#00AFE6]/30"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center">
                    <Droplets className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#00AFE6] dark:text-[#00AFE6]">Renal-urinary Symptoms</h3>
                </div>
                <div className="space-y-3">
                  {[
                    'Proteinuria (protein in urine)',
                    'Decreased urine output',
                    'Kidney dysfunction',
                    'Urinary retention',
                    'Bladder problems'
                  ].map((symptom, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-[#00AFE6] rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-200 text-sm">{symptom}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Systemic Symptoms */}
              <motion.div
                className="bg-gradient-to-br from-purple-50/95 to-violet-50/95 dark:from-purple-900/25 dark:to-violet-900/25 backdrop-blur-xl rounded-2xl p-6 border border-purple-200/50 dark:border-purple-400/30"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300">Systemic Symptoms</h3>
                </div>
                <div className="space-y-3">
                  {[
                    'Unexplained weight loss',
                    'Enlarged tongue',
                    'Easy bruising',
                    'Changes in skin texture',
                    'Chronic fatigue'
                  ].map((symptom, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-200 text-sm">{symptom}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
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
                className="backdrop-blur-xl rounded-2xl border overflow-hidden bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/25 dark:to-[#00DD89]/25 border-[#00AFE6]/30"
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
                        <h3 className="text-xl font-bold mb-1 text-gray-800 dark:text-white">{type.type}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{type.subtitle}</p>
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
      {/* Clinical Red Flags Checklist - Hidden for now */}
      {/* <section id="clinical-red-flags" className="py-24 bg-gray-50 dark:bg-gray-900 relative">
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


        </div>
      </section> */}

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

          <div className="max-w-2xl mx-auto">
            <motion.div
              className="bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/25 dark:to-[#00DD89]/25 backdrop-blur-xl rounded-2xl p-8 border border-[#00AFE6]/30 hover:scale-105 transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Canadian Cardiovascular Society</h3>
              <p className="text-gray-600 dark:text-white/70 leading-relaxed mb-6">Canadian guidelines for cardiac amyloidosis diagnosis and management</p>
              
              <a
                href="https://www.ccs.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
              >
                <span>Access Guidelines</span>
                <ExternalLink className="w-4 h-4" />
              </a>
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