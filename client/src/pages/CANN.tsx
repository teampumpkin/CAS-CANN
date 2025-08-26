import { motion } from 'framer-motion';
import { Network, Users, Heart, Search, Target, ArrowLeft, MapPin, Globe, Award, Zap } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'wouter';
import ParallaxBackground from '../components/ParallaxBackground';
import medicalResearchImg from '@assets/DSC02841_1750068895454.jpg';
import cannLogoImg from '@assets/CANN-RGB-dark-theme_1756219144378.png';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CANN() {
  const { language } = useLanguage();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const networkData = {
    mission: {
      title: "Connecting Healthcare Professionals",
      description: "The Canadian Amyloidosis Network (CANN) is a collaborative initiative that brings together healthcare professionals, researchers, and institutions across Canada to improve amyloidosis care and research.",
      keyPoints: [
        "Multidisciplinary approach to amyloidosis care",
        "Knowledge sharing and best practice development",
        "Collaborative research initiatives and clinical trials",
        "Professional development and training programs"
      ]
    },
    objectives: [
      {
        title: "Enhance Care Quality",
        description: "Standardize and improve amyloidosis care across Canada through evidence-based protocols and shared expertise.",
        icon: Heart,
        color: "from-pink-500 to-rose-500"
      },
      {
        title: "Accelerate Research",
        description: "Facilitate collaborative research projects and clinical trials to advance understanding and treatment options.",
        icon: Search,
        color: "from-purple-500 to-pink-500"
      },
      {
        title: "Build Capacity",
        description: "Develop healthcare professional capacity through training, education, and knowledge exchange programs.",
        icon: Users,
        color: "from-fuchsia-500 to-purple-500"
      },
      {
        title: "Improve Outcomes",
        description: "Create measurable improvements in patient outcomes through coordinated care and research efforts.",
        icon: Target,
        color: "from-violet-500 to-fuchsia-500"
      }
    ],
    network: {
      coverage: "National Coverage",
      centers: "25+ Healthcare Centers",
      provinces: "All 10 Provinces",
      territories: "3 Territories"
    },
    achievements: [
      {
        title: "Research Excellence",
        description: "Leading 12 active research projects and clinical trials across multiple amyloidosis types.",
        stat: "12+",
        label: "Active Studies"
      },
      {
        title: "Professional Training",
        description: "Trained over 200 healthcare professionals in specialized amyloidosis care and diagnosis.",
        stat: "200+",
        label: "Professionals Trained"
      },
      {
        title: "Patient Impact",
        description: "Improved care pathways have reduced average diagnosis time by 40% in network centers.",
        stat: "40%",
        label: "Faster Diagnosis"
      },
      {
        title: "Knowledge Sharing",
        description: "Published 35+ peer-reviewed articles and clinical guidelines through network collaboration.",
        stat: "35+",
        label: "Publications"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <ParallaxBackground>{null}</ParallaxBackground>
      
      {/* Hero Section */}
      <section className="py-32 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-black" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-gray-900/5 dark:via-white/5 to-transparent" />
        
        {/* Floating accent elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-96 h-96 bg-gradient-to-r from-pink-500/10 to-purple-600/10 rounded-full"
              style={{
                left: `${20 + i * 20}%`,
                top: `${10 + i * 15}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >

            
            <div className="text-center">
              {/* CANN Logo */}
              <div className="mb-8">
                <img 
                  src={cannLogoImg}
                  alt="Canadian Amyloidosis Nursing Network Logo"
                  className="h-16 sm:h-20 md:h-24 lg:h-28 xl:h-32 max-w-full w-auto mx-auto object-contain"
                />
              </div>
              
              <div className="inline-flex items-center gap-3 bg-pink-500/10 dark:bg-pink-400/10 backdrop-blur-xl rounded-full px-6 py-3 border border-pink-500/20 dark:border-pink-400/20 mb-6">
                <Network className="w-5 h-5 text-pink-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-white/90">Professional Network</span>
              </div>
            
              <h1 className="text-4xl lg:text-6xl font-bold font-rosarivo mb-6 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                  Canadian Amyloidosis
                </span>
                <br />
                <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  Nursing Network
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed max-w-3xl mx-auto">
                {networkData.mission.description}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Overview Section */}
      <section className="py-24 bg-white dark:bg-gray-900 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/5 dark:via-white/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Content Column */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-3 bg-pink-500/10 dark:bg-pink-400/10 backdrop-blur-xl rounded-full px-6 py-3 border border-pink-500/20 dark:border-pink-400/20 mb-6">
                  <Network className="w-5 h-5 text-pink-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-white/90">Our Mission</span>
                </div>
                
                <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                    {networkData.mission.title}
                  </span>
                </h2>
                
                <div className="space-y-6 text-gray-600 dark:text-white/70 leading-relaxed">
                  <p className="text-lg">
                    CANN represents a transformative approach to amyloidosis care in Canada, fostering collaboration between specialists, researchers, and healthcare institutions nationwide.
                  </p>
                  
                  <div className="space-y-4">
                    {networkData.mission.keyPoints.map((point, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-pink-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-white/80">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-pink-500/10 to-purple-600/10 border border-pink-500/20 rounded-2xl p-6 mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Network Impact</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-pink-600 font-medium">Coverage:</span>
                      <div className="text-gray-700 dark:text-white/80">{networkData.network.coverage}</div>
                    </div>
                    <div>
                      <span className="text-pink-600 font-medium">Centers:</span>
                      <div className="text-gray-700 dark:text-white/80">{networkData.network.centers}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Image Column */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="relative bg-gray-900/5 dark:bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-gray-900/10 dark:border-white/10">
                  <div className="aspect-[4/5] relative">
                    <img 
                      src={medicalResearchImg} 
                      alt="CANN healthcare professionals collaboration"
                      className="w-full h-full object-cover"
                    />
                    
                    <motion.div
                      className="absolute bottom-6 left-6 right-6 bg-gray-900/10 dark:bg-white/10 backdrop-blur-xl border border-gray-900/20 dark:border-white/20 text-gray-900 dark:text-white rounded-2xl shadow-2xl"
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    >
                      <div className="px-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                              {networkData.network.provinces}
                            </div>
                            <div className="text-xs text-gray-700 dark:text-white/80">Provinces</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                              {networkData.network.territories}
                            </div>
                            <div className="text-xs text-gray-700 dark:text-white/80">Territories</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  
                  <motion.div
                    className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center"
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
                    <Network className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/5 dark:via-white/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                Network Objectives
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed max-w-3xl mx-auto">
              Four key pillars guide CANN's mission to transform amyloidosis care across Canada.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {networkData.objectives.map((objective, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-900/25 backdrop-blur-xl rounded-2xl p-6 border border-gray-900/10 dark:border-white/10 hover:shadow-2xl transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${objective.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <objective.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-pink-600 transition-colors duration-300">
                  {objective.title}
                </h3>
                <p className="text-gray-600 dark:text-white/70 text-sm leading-relaxed">
                  {objective.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-24 bg-white dark:bg-gray-900 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/5 dark:via-white/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                Network Achievements
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed max-w-3xl mx-auto">
              Measurable impact through collaboration and innovation in amyloidosis care.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {networkData.achievements.map((achievement, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-900/10 dark:border-white/10 hover:shadow-2xl transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                <div className="flex items-start gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
                      {achievement.stat}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-white/60 font-medium">
                      {achievement.label}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-pink-600 transition-colors duration-300">
                      {achievement.title}
                    </h3>
                    <p className="text-gray-600 dark:text-white/70 leading-relaxed">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Network CTA */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/5 dark:via-white/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 bg-pink-500/10 dark:bg-pink-400/10 backdrop-blur-xl rounded-full px-6 py-3 border border-pink-500/20 dark:border-pink-400/20 mb-6">
              <Users className="w-5 h-5 text-pink-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-white/90">Join the Network</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                Become Part of
              </span>
              <br />
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                CANN
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed mb-8">
              Healthcare professionals, researchers, and institutions are invited to join CANN and contribute to advancing amyloidosis care across Canada.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/join-nursing-network" className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
                Join CANN
                <Network className="w-5 h-5" />
              </Link>
              <Link href="/directory" className="inline-flex items-center gap-2 bg-gray-900/10 dark:bg-white/10 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-900/20 dark:hover:bg-white/20 transition-all duration-300">
                View Directory
                <MapPin className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}