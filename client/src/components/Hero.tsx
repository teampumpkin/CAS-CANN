import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="min-h-screen bg-[#F8FAFB] flex items-center">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <motion.h1 
              className="headline-xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Supporting{' '}
              <span className="text-[#00AFE6]">Amyloidosis</span>{' '}
              Patients & Families
            </motion.h1>
            
            <motion.p 
              className="body-lg mb-12 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              The Canadian Amyloidosis Society provides comprehensive support, resources, and community for those affected by amyloidosis across Canada.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.button
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Find Support
              </motion.button>
              <motion.button
                className="btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Hero Card */}
          <motion.div
            className="module-card-large text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-3xl mx-auto mb-8 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">CAS</span>
            </div>
            <h3 className="headline-md mb-6">Your Journey, Our Support</h3>
            <p className="body-md mb-8">
              Connecting patients, families, and healthcare professionals across Canada with resources, community, and hope.
            </p>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-medium text-[#00AFE6] mb-2">500+</div>
                <div className="text-sm text-[#9CA3AF]">Patients Supported</div>
              </div>
              <div>
                <div className="text-2xl font-medium text-[#00DD89] mb-2">15</div>
                <div className="text-sm text-[#9CA3AF]">Support Groups</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
