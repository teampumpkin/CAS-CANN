import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { 
  Network, 
  Users, 
  BookOpen, 
  FileText, 
  GraduationCap, 
  LogIn, 
  ExternalLink, 
  CheckCircle, 
  Stethoscope, 
  Award, 
  Globe, 
  ArrowRight,
  Download,
  Play,
  Lock,
  UserPlus,
  Star,
  Heart,
  Shield
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import healthcareProfessionalImg from '@assets/DSC02826_1750068895453.jpg';
import medicalTeamImg from '@assets/DSC02841_1750068895454.jpg';
import cannLogoImg from '@assets/CANN-RGB-dark-theme_1756219144378.png';

export default function JoinCANN() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const membershipBenefits = [
    {
      icon: Network,
      title: 'Professional Network',
      description: 'Connect with amyloidosis nursing professionals across Canada',
      color: 'from-pink-400 to-rose-400'
    },
    {
      icon: GraduationCap,
      title: 'Educational Resources',
      description: 'Access exclusive educational materials and training recordings',
      color: 'from-purple-400 to-pink-400'
    },
    {
      icon: Users,
      title: 'Knowledge Sharing',
      description: 'Share best practices and learn from experienced colleagues',
      color: 'from-fuchsia-400 to-purple-400'
    },
    {
      icon: Award,
      title: 'Professional Development',
      description: 'Advance your career with specialized amyloidosis expertise',
      color: 'from-violet-400 to-fuchsia-400'
    },
    {
      icon: Globe,
      title: 'National Coverage',
      description: 'Part of a network spanning all provinces and territories',
      color: 'from-pink-400 to-rose-400'
    },
    {
      icon: Heart,
      title: 'Patient Impact',
      description: 'Improve patient outcomes through collaborative care',
      color: 'from-rose-400 to-pink-400'
    }
  ];

  const educationalResources = [
    {
      title: 'Amyloidosis Fundamentals',
      type: 'Video Series',
      duration: '2.5 hours',
      icon: Play,
      description: 'Comprehensive introduction to amyloidosis pathophysiology and nursing care'
    },
    {
      title: 'Patient Assessment Guidelines',
      type: 'Document',
      pages: '24 pages',
      icon: FileText,
      description: 'Evidence-based assessment protocols for amyloidosis patients'
    },
    {
      title: 'Medication Management',
      type: 'Interactive Module',
      duration: '1.5 hours',
      icon: BookOpen,
      description: 'Best practices for amyloidosis medication administration and monitoring'
    },
    {
      title: 'Family Education Resources',
      type: 'Resource Kit',
      items: '12 resources',
      icon: Users,
      description: 'Materials to support patient and family education'
    }
  ];

  const governanceDocuments = [
    {
      title: 'CANN Charter',
      description: 'Official charter establishing the Canadian Amyloidosis Nursing Network',
      icon: FileText,
      date: 'Updated 2024'
    },
    {
      title: 'Membership Guidelines',
      description: 'Requirements and expectations for CANN membership',
      icon: Users,
      date: 'Updated 2024'
    },
    {
      title: 'Code of Conduct',
      description: 'Professional standards and ethical guidelines for members',
      icon: Shield,
      date: 'Updated 2024'
    },
    {
      title: 'Annual Report',
      description: 'Summary of CANN activities and achievements',
      icon: Award,
      date: '2024'
    }
  ];

  const publicMaterials = [
    {
      title: 'Amyloidosis Nursing Care Guide',
      description: 'Public resource for healthcare professionals new to amyloidosis',
      icon: BookOpen,
      downloads: '2,400'
    },
    {
      title: 'Patient Education Toolkit',
      description: 'Materials for educating patients and families about amyloidosis',
      icon: GraduationCap,
      downloads: '1,850'
    },
    {
      title: 'Research Updates',
      description: 'Latest research findings relevant to amyloidosis nursing',
      icon: Star,
      downloads: '3,200'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-purple-600/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* CANN Logo */}
              <div className="mb-8">
                <img 
                  src={cannLogoImg}
                  alt="Canadian Amyloidosis Nursing Network Logo"
                  className="h-14 sm:h-16 md:h-20 lg:h-24 xl:h-28 mx-auto"
                />
              </div>
              
              <div className="inline-flex items-center gap-3 bg-pink-500/10 dark:bg-pink-400/10 backdrop-blur-xl rounded-full px-6 py-3 border border-pink-500/20 dark:border-pink-400/20 mb-8">
                <Network className="w-5 h-5 text-pink-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-white/90">Professional Network</span>
              </div>
              
              <h1 className="crawford-section-title mb-6 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                  Join the Canadian
                </span>
                <br />
                <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  Amyloidosis Nursing Network
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed mb-8 max-w-3xl mx-auto">
                Unite with nursing professionals across Canada to enhance amyloidosis care through collaboration, education, and shared expertise.
              </p>
              
              <Button 
                onClick={() => {
                  const joinSection = document.getElementById('join-section');
                  if (joinSection) {
                    joinSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 cursor-pointer"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Join CANN Today
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-16">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 font-rosarivo">
                      About CANN
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                      The field of amyloidosis has experienced tremendous growth in recent years. Within this multidisciplinary community, nurses play a vital role in enhancing the quality, accessibility, and coordination of healthcare services for amyloidosis patients. This evolving landscape generates enthusiasm for the development of a national nursing network to unite amyloidosis nurses across the country. The Canadian Amyloidosis Nursing Network (CANN) is proudly developing as an affiliate of the Canadian Amyloidosis Society (CAS). This purpose-driven network aims to meet the dynamic educational needs of amyloidosis nurses through professional development, knowledge translation, and best practice sharing and to facilitate collaboration amongst this community of nursing professionals while supporting individuals with amyloidosis. We invite you to join this exciting movement!
                    </p>
                    
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-2xl flex items-center justify-center flex-shrink-0">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Professional Development</h3>
                          <p className="text-gray-600 dark:text-gray-300">Advance your expertise in amyloidosis nursing through specialized training and resources.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#00DD89] to-[#00AFE6] rounded-2xl flex items-center justify-center flex-shrink-0">
                          <Network className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">National Collaboration</h3>
                          <p className="text-gray-600 dark:text-gray-300">Connect with peers across all provinces and territories to share knowledge and best practices.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                          <Heart className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Patient Impact</h3>
                          <p className="text-gray-600 dark:text-gray-300">Improve patient outcomes through evidence-based care and collaborative approaches.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-3xl overflow-hidden">
                      <img 
                        src={healthcareProfessionalImg} 
                        alt="Healthcare professional in amyloidosis care"
                        className="w-full h-96 object-cover"
                      />
                      
                      {/* Stats Overlay */}
                      <div className="absolute bottom-6 left-6 right-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl p-6">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                              50+
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">Members</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold bg-gradient-to-r from-[#00DD89] to-[#00AFE6] bg-clip-text text-transparent">
                              13
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">Provinces/Territories</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                              2+
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">Years Active</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-12">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 font-rosarivo">
                    Membership Benefits
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                    Join a community of dedicated nursing professionals and unlock exclusive resources to advance your amyloidosis care expertise.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {membershipBenefits.map((benefit, index) => (
                    <motion.div
                      key={benefit.title}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="backdrop-blur-xl rounded-2xl p-8 border transition-all duration-300 group hover:shadow-2xl h-full bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 border-[#00AFE6]/20 dark:border-[#00AFE6]/30 hover:from-[#00AFE6]/12 hover:to-[#00DD89]/12 dark:hover:from-[#00AFE6]/20 dark:hover:to-[#00DD89]/20 hover:border-[#00AFE6]/40 dark:hover:border-[#00AFE6]/50 hover:shadow-[#00AFE6]/25 dark:hover:shadow-[#00AFE6]/20">
                        <div className="flex items-start gap-6">
                          <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                            <benefit.icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold mb-3 font-rosarivo text-gray-900 dark:text-white">{benefit.title}</h3>
                            <p className="leading-relaxed text-gray-600 dark:text-gray-300">{benefit.description}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section id="join-section" className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-12">
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 font-rosarivo">
                    Join CANN Today
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">
                    Become part of Canada's premier amyloidosis nursing network. Membership is free and open to all qualified nursing professionals.
                  </p>
                  
                  <div className="bg-gradient-to-br from-[#00AFE6]/10 to-[#00DD89]/10 rounded-3xl p-12 mb-12">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                      <div className="text-left">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                          Membership Requirements
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-[#00AFE6]" />
                            <span className="text-gray-700 dark:text-gray-300">Active nursing license in Canada</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-[#00AFE6]" />
                            <span className="text-gray-700 dark:text-gray-300">Interest in amyloidosis care</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-[#00AFE6]" />
                            <span className="text-gray-700 dark:text-gray-300">Commitment to professional development</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-[#00AFE6]" />
                            <span className="text-gray-700 dark:text-gray-300">Agreement to code of conduct</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <Button 
                          size="lg" 
                          className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-12 py-6 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-[#00AFE6]/25 transition-all duration-300"
                        >
                          <ExternalLink className="w-5 h-5 mr-2" />
                          Apply for Membership
                        </Button>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                          Free membership • Process takes 2-3 business days
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-12">
                <div className="max-w-2xl mx-auto text-center">
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 font-rosarivo">
                    Member Login
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">
                    Access your CANN member portal to view exclusive resources, connect with colleagues, and manage your membership.
                  </p>
                  
                  <Card className="bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm border-0 shadow-xl">
                    <CardContent className="p-12">
                      <div className="w-20 h-20 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full flex items-center justify-center mx-auto mb-8">
                        <Lock className="w-10 h-10 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                        Secure Member Portal
                      </h3>
                      
                      <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3 justify-center">
                          <CheckCircle className="w-5 h-5 text-[#00AFE6]" />
                          <span className="text-gray-700 dark:text-gray-300">Access educational resources</span>
                        </div>
                        <div className="flex items-center gap-3 justify-center">
                          <CheckCircle className="w-5 h-5 text-[#00AFE6]" />
                          <span className="text-gray-700 dark:text-gray-300">Connect with network members</span>
                        </div>
                        <div className="flex items-center gap-3 justify-center">
                          <CheckCircle className="w-5 h-5 text-[#00AFE6]" />
                          <span className="text-gray-700 dark:text-gray-300">View upcoming events</span>
                        </div>
                      </div>
                      
                      <Button 
                        size="lg"
                        className="w-full bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white font-semibold py-4 rounded-xl hover:shadow-xl transition-all duration-300"
                      >
                        <LogIn className="w-5 h-5 mr-2" />
                        Login to Member Portal
                      </Button>
                      
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                        New member? <span className="text-[#00AFE6] cursor-pointer hover:underline">Request access</span>
                      </p>
                    </CardContent>
                  </Card>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-12">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 font-rosarivo">
                    Educational Resources
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                    Access comprehensive educational materials and training recordings to enhance your amyloidosis nursing expertise.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {educationalResources.map((resource, index) => (
                    <motion.div
                      key={resource.title}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className={`backdrop-blur-xl rounded-2xl p-8 border transition-all duration-300 group hover:shadow-2xl h-full ${
                        index === 0 
                          ? 'bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 border-[#00AFE6]/20 dark:border-[#00AFE6]/30 hover:from-[#00AFE6]/12 hover:to-[#00DD89]/12 dark:hover:from-[#00AFE6]/20 dark:hover:to-[#00DD89]/20 hover:border-[#00AFE6]/30 dark:hover:border-[#00AFE6]/40 hover:shadow-[#00AFE6]/20 dark:hover:shadow-[#00AFE6]/25'
                          : index === 1
                          ? 'bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 border-[#00AFE6]/20 dark:border-[#00AFE6]/30 hover:from-[#00AFE6]/12 hover:to-[#00DD89]/12 dark:hover:from-[#00AFE6]/20 dark:hover:to-[#00DD89]/20 hover:border-[#00AFE6]/30 dark:hover:border-[#00AFE6]/40 hover:shadow-[#00AFE6]/20 dark:hover:shadow-[#00AFE6]/25'
                          : index === 2
                          ? 'bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 border-[#00AFE6]/20 dark:border-[#00AFE6]/30 hover:from-[#00AFE6]/12 hover:to-[#00DD89]/12 dark:hover:from-[#00AFE6]/20 dark:hover:to-[#00DD89]/20 hover:border-[#00AFE6]/30 dark:hover:border-[#00AFE6]/40 hover:shadow-[#00AFE6]/20 dark:hover:shadow-[#00AFE6]/25'
                          : 'bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 border-[#00AFE6]/20 dark:border-[#00AFE6]/30 hover:from-[#00AFE6]/12 hover:to-[#00DD89]/12 dark:hover:from-[#00AFE6]/20 dark:hover:to-[#00DD89]/20 hover:border-[#00AFE6]/30 dark:hover:border-[#00AFE6]/40 hover:shadow-[#00AFE6]/20 dark:hover:shadow-[#00AFE6]/25'
                      }`}>
                        <div className="flex items-start gap-6">
                          <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                            <resource.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className={`text-xl font-semibold mb-2 font-rosarivo ${
                              index === 0 
                                ? 'text-blue-900 dark:text-blue-100'
                                : index === 1
                                ? 'text-emerald-900 dark:text-emerald-100'
                                : index === 2
                                ? 'text-purple-900 dark:text-purple-100'
                                : 'text-orange-900 dark:text-orange-100'
                            }`}>{resource.title}</h3>
                            <div className="flex items-center gap-2 text-sm mb-4">
                              <span className={`px-2 py-1 rounded-full ${
                                index === 0 
                                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                                  : index === 1
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                                  : index === 2
                                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                                  : 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300'
                              }`}>
                                {resource.type}
                              </span>
                              <span className={`${
                                index === 0 
                                  ? 'text-blue-600 dark:text-blue-400'
                                  : index === 1
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : index === 2
                                  ? 'text-purple-600 dark:text-purple-400'
                                  : 'text-orange-600 dark:text-orange-400'
                              }`}>•</span>
                              <span className={`${
                                index === 0 
                                  ? 'text-blue-600 dark:text-blue-400'
                                  : index === 1
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : index === 2
                                  ? 'text-purple-600 dark:text-purple-400'
                                  : 'text-orange-600 dark:text-orange-400'
                              }`}>{resource.duration || resource.pages || resource.items}</span>
                            </div>
                            <p className={`leading-relaxed mb-6 ${
                              index === 0 
                                ? 'text-blue-700 dark:text-blue-300'
                                : index === 1
                                ? 'text-emerald-700 dark:text-emerald-300'
                                : index === 2
                                ? 'text-purple-700 dark:text-purple-300'
                                : 'text-orange-700 dark:text-orange-300'
                            }`}>{resource.description}</p>
                            <Button 
                              variant="outline"
                              className={`w-full transition-all duration-300 ${
                                index === 0 
                                  ? 'border-blue-300 text-blue-700 hover:bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:text-white dark:border-blue-400 dark:text-blue-300 dark:hover:bg-gradient-to-r from-[#00AFE6] to-[#00DD89]'
                                  : index === 1
                                  ? 'border-emerald-300 text-emerald-700 hover:bg-emerald-600 hover:text-white dark:border-emerald-400 dark:text-emerald-300 dark:hover:bg-emerald-500'
                                  : index === 2
                                  ? 'border-purple-300 text-purple-700 hover:bg-purple-600 hover:text-white dark:border-purple-400 dark:text-purple-300 dark:hover:bg-purple-500'
                                  : 'border-orange-300 text-orange-700 hover:bg-orange-600 hover:text-white dark:border-orange-400 dark:text-orange-300 dark:hover:bg-orange-500'
                              }`}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Access Resource
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Public Educational Materials
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-8">
                    Free resources available to all healthcare professionals
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {publicMaterials.map((material, index) => (
                      <Card key={material.title} className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm border-0">
                        <CardContent className="p-6">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <material.icon className="w-6 h-6 text-white" />
                          </div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            {material.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                            {material.description}
                          </p>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {material.downloads} downloads
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Governance Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-12">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 font-rosarivo">
                    Governance Documents
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                    Access official documents that guide CANN's operations, membership, and professional standards.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {governanceDocuments.map((doc, index) => (
                    <motion.div
                      key={doc.title}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className={`backdrop-blur-xl rounded-2xl p-8 border transition-all duration-300 group hover:shadow-2xl h-full ${
                        index === 0 
                          ? 'bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 border-[#00AFE6]/20 dark:border-[#00AFE6]/30 hover:from-[#00AFE6]/12 hover:to-[#00DD89]/12 dark:hover:from-[#00AFE6]/20 dark:hover:to-[#00DD89]/20 hover:border-[#00AFE6]/30 dark:hover:border-[#00AFE6]/40 hover:shadow-[#00AFE6]/20 dark:hover:shadow-[#00AFE6]/25'
                          : index === 1
                          ? 'bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 border-[#00AFE6]/20 dark:border-[#00AFE6]/30 hover:from-[#00AFE6]/12 hover:to-[#00DD89]/12 dark:hover:from-[#00AFE6]/20 dark:hover:to-[#00DD89]/20 hover:border-[#00AFE6]/30 dark:hover:border-[#00AFE6]/40 hover:shadow-[#00AFE6]/20 dark:hover:shadow-[#00AFE6]/25'
                          : index === 2
                          ? 'bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 border-[#00AFE6]/20 dark:border-[#00AFE6]/30 hover:from-[#00AFE6]/12 hover:to-[#00DD89]/12 dark:hover:from-[#00AFE6]/20 dark:hover:to-[#00DD89]/20 hover:border-[#00AFE6]/30 dark:hover:border-[#00AFE6]/40 hover:shadow-[#00AFE6]/20 dark:hover:shadow-[#00AFE6]/25'
                          : 'bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 border-[#00AFE6]/20 dark:border-[#00AFE6]/30 hover:from-[#00AFE6]/12 hover:to-[#00DD89]/12 dark:hover:from-[#00AFE6]/20 dark:hover:to-[#00DD89]/20 hover:border-[#00AFE6]/30 dark:hover:border-[#00AFE6]/40 hover:shadow-[#00AFE6]/20 dark:hover:shadow-[#00AFE6]/25'
                      }`}>
                        <div className="flex items-start gap-6">
                          <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                            <doc.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className={`text-xl font-semibold mb-2 font-rosarivo ${
                              index === 0 
                                ? 'text-slate-900 dark:text-slate-100'
                                : index === 1
                                ? 'text-indigo-900 dark:text-indigo-100'
                                : index === 2
                                ? 'text-teal-900 dark:text-teal-100'
                                : 'text-amber-900 dark:text-amber-100'
                            }`}>{doc.title}</h3>
                            <span className={`text-sm mb-4 block ${
                              index === 0 
                                ? 'text-slate-600 dark:text-slate-400'
                                : index === 1
                                ? 'text-indigo-600 dark:text-indigo-400'
                                : index === 2
                                ? 'text-teal-600 dark:text-teal-400'
                                : 'text-amber-600 dark:text-amber-400'
                            }`}>
                              {doc.date}
                            </span>
                            <p className={`leading-relaxed mb-6 ${
                              index === 0 
                                ? 'text-slate-700 dark:text-slate-300'
                                : index === 1
                                ? 'text-indigo-700 dark:text-indigo-300'
                                : index === 2
                                ? 'text-teal-700 dark:text-teal-300'
                                : 'text-amber-700 dark:text-amber-300'
                            }`}>{doc.description}</p>
                            <Button 
                              variant="outline"
                              className={`w-full transition-all duration-300 ${
                                index === 0 
                                  ? 'border-slate-300 text-slate-700 hover:bg-slate-600 hover:text-white dark:border-slate-400 dark:text-slate-300 dark:hover:bg-slate-500'
                                  : index === 1
                                  ? 'border-indigo-300 text-indigo-700 hover:bg-indigo-600 hover:text-white dark:border-indigo-400 dark:text-indigo-300 dark:hover:bg-indigo-500'
                                  : index === 2
                                  ? 'border-teal-300 text-teal-700 hover:bg-teal-600 hover:text-white dark:border-teal-400 dark:text-teal-300 dark:hover:bg-teal-500'
                                  : 'border-amber-300 text-amber-700 hover:bg-amber-600 hover:text-white dark:border-amber-400 dark:text-amber-300 dark:hover:bg-amber-500'
                              }`}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download Document
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}