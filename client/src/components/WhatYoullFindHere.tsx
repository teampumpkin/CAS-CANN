import { motion } from 'framer-motion';
import { Search, Users, FileText, MapPin, Filter, Star } from 'lucide-react';

const features = [
  {
    id: 'directory',
    icon: MapPin,
    title: 'Filterable Clinic Directory',
    description: 'Search and filter specialized amyloidosis treatment centers across Canada by location, services, and expertise.',
    details: [
      'Real-time availability updates',
      'Specialist credentials and expertise',
      'Patient reviews and ratings',
      'Insurance and referral information'
    ],
    color: 'from-[#00AFE6] to-[#00DD89]',
    bgColor: 'from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20',
    borderColor: 'border-[#00AFE6]/20 dark:border-[#00AFE6]/30',
    textColor: 'text-gray-900 dark:text-white'
  },
  {
    id: 'tools',
    icon: Users,
    title: 'Peer-Submitted Tools',
    description: 'Access practical resources and tools shared by patients, caregivers, and healthcare professionals.',
    details: [
      'Patient experience guides',
      'Caregiver support resources',
      'Clinical assessment tools',
      'Community-validated content'
    ],
    color: 'from-[#00DD89] to-[#00AFE6]',
    bgColor: 'from-[#00DD89]/15 to-[#00AFE6]/15 dark:from-[#00DD89]/20 to-[#00AFE6]/20',
    borderColor: 'border-[#00DD89]/20 dark:border-[#00DD89]/30',
    textColor: 'text-gray-900 dark:text-white'
  },
  {
    id: 'evidence',
    icon: FileText,
    title: 'Evidence Summaries',
    description: 'Curated clinical evidence and research summaries to inform treatment decisions and patient care.',
    details: [
      'Latest research findings',
      'Treatment efficacy data',
      'Clinical practice guidelines',
      'Peer-reviewed content'
    ],
    color: 'from-[#00AFE6] to-[#00DD89]',
    bgColor: 'from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20',
    borderColor: 'border-[#00AFE6]/20 dark:border-[#00AFE6]/30',
    textColor: 'text-gray-900 dark:text-white'
  }
];

export default function WhatYoullFindHere() {

  return (
    <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#00AFE6]/10 rounded-full blur-3xl -translate-x-48 -translate-y-48" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00DD89]/10 rounded-full blur-3xl translate-x-48 translate-y-48" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 backdrop-blur-xl rounded-full px-6 py-3 border border-[#00AFE6]/20 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Search className="w-5 h-5 text-[#00AFE6]" />
            <span className="text-sm font-medium text-gray-700 dark:text-white/90">Platform Overview</span>
          </motion.div>
          
          <h2 className="crawford-section-title mb-6">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
              What You'll
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
              Find Here
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed max-w-3xl mx-auto">
            Discover comprehensive resources, tools, and connections designed to support your amyloidosis journey.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              className={`backdrop-blur-xl rounded-2xl p-8 border transition-all duration-300 group hover:shadow-2xl cursor-pointer bg-gradient-to-br ${feature.bgColor} ${feature.borderColor} hover:scale-105`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}

            >
              {/* Icon */}
              <div className="flex items-center justify-between mb-6">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                </div>
              </div>

              {/* Content */}
              <h3 className={`text-2xl font-bold mb-4 font-rosarivo ${feature.textColor}`}>
                {feature.title}
              </h3>
              
              <p className="leading-relaxed mb-6 text-gray-700 dark:text-gray-300">
                {feature.description}
              </p>

              {/* Expandable Details */}
              <motion.div
                className="overflow-hidden"
                initial={{ height: 'auto' }}
                animate={{ height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <div className="pt-4 border-t border-gray-200/50 dark:border-white/10">
                  <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Key Features:</h4>
                  <ul className="space-y-2">
                    {feature.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                        <Filter className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* Action Button */}
              <motion.div
                className="mt-6"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <button className={`w-full bg-gradient-to-r ${feature.color} text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2`}>
                  Explore {feature.title}
                  <Search className="w-4 h-4" />
                </button>
              </motion.div>

              {/* Hover Effects */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#00AFE6]/0 to-[#00DD89]/0 group-hover:from-[#00AFE6]/5 group-hover:to-[#00DD89]/5 transition-all duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 backdrop-blur-xl rounded-2xl p-8 border border-[#00AFE6]/20">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white font-rosarivo">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 dark:text-white/70 mb-6 max-w-2xl mx-auto">
              Join thousands of patients, caregivers, and healthcare professionals using our platform to improve amyloidosis care across Canada.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/join" 
                className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 inline-flex items-center gap-2"
              >
                Join Our Community
                <Users className="w-5 h-5" />
              </a>
              <a 
                href="/directory" 
                className="bg-gradient-to-r from-[#00DD89] to-[#00AFE6] text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 inline-flex items-center gap-2"
              >
                Browse Directory
                <MapPin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}