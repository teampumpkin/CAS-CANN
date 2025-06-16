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
    <section className="relative py-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-indigo-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            y: [0, -15, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-indigo-400/8 to-purple-500/8 rounded-full blur-3xl"
          animate={{ 
            scale: [1.1, 1, 1.1],
            x: [0, -25, 0],
            y: [0, 20, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-16 h-16 border-2 border-blue-200/30 rounded-xl"
          animate={{ rotate: [0, 45, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/3 w-12 h-12 bg-gradient-to-br from-purple-200/20 to-indigo-200/20 rounded-full"
          animate={{ y: [0, -20, 0], x: [0, 15, 0] }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Enhanced Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm text-[#0088CC] px-6 py-3 rounded-full text-sm font-medium border border-blue-100/50 shadow-lg mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Calendar className="w-5 h-5" />
            </motion.div>
            <span>Stay Connected</span>
          </motion.div>
          
          <motion.h2 
            className="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-8 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Events &{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#0088CC] bg-clip-text text-transparent">
                Newsletter
              </span>
              <motion.div
                className="absolute -inset-2 bg-gradient-to-r from-[#00AFE6]/20 to-[#0088CC]/20 blur-2xl opacity-0"
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              />
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join our community to stay informed about the latest research, upcoming events, and important updates in amyloidosis care across Canada.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Newsletter Signup Column */}
          <motion.div
            className="lg:col-span-5 space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Stay Informed</h3>
              
              <div className="space-y-4">
                <motion.button
                  className="group w-full bg-gradient-to-r from-[#00AFE6] to-[#0088CC] text-white p-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="relative flex items-center justify-between">
                    <div className="text-left">
                      <div className="font-bold mb-1">Subscribe to Newsletter</div>
                      <div className="text-white/80 text-sm">Monthly updates and research news</div>
                    </div>
                    <Mail className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </motion.button>

                <motion.button
                  className="group w-full bg-white/90 backdrop-blur-sm border-2 border-[#00DD89] text-[#00DD89] p-6 rounded-2xl font-semibold text-lg shadow-lg hover:bg-[#00DD89] hover:text-white hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-[#00DD89] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                  />
                  <div className="relative flex items-center justify-between">
                    <div className="text-left">
                      <div className="font-bold mb-1">View Upcoming Events</div>
                      <div className="opacity-70 text-sm">Conferences, webinars, and support groups</div>
                    </div>
                    <Calendar className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Quick Stats */}
            <motion.div
              className="grid grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {[
                { value: '5K+', label: 'Subscribers' },
                { value: '50+', label: 'Events/Year' },
                { value: '13', label: 'Provinces' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Events Column */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="space-y-8">
              {events.map((event, index) => (
                <motion.div
                  key={index}
                  className={`relative bg-gradient-to-br ${event.bgGradient} rounded-3xl p-8 border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  {/* Animated background effect */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${event.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                    animate={{
                      background: [
                        `linear-gradient(135deg, ${event.gradient.replace('from-', '').replace('to-', '')} 0%, transparent 50%)`,
                        `linear-gradient(225deg, ${event.gradient.replace('from-', '').replace('to-', '')} 0%, transparent 50%)`,
                        `linear-gradient(135deg, ${event.gradient.replace('from-', '').replace('to-', '')} 0%, transparent 50%)`
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  
                  <div className="relative z-10 flex items-start gap-6">
                    <motion.div 
                      className={`w-20 h-20 bg-gradient-to-br ${event.gradient} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <event.icon className="w-10 h-10 text-white" />
                    </motion.div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                          {event.title}
                        </h3>
                        <div className="flex gap-2">
                          <span className={`px-3 py-1 bg-gradient-to-r ${event.gradient} text-white text-xs font-semibold rounded-full`}>
                            {event.type}
                          </span>
                          <span className="px-3 py-1 bg-white/70 text-gray-700 text-xs font-semibold rounded-full">
                            {event.attendees}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 leading-relaxed mb-4 group-hover:text-gray-700 transition-colors duration-300">
                        {event.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className={`inline-flex items-center gap-2 bg-white/80 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm`}>
                          <Calendar className="w-4 h-4" />
                          {event.date}
                        </div>
                        
                        <motion.button
                          className={`inline-flex items-center gap-2 bg-gradient-to-r ${event.gradient} text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span>Learn More</span>
                          <ArrowRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover accent line */}
                  <motion.div
                    className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${event.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}