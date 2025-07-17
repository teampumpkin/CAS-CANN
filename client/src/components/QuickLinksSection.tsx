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
    <section className="relative py-16 lg:py-24 bg-gradient-to-br from-[#00AFE6]/5 via-white to-[#00DD89]/5 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Background decorative elements matching amyloidosis section style */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-[#00AFE6]/12 to-[#00DD89]/12 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-[#00DD89]/12 to-[#00AFE6]/12 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-gray-900/10 dark:bg-white/10 backdrop-blur-sm border border-gray-900/20 dark:border-white/20 rounded-full px-6 py-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full"></div>
            <span className="text-gray-900 dark:text-white/90 font-medium tracking-wide">Quick Access</span>
          </motion.div>

          <h2 className="crawford-section-title text-gray-900 dark:text-white mb-8">
            Essential Resources
          </h2>
          <p className="text-xl text-gray-700 dark:text-white/80 max-w-4xl mx-auto leading-relaxed">
            Quick access to the most important tools and information for patients, families, and healthcare professionals.
          </p>
        </motion.div>

        {/* Links Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickLinks.map((link, index) => (
            <motion.a
              key={link.title}
              href={link.href}
              className="group relative block"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -12, scale: 1.03 }}
            >
              <div className="group relative h-full overflow-hidden">
                {/* Main Card Container */}
                <div className="relative h-full bg-gradient-to-br from-white/80 via-white/60 to-white/40 dark:from-white/8 dark:via-white/4 dark:to-white/2 backdrop-blur-2xl rounded-3xl border border-gray-200 dark:border-white/20 group-hover:border-gray-300 dark:group-hover:border-white/40 transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-[#00AFE6]/25 overflow-hidden">
                  
                  {/* Dynamic Background Pattern */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gray-900/10 dark:from-white/10 to-transparent rounded-full blur-xl" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-gray-900/5 dark:from-white/5 to-transparent rounded-full blur-lg" />
                  </div>
                  
                  {/* Animated Border Glow */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${link.gradient} rounded-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-700 blur-sm`} />
                  
                  {/* Floating Icon Background */}
                  <div className="absolute top-6 right-6 w-20 h-20 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                    <link.icon className="w-full h-full text-gray-900 dark:text-white" />
                  </div>

                  {/* Content Container */}
                  <div className="relative z-10 p-8 h-full flex flex-col">
                    
                    {/* Header Section */}
                    <div className="flex items-start justify-between mb-6">
                      {/* Main Icon */}
                      <div className={`relative w-14 h-14 bg-gradient-to-br ${link.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500`}>
                        <link.icon className="w-7 h-7 text-white" />
                        {/* Inner glow */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${link.gradient} rounded-2xl opacity-0 group-hover:opacity-60 blur-md transition-opacity duration-500`} />
                      </div>
                      
                      {/* Status Indicator */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-xs text-gray-700 dark:text-white/60 font-medium">Available</span>
                      </div>
                    </div>
                    
                    {/* Text Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-gray-800 dark:group-hover:text-white/95 transition-colors duration-300 font-rosarivo">
                        {link.title}
                      </h3>
                      <p className="text-gray-700 dark:text-white/60 leading-relaxed text-sm group-hover:text-gray-600 dark:group-hover:text-white/75 transition-colors duration-300">
                        {link.description}
                      </p>
                    </div>
                    
                    {/* Action Footer */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-white/10">
                      {/* Action Text */}
                      <div className={`text-transparent bg-clip-text bg-gradient-to-r ${link.gradient} font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0`}>
                        Access Now
                      </div>
                      
                      {/* Action Button */}
                      <div className={`w-10 h-10 bg-gradient-to-br ${link.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-12`}>
                        <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Animated Mesh Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${link.gradient} opacity-0 group-hover:opacity-[0.02] transition-opacity duration-700 rounded-3xl`} />
                  
                  {/* Enhanced Shimmer Effect */}
                  <div className="absolute inset-0 rounded-3xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1200 ease-out skew-x-12 opacity-0 group-hover:opacity-100" />
                  </div>
                </div>
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