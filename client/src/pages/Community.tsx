import { motion } from 'framer-motion';
import { Users, Heart, MessageCircle, Calendar, MapPin, Globe, ArrowRight, Plus, Star, Award, Handshake } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ParallaxBackground from '../components/ParallaxBackground';
import healthcareProfessionalImg from '@assets/DSC02826_1750068895453.jpg';

export default function Community() {
  const { t } = useLanguage();

  const communityStats = [
    {
      icon: Users,
      number: "5,000+",
      label: "Community Members",
      description: "Patients, caregivers, and healthcare professionals"
    },
    {
      icon: MapPin,
      number: "13",
      label: "Provincial Groups",
      description: "Support groups across all provinces and territories"
    },
    {
      icon: MessageCircle,
      number: "150+",
      label: "Monthly Discussions",
      description: "Active conversations and support exchanges"
    },
    {
      icon: Calendar,
      number: "24",
      label: "Annual Events",
      description: "Workshops, webinars, and support meetings"
    }
  ];

  const supportGroups = [
    {
      name: "Toronto Amyloidosis Support Group",
      location: "Toronto, ON",
      type: "In-Person & Virtual",
      meeting: "2nd Saturday of each month",
      members: "45+ members",
      focus: "All types of amyloidosis"
    },
    {
      name: "Vancouver Island Support Network",
      location: "Victoria, BC",
      type: "Virtual",
      meeting: "Every 3rd Wednesday",
      members: "30+ members",
      focus: "ATTR amyloidosis focus"
    },
    {
      name: "Montreal Groupe de Soutien",
      location: "Montreal, QC",
      type: "Bilingual In-Person",
      meeting: "Monthly - 1st Thursday",
      members: "25+ members",
      focus: "Francophone community"
    },
    {
      name: "Calgary Cardiac Amyloidosis Circle",
      location: "Calgary, AB",
      type: "Hybrid",
      meeting: "Bi-weekly on Sundays",
      members: "20+ members",
      focus: "Cardiac amyloidosis"
    },
    {
      name: "Atlantic Canada Network",
      location: "Halifax, NS",
      type: "Virtual",
      meeting: "Monthly - 3rd Friday",
      members: "35+ members",
      focus: "Regional support for Maritime provinces"
    },
    {
      name: "Young Adults with Amyloidosis",
      location: "National (Virtual)",
      type: "Virtual Only",
      meeting: "Weekly on Thursdays",
      members: "40+ members",
      focus: "Ages 18-45 with amyloidosis"
    }
  ];

  const communityPrograms = [
    {
      icon: Heart,
      title: "Peer Support Network",
      description: "Connect with others who understand your journey through our mentor matching program.",
      features: ["One-on-one mentorship", "Group peer sessions", "Family support programs"]
    },
    {
      icon: MessageCircle,
      title: "Online Forums",
      description: "Secure, moderated discussion spaces for sharing experiences and asking questions.",
      features: ["24/7 community access", "Topic-specific discussions", "Expert moderation"]
    },
    {
      icon: Calendar,
      title: "Educational Events",
      description: "Regular webinars, workshops, and conferences featuring leading experts.",
      features: ["Monthly expert webinars", "Annual patient conference", "Caregiver workshops"]
    },
    {
      icon: Globe,
      title: "Resource Library",
      description: "Comprehensive collection of patient-friendly resources and educational materials.",
      features: ["Treatment guides", "Symptom trackers", "Financial resources"]
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "AL Amyloidosis Patient",
      location: "Toronto, ON",
      quote: "Finding the Toronto support group changed everything for me. Having people who truly understand what you're going through makes all the difference.",
      rating: 5
    },
    {
      name: "David L.",
      role: "Caregiver",
      location: "Vancouver, BC",
      quote: "The peer support network helped me navigate my wife's diagnosis. The mentorship program connected us with experienced families.",
      rating: 5
    },
    {
      name: "Marie D.",
      role: "ATTR Patient",
      location: "Montreal, QC",
      quote: "Le groupe de soutien francophone m'a donné l'espoir et les outils nécessaires pour gérer ma condition avec confiance.",
      rating: 5
    }
  ];

  const ways = [
    {
      icon: Users,
      title: "Join a Support Group",
      description: "Connect with local or virtual support groups in your area.",
      action: "Find Groups"
    },
    {
      icon: MessageCircle,
      title: "Participate in Forums",
      description: "Share your story and support others in our online community.",
      action: "Join Discussion"
    },
    {
      icon: Star,
      title: "Become a Mentor",
      description: "Share your experience to help newly diagnosed patients and families.",
      action: "Apply Now"
    },
    {
      icon: Calendar,
      title: "Attend Events",
      description: "Join our educational webinars, workshops, and annual conference.",
      action: "View Events"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <ParallaxBackground className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
            style={{ backgroundImage: `url(${healthcareProfessionalImg})` }}
          />
        </ParallaxBackground>
        
        <div className="absolute inset-0 bg-gradient-to-br from-[#00AFE6]/20 via-white/50 to-[#00DD89]/15 dark:from-[#00AFE6]/30 dark:via-gray-900/50 dark:to-[#00DD89]/25" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00AFE6]/20 to-[#00DD89]/20 backdrop-blur-sm border border-[#00AFE6]/30 rounded-full px-6 py-2 mb-6"
          >
            <Heart className="w-4 h-4 text-[#00AFE6]" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Community Support</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 font-rosarivo"
          >
            <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
              Together
            </span>
            <br />
            <span className="text-gray-800 dark:text-white">
              We're Stronger
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Connect with thousands of patients, caregivers, and healthcare professionals 
            across Canada in our supportive community dedicated to improving life with amyloidosis.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/90 hover:to-[#00DD89]/90 text-white border-0 rounded-3xl px-8 py-3">
              Join Our Community
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="border-[#00AFE6] text-[#00AFE6] hover:bg-[#00AFE6]/10 rounded-3xl px-8 py-3">
              Find Support Groups
              <Users className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
              Our Growing Community
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A vibrant network of support spanning coast to coast
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {communityStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-900 rounded-3xl text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#00AFE6]/20 to-[#00DD89]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="w-8 h-8 text-[#00AFE6]" />
                    </div>
                    <div className="text-3xl font-bold text-[#00AFE6] mb-2">{stat.number}</div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">{stat.label}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Groups */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
              Support Groups Across Canada
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Find local and virtual support groups tailored to your needs and location
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {supportGroups.map((group, index) => (
              <motion.div
                key={group.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 rounded-3xl">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="border-[#00AFE6] text-[#00AFE6]">
                        {group.type}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Users className="w-3 h-3" />
                        <span>{group.members}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
                      {group.name}
                    </CardTitle>
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{group.location}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#00AFE6] flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{group.meeting}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Heart className="w-4 h-4 text-[#00AFE6] flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{group.focus}</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-4 border-[#00AFE6] text-[#00AFE6] hover:bg-[#00AFE6]/10 rounded-2xl"
                    >
                      Learn More
                      <ArrowRight className="w-3 h-3 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button size="lg" className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/90 hover:to-[#00DD89]/90 text-white border-0 rounded-3xl px-8 py-3">
              Start a New Support Group
              <Plus className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Community Programs */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
              Community Programs
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive support services designed to help you at every step of your journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {communityPrograms.map((program, index) => (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-900 rounded-3xl">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6]/20 to-[#00DD89]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <program.icon className="w-6 h-6 text-[#00AFE6]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                          {program.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                          {program.description}
                        </p>
                        <ul className="space-y-2">
                          {program.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <div className="w-1.5 h-1.5 bg-[#00AFE6] rounded-full" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
              Community Voices
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Hear from community members about their experiences and the support they've found
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 rounded-3xl">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#00AFE6] text-[#00AFE6]" />
                      ))}
                    </div>
                    <blockquote className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed italic">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="border-t pt-4">
                      <div className="font-semibold text-gray-800 dark:text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</div>
                      <div className="text-sm text-[#00AFE6]">{testimonial.location}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Involved */}
      <section className="py-20 bg-gradient-to-br from-[#00AFE6]/10 via-white to-[#00DD89]/10 dark:from-[#00AFE6]/20 dark:via-gray-900 dark:to-[#00DD89]/20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
              Ways to Get Involved
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join our community and make a difference in the lives of those affected by amyloidosis
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {ways.map((way, index) => (
              <motion.div
                key={way.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 rounded-3xl text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#00AFE6]/20 to-[#00DD89]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <way.icon className="w-8 h-8 text-[#00AFE6]" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
                      {way.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                      {way.description}
                    </p>
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/90 hover:to-[#00DD89]/90 text-white border-0 rounded-2xl"
                    >
                      {way.action}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}