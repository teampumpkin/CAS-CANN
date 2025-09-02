import { motion } from 'framer-motion';
import { 
  Accessibility, 
  Check, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  Eye, 
  Keyboard, 
  Type, 
  Volume2, 
  Monitor, 
  Users, 
  ExternalLink,
  FileText,
  Star,
  Heart,
  Target,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const wcagGuidelines = [
  {
    principle: "Perceivable",
    icon: Eye,
    description: "Information and user interface components must be presentable to users in ways they can perceive",
    compliance: [
      "Alternative text for all images and graphics",
      "Captions and transcripts for multimedia content",
      "Sufficient color contrast ratios (4.5:1 for normal text, 3:1 for large text)",
      "Text can be resized up to 200% without loss of functionality",
      "Content does not rely solely on color to convey information"
    ]
  },
  {
    principle: "Operable",
    icon: Keyboard,
    description: "User interface components and navigation must be operable by all users",
    compliance: [
      "All functionality available via keyboard navigation",
      "No content that causes seizures or physical reactions",
      "Users can navigate and find content efficiently",
      "Sufficient time limits for time-sensitive content",
      "Clear focus indicators for keyboard navigation"
    ]
  },
  {
    principle: "Understandable",
    icon: Type,
    description: "Information and operation of user interface must be understandable",
    compliance: [
      "Text content is readable and understandable",
      "Content appears and operates in predictable ways",
      "Users are helped to avoid and correct mistakes",
      "Clear navigation and consistent layout",
      "Form fields have descriptive labels and error messages"
    ]
  },
  {
    principle: "Robust",
    icon: Monitor,
    description: "Content must be robust enough to be interpreted by a wide variety of user agents",
    compliance: [
      "Compatible with current and future assistive technologies",
      "Valid HTML markup and semantic structure",
      "Proper ARIA labels and roles where necessary",
      "Progressive enhancement for all features",
      "Regular testing with screen readers and other assistive technologies"
    ]
  }
];

const accessibilityFeatures = [
  {
    category: "Visual Accessibility",
    icon: Eye,
    features: [
      "High contrast mode support",
      "Font size adjustment (12px to 24px)",
      "Dyslexia-friendly font options",
      "Color contrast ratios exceeding WCAG AA standards",
      "Alternative text for all images",
      "Scalable vector graphics (SVG) for icons"
    ]
  },
  {
    category: "Motor Accessibility",
    icon: Keyboard,
    features: [
      "Full keyboard navigation support",
      "Large click targets (minimum 44px)",
      "Customizable cursor sizes",
      "Skip navigation links",
      "Accessible form controls",
      "Keyboard shortcuts for common actions"
    ]
  },
  {
    category: "Cognitive Accessibility",
    icon: Type,
    features: [
      "Clear and consistent navigation",
      "Reduced motion options",
      "Simple language and clear instructions",
      "Logical reading order",
      "Descriptive headings and labels",
      "Error prevention and correction"
    ]
  },
  {
    category: "Auditory Accessibility",
    icon: Volume2,
    features: [
      "Screen reader compatibility",
      "ARIA live regions for dynamic content",
      "Alternative formats for audio content",
      "Visual indicators for sound alerts",
      "Captions for video content",
      "Text alternatives for audio information"
    ]
  }
];

const complianceStatus = [
  {
    level: "WCAG 2.1 Level AA",
    status: "Compliant",
    badge: "success",
    description: "Meets or exceeds Web Content Accessibility Guidelines 2.1 Level AA standards"
  },
  {
    level: "Section 508",
    status: "Compliant",
    badge: "success",
    description: "Complies with Section 508 of the Rehabilitation Act"
  },
  {
    level: "AODA",
    status: "Compliant",
    badge: "success",
    description: "Meets Accessibility for Ontarians with Disabilities Act requirements"
  },
  {
    level: "EN 301 549",
    status: "Compliant",
    badge: "success",
    description: "Conforms to European accessibility standard EN 301 549"
  }
];

export default function AccessibilityStatement() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
        <div className="absolute inset-0 dark:block hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00AFE6]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00DD89]/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 bg-[#00AFE6]/10 backdrop-blur-xl rounded-full px-6 py-3 border border-[#00AFE6]/20 mb-6">
              <Accessibility className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-sm font-medium text-gray-900 dark:text-white/90">
                {language === 'en' ? 'WCAG 2.1 Level AA Compliant' : 'Conforme WCAG 2.1 Niveau AA'}
              </span>
            </div>
            
            <h1 className="text-[60px] font-bold font-rosarivo mb-6 leading-tight text-gray-900 dark:text-white">
              {language === 'en' 
                ? 'Accessibility Statement' 
                : 'Déclaration d\'accessibilité'
              }
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-white/70 mb-8 max-w-3xl mx-auto leading-relaxed">
              {language === 'en'
                ? 'The Canadian Amyloidosis Society is committed to ensuring digital accessibility for all users, including those with disabilities. We strive to provide an inclusive experience that meets the highest accessibility standards.'
                : 'La Société canadienne d\'amyloïdose s\'engage à garantir l\'accessibilité numérique pour tous les utilisateurs, y compris ceux ayant des handicaps. Nous nous efforçons de fournir une expérience inclusive qui répond aux normes d\'accessibilité les plus élevées.'
              }
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Badge className="bg-green-500/20 text-green-700 dark:text-green-300 px-4 py-2">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {language === 'en' ? 'WCAG 2.1 AA Compliant' : 'Conforme WCAG 2.1 AA'}
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-300 px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Section 508 Compliant' : 'Conforme Section 508'}
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-700 dark:text-purple-300 px-4 py-2">
                <Heart className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Inclusive Design' : 'Design inclusif'}
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-rosarivo mb-4 text-gray-900 dark:text-white">
                {language === 'en' ? 'Our Commitment' : 'Notre engagement'}
              </h2>
              <p className="text-lg text-gray-600 dark:text-white/70 max-w-2xl mx-auto">
                {language === 'en'
                  ? 'We believe that everyone deserves equal access to healthcare information and support, regardless of their abilities or disabilities.'
                  : 'Nous croyons que chacun mérite un accès égal aux informations et au soutien en matière de santé, indépendamment de ses capacités ou handicaps.'
                }
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 border-[#00AFE6]/20 dark:border-[#00AFE6]/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                    <Target className="w-6 h-6" />
                    {language === 'en' ? 'Our Mission' : 'Notre mission'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    {language === 'en'
                      ? 'To provide accessible, comprehensive healthcare information and support services that empower all individuals affected by amyloidosis, ensuring no one is left behind due to accessibility barriers.'
                      : 'Fournir des informations et des services de soutien en matière de santé accessibles et complets qui permettent à toutes les personnes affectées par l\'amyloïdose de s\'autonomiser, en veillant à ce que personne ne soit laissé pour compte en raison d\'obstacles à l\'accessibilité.'
                    }
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 border-[#00AFE6]/20 dark:border-[#00AFE6]/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                    <Users className="w-6 h-6" />
                    {language === 'en' ? 'Who We Serve' : 'Qui nous servons'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    {language === 'en'
                      ? 'Patients, caregivers, healthcare professionals, and researchers - including those who use assistive technologies such as screen readers, voice recognition software, and alternative input devices.'
                      : 'Patients, soignants, professionnels de santé et chercheurs - y compris ceux qui utilisent des technologies d\'assistance telles que les lecteurs d\'écran, les logiciels de reconnaissance vocale et les dispositifs d\'entrée alternatifs.'
                    }
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WCAG Compliance Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-rosarivo mb-4 text-gray-900 dark:text-white">
                {language === 'en' ? 'WCAG 2.1 Compliance' : 'Conformité WCAG 2.1'}
              </h2>
              <p className="text-lg text-gray-600 dark:text-white/70 max-w-2xl mx-auto">
                {language === 'en'
                  ? 'Our website meets the Web Content Accessibility Guidelines 2.1 Level AA standards across all four principles:'
                  : 'Notre site Web répond aux normes des Directives d\'accessibilité au contenu Web 2.1 Niveau AA sur les quatre principes:'
                }
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {wcagGuidelines.map((guideline, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full bg-white dark:bg-gray-900 hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                        <div className="w-10 h-10 bg-[#00AFE6]/10 rounded-full flex items-center justify-center">
                          <guideline.icon className="w-5 h-5 text-[#00AFE6]" />
                        </div>
                        {guideline.principle}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-white/70 mb-4">
                        {guideline.description}
                      </p>
                      <ul className="space-y-2">
                        {guideline.compliance.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-white/80">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Accessibility Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-rosarivo mb-4 text-gray-900 dark:text-white">
                {language === 'en' ? 'Accessibility Features' : 'Fonctionnalités d\'accessibilité'}
              </h2>
              <p className="text-lg text-gray-600 dark:text-white/70 max-w-2xl mx-auto">
                {language === 'en'
                  ? 'Our website includes comprehensive accessibility features designed to support users with diverse needs:'
                  : 'Notre site Web comprend des fonctionnalités d\'accessibilité complètes conçues pour soutenir les utilisateurs avec des besoins divers:'
                }
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {accessibilityFeatures.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                        <div className="w-10 h-10 bg-[#00DD89]/10 rounded-full flex items-center justify-center">
                          <category.icon className="w-5 h-5 text-[#00DD89]" />
                        </div>
                        {category.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {category.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-3">
                            <Check className="w-4 h-4 text-[#00DD89] mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-white/80">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Compliance Status Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-rosarivo mb-4 text-gray-900 dark:text-white">
                {language === 'en' ? 'Compliance Status' : 'Statut de conformité'}
              </h2>
              <p className="text-lg text-gray-600 dark:text-white/70">
                {language === 'en'
                  ? 'Our website meets or exceeds the following accessibility standards:'
                  : 'Notre site Web respecte ou dépasse les normes d\'accessibilité suivantes:'
                }
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {complianceStatus.map((compliance, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-white dark:bg-gray-900 border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {compliance.level}
                        </h3>
                        <Badge className="bg-green-500/20 text-green-700 dark:text-green-300">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {compliance.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-white/70">
                        {compliance.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact & Feedback Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-rosarivo mb-6 text-gray-900 dark:text-white">
              {language === 'en' ? 'Feedback & Support' : 'Commentaires et soutien'}
            </h2>
            <p className="text-lg text-gray-600 dark:text-white/70 mb-8">
              {language === 'en'
                ? 'We continuously work to improve our accessibility. If you encounter any barriers or have suggestions for improvement, please contact us:'
                : 'Nous travaillons continuellement à améliorer notre accessibilité. Si vous rencontrez des obstacles ou avez des suggestions d\'amélioration, veuillez nous contacter:'
              }
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 border-[#00AFE6]/20 dark:border-[#00AFE6]/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                    <Mail className="w-5 h-5" />
                    {language === 'en' ? 'Email Support' : 'Support par email'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {language === 'en'
                      ? 'For accessibility-related questions or to report issues:'
                      : 'Pour les questions liées à l\'accessibilité ou pour signaler des problèmes:'
                    }
                  </p>
                  <Button 
                    variant="outline" 
                    className="border-[#00AFE6]/30 text-[#00AFE6] hover:bg-[#00AFE6]/10 dark:border-[#00AFE6]/50 dark:text-[#00AFE6] dark:hover:bg-[#00AFE6]/20"
                    asChild
                  >
                    <a href="mailto:accessibility@canadianamyloidosis.ca">
                      accessibility@canadianamyloidosis.ca
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 border-[#00AFE6]/20 dark:border-[#00AFE6]/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                    <Phone className="w-5 h-5" />
                    {language === 'en' ? 'Phone Support' : 'Support téléphonique'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {language === 'en'
                      ? 'Call us during business hours (Monday-Friday, 9 AM - 5 PM EST):'
                      : 'Appelez-nous pendant les heures ouvrables (lundi-vendredi, 9h-17h EST):'
                    }
                  </p>
                  <Button 
                    variant="outline" 
                    className="border-[#00DD89]/30 text-[#00DD89] hover:bg-[#00DD89]/10 dark:border-[#00DD89]/50 dark:text-[#00DD89] dark:hover:bg-[#00DD89]/20"
                    asChild
                  >
                    <a href="tel:+1-800-555-0123">
                      1-800-555-0123
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-[#00AFE6]" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {language === 'en' ? 'Response Time' : 'Temps de réponse'}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-white/70">
                {language === 'en'
                  ? 'We aim to respond to all accessibility-related inquiries within 2-3 business days and will work with you to resolve any issues as quickly as possible.'
                  : 'Nous visons à répondre à toutes les demandes liées à l\'accessibilité dans les 2-3 jours ouvrables et travaillerons avec vous pour résoudre tout problème le plus rapidement possible.'
                }
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Last Updated Section */}
      <section className="py-8 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-white/70">
              <FileText className="w-4 h-4" />
              <span>
                {language === 'en' 
                  ? 'Last updated: July 18, 2025'
                  : 'Dernière mise à jour: 18 juillet 2025'
                }
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}