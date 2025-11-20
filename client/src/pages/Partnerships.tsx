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
  BookOpen,
  Download,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import ParallaxBackground from "../components/ParallaxBackground";
import healthcareProfessionalImg from "@assets/DSC02826_1750068895453.jpg";
import partnershipImage from "@assets/DSC02841_1750068895454.jpg";
import cardiacAmyloidosisBooklet from "@assets/Living-with-cardiac-amyloidosis_1763624816977.pdf";

export default function Partnerships() {
  const { t } = useLanguage();

  const partnerships = [
    {
      category: "International Organizations",
      icon: Globe,
      organizations: [
        {
          name: "Amyloidosis Alliance",
          description: "Global network of patient support organizations",
          website: "https://www.amyloidosisalliance.org",
          country: "International",
        },
        {
          name: "International Society of Amyloidosis",
          description:
            "Worldwide scientific organization for amyloidosis research",
          website: "https://www.isaamyloidosis.org",
          country: "International",
        },
        {
          name: "World Amyloidosis Day",
          description:
            "Annual global event recognizing the fight against amyloidosis",
          website: "https://www.worldamyloidosisday.org",
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
          description: "US-based amyloidosis patient organization",
          website: "https://amyloidosis.org",
          country: "United States",
        },
        {
          name: "Amyloidosis Research Consortium",
          description: "Collaborative research initiative",
          website: "https://arci.org",
          country: "United States",
        },
        {
          name: "Amyloidosis Support Group",
          description: "US-based amyloidosis patient orgnization",
          website: "https://www.amyloidosissupport.org",
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
      ],
    },
    {
      category: "Research Networks",
      icon: GraduationCap,
      organizations: [
        {
          name: "Canadian Registry for Amyloidosis Research",
          description: "Collaborative research registry across Canada",
          website: "https://amyloidregistry.ca/home",
          country: "Canada",
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

      {/* Educational Materials Section */}
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
              Educational resources for amyloidosis nurses, healthcare
              professionals and patients.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Living with Cardiac Amyloidosis Booklet */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-800/95 dark:to-gray-900/95 border border-gray-200 dark:border-gray-700 hover:border-[#00AFE6]/50 dark:hover:border-[#00AFE6]/50 hover:shadow-xl hover:shadow-[#00AFE6]/10 transition-all duration-300 h-full flex flex-col rounded-2xl overflow-hidden group">
                <CardContent className="p-6 flex flex-col flex-1">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-[#00AFE6]/20 to-[#00DD89]/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                    <BookOpen className="w-8 h-8 text-[#00AFE6] dark:text-[#00AFE6]" />
                  </div>

                  {/* Badge */}
                  <Badge className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white border-0 px-3 py-1 text-xs font-medium rounded-full mb-4 w-fit">
                    Patient Resource
                  </Badge>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight group-hover:text-[#00AFE6] dark:group-hover:text-[#00AFE6] transition-colors duration-300">
                    Living with Cardiac Amyloidosis
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-white/70 text-sm leading-relaxed flex-1 mb-4">
                    Living with Cardiac Amyloidosis is a helpful guide for people who have this condition, their families, and anyone who wants to learn more about it. It explains what cardiac amyloidosis is, how it is diagnosed, and how it can be treated.
                  </p>

                  {/* French Translation Notice */}
                  <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-blue-700 dark:text-blue-300 font-medium text-center italic">
                      French translation of the booklet coming soon
                    </p>
                  </div>

                  {/* Download Button */}
                  <a
                    href={cardiacAmyloidosisBooklet}
                    download="Living-with-Cardiac-Amyloidosis.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/90 hover:to-[#00DD89]/90 text-white border-0 rounded-xl w-full shadow-lg hover:shadow-xl hover:shadow-[#00AFE6]/25 transition-all duration-300 group/btn"
                      data-testid="button-download-cardiac-booklet"
                    >
                      <Download className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-300" />
                      Download PDF
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
