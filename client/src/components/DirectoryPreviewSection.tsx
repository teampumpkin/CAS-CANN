import { motion } from 'framer-motion';
import { Search, Upload, FileText, Users } from 'lucide-react';
import canadaMapPath from '@assets/Canada Map_1750069387234.png';
import InteractiveStatsCounter from './InteractiveStatsCounter';

export default function DirectoryPreviewSection() {
  const features = [
    {
      icon: Search,
      title: 'Searchable clinic directory',
      description: 'Find specialists and treatment centers across Canada',
      gradient: 'from-[#00AFE6] to-[#0088CC]'
    },
    {
      icon: Upload,
      title: 'Uploadable clinical resources',
      description: 'Share and access medical pathways and protocols',
      gradient: 'from-[#00DD89] to-[#00BB77]'
    },
    {
      icon: FileText,
      title: 'Clear, accessible medical info',
      description: 'Evidence-based resources for patients and families',
      gradient: 'from-purple-500 to-purple-700'
    },
    {
      icon: Users,
      title: 'Ways to get involved and support',
      description: 'Join our community and advance amyloidosis care',
      gradient: 'from-orange-500 to-orange-700'
    }
  ];

  return (
    <section className="relative py-24 bg-gray-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#00AFE6] to-[#0088CC] rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-[#00DD89] to-[#00BB77] rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Enhanced Header */}
        <motion.div 
          className="text-center mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-xl text-white px-8 py-4 rounded-full text-lg font-semibold mb-12 border border-white/30 shadow-2xl hover:shadow-[#00AFE6]/30"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.05, y: -3 }}
          >
            <div className="relative">
              <div className="w-3 h-3 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 bg-[#00AFE6] rounded-full animate-ping opacity-75"></div>
            </div>
            <span className="tracking-wide">Resource Hub</span>
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#00AFE6] to-[#00DD89] opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
          </motion.div>

          <h2 className="crawford-section-title text-white mb-10 relative">
            <span className="relative z-10">
              What You'll{" "}
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Find Here
              </span>
            </span>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-gradient-to-r from-[#00AFE6] via-[#00DD89] to-[#00AFE6] rounded-full opacity-70 blur-sm" />
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-[#00AFE6] via-[#00DD89] to-[#00AFE6] rounded-full" />
          </h2>
          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed font-light">
            Comprehensive resources and tools to support patients, families, and healthcare professionals across Canada.
          </p>
        </motion.div>

        {/* Enhanced Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-700 hover:bg-gradient-to-br hover:from-white/15 hover:to-white/8 hover:shadow-2xl hover:shadow-[#00AFE6]/25"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 * index, ease: "easeOut" }}
              whileHover={{ y: -12, scale: 1.03 }}
            >
              {/* Enhanced glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00AFE6]/30 via-[#00DD89]/30 to-[#00AFE6]/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-lg" />
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00AFE6]/20 via-[#00DD89]/20 to-[#00AFE6]/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-md" />
              
              {/* Multi-layer shimmer effect */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1200 ease-out skew-x-12" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00AFE6]/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1400 ease-out skew-x-12 delay-200" />
              </div>

              {/* Background gradient effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-12 transition-opacity duration-700 rounded-3xl`} />
              
              {/* Content */}
              <div className="relative z-10 text-center">
                {/* Enhanced icon with multiple effects */}
                <div className="relative mb-8">
                  <div className={`w-24 h-24 bg-gradient-to-br ${feature.gradient} rounded-3xl flex items-center justify-center shadow-2xl mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative overflow-hidden`}>
                    {/* Icon background glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-50 blur-xl rounded-3xl`} />
                    <feature.icon className="w-12 h-12 text-white relative z-10 drop-shadow-lg" />
                    
                    {/* Floating particles */}
                    <div className="absolute top-2 right-2 w-1 h-1 bg-white/60 rounded-full group-hover:animate-pulse" />
                    <div className="absolute bottom-3 left-3 w-0.5 h-0.5 bg-white/40 rounded-full group-hover:animate-pulse delay-300" />
                  </div>
                  
                  {/* Floating ring effect */}
                  <div className={`absolute inset-0 w-24 h-24 mx-auto rounded-3xl border-2 border-gradient-to-r ${feature.gradient.replace('bg-gradient-to-br', 'border')} opacity-0 group-hover:opacity-30 group-hover:scale-125 transition-all duration-700`} />
                </div>
                
                <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-white transition-colors duration-300 font-cardo leading-tight">
                  {feature.title}
                </h4>
                <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors duration-300 text-base">
                  {feature.description}
                </p>
                
                {/* Subtle action indicator */}
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] mx-auto rounded-full" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Canada Network Section */}
        <motion.div
          className="grid lg:grid-cols-2 gap-16 items-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          {/* Enhanced Map Section */}
          <div className="relative group">
            <div className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl rounded-3xl p-10 border border-white/25 hover:border-white/40 transition-all duration-700 hover:bg-gradient-to-br hover:from-white/20 hover:to-white/8 overflow-hidden">
              {/* Background glow effects */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00AFE6]/20 via-[#00DD89]/20 to-purple-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />
              
              {/* Content */}
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <motion.div
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00AFE6]/20 to-[#00DD89]/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-4 border border-white/20"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full animate-pulse" />
                    <span>National Coverage</span>
                  </motion.div>
                  <h3 className="text-4xl font-bold text-white mb-4 font-cardo leading-tight">
                    Canada-Wide{" "}
                    <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                      Network
                    </span>
                  </h3>
                  <p className="text-white/80 text-lg font-light">Connecting care across all provinces and territories</p>
                </div>
                
                <div className="relative w-full max-w-lg mx-auto">
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.02, rotateY: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <img 
                      src={canadaMapPath}
                      alt="Canada Map showing healthcare network coverage"
                      className="w-full h-auto rounded-2xl shadow-2xl border border-white/20"
                    />
                    
                    {/* Enhanced floating glow behind map */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00AFE6]/30 to-[#00DD89]/30 rounded-2xl -z-10 blur-2xl transform scale-110 opacity-50" />
                  </motion.div>
                  
                  {/* Enhanced Animated Network Points */}
                  <motion.div
                    className="absolute top-1/4 left-1/3 w-5 h-5 bg-gradient-to-r from-[#00AFE6] to-[#0088CC] rounded-full shadow-xl"
                    animate={{ 
                      scale: [1, 1.4, 1],
                      boxShadow: ["0 0 0 0 rgba(0, 175, 230, 0.7)", "0 0 0 10px rgba(0, 175, 230, 0)", "0 0 0 0 rgba(0, 175, 230, 0)"]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute top-1/2 right-1/4 w-5 h-5 bg-gradient-to-r from-[#00DD89] to-[#00BB77] rounded-full shadow-xl"
                    animate={{ 
                      scale: [1, 1.4, 1],
                      boxShadow: ["0 0 0 0 rgba(0, 221, 137, 0.7)", "0 0 0 10px rgba(0, 221, 137, 0)", "0 0 0 0 rgba(0, 221, 137, 0)"]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  />
                  <motion.div
                    className="absolute bottom-1/3 left-1/2 w-5 h-5 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full shadow-xl"
                    animate={{ 
                      scale: [1, 1.4, 1],
                      boxShadow: ["0 0 0 0 rgba(147, 51, 234, 0.7)", "0 0 0 10px rgba(147, 51, 234, 0)", "0 0 0 0 rgba(147, 51, 234, 0)"]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  />
                  
                  {/* Connection lines */}
                  <svg className="absolute inset-0 w-full h-full opacity-30">
                    <motion.path
                      d="M 33% 25% Q 50% 35% 75% 50%"
                      stroke="url(#connectionGradient)"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="5,5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                    />
                    <motion.path
                      d="M 75% 50% Q 60% 60% 50% 67%"
                      stroke="url(#connectionGradient)"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="5,5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 1 }}
                    />
                    <defs>
                      <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00AFE6" stopOpacity="0.6" />
                        <stop offset="50%" stopColor="#00DD89" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#9333EA" stopOpacity="0.6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats & CTA Section */}
          <div className="space-y-12">
            {/* Stats with enhanced presentation */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <h3 className="text-3xl font-bold text-white mb-8 font-cardo text-center lg:text-left">
                Network{" "}
                <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                  Statistics
                </span>
              </h3>
              <InteractiveStatsCounter 
                stats={[
                  { value: 150, suffix: "+", label: "Healthcare Providers", gradient: "from-[#00AFE6] to-[#0088CC]" },
                  { value: 13, label: "Provinces & Territories", gradient: "from-[#00DD89] to-[#00BB77]" },
                  { value: 25, suffix: "+", label: "Major Cities", gradient: "from-purple-500 to-purple-700" },
                  { value: 500, suffix: "+", label: "Resources Available", gradient: "from-orange-500 to-orange-700" }
                ]}
              />
            </motion.div>

            {/* Enhanced CTA Button */}
            <motion.div
              className="pt-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.button
                className="group relative w-full bg-gradient-to-r from-[#00AFE6] via-[#00C4E6] to-[#0088CC] text-white px-10 py-5 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-[#00AFE6]/50 transition-all duration-500 overflow-hidden border border-white/20"
                whileHover={{ scale: 1.02, y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Enhanced shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 transform -skew-x-12"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.8 }}
                />
                
                {/* Button glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#00AFE6] to-[#0088CC] rounded-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-lg" />
                
                <div className="relative flex items-center justify-center gap-4">
                  <span className="tracking-wide">Explore All Resources</span>
                  <motion.svg 
                    className="w-6 h-6" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </motion.svg>
                </div>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}