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

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Newsletter Signup Column */}
          <motion.div
            className="lg:col-span-5 space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:bg-white/10 overflow-hidden">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00AFE6]/5 via-transparent to-[#00DD89]/5"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-8 font-cardo">Stay Informed</h3>
                
                <div className="space-y-6">
                  <motion.button
                    className="group w-full bg-[#00AFE6] text-white p-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-[#0088CC] transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <div className="font-bold mb-1">Subscribe to Newsletter</div>
                        <div className="text-white/90 text-sm">Monthly updates and research news</div>
                      </div>
                      <Mail className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </motion.button>

                  <motion.button
                    className="group w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white p-6 rounded-2xl font-semibold text-lg shadow-lg hover:bg-white/20 hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <div className="font-bold mb-1">View Upcoming Events</div>
                        <div className="text-white/70 text-sm">Conferences, webinars, and support groups</div>
                      </div>
                      <Calendar className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Quick Stats with proper glassmorphism */}
            <motion.div
              className="grid grid-cols-3 gap-6"
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
                  className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00AFE6] to-[#0088CC] mb-2">{stat.value}</div>
                  <div className="text-white/70 text-sm font-medium">{stat.label}</div>
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
                  className="group relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:bg-white/10"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.15 }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ y: -8 }}
                >
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${event.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`} />
                  
                  <div className="relative z-10 flex items-start gap-6">
                    <div className={`w-20 h-20 bg-gradient-to-br ${event.gradient} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <event.icon className="w-10 h-10 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-2xl font-bold text-white group-hover:text-white/90 transition-colors duration-300 font-cardo">
                          {event.title}
                        </h3>
                        <div className="flex gap-2">
                          <span className={`px-3 py-1 bg-gradient-to-r ${event.gradient} text-white text-xs font-semibold rounded-full`}>
                            {event.type}
                          </span>
                          <span className="px-3 py-1 bg-white/10 text-white/80 text-xs font-semibold rounded-full">
                            {event.attendees}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-white/70 leading-relaxed mb-4 group-hover:text-white/80 transition-colors duration-300">
                        {event.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/20">
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
                  
                  {/* Hover effect lines */}
                  <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${event.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-3xl`} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}