import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Us',
    description: 'General inquiries and support',
    value: 'info@amyloidosis.ca',
    href: 'mailto:info@amyloidosis.ca'
  },
  {
    icon: Phone,
    title: 'Call Us',
    description: 'Patient support line',
    value: '1-800-AMYLOID',
    href: 'tel:1-800-269-5643'
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    description: 'Head office location',
    value: 'Toronto, Ontario',
    href: '#location'
  },
  {
    icon: Clock,
    title: 'Office Hours',
    description: 'Monday to Friday',
    value: '9:00 AM - 5:00 PM EST',
    href: null
  }
];

export default function ContactSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-8">
            Get in Touch
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Have questions about amyloidosis, need support, or want to get involved? 
            We're here to help connect you with the resources and community you need.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h3 className="text-2xl font-medium text-gray-900 mb-12">
              Contact Information
            </h3>

            <div className="space-y-8">
              {contactMethods.map((method, index) => {
                const IconComponent = method.icon;
                return (
                  <motion.div
                    key={method.title}
                    className="flex items-start space-x-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true, margin: "-50px" }}
                  >
                    <div className="w-12 h-12 bg-[#00AFE6] bg-opacity-10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-[#00AFE6]" />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        {method.title}
                      </h4>
                      <p className="text-gray-600 mb-2">
                        {method.description}
                      </p>
                      {method.href ? (
                        <a
                          href={method.href}
                          className="text-[#00AFE6] font-medium hover:text-[#0099CC] transition-colors duration-200"
                        >
                          {method.value}
                        </a>
                      ) : (
                        <span className="text-gray-900 font-medium">
                          {method.value}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div 
              className="mt-12 p-8 bg-white rounded-2xl border border-gray-100"
              style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Emergency Support
              </h4>
              <p className="text-gray-600 mb-4 leading-relaxed">
                If you're experiencing a medical emergency, please contact your local emergency services immediately or visit your nearest emergency room.
              </p>
              <p className="text-sm text-gray-500">
                For urgent amyloidosis-related questions outside business hours, our patient support team can be reached through our emergency contact line.
              </p>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="bg-white rounded-3xl p-10 border border-gray-100" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)' }}>
              <h3 className="text-2xl font-medium text-gray-900 mb-8">
                Send us a Message
              </h3>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00AFE6] focus:border-transparent transition-all"
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00AFE6] focus:border-transparent transition-all"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00AFE6] focus:border-transparent transition-all"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00AFE6] focus:border-transparent transition-all bg-white"
                  >
                    <option value="">Select a topic</option>
                    <option value="patient-support">Patient Support</option>
                    <option value="healthcare-provider">Healthcare Provider Inquiry</option>
                    <option value="research">Research Collaboration</option>
                    <option value="volunteer">Volunteer Opportunities</option>
                    <option value="general">General Information</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00AFE6] focus:border-transparent transition-all resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="privacy"
                    className="mt-1 w-4 h-4 text-[#00AFE6] border-gray-300 rounded focus:ring-[#00AFE6]"
                  />
                  <label htmlFor="privacy" className="text-sm text-gray-600 leading-relaxed">
                    I agree to the privacy policy and consent to my information being used to respond to my inquiry.
                  </label>
                </div>

                <motion.button
                  type="submit"
                  className="w-full bg-[#00AFE6] text-white py-4 rounded-xl font-medium hover:bg-[#0099CC] transition-colors duration-200 flex items-center justify-center space-x-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </motion.button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                  We typically respond within 24-48 hours during business days.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}