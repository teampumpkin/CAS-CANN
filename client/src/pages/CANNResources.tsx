import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Calendar, 
  Download, 
  FileText, 
  GraduationCap, 
  Users, 
  PlayCircle,
  ExternalLink,
  Award,
  Search,
  Globe,
  Mail,
  Clock,
  MapPin,
  Video,
  Copy,
  Check
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import ParallaxBackground from '../components/ParallaxBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import healthcareProfessionalImg from '@assets/DSC02826_1750068895453.jpg';

export default function CANNResources() {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('CANN@amyloid.ca');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const educationalResources = [
    {
      title: "Amyloidosis Clinical Guidelines",
      description: "Comprehensive evidence-based guidelines for diagnosis and treatment of all amyloidosis types.",
      type: "Clinical Guide",
      format: "PDF",
      size: "2.4 MB",
      updated: "December 2024",
      category: "Guidelines"
    },
    {
      title: "Nursing Care Protocols",
      description: "Specialized nursing care protocols for amyloidosis patients across different care settings.",
      type: "Protocol Document",
      format: "PDF",
      size: "1.8 MB",
      updated: "November 2024",
      category: "Nursing"
    },
    {
      title: "Patient Assessment Tools",
      description: "Standardized assessment forms and screening tools for early detection and monitoring.",
      type: "Assessment Tools",
      format: "PDF",
      size: "950 KB",
      updated: "October 2024",
      category: "Assessment"
    },
    {
      title: "Diagnostic Imaging Guide",
      description: "Best practices for imaging in amyloidosis diagnosis and staging.",
      type: "Imaging Guide",
      format: "PDF",
      size: "3.2 MB",
      updated: "September 2024",
      category: "Diagnostics"
    }
  ];

  const upcomingEvents = [
    {
      title: "CANN Educational Series",
      date: "October 7, 2025",
      time: "2:00 – 3:00 PM (MST)",
      location: "Virtual – login to CANN member portal for access details",
      format: "Webinar",
      description: "Occurring 3-4 times per year, topics and speakers are tailored toward the needs of CANN members.",
      topic: "My Journey with Amyloidosis: A Patient's Perspective",
      registrationDeadline: "Registration not required",
      cmeCredits: "1 hour",
      type: "Webinar"
    },
    {
      title: "CANN Townhall – Ideation Workshop",
      date: "Date TBD",
      time: "5:00 PM - 6:00 PM (MST)",
      location: "Virtual",
      format: "Virtual Workshop",
      description: "We want to hear from you! This live session will be professionally facilitated, designed to understand the needs of new/current CANN members and shape future direction.",
      registrationDeadline: "Registration coming soon!",
      cmeCredits: "1.5 - 2 hours",
      type: "Virtual Workshop"
    },
    {
      title: "Canadian Amyloidosis Summit",
      date: "October 31 – November 2, 2025",
      time: "2025-10-31 to 2025-11-02",
      location: "Toronto Airport Marriott Hotel",
      format: "In-person",
      description: "Annual gathering featuring leading specialists and patient advocates sharing the latest advances in treatment and care.",
      registrationDeadline: "Registration TBD",
      cmeCredits: "3 days",
      type: "Conference"
    }
  ];

  const trainingPrograms = [
    {
      title: "Amyloidosis Specialist Certification",
      duration: "8 weeks",
      format: "Blended Learning",
      level: "Advanced",
      description: "Comprehensive certification program for healthcare professionals specializing in amyloidosis care.",
      modules: ["Pathophysiology", "Diagnosis", "Treatment", "Patient Management"],
      nextStart: "April 2025"
    },
    {
      title: "Early Detection Workshop",
      duration: "1 day",
      format: "In-person",
      level: "Intermediate",
      description: "Intensive workshop on recognizing early signs and symptoms of amyloidosis.",
      modules: ["Red Flags", "Screening Tools", "Referral Pathways"],
      nextStart: "March 2025"
    },
    {
      title: "Research Methods in Amyloidosis",
      duration: "6 weeks",
      format: "Online",
      level: "Advanced",
      description: "Research methodology course specifically designed for amyloidosis studies.",
      modules: ["Study Design", "Data Collection", "Statistical Analysis", "Publication"],
      nextStart: "May 2025"
    }
  ];

  const researchPublications = [
    {
      title: "CANN Registry Annual Report 2024",
      authors: "CANN Research Committee",
      journal: "CANN Publications",
      year: "2024",
      type: "Report",
      abstract: "Comprehensive analysis of amyloidosis cases across Canada with treatment outcomes and survival data."
    },
    {
      title: "AI-Assisted Diagnosis in Cardiac Amyloidosis",
      authors: "Dr. Smith et al.",
      journal: "Canadian Journal of Cardiology",
      year: "2024",
      type: "Research Article",
      abstract: "Machine learning approaches to improve diagnostic accuracy in cardiac amyloidosis."
    },
    {
      title: "Nursing Interventions in AL Amyloidosis",
      authors: "CANN Nursing Committee",
      journal: "Canadian Oncology Nursing Journal",
      year: "2024",
      type: "Clinical Study",
      abstract: "Evidence-based nursing interventions to improve quality of life in AL amyloidosis patients."
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <ParallaxBackground>{null}</ParallaxBackground>
      
      {/* Hero Section */}
      <section className="py-32 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
            style={{ backgroundImage: `url(${healthcareProfessionalImg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-white/50 to-purple-600/15 dark:from-pink-500/30 dark:via-gray-900/50 dark:to-purple-600/25" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 bg-pink-500/10 dark:bg-pink-400/10 backdrop-blur-xl rounded-full px-6 py-3 border border-pink-500/20 dark:border-pink-400/20 mb-6">
              <BookOpen className="w-5 h-5 text-pink-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-white/90">Professional Resources</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold font-rosarivo mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                CANN
              </span>
              <br />
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Resources & Events
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed mb-8 max-w-3xl mx-auto">
              Access comprehensive educational materials, training programs, research publications, and professional development opportunities for amyloidosis healthcare professionals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Training Programs Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                CANN Educational Series
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed max-w-3xl mx-auto">
              Past CANN Educational Series – Access previously recorded sessions
            </p>
          </motion.div>

          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-lg border border-pink-500/20 max-w-3xl mx-auto">
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-full p-2 flex-shrink-0">
                    <Users className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      Members Only Access
                    </h3>
                    <p className="text-gray-600 dark:text-white/70 text-sm">
                      Join CANN to access exclusive recorded training sessions and educational resources
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => window.location.href = '/join-cann'}
                  size="lg" 
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 rounded-2xl px-8 flex-shrink-0"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Join CANN
                </Button>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative group"
            >
              {/* Outer glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 to-purple-600/30 rounded-3xl blur-2xl animate-pulse"></div>
              
              {/* Main container */}
              <div className="relative bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 dark:border-gray-600/30 shadow-2xl">
                
                {/* Animated background pattern */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-transparent rounded-full blur-xl animate-pulse"></div>
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-600/10 to-transparent rounded-full blur-xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center gap-4">
                  
                  {/* Icon with spinning animation */}
                  <motion.div 
                    className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full shadow-lg"
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <GraduationCap className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Main text */}
                  <div className="text-center">
                    <motion.h3 
                      className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      Coming Soon
                    </motion.h3>
                  </div>

                  {/* Animated dots */}
                  <div className="flex items-center gap-2">
                    {[0, 0.3, 0.6].map((delay, index) => (
                      <motion.div
                        key={index}
                        className="w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"
                        animate={{
                          scale: [0.8, 1.2, 0.8],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: delay,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Educational Resources Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                Educational Materials
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed max-w-3xl mx-auto">
              Educational resources for amyloidosis nurses, healthcare professionals and patients.
            </p>
          </motion.div>

          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge 
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-lg px-8 py-4 rounded-2xl border-0 font-semibold"
              >
                Coming Soon
              </Badge>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                Upcoming Events
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed max-w-3xl mx-auto">
              Professional development opportunities, conferences, and educational sessions.
            </p>
          </motion.div>

          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="bg-slate-900 dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-700/50 max-w-4xl mx-auto">
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-full p-3 flex-shrink-0">
                    <Users className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">
                      Members Only Events
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Join CANN to access exclusive professional development opportunities
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => window.location.href = '/join-cann'}
                  size="lg" 
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 rounded-2xl px-8 flex-shrink-0"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Join CANN
                </Button>
              </div>
            </div>
          </motion.div>

          <div className="space-y-8">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-pink-50/30 dark:from-gray-900 dark:to-pink-900/10 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  <CardContent className="p-8">
                    <div className="grid lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge 
                            variant="outline" 
                            className="border-pink-500 text-pink-600"
                          >
                            {event.type}
                          </Badge>
                          <Badge 
                            variant="secondary" 
                            className="bg-gray-100 dark:bg-gray-800"
                          >
                            {event.format}
                          </Badge>
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 dark:text-white/70 mb-4 leading-relaxed">
                          {event.description}
                        </p>
                        {index === 0 && event.topic && (
                          <div className="mb-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border border-pink-200 dark:border-pink-800 rounded-xl">
                            <div className="text-sm font-medium text-pink-600 dark:text-pink-400 mb-1">Session Topic:</div>
                            <div className="text-gray-800 dark:text-white font-medium italic">"{event.topic}"</div>
                          </div>
                        )}
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-pink-500" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-pink-500" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-pink-500" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-pink-500" />
                            <span>{event.cmeCredits} CME</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between">
                        <div className="mb-4">
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            Registration:
                          </div>
                          <div className="font-semibold text-pink-600">
                            {event.registrationDeadline}
                          </div>
                        </div>
                        {index === 2 && (
                          <a 
                            href="https://madhattr.ca/events/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <Button 
                              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 rounded-xl"
                            >
                              Register Now
                              <ExternalLink className="w-4 h-4 ml-2" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Contact Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50/80 to-white/80 dark:from-gray-800/80 dark:to-gray-900/80 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 to-white/80 dark:from-gray-800/80 dark:to-gray-900/80" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl -translate-x-48 -translate-y-48" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl translate-x-48 translate-y-48" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-gray-200/50 dark:border-gray-400/30 shadow-2xl">
              {/* Header Badge */}
              <motion.div
                className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500/10 to-purple-600/10 backdrop-blur-xl rounded-full px-6 py-3 border border-pink-500/20 dark:border-pink-500/30 mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Mail className="w-5 h-5 text-pink-500" />
                <span className="text-sm font-medium text-gray-800 dark:text-white/90">Get in Touch</span>
              </motion.div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-rosarivo mb-6">
                <span className="text-gray-900 dark:text-white">Need More </span>
                <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Information?</span>
              </h2>
              
              <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed mb-12">
                Contact the CANN team for additional resources, collaboration opportunities, or specific questions about our programs.
              </p>
              
              <div className="flex flex-col gap-8 items-center">
                {/* Contact CANN Section */}
                <div className="flex flex-col items-center gap-6">
                  {/* Contact CANN Button */}
                  <motion.a
                    href="mailto:CANN@amyloid.ca"
                    className="group inline-flex items-center gap-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-pink-500/25 transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    data-testid="button-contact-cann"
                  >
                    <Mail className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-xl">Contact CANN</span>
                  </motion.a>

                  {/* Email with Copy Feature */}
                  <div className="flex items-center gap-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl px-5 py-4 border border-gray-200/50 dark:border-gray-600/30 shadow-lg">
                    <span className="text-gray-800 dark:text-white/90 font-medium text-lg" data-testid="text-cann-email">
                      CANN@amyloid.ca
                    </span>
                    <motion.button
                      onClick={copyEmail}
                      className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-pink-500/10 to-purple-600/10 hover:from-pink-500/20 hover:to-purple-600/20 border border-pink-500/20 hover:border-pink-500/30 transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      data-testid="button-copy-cann-email"
                    >
                      {isCopied ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5 text-pink-500" />
                      )}
                    </motion.button>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>

                {/* Join CANN Button */}
                <Link href="/join-cann">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 rounded-2xl px-10 py-4 text-lg font-bold shadow-xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
                    >
                      <Users className="w-6 h-6 mr-3" />
                      Join CANN Network
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}