import { motion } from 'framer-motion';
import { User, Stethoscope, Users, ArrowRight } from 'lucide-react';

const tiles = [
  {
    id: 'patient',
    title: "I'm a Patient",
    description: "Access resources, support groups, and educational materials designed specifically for patients living with amyloidosis.",
    icon: User,
    gradient: "from-[#E6F7FF] to-white",
    iconBg: "bg-[#00AFE6]",
    textColor: "text-[#00AFE6]",
    ctaText: "Get Started"
  },
  {
    id: 'clinician',
    title: "I'm a Clinician",
    description: "Find clinical guidelines, research updates, and professional resources to support your practice and patient care.",
    icon: Stethoscope,
    gradient: "from-[#E6FFF4] to-white",
    iconBg: "bg-[#00DD89]",
    textColor: "text-[#00DD89]",
    ctaText: "Access Resources"
  },
  {
    id: 'caregiver',
    title: "I'm a Caregiver",
    description: "Connect with support networks, educational resources, and tools designed to help you support your loved one.",
    icon: Users,
    gradient: "from-purple-100 to-white",
    iconBg: "bg-purple-500",
    textColor: "text-purple-500",
    ctaText: "Find Support"
  }
];

export default function NavigationTiles() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16 section-reveal"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How Can We Help You?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your path to access resources, support, and information tailored to your needs.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {tiles.map((tile, index) => {
            const IconComponent = tile.icon;
            return (
              <motion.div
                key={tile.id}
                className={`card-hover bg-gradient-to-br ${tile.gradient} p-8 rounded-2xl shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00AFE6] focus:ring-offset-2`}
                tabIndex={0}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div 
                  className={`w-16 h-16 ${tile.iconBg} rounded-xl flex items-center justify-center mb-6`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <IconComponent className="w-8 h-8 text-white" />
                </motion.div>
                
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {tile.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {tile.description}
                </p>
                
                <motion.div 
                  className={`flex items-center ${tile.textColor} font-medium`}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <span>{tile.ctaText}</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
