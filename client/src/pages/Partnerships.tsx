import { motion } from 'framer-motion';
import { ExternalLink, Globe, Heart, Users, Handshake, ArrowRight, Building2, Stethoscope, GraduationCap, Network } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ParallaxBackground from '../components/ParallaxBackground';
import healthcareProfessionalImg from '@assets/DSC02826_1750068895453.jpg';
import partnershipImage from '@assets/DSC02841_1750068895454.jpg';

export default function Partnerships() {
  const { t } = useLanguage();

  const partnerships = [
    {
      category: "International Organizations",
      icon: Globe,
      organizations: [
        {
          name: "Amyloidosis Support Groups",
          description: "Global network of patient support organizations",
          website: "https://amyloidosis.org",
          country: "International"
        },
        {
          name: "International Society of Amyloidosis",
          description: "Worldwide scientific organization for amyloidosis research",
          website: "https://isa-amyloidosis.org",
          country: "International"
        },
        {
          name: "Amyloidosis Research Consortium",
          description: "Collaborative research initiative",
          website: "https://amyloidosisresearch.org",
          country: "International"
        }
      ]
    },
    {
      category: "North American Partners",
      icon: Heart,
      organizations: [
        {
          name: "Amyloidosis Foundation",
          description: "Leading US-based amyloidosis patient organization",
          website: "https://amyloidosis.org",
          country: "United States"
        },
        {
          name: "AL Amyloidosis Foundation",
          description: "Specialized support for AL amyloidosis patients",
          website: "https://alamyloidosis.org",
          country: "United States"
        },
        {
          name: "TTR Amyloidosis Support Network",
          description: "Focus on hereditary transthyretin amyloidosis",
          website: "https://ttramyloidosis.org",
          country: "United States"
        }
      ]
    },
    {
      category: "Healthcare Institutions",
      icon: Building2,
      organizations: [
        {
          name: "Mayo Clinic Amyloidosis Program",
          description: "Comprehensive amyloidosis care and research",
          website: "https://mayoclinic.org/amyloidosis",
          country: "United States"
        },
        {
          name: "Boston University Amyloidosis Center",
          description: "Leading research and treatment center",
          website: "https://bu.edu/amyloidosis",
          country: "United States"
        },
        {
          name: "Princess Margaret Cancer Centre",
          description: "Canadian amyloidosis treatment excellence",
          website: "https://uhn.ca",
          country: "Canada"
        }
      ]
    },
    {
      category: "Research Networks",
      icon: GraduationCap,
      organizations: [
        {
          name: "Canadian Amyloidosis Research Network",
          description: "Collaborative research across Canada",
          website: "#",
          country: "Canada"
        },
        {
          name: "European Amyloidosis Network",
          description: "Pan-European research collaboration",
          website: "https://europeanamyloidosis.org",
          country: "Europe"
        },
        {
          name: "Global Amyloidosis Registry",
          description: "International patient data collaboration",
          website: "https://globalamyloidosis.org",
          country: "International"
        }
      ]
    }
  ];

  const collaborationTypes = [
    {
      icon: Users,
      title: "Patient Support",
      description: "Collaborative patient advocacy and support programs"
    },
    {
      icon: Stethoscope,
      title: "Clinical Guidelines",
      description: "Joint development of evidence-based treatment protocols"
    },
    {
      icon: Network,
      title: "Research Collaboration",
      description: "Shared research initiatives and data exchange"
    },
    {
      icon: GraduationCap,
      title: "Education Programs",
      description: "Joint educational initiatives for healthcare professionals"
    }
  ];

  // Strategic Partners from About page
  const partners = [
    {
      name: "International Society of Amyloidosis",
      shortName: "ISA",
      description: "International amyloidosis research network",
      url: "https://isa-amyloidosis.org"
    },
    {
      name: "Amyloidosis Foundation",
      shortName: "AF",
      description: "Leading US patient advocacy organization",
      url: "https://amyloidosis.org"
    },
    {
      name: "European Amyloidosis Network", 
      shortName: "EAN",
      description: "European clinical collaboration platform",
      url: "https://europeanamyloidosis.org"
    },
    {
      name: "Canadian Amyloidosis Research Network",
      shortName: "CARN",
      description: "National research collaboration initiative",
      url: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
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
            <Handshake className="w-4 h-4 text-[#00AFE6]" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Strategic Partnerships</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
              Partnerships &
            </span>
            <br />
            <span className="text-gray-800 dark:text-white">
              Amyloidosis Organizations
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Building bridges across the global amyloidosis community through strategic partnerships, 
            collaborative research, and shared patient advocacy initiatives.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/90 hover:to-[#00DD89]/90 text-white border-0 rounded-3xl px-8 py-3">
              Explore Partnerships
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="border-[#00AFE6] text-[#00AFE6] hover:bg-[#00AFE6]/10 rounded-3xl px-8 py-3">
              Contact Us
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Collaboration Types Section */}
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
              Types of Collaboration
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our partnerships span multiple areas of focus to maximize impact for the amyloidosis community
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {collaborationTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-900 rounded-3xl">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#00AFE6]/20 to-[#00DD89]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <type.icon className="w-8 h-8 text-[#00AFE6]" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
                      {type.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {type.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Organizations Section */}
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
              Partner Organizations
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Working together with leading organizations worldwide to advance amyloidosis care and research
            </p>
          </motion.div>

          <div className="space-y-16">
            {partnerships.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: categoryIndex * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6]/20 to-[#00DD89]/20 rounded-xl flex items-center justify-center">
                    <category.icon className="w-6 h-6 text-[#00AFE6]" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {category.category}
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.organizations.map((org, orgIndex) => (
                    <motion.div
                      key={org.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: orgIndex * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -5 }}
                    >
                      <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 rounded-3xl group">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-[#00AFE6] transition-colors">
                            {org.name}
                          </CardTitle>
                          <div className="text-sm text-[#00AFE6] font-medium">
                            {org.country}
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                            {org.description}
                          </p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="p-0 h-auto text-[#00AFE6] hover:text-[#00AFE6]/80 hover:bg-transparent"
                            asChild
                          >
                            <a href={org.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                              Visit Website
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Partnerships Section */}
      <section className="py-24 pb-32 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-white/10">
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
                  <img 
                    src={partnershipImage} 
                    alt="Modern healthcare complex representing our strategic partnerships and institutional collaborations"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Partnership Stats Overlay */}
                  <motion.div
                    className="absolute bottom-6 left-6 right-6 bg-white/90 dark:bg-white/10 backdrop-blur-xl border border-gray-200 dark:border-white/20 rounded-2xl shadow-2xl"
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
                          <div className="text-xs text-gray-600 dark:text-white/80">Strategic Partners</div>
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
                          <div className="text-xs text-gray-600 dark:text-white/80">Countries</div>
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
                <span className="text-sm font-medium text-gray-700 dark:text-white/90">Our Partners</span>
              </motion.div>
              
              <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-6 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                  Strategic
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                  Partnerships
                </span>
              </h2>
              
              <p className="text-lg text-gray-600 dark:text-white/70 leading-relaxed mb-8">
                We collaborate with leading organizations, research institutions, and healthcare networks to amplify our impact and accelerate progress in amyloidosis care across Canada and internationally.
              </p>
              
              <div className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl mb-8">
                <motion.div
                  className="text-center mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-xl rounded-full px-6 py-3 border border-white/30 mb-4">
                    <Network className="w-5 h-5 text-[#00AFE6]" />
                    <span className="text-sm font-medium text-gray-700 dark:text-white/90">Strategic Alliances</span>
                  </div>
                  <h3 className="text-2xl font-bold font-rosarivo text-gray-800 dark:text-white mb-2">
                    <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                      Global
                    </span>
                    {' '}
                    <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                      Partners
                    </span>
                  </h3>
                  <p className="text-gray-600 dark:text-white/70 text-sm max-w-md mx-auto">
                    Collaborating with leading organizations to advance amyloidosis care worldwide
                  </p>
                </motion.div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {partners.map((partner, index) => (
                    <motion.a
                      key={partner.shortName}
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative group"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -8 }}
                    >
                      <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-500 group-hover:bg-white/10 overflow-hidden">
                        {/* Background Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00AFE6]/5 via-transparent to-[#00DD89]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Content */}
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#00AFE6]/30 to-[#00DD89]/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all duration-500 shadow-lg">
                              <span className="text-xl font-bold text-white drop-shadow-lg">{partner.shortName}</span>
                            </div>
                            <div className="w-8 h-8 bg-white/10 rounded-3xl flex items-center justify-center group-hover:bg-[#00AFE6]/20 transition-all duration-300">
                              <svg className="w-4 h-4 text-white/60 group-hover:text-[#00AFE6] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <h4 className="text-gray-800 dark:text-white font-bold text-lg group-hover:text-[#00AFE6] transition-colors duration-300 leading-tight">
                              {partner.name}
                            </h4>
                            <p className="text-gray-600 dark:text-white/80 text-sm leading-relaxed group-hover:text-gray-800 dark:group-hover:text-white transition-colors duration-300">
                              {partner.description}
                            </p>
                          </div>
                        </div>
                        
                        {/* Floating Elements */}
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200" />
                        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-r from-[#00DD89] to-[#00AFE6] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300" />
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partnership CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#00AFE6]/10 via-white to-[#00DD89]/10 dark:from-[#00AFE6]/20 dark:via-gray-900 dark:to-[#00DD89]/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white">
              Partner With Us
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Join our network of organizations working to improve outcomes for amyloidosis patients worldwide. 
              Together, we can accelerate research, improve care, and support patients and families.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/90 hover:to-[#00DD89]/90 text-white border-0 rounded-3xl px-8 py-3">
                Explore Partnership Opportunities
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="border-[#00AFE6] text-[#00AFE6] hover:bg-[#00AFE6]/10 rounded-3xl px-8 py-3">
                Contact Partnership Team
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}