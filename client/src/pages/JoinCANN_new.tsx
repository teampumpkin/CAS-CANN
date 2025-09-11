import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useScrollAnimations } from '@/hooks/use-scroll-animations';
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
  Shield,
  Info,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

import healthcareProfessionalImg from '@assets/DSC02826_1750068895453.jpg';
import medicalTeamImg from '@assets/DSC02841_1750068895454.jpg';
import cannLogoImg from '@assets/CANN-RGB-dark-theme_1756219144378.png';

export default function JoinCANN() {
  useScrollAnimations();
  
  useEffect(() => {
    // Handle hash-based navigation
    if (window.location.hash) {
      setTimeout(() => {
        const element = document.getElementById(window.location.hash.substring(1));
        if (element) {
          // Calculate offset for fixed header (header is about 96px tall)
          const headerHeight = 96;
          const elementPosition = element.offsetTop - headerHeight;
          window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
          });
        }
      }, 300); // Increased timeout to ensure page is fully loaded
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  const keyPillars = [
    {
      icon: GraduationCap,
      title: 'Professional Development',
      description: 'Advance your knowledge and expertise in amyloidosis nursing through curated training sessions and resources.',
      color: 'from-pink-400 to-rose-400'
    },
    {
      icon: Globe,
      title: 'National Collaboration',
      description: 'Connect with nursing colleagues across Canada to share knowledge and best practices.',
      color: 'from-purple-400 to-pink-400'
    },
    {
      icon: Heart,
      title: 'Patient Impact',
      description: 'Improve patient outcomes through advocacy and collaborative support.',
      color: 'from-fuchsia-400 to-purple-400'
    }
  ];

  const membershipBenefits = [
    {
      icon: Network,
      title: 'Professional Network',
      description: 'Connect with amyloidosis nursing professionals across Canada.',
      color: 'from-pink-400 to-rose-400'
    },
    {
      icon: BookOpen,
      title: 'Educational Resources',
      description: 'Access to educational materials, live virtual educational sessions and recordings.',
      color: 'from-purple-400 to-pink-400'
    },
    {
      icon: Users,
      title: 'Knowledge Sharing',
      description: 'Share best practices and learn from experienced colleagues.',
      color: 'from-fuchsia-400 to-purple-400'
    },
    {
      icon: Award,
      title: 'Professional Development',
      description: 'Benefit from a network dedicated to meeting the unique learning needs of its nursing members.',
      color: 'from-violet-400 to-fuchsia-400'
    },
    {
      icon: Globe,
      title: 'National Coverage',
      description: 'Be part of a network spanning all provinces and territories.',
      color: 'from-pink-400 to-rose-400'
    },
    {
      icon: Heart,
      title: 'Patient Impact',
      description: 'Unite with Canadian nursing colleagues to improve patient outcomes through collaborative care.',
      color: 'from-rose-400 to-pink-400'
    }
  ];

  const membershipRequirements = [
    'Active nursing license in Canada',
    'Interest and/or expertise in amyloidosis care',
    'Commitment to professional development'
  ];

  const portalFeatures = [
    'Access educational materials',
    'Connect with network members',
    'View upcoming events'
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
                  className="h-14 sm:h-16 md:h-20 lg:h-24 xl:h-28 max-w-full w-auto mx-auto object-contain"
                />
              </div>
              
              <div className="inline-flex items-center gap-3 bg-pink-500/10 dark:bg-pink-400/10 backdrop-blur-xl rounded-full px-6 py-3 border border-pink-500/20 dark:border-pink-400/20 mb-8">
                <Network className="w-5 h-5 text-pink-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-white/90">Professional Network</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-rosarivo mb-6 leading-tight">
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

      {/* About CANN Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
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
                  The Canadian Amyloidosis Nursing Network (CANN) is a purpose driven professional network dedicated to supporting amyloidosis nurses and advancing nursing care for amyloidosis patients across Canada. As an affiliate of the Canadian Amyloidosis Society, we bring together nurses with interest and expertise in amyloidosis, united in our commitment to excellence in amyloidosis care.
                </p>
                
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Key Pillars</h3>
                <div className="space-y-6">
                  {keyPillars.map((pillar, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${pillar.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                        <pillar.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{pillar.title}</h4>
                        <p className="text-gray-600 dark:text-gray-300">{pillar.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
              
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
                      src={medicalTeamImg} 
                      alt="CANN nursing professionals"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Benefits Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 font-rosarivo">
                Membership Benefits
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {membershipBenefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-gray-900/25 backdrop-blur-xl rounded-2xl p-6 border border-gray-900/10 dark:border-white/10 hover:shadow-2xl transition-all duration-300 group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${benefit.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-pink-600 transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-white/70 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Join CANN Today Section */}
      <section id="join-section" className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 font-rosarivo">
                Join CANN Today
              </h2>
              <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed mb-8 max-w-3xl mx-auto">
                Become part of Canada's dedicated amyloidosis nursing network. Membership is free and open to all nursing professionals engaged in the field of amyloidosis.
              </p>
              
              {/* Custom CANN Registration Form */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Form Header */}
                <div className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] p-6 text-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <UserPlus className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 font-rosarivo">
                    Join CANN Network
                  </h3>
                  <p className="text-white/90 text-sm">
                    Complete your registration below - it only takes 3 minutes
                  </p>
                </div>

                {/* Custom Form */}
                <div className="p-8 space-y-6">
                  {/* Personal Information Section */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                      Personal Information
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          First Name *
                        </label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00AFE6] focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Last Name *
                        </label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00AFE6] focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                          placeholder="Enter your last name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address *
                        </label>
                        <input 
                          type="email" 
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00AFE6] focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone Number
                        </label>
                        <input 
                          type="tel" 
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00AFE6] focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Professional Information Section */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                      Professional Information
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nursing License Number *
                        </label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00AFE6] focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                          placeholder="Enter your license number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Province/Territory *
                        </label>
                        <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00AFE6] focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200">
                          <option value="">Select Province/Territory</option>
                          <option value="AB">Alberta</option>
                          <option value="BC">British Columbia</option>
                          <option value="MB">Manitoba</option>
                          <option value="NB">New Brunswick</option>
                          <option value="NL">Newfoundland and Labrador</option>
                          <option value="NS">Nova Scotia</option>
                          <option value="ON">Ontario</option>
                          <option value="PE">Prince Edward Island</option>
                          <option value="QC">Quebec</option>
                          <option value="SK">Saskatchewan</option>
                          <option value="NT">Northwest Territories</option>
                          <option value="NU">Nunavut</option>
                          <option value="YT">Yukon</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Current Position *
                        </label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00AFE6] focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                          placeholder="e.g., Staff Nurse, Nurse Practitioner"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Healthcare Facility
                        </label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00AFE6] focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                          placeholder="Hospital or clinic name"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Experience Section */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                      Amyloidosis Experience
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Years of Nursing Experience *
                        </label>
                        <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00AFE6] focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200">
                          <option value="">Select experience level</option>
                          <option value="0-2">0-2 years</option>
                          <option value="3-5">3-5 years</option>
                          <option value="6-10">6-10 years</option>
                          <option value="11-15">11-15 years</option>
                          <option value="16+">16+ years</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Experience with Amyloidosis Patients
                        </label>
                        <textarea 
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00AFE6] focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                          placeholder="Briefly describe your experience with amyloidosis patients (optional)"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Terms and Agreement */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        className="mt-1 w-5 h-5 text-[#00AFE6] border-2 border-gray-300 rounded focus:ring-[#00AFE6] focus:ring-2"
                        id="terms-agreement"
                      />
                      <label htmlFor="terms-agreement" className="text-sm text-gray-700 dark:text-gray-300">
                        I confirm that I hold an active nursing license in Canada and agree to abide by CANN's professional standards. I understand that membership is free and my personal information will be handled confidentially according to the privacy policy.
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button className="w-full bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white font-semibold py-4 px-8 rounded-xl hover:shadow-2xl hover:shadow-[#00AFE6]/25 transition-all duration-300 transform hover:scale-105">
                      <div className="flex items-center justify-center gap-3">
                        <UserPlus className="w-5 h-5" />
                        Complete Registration
                      </div>
                    </button>
                  </div>
                </div>

                {/* Form Footer */}
                <div className="px-8 py-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#00AFE6]" />
                      <span>Secure & Confidential</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#00AFE6]" />
                      <span>3-5 Minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00AFE6]" />
                      <span>Instant Access</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Member Login Section */}
      <section id="login" className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white font-rosarivo">
                  Member Login
                </h2>
                <div className="inline-flex items-center gap-2 bg-pink-500/10 dark:bg-pink-400/10 backdrop-blur-xl rounded-full px-4 py-2 border border-pink-500/20 dark:border-pink-400/20">
                  <div className="w-2 h-2 bg-pink-600 rounded-full"></div>
                  <span className="text-sm font-medium text-pink-600 dark:text-pink-400">Coming Soon</span>
                </div>
              </div>
              <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed mb-8 max-w-3xl mx-auto">
                Access your CANN member portal to view exclusive resources, connect with colleagues, and manage your membership.
              </p>
              
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Portal Features</h3>
                <div className="space-y-4">
                  {portalFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <ArrowRight className="w-5 h-5 text-pink-600" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  disabled
                  className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-8 py-4 rounded-xl font-semibold opacity-60 cursor-not-allowed"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Login to Member Portal
                </Button>
                <Button 
                  disabled
                  variant="outline" 
                  className="border-gray-400 text-gray-400 dark:text-gray-500 px-8 py-4 rounded-xl font-semibold opacity-60 cursor-not-allowed"
                >
                  New here? Request access
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}