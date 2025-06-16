import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    content: 'info@amyloidosis.ca',
    href: 'mailto:info@amyloidosis.ca',
    bgColor: 'bg-[#00AFE6]'
  },
  {
    icon: Phone,
    title: 'Phone',
    content: '1-800-555-0123',
    href: 'tel:+1-800-555-0123',
    bgColor: 'bg-[#00DD89]'
  },
  {
    icon: MapPin,
    title: 'Address',
    content: '123 Health Street\nToronto, ON M5V 3A8',
    href: null,
    bgColor: 'bg-gray-500'
  }
];

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      toast({
        title: "Message sent successfully!",
        description: "We will get back to you soon.",
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
            Get in Touch
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Have questions or need support? We're here to help. Reach out to us through any of the methods below.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="space-y-8">
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <motion.div
                    key={info.title}
                    className="flex items-start space-x-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true, margin: "-50px" }}
                  >
                    <div className={`w-10 h-10 ${info.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {info.title}
                      </h3>
                      {info.href ? (
                        <a href={info.href} className="text-[#00AFE6] hover:text-[#0099CC] transition-colors">
                          {info.content}
                        </a>
                      ) : (
                        <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                          {info.content}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
          
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)' }}>
              <div className="mb-6">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-3">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00AFE6] focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-3">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00AFE6] focus:border-transparent transition-all"
                  placeholder="Enter your email address"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-3">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00AFE6] focus:border-transparent transition-all"
                >
                  <option value="">Select a subject</option>
                  <option value="support">Patient Support</option>
                  <option value="clinical">Clinical Resources</option>
                  <option value="general">General Inquiry</option>
                  <option value="volunteer">Volunteer Opportunities</option>
                </select>
              </div>
              
              <div className="mb-8">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-3">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00AFE6] focus:border-transparent transition-all resize-none"
                  placeholder="Enter your message"
                />
              </div>
              
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#00AFE6] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#0099CC] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
