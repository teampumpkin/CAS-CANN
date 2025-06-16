import { motion } from 'framer-motion';

const quickLinks = [
  { id: 'support', title: 'FIND SUPPORT', description: 'CONNECT WITH PATIENT SUPPORT GROUPS' },
  { id: 'upload', title: 'UPLOAD RESOURCE', description: 'SHARE CLINICAL MATERIALS' },
  { id: 'join', title: 'JOIN CAS', description: 'BECOME PART OF OUR COMMUNITY' },
  { id: 'browse', title: 'BROWSE RESOURCES', description: 'EXPLORE OUR RESOURCE LIBRARY' }
];

export default function QuickLinksSection() {
  return (
    <section className="crawford-section bg-zinc-900">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.6, -0.05, 0.01, 0.99] }}
          viewport={{ once: true, margin: "-200px" }}
        >
          <h2 className="crawford-title mb-8">
            QUICK
            <br />
            <span className="crawford-gradient bg-clip-text text-transparent">
              ACTIONS
            </span>
          </h2>
          <p className="crawford-subtitle max-w-4xl mx-auto">
            Take action today to support the amyloidosis community and access the resources you need.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {quickLinks.map((link, index) => (
            <motion.div
              key={link.id}
              className="crawford-card crawford-card-hover p-12 text-center cursor-pointer group relative overflow-hidden"
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1, 
                delay: index * 0.15,
                ease: [0.6, -0.05, 0.01, 0.99]
              }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
            >
              <div className="absolute inset-0 crawford-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <motion.div
                  className="w-20 h-20 bg-zinc-800 group-hover:bg-gradient-to-br group-hover:from-[#00AFE6] group-hover:to-[#00DD89] rounded-full mx-auto mb-8 flex items-center justify-center transition-all duration-500"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <svg 
                    className="w-10 h-10 text-gray-400 group-hover:text-black transition-colors duration-500" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </motion.div>

                <h3 className="text-2xl font-bold mb-6 group-hover:text-white transition-colors duration-300">
                  {link.title}
                </h3>

                <p className="text-gray-400 group-hover:text-gray-300 uppercase tracking-wider text-sm leading-relaxed transition-colors duration-300">
                  {link.description}
                </p>

                <motion.div
                  className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-px bg-[#00AFE6] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}