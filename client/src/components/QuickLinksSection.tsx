import { motion } from 'framer-motion';
import { FileText, Users, Heart, Microscope, BookOpen, Phone, Calendar, MapPin } from 'lucide-react';

export default function QuickLinksSection() {
  const quickLinks = [
    {
      id: 1,
      title: 'Patient Resources',
      description: 'Essential guides, treatment information, and support materials for patients and families.',
      icon: FileText,
      gradient: 'from-[#00AFE6] to-[#0088CC]',
      href: '#patient-resources'
    },
    {
      id: 2,
      title: 'Support Groups',
      description: 'Connect with other patients and families in local and virtual support communities.',
      icon: Users,
      gradient: 'from-[#00DD89] to-[#00BB77]',
      href: '#support-groups'
    },
    {
      id: 3,
      title: 'Clinical Trials',
      description: 'Current research opportunities and clinical trials available across Canada.',
      icon: Microscope,
      gradient: 'from-purple-500 to-purple-700',
      href: '#clinical-trials'
    },
    {
      id: 4,
      title: 'Healthcare Providers',
      description: 'Information and resources specifically designed for healthcare professionals.',
      icon: Heart,
      gradient: 'from-orange-500 to-orange-700',
      href: '#healthcare-providers'
    },
    {
      id: 5,
      title: 'Educational Materials',
      description: 'Comprehensive learning resources about amyloidosis diagnosis and treatment.',
      icon: BookOpen,
      gradient: 'from-green-500 to-green-700',
      href: '#educational-materials'
    },
    {
      id: 6,
      title: 'Contact Us',
      description: 'Get in touch with our team for support, questions, or more information.',
      icon: Phone,
      gradient: 'from-blue-500 to-blue-700',
      href: '#contact'
    },
    {
      id: 7,
      title: 'Upcoming Events',
      description: 'Webinars, conferences, and support meetings happening across the country.',
      icon: Calendar,
      gradient: 'from-red-500 to-red-700',
      href: '#events'
    },
    {
      id: 8,
      title: 'Find Care',
      description: 'Locate specialized amyloidosis care providers and facilities in your area.',
      icon: MapPin,
      gradient: 'from-teal-500 to-teal-700',
      href: '#find-care'
    }
  ];

  return (
    <section className="relative py-32 lg:py-40 gradient-bg-subtle overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-80 h-80 bg-gradient-to-br from-blue-500/4 to-purple-500/4 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-tr from-green-500/4 to-cyan-500/4 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/3 left-1/2 w-64 h-64 bg-gradient-to-r from-indigo-500/3 to-pink-500/3 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20"
        >
          <motion.div
            className="inline-flex items-center gap-2 glass-card rounded-full px-6 py-3 mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full"></div>
            <span className="text-gray-700 font-medium tracking-wide">Quick Access</span>
          </motion.div>

          <motion.h2 
            className="crawford-section-title text-gray-900 mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Quick Access
          </motion.h2>

          <motion.p 
            className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto crawford-body-text"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Everything you need to navigate your amyloidosis journey, from educational resources 
            to finding specialized care and connecting with support communities.
          </motion.p>
        </motion.div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {quickLinks.map((link, index) => {
            const IconComponent = link.icon;
            return (
              <motion.a
                key={link.id}
                href={link.href}
                className="glass-card rounded-3xl p-8 hover-lift group cursor-pointer overflow-hidden relative"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
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

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                    {link.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {link.description}
                  </p>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}