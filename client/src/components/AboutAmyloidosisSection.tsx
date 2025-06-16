import { motion } from 'framer-motion';

export default function AboutAmyloidosisSection() {
  const amyloidosisTypes = [
    {
      name: 'AL Amyloidosis',
      description: 'Most common form, affects heart, kidneys, liver, and nervous system',
      prevalence: '70% of cases',
      gradient: 'from-[#00AFE6] to-[#0088CC]'
    },
    {
      name: 'AA Amyloidosis', 
      description: 'Secondary to chronic inflammatory conditions',
      prevalence: '20% of cases',
      gradient: 'from-[#00DD89] to-[#00BB77]'
    },
    {
      name: 'Hereditary',
      description: 'Genetic forms including TTR, fibrinogen, and lysozyme',
      prevalence: '5% of cases',
      gradient: 'from-purple-500 to-purple-700'
    },
    {
      name: 'Other Types',
      description: 'Including β2-microglobulin and localized forms',
      prevalence: '5% of cases',
      gradient: 'from-orange-500 to-orange-700'
    }
  ];

  return (
    <section className="relative py-32 lg:py-40 gradient-bg-light overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-500/6 to-purple-500/6 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-green-500/6 to-cyan-500/6 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/4 to-pink-500/4 rounded-full blur-3xl animate-float" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            className="inline-flex items-center gap-2 glass-card rounded-full px-6 py-3 mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full"></div>
            <span className="text-gray-700 font-medium tracking-wide">Medical Information</span>
          </motion.div>

          <motion.h2 
            className="crawford-section-title text-gray-900 mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            About Amyloidosis
          </motion.h2>

          <motion.p 
            className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto crawford-body-text"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Amyloidosis is a rare disease caused by deposits of abnormal proteins called amyloids in organs and tissues. 
            Early diagnosis and proper treatment are crucial for patient outcomes.
          </motion.p>
        </motion.div>

        {/* Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {amyloidosisTypes.map((type, index) => (
            <motion.div
              key={type.name}
              className="glass-card rounded-3xl p-8 hover-lift group"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="relative">
                {/* Gradient accent */}
                <div className={`w-full h-1 bg-gradient-to-r ${type.gradient} rounded-full mb-6`}></div>
                
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{type.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${type.gradient}`}>
                    {type.prevalence}
                  </span>
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-6">{type.description}</p>
                
                <motion.a
                  href="#learn-more"
                  className="inline-flex items-center gap-2 text-[#00AFE6] hover:text-[#0088CC] font-semibold text-sm transition-colors"
                  whileHover={{ x: 4 }}
                >
                  Learn More
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}