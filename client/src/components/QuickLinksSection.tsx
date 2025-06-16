import { motion } from 'framer-motion';
import { MapPin, Upload, Users, BookOpen, ArrowRight } from 'lucide-react';

export default function QuickLinksSection() {
  const quickLinks = [
    {
      id: 1,
      icon: MapPin,
      title: "Find Support in Your Region",
      description: "Connect with specialists, clinics, and support groups across Canada",
      href: "#support",
      gradient: "from-[#00AFE6] to-[#0088CC]"
    },
    {
      id: 2,
      icon: Upload,
      title: "Upload a Clinical Resource",
      description: "Share pathways, protocols, and resources with the medical community",
      href: "#upload",
      gradient: "from-[#00DD89] to-[#00BB77]"
    },
    {
      id: 3,
      icon: Users,
      title: "Join CAS",
      description: "Become part of our community and help advance amyloidosis care",
      href: "#join",
      gradient: "from-purple-500 to-purple-700"
    },
    {
      id: 4,
      icon: BookOpen,
      title: "Browse the Resources",
      description: "Access educational materials, research, and clinical guidelines",
      href: "#resources",
      gradient: "from-orange-500 to-orange-700"
    }
  ];

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
            <span className="text-gray-700 font-medium tracking-wide">Quick Access</span>
          </motion.div>

          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Get Started Today
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Choose from our key services and resources to find what you need quickly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {quickLinks.map((link, index) => {
            const IconComponent = link.icon;
            return (
              <motion.a
                key={link.id}
                href={link.href}
                className="group relative bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100/50 cursor-pointer overflow-hidden transition-all duration-500 hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] hover:-translate-y-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${link.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Top accent line */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${link.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-t-3xl`}></div>
                
                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div 
                    className={`w-20 h-20 bg-gradient-to-br ${link.gradient} rounded-3xl flex items-center justify-center mb-8 shadow-xl group-hover:shadow-2xl transition-all duration-300`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <IconComponent className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300">
                    {link.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-6 group-hover:text-gray-700 transition-colors duration-300">
                    {link.description}
                  </p>
                  
                  <motion.div 
                    className={`flex items-center text-transparent bg-clip-text bg-gradient-to-r ${link.gradient} font-semibold group-hover:translate-x-2 transition-transform duration-300`}
                    whileHover={{ x: 8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-5 h-5 ml-2 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" />
                  </motion.div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}