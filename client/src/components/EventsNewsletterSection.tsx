import { motion } from 'framer-motion';

const upcomingEvents = [
  {
    id: 1,
    title: 'PATIENT EDUCATION WEBINAR',
    date: 'APRIL 15, 2024',
    time: '2:00 PM EST',
    location: 'VIRTUAL EVENT',
    description: 'Understanding ATTR Amyloidosis: Diagnosis and Treatment Options'
  },
  {
    id: 2,
    title: 'HEALTHCARE PROVIDER WORKSHOP',
    date: 'APRIL 28, 2024',
    time: '9:00 AM EST',
    location: 'TORONTO, ON',
    description: 'Early Recognition and Diagnostic Strategies for Amyloidosis'
  }
];

export default function EventsNewsletterSection() {
  return (
    <section className="crawford-section bg-zinc-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="crawford-asymmetric">
          <motion.div
            className="crawford-content-left"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.6, -0.05, 0.01, 0.99] }}
            viewport={{ once: true, margin: "-200px" }}
          >
            <motion.h2
              className="crawford-title mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
            >
              UPCOMING
              <br />
              <span className="crawford-gradient bg-clip-text text-transparent">
                EVENTS
              </span>
            </motion.h2>

            <div className="space-y-8">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  className="crawford-card crawford-card-hover p-8 border-l-4 border-[#00AFE6]"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 + (index * 0.2) }}
                  viewport={{ once: true }}
                >
                  <div className="mb-4">
                    <div className="text-sm uppercase tracking-wider text-[#00AFE6] font-bold mb-2">
                      {event.date} • {event.time}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                      {event.title}
                    </h3>
                    <div className="text-gray-400 uppercase tracking-wider text-sm mb-4">
                      {event.location}
                    </div>
                  </div>
                  
                  <p className="text-gray-400 leading-relaxed mb-6">
                    {event.description}
                  </p>

                  <motion.button
                    className="crawford-btn-outline"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    REGISTER NOW
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="crawford-content-right"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.6, -0.05, 0.01, 0.99] }}
            viewport={{ once: true, margin: "-200px" }}
          >
            <motion.div
              className="crawford-card crawford-card-hover p-12 relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="absolute top-0 left-0 w-32 h-32 crawford-gradient opacity-10 rounded-br-full"></div>
              
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 crawford-gradient rounded-full mx-auto mb-8 flex items-center justify-center">
                  <svg className="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>

                <h2 className="text-4xl font-bold mb-6">
                  STAY
                  <br />
                  <span className="crawford-gradient bg-clip-text text-transparent">
                    INFORMED
                  </span>
                </h2>
                
                <p className="crawford-subtitle mb-10">
                  Get the latest updates on research, events, and resources delivered monthly.
                </p>

                <form className="space-y-6 mb-8">
                  <input
                    type="text"
                    placeholder="YOUR NAME"
                    className="w-full px-6 py-4 bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 uppercase tracking-wider text-sm focus:outline-none focus:border-[#00AFE6] transition-colors"
                  />

                  <input
                    type="email"
                    placeholder="YOUR EMAIL ADDRESS"
                    className="w-full px-6 py-4 bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 uppercase tracking-wider text-sm focus:outline-none focus:border-[#00AFE6] transition-colors"
                  />

                  <motion.button
                    type="submit"
                    className="crawford-btn w-full"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    SUBSCRIBE TO NEWSLETTER
                  </motion.button>
                </form>

                <div className="text-gray-500 text-sm uppercase tracking-wider">
                  JOIN 2,500+ SUBSCRIBERS
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}