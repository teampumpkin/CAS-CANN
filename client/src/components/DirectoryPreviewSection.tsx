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

        {/* Interactive Resource Grid */}
        <div className="relative">
          {/* Floating background elements */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 bg-gradient-to-r from-[#00AFE6]/20 to-[#00DD89]/20 rounded-full"
                style={{
                  left: `${10 + i * 12}%`,
                  top: `${15 + (i % 3) * 25}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, 15, 0],
                  opacity: [0.2, 0.6, 0.2],
                }}
                transition={{
                  duration: 4 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>

          <div className="relative grid lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:bg-white/10 overflow-hidden h-full">
                  {/* Background gradient effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`} />
                  
                  {/* Floating micro element */}
                  <motion.div
                    className="absolute top-4 right-4 w-2 h-2 bg-[#00AFE6] rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.7 }}
                  />

                  <div className="relative z-10">
                    {/* Icon with animated ring */}
                    <div className="relative mb-6">
                      <motion.div
                        className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 10 }}
                      >
                        <feature.icon className="w-10 h-10 text-white" />
                      </motion.div>
                      
                      {/* Animated ring around icon */}
                      <motion.div
                        className={`absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-50`}
                        style={{ backgroundClip: 'padding-box' }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      />
                    </div>

                    <h4 className="text-xl font-bold text-white mb-4 group-hover:text-white/90 transition-colors duration-300 font-cardo">
                      {feature.title}
                    </h4>
                    <p className="text-white/70 leading-relaxed mb-6 group-hover:text-white/80 transition-colors duration-300">
                      {feature.description}
                    </p>

                    {/* Interactive progress indicator */}
                    <div className="relative">
                      <div className="flex items-center justify-between text-white/60 text-sm mb-2">
                        <span>Available Resources</span>
                        <span>{Math.floor(Math.random() * 30) + 20}+</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <motion.div
                          className={`h-2 bg-gradient-to-r ${feature.gradient} rounded-full`}
                          initial={{ width: "0%" }}
                          whileInView={{ width: `${60 + index * 15}%` }}
                          transition={{ duration: 1.5, delay: 0.5 + index * 0.1 }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hover effect line */}
                  <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-3xl`} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Interactive Canada Map Section */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10 overflow-hidden">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Map Visualization */}
                <div className="relative">
                  <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <h3 className="text-3xl font-bold text-white mb-4 font-cardo">
                      Coast to Coast Coverage
                    </h3>
                    <p className="text-white/80">
                      Connecting healthcare providers and patients across all provinces and territories
                    </p>
                  </motion.div>

                  <div className="relative max-w-lg mx-auto">
                    <motion.img 
                      src={canadaMapPath}
                      alt="Canada Map showing healthcare network coverage"
                      className="w-full h-auto rounded-2xl shadow-xl"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                    
                    {/* Interactive map markers */}
                    {[
                      { top: '25%', left: '30%', color: '#00AFE6', label: 'BC' },
                      { top: '35%', left: '45%', color: '#00DD89', label: 'AB' },
                      { top: '40%', left: '60%', color: '#00AFE6', label: 'ON' },
                      { top: '30%', left: '75%', color: '#00DD89', label: 'QC' },
                      { top: '45%', left: '85%', color: '#00AFE6', label: 'NS' },
                    ].map((marker, i) => (
                      <motion.div
                        key={i}
                        className="absolute cursor-pointer group/marker"
                        style={{ top: marker.top, left: marker.left }}
                        whileHover={{ scale: 1.5 }}
                      >
                        <motion.div
                          className="w-4 h-4 rounded-full shadow-lg relative"
                          style={{ backgroundColor: marker.color }}
                          animate={{ 
                            scale: [1, 1.3, 1],
                            boxShadow: [
                              `0 0 0 0 ${marker.color}40`,
                              `0 0 0 10px ${marker.color}00`,
                              `0 0 0 0 ${marker.color}00`
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                        >
                          {/* Tooltip */}
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm text-gray-900 px-2 py-1 rounded text-xs font-semibold opacity-0 group-hover/marker:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                            {marker.label}
                          </div>
                        </motion.div>
                      </motion.div>
                    ))}

                    {/* Connecting lines animation */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <motion.path
                        d="M 30% 25% Q 50% 15% 75% 30%"
                        stroke="#00AFE6"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="5,5"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 0.6 }}
                        transition={{ duration: 2, delay: 1 }}
                      />
                    </svg>
                  </div>
                </div>

                {/* Stats Dashboard */}
                <div className="space-y-6">
                  <InteractiveStatsCounter 
                    stats={[
                      { value: 150, suffix: "+", label: "Healthcare Providers", gradient: "from-[#00AFE6] to-[#0088CC]" },
                      { value: 13, label: "Provinces & Territories", gradient: "from-[#00DD89] to-[#00BB77]" },
                      { value: 25, suffix: "+", label: "Major Cities", gradient: "from-purple-500 to-purple-700" },
                      { value: 500, suffix: "+", label: "Resources Available", gradient: "from-orange-500 to-orange-700" }
                    ]}
                  />

                  {/* CTA Section */}
                  <motion.div
                    className="pt-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
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
                        <span>Explore Healthcare Directory</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}