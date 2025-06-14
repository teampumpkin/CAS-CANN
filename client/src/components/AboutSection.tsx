import { motion } from 'framer-motion';

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-16 items-center">
          {/* Content */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="headline-lg mb-8">
              About the Canadian Amyloidosis Society
            </h2>
            <p className="body-lg mb-6">
              Founded in 2010, the Canadian Amyloidosis Society is a national organization dedicated to supporting patients, families, and healthcare professionals affected by amyloidosis across Canada.
            </p>
            <p className="body-lg mb-10">
              We provide comprehensive resources, foster community connections, and advocate for improved awareness and treatment options for this rare but serious condition.
            </p>
            <motion.button
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More About Us
            </motion.button>
          </motion.div>
          
          {/* Image Card */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="module-card p-0 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Healthcare professionals and patients in supportive meeting" 
                className="w-full h-80 object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
