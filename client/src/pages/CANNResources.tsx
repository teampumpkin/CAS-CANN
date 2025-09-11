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
  Video
} from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'wouter';
import ParallaxBackground from '../components/ParallaxBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import healthcareProfessionalImg from '@assets/DSC02826_1750068895453.jpg';

export default function CANNResources() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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
                Training Programs
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed max-w-3xl mx-auto">
              Professional development and certification programs for healthcare professionals.
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
                  onClick={() => window.location.href = '/join-nursing-network'}
                  size="lg" 
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 rounded-2xl px-8 flex-shrink-0"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Join CANN
                </Button>
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {trainingPrograms.map((program, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-pink-50/30 dark:from-gray-900 dark:to-pink-900/10 rounded-2xl">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <Badge 
                        variant="secondary"
                        className="bg-gradient-to-r from-pink-500/20 to-purple-600/20 text-pink-600 border-0"
                      >
                        {program.level}
                      </Badge>
                      <GraduationCap className="w-6 h-6 text-pink-500" />
                    </div>
                    <CardTitle className="text-xl">
                      {program.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-white/70 mb-4 leading-relaxed">
                      {program.description}
                    </p>
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                        <span className="font-medium">{program.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Format:</span>
                        <span className="font-medium">{program.format}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Next Start:</span>
                        <span className="font-medium text-pink-600">{program.nextStart}</span>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 dark:text-white/90 mb-2">Modules:</div>
                      <div className="flex flex-wrap gap-1">
                        {program.modules.map((module, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {module}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 rounded-xl"
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="bg-gray-800 dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700/50 max-w-4xl mx-auto">
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
                  onClick={() => window.location.href = '/join-nursing-network'}
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

      {/* Research Publications Section */}
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
                Research Publications
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed max-w-3xl mx-auto">
              Latest research findings and publications from the CANN network.
            </p>
          </motion.div>

          <div className="space-y-6">
            {researchPublications.map((publication, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-900 rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge 
                            variant="outline" 
                            className="border-pink-500 text-pink-600"
                          >
                            {publication.type}
                          </Badge>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {publication.year}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                          {publication.title}
                        </h3>
                        <p className="text-gray-600 dark:text-white/70 mb-2">
                          {publication.authors}
                        </p>
                        <p className="text-sm font-medium text-pink-600 mb-3">
                          {publication.journal}
                        </p>
                        <p className="text-gray-600 dark:text-white/70 leading-relaxed">
                          {publication.abstract}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 rounded-xl"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          View PDF
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-pink-500 text-pink-500 hover:bg-pink-500/10 rounded-xl"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Journal Link
                        </Button>
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
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                Need More Information?
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed mb-8">
              Contact the CANN team for additional resources, collaboration opportunities, or specific questions about our programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 rounded-2xl px-8"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact CANN
              </Button>
              <Link href="/join-nursing-network">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-pink-500 text-pink-500 hover:bg-pink-500/10 rounded-2xl px-8"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Join Network
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}