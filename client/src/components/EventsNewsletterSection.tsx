import { motion } from 'framer-motion';
import { Calendar, Mail, Video, Heart, Users, ArrowRight } from 'lucide-react';
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
      bgGradient: 'from-blue-50 to-indigo-50',
      attendees: '250+',
      type: 'In-Person'
    },
    {
      icon: Video,
      title: 'Monthly Research Webinars',
      description: 'Expert presentations on the latest treatment advances, diagnostic techniques, and clinical trial updates.',
      date: 'First Thursday of each month',
      gradient: 'from-[#00DD89] to-[#00BB77]',
      bgGradient: 'from-green-50 to-emerald-50',
      attendees: '500+',
      type: 'Virtual'
    },
    {
      icon: Heart,
      title: 'Support Group Meetings',
      description: 'Virtual and in-person meetings across Canada providing emotional support and practical guidance.',
      date: 'Weekly sessions available',
      gradient: 'from-purple-500 to-purple-700',
      bgGradient: 'from-purple-50 to-indigo-50',
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

                <div className="space-y-4">
                  <motion.div
                    className="relative group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <input
                      type="email"
                      placeholder={t('events.emailPlaceholder')}
                      className="w-full px-6 py-4 bg-white/90 dark:bg-white/10 backdrop-blur-sm border border-[#00AFE6]/30 dark:border-white/20 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/60 focus:outline-none focus:border-[#00AFE6] focus:bg-white/95 dark:focus:bg-white/20 transition-all duration-300"
                    />
                    <motion.button
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#00AFE6] text-white px-6 py-2 rounded-xl font-semibold hover:bg-[#0088CC] transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {t('events.subscribe')}
                    </motion.button>
                  </motion.div>

                  <div className="flex items-center gap-3 text-gray-600 dark:text-white/70 text-sm">
                    <div className="flex -space-x-2">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-full border-2 border-gray-200 dark:border-white/20"
                        />
                      ))}
                    </div>
                    <span>{t('events.joinMembers')}</span>
                  </div>
                </div>
              </div>

              {/* Stats with animated counters */}
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: 5000, suffix: '+', label: t('events.stats.subscribers'), icon: '📧' },
                  { value: 50, suffix: '+', label: t('events.stats.eventsYear'), icon: '📅' },
                  { value: 13, suffix: '', label: t('events.stats.provinces'), icon: '🇨🇦' },
                  { value: 95, suffix: '%', label: t('events.stats.satisfaction'), icon: '⭐' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="relative group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    whileHover={{ y: -5 }}
                  >
                    <div className={`backdrop-blur-xl rounded-2xl p-6 border transition-all duration-300 hover:shadow-xl ${
                      index === 0 
                        ? 'bg-gradient-to-br from-blue-50/95 to-cyan-50/95 dark:from-blue-900/25 dark:to-cyan-900/25 border-blue-200/60 dark:border-blue-400/30 hover:from-blue-100/95 hover:to-cyan-100/95 dark:hover:from-blue-800/35 dark:hover:to-cyan-800/35 hover:border-blue-300/70 dark:hover:border-blue-300/40 hover:shadow-blue-500/25 dark:hover:shadow-blue-400/20'
                        : index === 1
                        ? 'bg-gradient-to-br from-emerald-50/95 to-green-50/95 dark:from-emerald-900/25 dark:to-green-900/25 border-emerald-200/60 dark:border-emerald-400/30 hover:from-emerald-100/95 hover:to-green-100/95 dark:hover:from-emerald-800/35 dark:hover:to-green-800/35 hover:border-emerald-300/70 dark:hover:border-emerald-300/40 hover:shadow-emerald-500/25 dark:hover:shadow-emerald-400/20'
                        : index === 2
                        ? 'bg-gradient-to-br from-purple-50/95 to-violet-50/95 dark:from-purple-900/25 dark:to-violet-900/25 border-purple-200/60 dark:border-purple-400/30 hover:from-purple-100/95 hover:to-violet-100/95 dark:hover:from-purple-800/35 dark:hover:to-violet-800/35 hover:border-purple-300/70 dark:hover:border-purple-300/40 hover:shadow-purple-500/25 dark:hover:shadow-purple-400/20'
                        : 'bg-gradient-to-br from-orange-50/95 to-amber-50/95 dark:from-orange-900/25 dark:to-amber-900/25 border-orange-200/60 dark:border-orange-400/30 hover:from-orange-100/95 hover:to-amber-100/95 dark:hover:from-orange-800/35 dark:hover:to-amber-800/35 hover:border-orange-300/70 dark:hover:border-orange-300/40 hover:shadow-orange-500/25 dark:hover:shadow-orange-400/20'
                    }`}>
                      <div className="text-2xl mb-2">{stat.icon}</div>
                      <div className={`text-3xl font-bold mb-1 ${
                        index === 0 
                          ? 'text-blue-900 dark:text-blue-100'
                          : index === 1
                          ? 'text-emerald-900 dark:text-emerald-100'
                          : index === 2
                          ? 'text-purple-900 dark:text-purple-100'
                          : 'text-orange-900 dark:text-orange-100'
                      }`}>
                        <motion.span
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                        >
                          {stat.value}{stat.suffix}
                        </motion.span>
                      </div>
                      <div className={`text-sm font-medium ${
                        index === 0 
                          ? 'text-blue-700 dark:text-blue-300'
                          : index === 1
                          ? 'text-emerald-700 dark:text-emerald-300'
                          : index === 2
                          ? 'text-purple-700 dark:text-purple-300'
                          : 'text-orange-700 dark:text-orange-300'
                      }`}>{stat.label}</div>
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
                    <div className={`group relative backdrop-blur-xl rounded-3xl p-8 border transition-all duration-500 hover:shadow-2xl overflow-hidden min-h-[400px] ${
                      index === 0 
                        ? 'bg-gradient-to-br from-blue-50/95 to-cyan-50/95 dark:from-blue-900/25 dark:to-cyan-900/25 border-blue-200/60 dark:border-blue-400/30 hover:from-blue-100/95 hover:to-cyan-100/95 dark:hover:from-blue-800/35 dark:hover:to-cyan-800/35 hover:border-blue-300/70 dark:hover:border-blue-300/40 hover:shadow-blue-500/25 dark:hover:shadow-blue-400/20'
                        : index === 1
                        ? 'bg-gradient-to-br from-emerald-50/95 to-green-50/95 dark:from-emerald-900/25 dark:to-green-900/25 border-emerald-200/60 dark:border-emerald-400/30 hover:from-emerald-100/95 hover:to-green-100/95 dark:hover:from-emerald-800/35 dark:hover:to-green-800/35 hover:border-emerald-300/70 dark:hover:border-emerald-300/40 hover:shadow-emerald-500/25 dark:hover:shadow-emerald-400/20'
                        : index === 2
                        ? 'bg-gradient-to-br from-purple-50/95 to-violet-50/95 dark:from-purple-900/25 dark:to-violet-900/25 border-purple-200/60 dark:border-purple-400/30 hover:from-purple-100/95 hover:to-violet-100/95 dark:hover:from-purple-800/35 dark:hover:to-violet-800/35 hover:border-purple-300/70 dark:hover:border-purple-300/40 hover:shadow-purple-500/25 dark:hover:shadow-purple-400/20'
                        : index === 3
                        ? 'bg-gradient-to-br from-pink-50/95 to-rose-50/95 dark:from-pink-900/25 dark:to-rose-900/25 border-pink-200/60 dark:border-pink-400/30 hover:from-pink-100/95 hover:to-rose-100/95 dark:hover:from-pink-800/35 dark:hover:to-rose-800/35 hover:border-pink-300/70 dark:hover:border-pink-300/40 hover:shadow-pink-500/25 dark:hover:shadow-pink-400/20'
                        : 'bg-gradient-to-br from-orange-50/95 to-amber-50/95 dark:from-orange-900/25 dark:to-amber-900/25 border-orange-200/60 dark:border-orange-400/30 hover:from-orange-100/95 hover:to-amber-100/95 dark:hover:from-orange-800/35 dark:hover:to-amber-800/35 hover:border-orange-300/70 dark:hover:border-orange-300/40 hover:shadow-orange-500/25 dark:hover:shadow-orange-400/20'
                    }`}>
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
                            <h4 className={`text-xl font-bold font-rosarivo leading-tight ${
                              index === 0 
                                ? 'text-blue-900 dark:text-blue-100'
                                : index === 1
                                ? 'text-emerald-900 dark:text-emerald-100'
                                : index === 2
                                ? 'text-purple-900 dark:text-purple-100'
                                : index === 3
                                ? 'text-pink-900 dark:text-pink-100'
                                : 'text-orange-900 dark:text-orange-100'
                            }`}>
                              {event.title}
                            </h4>
                          </div>
                        </div>

                        {/* Date */}
                        <div className={`text-sm mb-4 font-medium ${
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