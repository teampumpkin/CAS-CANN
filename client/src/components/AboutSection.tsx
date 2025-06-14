import { motion } from 'framer-motion';

const stats = [
  { number: "500+", label: "Patients Supported" },
  { number: "15", label: "Support Groups" },
  { number: "100+", label: "Healthcare Partners" },
  { number: "12", label: "Years of Service" }
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-[#E6F7FF] to-[#E6FFF4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              About the Canadian Amyloidosis Society
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Founded in 2010, the Canadian Amyloidosis Society is a national organization dedicated to supporting patients, families, and healthcare professionals affected by amyloidosis across Canada.
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
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
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <img 
              src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Healthcare professionals and patients in supportive meeting" 
              className="rounded-2xl shadow-lg w-full h-auto"
            />
          </motion.div>
        </div>
        
        {/* Stats Section */}
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bg-white p-6 rounded-2xl shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl font-bold text-[#00AFE6] mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
