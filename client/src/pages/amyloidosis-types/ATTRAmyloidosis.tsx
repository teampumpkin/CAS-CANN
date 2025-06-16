import { motion } from 'framer-motion';
import { Brain, AlertTriangle, Search, Target, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'wouter';
import ParallaxBackground from '../../components/ParallaxBackground';
import medicalResearchImg from '@assets/DSC02841_1750068895454.jpg';

export default function ATTRAmyloidosis() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const detailedInfo = {
    symptoms: [
      "Heart failure symptoms",
      "Peripheral neuropathy (numbness, tingling)",
      "Gastrointestinal issues",
      "Carpal tunnel syndrome",
      "Orthostatic hypotension",
      "Weight loss",
      "Fatigue and weakness",
      "Autonomic neuropathy",
      "Eye involvement (vitreous opacities)",
      "Kidney involvement (rare)"
    ],
    diagnosis: [
      "Genetic testing (for hereditary ATTR)",
      "Technetium-99m scintigraphy (bone scan)",
      "Cardiac MRI and echocardiogram",
      "Tissue biopsy with Congo red staining",
      "Nerve conduction studies",
      "Autonomic function testing",
      "Family history assessment",
      "Biomarker testing (NT-proBNP, troponin)",
      "Mass spectrometry typing"
    ],
    treatment: [
      "TTR stabilizers (tafamidis, diflunisal)",
      "Gene silencing therapies (patisiran, inotersen)",
      "Supportive cardiac care",
      "Neuropathy management",
      "Liver transplantation (for hereditary ATTR)",
      "Cardiac transplantation (selected cases)",
      "Pain management for neuropathy",
      "Physical therapy and rehabilitation",
      "Nutritional support"
    ],
    centers: [
      {
        name: "Toronto General Hospital",
        location: "Toronto, ON",
        type: "Treatment Center",
        specialty: "Comprehensive ATTR amyloidosis program"
      },
      {
        name: "Montreal Heart Institute",
        location: "Montreal, QC",
        type: "Treatment Center",
        specialty: "Cardiac amyloidosis clinic"
      },
      {
        name: "University of Alberta Hospital",
        location: "Edmonton, AB",
        type: "Treatment Center",
        specialty: "Hereditary amyloidosis program"
      },
      {
        name: "Clinical Trial: ATTR-ACT Study",
        location: "Multiple Centers",
        type: "Clinical Trial",
        specialty: "Tafamidis efficacy study"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <ParallaxBackground className="relative overflow-hidden">
        <div className="container mx-auto px-6 py-32 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link href="/about-amyloidosis">
              <button className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8">
                <ArrowLeft className="w-4 h-4" />
                Back to Amyloidosis Types
              </button>
            </Link>
            
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 mb-6">
              <Brain className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-sm font-medium text-white/90">ATTR Amyloidosis</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold font-rosarivo mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                ATTR Amyloidosis
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Transthyretin
              </span>
            </h1>
            
            <p className="text-xl text-white/70 leading-relaxed max-w-3xl mx-auto">
              ATTR amyloidosis is caused by misfolded transthyretin proteins. It includes both hereditary (genetic mutations) and wild-type (age-related) forms, primarily affecting the heart and nervous system.
            </p>
          </motion.div>
        </div>
      </ParallaxBackground>

      {/* Overview Section with Image */}
      <section className="py-24 bg-gray-900 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
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
                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 mb-6">
                  <Brain className="w-5 h-5 text-[#00AFE6]" />
                  <span className="text-sm font-medium text-white/90">Overview</span>
                </div>
                
                <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    Understanding ATTR
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                    Amyloidosis
                  </span>
                </h2>
                
                <div className="space-y-6 text-white/70 leading-relaxed">
                  <p className="text-lg">
                    ATTR amyloidosis has two main forms: hereditary (hATTR) caused by genetic mutations in the TTR gene, and wild-type (wtATTR) which occurs naturally with aging, primarily affecting men over 65.
                  </p>
                  
                  <p>
                    The hereditary form often presents with neuropathy and can affect multiple organ systems. The wild-type form primarily causes cardiac amyloidosis and is increasingly recognized as a cause of heart failure in elderly patients.
                  </p>
                  
                  <p>
                    Recent advances in treatment, including TTR stabilizers and gene silencing therapies, have significantly improved outcomes for patients with ATTR amyloidosis.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 border border-[#00AFE6]/20 rounded-2xl p-6 mt-8">
                  <h3 className="text-xl font-semibold text-white mb-3">Key Facts</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-[#00AFE6] font-medium">Types:</span>
                      <div className="text-white/80">Hereditary & Wild-type</div>
                    </div>
                    <div>
                      <span className="text-[#00AFE6] font-medium">Primary Organs:</span>
                      <div className="text-white/80">Heart & Nerves</div>
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
                <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10">
                  <div className="aspect-[4/5] relative">
                    <img 
                      src={medicalResearchImg} 
                      alt="Medical research for ATTR amyloidosis treatment"
                      className="w-full h-full object-cover"
                    />
                    
                    <motion.div
                      className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl shadow-2xl"
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    >
                      <div className="px-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                              90%
                            </div>
                            <div className="text-xs text-white/80">Cardiac in wtATTR</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold bg-gradient-to-r from-[#00DD89] to-[#00AFE6] bg-clip-text text-transparent">
                              130+
                            </div>
                            <div className="text-xs text-white/80">Known Mutations</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  
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
                    <Brain className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Detailed Information Sections */}
      <section className="py-24 bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-6">
                <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  Detailed Information
                </span>
              </h2>
              <p className="text-lg text-white/70">
                Comprehensive information about ATTR amyloidosis symptoms, diagnosis, treatment, and care options.
              </p>
            </div>

            <div className="space-y-6">
              {/* Symptoms */}
              <motion.div
                className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <button
                  onClick={() => toggleSection('symptoms')}
                  className="w-full p-8 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold font-rosarivo">Signs & Symptoms</h3>
                      <p className="text-white/70">Recognizing early warning signs of ATTR amyloidosis</p>
                    </div>
                  </div>
                  {openSection === 'symptoms' ? (
                    <ChevronUp className="w-6 h-6 text-white/70" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-white/70" />
                  )}
                </button>
                
                {openSection === 'symptoms' && (
                  <motion.div
                    className="px-8 pb-8"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-white/5 rounded-xl p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {detailedInfo.symptoms.map((symptom, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-white/80">{symptom}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Diagnosis */}
              <motion.div
                className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <button
                  onClick={() => toggleSection('diagnosis')}
                  className="w-full p-8 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <Search className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold font-rosarivo">Diagnosis & Testing</h3>
                      <p className="text-white/70">Comprehensive diagnostic procedures and tests</p>
                    </div>
                  </div>
                  {openSection === 'diagnosis' ? (
                    <ChevronUp className="w-6 h-6 text-white/70" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-white/70" />
                  )}
                </button>
                
                {openSection === 'diagnosis' && (
                  <motion.div
                    className="px-8 pb-8"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-white/5 rounded-xl p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {detailedInfo.diagnosis.map((test, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-white/80">{test}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Treatment */}
              <motion.div
                className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <button
                  onClick={() => toggleSection('treatment')}
                  className="w-full p-8 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold font-rosarivo">Treatment Options</h3>
                      <p className="text-white/70">Current therapies and treatment approaches</p>
                    </div>
                  </div>
                  {openSection === 'treatment' ? (
                    <ChevronUp className="w-6 h-6 text-white/70" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-white/70" />
                  )}
                </button>
                
                {openSection === 'treatment' && (
                  <motion.div
                    className="px-8 pb-8"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-white/5 rounded-xl p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {detailedInfo.treatment.map((treatment, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-white/80">{treatment}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Treatment Centers & Clinical Trials */}
              <motion.div
                className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <button
                  onClick={() => toggleSection('centers')}
                  className="w-full p-8 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold font-rosarivo">Treatment Centers & Clinical Trials</h3>
                      <p className="text-white/70">Specialized centers and research opportunities</p>
                    </div>
                  </div>
                  {openSection === 'centers' ? (
                    <ChevronUp className="w-6 h-6 text-white/70" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-white/70" />
                  )}
                </button>
                
                {openSection === 'centers' && (
                  <motion.div
                    className="px-8 pb-8"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-white/5 rounded-xl p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {detailedInfo.centers.map((center, index) => (
                          <div key={index} className="bg-white/5 rounded-xl p-4">
                            <div className="flex items-start gap-3 mb-2">
                              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                              <div>
                                <h4 className="font-semibold text-white">{center.name}</h4>
                                <p className="text-white/70 text-sm">{center.location}</p>
                                <p className="text-white/60 text-xs mt-1">
                                  <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs">
                                    {center.type}
                                  </span>
                                </p>
                                <p className="text-white/80 text-sm mt-2">{center.specialty}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}