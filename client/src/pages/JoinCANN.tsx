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

export default function JoinCANN() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const membershipBenefits = [
    {
      icon: Network,
      title: 'Professional Network',
      description: 'Connect with amyloidosis nursing professionals across Canada',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      icon: GraduationCap,
      title: 'Educational Resources',
      description: 'Access exclusive educational materials and training recordings',
      color: 'from-emerald-400 to-green-400'
    },
    {
      icon: Users,
      title: 'Knowledge Sharing',
      description: 'Share best practices and learn from experienced colleagues',
      color: 'from-purple-400 to-violet-400'
    },
    {
      icon: Award,
      title: 'Professional Development',
      description: 'Advance your career with specialized amyloidosis expertise',
      color: 'from-orange-400 to-amber-400'
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
      color: 'from-red-400 to-pink-400'
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
      <section className="relative py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00AFE6]/10 via-transparent to-[#00DD89]/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00AFE6]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00DD89]/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 mb-8">
                <Network className="w-5 h-5 text-[#00AFE6]" />
                <span className="text-sm font-medium text-white/90">Professional Network</span>
              </div>
              
              <h1 className="crawford-section-title mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  Join the Canadian
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                  Amyloidosis Nursing Network
                </span>
              </h1>
              
              <p className="text-xl text-white/70 leading-relaxed mb-8 max-w-3xl mx-auto">
                Unite with nursing professionals across Canada to enhance amyloidosis care through collaboration, education, and shared expertise.
              </p>
              
              <Button className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-[#00AFE6]/25 transition-all duration-300">
                <UserPlus className="w-5 h-5 mr-2" />
                Join CANN Today
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50/95 to-cyan-50/95 dark:from-blue-900/25 dark:to-cyan-900/25">
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
                      The Canadian Amyloidosis Nursing Network (CANN) is a specialized professional network dedicated to advancing nursing care for amyloidosis patients across Canada. We bring together experienced nurses, educators, and healthcare professionals who share a commitment to excellence in amyloidosis care.
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
      <section className="py-16 bg-gradient-to-br from-emerald-50/95 to-green-50/95 dark:from-emerald-900/25 dark:to-green-900/25">
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
                      <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm">
                        <CardContent className="p-8">
                          <div className={`w-16 h-16 bg-gradient-to-r ${benefit.color} rounded-2xl flex items-center justify-center mb-6`}>
                            <benefit.icon className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            {benefit.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {benefit.description}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50/95 to-violet-50/95 dark:from-purple-900/25 dark:to-violet-900/25">
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
      <section className="py-16 bg-gradient-to-br from-pink-50/95 to-rose-50/95 dark:from-pink-900/25 dark:to-rose-900/25">
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
      <section className="py-16 bg-gradient-to-br from-orange-50/95 to-amber-50/95 dark:from-orange-900/25 dark:to-amber-900/25">
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
                      <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm">
                        <CardContent className="p-8">
                          <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-2xl flex items-center justify-center flex-shrink-0">
                              <resource.icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {resource.title}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="bg-[#00AFE6]/10 text-[#00AFE6] px-2 py-1 rounded-full">
                                  {resource.type}
                                </span>
                                <span>•</span>
                                <span>{resource.duration || resource.pages || resource.items}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                            {resource.description}
                          </p>
                          <Button 
                            variant="outline"
                            className="w-full border-[#00AFE6] text-[#00AFE6] hover:bg-[#00AFE6] hover:text-white transition-all duration-300"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Access Resource
                          </Button>
                        </CardContent>
                      </Card>
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
      <section className="py-16 bg-gradient-to-br from-indigo-50/95 to-blue-50/95 dark:from-indigo-900/25 dark:to-blue-900/25">
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
                      <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm">
                        <CardContent className="p-8">
                          <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center flex-shrink-0">
                              <doc.icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {doc.title}
                              </h3>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {doc.date}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                            {doc.description}
                          </p>
                          <Button 
                            variant="outline"
                            className="w-full border-gray-400 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Document
                          </Button>
                        </CardContent>
                      </Card>
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