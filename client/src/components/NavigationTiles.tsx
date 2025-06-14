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
    <section className="py-24 bg-[#F8FAFB]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div 
          className="text-center mb-16 reveal-up"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="headline-lg mb-6">
            How Can We Help You?
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Choose your path to access resources, support, and information tailored to your needs.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {tiles.map((tile, index) => {
            const IconComponent = tile.icon;
            return (
              <motion.div
                key={tile.id}
                className="module-card cursor-pointer group"
                tabIndex={0}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div 
                  className={`w-16 h-16 ${tile.iconBg} rounded-3xl flex items-center justify-center mb-6 shadow-sm`}
                  whileHover={{ scale: 1.05, rotate: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  <IconComponent className="w-8 h-8 text-white" />
                </motion.div>
                
                <h3 className="headline-md mb-4">
                  {tile.title}
                </h3>
                
                <p className="body-md mb-8">
                  {tile.description}
                </p>
                
                <motion.div 
                  className="flex items-center text-[#00AFE6] font-medium"
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
