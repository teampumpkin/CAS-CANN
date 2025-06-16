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
    <section className="relative py-32 lg:py-40 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
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
            <span className="text-white/90 font-medium tracking-wide">Medical Information</span>
          </motion.div>

          <h2 className="crawford-section-title text-white mb-8">
            What is Amyloidosis?
          </h2>
          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            Amyloidosis is a rare disease with life-altering consequences—but early detection can dramatically improve outcomes. The Canadian Amyloidosis Society is building a trusted national hub for clinicians, researchers, and families seeking answers.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {amyloidosisTypes.map((type, index) => (
            <motion.div
              key={type.name}
              className="group relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:bg-white/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -8 }}
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`} />
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-12 h-12 bg-gradient-to-br ${type.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-white/90 transition-colors duration-300">
                  {type.name}
                </h3>
                <p className="text-white/70 text-sm mb-6 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                  {type.description}
                </p>
                <div className={`text-transparent bg-clip-text bg-gradient-to-r ${type.gradient} text-sm font-bold`}>
                  {type.prevalence}
                </div>
              </div>

              {/* Hover effect lines */}
              <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${type.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-3xl`} />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-12 lg:p-16 border border-white/10 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#00AFE6]/5 via-transparent to-[#00DD89]/5"></div>
          
          <div className="relative grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="crawford-section-title text-white mb-8 text-left">
                Early Detection Saves Lives
              </h3>
              <div className="space-y-6 mb-10">
                <p className="text-xl text-white/80 leading-relaxed">
                  Amyloidosis is often misdiagnosed or diagnosed late because its symptoms mimic other conditions. 
                  Early recognition and proper testing are crucial for better patient outcomes.
                </p>
                <p className="text-lg text-white/70 leading-relaxed">
                  Our directory connects patients with specialized centers and healthcare providers experienced 
                  in diagnosing and treating amyloidosis across Canada.
                </p>
              </div>
              <motion.button
                className="group relative bg-gradient-to-r from-[#00DD89] to-[#00BB77] text-white px-10 py-4 rounded-2xl font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative flex items-center gap-2">
                  Find a Specialist
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </motion.button>
            </div>
            <div className="space-y-8">
              <motion.div 
                className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00AFE6] to-[#0088CC] mb-3">2-3 years</div>
                <div className="text-white font-bold text-lg mb-2">Average time to diagnosis</div>
                <div className="text-white/70">Many patients see multiple doctors before receiving proper diagnosis</div>
              </motion.div>
              <motion.div 
                className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00DD89] to-[#00BB77] mb-3">3,000+</div>
                <div className="text-white font-bold text-lg mb-2">Canadians affected</div>
                <div className="text-white/70">Estimated number of people living with amyloidosis in Canada</div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}