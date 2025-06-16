import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Dr. Sarah Mitchell",
      role: "Cardiologist",
      avatar: "SM",
      rating: 5,
      text: "The Canadian Amyloidosis Society has been instrumental in connecting our patients with vital resources. Their comprehensive approach to patient education and support has significantly improved treatment outcomes in our practice."
    },
    {
      name: "Michael Thompson",
      role: "Patient Advocate",
      avatar: "MT",
      rating: 5,
      text: "CAS is by far one of the best healthcare support organizations we've worked with. Always on time, very creative, and really personable. We really enjoyed working with this team."
    },
    {
      name: "Dr. Jennifer Lee",
      role: "Hematologist",
      avatar: "JL", 
      rating: 5,
      text: "If you need a healthcare support organization, CAS is the team to call. They are getting in touch and are very good at integrating with existing clinical workflows. Would highly recommend."
    },
    {
      name: "Robert Chen",
      role: "Patient",
      avatar: "RC",
      rating: 5,
      text: "CAS has been professional, friendly, personable and easy to work with. They took time to understand my needs and provided excellent support throughout my treatment journey."
    },
    {
      name: "Dr. Amanda Foster", 
      role: "Nephrologist",
      avatar: "AF",
      rating: 5,
      text: "Throughout this process, CAS made it very easy and stress-free. They are knowledgeable, efficient and always available when needed. A proactive team."
    },
    {
      name: "Lisa Rodriguez",
      role: "Caregiver",
      avatar: "LR",
      rating: 5,
      text: "CAS developed comprehensive support resources for our family. They are incredible educators and always deliver exceptional care coordination that helps families navigate this complex condition."
    }
  ];

  return (
    <section className="relative py-32 lg:py-40 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-[#00AFE6]/10 to-[#00DD89]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-[#00DD89]/10 to-[#00AFE6]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full"></div>
            <span className="text-white/90 font-medium tracking-wide">Patient & Provider Testimonials</span>
          </motion.div>

          <motion.h2
            className="crawford-section-title text-white mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Trusted by Healthcare Providers & Patients
          </motion.h2>

          <motion.p
            className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Hear from the healthcare professionals and patients who trust CAS to provide comprehensive amyloidosis support and resources.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="group relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/30 transition-all duration-500 hover:bg-white/10 hover:shadow-2xl hover:shadow-[#00AFE6]/20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              {/* Animated glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00AFE6]/20 via-[#00DD89]/20 to-[#00AFE6]/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out skew-x-12" />
              </div>
              {/* Quote icon */}
              <div className="absolute -top-4 left-8">
                <div className="w-8 h-8 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                </div>
              </div>

              {/* Rating stars */}
              <div className="flex gap-1 mb-6 mt-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Testimonial text */}
              <p className="text-white/80 leading-relaxed mb-8 group-hover:text-white/90 transition-colors duration-300">
                "{testimonial.text}"
              </p>

              {/* Author info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">{testimonial.avatar}</span>
                </div>
                <div>
                  <h4 className="text-white font-bold">{testimonial.name}</h4>
                  <p className="text-white/60 text-sm">{testimonial.role}</p>
                </div>
              </div>

              {/* Gradient accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-3xl"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}