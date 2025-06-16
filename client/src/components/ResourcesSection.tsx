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
    <section id="resources" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
            Resources & Information
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
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
                className="bg-white rounded-2xl p-8 border border-gray-100"
                style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)' }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -4 }}
              >
                <div className="flex items-start space-x-4 mb-8">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: category.color }}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-gray-900 mb-3">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {category.resources.map((resource, resourceIndex) => (
                    <motion.div
                      key={resource.name}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 cursor-pointer group/item"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: (index * 0.1) + (resourceIndex * 0.05) }}
                      viewport={{ once: true, margin: "-50px" }}
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-[#00AFE6] rounded-full"></div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {resource.name}
                          </div>
                          <div className="text-sm text-gray-600">
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
                  className="w-full mt-6 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View All {category.title}
                </motion.button>
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