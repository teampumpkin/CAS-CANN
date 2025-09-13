import { motion } from "framer-motion";
import {
  ExternalLink,
  Globe,
  Heart,
  Users,
  Handshake,
  ArrowRight,
  Building2,
  Stethoscope,
  GraduationCap,
  Network,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import ParallaxBackground from "../components/ParallaxBackground";
import healthcareProfessionalImg from "@assets/DSC02826_1750068895453.jpg";
import partnershipImage from "@assets/DSC02841_1750068895454.jpg";

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
          country: "International",
        },
        {
          name: "International Society of Amyloidosis",
          description:
            "Worldwide scientific organization for amyloidosis research",
          website: "https://www.isaamyloidosis.org/",
          country: "International",
        },
        {
          name: "Amyloidosis Research Consortium",
          description: "Collaborative research initiative",
          website: "https://arci.org/",
          country: "International",
        },
      ],
    },
    {
      category: "North American Partners",
      icon: Heart,
      organizations: [
        {
          name: "Amyloidosis Foundation",
          description: "Leading US-based amyloidosis patient organization",
          website: "https://amyloidosis.org",
          country: "United States",
        },
        {
          name: "AL Amyloidosis Foundation",
          description: "Specialized support for AL amyloidosis patients",
          website: "https://alamyloidosis.org",
          country: "United States",
        },
        {
          name: "TTR Amyloidosis Support Network",
          description: "Focus on hereditary transthyretin amyloidosis",
          website: "https://ttramyloidosis.org",
          country: "United States",
        },
      ],
    },
    {
      category: "Healthcare Institutions",
      icon: Building2,
      organizations: [
        {
          name: "Mayo Clinic Amyloidosis Program",
          description: "Comprehensive amyloidosis care and research",
          website: "https://mayoclinic.org/amyloidosis",
          country: "United States",
        },
        {
          name: "Boston University Amyloidosis Center",
          description: "Leading research and treatment center",
          website: "https://www.bu.edu/amyloid",
          country: "United States",
        },
        {
          name: "Princess Margaret Cancer Centre",
          description: "Canadian amyloidosis treatment excellence",
          website: "https://uhn.ca",
          country: "Canada",
        },
      ],
    },
    {
      category: "Research Networks",
      icon: GraduationCap,
      organizations: [
        {
          name: "Canadian Amyloidosis Research Network",
          description: "Collaborative research across Canada",
          website: "#",
          country: "Canada",
        },
        {
          name: "European Amyloidosis Network",
          description: "Pan-European research collaboration",
          website: "https://europeanamyloidosis.org",
          country: "Europe",
        },
        {
          name: "Global Amyloidosis Registry",
          description: "International patient data collaboration",
          website: "https://globalamyloidosis.org",
          country: "International",
        },
      ],
    },
  ];

  const collaborationTypes = [
    {
      icon: Users,
      title: "Patient Support",
      description: "Collaborative patient advocacy and support programs",
    },
    {
      icon: Stethoscope,
      title: "Clinical Guidelines",
      description: "Joint development of evidence-based treatment protocols",
    },
    {
      icon: Network,
      title: "Research Collaboration",
      description: "Shared research initiatives and data exchange",
    },
    {
      icon: GraduationCap,
      title: "Education Programs",
      description: "Joint educational initiatives for healthcare professionals",
    },
  ];

  // Strategic Partners from About page
  const partners = [
    {
      name: "International Society of Amyloidosis",
      shortName: "ISA",
      description: "International amyloidosis research network",
      url: "https://www.isaamyloidosis.org",
    },
    {
      name: "Amyloidosis Foundation",
      shortName: "AF",
      description: "Leading US patient advocacy organization",
      url: "https://amyloidosis.org",
    },
    {
      name: "Canadian Amyloidosis Research Network",
      shortName: "CARN",
      description: "National research collaboration initiative",
      url: "#",
    },
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
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Strategic Partnerships
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="crawford-section-title mb-6"
          >
            <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
              Partnerships And Other
            </span>
            <br />
            <span className="text-gray-800 dark:text-white">
              Amyloidosis Organizations
            </span>
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-xl md:text-2xl font-medium text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto"
          >
            Collaborative relationships that strengthen our impact
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            We work with leading organizations to advance amyloidosis care,
            research, and patient support across Canada.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/90 hover:to-[#00DD89]/90 text-white border-0 rounded-3xl px-8 py-3"
              asChild
            >
              <Link href="/contact">
                Contact Us
                <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Strategic Partnerships Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00AFE6]/20 to-[#00DD89]/20 backdrop-blur-sm border border-[#00AFE6]/30 rounded-full px-6 py-2 mb-6">
              <Network className="w-4 h-4 text-[#00AFE6]" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Strategic Alliances
              </span>
            </div>

            <h2 className="crawford-section-title mb-4">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                Global
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Partners
              </span>
            </h2>

            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Collaborating with leading organizations to advance amyloidosis
              care worldwide
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {partners.map((partner, index) => {
              const isClickable = partner.shortName !== "CARN";
              const Component = isClickable ? motion.a : motion.div;
              const componentProps = isClickable
                ? {
                    href: partner.url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                  }
                : {};

              return (
                <Component
                  key={partner.shortName}
                  {...componentProps}
                  className="group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                >
                  <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 hover:border-[#00AFE6]/50 dark:hover:border-[#00AFE6]/50 transition-all duration-500 hover:shadow-xl group-hover:bg-gradient-to-br group-hover:from-[#00AFE6]/5 group-hover:to-[#00DD89]/5 overflow-hidden h-full">
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00AFE6]/5 via-transparent to-[#00DD89]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Content */}
                    <div className="relative z-10 text-center h-full flex flex-col">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#00AFE6]/20 to-[#00DD89]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:from-[#00AFE6]/30 group-hover:to-[#00DD89]/30">
                        <span className="text-2xl font-bold text-[#00AFE6] group-hover:text-white transition-colors duration-300">
                          {partner.shortName}
                        </span>
                      </div>

                      <h4 className="text-gray-800 dark:text-white font-bold text-lg group-hover:text-[#00AFE6] transition-colors duration-300 leading-tight mb-3">
                        {partner.name}
                      </h4>
                      <p className="text-gray-600 dark:text-white/80 text-sm leading-relaxed group-hover:text-gray-800 dark:group-hover:text-white transition-colors duration-300 flex-1">
                        {partner.description}
                      </p>

                      {isClickable && (
                        <div className="mt-6 flex items-center justify-center">
                          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 hover:from-[#00AFE6]/20 hover:to-[#00DD89]/20 border border-[#00AFE6]/30 hover:border-[#00AFE6]/50 rounded-full px-4 py-2 transition-all duration-300 group-hover:shadow-md">
                            <span className="text-xs font-semibold text-[#00AFE6] group-hover:text-[#00AFE6]">
                              Visit
                            </span>
                            <svg
                              className="w-3 h-3 text-[#00AFE6] group-hover:text-[#00AFE6] transition-colors duration-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Floating Elements */}
                    <div className="absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200" />
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-r from-[#00DD89] to-[#00AFE6] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300" />
                  </div>
                </Component>
              );
            })}
          </div>
        </div>
      </section>

      {/* Collaboration Types Section - Hidden */}
      {/* 
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="crawford-section-title mb-4">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                Types of
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Collaboration
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our partnerships span multiple areas of focus to maximize impact
              for the amyloidosis community
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
      */}

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
            <h2 className="crawford-section-title mb-4">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                Amyloidosis
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Organizations
              </span>
            </h2>
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
                            <a
                              href={org.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2"
                            >
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

      {/* Partnership CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#00AFE6]/10 via-white to-[#00DD89]/10 dark:from-[#00AFE6]/20 dark:via-gray-900 dark:to-[#00DD89]/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="crawford-section-title mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                Partner
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                With Us
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Join our network of organizations working to improve outcomes for
              amyloidosis patients worldwide. Together, we can accelerate
              research, improve care, and support patients and families.
            </p>
            <div className="flex justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/90 hover:to-[#00DD89]/90 text-white border-0 rounded-3xl px-8 py-3"
                asChild
              >
                <Link href="/contact">Get in touch</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
