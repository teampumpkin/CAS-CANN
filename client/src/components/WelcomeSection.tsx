import { motion } from 'framer-motion';

export default function WelcomeSection() {
  return (
    <section className="py-24 bg-gradient-to-r from-[#F8FCFF] to-[#F8FFFB]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Mission Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="headline-lg mb-8">
              Welcome to the Canadian Amyloidosis Society
            </h2>
            <p className="body-lg mb-6">
              We are Canada's leading organization dedicated to supporting patients, families, and healthcare professionals affected by amyloidosis. Our mission is to accelerate awareness, improve diagnosis, and enhance care for this complex group of diseases.
            </p>
            <p className="body-lg mb-8">
              Through education, advocacy, and community building, we work to ensure that every person affected by amyloidosis has access to the resources, support, and care they need to live their best life possible.
            </p>
            <motion.button
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn About Our Mission
            </motion.button>
          </motion.div>
          
          {/* Optional Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="module-card p-0 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Healthcare professionals collaborating on patient care" 
                className="w-full h-80 object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}