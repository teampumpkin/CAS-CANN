import { motion } from 'framer-motion';

export default function WelcomeSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-3xl p-12 lg:p-16" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)' }}>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Mission Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-8 leading-tight">
                Welcome to the Canadian Amyloidosis Society
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We are Canada's leading organization dedicated to supporting patients, families, and healthcare professionals affected by amyloidosis. Our mission is to accelerate awareness, improve diagnosis, and enhance care for this complex group of diseases.
              </p>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                Through education, advocacy, and community building, we work to ensure that every person affected by amyloidosis has access to the resources, support, and care they need to live their best life possible.
              </p>
              <motion.button
                className="bg-[#00AFE6] text-white px-8 py-3 rounded-full font-medium hover:bg-[#0099CC] transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Learn About Our Mission
              </motion.button>
            </motion.div>
            
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="overflow-hidden rounded-2xl" style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)' }}>
                <img 
                  src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                  alt="Healthcare professionals collaborating on patient care" 
                  className="w-full h-80 object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}