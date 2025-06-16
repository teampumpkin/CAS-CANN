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
        {/* Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-8 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full"></div>
            <span>Resource Hub</span>
          </motion.div>

          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
            What You'll{" "}
            <span className="bg-gradient-to-r from-[#00AFE6] to-[#0088CC] bg-clip-text text-transparent">
              Find Here
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            Comprehensive resources and tools to support patients, families, and healthcare professionals across Canada.
          </p>
        </motion.div>

        {/* Main Content Layout */}
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Features List */}
          <motion.div
            className="lg:col-span-7 space-y-6"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:bg-white/10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -4, scale: 1.01 }}
              >
                {/* Background gradient effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`} />
                
                <div className="relative z-10 flex items-start gap-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2 group-hover:text-white/90 transition-colors duration-300 font-cardo">
                      {feature.title}
                    </h4>
                    <p className="text-white/70 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
                
                {/* Hover accent line */}
                <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-3xl`} />
              </motion.div>
            ))}
          </motion.div>

          {/* Canada Map & Stats Sidebar */}
          <motion.div
            className="lg:col-span-5 space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Map Section */}
            <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:bg-white/10 overflow-hidden">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2 font-cardo">Canada-Wide Network</h3>
                <p className="text-white/70">Connecting care across all provinces and territories</p>
              </div>
              
              <div className="relative w-full max-w-md mx-auto">
                <motion.img 
                  src={canadaMapPath}
                  alt="Canada Map showing healthcare network coverage"
                  className="w-full h-auto rounded-2xl shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
                
                {/* Animated Dots */}
                <motion.div
                  className="absolute top-1/4 left-1/3 w-3 h-3 bg-[#00AFE6] rounded-full shadow-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute top-1/2 right-1/4 w-3 h-3 bg-[#00DD89] rounded-full shadow-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <motion.div
                  className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-purple-500 rounded-full shadow-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
              </div>
            </div>

            {/* Stats Section */}
            <div className="space-y-6">
              <InteractiveStatsCounter 
                stats={[
                  { value: 150, suffix: "+", label: "Healthcare Providers", gradient: "from-[#00AFE6] to-[#0088CC]" },
                  { value: 13, label: "Provinces & Territories", gradient: "from-[#00DD89] to-[#00BB77]" },
                  { value: 25, suffix: "+", label: "Major Cities", gradient: "from-purple-500 to-purple-700" },
                  { value: 500, suffix: "+", label: "Resources Available", gradient: "from-orange-500 to-orange-700" }
                ]}
              />
            </div>

            {/* CTA Button */}
            <motion.div
              className="pt-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.button
                className="group w-full bg-gradient-to-r from-[#00AFE6] to-[#0088CC] text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <div className="relative flex items-center justify-center gap-3">
                  <span>Explore Resources</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}