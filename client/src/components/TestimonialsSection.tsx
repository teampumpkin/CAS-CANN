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
    <section className="crawford-dark-section">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-16">
          <div>
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-white/10 text-white/80 rounded-full text-sm font-medium mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              💬 Testimonials
            </motion.div>

            <motion.h2
              className="crawford-section-title text-white mb-0"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Over 200+ Reviews
            </motion.h2>
          </div>

          <motion.button
            className="crawford-btn-secondary bg-white/10 border-white/20 text-white hover:bg-white/20"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            View all
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              {/* Stars */}
              <div className="flex space-x-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-white/90 leading-relaxed mb-8 text-sm">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-white font-medium text-sm">{testimonial.name}</div>
                  <div className="text-white/60 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}