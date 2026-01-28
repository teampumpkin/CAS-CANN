import { motion } from 'framer-motion';
import { Microscope, AlertTriangle, Search, Target, ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'wouter';
import ParallaxBackground from '../../components/ParallaxBackground';
import medicalResearchImg from '@assets/DSC02841_1750068895454.jpg';

export default function OtherAmyloidosis() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const detailedInfo = {
    symptoms: [
      "AA: Kidney dysfunction, protein in urine",
      "ALECT2: Mainly affects kidneys, also liver and spleen", 
      "Aβ2M: Affects bones and joints",
      "May be asymptomatic initially"
    ],
    diagnosis: [
      "Biopsies (tissue, bone marrow)",
      "Blood and urine analysis",
      "Imaging: ECG, MRI, echocardiograms",
      "Genetic testing (for hereditary types)",
      "Specialized testing: mass spectrometry, immunohistochemistry"
    ],
    treatment: [
      "AA: Treat underlying disease to reduce SAA protein",
      "ALECT2: Often underdiagnosed, mainly affects kidneys",
      "Aβ2M: Becoming rarer due to improved dialysis techniques",
      "Supportive care and research ongoing for most types"
    ],
    centers: [
      {
        name: "McMaster University Medical Centre",
        location: "Hamilton, ON",
        type: "Treatment Center",
        specialty: "AA amyloidosis and inflammatory conditions"
      },
      {
        name: "University of Calgary",
        location: "Calgary, AB",
        type: "Treatment Center",
        specialty: "Hereditary amyloidosis genetics"
      },
      {
        name: "Ottawa Hospital Research Institute",
        location: "Ottawa, ON",
        type: "Research Center",
        specialty: "Localized amyloidosis research"
      },
      {
        name: "Clinical Trial: AA Amyloidosis Treatment",
        location: "Multiple Centers",
        type: "Clinical Trial",
        specialty: "Novel anti-inflammatory therapies"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Simplified brand gradient background */}
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
            
            {/* Premium badge with research theme */}
            <motion.div 
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00AFE6]/20 to-[#00DD89]/20 backdrop-blur-xl rounded-2xl px-8 py-4 border border-[#00AFE6]/30 mb-8 shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-3 h-3 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full animate-pulse" />
              <span className="text-sm font-bold text-[#00AFE6] dark:text-[#00AFE6] tracking-wide uppercase">Rare Amyloidosis Types</span>
              <Microscope className="w-5 h-5 text-[#00AFE6]" />
            </motion.div>
            
            {/* Main title with enhanced typography */}
            <motion.h1 
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-rosarivo mb-8 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/90 bg-clip-text text-transparent block">
                Rare Types of
              </span>
              <motion.span 
                className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent block mt-2"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ backgroundSize: '200% 200%' }}
              >
                Amyloidosis
              </motion.span>
            </motion.h1>
            
            {/* Enhanced description */}
            <motion.p 
              className="text-xl lg:text-2xl text-gray-600 dark:text-white/80 leading-relaxed max-w-4xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Includes AA, ALECT2, Aβ2M, Apolipoprotein, Fibrinogen, Gelsolin, and Lysozyme amyloidosis. Each type has different underlying causes and affects different organs.
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
                  <Microscope className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  Research Updates
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </div>
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
                { icon: Microscope, label: "Research Focus", value: "Ongoing Studies", color: "from-[#00AFE6]/20 to-[#00DD89]/20 border-[#00AFE6]/40" },
                { icon: Target, label: "Multiple Types", value: "7+ Variants", color: "from-[#00DD89]/20 to-[#00AFE6]/20 border-[#00DD89]/40" },
                { icon: AlertTriangle, label: "Often Rare", value: "Specialized Care", color: "from-[#00AFE6]/20 to-[#00DD89]/20 border-[#00AFE6]/40" }
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
                  <Microscope className="w-5 h-5 text-[#00AFE6]" />
                  <span className="text-sm font-medium text-gray-700 dark:text-white/90">Overview</span>
                </div>
                
                <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                    Understanding Other
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                    Amyloidosis Forms
                  </span>
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 backdrop-blur-xl rounded-xl p-6 border border-[#00AFE6]/20 dark:border-[#00AFE6]/30">
                    <h3 className="text-xl font-bold text-[#00AFE6] dark:text-[#00AFE6] mb-3">AA (Secondary) Amyloidosis</h3>
                    <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                      Caused by chronic inflammatory conditions like rheumatoid arthritis, inflammatory bowel disease, or chronic infections. 
                      The key is controlling the underlying inflammatory disease.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-[#00DD89]/15 to-[#00AFE6]/15 dark:from-[#00DD89]/20 dark:to-[#00AFE6]/20 backdrop-blur-xl rounded-xl p-6 border border-[#00DD89]/20 dark:border-[#00DD89]/30">
                    <h3 className="text-xl font-bold text-[#00DD89] dark:text-[#00DD89] mb-3">Localized Amyloidosis</h3>
                    <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                      Affects specific organs or tissues without systemic involvement. Common forms include tracheobronchial, 
                      cutaneous, and localized nodular amyloidosis.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 backdrop-blur-xl rounded-xl p-6 border border-[#00AFE6]/20 dark:border-[#00AFE6]/30">
                    <h3 className="text-xl font-bold text-[#00AFE6] dark:text-[#00AFE6] mb-3">Dialysis-Related Amyloidosis</h3>
                    <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                      Develops in patients on long-term dialysis due to β2-microglobulin protein accumulation. 
                      Improved dialysis techniques have reduced its incidence.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Image Column */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="relative bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/25 dark:to-[#00DD89]/25 backdrop-blur-xl rounded-2xl p-8 border border-[#00AFE6]/30">
                  <img 
                    src={medicalResearchImg} 
                    alt="Medical Research" 
                    className="rounded-xl shadow-2xl w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#00AFE6]/30 to-transparent rounded-xl" />
                  
                  {/* Overlay content */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl p-4 border border-white/20 dark:border-gray-400/20">
                      <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-2">Specialized Care Required</h3>
                      <p className="text-gray-700 dark:text-gray-200 text-sm">
                        Each type requires specific diagnostic approaches and personalized treatment strategies.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Detailed Information Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800 relative">
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
                Detailed Information
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed max-w-3xl mx-auto">
              Comprehensive information about symptoms, diagnosis, and treatment approaches for other amyloidosis types.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Symptoms */}
            <motion.div
              className="bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/25 dark:to-[#00DD89]/25 backdrop-blur-xl rounded-2xl border border-[#00AFE6]/30"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#00AFE6] dark:text-[#00AFE6]">Symptoms</h3>
                </div>
                
                <ul className="space-y-3">
                  {detailedInfo.symptoms.map((symptom, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-[#00AFE6] rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-200 text-sm">{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Diagnosis */}
            <motion.div
              className="bg-gradient-to-br from-[#00DD89]/15 to-[#00AFE6]/15 dark:from-[#00DD89]/25 dark:to-[#00AFE6]/25 backdrop-blur-xl rounded-2xl border border-[#00DD89]/30"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#00DD89] to-[#00AFE6] rounded-xl flex items-center justify-center">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#00DD89] dark:text-[#00DD89]">Diagnosis</h3>
                </div>
                
                <ul className="space-y-3">
                  {detailedInfo.diagnosis.map((test, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-[#00DD89] rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-200 text-sm">{test}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Treatment */}
            <motion.div
              className="bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/25 dark:to-[#00DD89]/25 backdrop-blur-xl rounded-2xl border border-[#00AFE6]/30"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#00AFE6] dark:text-[#00AFE6]">Treatment</h3>
                </div>
                
                <ul className="space-y-3">
                  {detailedInfo.treatment.map((treatment, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-[#00AFE6] rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-200 text-sm">{treatment}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Treatment Centers Section */}
      <section className="py-24 bg-white dark:bg-gray-900 relative">
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
                Treatment Centers
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed max-w-3xl mx-auto">
              Specialized centers across Canada offering comprehensive care for other amyloidosis types.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {detailedInfo.centers.map((center, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/25 dark:to-[#00DD89]/25 backdrop-blur-xl rounded-2xl p-6 border border-[#00AFE6]/30"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{center.name}</h3>
                    <p className="text-[#00AFE6] text-sm mb-2">{center.location}</p>
                    <div className="inline-flex items-center gap-2 bg-[#00AFE6]/20 rounded-full px-3 py-1 mb-3">
                      <span className="text-xs font-medium text-[#00AFE6]">{center.type}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-200 text-sm">{center.specialty}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
        </div>
      </section>
    </div>
  );
}