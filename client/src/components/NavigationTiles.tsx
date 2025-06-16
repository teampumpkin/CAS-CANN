import { motion } from 'framer-motion';
import { User, Stethoscope, Users, ArrowRight } from 'lucide-react';

const tiles = [
  {
    id: 'patient',
    title: "I'm a Patient",
    description: "Access resources, support groups, and educational materials designed specifically for patients living with amyloidosis.",
    icon: User,
    iconBg: "bg-[#00AFE6]",
    ctaText: "Get Started"
  },
  {
    id: 'clinician',
    title: "I'm a Clinician", 
    description: "Find clinical guidelines, research updates, and professional resources to support your practice and patient care.",
    icon: Stethoscope,
    iconBg: "bg-[#00DD89]",
    ctaText: "Access Resources"
  },
  {
    id: 'caregiver',
    title: "I'm a Caregiver",
    description: "Connect with support networks, educational resources, and tools designed to help you support your loved one.",
    icon: Users,
    iconBg: "bg-gray-500",
    ctaText: "Find Support"
  }
];

export default function NavigationTiles() {
  return (
    <section className="relative py-32 lg:py-40 bg-gradient-to-br from-white via-gray-50/50 to-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-[#00AFE6]/5 to-[#00DD89]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-[#00DD89]/5 to-[#00AFE6]/5 rounded-full blur-3xl"></div>
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
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 border border-[#00AFE6]/20 rounded-full px-6 py-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full"></div>
            <span className="text-gray-700 font-medium tracking-wide">Choose Your Path</span>
          </motion.div>

          <h2 className="crawford-section-title text-gray-900 mb-8">
            How Can We Help You?
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Choose your path to access resources, support, and information tailored to your needs.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {tiles.map((tile, index) => {
            const IconComponent = tile.icon;
            return (
              <motion.div
                key={tile.id}
                className="group relative bg-white rounded-3xl p-8 lg:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100/50 cursor-pointer overflow-hidden transition-all duration-500 hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] hover:-translate-y-2"
                tabIndex={0}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#00AFE6]/5 to-[#00DD89]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-t-3xl"></div>
                
                <div className="relative z-10">
                  <motion.div 
                    className={`w-20 h-20 ${tile.iconBg} rounded-3xl flex items-center justify-center mb-8 shadow-xl group-hover:shadow-2xl transition-all duration-300`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <IconComponent className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 group-hover:text-gray-800 transition-colors duration-300">
                    {tile.title}
                  </h3>
                  
                  <p className="text-gray-600 text-lg leading-relaxed mb-8 group-hover:text-gray-700 transition-colors duration-300">
                    {tile.description}
                  </p>
                  
                  <motion.div 
                    className="flex items-center text-[#00AFE6] font-semibold text-lg group-hover:text-[#0088CC] transition-colors duration-300"
                    whileHover={{ x: 8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span>{tile.ctaText}</span>
                    <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
