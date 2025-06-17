import { motion } from 'framer-motion';
import { Heart, AlertTriangle, Search, Microscope, Stethoscope, Activity, Brain, Droplets, Users, ArrowRight, Shield, Clock, Target, Hospital, ChevronDown, ChevronRight, MapPin, BookOpen, ExternalLink } from 'lucide-react';
import { Link } from 'wouter';
import { useState } from 'react';
import ParallaxBackground from '../components/ParallaxBackground';

export default function AboutAmyloidosis() {
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
      color: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
      signs: ['Numbness in hands/feet', 'Tingling sensations', 'Muscle weakness', 'Carpal tunnel syndrome', 'Balance problems']
    },
    {
      category: 'Systemic Symptoms',
      icon: Activity,
      color: 'bg-orange-500/20 border-orange-500/30 text-orange-400',
      signs: ['Unexplained weight loss', 'Enlarged tongue', 'Easy bruising', 'Changes in skin texture', 'Kidney dysfunction']
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
      id: 'aa',
      type: 'AA (Secondary) Amyloidosis',
      subtitle: 'Caused by chronic inflammatory conditions',
      icon: Droplets,
      color: 'from-green-500 to-emerald-500',
      borderColor: 'border-green-500/30',
      prevalence: '5% of systemic amyloidosis cases',
      urgency: 'Moderate - Depends on underlying condition control',
      symptoms: ['Kidney dysfunction', 'Protein in urine', 'Joint pain and swelling', 'Chronic fatigue'],
      diagnosis: ['SAA blood levels', 'Kidney or fat pad biopsy', 'Congo red staining', 'Assessment of inflammatory condition'],
      treatment: ['Control underlying inflammatory disease', 'Anti-inflammatory biologics', 'Kidney support therapy', 'Treatment of rheumatoid arthritis, IBD, or infections'],
      warningSign: 'Kidney problems in patients with chronic inflammatory diseases'
    },
    {
      id: 'other',
      type: 'Other Amyloidosis Types',
      subtitle: 'Localized, Dialysis-Related, and Rare Forms',
      icon: Microscope,
      color: 'from-purple-500 to-violet-500',
      borderColor: 'border-purple-500/30',
      prevalence: 'Variable depending on type',
      urgency: 'Variable - Depends on location and type',
      symptoms: ['Varies by type and organ involvement', 'Local symptoms at affected sites', 'May be asymptomatic initially'],
      diagnosis: ['Specialized testing based on presentation', 'Imaging of affected organs', 'Tissue biopsy', 'Genetic testing if familial'],
      treatment: ['Varies by type and location', 'Local treatments for localized forms', 'Dialysis management for β2M type', 'Organ-specific supportive care'],
      warningSign: 'Unexplained organ dysfunction or family history of similar symptoms'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <ParallaxBackground className="min-h-[80vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#00AFE6]/20 rounded-full blur-3xl -translate-x-48 -translate-y-48" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00DD89]/20 rounded-full blur-3xl translate-x-48 translate-y-48" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20 mb-6">
              <Microscope className="w-4 h-4 text-[#00AFE6]" />
              <span className="text-sm font-medium text-white/90">Medical Information</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold font-rosarivo mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                About
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Amyloidosis
              </span>
            </h1>
            
            <p className="text-xl text-white/70 leading-relaxed mb-10 max-w-3xl mx-auto">
              Learn the signs, understand the types, and take action early. Knowledge and early detection can significantly improve outcomes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/directory" className="group bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-8 py-4 rounded-full font-medium hover:shadow-2xl hover:shadow-[#00AFE6]/25 transition-all duration-300 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Find a Clinic
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/resources" className="bg-white/10 backdrop-blur-xl text-white px-8 py-4 rounded-full font-medium border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                View Resources
              </Link>
            </div>
          </motion.div>
        </div>
      </ParallaxBackground>

      {/* Quick Navigation Section */}
      <section className="py-12 bg-gray-800 border-y border-white/10">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">Quick Navigation</h2>
            <p className="text-white/60 text-sm">Jump to specific sections or explore related resources</p>
          </motion.div>
          
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <a href="#warning-signs" className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-red-500/30 hover:bg-red-500/10 transition-all duration-300 text-center group">
              <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-white/80 group-hover:text-white">Warning Signs</span>
            </a>
            
            <a href="#al-amyloidosis" className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-red-500/30 hover:bg-red-500/10 transition-all duration-300 text-center group">
              <Heart className="w-6 h-6 text-red-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-white/80 group-hover:text-white">AL Type</span>
            </a>
            
            <a href="#attr-amyloidosis" className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-blue-500/30 hover:bg-blue-500/10 transition-all duration-300 text-center group">
              <Brain className="w-6 h-6 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-white/80 group-hover:text-white">ATTR Type</span>
            </a>
            
            <Link href="/directory" className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-[#00AFE6]/30 hover:bg-[#00AFE6]/10 transition-all duration-300 text-center group">
              <MapPin className="w-6 h-6 text-[#00AFE6] mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-white/80 group-hover:text-white">Find Clinics</span>
            </Link>
            
            <Link href="/resources" className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-[#00DD89]/30 hover:bg-[#00DD89]/10 transition-all duration-300 text-center group">
              <BookOpen className="w-6 h-6 text-[#00DD89] mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-white/80 group-hover:text-white">Resources</span>
            </Link>
            
            <Link href="/contact" className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-purple-500/30 hover:bg-purple-500/10 transition-all duration-300 text-center group">
              <Users className="w-6 h-6 text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-white/80 group-hover:text-white">Get Support</span>
            </Link>
            
            <Link href="/get-involved" className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-yellow-500/30 hover:bg-yellow-500/10 transition-all duration-300 text-center group">
              <Heart className="w-6 h-6 text-yellow-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-white/80 group-hover:text-white">Get Involved</span>
            </Link>
            
            <Link href="/about" className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-500/30 hover:bg-gray-500/10 transition-all duration-300 text-center group">
              <Shield className="w-6 h-6 text-gray-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-white/80 group-hover:text-white">About CAS</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Warning Signs Section */}
      <section id="warning-signs" className="py-24 bg-gray-900 relative">
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
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Recognize the
              </span>
              <br />
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Warning Signs
              </span>
            </h2>
            
            <p className="text-xl text-white/70 leading-relaxed max-w-3xl mx-auto">
              Early recognition of symptoms can lead to faster diagnosis and better outcomes. These signs warrant immediate medical attention.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {warningSignsData.map((category, index) => (
              <motion.div
                key={category.category}
                className={`bg-white/5 backdrop-blur-xl rounded-2xl p-6 border ${category.color.split(' ')[1]} ${category.color.split(' ')[2]}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 ${category.color.split(' ')[0]} rounded-xl flex items-center justify-center`}>
                    <category.icon className={`w-6 h-6 ${category.color.split(' ')[2]}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white">{category.category}</h3>
                </div>
                
                <div className="space-y-3 mb-6">
                  {category.signs.map((sign, signIndex) => (
                    <div key={signIndex} className="flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <span className="text-white/80 text-sm">{sign}</span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link href="/resources?category=diagnosis" className="text-xs text-white/60 hover:text-[#00AFE6] flex items-center gap-1 transition-colors">
                      <Search className="w-3 h-3" />
                      Diagnostic Resources
                    </Link>
                    <Link href="/directory" className="text-xs text-white/60 hover:text-[#00DD89] flex items-center gap-1 transition-colors">
                      <Hospital className="w-3 h-3" />
                      Find Specialists
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Emergency CTA */}
          <motion.div
            className="bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl p-8 border border-red-500/30 mt-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-4">If you experience multiple symptoms from different categories</h3>
            <p className="text-white/80 mb-6">Contact your healthcare provider immediately or visit an emergency department. Early diagnosis can be life-saving.</p>
            <Link href="/directory" className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-300">
              <Hospital className="w-5 h-5" />
              Find Emergency Care
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Amyloidosis Types - Collapsible Sections */}
      <section className="py-24 bg-gray-900 relative">
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
                Types of
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Amyloidosis
              </span>
            </h2>
            
            <p className="text-xl text-white/70 leading-relaxed max-w-3xl mx-auto">
              Understanding the different types helps guide diagnosis and treatment. Click on each type to learn more.
            </p>
          </motion.div>

          <div className="space-y-6">
            {amyloidosisTypes.map((type, index) => (
              <motion.div
                id={`${type.id}-amyloidosis`}
                key={type.id}
                className={`bg-white/5 backdrop-blur-xl rounded-2xl border ${type.borderColor} overflow-hidden`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Header - Always Visible */}
                <div
                  className="p-6 cursor-pointer hover:bg-white/5 transition-colors duration-300"
                  onClick={() => toggleType(type.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 bg-gradient-to-r ${type.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <type.icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{type.type}</h3>
                        <p className="text-white/70 text-sm">{type.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-white/50 text-xs uppercase tracking-wide">Prevalence</p>
                        <p className="text-white font-medium text-sm">{type.prevalence}</p>
                      </div>
                      {expandedType === type.id ? (
                        <ChevronDown className="w-6 h-6 text-white/60" />
                      ) : (
                        <ChevronRight className="w-6 h-6 text-white/60" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expandable Content */}
                <motion.div
                  className={`overflow-hidden ${expandedType === type.id ? 'border-t border-white/10' : ''}`}
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
                      <span className="text-sm font-medium">{type.urgency}</span>
                    </div>

                    {/* Warning Sign Callout */}
                    <div className="bg-orange-500/20 border border-orange-500/30 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-orange-400 font-semibold mb-2">Key Warning Sign</h4>
                          <p className="text-white/80 text-sm">{type.warningSign}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                      {/* Symptoms */}
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <Stethoscope className="w-5 h-5 text-[#00AFE6]" />
                          Symptoms
                        </h4>
                        <ul className="space-y-2 mb-4">
                          {type.symptoms.map((symptom, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-[#00AFE6] rounded-full mt-2 flex-shrink-0" />
                              <span className="text-white/80 text-sm">{symptom}</span>
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
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <Search className="w-5 h-5 text-[#00DD89]" />
                          Diagnosis
                        </h4>
                        <ul className="space-y-2 mb-4">
                          {type.diagnosis.map((test, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-[#00DD89] rounded-full mt-2 flex-shrink-0" />
                              <span className="text-white/80 text-sm">{test}</span>
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
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <Target className="w-5 h-5 text-purple-400" />
                          Treatment
                        </h4>
                        <ul className="space-y-2 mb-4">
                          {type.treatment.map((treatment, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-white/80 text-sm">{treatment}</span>
                            </li>
                          ))}
                        </ul>
                        <Link href="/resources?category=treatment" className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1 transition-colors">
                          <Target className="w-3 h-3" />
                          Treatment Guides
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900 relative border-t border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
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
                Take Action
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Today
              </span>
            </h2>
            
            <p className="text-xl text-white/70 leading-relaxed max-w-3xl mx-auto mb-12">
              Early detection and proper care can make a significant difference. Connect with specialists and access resources to support your journey.
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <motion.div
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <MapPin className="w-12 h-12 text-[#00AFE6] mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">Find Expert Care</h3>
                <p className="text-white/70 mb-6">
                  Connect with amyloidosis specialists and treatment centers across Canada.
                </p>
                <Link href="/directory" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                  Find a Clinic
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </motion.div>

              <motion.div
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <BookOpen className="w-12 h-12 text-[#00DD89] mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">Access Resources</h3>
                <p className="text-white/70 mb-6">
                  Explore educational materials, treatment guides, and support resources.
                </p>
                <Link href="/resources" className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300">
                  View Resources
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Resources & Detailed Links Section */}
      <section className="py-16 bg-gray-800 border-t border-white/10">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold font-rosarivo text-white mb-4">
              Explore More <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">Resources</span>
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Access comprehensive information, find specialists, and connect with support networks across Canada.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Diagnostic Information */}
            <motion.div
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">Diagnostic Resources</h3>
              </div>
              <ul className="space-y-3 mb-6">
                <li>
                  <Link href="/resources?category=diagnostic-tests" className="text-sm text-white/80 hover:text-[#00AFE6] flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-[#00AFE6] rounded-full" />
                    Diagnostic Test Information
                  </Link>
                </li>
                <li>
                  <Link href="/resources?category=biopsy-guides" className="text-sm text-white/80 hover:text-[#00AFE6] flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-[#00AFE6] rounded-full" />
                    Biopsy Preparation Guides
                  </Link>
                </li>
                <li>
                  <Link href="/resources?category=lab-results" className="text-sm text-white/80 hover:text-[#00AFE6] flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-[#00AFE6] rounded-full" />
                    Understanding Lab Results
                  </Link>
                </li>
              </ul>
              <Link href="/directory?specialty=diagnostic" className="inline-flex items-center gap-2 text-[#00AFE6] hover:text-white transition-colors text-sm font-medium">
                <MapPin className="w-4 h-4" />
                Find Diagnostic Centers
              </Link>
            </motion.div>

            {/* Treatment Information */}
            <motion.div
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">Treatment Options</h3>
              </div>
              <ul className="space-y-3 mb-6">
                <li>
                  <Link href="/resources?category=chemotherapy" className="text-sm text-white/80 hover:text-[#00DD89] flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-[#00DD89] rounded-full" />
                    Chemotherapy Information
                  </Link>
                </li>
                <li>
                  <Link href="/resources?category=stem-cell" className="text-sm text-white/80 hover:text-[#00DD89] flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-[#00DD89] rounded-full" />
                    Stem Cell Transplant Guide
                  </Link>
                </li>
                <li>
                  <Link href="/resources?category=clinical-trials" className="text-sm text-white/80 hover:text-[#00DD89] flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-[#00DD89] rounded-full" />
                    Clinical Trial Opportunities
                  </Link>
                </li>
              </ul>
              <Link href="/directory?specialty=treatment" className="inline-flex items-center gap-2 text-[#00DD89] hover:text-white transition-colors text-sm font-medium">
                <Hospital className="w-4 h-4" />
                Find Treatment Centers
              </Link>
            </motion.div>

            {/* Support & Care */}
            <motion.div
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">Support & Care</h3>
              </div>
              <ul className="space-y-3 mb-6">
                <li>
                  <Link href="/resources?category=patient-support" className="text-sm text-white/80 hover:text-purple-400 flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-purple-400 rounded-full" />
                    Patient Support Groups
                  </Link>
                </li>
                <li>
                  <Link href="/resources?category=caregiver-guides" className="text-sm text-white/80 hover:text-purple-400 flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-purple-400 rounded-full" />
                    Caregiver Resources
                  </Link>
                </li>
                <li>
                  <Link href="/resources?category=financial-assistance" className="text-sm text-white/80 hover:text-purple-400 flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-purple-400 rounded-full" />
                    Financial Assistance
                  </Link>
                </li>
              </ul>
              <Link href="/contact" className="inline-flex items-center gap-2 text-purple-400 hover:text-white transition-colors text-sm font-medium">
                <Users className="w-4 h-4" />
                Get Connected
              </Link>
            </motion.div>

            {/* Research & Education */}
            <motion.div
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Microscope className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">Research & Education</h3>
              </div>
              <ul className="space-y-3 mb-6">
                <li>
                  <Link href="/resources?category=research-updates" className="text-sm text-white/80 hover:text-orange-400 flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-orange-400 rounded-full" />
                    Latest Research Updates
                  </Link>
                </li>
                <li>
                  <Link href="/resources?category=medical-publications" className="text-sm text-white/80 hover:text-orange-400 flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-orange-400 rounded-full" />
                    Medical Publications
                  </Link>
                </li>
                <li>
                  <Link href="/resources?category=educational-materials" className="text-sm text-white/80 hover:text-orange-400 flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-orange-400 rounded-full" />
                    Educational Materials
                  </Link>
                </li>
              </ul>
              <Link href="/get-involved" className="inline-flex items-center gap-2 text-orange-400 hover:text-white transition-colors text-sm font-medium">
                <Heart className="w-4 h-4" />
                Support Research
              </Link>
            </motion.div>

            {/* Healthcare Professionals */}
            <motion.div
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">For Healthcare Professionals</h3>
              </div>
              <ul className="space-y-3 mb-6">
                <li>
                  <Link href="/resources?category=clinical-guidelines" className="text-sm text-white/80 hover:text-teal-400 flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-teal-400 rounded-full" />
                    Clinical Guidelines
                  </Link>
                </li>
                <li>
                  <Link href="/resources?category=diagnostic-tools" className="text-sm text-white/80 hover:text-teal-400 flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-teal-400 rounded-full" />
                    Diagnostic Tools
                  </Link>
                </li>
                <li>
                  <Link href="/resources?category=continuing-education" className="text-sm text-white/80 hover:text-teal-400 flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-teal-400 rounded-full" />
                    Continuing Education
                  </Link>
                </li>
              </ul>
              <Link href="/resources?audience=healthcare-professionals" className="inline-flex items-center gap-2 text-teal-400 hover:text-white transition-colors text-sm font-medium">
                <Stethoscope className="w-4 h-4" />
                Professional Resources
              </Link>
            </motion.div>

            {/* Emergency Information */}
            <motion.div
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-red-500/30"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">Emergency Information</h3>
              </div>
              <ul className="space-y-3 mb-6">
                <li>
                  <Link href="/resources?category=emergency-symptoms" className="text-sm text-white/80 hover:text-red-400 flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-red-400 rounded-full" />
                    Emergency Symptoms Guide
                  </Link>
                </li>
                <li>
                  <Link href="/resources?category=when-to-call-doctor" className="text-sm text-white/80 hover:text-red-400 flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-red-400 rounded-full" />
                    When to Call Your Doctor
                  </Link>
                </li>
                <li>
                  <Link href="/resources?category=emergency-contacts" className="text-sm text-white/80 hover:text-red-400 flex items-center gap-2 transition-colors">
                    <div className="w-1 h-1 bg-red-400 rounded-full" />
                    Emergency Contact List
                  </Link>
                </li>
              </ul>
              <Link href="/directory?urgent=true" className="inline-flex items-center gap-2 text-red-400 hover:text-white transition-colors text-sm font-medium">
                <Hospital className="w-4 h-4" />
                Find Emergency Care
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Persistent Disclaimer */}
      <div className="bg-gray-800 border-t border-white/10 py-6 sticky bottom-0 z-50">
        <div className="container mx-auto px-6">
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-[#00AFE6] mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-white/90 text-sm leading-relaxed">
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