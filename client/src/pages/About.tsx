import { motion } from 'framer-motion';
import { Users, Target, Heart, Shield, BookOpen, Network, UserCheck, Globe, ArrowRight, Stethoscope, Building2, Award } from 'lucide-react';
import ParallaxBackground from '../components/ParallaxBackground';

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
      {/* Hero Section with Parallax */}
      <ParallaxBackground className="min-h-screen flex items-center relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#00AFE6]/20 rounded-full blur-3xl -translate-x-48 -translate-y-48" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00DD89]/20 rounded-full blur-3xl translate-x-48 translate-y-48" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.6, -0.05, 0.01, 0.99] }}
            >
              <motion.div
                className="inline-block mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20">
                  <Heart className="w-4 h-4 text-[#00AFE6]" />
                  <span className="text-sm font-medium text-white/90">About Canadian Amyloidosis Society</span>
                </div>
              </motion.div>
              
              <motion.h1
                className="text-5xl lg:text-7xl font-bold font-rosarivo mb-8 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                  Connecting
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                  Healthcare
                </span>
                <br />
                <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                  Canada
                </span>
              </motion.h1>
              
              <motion.p
                className="text-xl text-white/70 leading-relaxed mb-10 max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Connecting patients, clinicians, researchers, and advocates to improve outcomes in amyloidosis care across Canada.
              </motion.p>
              
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <button className="group bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-8 py-4 rounded-full font-medium hover:shadow-2xl hover:shadow-[#00AFE6]/25 transition-all duration-300 flex items-center gap-2">
                  Our Mission
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="bg-white/10 backdrop-blur-xl text-white px-8 py-4 rounded-full font-medium border border-white/20 hover:bg-white/20 transition-all duration-300">
                  Get Involved
                </button>
              </motion.div>
            </motion.div>
            
            {/* Hero Visual */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <div className="relative">
                {/* Main visual card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-[#00AFE6]/20 to-[#00DD89]/20 rounded-2xl p-6 text-center">
                      <Stethoscope className="w-8 h-8 text-[#00AFE6] mx-auto mb-3" />
                      <div className="text-2xl font-bold text-white">50+</div>
                      <div className="text-sm text-white/70">Clinicians</div>
                    </div>
                    <div className="bg-gradient-to-r from-[#00DD89]/20 to-[#00AFE6]/20 rounded-2xl p-6 text-center">
                      <Building2 className="w-8 h-8 text-[#00DD89] mx-auto mb-3" />
                      <div className="text-2xl font-bold text-white">25+</div>
                      <div className="text-sm text-white/70">Institutions</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <Award className="w-12 h-12 text-white/50 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">National Platform</h3>
                    <p className="text-white/60 text-sm">Connecting the amyloidosis community across Canada</p>
                  </div>
                </div>
                
                {/* Floating elements */}
                <motion.div
                  className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-2xl flex items-center justify-center"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Heart className="w-8 h-8 text-white" />
                </motion.div>
                
                <motion.div
                  className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 flex items-center justify-center"
                  animate={{ 
                    x: [0, 10, 0],
                    y: [0, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                >
                  <Users className="w-6 h-6 text-white/70" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </ParallaxBackground>

      {/* Who We Are Section */}
      <section className="py-24 relative bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content Column - Left Side */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Users className="w-5 h-5 text-[#00AFE6]" />
                <span className="text-sm font-medium text-white/90">Who We Are</span>
              </motion.div>
              
              <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  Clinician-Led,
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                  Patient-Informed
                </span>
              </h2>
              
              <p className="text-lg text-white/70 leading-relaxed mb-8">
                The Canadian Amyloidosis Society (CAS) is dedicated to increasing awareness, accelerating diagnosis, and improving coordinated care for people living with amyloidosis. We serve as a national platform to connect, align, and support individuals and institutions working across the amyloidosis spectrum.
              </p>
              
              <div className="flex gap-4">
                <div className="bg-gradient-to-r from-[#00AFE6]/20 to-[#00DD89]/20 rounded-xl p-4 flex-1">
                  <div className="text-2xl font-bold text-white mb-1">100%</div>
                  <div className="text-sm text-white/70">Clinician-Led</div>
                </div>
                <div className="bg-gradient-to-r from-[#00DD89]/20 to-[#00AFE6]/20 rounded-xl p-4 flex-1">
                  <div className="text-2xl font-bold text-white mb-1">Canada</div>
                  <div className="text-sm text-white/70">Nationwide</div>
                </div>
              </div>
            </motion.div>
            
            {/* Image Column - Right Side */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10">
                <div className="aspect-[4/5] relative">
                  <img 
                    src="/assets/DSC_0022_1750141054185.jpg" 
                    alt="Modern healthcare facility representing the Canadian Amyloidosis Society's clinical network"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Stats Overlay */}
                  <motion.div
                    className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl shadow-2xl"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    <div className="px-6 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <motion.div
                          className="text-center"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.6 }}
                        >
                          <div className="text-2xl font-bold bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                            50+
                          </div>
                          <div className="text-xs text-white/80">Expert Clinicians</div>
                        </motion.div>
                        
                        <motion.div
                          className="text-center"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.7 }}
                        >
                          <div className="text-2xl font-bold bg-gradient-to-r from-[#00DD89] to-[#00AFE6] bg-clip-text text-transparent">
                            10
                          </div>
                          <div className="text-xs text-white/80">Provinces</div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 bg-gray-900 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image Column - Left Side */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10">
                <div className="aspect-[4/5] relative">
                  <div className="w-full h-full bg-gradient-to-br from-[#00DD89]/20 to-[#00AFE6]/20 flex items-center justify-center">
                    <div className="text-center text-white/60">
                      <Target className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-sm">Vision Illustration Placeholder</p>
                    </div>
                  </div>
                  
                  {/* Floating accent elements */}
                  <motion.div
                    className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-2xl flex items-center justify-center"
                    animate={{ 
                      y: [0, -8, 0],
                      rotate: [0, 5, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Heart className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
            
            {/* Content Column - Right Side */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Target className="w-5 h-5 text-[#00AFE6]" />
                <span className="text-sm font-medium text-white/90">Our Vision</span>
              </motion.div>
              
              <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  A Better
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                  Future
                </span>
              </h2>
              
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#00AFE6]/20 to-[#00DD89]/20 rounded-full blur-2xl -translate-y-12 translate-x-12" />
                
                <div className="relative z-10">
                  <blockquote className="text-xl text-white/90 leading-relaxed font-medium italic border-l-4 border-[#00AFE6] pl-6 mb-6">
                    "A Canada where every person affected by amyloidosis receives timely, accurate diagnosis and high-quality care."
                  </blockquote>
                  
                  <p className="text-white/70 leading-relaxed">
                    We envision a healthcare system where amyloidosis is recognized early, managed effectively, and where patients and families receive the support they need throughout their journey.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 mb-6">
              <Shield className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-sm font-medium text-white/90">Our Values</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-6">
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Guided by
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Core Principles
              </span>
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 font-rosarivo">{value.title}</h3>
                    <p className="text-white/70 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-24 bg-gray-900 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 mb-6">
                <Globe className="w-5 h-5 text-[#00AFE6]" />
                <span className="text-sm font-medium text-white/90">What We Do</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  Building
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                  Connections
                </span>
              </h2>
              
              <p className="text-lg text-white/70 leading-relaxed mb-8">
                We create pathways for collaboration, knowledge sharing, and coordinated care across Canada's amyloidosis community.
              </p>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10">
                <div className="aspect-[4/5] relative">
                  <div className="w-full h-full bg-gradient-to-br from-[#00AFE6]/20 to-[#00DD89]/20 flex items-center justify-center">
                    <div className="text-center text-white/60">
                      <Globe className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-sm">Network Illustration Placeholder</p>
                    </div>
                  </div>
                  
                  {/* Services Overlay */}
                  <motion.div
                    className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl shadow-2xl"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-white mb-3">Our Services</h3>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {services.slice(0, 3).map((service, index) => (
                          <motion.div
                            key={index}
                            className="flex items-start gap-2"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                            viewport={{ once: true }}
                          >
                            <div className="w-1.5 h-1.5 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full mt-2 flex-shrink-0" />
                            <p className="text-xs text-white/80 leading-relaxed">{service}</p>
                          </motion.div>
                        ))}
                        <div className="text-xs text-white/60 pt-1">+{services.length - 3} more services</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Floating accent elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-[#00DD89] to-[#00AFE6] rounded-2xl flex items-center justify-center"
                  animate={{ 
                    y: [0, -8, 0],
                    rotate: [0, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Network className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Executive Committee Section */}
      <section className="py-24 bg-gray-900 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content Column - Left Side */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <UserCheck className="w-5 h-5 text-[#00AFE6]" />
                <span className="text-sm font-medium text-white/90">Leadership</span>
              </motion.div>
              
              <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  Executive
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                  Committee
                </span>
              </h2>
              
              <p className="text-lg text-white/70 leading-relaxed mb-8">
                The CAS Executive Committee is composed of clinical leaders, researchers, strategic partners, and lived-experience advisors. This group guides platform strategy, ensures ethical oversight, and supports resource curation.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full mt-3 flex-shrink-0" />
                  <p className="text-white/70">Clinical leaders from across Canada</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full mt-3 flex-shrink-0" />
                  <p className="text-white/70">Research specialists and academic partners</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full mt-3 flex-shrink-0" />
                  <p className="text-white/70">Lived-experience advisors and patient advocates</p>
                </div>
              </div>
            </motion.div>
            
            {/* Image Column - Right Side */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10">
                <div className="aspect-[4/5] relative">
                  <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-[#00AFE6]/20 flex items-center justify-center">
                    <div className="text-center text-white/60">
                      <UserCheck className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-sm">Committee Photo Placeholder</p>
                    </div>
                  </div>
                  
                  {/* Leadership Stats Overlay */}
                  <motion.div
                    className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl shadow-2xl"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    <div className="px-6 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <motion.div
                          className="text-center"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.6 }}
                        >
                          <div className="text-2xl font-bold bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                            12
                          </div>
                          <div className="text-xs text-white/80">Committee Members</div>
                        </motion.div>
                        
                        <motion.div
                          className="text-center"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.7 }}
                        >
                          <div className="text-2xl font-bold bg-gradient-to-r from-[#00DD89] to-[#00AFE6] bg-clip-text text-transparent">
                            5
                          </div>
                          <div className="text-xs text-white/80">Specialties</div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Floating accent elements */}
                <motion.div
                  className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-purple-500 to-[#00AFE6] rounded-2xl flex items-center justify-center"
                  animate={{ 
                    y: [0, -8, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                >
                  <Award className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-24 pb-32 bg-gray-900 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image Column - Left Side */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10">
                <div className="aspect-[4/5] relative">
                  <div className="w-full h-full bg-gradient-to-br from-green-500/20 to-[#00DD89]/20 flex items-center justify-center">
                    <div className="text-center text-white/60">
                      <Network className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-sm">Partnership Network Placeholder</p>
                    </div>
                  </div>
                  
                  {/* Partnership Stats Overlay */}
                  <motion.div
                    className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl shadow-2xl"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    <div className="px-6 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <motion.div
                          className="text-center"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.6 }}
                        >
                          <div className="text-2xl font-bold bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                            15+
                          </div>
                          <div className="text-xs text-white/80">Strategic Partners</div>
                        </motion.div>
                        
                        <motion.div
                          className="text-center"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.7 }}
                        >
                          <div className="text-2xl font-bold bg-gradient-to-r from-[#00DD89] to-[#00AFE6] bg-clip-text text-transparent">
                            3
                          </div>
                          <div className="text-xs text-white/80">Countries</div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Floating accent elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-green-500 to-[#00DD89] rounded-2xl flex items-center justify-center"
                  animate={{ 
                    y: [0, -8, 0],
                    rotate: [0, -5, 0]
                  }}
                  transition={{ 
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                >
                  <Users className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </motion.div>
            
            {/* Content Column - Right Side */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Network className="w-5 h-5 text-[#00AFE6]" />
                <span className="text-sm font-medium text-white/90">Our Partners</span>
              </motion.div>
              
              <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  Strategic
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                  Partnerships
                </span>
              </h2>
              
              <p className="text-lg text-white/70 leading-relaxed mb-8">
                We collaborate with leading organizations, research institutions, and healthcare networks to amplify our impact and accelerate progress in amyloidosis care across Canada and internationally.
              </p>
              
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Key Partners</h3>
                <div className="grid grid-cols-2 gap-4">
                  {partners.map((partner, index) => (
                    <motion.div
                      key={partner.name}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">{partner.name}</span>
                      </div>
                      <span className="text-sm text-white/80 font-medium">{partner.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full mt-3 flex-shrink-0" />
                  <p className="text-white/70">International amyloidosis organizations</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full mt-3 flex-shrink-0" />
                  <p className="text-white/70">Leading Canadian research institutions</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full mt-3 flex-shrink-0" />
                  <p className="text-white/70">Healthcare networks and specialty centers</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}