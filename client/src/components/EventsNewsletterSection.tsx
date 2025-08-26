import { motion } from 'framer-motion';
import { Calendar, Mail, Video, Heart, Users, ArrowRight, UserCheck, Globe, Star, MapPin, Stethoscope } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import logoImage from '@assets/image 1_1750236540297.png';

export default function EventsNewsletterSection() {
  const { t } = useLanguage();
  const events = [
    {
      icon: Users,
      title: 'Patient & Family Conference',
      description: 'Annual gathering featuring leading specialists and patient advocates sharing the latest advances in treatment and care.',
      date: 'November 15-16, 2024',
      gradient: 'from-[#00AFE6] to-[#0088CC]',
      bgGradient: 'from-[#00AFE6]/15 to-[#00DD89]/15',
      attendees: '250+',
      type: 'In-Person'
    },
    {
      icon: Video,
      title: 'Monthly Research Webinars',
      description: 'Expert presentations on the latest treatment advances, diagnostic techniques, and clinical trial updates.',
      date: 'First Thursday of each month',
      gradient: 'from-[#00DD89] to-[#00BB77]',
      bgGradient: 'from-[#00AFE6]/15 to-[#00DD89]/15',
      attendees: '500+',
      type: 'Virtual'
    },
    {
      icon: Heart,
      title: 'Support Group Meetings',
      description: 'Virtual and in-person meetings across Canada providing emotional support and practical guidance.',
      date: 'Weekly sessions available',
      gradient: 'from-[#00AFE6] to-[#00DD89]',
      bgGradient: 'from-[#00AFE6]/15 to-[#00DD89]/15',
      attendees: '50+',
      type: 'Hybrid'
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
            <span className="text-gray-900 dark:text-white">{t('events.title.events')} </span>
            <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">{t('events.title.newsletter')}</span>
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
                    src={logoImage} 
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

          {/* Horizontal Events Carousel */}
          <div className="relative">
            {/* Horizontal timeline line */}
            <div className="absolute top-8 left-8 right-8 h-0.5 bg-gradient-to-r from-[#00AFE6] via-[#00DD89] to-[#00AFE6] rounded-full opacity-40"></div>
            
            {/* Events grid with horizontal scroll */}
            <div className="flex gap-8 overflow-x-auto pb-8 px-8 scrollbar-hide">
              {events.map((event, index) => (
                <motion.div
                  key={index}
                  className="relative flex-shrink-0 w-96"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.15 }}
                  viewport={{ once: true, margin: "-50px" }}
                >
                  {/* Timeline node - positioned at the top */}
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full border-2 border-gray-900 z-10">
                    <motion.div
                      className="w-full h-full bg-white rounded-full scale-50"
                      animate={{ scale: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    />
                  </div>

                  {/* Event card - positioned below timeline */}
                  <motion.div
                    className="mt-12"
                    whileHover={{ scale: 1.02, y: -8 }}
                  >
                    <div className="group relative backdrop-blur-xl rounded-3xl p-8 border transition-all duration-500 hover:shadow-2xl overflow-hidden min-h-[400px] bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 border-[#00AFE6]/20 dark:border-[#00AFE6]/30 hover:from-[#00AFE6]/12 hover:to-[#00DD89]/12 dark:hover:from-[#00AFE6]/20 dark:hover:to-[#00DD89]/20 hover:border-[#00AFE6]/40 dark:hover:border-[#00AFE6]/50 hover:shadow-[#00AFE6]/25 dark:hover:shadow-[#00AFE6]/20">
                      {/* Animated glow effect */}
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00AFE6]/20 via-[#00DD89]/20 to-[#00AFE6]/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                      
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 rounded-3xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out skew-x-12" />
                      </div>

                      {/* Background effects */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${event.gradient} opacity-0 group-hover:opacity-8 transition-opacity duration-500 rounded-3xl`} />
                      
                      {/* Micro animations */}
                      <motion.div
                        className="absolute top-3 right-3 w-2 h-2 bg-[#00AFE6] rounded-full"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                      />

                      <div className="relative z-10 h-full flex flex-col">
                        {/* Header */}
                        <div className="flex items-start gap-4 mb-6">
                          <div className={`w-14 h-14 bg-gradient-to-br ${event.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                            <event.icon className="w-7 h-7 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="px-3 py-1 bg-[#00AFE6] text-white text-xs font-semibold rounded-full">
                                {event.type}
                              </span>
                            </div>
                            <h4 className="text-xl font-bold font-rosarivo leading-tight text-gray-900 dark:text-white">
                              {event.title}
                            </h4>
                          </div>
                        </div>

                        {/* Date */}
                        <div className="text-sm mb-4 font-medium text-gray-600 dark:text-gray-400">
                          {event.date}
                        </div>

                        {/* Description */}
                        <p className={`text-sm leading-relaxed mb-8 flex-1 ${
                          index === 0 
                            ? 'text-blue-700 dark:text-blue-300'
                            : index === 1
                            ? 'text-emerald-700 dark:text-emerald-300'
                            : index === 2
                            ? 'text-purple-700 dark:text-purple-300'
                            : index === 3
                            ? 'text-pink-700 dark:text-pink-300'
                            : 'text-orange-700 dark:text-orange-300'
                        }`}>
                          {event.description}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-white/10 mt-auto">
                          <div className={`flex items-center gap-2 text-sm ${
                            index === 0 
                              ? 'text-blue-600 dark:text-blue-400'
                              : index === 1
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : index === 2
                              ? 'text-purple-600 dark:text-purple-400'
                              : index === 3
                              ? 'text-pink-600 dark:text-pink-400'
                              : 'text-orange-600 dark:text-orange-400'
                          }`}>
                            <Users className="w-4 h-4" />
                            <span>{event.attendees}</span>
                          </div>
                          
                          <motion.button
                            className="group/btn inline-flex items-center gap-2 bg-[#00AFE6] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#0088CC] transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span>Join Event</span>
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform duration-300" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Scroll indicators */}
            <div className="flex justify-center mt-8 gap-2">
              {events.map((_, index) => (
                <motion.div
                  key={index}
                  className="w-2 h-2 bg-gray-400 dark:bg-white/30 rounded-full transition-all duration-300 hover:bg-gray-600 dark:hover:bg-white/60 cursor-pointer"
                  whileHover={{ scale: 1.5 }}
                />
              ))}
            </div>

            {/* Navigation hint */}
            <div className="flex justify-center mt-6">
              <motion.div 
                className="inline-flex items-center gap-2 text-gray-600 dark:text-white/60 text-sm"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <span>Scroll horizontally to view more events</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}