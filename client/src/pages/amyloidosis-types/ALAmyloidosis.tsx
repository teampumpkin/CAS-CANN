import { motion } from 'framer-motion';
import { Heart, AlertTriangle, Search, Target, ArrowLeft, ChevronDown, ChevronUp, ArrowRight, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import ParallaxBackground from '../../components/ParallaxBackground';
import medicalResearchImg from '@assets/DSC02841_1750068895454.jpg';

export default function ALAmyloidosis() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const detailedInfo = {
    symptoms: [
      "Leg swelling",
      "Fatigue",
      "Irregular heartbeat", 
      "Enlarged tongue",
      "Skin changes (bruising, purple patches around eyes)"
    ],
    diagnosis: [
      "Tissue biopsy",
      "Blood/urine tests for light chains",
      "Bone marrow biopsy",
      "Imaging tests (ECG, MRI, echocardiogram)"
    ],
    treatment: [
      "Chemotherapy",
      "Steroids",
      "Proteasome inhibitors",
      "Monoclonal antibodies",
      "Stem cell transplant (in select cases)",
      "Supportive care to manage symptoms and organ function"
    ],
    centers: [
      {
        name: "Princess Margaret Cancer Centre",
        location: "Toronto, ON",
        type: "Treatment Center",
        specialty: "Comprehensive amyloidosis program"
      },
      {
        name: "Vancouver General Hospital",
        location: "Vancouver, BC", 
        type: "Treatment Center",
        specialty: "Hematology and stem cell transplant"
      },
      {
        name: "CHUM - Centre hospitalier de l'Université de Montréal",
        location: "Montreal, QC",
        type: "Treatment Center", 
        specialty: "Amyloidosis clinic"
      },
      {
        name: "Clinical Trial: Daratumumab in AL Amyloidosis",
        location: "Multiple Centers",
        type: "Clinical Trial",
        specialty: "Phase III study"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Dynamic gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00AFE6]/20 via-white to-[#00DD89]/15 dark:from-[#00AFE6]/30 dark:via-gray-900 dark:to-[#00DD89]/25" />
        
        {/* Simplified brand accent elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-[#00AFE6]/20 to-[#00DD89]/20 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-[#00DD89]/15 to-[#00AFE6]/15 rounded-full blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.15, 0.3, 0.15]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-5xl mx-auto text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Back navigation */}
            <Link href="/about-amyloidosis" className="inline-flex items-center gap-2 text-gray-600 dark:text-white/70 hover:text-[#00AFE6] transition-colors mb-12 group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Amyloidosis Types
            </Link>
            
            {/* Premium badge */}
            <motion.div 
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00AFE6]/20 to-[#00DD89]/20 backdrop-blur-xl rounded-2xl px-8 py-4 border border-[#00AFE6]/30 mb-8 shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-3 h-3 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full animate-pulse" />
              <span className="text-sm font-bold text-[#00AFE6] dark:text-[#00AFE6] tracking-wide uppercase">Light Chain Amyloidosis</span>
              <Heart className="w-5 h-5 text-[#00AFE6]" />
            </motion.div>
            
            {/* Main title with enhanced typography */}
            <motion.h1 
              className="text-5xl lg:text-7xl font-bold font-rosarivo mb-8 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/90 bg-clip-text text-transparent block">
                AL Amyloidosis
              </span>
              <motion.span 
                className="bg-gradient-to-r from-[#00AFE6] via-[#0099CC] to-[#00DD89] bg-clip-text text-transparent block mt-2"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ backgroundSize: '200% 200%' }}
              >
                Light Chain
              </motion.span>
            </motion.h1>
            
            {/* Enhanced description */}
            <motion.p 
              className="text-xl lg:text-2xl text-gray-600 dark:text-white/80 leading-relaxed max-w-4xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Caused by abnormal plasma cells producing light chains that form amyloid. Often diagnosed after age 50; affects both men and women. Related to multiple myeloma (10-15% overlap).
            </motion.p>
            
            {/* Enhanced CTA buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="group bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-[#00AFE6]/30 transition-all duration-300 flex items-center gap-3 cursor-pointer">
                  <Heart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  Learn Symptoms
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/directory" className="group bg-white/20 dark:bg-white/10 backdrop-blur-xl text-gray-900 dark:text-white px-8 py-4 rounded-2xl font-bold text-lg border-2 border-[#00AFE6]/30 hover:border-[#00AFE6] transition-all duration-300 flex items-center gap-3">
                  <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  Find AL Specialists
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Key stats with enhanced design */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {[
                { icon: Heart, label: "Most Common", value: "Systemic Type", color: "from-[#00AFE6]/20 to-blue-400/20 border-[#00AFE6]/40" },
                { icon: Target, label: "Median Age", value: "65 Years", color: "from-[#00DD89]/20 to-green-400/20 border-[#00DD89]/40" },
                { icon: Users, label: "Multiple Myeloma", value: "10-15% Overlap", color: "from-purple-400/20 to-pink-400/20 border-purple-400/40" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className={`bg-gradient-to-br ${stat.color} backdrop-blur-xl rounded-2xl p-6 border`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <stat.icon className="w-8 h-8 text-[#00AFE6] mb-3 mx-auto" />
                  <h3 className="text-sm font-semibold text-gray-600 dark:text-white/70 mb-1">{stat.label}</h3>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Overview Section with Image */}
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
                <div className="inline-flex items-center gap-3 bg-gray-900/10 dark:bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-gray-900/20 dark:border-white/20 mb-6">
                  <Heart className="w-5 h-5 text-[#00AFE6]" />
                  <span className="text-sm font-medium text-gray-700 dark:text-white/90">Overview</span>
                </div>
                
                <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                    Understanding AL
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                    Amyloidosis
                  </span>
                </h2>
                
                <div className="space-y-6 text-gray-600 dark:text-white/70 leading-relaxed">
                  <p className="text-lg">
                    AL amyloidosis affects approximately 3,000-4,000 people in North America each year. The "AL" stands for "Amyloid Light chain," referring to the misfolded light chain proteins that form amyloid deposits.
                  </p>
                  
                  <p>
                    This condition most commonly affects the heart, kidneys, liver, and nervous system. Early diagnosis is crucial as treatment can prevent further organ damage and improve quality of life.
                  </p>
                  
                  <p>
                    The median age at diagnosis is 65 years, and it affects men slightly more often than women. Unlike other forms of amyloidosis, AL amyloidosis is not hereditary.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 border border-[#00AFE6]/20 rounded-2xl p-6 mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Key Facts</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-[#00AFE6] font-medium">Prevalence:</span>
                      <div className="text-gray-700 dark:text-white/80">~8-12 per million</div>
                    </div>
                    <div>
                      <span className="text-[#00AFE6] font-medium">Median Age:</span>
                      <div className="text-gray-700 dark:text-white/80">65 years</div>
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
                      alt="Medical research for AL amyloidosis treatment"
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
                            <div className="text-2xl font-bold bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                              70%
                            </div>
                            <div className="text-xs text-gray-700 dark:text-white/80">Heart Involvement</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold bg-gradient-to-r from-[#00DD89] to-[#00AFE6] bg-clip-text text-transparent">
                              60%
                            </div>
                            <div className="text-xs text-gray-700 dark:text-white/80">Kidney Involvement</div>
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
                    <Heart className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Detailed Information Sections */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
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
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                  Detailed Information
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-white/70">
                Comprehensive information about AL amyloidosis symptoms, diagnosis, treatment, and care options.
              </p>
            </div>

            <div className="space-y-6">
              {/* Symptoms */}
              <motion.div
                className="bg-gray-900/5 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-gray-900/10 dark:border-white/10 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <button
                  onClick={() => toggleSection('symptoms')}
                  className="w-full p-8 flex items-center justify-between text-left hover:bg-gray-900/5 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold font-rosarivo text-gray-900 dark:text-white">Signs & Symptoms</h3>
                      <p className="text-gray-600 dark:text-white/70">Recognizing early warning signs of AL amyloidosis</p>
                    </div>
                  </div>
                  {openSection === 'symptoms' ? (
                    <ChevronUp className="w-6 h-6 text-gray-600 dark:text-white/70" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-600 dark:text-white/70" />
                  )}
                </button>
                
                {openSection === 'symptoms' && (
                  <motion.div
                    className="px-8 pb-8"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-gray-900/5 dark:bg-white/5 rounded-xl p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {detailedInfo.symptoms.map((symptom, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-[#00AFE6] rounded-full mt-2 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-white/80">{symptom}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Diagnosis */}
              <motion.div
                className="bg-gray-900/5 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-gray-900/10 dark:border-white/10 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <button
                  onClick={() => toggleSection('diagnosis')}
                  className="w-full p-8 flex items-center justify-between text-left hover:bg-gray-900/5 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#00DD89] to-[#00AFE6] rounded-xl flex items-center justify-center">
                      <Search className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold font-rosarivo text-gray-900 dark:text-white">Diagnosis & Testing</h3>
                      <p className="text-gray-600 dark:text-white/70">Comprehensive diagnostic procedures and tests</p>
                    </div>
                  </div>
                  {openSection === 'diagnosis' ? (
                    <ChevronUp className="w-6 h-6 text-gray-600 dark:text-white/70" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-600 dark:text-white/70" />
                  )}
                </button>
                
                {openSection === 'diagnosis' && (
                  <motion.div
                    className="px-8 pb-8"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-gray-900/5 dark:bg-white/5 rounded-xl p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {detailedInfo.diagnosis.map((test, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-[#00DD89] rounded-full mt-2 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-white/80">{test}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Treatment */}
              <motion.div
                className="bg-gray-900/5 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-gray-900/10 dark:border-white/10 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <button
                  onClick={() => toggleSection('treatment')}
                  className="w-full p-8 flex items-center justify-between text-left hover:bg-gray-900/5 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold font-rosarivo text-gray-900 dark:text-white">Treatment Options</h3>
                      <p className="text-gray-600 dark:text-white/70">Current therapies and treatment approaches</p>
                    </div>
                  </div>
                  {openSection === 'treatment' ? (
                    <ChevronUp className="w-6 h-6 text-gray-600 dark:text-white/70" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-600 dark:text-white/70" />
                  )}
                </button>
                
                {openSection === 'treatment' && (
                  <motion.div
                    className="px-8 pb-8"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-gray-900/5 dark:bg-white/5 rounded-xl p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {detailedInfo.treatment.map((treatment, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-[#00AFE6] rounded-full mt-2 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-white/80">{treatment}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Treatment Centers & Clinical Trials */}
              <motion.div
                className="bg-gray-900/5 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-gray-900/10 dark:border-white/10 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <button
                  onClick={() => toggleSection('centers')}
                  className="w-full p-8 flex items-center justify-between text-left hover:bg-gray-900/5 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#00DD89] to-[#00AFE6] rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold font-rosarivo text-gray-900 dark:text-white">Treatment Centers & Clinical Trials</h3>
                      <p className="text-gray-600 dark:text-white/70">Specialized centers and research opportunities</p>
                    </div>
                  </div>
                  {openSection === 'centers' ? (
                    <ChevronUp className="w-6 h-6 text-gray-600 dark:text-white/70" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-600 dark:text-white/70" />
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