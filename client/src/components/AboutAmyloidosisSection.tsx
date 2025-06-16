import { motion } from 'framer-motion';

export default function AboutAmyloidosisSection() {
  const amyloidosisTypes = [
    {
      name: 'AL Amyloidosis',
      description: 'Most common form, affects heart, kidneys, liver, and nervous system',
      prevalence: '70% of cases'
    },
    {
      name: 'AA Amyloidosis', 
      description: 'Secondary to chronic inflammatory conditions',
      prevalence: '20% of cases'
    },
    {
      name: 'Hereditary',
      description: 'Genetic forms including TTR, fibrinogen, and lysozyme',
      prevalence: '5% of cases'
    },
    {
      name: 'Other Types',
      description: 'Including β2-microglobulin and localized forms',
      prevalence: '5% of cases'
    }
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl lg:text-4xl font-light text-white mb-6">
            Understanding Amyloidosis
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Amyloidosis is a group of rare diseases where abnormal protein deposits (amyloid) build up in organs and tissues, 
            potentially affecting their structure and function.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {amyloidosisTypes.map((type, index) => (
            <motion.div
              key={type.name}
              className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -4 }}
            >
              <h3 className="text-xl font-medium text-white mb-3">
                {type.name}
              </h3>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                {type.description}
              </p>
              <div className="text-[#00AFE6] text-sm font-medium">
                {type.prevalence}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="bg-gray-800 rounded-2xl p-8 lg:p-12 border border-gray-700"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-light text-white mb-6">
                Early Detection Saves Lives
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Amyloidosis is often misdiagnosed or diagnosed late because its symptoms mimic other conditions. 
                Early recognition and proper testing are crucial for better patient outcomes.
              </p>
              <p className="text-gray-300 leading-relaxed mb-8">
                Our directory connects patients with specialized centers and healthcare providers experienced 
                in diagnosing and treating amyloidosis across Canada.
              </p>
              <motion.button
                className="bg-[#00DD89] text-white px-8 py-3 rounded-full font-medium hover:bg-[#00BB77] transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Find a Specialist
              </motion.button>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-700 rounded-xl p-6">
                <div className="text-2xl font-light text-[#00AFE6] mb-2">2-3 years</div>
                <div className="text-white font-medium mb-2">Average time to diagnosis</div>
                <div className="text-gray-300 text-sm">Many patients see multiple doctors before receiving proper diagnosis</div>
              </div>
              <div className="bg-gray-700 rounded-xl p-6">
                <div className="text-2xl font-light text-[#00DD89] mb-2">3,000+</div>
                <div className="text-white font-medium mb-2">Canadians affected</div>
                <div className="text-gray-300 text-sm">Estimated number of people living with amyloidosis in Canada</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}