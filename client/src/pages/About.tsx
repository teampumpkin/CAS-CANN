import { motion } from 'framer-motion';
import { Users, Target, Heart, Shield, BookOpen, Network, UserCheck, Globe } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: Heart,
      title: 'Patient-Centered',
      description: 'We elevate lived experience alongside clinical and scientific expertise.'
    },
    {
      icon: Network,
      title: 'Collaborative',
      description: 'We bridge sectors and geographies to drive collective impact.'
    },
    {
      icon: BookOpen,
      title: 'Evidence-Informed',
      description: 'We prioritize data, research, and clinical excellence.'
    },
    {
      icon: Shield,
      title: 'Transparent',
      description: 'We uphold clarity, governance, and responsible leadership.'
    }
  ];

  const services = [
    'Curate a national Directory of clinics, care teams, and resources',
    'Facilitate access to tools that support earlier and more accurate diagnosis',
    'Share trusted information for patients, families, and care providers',
    'Enable clinicians to upload, share, and adapt resources',
    'Convene a national Executive Committee for strategic alignment'
  ];

  const partners = [
    { name: 'TAC', logo: '/api/placeholder/120/60', url: '#' },
    { name: 'CANN', logo: '/api/placeholder/120/60', url: '#' },
    { name: 'ARC', logo: '/api/placeholder/120/60', url: '#' },
    { name: 'ISA', logo: '/api/placeholder/120/60', url: '#' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Background Elements */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
      <div className="fixed top-0 left-0 w-96 h-96 bg-[#00AFE6]/10 rounded-full blur-3xl -translate-x-48 -translate-y-48" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-[#00DD89]/10 rounded-full blur-3xl translate-x-48 translate-y-48" />
      
      <div className="relative z-10">
        {/* Header Section */}
        <section className="pt-32 pb-16">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold font-rosarivo mb-8 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                About CAS
              </h1>
              <p className="text-xl text-white/80 leading-relaxed">
                Connecting patients, clinicians, researchers, and advocates to improve outcomes in amyloidosis care.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Who We Are Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold font-rosarivo">Who We Are</h2>
                </div>
                <p className="text-lg text-white/80 leading-relaxed">
                  The Canadian Amyloidosis Society (CAS) is a clinician-led, patient-informed organization dedicated to increasing awareness, accelerating diagnosis, and improving coordinated care for people living with amyloidosis. We serve as a national platform to connect, align, and support individuals and institutions working across the amyloidosis spectrum.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold font-rosarivo">Our Vision</h2>
                </div>
                <p className="text-lg text-white/80 leading-relaxed">
                  A Canada where every person affected by amyloidosis receives timely, accurate diagnosis and high-quality care.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-6xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold font-rosarivo text-center mb-12">Our Values</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {values.map((value, index) => (
                  <motion.div
                    key={value.title}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <value.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                        <p className="text-white/70 leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold font-rosarivo">What We Do</h2>
                </div>
                <div className="space-y-4">
                  {services.map((service, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full mt-3 flex-shrink-0" />
                      <p className="text-white/80 leading-relaxed">{service}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Executive Committee Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold font-rosarivo">Executive Committee</h2>
                </div>
                <p className="text-lg text-white/80 leading-relaxed">
                  The CAS Executive Committee is composed of clinical leaders, researchers, strategic partners, and lived-experience advisors. This group guides platform strategy, ensures ethical oversight, and supports resource curation.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-16 pb-32">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-6xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold font-rosarivo text-center mb-12">Our Partners</h2>
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {partners.map((partner, index) => (
                    <motion.a
                      key={partner.name}
                      href={partner.url}
                      className="flex items-center justify-center p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center mb-3 mx-auto group-hover:bg-white/20 transition-colors">
                          <span className="text-xl font-bold text-white">{partner.name}</span>
                        </div>
                        <span className="text-sm text-white/70">{partner.name}</span>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}