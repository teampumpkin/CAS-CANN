import { motion } from 'framer-motion';
import { BookOpen, Users, FileText, Download, ExternalLink } from 'lucide-react';

const resourceCategories = [
  {
    title: 'Patient Resources',
    description: 'Educational materials and support guides for patients and families',
    icon: Users,
    color: '#00AFE6',
    resources: [
      { name: 'Understanding Your Diagnosis', type: 'PDF Guide', size: '2.3 MB' },
      { name: 'Living with Amyloidosis', type: 'Patient Handbook', size: '4.1 MB' },
      { name: 'Treatment Options Overview', type: 'Info Sheet', size: '1.8 MB' },
      { name: 'Support Group Directory', type: 'Online Directory', size: 'Web' }
    ]
  },
  {
    title: 'Clinical Guidelines',
    description: 'Evidence-based resources for healthcare professionals',
    icon: FileText,
    color: '#00DD89',
    resources: [
      { name: 'Diagnostic Criteria 2024', type: 'Clinical Guide', size: '5.2 MB' },
      { name: 'Treatment Protocols', type: 'Protocol Set', size: '3.7 MB' },
      { name: 'Lab Testing Guidelines', type: 'Reference Guide', size: '2.9 MB' },
      { name: 'Specialist Referral Criteria', type: 'Quick Reference', size: '1.5 MB' }
    ]
  }
];

export default function ResourcesSection() {
  return (
    <section id="resources" className="relative py-32 lg:py-40 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-[#00AFE6]/10 to-[#00DD89]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-[#00DD89]/10 to-[#00AFE6]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full"></div>
            <span className="text-white/90 font-medium tracking-wide">Educational Resources</span>
          </motion.div>

          <h2 className="crawford-section-title text-white mb-8">
            Resources & Information
          </h2>
          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            Access comprehensive resources, clinical guidelines, research publications, and educational materials 
            to support patients, families, and healthcare professionals.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {resourceCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <motion.div
                key={category.title}
                className="group relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:bg-white/10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -8 }}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${index === 0 ? 'from-[#00AFE6]/5 to-[#0088CC]/5' : 'from-[#00DD89]/5 to-[#00BB77]/5'} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-start space-x-4 mb-8">
                    <div className={`w-12 h-12 bg-gradient-to-br ${index === 0 ? 'from-[#00AFE6] to-[#0088CC]' : 'from-[#00DD89] to-[#00BB77]'} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-4 group-hover:text-white/90 transition-colors duration-300 font-cardo">
                        {category.title}
                      </h3>
                      <p className="text-white/70 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {category.resources.map((resource, resourceIndex) => (
                      <motion.div
                        key={resource.name}
                        className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-colors duration-200 cursor-pointer group/item border border-white/20"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: (index * 0.1) + (resourceIndex * 0.05) }}
                        viewport={{ once: true, margin: "-50px" }}
                        whileHover={{ x: 5 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 bg-gradient-to-r ${index === 0 ? 'from-[#00AFE6] to-[#0088CC]' : 'from-[#00DD89] to-[#00BB77]'} rounded-full`}></div>
                          <div>
                            <div className="font-medium text-white">
                              {resource.name}
                            </div>
                            <div className="text-sm text-white/70">
                              {resource.type} • {resource.size}
                            </div>
                          </div>
                        </div>
                      <div className="opacity-0 group-hover/item:opacity-100 transition-opacity duration-200">
                        {resource.size === 'Web' ? (
                          <ExternalLink className="w-4 h-4 text-[#00AFE6]" />
                        ) : (
                          <Download className="w-4 h-4 text-[#00AFE6]" />
                        )}
                      </div>
                    </motion.div>
                    ))}
                  </div>

                  <motion.button
                    className="w-full mt-6 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View All {category.title}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          className="bg-[#f8fafc] rounded-2xl p-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h3 className="text-2xl font-light text-gray-900 mb-4">
            Can't Find What You're Looking For?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Our resource library is constantly growing. If you need specific information or materials, 
            don't hesitate to reach out to our team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              className="bg-[#00AFE6] text-white px-8 py-3 rounded-full font-medium hover:bg-[#0099CC] transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Request Resources
            </motion.button>
            <motion.button
              className="bg-white text-gray-700 px-8 py-3 rounded-full font-medium border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Submit Content
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}