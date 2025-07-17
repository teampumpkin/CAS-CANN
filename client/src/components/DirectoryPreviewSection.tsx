import { motion } from 'framer-motion';
import { Search, FileText, Heart, Users, MapPin, Building2, Phone, Mail } from 'lucide-react';
import canadaMapPath from '@assets/Canada Map_1750069387234.png';

export default function DirectoryPreviewSection() {
  const directoryFeatures = [
    {
      icon: Building2,
      title: "Treatment Centers",
      description: "Specialized amyloidosis treatment facilities across Canada",
      gradient: "from-[#00AFE6] to-[#0088CC]"
    },
    {
      icon: Heart,
      title: "Clinical Experts",
      description: "Leading physicians and healthcare professionals",
      gradient: "from-[#00DD89] to-[#00BB77]"
    },
    {
      icon: Users,
      title: "Support Networks",
      description: "Patient advocacy groups and community resources",
      gradient: "from-purple-500 to-purple-700"
    },
    {
      icon: FileText,
      title: "Resources Library",
      description: "Medical protocols and educational materials",
      gradient: "from-orange-500 to-orange-700"
    }
  ];

  const quickStats = [
    { number: "1.2K+", label: "Active Patients", gradient: "from-[#00AFE6] to-[#0088CC]" },
    { number: "45+", label: "Research Studies", gradient: "from-[#00DD89] to-[#00BB77]" },
    { number: "8", label: "Clinical Trials", gradient: "from-purple-500 to-purple-700" }
  ];

  return (
    <section className="py-16 bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#00AFE6]/10 rounded-full blur-3xl -translate-x-48 -translate-y-48" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00DD89]/10 rounded-full blur-3xl translate-x-48 translate-y-48" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-[#00AFE6]/20 text-gray-800 dark:text-white px-4 py-2 rounded-full text-sm font-medium mb-6 border border-[#00AFE6]/30">
            <MapPin className="w-4 h-4" />
            <span>Healthcare Directory</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 font-rosarivo">
            Find Specialized Care <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">Across Canada</span>
          </h2>
          <p className="text-xl text-gray-700 dark:text-white/70 max-w-3xl mx-auto leading-relaxed">
            Access specialized care, clinical resources, and support networks across Canada
          </p>
        </motion.div>

        {/* Canada Network Stats - Moved to Top */}
        <motion.div
          className="bg-gradient-to-br from-white/90 to-white/80 dark:from-white/10 dark:to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 dark:border-white/20 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Map Visualization */}
            <div className="relative">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-[#00AFE6]/20 text-gray-800 dark:text-white px-4 py-2 rounded-full text-sm font-medium mb-4 border border-[#00AFE6]/30">
                  <div className="w-2 h-2 bg-[#00AFE6] rounded-full animate-pulse" />
                  <span>National Network</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-rosarivo">
                  Canada-Wide Coverage
                </h3>
                <p className="text-gray-700 dark:text-white/70">Connecting healthcare across the nation</p>
              </div>
              
              <div className="relative w-full max-w-xl mx-auto">
                <img 
                  src={canadaMapPath}
                  alt="Canada Map showing healthcare network coverage"
                  className="w-full h-auto rounded-xl shadow-xl border border-white/10"
                />
                
                {/* Network points with subtle animation */}
                <motion.div
                  className="absolute top-1/4 left-1/3 w-3 h-3 bg-[#00AFE6] rounded-full shadow-lg"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute top-1/2 right-1/4 w-3 h-3 bg-[#00DD89] rounded-full shadow-lg"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                />
                <motion.div
                  className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-purple-500 rounded-full shadow-lg"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.3 }}
                />
              </div>
            </div>

            {/* Statistics Display - Fixed Grid Layout */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 font-rosarivo">Network Reach</h3>
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    className="text-center p-6 bg-white/90 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 hover:bg-white/95 dark:hover:bg-white/10 transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-4xl font-bold bg-gradient-to-r from-[#00AFE6] to-[#0088CC] bg-clip-text text-transparent mb-2">
                      150+
                    </div>
                    <div className="text-gray-700 dark:text-white/70 text-sm font-medium">Healthcare Providers</div>
                  </motion.div>
                  
                  <motion.div
                    className="text-center p-6 bg-white/90 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 hover:bg-white/95 dark:hover:bg-white/10 transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-4xl font-bold bg-gradient-to-r from-[#00DD89] to-[#00BB77] bg-clip-text text-transparent mb-2">
                      13
                    </div>
                    <div className="text-gray-700 dark:text-white/70 text-sm font-medium">Provinces & Territories</div>
                  </motion.div>
                  
                  <motion.div
                    className="text-center p-6 bg-white/90 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 hover:bg-white/95 dark:hover:bg-white/10 transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent mb-2">
                      25+
                    </div>
                    <div className="text-gray-700 dark:text-white/70 text-sm font-medium">Major Cities</div>
                  </motion.div>
                  
                  <motion.div
                    className="text-center p-6 bg-white/90 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 hover:bg-white/95 dark:hover:bg-white/10 transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent mb-2">
                      500+
                    </div>
                    <div className="text-gray-700 dark:text-white/70 text-sm font-medium">Resources Available</div>
                  </motion.div>
                </div>
              </div>
              
              {/* Call to Action */}
              <div className="pt-6">
                <motion.button 
                  className="w-full bg-gradient-to-r from-[#00AFE6] to-[#0088CC] text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center gap-3">
                    <span>Browse Directory</span>
                    <Search className="w-5 h-5" />
                  </div>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Directory Features Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Directory Content */}
          <motion.div
            className="lg:col-span-2 bg-gradient-to-br from-white/90 to-white/80 dark:from-white/15 dark:to-white/5 backdrop-blur-xl rounded-3xl p-10 border border-gray-200 dark:border-white/20"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex items-start gap-8 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-[#00AFE6] to-[#0088CC] rounded-2xl flex items-center justify-center shadow-xl">
                <Search className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 font-rosarivo">
                  Searchable Healthcare Directory
                </h3>
                <p className="text-gray-700 dark:text-white/80 text-lg leading-relaxed mb-6">
                  Find specialized amyloidosis treatment centers, experienced physicians, and clinical experts across all Canadian provinces and territories.
                </p>
              </div>
            </div>

            {/* Directory Features Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {directoryFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="group bg-white/90 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/30 transition-all duration-300 hover:bg-white/95 dark:hover:bg-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">{feature.title}</h4>
                      <p className="text-gray-700 dark:text-white/70 text-sm">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              className="w-full bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Explore Full Directory
            </motion.button>
          </motion.div>

          {/* Quick Stats Sidebar */}
          <motion.div
            className="bg-gradient-to-br from-white/90 to-white/80 dark:from-white/10 dark:to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 dark:border-white/20"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-[#00AFE6]/20 text-gray-800 dark:text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                <div className="w-2 h-2 bg-[#00AFE6] rounded-full animate-pulse" />
                <span>Live Stats</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white font-rosarivo">Directory Insights</h3>
            </div>

            <div className="space-y-6">
              {quickStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center p-4 bg-white/90 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 hover:bg-white/95 dark:hover:bg-white/10 transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-700 dark:text-white/70 text-sm font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
              <h4 className="text-gray-900 dark:text-white font-semibold mb-4">Need Help Finding Care?</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700 dark:text-white/70 text-sm">
                  <Phone className="w-4 h-4" />
                  <span>1-800-AMYLOID</span>
                </div>
                <div className="flex items-center gap-3 text-white/70 text-sm">
                  <Mail className="w-4 h-4" />
                  <span>directory@cas.ca</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}