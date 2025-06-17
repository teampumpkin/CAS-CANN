import { motion } from 'framer-motion';
import { Mail, Upload, Users, MessageCircle, ExternalLink } from 'lucide-react';
import ParallaxBackground from '../components/ParallaxBackground';

export default function Contact() {
  const contactSections = [
    {
      icon: MessageCircle,
      title: 'General Inquiries',
      description: 'For questions about the Canadian Amyloidosis Society, media requests, or collaboration opportunities, please contact:',
      email: 'info@amyloidosis.ca',
      gradient: 'from-[#00AFE6] to-[#00DD89]'
    },
    {
      icon: Upload,
      title: 'Resource Upload or Directory Edits',
      description: 'To submit a new resource or update a clinic listing, please use the relevant form on this site. For follow-up on existing submissions, include your contributor ID in your message.',
      links: [
        { text: 'Upload Resource', url: '/upload-resource' },
        { text: 'Directory Updates', url: '/directory' }
      ],
      gradient: 'from-[#00DD89] to-[#00AFE6]'
    },
    {
      icon: Users,
      title: 'Join CAS',
      description: 'If you\'d like to become a member or stay updated on our work, visit the Join CAS section to register.',
      links: [
        { text: 'Join CAS', url: '/get-involved' }
      ],
      gradient: 'from-purple-500 to-[#00AFE6]'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <ParallaxBackground className="min-h-[60vh] flex items-center relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#00AFE6]/20 rounded-full blur-3xl -translate-x-48 -translate-y-48" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00DD89]/20 rounded-full blur-3xl translate-x-48 translate-y-48" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 mb-6">
              <Mail className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-sm font-medium text-white/90">Get in Touch</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold font-rosarivo mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Contact
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Us
              </span>
            </h1>
            
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              We welcome questions, insights, and collaboration.
            </p>
          </motion.div>
        </div>
      </ParallaxBackground>

      {/* Contact Sections */}
      <section className="py-24 bg-gray-900 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto space-y-12">
            {contactSections.map((section, index) => (
              <motion.div
                key={section.title}
                className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-6">
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${section.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <section.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold font-rosarivo text-white mb-4">
                      {section.title}
                    </h2>
                    
                    <p className="text-white/80 text-lg leading-relaxed mb-6">
                      {section.description}
                    </p>
                    
                    {/* Email */}
                    {section.email && (
                      <motion.a
                        href={`mailto:${section.email}`}
                        className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Mail className="w-5 h-5 text-[#00AFE6] group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-white font-semibold">{section.email}</span>
                        <ExternalLink className="w-4 h-4 text-white/60 group-hover:text-[#00AFE6] transition-colors duration-300" />
                      </motion.a>
                    )}
                    
                    {/* Links */}
                    {section.links && (
                      <div className="flex flex-wrap gap-4">
                        {section.links.map((link, linkIndex) => (
                          <motion.a
                            key={linkIndex}
                            href={link.url}
                            className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="text-white font-semibold">{link.text}</span>
                            <ExternalLink className="w-4 h-4 text-white/60 group-hover:text-[#00AFE6] transition-colors duration-300" />
                          </motion.a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-16 bg-gray-900 border-t border-white/10">
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-3xl mx-auto text-center bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl mx-auto mb-6 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-4">
              We Value Your Input
            </h3>
            
            <p className="text-white/70 leading-relaxed">
              The Canadian Amyloidosis Society is committed to fostering collaboration across the amyloidosis community. Whether you're a healthcare professional, researcher, patient, or family member, we welcome your questions and look forward to connecting with you.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}