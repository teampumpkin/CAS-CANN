import { motion } from 'framer-motion';
import { ArrowRight, Users, BookOpen, Heart, Search, Calendar, Phone } from 'lucide-react';

export default function QuickLinksSection() {
  const quickLinks = [
    {
      icon: Search,
      title: 'Find Specialists',
      description: 'Connect with amyloidosis experts near you',
      href: '#specialists',
      gradient: 'from-[#00AFE6] to-[#0088CC]',
      bgColor: 'from-blue-50 to-indigo-50'
    },
    {
      icon: BookOpen,
      title: 'Patient Resources',
      description: 'Educational materials and treatment guides',
      href: '#resources',
      gradient: 'from-[#00DD89] to-[#00BB77]',
      bgColor: 'from-green-50 to-emerald-50'
    },
    {
      icon: Users,
      title: 'Support Groups',
      description: 'Connect with patients and families',
      href: '#support',
      gradient: 'from-purple-500 to-purple-700',
      bgColor: 'from-purple-50 to-indigo-50'
    },
    {
      icon: Heart,
      title: 'Get Involved',
      description: 'Volunteer, donate, or advocate with us',
      href: '#get-involved',
      gradient: 'from-pink-500 to-rose-600',
      bgColor: 'from-pink-50 to-rose-50'
    },
    {
      icon: Calendar,
      title: 'Events',
      description: 'Upcoming conferences and webinars',
      href: '#events',
      gradient: 'from-orange-500 to-amber-600',
      bgColor: 'from-orange-50 to-amber-50'
    },
    {
      icon: Phone,
      title: 'Contact Us',
      description: 'Get in touch with our team',
      href: '#contact',
      gradient: 'from-slate-600 to-slate-800',
      bgColor: 'from-slate-50 to-gray-50'
    }
  ];

  return (
    <section className="relative py-32 lg:py-40 bg-gradient-to-br from-gray-50 via-white to-gray-50/50 overflow-hidden">
      {/* Background decorative elements matching amyloidosis section style */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-[#00AFE6]/8 to-[#00DD89]/8 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-[#00DD89]/8 to-[#00AFE6]/8 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-full px-6 py-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full"></div>
            <span className="text-gray-700 font-medium tracking-wide">Quick Access</span>
          </motion.div>

          <h2 className="crawford-section-title text-gray-900 mb-8">
            Essential Resources
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Quick access to the most important tools and information for patients, families, and healthcare professionals.
          </p>
        </motion.div>

        {/* Links Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quickLinks.map((link, index) => (
            <motion.a
              key={link.title}
              href={link.href}
              className="group relative block"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/30 hover:border-gray-200/50 transition-all duration-500 hover:bg-white/90 overflow-hidden shadow-lg">
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#00AFE6]/2 via-transparent to-[#00DD89]/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${link.gradient} rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <link.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors duration-300 font-cardo">
                    {link.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-6 group-hover:text-gray-800 transition-colors duration-300">
                    {link.description}
                  </p>
                  
                  {/* Arrow */}
                  <div className="flex items-center justify-between">
                    <div className={`text-transparent bg-clip-text bg-gradient-to-r ${link.gradient} text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                      Learn More
                    </div>
                    <div className={`w-10 h-10 bg-gradient-to-br ${link.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                      <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform duration-300" />
                    </div>
                  </div>
                </div>

                {/* Hover effect line */}
                <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${link.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-3xl`} />
              </div>
            </motion.a>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-gray-600 mb-6">
            Need help finding what you're looking for?
          </p>
          <motion.button
            className="group inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl border border-gray-200 hover:border-gray-300 transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Contact Support</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}