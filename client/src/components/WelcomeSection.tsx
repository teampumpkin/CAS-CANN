import { motion } from 'framer-motion';

export default function WelcomeSection() {
  return (
    <section className="section-spacer bg-white">
      <div className="crawford-section">
        <div className="crawford-card">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Mission Text */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="heading-xl mb-8">
                Welcome to the Canadian Amyloidosis Society
              </h2>
              <p className="body-lg mb-6">
                We are Canada's leading organization dedicated to supporting patients, families, and healthcare professionals affected by amyloidosis. Our mission is to accelerate awareness, improve diagnosis, and enhance care for this complex group of diseases.
              </p>
              <p className="body-lg mb-10">
                Through education, advocacy, and community building, we work to ensure that every person affected by amyloidosis has access to the resources, support, and care they need to live their best life possible.
              </p>
              <motion.button
                className="btn-crawford-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn About Our Mission
              </motion.button>
            </motion.div>
            
            {/* Optional Image */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="overflow-hidden rounded-2xl" style={{ boxShadow: '0 8px 40px rgba(0, 0, 0, 0.08)' }}>
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