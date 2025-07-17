import { motion } from 'framer-motion';
import { Droplets, AlertTriangle, Search, Target, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import ParallaxBackground from '../../components/ParallaxBackground';
import medicalResearchImg from '@assets/DSC02841_1750068895454.jpg';

export default function AAAmyloidosis() {
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
      "Kidney dysfunction (proteinuria, hematuria)",
      "Kidney failure",
      "High blood pressure",
      "Swelling (edema)",
      "Fatigue and weakness",
      "Joint pain and stiffness",
      "Fever episodes",
      "Abdominal pain",
      "Liver enlargement",
      "Skin rash"
    ],
    diagnosis: [
      "Kidney biopsy with Congo red staining",
      "Urine protein measurements",
      "Blood tests (creatinine, BUN)",
      "Genetic testing for AA mutations",
      "Serum amyloid A (SAA) levels",
      "Imaging studies (ultrasound, CT)",
      "Assessment of underlying inflammation",
      "Family history evaluation",
      "Mass spectrometry typing"
    ],
    treatment: [
      "Treatment of underlying inflammatory condition",
      "Anti-inflammatory medications",
      "Immunosuppressive therapy",
      "Kidney supportive care",
      "Dialysis (if kidney failure)",
      "Kidney transplantation",
      "Blood pressure management",
      "Protein restriction in diet",
      "Regular monitoring and follow-up"
    ],
    centers: [
      {
        name: "University Health Network",
        location: "Toronto, ON",
        type: "Treatment Center",
        specialty: "Inflammatory amyloidosis clinic"
      },
      {
        name: "McGill University Health Centre",
        location: "Montreal, QC",
        type: "Treatment Center",
        specialty: "Nephrology and amyloidosis"
      },
      {
        name: "Vancouver General Hospital",
        location: "Vancouver, BC",
        type: "Treatment Center",
        specialty: "Kidney disease center"
      },
      {
        name: "Clinical Trial: Anti-SAA Therapy",
        location: "Multiple Centers",
        type: "Clinical Trial",
        specialty: "Novel therapeutic approaches"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="py-32 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent" />
        
        {/* Floating accent elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full opacity-20"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5
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
            <Link href="/about-amyloidosis" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back to Amyloidosis Types
            </Link>
            
            <div className="text-center">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 mb-6">
                <Droplets className="w-5 h-5 text-[#00AFE6]" />
                <span className="text-sm font-medium text-white/90">AA Amyloidosis</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold font-rosarivo mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  AA Amyloidosis
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                  Inflammatory
                </span>
              </h1>
              
              <p className="text-xl text-white/70 leading-relaxed max-w-3xl mx-auto">
                AA amyloidosis is a secondary form caused by chronic inflammatory conditions. The amyloid deposits are formed from serum amyloid A protein, primarily affecting the kidneys.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

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
                  <Droplets className="w-5 h-5 text-[#00AFE6]" />
                  <span className="text-sm font-medium text-white/90">Overview</span>
                </div>
                
                <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    Understanding AA
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                    Amyloidosis
                  </span>
                </h2>
                
                <div className="space-y-6 text-white/70 leading-relaxed">
                  <p className="text-lg">
                    AA amyloidosis develops as a complication of chronic inflammatory diseases such as rheumatoid arthritis, inflammatory bowel disease, or chronic infections. It's the second most common form globally.
                  </p>
                  
                  <p>
                    The kidneys are the most commonly affected organs, though the liver, spleen, and gastrointestinal tract can also be involved. Early detection and treatment of the underlying inflammatory condition is crucial.
                  </p>
                  
                  <p>
                    With modern anti-inflammatory treatments, AA amyloidosis has become less common in developed countries, but remains a significant concern in regions with limited access to healthcare.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 border border-[#00AFE6]/20 rounded-2xl p-6 mt-8">
                  <h3 className="text-xl font-semibold text-white mb-3">Key Facts</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-[#00AFE6] font-medium">Cause:</span>
                      <div className="text-white/80">Chronic Inflammation</div>
                    </div>
                    <div>
                      <span className="text-[#00AFE6] font-medium">Primary Organ:</span>
                      <div className="text-white/80">Kidneys (90%)</div>
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
                      alt="Medical research for AA amyloidosis treatment"
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
                            <div className="text-xs text-white/80">Kidney Involvement</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold bg-gradient-to-r from-[#00DD89] to-[#00AFE6] bg-clip-text text-transparent">
                              5-10%
                            </div>
                            <div className="text-xs text-white/80">Global Prevalence</div>
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
                    <Droplets className="w-6 h-6 text-white" />
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
                Comprehensive information about AA amyloidosis symptoms, diagnosis, treatment, and care options.
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
                      <p className="text-white/70">Recognizing early warning signs of AA amyloidosis</p>
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
                      <Droplets className="w-6 h-6 text-white" />
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