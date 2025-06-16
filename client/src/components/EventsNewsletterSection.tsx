import { motion } from 'framer-motion';
import { Calendar, Mail, Video, Heart, Users, ArrowRight } from 'lucide-react';

export default function EventsNewsletterSection() {
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
    <section className="relative py-32 lg:py-40 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Background decorative elements matching amyloidosis section style */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-[#00AFE6]/8 to-[#00DD89]/8 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-[#00DD89]/8 to-[#00AFE6]/8 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header matching amyloidosis section style */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full"></div>
            <span className="text-white/90 font-medium tracking-wide">Stay Connected</span>
          </motion.div>
          
          <h2 className="crawford-section-title text-white mb-8">
            Events & Newsletter
          </h2>
          
          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            Join our community to stay informed about the latest research, upcoming events, and important updates in amyloidosis care across Canada.
          </p>
        </motion.div>

        {/* Interactive Newsletter Card */}
        <motion.div
          className="relative mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#00AFE6]/10 via-[#00DD89]/5 to-[#00AFE6]/10 backdrop-blur-xl border border-white/20">
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
                  className="absolute w-2 h-2 bg-white/30 rounded-full"
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
                <motion.div
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 w-fit"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-2 h-2 bg-[#00DD89] rounded-full animate-pulse"></div>
                  <span className="text-white/90 text-sm font-medium">Stay Connected</span>
                </motion.div>

                <h3 className="text-4xl font-bold text-white mb-4 font-cardo">
                  Join Our Community
                </h3>
                <p className="text-white/80 text-lg mb-8 leading-relaxed">
                  Get exclusive access to research updates, community events, and expert insights delivered monthly.
                </p>

                <div className="space-y-4">
                  <motion.div
                    className="relative group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-[#00AFE6] focus:bg-white/20 transition-all duration-300"
                    />
                    <motion.button
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#00AFE6] text-white px-6 py-2 rounded-xl font-semibold hover:bg-[#0088CC] transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Subscribe
                    </motion.button>
                  </motion.div>

                  <div className="flex items-center gap-3 text-white/70 text-sm">
                    <div className="flex -space-x-2">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-full border-2 border-white/20"
                        />
                      ))}
                    </div>
                    <span>Join 5,000+ community members</span>
                  </div>
                </div>
              </div>

              {/* Stats with animated counters */}
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: 5000, suffix: '+', label: 'Subscribers', icon: '📧' },
                  { value: 50, suffix: '+', label: 'Events/Year', icon: '📅' },
                  { value: 13, suffix: '', label: 'Provinces', icon: '🇨🇦' },
                  { value: 95, suffix: '%', label: 'Satisfaction', icon: '⭐' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="relative group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 group-hover:border-white/40 transition-all duration-300">
                      <div className="text-2xl mb-2">{stat.icon}</div>
                      <div className="text-3xl font-bold text-white mb-1">
                        <motion.span
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                        >
                          {stat.value}{stat.suffix}
                        </motion.span>
                      </div>
                      <div className="text-white/70 text-sm font-medium">{stat.label}</div>
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
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Calendar className="w-4 h-4 text-[#00AFE6]" />
              <span className="text-white/90 font-medium">Upcoming Events</span>
            </motion.div>
            <h3 className="text-4xl font-bold text-white mb-4 font-rosarivo">Community Calendar</h3>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Connect with experts, patients, and researchers through our comprehensive event program.
            </p>
          </div>

          {/* Horizontal Events Carousel */}
          <div className="relative overflow-hidden">
            {/* Horizontal timeline line */}
            <div className="absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-[#00AFE6] via-[#00DD89] to-[#00AFE6] rounded-full opacity-30"></div>
            
            {/* Events grid with horizontal scroll */}
            <div className="flex gap-8 overflow-x-auto pb-8 px-4 scrollbar-hide">
              
              {events.map((event, index) => (
                <motion.div
                  key={index}
                  className="relative flex-shrink-0 w-80"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.15 }}
                  viewport={{ once: true, margin: "-50px" }}
                >
                  {/* Timeline node */}
                  <div className="absolute top-[76px] left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full border-4 border-gray-900 z-10">
                    <motion.div
                      className="w-full h-full bg-white rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    />
                  </div>

                  {/* Event card */}
                  <motion.div
                    className="mt-8"
                    whileHover={{ scale: 1.02, y: -8 }}
                  >
                    <div className="group relative bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:border-white/30 transition-all duration-500 hover:bg-white/10 hover:shadow-2xl hover:shadow-[#00AFE6]/20 overflow-hidden h-full">
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
                        <div className="flex items-start gap-3 mb-4">
                          <div className={`w-12 h-12 bg-gradient-to-br ${event.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                            <event.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-1 bg-[#00AFE6] text-white text-xs font-semibold rounded-full">
                                {event.type}
                              </span>
                            </div>
                            <h4 className="text-lg font-bold text-white font-rosarivo leading-tight">
                              {event.title}
                            </h4>
                          </div>
                        </div>

                        {/* Date */}
                        <div className="text-white/60 text-sm mb-3 font-medium">
                          {event.date}
                        </div>

                        {/* Description */}
                        <p className="text-white/70 text-sm leading-relaxed mb-4 flex-1">
                          {event.description}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <div className="flex items-center gap-2 text-white/60 text-xs">
                            <Users className="w-3 h-3" />
                            <span>{event.attendees}</span>
                          </div>
                          
                          <motion.button
                            className="group/btn inline-flex items-center gap-2 bg-[#00AFE6] text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-[#0088CC] transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span>Join</span>
                            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform duration-300" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Scroll indicators */}
            <div className="flex justify-center mt-6 gap-2">
              {events.map((_, index) => (
                <div
                  key={index}
                  className="w-2 h-2 bg-white/30 rounded-full transition-all duration-300 hover:bg-white/60"
                />
              ))}
            </div>

            {/* Navigation hint */}
            <div className="flex justify-center mt-4">
              <div className="inline-flex items-center gap-2 text-white/60 text-sm">
                <span>Scroll horizontally to view more events</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}