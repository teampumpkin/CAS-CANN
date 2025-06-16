import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';

export default function EventsNewsletterSection() {
  const events = [
    {
      date: 'Mar 15, 2024',
      time: '2:00 PM EST',
      title: 'Amyloidosis Research Symposium',
      location: 'Virtual Event',
      description: 'Join leading researchers and clinicians for the latest updates in amyloidosis treatment and diagnosis.'
    },
    {
      date: 'Apr 22, 2024', 
      time: '10:00 AM PST',
      title: 'Patient Support Workshop',
      location: 'Vancouver, BC',
      description: 'Interactive workshop for patients and caregivers focusing on managing daily life with amyloidosis.'
    }
  ];

  return (
    <section className="crawford-light-section">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Events Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-normal text-gray-900 mb-8 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Upcoming Events
            </motion.h2>

            <div className="space-y-6">
              {events.map((event, index) => (
                <motion.div
                  key={index}
                  className="crawford-card group cursor-pointer"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {event.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#00AFE6] transition-colors">
                        {event.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Newsletter Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="crawford-card h-full">
              <motion.h2
                className="text-3xl md:text-4xl font-normal text-gray-900 mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Stay Updated
              </motion.h2>

              <motion.p
                className="text-gray-600 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                Get the latest updates on amyloidosis research, events, and resources 
                delivered directly to your inbox.
              </motion.p>

              <motion.form
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                <div>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00AFE6] focus:border-transparent transition-all"
                  />
                </div>
                
                <div>
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00AFE6] focus:border-transparent transition-all"
                  />
                </div>

                <motion.button
                  type="submit"
                  className="w-full crawford-btn-primary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Subscribe to Newsletter
                </motion.button>
              </motion.form>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}