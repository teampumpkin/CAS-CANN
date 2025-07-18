import { motion } from 'framer-motion';
import { Heart, AlertTriangle, Search, Microscope, Stethoscope, Activity, Brain, Droplets, Users, ArrowRight, Shield, Clock, Target, Hospital, ChevronDown, ChevronRight, MapPin, BookOpen, ExternalLink, Zap, Lightbulb, ArrowDown } from 'lucide-react';
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
      category: 'Cardiac Symptoms',
      icon: Heart,
      color: 'bg-red-500/20 border-red-500/30 text-red-400',
      signs: ['Shortness of breath', 'Chest pain', 'Irregular heartbeat', 'Swelling in legs/ankles', 'Fatigue during normal activities']
    },
    {
      category: 'Neurological Symptoms',
      icon: Brain,
      color: 'bg-gradient-to-r from-[#00AFE6] to-[#00DD89]/20 border-blue-500/30 text-blue-400',
      signs: ['Numbness in hands/feet', 'Tingling sensations', 'Muscle weakness', 'Carpal tunnel syndrome', 'Balance problems']
    },
    {
      category: 'Gastrointestinal (GI) Symptoms',
      icon: Activity,
      color: 'bg-gradient-to-r from-[#00DD89] to-[#00AFE6]/20 border-green-500/30 text-green-400',
      signs: ['Persistent diarrhea', 'Nausea and vomiting', 'Abdominal pain', 'Loss of appetite', 'Malabsorption symptoms']
    },
    {
      category: 'Genitourinary (GU) Symptoms',
      icon: Droplets,
      color: 'bg-purple-500/20 border-purple-500/30 text-purple-400',
      signs: ['Proteinuria (protein in urine)', 'Decreased urine output', 'Kidney dysfunction', 'Urinary retention', 'Bladder problems']
    },
    {
      category: 'Systemic Symptoms',
      icon: Microscope,
      color: 'bg-orange-500/20 border-orange-500/30 text-orange-400',
      signs: ['Unexplained weight loss', 'Enlarged tongue', 'Easy bruising', 'Changes in skin texture', 'Chronic fatigue']
    }
  ];

  const amyloidosisTypes = [
    {
      id: 'al',
      type: 'AL (Light-Chain) Amyloidosis',
      subtitle: 'Most common form affecting multiple organs',
      icon: Heart,
      color: 'from-red-500 to-pink-500',
      borderColor: 'border-red-500/30',
      prevalence: '70% of systemic amyloidosis cases',
      urgency: 'High - Progressive and potentially life-threatening',
      symptoms: ['Fatigue and weakness', 'Swelling in legs and ankles', 'Numbness in hands/feet', 'Irregular heartbeat', 'Enlarged tongue', 'Easy bruising'],
      diagnosis: ['Blood and urine free light chain tests', 'Tissue biopsy (fat pad, bone marrow)', 'Cardiac imaging (echo, MRI)', 'Congo red staining'],
      treatment: ['Chemotherapy targeting plasma cells', 'Autologous stem cell transplant', 'Supportive organ care', 'Clinical trial participation'],
      warningSign: 'Combination of heart and kidney symptoms with unexplained protein in urine'
    },
    {
      id: 'attr',
      type: 'ATTR (Transthyretin) Amyloidosis',
      subtitle: 'Hereditary (hATTR) and Wild-Type (wtATTR)',
      icon: Brain,
      color: 'from-blue-500 to-cyan-500',
      borderColor: 'border-blue-500/30',
      prevalence: '25% of systemic amyloidosis cases',
      urgency: 'Moderate to High - Progressive with available treatments',
      symptoms: ['Heart failure symptoms', 'Peripheral neuropathy', 'Carpal tunnel syndrome (often bilateral)', 'Gastrointestinal issues', 'Eye problems'],
      diagnosis: ['Genetic testing (for hereditary form)', 'DPD or PYP scintigraphy', 'Cardiac MRI', 'Tissue biopsy if needed'],
      treatment: ['TTR stabilizers (tafamidis)', 'Gene silencing therapy', 'Cardiac support therapies', 'Liver transplant (severe hereditary cases)'],
      warningSign: 'Heart failure in elderly men or family history with neuropathy'
    },
    {
      id: 'other',
      type: 'Other Amyloidosis Types',
      subtitle: 'AA (Secondary), Localized, Dialysis-Related, and Rare Forms',
      icon: Microscope,
      color: 'from-purple-500 to-violet-500',
      borderColor: 'border-purple-500/30',
      prevalence: 'Variable depending on type (AA: 5% of systemic cases)',
      urgency: 'Variable - Depends on type and underlying condition',
      symptoms: ['AA: Kidney dysfunction, protein in urine', 'AA: Joint pain and swelling from chronic inflammation', 'Localized: Symptoms at specific affected sites', 'Dialysis-related: Joint stiffness, carpal tunnel', 'May be asymptomatic initially'],
      diagnosis: ['AA: SAA blood levels, kidney biopsy', 'Congo red staining for all types', 'Assessment of underlying inflammatory conditions', 'Imaging of affected organs', 'Genetic testing if familial'],
      treatment: ['AA: Control underlying inflammatory disease', 'AA: Anti-inflammatory biologics, kidney support', 'Localized: Local treatments for affected areas', 'Dialysis-related: Improved dialysis management', 'Organ-specific supportive care'],
      warningSign: 'AA: Kidney problems with chronic inflammatory diseases; Others: Unexplained organ dysfunction or family history'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <ParallaxBackground className="min-h-[80vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#00AFE6]/20 rounded-full blur-3xl -translate-x-48 -translate-y-48" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00DD89]/20 rounded-full blur-3xl translate-x-48 translate-y-48" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-gray-900/10 dark:bg-white/10 backdrop-blur-xl rounded-full px-4 py-2 border border-gray-900/20 dark:border-white/20 mb-6">
              <Microscope className="w-4 h-4 text-[#00AFE6]" />
              <span className="text-sm font-medium text-gray-700 dark:text-white/90">Medical Information</span>
            </div>
            
            <h1 className="crawford-section-title mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                About
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Amyloidosis
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed mb-10 max-w-3xl mx-auto">Learn about the different types, recognize the symptoms and take action early</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/directory" className="group bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-8 py-4 rounded-full font-medium hover:shadow-2xl hover:shadow-[#00AFE6]/25 transition-all duration-300 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Find a Clinic
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/resources" className="bg-gray-900/10 dark:bg-white/10 backdrop-blur-xl text-gray-900 dark:text-white px-8 py-4 rounded-full font-medium border border-gray-900/20 dark:border-white/20 hover:bg-gray-900/20 dark:hover:bg-white/20 transition-all duration-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                View Resources
              </Link>
            </div>
          </motion.div>
        </div>
      </ParallaxBackground>
      
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
              Understanding amyloidosis starts with understanding proteins and what happens when they don't work properly in your body.
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
              <div className="bg-gradient-to-br from-blue-50/95 to-cyan-50/95 dark:from-blue-900/25 dark:to-cyan-900/25 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/50 dark:border-blue-400/30">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-800 dark:text-blue-100">Normal Proteins</h3>
                </div>
                <p className="text-blue-700 dark:text-blue-200 leading-relaxed">
                  Think of proteins like tiny workers in your body. Normally, they have specific shapes that help them do their jobs—like carrying oxygen, fighting infections, or helping your heart pump blood.
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50/95 to-red-50/95 dark:from-orange-900/25 dark:to-red-900/25 backdrop-blur-xl rounded-2xl p-8 border border-orange-200/50 dark:border-orange-400/30">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-orange-800 dark:text-orange-100">Misfolded Proteins</h3>
                </div>
                <p className="text-orange-700 dark:text-orange-200 leading-relaxed">
                  In amyloidosis, these protein workers get "misfolded"—like origami that's been folded wrong. When this happens, they can't do their jobs properly and start clumping together instead.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50/95 to-violet-50/95 dark:from-purple-900/25 dark:to-violet-900/25 backdrop-blur-xl rounded-2xl p-8 border border-purple-200/50 dark:border-purple-400/30">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-800 dark:text-purple-100">Amyloid Deposits</h3>
                </div>
                <p className="text-purple-700 dark:text-purple-200 leading-relaxed">
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
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
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
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
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
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
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
              Understanding the different types helps guide diagnosis and treatment. Click on each type to learn more.
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
                }`}
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
                    <div className="bg-orange-100/80 dark:bg-orange-500/20 border border-orange-300/60 dark:border-orange-500/30 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-orange-700 dark:text-orange-400 font-semibold mb-2">Key Warning Sign</h4>
                          <p className="text-orange-800 dark:text-white/80 text-sm">{type.warningSign}</p>
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
                          <Target className="w-5 h-5 text-purple-400" />
                          Treatment
                        </h4>
                        <ul className="space-y-2 mb-4">
                          {type.treatment.map((treatment, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-white/80 text-sm">{treatment}</span>
                            </li>
                          ))}
                        </ul>
                        <Link href="/resources?category=treatment" className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1 transition-colors">
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
      {/* Warning Signs Section */}
      <section id="warning-signs" className="py-24 bg-gray-50 dark:bg-gray-900 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-red-500/20 backdrop-blur-xl rounded-full px-4 py-2 border border-red-500/30 mb-6">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium text-red-400">Critical Warning Signs</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                Recognize the
              </span>
              <br />
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Warning Signs
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed max-w-3xl mx-auto">
              Early recognition of symptoms can lead to faster diagnosis and better outcomes. These signs warrant immediate medical attention.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {warningSignsData.map((category, index) => (
              <motion.div
                key={category.category}
                className={`backdrop-blur-xl rounded-2xl p-6 border ${category.color.split(' ')[1]} ${category.color.split(' ')[2]} ${
                  index === 0 
                    ? 'bg-gradient-to-br from-red-50/95 to-pink-50/95 dark:from-red-900/25 dark:to-pink-900/25 border-red-200/50 dark:border-red-400/30'
                    : index === 1
                    ? 'bg-gradient-to-br from-blue-50/95 to-cyan-50/95 dark:from-blue-900/25 dark:to-cyan-900/25 border-blue-200/50 dark:border-blue-400/30'
                    : index === 2
                    ? 'bg-gradient-to-br from-green-50/95 to-emerald-50/95 dark:from-green-900/25 dark:to-emerald-900/25 border-green-200/50 dark:border-green-400/30'
                    : index === 3
                    ? 'bg-gradient-to-br from-purple-50/95 to-violet-50/95 dark:from-purple-900/25 dark:to-violet-900/25 border-purple-200/50 dark:border-purple-400/30'
                    : 'bg-gradient-to-br from-orange-50/95 to-amber-50/95 dark:from-orange-900/25 dark:to-amber-900/25 border-orange-200/50 dark:border-orange-400/30'
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 ${category.color.split(' ')[0]} rounded-xl flex items-center justify-center`}>
                    <category.icon className={`w-6 h-6 ${category.color.split(' ')[2]}`} />
                  </div>
                  <h3 className={`text-lg font-bold ${
                    index === 0 
                      ? 'text-red-900 dark:text-red-100'
                      : index === 1
                      ? 'text-blue-900 dark:text-blue-100'
                      : index === 2
                      ? 'text-green-900 dark:text-green-100'
                      : index === 3
                      ? 'text-purple-900 dark:text-purple-100'
                      : 'text-orange-900 dark:text-orange-100'
                  }`}>{category.category}</h3>
                </div>
                
                <div className="space-y-3 mb-6">
                  {category.signs.map((sign, signIndex) => (
                    <div key={signIndex} className="flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-white/80 text-sm">{sign}</span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link href="/resources?category=diagnosis" className="text-xs text-gray-600 dark:text-white/60 hover:text-[#00AFE6] flex items-center gap-1 transition-colors">
                      <Search className="w-3 h-3" />
                      Diagnostic Resources
                    </Link>
                    <Link href="/directory" className="text-xs text-gray-600 dark:text-white/60 hover:text-[#00DD89] flex items-center gap-1 transition-colors">
                      <Hospital className="w-3 h-3" />
                      Find Specialists
                    </Link>
                  </div>
                </div>
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
              className="bg-gradient-to-br from-purple-50/95 to-violet-50/95 dark:from-purple-900/25 dark:to-violet-900/25 backdrop-blur-xl rounded-2xl p-6 border border-purple-200/50 dark:border-purple-400/30"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-purple-800 dark:text-purple-100">Support & Care</h3>
              </div>
              <ul className="space-y-3 mb-6">
                <li>
                  <Link href="/resources?category=patient-support" className="text-sm text-purple-700 dark:text-white/80 hover:text-purple-400 flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-purple-400 rounded-full" />
                    Patient Support Groups
                  </Link>
                </li>
                <li>
                  <Link href="/resources?category=caregiver-guides" className="text-sm text-purple-700 dark:text-white/80 hover:text-purple-400 flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-purple-400 rounded-full" />
                    Caregiver Resources
                  </Link>
                </li>
                <li>
                  <Link href="/resources?category=financial-assistance" className="text-sm text-purple-700 dark:text-white/80 hover:text-purple-400 flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-purple-400 rounded-full" />
                    Financial Assistance
                  </Link>
                </li>
              </ul>
              <Link href="/contact" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-600 dark:hover:text-white transition-colors text-sm font-medium">
                <Users className="w-4 h-4" />
                Get Connected
              </Link>
            </motion.div>

            {/* Research & Education */}
            <motion.div
              className="bg-gradient-to-br from-orange-50/95 to-red-50/95 dark:from-orange-900/25 dark:to-red-900/25 backdrop-blur-xl rounded-2xl p-6 border border-orange-200/50 dark:border-orange-400/30"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Microscope className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-orange-800 dark:text-orange-100">Research & Education</h3>
              </div>
              <ul className="space-y-3 mb-6">
                <li>
                  <Link href="/resources?category=research-updates" className="text-sm text-orange-700 dark:text-white/80 hover:text-orange-400 flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-orange-400 rounded-full" />
                    Latest Research Updates
                  </Link>
                </li>
                <li>
                  <Link href="/resources?category=medical-publications" className="text-sm text-orange-700 dark:text-white/80 hover:text-orange-400 flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-orange-400 rounded-full" />
                    Medical Publications
                  </Link>
                </li>
                <li>
                  <Link href="/resources?category=educational-materials" className="text-sm text-orange-700 dark:text-white/80 hover:text-orange-400 flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-orange-400 rounded-full" />
                    Educational Materials
                  </Link>
                </li>
              </ul>
              <Link href="/get-involved" className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-600 dark:hover:text-white transition-colors text-sm font-medium">
                <Heart className="w-4 h-4" />
                Support Research
              </Link>
            </motion.div>

            {/* Healthcare Professionals */}
            <motion.div
              className="bg-gradient-to-br from-teal-50/95 to-blue-50/95 dark:from-teal-900/25 dark:to-blue-900/25 backdrop-blur-xl rounded-2xl p-6 border border-teal-200/50 dark:border-teal-400/30"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-teal-800 dark:text-teal-100">For Healthcare Professionals</h3>
              </div>
              <ul className="space-y-3 mb-6">
                <li>
                  <Link href="/resources?category=clinical-guidelines" className="text-sm text-teal-700 dark:text-white/80 hover:text-teal-400 flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-teal-400 rounded-full" />
                    Clinical Guidelines
                  </Link>
                </li>
                <li>
                  <Link href="/resources?category=diagnostic-tools" className="text-sm text-teal-700 dark:text-white/80 hover:text-teal-400 flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-teal-400 rounded-full" />
                    Diagnostic Tools
                  </Link>
                </li>
                <li>
                  <Link href="/resources?category=continuing-education" className="text-sm text-teal-700 dark:text-white/80 hover:text-teal-400 flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-teal-400 rounded-full" />
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