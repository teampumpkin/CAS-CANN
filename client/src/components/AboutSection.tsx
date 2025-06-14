import { motion } from 'framer-motion';

const stats = [
  { number: "500+", label: "Patients Supported" },
  { number: "15", label: "Support Groups" },
  { number: "100+", label: "Healthcare Partners" },
  { number: "12", label: "Years of Service" }
];

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-gradient-to-b from-[#F8FCFF] to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl md:text-4xl font-light text-[#2D3748] mb-8 tracking-tight">
              About the Canadian Amyloidosis Society
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed font-light">
              Founded in 2010, the Canadian Amyloidosis Society is a national organization dedicated to supporting patients, families, and healthcare professionals affected by amyloidosis across Canada.
            </p>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed font-light">
              We provide comprehensive resources, foster community connections, and advocate for improved awareness and treatment options for this rare but serious condition.
            </p>
            <motion.button
              className="btn-primary"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Learn More About Us
            </motion.button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="bg-white p-2 rounded-3xl shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Healthcare professionals and patients in supportive meeting" 
                className="rounded-2xl w-full h-auto"
              />
            </div>
          </motion.div>
        </div>
        
        {/* Stats Section */}
        <motion.div 
          className="mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="grid md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -4 }}
              >
                <div className="text-2xl font-medium text-[#00AFE6] mb-3">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-light">
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
