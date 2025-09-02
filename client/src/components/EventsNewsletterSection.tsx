import { motion } from 'framer-motion';
import { Calendar, Mail, Video, Heart, Users, ArrowRight, UserCheck, Globe, Star, MapPin, Stethoscope } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import casLogo from '@assets/l_cas_vert_rgb_1753253116732.png';

export default function EventsNewsletterSection() {
  const { t } = useLanguage();
  const events = [
    {
      icon: Users,
      title: 'Canadian Amyloidosis Summit',
      description: 'Annual gathering featuring leading specialists and patient advocates sharing the latest advances in treatment and care.',
      date: 'October 31 – November 2, 2025',
      gradient: 'from-[#00AFE6] to-[#0088CC]',
      bgGradient: 'from-[#00AFE6]/15 to-[#00DD89]/15',
      type: 'Hybrid'
    },
    {
      icon: Video,
      title: 'CAS Journal Club',
      description: 'Expert presentations of clinical cases and related discussion, journal review and/or clinical trial updates.',
      date: 'Five times per year, Thursday afternoons',
      gradient: 'from-[#00DD89] to-[#00BB77]',
      bgGradient: 'from-[#00AFE6]/15 to-[#00DD89]/15',
      type: 'Virtual'
    },
    {
      icon: Globe,
      title: 'International and Other Amyloidosis Events',
      description: 'Different events and programs related to amyloidosis around the world.',
      date: 'Various dates throughout the year',
      gradient: 'from-[#00AFE6] to-[#00DD89]',
      bgGradient: 'from-[#00AFE6]/15 to-[#00DD89]/15',
      type: 'Support'
    }
  ];

  return (
    <section className="relative py-10 lg:py-16 bg-gradient-to-br from-[#00AFE6]/6 via-gray-50 to-[#00DD89]/6 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Background decorative elements matching amyloidosis section style */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-[#00AFE6]/12 to-[#00DD89]/12 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-[#00DD89]/12 to-[#00AFE6]/12 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header matching amyloidosis section style */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-gray-900/10 dark:bg-white/10 backdrop-blur-sm border border-gray-900/20 dark:border-white/20 rounded-full px-6 py-3 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full"></div>
            <span className="text-gray-900 dark:text-white/90 font-medium tracking-wide">{t('events.badge')}</span>
          </motion.div>
          
          <h2 className="crawford-section-title mb-4">
            <span className="text-gray-900 dark:text-white">Join CAS & </span>
            <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">Get Involved</span>
          </h2>
          
          <p className="text-xl text-gray-700 dark:text-white/80 max-w-4xl mx-auto leading-relaxed">
            {t('events.subtitle')}
          </p>
        </motion.div>

        {/* Interactive Newsletter Card */}
        <motion.div
          className="relative mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-white/95 via-[#00AFE6]/5 to-white/95 dark:from-[#00AFE6]/10 dark:via-[#00DD89]/5 dark:to-[#00AFE6]/10 backdrop-blur-xl border border-[#00AFE6]/30 dark:border-white/20">
            {/* Animated background pattern */}
            <div className="absolute inset-0">
              <motion.div
                className="absolute inset-0 opacity-20"
                animate={{
                  background: [
                    "radial-gradient(circle at 20% 50%, #00AFE6 0%, transparent 50%)",
                    "radial-gradient(circle at 80% 50%, #00DD89 0%, transparent 50%)",
                    "radial-gradient(circle at 20% 50%, #00AFE6 0%, transparent 50%)",
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Floating particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-gray-900/30 dark:bg-white/30 rounded-full"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + (i % 2) * 40}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-12 p-12">
              {/* Newsletter Signup */}
              <div className="flex flex-col justify-center">
                {/* Logo */}
                <motion.div
                  className="flex justify-center mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <img 
                    src={casLogo} 
                    alt="Canadian Amyloidosis Society Logo" 
                    className="h-16 w-auto drop-shadow-lg"
                  />
                </motion.div>

                <motion.div
                  className="inline-flex items-center gap-2 bg-gray-900/20 dark:bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 w-fit mx-auto"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-2 h-2 bg-[#00DD89] rounded-full animate-pulse"></div>
                  <span className="text-gray-900 dark:text-white/90 text-sm font-medium">{t('events.stayConnected')}</span>
                </motion.div>

                <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-cardo text-center">
                  {t('events.joinCommunity')}
                </h3>
                <p className="text-gray-700 dark:text-white/80 text-lg mb-8 leading-relaxed text-center">
                  {t('events.joinCommunityDesc')}
                </p>

                <div className="flex justify-center">
                  <motion.a
                    href="/join-cas"
                    className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-12 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-3"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Join CAS</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </motion.a>
                </div>
              </div>

              {/* Stats with animated counters */}
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: 180, suffix: '', label: t('events.stats.members'), icon: Users, color: 'from-blue-500 to-cyan-500', bgColor: 'from-blue-50/90 to-cyan-50/90 dark:from-blue-900/20 dark:to-cyan-900/20' },
                  { value: 13, suffix: '', label: t('events.stats.provinces'), icon: MapPin, color: 'from-purple-500 to-violet-500', bgColor: 'from-purple-50/90 to-violet-50/90 dark:from-purple-900/20 dark:to-violet-900/20' },
                  { value: 2, suffix: '+', label: t('events.stats.disciplines'), icon: Stethoscope, color: 'from-emerald-500 to-green-500', bgColor: 'from-emerald-50/90 to-green-50/90 dark:from-emerald-900/20 dark:to-green-900/20' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="relative group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    whileHover={{ y: -5 }}
                  >
                    <div className={`relative backdrop-blur-xl rounded-2xl p-6 border transition-all duration-300 hover:shadow-xl bg-gradient-to-br ${stat.bgColor} border-white/30 dark:border-white/20 hover:border-white/50 dark:hover:border-white/30 hover:shadow-2xl overflow-hidden`}>
                      {/* Background gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`} />
                      
                      {/* Animated accent line */}
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                      
                      {/* Floating particles */}
                      <div className="absolute inset-0">
                        <div className={`absolute top-2 right-2 w-1 h-1 bg-gradient-to-r ${stat.color} rounded-full opacity-0 group-hover:opacity-60 transition-all duration-500 group-hover:animate-pulse`} />
                        <div className={`absolute bottom-3 left-3 w-0.5 h-0.5 bg-gradient-to-r ${stat.color} rounded-full opacity-0 group-hover:opacity-40 transition-all duration-700 group-hover:animate-pulse`} style={{ animationDelay: '0.3s' }} />
                      </div>
                      
                      <div className="relative z-10">
                        {/* Enhanced icon */}
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                          {index === 0 && <Users className="w-6 h-6 text-white" />}
                          {index === 1 && <MapPin className="w-6 h-6 text-white" />}
                          {index === 2 && <Stethoscope className="w-6 h-6 text-white" />}
                        </div>
                        
                        {/* Value with enhanced gradient */}
                        <div className={`text-3xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                          <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                          >
                            {stat.value}{stat.suffix}
                          </motion.span>
                        </div>
                        
                        {/* Label with enhanced styling */}
                        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Events Timeline */}
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="text-center mb-16">
            <motion.div
              className="inline-flex items-center gap-2 bg-gray-900/10 dark:bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Calendar className="w-4 h-4 text-[#00AFE6]" />
              <span className="text-gray-900 dark:text-white/90 font-medium">{t('events.upcomingEvents')}</span>
            </motion.div>
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-rosarivo">{t('events.communityCalendar')}</h3>
            <p className="text-gray-700 dark:text-white/80 text-lg max-w-2xl mx-auto">
              {t('events.communityCalendarDesc')}
            </p>
          </div>

          {/* Events grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.15 }}
                  viewport={{ once: true, margin: "-50px" }}
                >
                  {/* Event card */}
                  <motion.div
                    whileHover={{ scale: 1.02, y: -6 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <div className="group relative h-full rounded-3xl p-8 border transition-all duration-500 hover:shadow-2xl bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-800 dark:via-gray-800/80 dark:to-gray-900 border-gray-200/60 dark:border-gray-700/60 hover:border-[#00AFE6]/30 dark:hover:border-[#00AFE6]/40 backdrop-blur-sm">
                      {/* Subtle gradient overlay on hover */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#00AFE6]/3 to-[#00DD89]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Content */}
                      <div className="relative z-10 flex flex-col h-full">
                        {/* Header with Icon and Badge */}
                        <div className="flex items-start justify-between mb-6">
                          <div className={`w-16 h-16 bg-gradient-to-br ${event.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                            <event.icon className="w-8 h-8 text-white" />
                          </div>
                          <span className="px-4 py-2 bg-gradient-to-r from-[#00AFE6] to-[#0088CC] text-white text-xs font-bold rounded-full uppercase tracking-wide shadow-md">
                            {event.type}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-xl font-bold font-rosarivo leading-tight text-gray-900 dark:text-white mb-4 group-hover:text-[#00AFE6] dark:group-hover:text-[#00AFE6] transition-colors duration-300">
                          {event.title}
                        </h4>

                        {/* Date */}
                        <div className="flex items-center gap-2 text-sm font-semibold text-[#00AFE6] dark:text-[#00AFE6] mb-5">
                          <Calendar className="w-4 h-4" />
                          <span>{event.date}</span>
                        </div>

                        {/* Description */}
                        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 mb-8 flex-1">
                          {event.description}
                        </p>

                        {/* Footer */}
                        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                          <motion.button
                            className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-6 py-4 rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:from-[#0088CC] group-hover:to-[#00BB77]"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span>Join Event</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
        </motion.div>
      </div>
    </section>
  );
}