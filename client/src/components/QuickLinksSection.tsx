import { motion } from 'framer-motion';
import { ArrowRight, Users, BookOpen, Heart, Search, Calendar, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function QuickLinksSection() {
  const { t } = useLanguage();
  const quickLinks = [
    {
      icon: Search,
      title: t('quickLinks.findSpecialists'),
      description: t('quickLinks.findSpecialistsDesc'),
      href: '#specialists',
      gradient: 'from-[#00AFE6] to-[#0088CC]',
      bgColor: 'from-blue-50 to-indigo-50'
    },
    {
      icon: BookOpen,
      title: t('quickLinks.patientResources'),
      description: t('quickLinks.patientResourcesDesc'),
      href: '#resources',
      gradient: 'from-[#00DD89] to-[#00BB77]',
      bgColor: 'from-green-50 to-emerald-50'
    },
    {
      icon: Users,
      title: t('quickLinks.supportGroups'),
      description: t('quickLinks.supportGroupsDesc'),
      href: '#support',
      gradient: 'from-purple-500 to-purple-700',
      bgColor: 'from-purple-50 to-indigo-50'
    },
    {
      icon: Heart,
      title: t('quickLinks.getInvolved'),
      description: t('quickLinks.getInvolvedDesc'),
      href: '#get-involved',
      gradient: 'from-pink-500 to-rose-600',
      bgColor: 'from-pink-50 to-rose-50'
    },
    {
      icon: Calendar,
      title: t('quickLinks.events'),
      description: t('quickLinks.eventsDesc'),
      href: '#events',
      gradient: 'from-orange-500 to-amber-600',
      bgColor: 'from-orange-50 to-amber-50'
    },
    {
      icon: Phone,
      title: t('quickLinks.contactUs'),
      description: t('quickLinks.contactUsDesc'),
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
            <span className="text-gray-900 dark:text-white/90 font-medium tracking-wide">{t('quickLinks.badge')}</span>
          </motion.div>

          <h2 className="crawford-section-title mb-8">
            <span className="text-gray-900 dark:text-white">{t('quickLinks.title.essential')} </span>
            <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">{t('quickLinks.title.resources')}</span>
          </h2>
          <p className="text-xl text-gray-700 dark:text-white/80 max-w-4xl mx-auto leading-relaxed">
            {t('quickLinks.subtitle')}
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
                <div className={`relative h-full backdrop-blur-2xl rounded-3xl border transition-all duration-700 group-hover:shadow-2xl overflow-hidden ${
                  index === 0 
                    ? 'bg-gradient-to-br from-blue-50/95 to-cyan-50/95 dark:from-blue-900/25 dark:to-cyan-900/25 border-blue-200/60 dark:border-blue-400/30 hover:from-blue-100/95 hover:to-cyan-100/95 dark:hover:from-blue-800/35 dark:hover:to-cyan-800/35 hover:border-blue-300/70 dark:hover:border-blue-300/40 hover:shadow-blue-500/25 dark:hover:shadow-blue-400/20'
                    : index === 1
                    ? 'bg-gradient-to-br from-emerald-50/95 to-green-50/95 dark:from-emerald-900/25 dark:to-green-900/25 border-emerald-200/60 dark:border-emerald-400/30 hover:from-emerald-100/95 hover:to-green-100/95 dark:hover:from-emerald-800/35 dark:hover:to-green-800/35 hover:border-emerald-300/70 dark:hover:border-emerald-300/40 hover:shadow-emerald-500/25 dark:hover:shadow-emerald-400/20'
                    : index === 2
                    ? 'bg-gradient-to-br from-purple-50/95 to-violet-50/95 dark:from-purple-900/25 dark:to-violet-900/25 border-purple-200/60 dark:border-purple-400/30 hover:from-purple-100/95 hover:to-violet-100/95 dark:hover:from-purple-800/35 dark:hover:to-violet-800/35 hover:border-purple-300/70 dark:hover:border-purple-300/40 hover:shadow-purple-500/25 dark:hover:shadow-purple-400/20'
                    : index === 3
                    ? 'bg-gradient-to-br from-pink-50/95 to-rose-50/95 dark:from-pink-900/25 dark:to-rose-900/25 border-pink-200/60 dark:border-pink-400/30 hover:from-pink-100/95 hover:to-rose-100/95 dark:hover:from-pink-800/35 dark:hover:to-rose-800/35 hover:border-pink-300/70 dark:hover:border-pink-300/40 hover:shadow-pink-500/25 dark:hover:shadow-pink-400/20'
                    : index === 4
                    ? 'bg-gradient-to-br from-orange-50/95 to-amber-50/95 dark:from-orange-900/25 dark:to-amber-900/25 border-orange-200/60 dark:border-orange-400/30 hover:from-orange-100/95 hover:to-amber-100/95 dark:hover:from-orange-800/35 dark:hover:to-amber-800/35 hover:border-orange-300/70 dark:hover:border-orange-300/40 hover:shadow-orange-500/25 dark:hover:shadow-orange-400/20'
                    : 'bg-gradient-to-br from-slate-50/95 to-gray-50/95 dark:from-slate-900/25 dark:to-gray-900/25 border-slate-200/60 dark:border-slate-400/30 hover:from-slate-100/95 hover:to-gray-100/95 dark:hover:from-slate-800/35 dark:hover:to-gray-800/35 hover:border-slate-300/70 dark:hover:border-slate-300/40 hover:shadow-slate-500/25 dark:hover:shadow-slate-400/20'
                }`}>
                  
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
                        <span className="text-xs text-gray-700 dark:text-white/60 font-medium">{t('quickLinks.available')}</span>
                      </div>
                    </div>
                    
                    {/* Text Content */}
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 font-rosarivo ${
                        index === 0 
                          ? 'text-blue-900 dark:text-blue-100 group-hover:text-blue-800 dark:group-hover:text-blue-50'
                          : index === 1
                          ? 'text-emerald-900 dark:text-emerald-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-50'
                          : index === 2
                          ? 'text-purple-900 dark:text-purple-100 group-hover:text-purple-800 dark:group-hover:text-purple-50'
                          : index === 3
                          ? 'text-pink-900 dark:text-pink-100 group-hover:text-pink-800 dark:group-hover:text-pink-50'
                          : index === 4
                          ? 'text-orange-900 dark:text-orange-100 group-hover:text-orange-800 dark:group-hover:text-orange-50'
                          : 'text-slate-900 dark:text-slate-100 group-hover:text-slate-800 dark:group-hover:text-slate-50'
                      }`}>{link.title}</h3>
                      <p className={`leading-relaxed text-sm transition-colors duration-300 ${
                        index === 0 
                          ? 'text-blue-700 dark:text-blue-300 group-hover:text-blue-600 dark:group-hover:text-blue-200'
                          : index === 1
                          ? 'text-emerald-700 dark:text-emerald-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-200'
                          : index === 2
                          ? 'text-purple-700 dark:text-purple-300 group-hover:text-purple-600 dark:group-hover:text-purple-200'
                          : index === 3
                          ? 'text-pink-700 dark:text-pink-300 group-hover:text-pink-600 dark:group-hover:text-pink-200'
                          : index === 4
                          ? 'text-orange-700 dark:text-orange-300 group-hover:text-orange-600 dark:group-hover:text-orange-200'
                          : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                      }`}>
                        {link.description}
                      </p>
                    </div>
                    
                    {/* Action Footer */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-white/10">
                      {/* Action Text */}
                      <div className={`text-transparent bg-clip-text bg-gradient-to-r ${link.gradient} font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0`}>
                        {t('quickLinks.accessNow')}
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
          <p className="text-gray-600 dark:text-white/60 mb-6">
            {t('quickLinks.needHelp')}
          </p>
          <motion.button
            className="group inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl border border-gray-200 hover:border-gray-300 transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>{t('quickLinks.contactSupport')}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}