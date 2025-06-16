import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Users, Mail, Bell } from 'lucide-react';

export default function EventsNewsletterSection() {
  const upcomingEvents = [
    {
      id: 1,
      title: 'Amyloidosis Awareness Webinar Series',
      date: { day: '15', month: 'Mar', year: '2024' },
      time: '7:00 PM EST',
      location: 'Virtual Event',
      type: 'Educational',
      description: 'Join leading experts as they discuss the latest advances in amyloidosis diagnosis and treatment options.',
      href: '#register-webinar'
    },
    {
      id: 2,
      title: 'Patient & Family Support Meeting',
      date: { day: '22', month: 'Mar', year: '2024' },
      time: '2:00 PM EST',
      location: 'Toronto, ON',
      type: 'Support Group',
      description: 'Monthly gathering for patients and families to share experiences and receive emotional support.',
      href: '#support-meeting'
    },
    {
      id: 3,
      title: 'Research Update Conference',
      date: { day: '8', month: 'Apr', year: '2024' },
      time: '9:00 AM EST',
      location: 'Vancouver, BC',
      type: 'Conference',
      description: 'Annual conference featuring the latest research findings and clinical trial updates.',
      href: '#research-conference'
    }
  ];

  return (
    <section className="relative py-32 lg:py-40 gradient-bg-subtle overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-80 h-80 bg-gradient-to-br from-blue-500/4 to-purple-500/4 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-tr from-green-500/4 to-cyan-500/4 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-gradient-to-r from-indigo-500/3 to-pink-500/3 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
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
            <Calendar className="w-4 h-4 text-[#00AFE6]" />
            <span className="text-gray-700 font-medium tracking-wide">Stay Connected</span>
          </motion.div>

          <motion.h2 
            className="crawford-section-title text-gray-900 mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Upcoming Events & Newsletter
          </motion.h2>

          <motion.p 
            className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto crawford-body-text"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Stay informed about upcoming events, educational webinars, and support meetings. 
            Join our community and never miss important updates.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Events List */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 crawford-heading">Upcoming Events</h3>
            
            <div className="space-y-8">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  className="glass-card rounded-3xl p-8 hover-lift group"
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
                  viewport={{ once: true, margin: "-50px" }}
                >
                  <div className="flex items-start gap-6">
                    {/* Date */}
                    <div className="flex-shrink-0 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-2xl p-4 text-center min-w-[80px]">
                      <div className="text-white font-bold text-2xl">{event.date.day}</div>
                      <div className="text-white/90 text-sm font-medium">{event.date.month}</div>
                      <div className="text-white/80 text-xs">{event.date.year}</div>
                    </div>

                    {/* Event Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                          {event.type}
                        </span>
                        <div className="flex items-center gap-1 text-gray-600 text-sm">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-1 text-gray-600 text-sm">
                          <Clock className="w-3 h-3" />
                          {event.time}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                        {event.title}
                      </h3>
                      
                      <p className="text-gray-700 text-sm leading-relaxed mb-4">
                        {event.description}
                      </p>

                      <motion.a
                        href={event.href}
                        className="inline-flex items-center gap-2 text-[#00AFE6] hover:text-[#0088CC] font-semibold text-sm transition-colors"
                        whileHover={{ x: 4 }}
                      >
                        Register Now
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="lg:col-span-1">
            <motion.div
              className="glass-card-strong rounded-3xl p-8 sticky top-8"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 crawford-heading">Stay Updated</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Subscribe to our newsletter for the latest updates, research findings, and event announcements.
                </p>
              </div>

              <form className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#00AFE6] focus:ring-2 focus:ring-[#00AFE6]/20 outline-none transition-all duration-200"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#00AFE6] focus:ring-2 focus:ring-[#00AFE6]/20 outline-none transition-all duration-200"
                  />
                </div>
                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Subscribe Now
                </motion.button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Bell className="w-4 h-4" />
                  <span>Get notified about new events and updates</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}