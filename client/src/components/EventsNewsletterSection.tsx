import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';

const upcomingEvents = [
  {
    id: 1,
    title: 'Patient Education Webinar',
    date: 'April 15, 2024',
    time: '2:00 PM EST',
    location: 'Virtual Event',
    description: 'Understanding ATTR Amyloidosis: Diagnosis and Treatment Options',
    registrationLink: '#register'
  },
  {
    id: 2,
    title: 'Healthcare Provider Workshop',
    date: 'April 28, 2024',
    time: '9:00 AM EST',
    location: 'Toronto, ON',
    description: 'Early Recognition and Diagnostic Strategies for Amyloidosis',
    registrationLink: '#register'
  }
];

export default function EventsNewsletterSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-12">
              Upcoming Events
            </h2>

            <div className="space-y-6">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  className="bg-white rounded-2xl p-8 border border-gray-100"
                  style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)' }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ 
                    y: -4,
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                    transition: { duration: 0.2 }
                  }}
                >
                  <h3 className="text-xl font-medium text-gray-900 mb-4">
                    {event.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Calendar className="w-4 h-4 text-[#00AFE6]" />
                      <span className="text-sm">{event.date}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Clock className="w-4 h-4 text-[#00AFE6]" />
                      <span className="text-sm">{event.time}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-gray-600">
                      <MapPin className="w-4 h-4 text-[#00AFE6]" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                  </div>

                  <motion.a
                    href={event.registrationLink}
                    className="inline-flex items-center space-x-2 text-[#00AFE6] font-medium hover:text-[#0099CC] transition-colors duration-200"
                    whileHover={{ x: 5 }}
                  >
                    <span>Register Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.a>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <a
                href="#all-events"
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-[#00AFE6] transition-colors duration-200"
              >
                <span>View All Events</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          </motion.div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="bg-white rounded-3xl p-12 border border-gray-100" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)' }}>
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>

                <h2 className="text-3xl font-light text-gray-900 mb-4">
                  Stay Informed
                </h2>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  Get the latest updates on research, events, and resources delivered to your inbox monthly.
                </p>
              </div>

              <form className="space-y-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00AFE6] focus:border-transparent transition-all"
                    placeholder="Enter your first name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00AFE6] focus:border-transparent transition-all"
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="consent"
                    className="mt-1 w-4 h-4 text-[#00AFE6] border-gray-300 rounded focus:ring-[#00AFE6]"
                  />
                  <label htmlFor="consent" className="text-sm text-gray-600 leading-relaxed">
                    I agree to receive email communications from the Canadian Amyloidosis Society and understand I can unsubscribe at any time.
                  </label>
                </div>

                <motion.button
                  type="submit"
                  className="w-full bg-[#00AFE6] text-white py-4 rounded-xl font-medium hover:bg-[#0099CC] transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Subscribe to Newsletter
                </motion.button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                  Join 2,500+ subscribers getting monthly updates
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}