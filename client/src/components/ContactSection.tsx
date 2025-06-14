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
    <section id="contact" className="section-spacer bg-white">
      <div className="crawford-section">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="heading-xl mb-8">
            Get in Touch
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Have questions or need support? We're here to help. Reach out to us through any of the methods below.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="space-y-8">
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <motion.div
                    key={info.title}
                    className="flex items-start space-x-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                    viewport={{ once: true, margin: "-50px" }}
                  >
                    <div className={`w-12 h-12 ${info.bgColor} rounded-2xl flex items-center justify-center flex-shrink-0`}
                         style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)' }}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="heading-lg mb-3">
                        {info.title}
                      </h3>
                      {info.href ? (
                        <a href={info.href} className="link-crawford">
                          {info.content}
                        </a>
                      ) : (
                        <p className="body-lg whitespace-pre-line">
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
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <form onSubmit={handleSubmit} className="crawford-card">
              <div className="mb-8">
                <label htmlFor="name" className="block body-lg font-medium text-[#1a1a1a] mb-4">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-crawford"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="mb-8">
                <label htmlFor="email" className="block body-lg font-medium text-[#1a1a1a] mb-4">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-crawford"
                  placeholder="Enter your email address"
                />
              </div>
              
              <div className="mb-8">
                <label htmlFor="subject" className="block body-lg font-medium text-[#1a1a1a] mb-4">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="input-crawford"
                >
                  <option value="">Select a subject</option>
                  <option value="support">Patient Support</option>
                  <option value="clinical">Clinical Resources</option>
                  <option value="general">General Inquiry</option>
                  <option value="volunteer">Volunteer Opportunities</option>
                </select>
              </div>
              
              <div className="mb-10">
                <label htmlFor="message" className="block body-lg font-medium text-[#1a1a1a] mb-4">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="input-crawford resize-none"
                  placeholder="Enter your message"
                />
              </div>
              
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="btn-crawford-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
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
