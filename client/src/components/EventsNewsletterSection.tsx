import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

export default function EventsNewsletterSection() {
  const upcomingEvents = [
    {
      id: 1,
      date: {
        day: "15",
        month: "Mar",
        year: "2025"
      },
      title: "Amyloidosis Research Symposium",
      location: "Toronto, ON",
      description: "Join leading researchers and clinicians for the latest advances in amyloidosis research and treatment.",
      type: "Conference",
      href: "#event-1"
    },
    {
      id: 2,
      date: {
        day: "22",
        month: "Apr",
        year: "2025"
      },
      title: "Patient Support Workshop",
      location: "Virtual Event",
      description: "Interactive workshop covering treatment options, support resources, and Q&A with specialists.",
      type: "Workshop",
      href: "#event-2"
    }
  ];

  return (
    <section className="relative py-32 lg:py-40 gradient-bg-subtle grain-overlay overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-500/8 to-purple-500/8 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-green-500/8 to-cyan-500/8 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/6 to-pink-500/6 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Events Section */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              className="inline-flex items-center gap-2 glass-morphism rounded-full px-6 py-3 mb-8 glow-effect-blue"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Calendar className="w-4 h-4 text-[#00AFE6]" />
              <span className="text-gray-700 font-medium tracking-wide">Upcoming Events</span>
            </motion.div>

            <motion.h2 
              className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Join Our Community Events
            </motion.h2>

            <div className="space-y-8">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  className="group glass-morphism rounded-3xl p-8 hover:glow-effect-blue transition-all duration-500"
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ y: -4, scale: 1.01 }}
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
                        whileHover={{ x: 5 }}
                      >
                        Learn More
                        <ArrowRight className="w-4 h-4" />
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Newsletter Section */}
          <motion.div
            className="lg:pl-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full"></div>
              <span className="text-white/90 font-medium tracking-wide">Stay Informed</span>
            </motion.div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
              Newsletter Signup
            </h2>

            <p className="text-xl text-white/80 mb-10 leading-relaxed">
              Get the latest updates on amyloidosis research, events, and resources delivered to your inbox.
            </p>

            {/* Newsletter Form */}
            <form className="space-y-6">
              <div>
                <label className="block text-white/90 text-sm font-semibold mb-3">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00AFE6]/50 focus:border-[#00AFE6] transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-white/90 text-sm font-semibold mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00AFE6]/50 focus:border-[#00AFE6] transition-all duration-300"
                />
              </div>

              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#0088CC] hover:to-[#00BB77] text-white px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Subscribe to Newsletter
              </motion.button>
            </form>

            {/* Trust indicators */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center gap-6 text-white/60 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#00DD89] rounded-full"></div>
                  <span>Monthly updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#00AFE6] rounded-full"></div>
                  <span>No spam</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>Unsubscribe anytime</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}