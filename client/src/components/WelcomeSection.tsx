import { motion } from 'framer-motion';

export default function WelcomeSection() {
  return (
    <section 
      className="relative py-32 lg:py-40 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
      }}
    >
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-green-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl animate-float" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center"
        >
          {/* Glass morphism container */}
          <motion.div
            className="rounded-3xl p-12 md:p-16"
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)'
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 mb-8">
              <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full"></div>
              <span className="text-sm font-medium text-gray-600">Transforming Healthcare in Canada</span>
            </div>

            <motion.h2
              className="crawford-section-title text-gray-900 mb-8 relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              style={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Welcome to the Canadian Amyloidosis Society
            </motion.h2>

            <motion.p
              className="text-xl text-gray-700 leading-relaxed mb-8 crawford-body-text"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              We are a national organization dedicated to supporting patients, families, and healthcare 
              professionals in the fight against amyloidosis. Our mission is to accelerate awareness, 
              improve diagnosis, and advance care across Canada.
            </motion.p>

            <motion.p
              className="text-lg text-gray-600 leading-relaxed crawford-body-text"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
            >
              Whether you're newly diagnosed, a family member seeking information, or a healthcare 
              provider looking for resources, we're here to help you navigate this journey with 
              comprehensive support and evidence-based information.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}