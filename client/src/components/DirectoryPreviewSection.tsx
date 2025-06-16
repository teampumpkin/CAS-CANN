import { motion } from 'framer-motion';
import { Search, Upload, FileText, Users, Heart } from 'lucide-react';
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
        {/* Redesigned Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00AFE6]/20 to-[#00DD89]/20 text-white px-6 py-3 rounded-full text-sm font-medium mb-8 border border-[#00AFE6]/30">
            <div className="w-2 h-2 bg-[#00AFE6] rounded-full animate-pulse"></div>
            <span>Comprehensive Resources</span>
          </div>

          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight font-rosarivo">
            Healthcare{" "}
            <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
              Directory
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Access specialized care, clinical resources, and support networks across Canada
          </p>
        </motion.div>

        {/* Feature Categories - Hero Layout */}
        <div className="grid lg:grid-cols-3 gap-12 mb-20">
          {/* Primary Feature - Large Card */}
          <motion.div
            className="lg:col-span-2 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/20"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-start gap-8">
              <div className="w-20 h-20 bg-gradient-to-br from-[#00AFE6] to-[#0088CC] rounded-2xl flex items-center justify-center shadow-xl">
                <Search className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-white mb-4 font-cardo">
                  Searchable Healthcare Directory
                </h3>
                <p className="text-white/80 text-lg leading-relaxed mb-6">
                  Find specialized amyloidosis treatment centers, experienced physicians, and clinical experts across all Canadian provinces and territories.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-white/70">
                    <div className="w-2 h-2 bg-[#00AFE6] rounded-full"></div>
                    <span>150+ Healthcare Providers</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/70">
                    <div className="w-2 h-2 bg-[#00DD89] rounded-full"></div>
                    <span>All 13 Provinces & Territories</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/70">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Specialized Treatment Centers</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/70">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Expert Clinical Teams</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Secondary Features - Stacked Cards */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Clinical Resources */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/15">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00DD89] to-[#00BB77] rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white font-rosarivo">Clinical Resources</h4>
              </div>
              <p className="text-white/70 leading-relaxed">
                Access medical protocols, treatment guidelines, and clinical pathways developed by leading specialists.
              </p>
            </div>

            {/* Patient Support */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/15">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white font-cardo">Patient Resources</h4>
              </div>
              <p className="text-white/70 leading-relaxed">
                Evidence-based information, support materials, and educational content for patients and families.
              </p>
            </div>

            {/* Community Support */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/15">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white font-cardo">Community Networks</h4>
              </div>
              <p className="text-white/70 leading-relaxed">
                Connect with support groups, advocacy organizations, and community programs nationwide.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Canada Network Stats - Clean Layout */}
        <motion.div
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Map Visualization */}
            <div className="relative">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-[#00AFE6]/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-4 border border-[#00AFE6]/30">
                  <div className="w-2 h-2 bg-[#00AFE6] rounded-full animate-pulse" />
                  <span>National Network</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2 font-cardo">
                  Canada-Wide Coverage
                </h3>
                <p className="text-white/70">Connecting healthcare across the nation</p>
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

            {/* Statistics Display */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6 font-cardo">Network Reach</h3>
                <InteractiveStatsCounter 
                  stats={[
                    { value: 150, suffix: "+", label: "Healthcare Providers", gradient: "from-[#00AFE6] to-[#0088CC]" },
                    { value: 13, label: "Provinces & Territories", gradient: "from-[#00DD89] to-[#00BB77]" },
                    { value: 25, suffix: "+", label: "Major Cities", gradient: "from-purple-500 to-purple-700" },
                    { value: 500, suffix: "+", label: "Resources Available", gradient: "from-orange-500 to-orange-700" }
                  ]}
                />
              </div>
              
              {/* Call to Action */}
              <div className="pt-6">
                <button className="w-full bg-gradient-to-r from-[#00AFE6] to-[#0088CC] text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-center gap-3">
                    <span>Browse Directory</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}