import { motion } from 'framer-motion';
import { Heart, AlertTriangle, Search, Microscope, Stethoscope, Activity, Brain, Droplets, Users, ArrowRight, Shield, Clock, Target } from 'lucide-react';
import ParallaxBackground from '../components/ParallaxBackground';

export default function AboutAmyloidosis() {
  const amyloidosisTypes = [
    {
      type: 'AL (Light-Chain) Amyloidosis',
      icon: Heart,
      color: 'from-red-500 to-pink-500',
      symptoms: ['Fatigue', 'Swelling (especially legs)', 'Numbness', 'Irregular heartbeat', 'Enlarged tongue'],
      diagnosis: ['Blood and urine tests (free light chains)', 'Biopsy', 'Cardiac imaging', 'Bone marrow biopsy'],
      treatment: ['Chemotherapy', 'Stem cell transplant', 'Supportive organ care']
    },
    {
      type: 'ATTR (Transthyretin) Amyloidosis',
      subtitle: 'Hereditary and Wild-Type',
      icon: Brain,
      color: 'from-blue-500 to-cyan-500',
      symptoms: ['Heart failure', 'Peripheral neuropathy', 'Gastrointestinal issues', 'Carpal tunnel syndrome'],
      diagnosis: ['Genetic testing (for hereditary)', 'Scintigraphy', 'Cardiac MRI', 'Tissue biopsy'],
      treatment: ['TTR stabilizers (tafamidis)', 'Gene silencers', 'Cardiac therapies', 'Supportive care']
    },
    {
      type: 'AA (Secondary) Amyloidosis',
      icon: Droplets,
      color: 'from-green-500 to-emerald-500',
      symptoms: ['Kidney dysfunction', 'Joint pain', 'Fatigue'],
      diagnosis: ['SAA blood levels', 'Kidney or fat pad biopsy'],
      treatment: ['Address underlying inflammatory condition (e.g., RA, infections)', 'Anti-inflammatory biologics']
    },
    {
      type: 'Other Types',
      subtitle: 'Localized, Dialysis-Related, Rare Mutations',
      icon: Microscope,
      color: 'from-purple-500 to-violet-500',
      symptoms: ['Varies by type and location'],
      diagnosis: ['Specialized testing based on presentation'],
      treatment: ['Treatment varies widely based on type, organ impact, and cause']
    }
  ];

  const keyPoints = [
    {
      icon: Clock,
      title: 'Early Action',
      description: 'Early diagnosis and treatment can significantly improve quality of life and outcomes.'
    },
    {
      icon: Search,
      title: 'Recognition',
      description: 'Understanding the signs and acting on them is key to better outcomes.'
    },
    {
      icon: Target,
      title: 'Precision Care',
      description: 'Each subtype affects different organs and may require distinct treatment approaches.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <ParallaxBackground className="min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#00AFE6]/20 rounded-full blur-3xl -translate-x-48 -translate-y-48" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00DD89]/20 rounded-full blur-3xl translate-x-48 translate-y-48" />
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
        
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
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20">
                  <Microscope className="w-4 h-4 text-[#00AFE6]" />
                  <span className="text-sm font-medium text-white/90">Medical Information</span>
                </div>
              </motion.div>
              
              <motion.h1
                className="text-5xl lg:text-7xl font-bold font-rosarivo mb-8 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                  About
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                  Amyloidosis
                </span>
              </motion.h1>
              
              <motion.p
                className="text-xl text-white/70 leading-relaxed mb-10 max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Learn the signs, understand the types, and take action early.
              </motion.p>
              
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <button className="group bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-8 py-4 rounded-full font-medium hover:shadow-2xl hover:shadow-[#00AFE6]/25 transition-all duration-300 flex items-center gap-2">
                  Learn More
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="bg-white/10 backdrop-blur-xl text-white px-8 py-4 rounded-full font-medium border border-white/20 hover:bg-white/20 transition-all duration-300">
                  Find Support
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
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-2xl p-6 text-center">
                      <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
                      <div className="text-lg font-bold text-white">Rare</div>
                      <div className="text-sm text-white/70">Disease Group</div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 text-center">
                      <Clock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                      <div className="text-lg font-bold text-white">Early</div>
                      <div className="text-sm text-white/70">Detection Key</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <Stethoscope className="w-12 h-12 text-white/50 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Medical Expertise</h3>
                    <p className="text-white/60 text-sm">Specialized knowledge for better outcomes</p>
                  </div>
                </div>
                
                {/* Floating medical icons */}
                <motion.div
                  className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-2xl flex items-center justify-center"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, 0]
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
                  className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 flex items-center justify-center"
                  animate={{ 
                    x: [0, 10, 0],
                    y: [0, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                >
                  <Activity className="w-6 h-6 text-white/70" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </ParallaxBackground>

      {/* Overview Section */}
      <section className="py-24 bg-gray-900 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 mb-6">
              <Microscope className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-sm font-medium text-white/90">Overview</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-8">
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Understanding
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Amyloidosis
              </span>
            </h2>
            
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/10">
              <p className="text-lg text-white/80 leading-relaxed mb-8">
                Amyloidosis is a group of rare diseases caused by abnormal protein buildup (amyloid) in the body. These deposits can damage organs and tissues, leading to serious health complications. Because symptoms often mimic other conditions, diagnosis is frequently delayed.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                {keyPoints.map((point, index) => (
                  <motion.div
                    key={point.title}
                    className="bg-white/5 rounded-xl p-6 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center mx-auto mb-4">
                      <point.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{point.title}</h3>
                    <p className="text-white/70 text-sm">{point.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Types Section */}
      <section className="py-24 bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 mb-6">
              <Users className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-sm font-medium text-white/90">Clinical Pathways</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-6">
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Amyloidosis Types &
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Clinical Pathways
              </span>
            </h2>
            
            <p className="text-lg text-white/70 max-w-3xl mx-auto">
              Each subtype affects different organs and may require distinct treatment approaches. Below are summaries of the most common forms:
            </p>
          </motion.div>
          
          <div className="grid gap-8 max-w-6xl mx-auto">
            {amyloidosisTypes.map((type, index) => (
              <motion.div
                key={type.type}
                className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-6 mb-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${type.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                    <type.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold font-rosarivo mb-2">{type.type}</h3>
                    {type.subtitle && (
                      <p className="text-white/70 text-lg">{type.subtitle}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Symptoms */}
                  <div className="bg-white/5 rounded-xl p-6">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-400" />
                      Signs & Symptoms
                    </h4>
                    <ul className="space-y-2">
                      {type.symptoms.map((symptom, idx) => (
                        <li key={idx} className="text-white/70 text-sm flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Diagnosis */}
                  <div className="bg-white/5 rounded-xl p-6">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Search className="w-5 h-5 text-blue-400" />
                      Diagnosis & Testing
                    </h4>
                    <ul className="space-y-2">
                      {type.diagnosis.map((test, idx) => (
                        <li key={idx} className="text-white/70 text-sm flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                          {test}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Treatment */}
                  <div className="bg-white/5 rounded-xl p-6">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-green-400" />
                      Treatment
                    </h4>
                    <ul className="space-y-2">
                      {type.treatment.map((treatment, idx) => (
                        <li key={idx} className="text-white/70 text-sm flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                          {treatment}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-24 pb-32 bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00AFE6]/10 to-[#00DD89]/10 rounded-full blur-2xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold font-rosarivo">Disclaimers & Clinical Oversight</h3>
                </div>
                
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6">
                  <p className="text-white/80 leading-relaxed">
                    <strong className="text-amber-400">Important:</strong> This content is for informational purposes only. It is not intended to replace medical advice. All medical decisions should be made in consultation with a qualified healthcare provider.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}