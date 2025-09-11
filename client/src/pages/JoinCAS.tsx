import { motion } from "framer-motion";
import { 
  Heart, 
  Users, 
  Mail, 
  Phone, 
  ArrowRight,
  Check,
  UserPlus,
  BookOpen,
  Shield,
  Star,
  Handshake,
  Stethoscope,
  Upload,
  Vote,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  FileText,
  Network,
  Gift,
  UserCheck,
  Globe,
  Calendar,
  Award,
  Gavel,
  Languages,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

const membershipBenefits = [
  {
    icon: Upload,
    title: "Resource Upload Rights",
    description: "Submit and share clinical tools, protocols, and educational materials with the entire CAS community"
  },
  {
    icon: Vote,
    title: "Governance Voice",
    description: "Participate in CAS governance decisions and vote on important policy matters affecting amyloidosis care"
  },
  {
    icon: Network,
    title: "Professional Network",
    description: "Access to exclusive professional network of amyloidosis specialists across Canada"
  },
  {
    icon: Gift,
    title: "Premium Tools Access",
    description: "Early access to new clinical tools, research findings, and professional development resources"
  },
  {
    icon: Calendar,
    title: "Priority Event Access",
    description: "Priority registration for conferences, webinars, and professional development events"
  },
  {
    icon: Award,
    title: "Recognition & Listing",
    description: "Professional recognition and listing in the CAS member directory with your specialization"
  }
];

const whoCanJoin = [
  {
    icon: Stethoscope,
    title: "Healthcare Professionals",
    description: "Physicians, nurses, allied health professionals involved in amyloidosis care",
    requirements: "Must have active healthcare license and clinical experience"
  },
  {
    icon: BookOpen,
    title: "Researchers & Academics",
    description: "Scientists, academics, and research professionals studying amyloidosis",
    requirements: "Must be affiliated with recognized research institution"
  },
  {
    icon: Shield,
    title: "Healthcare Administrators",
    description: "Healthcare system leaders and administrators managing amyloidosis programs",
    requirements: "Must hold leadership role in healthcare organization"
  },
  {
    icon: Users,
    title: "Patient Advocates",
    description: "Patient representatives and advocacy group leaders",
    requirements: "Must represent patient community or advocacy organization"
  }
];

const approvalProcess = [
  {
    step: 1,
    title: "Application Review",
    description: "Initial review of application and credentials verification",
    timeline: "3-5 business days"
  },
  {
    step: 2,
    title: "Credential Verification",
    description: "Verification of professional credentials and organizational affiliation",
    timeline: "5-7 business days"
  },
  {
    step: 3,
    title: "Committee Approval",
    description: "Final review by CAS membership committee",
    timeline: "7-10 business days"
  },
  {
    step: 4,
    title: "Welcome & Onboarding",
    description: "Welcome package and access to member resources",
    timeline: "1-2 business days"
  }
];

export default function JoinCAS() {

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
        {/* Background Elements */}
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
              <UserPlus className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-sm font-medium text-gray-900 dark:text-white/90">Professional Membership</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-rosarivo mb-6 leading-tight text-gray-900 dark:text-white">
              Join the{" "}
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Canadian Amyloidosis Society
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Become part of Canada's premier professional network for amyloidosis care. Access exclusive clinical tools, contribute to governance decisions, and collaborate with leading experts across the country.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => document.getElementById('join-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-10 py-6 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-[#00AFE6]/25 transition-all duration-300 group"
              >
                <span>Register for Membership</span>
                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                variant="outline"
                onClick={() => document.getElementById('why-join')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-[#00AFE6]/30 text-[#00AFE6] hover:bg-[#00AFE6]/10 px-8 py-6 rounded-2xl font-semibold text-lg"
              >
                Learn More
                <BookOpen className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>

      </section>

      {/* Why Join Section */}
      <section id="why-join" className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-rosarivo text-gray-900 dark:text-white mb-4">
              Why Join <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">CAS?</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-white/70 max-w-3xl mx-auto">
              CAS membership provides exclusive access to professional tools, governance participation, and a network of Canada's leading amyloidosis experts.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {membershipBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white dark:bg-white/10 border-gray-200 dark:border-white/20 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center">
                        <benefit.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-gray-900 dark:text-white">{benefit.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-white/70">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Can Join Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-rosarivo text-gray-900 dark:text-white mb-4">
              Who Can <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">Join?</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-white/70 max-w-3xl mx-auto">
              CAS membership is open to qualified professionals who contribute to amyloidosis care, research, and patient advocacy in Canada.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whoCanJoin.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white dark:bg-white/10 border-gray-200 dark:border-white/20 hover:shadow-lg transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center">
                        <category.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-gray-900 dark:text-white">{category.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-white/70 mb-4">{category.description}</p>
                    <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-3xl">
                      <p className="text-sm text-gray-600 dark:text-white/60">
                        <strong>Requirements:</strong> {category.requirements}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What Happens Next Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-rosarivo text-gray-900 dark:text-white mb-4">
              What Happens <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">Next?</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-white/70 max-w-3xl mx-auto">
              Our comprehensive review process ensures that all members meet professional standards while providing a streamlined approval experience.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <Alert className="bg-[#00AFE6]/10 border-[#00AFE6]/30 mb-8">
              <Clock className="w-4 h-4 text-[#00AFE6]" />
              <AlertDescription className="text-gray-900 dark:text-white/90">
                <strong>Total Review Time: 2-3 weeks</strong> - We aim to process applications as quickly as possible while maintaining high standards.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {approvalProcess.map((process, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-white dark:bg-white/10 border-gray-200 dark:border-white/20 hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full flex items-center justify-center text-white font-bold">
                          {process.step}
                        </div>
                        <CardTitle className="text-gray-900 dark:text-white">{process.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-white/70 mb-3">{process.description}</p>
                      <Badge variant="secondary" className="bg-[#00AFE6]/10 text-[#00AFE6] border-[#00AFE6]/30">
                        {process.timeline}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section id="join-form" className="py-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-white/10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-rosarivo text-gray-900 dark:text-white mb-4">
                Register for <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">CAS</span>
              </h2>
              <p className="text-gray-600 dark:text-white/70 max-w-2xl mx-auto mb-8">
                Join Canada's leading professional network for amyloidosis care. Please provide accurate information to help us process your application efficiently.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Alert className="bg-[#00AFE6]/10 border-[#00AFE6]/30 mb-8">
                <Info className="w-4 h-4 text-[#00AFE6]" />
                <AlertDescription className="text-gray-900 dark:text-white/90">
                  <strong>Terms of Participation & Privacy Policy:</strong> By applying, you agree to abide by our professional standards and governance framework. All personal information is handled according to our privacy policy.
                </AlertDescription>
              </Alert>

              <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#00AFE6]/5 via-transparent to-[#00DD89]/5" />
                
                {/* Form Header */}
                <div className="relative bg-gradient-to-r from-[#00AFE6] to-[#00DD89] p-8 text-center">
                  {/* Floating elements */}
                  <div className="absolute top-4 left-4 w-8 h-8 bg-white/10 rounded-full blur-sm animate-pulse" />
                  <div className="absolute bottom-4 right-4 w-6 h-6 bg-white/10 rounded-full blur-sm animate-pulse delay-1000" />
                  
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3 font-rosarivo">
                    CAS Registration Form
                  </h3>
                  <p className="text-white/90 text-sm max-w-md mx-auto">
                    Complete your professional application below. All fields are secure and confidential.
                  </p>
                  
                  {/* Progress indicators */}
                  <div className="flex justify-center gap-2 mt-6">
                    <div className="w-2 h-2 bg-white/40 rounded-full" />
                    <div className="w-8 h-2 bg-white/60 rounded-full" />
                    <div className="w-2 h-2 bg-white/40 rounded-full" />
                  </div>
                </div>

                {/* Embedded Form with improved styling */}
                <div className="relative bg-white dark:bg-gray-800">
                  {/* Form frame decoration */}
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent dark:from-gray-700/50 pointer-events-none" />
                  
                  <div className="p-2 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10">
                    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-inner">
                      <iframe
                        src="https://forms.office.com/Pages/ResponsePage.aspx?id=7KAJxuOlMUaWhhkigL2RUV3g_7vFhtBCm2WYpb7e-YpUMUZNOTlCQ1dTNVJaV09NUzBJUFpCMzg5UC4u&embed=true"
                        width="100%"
                        height="800"
                        frameBorder="0"
                        marginHeight={0}
                        marginWidth={0}
                        className="w-full transition-all duration-300"
                        title="CAS Registration Form"
                      >
                        {/* Enhanced loading state */}
                        <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-800">
                          <div className="text-center">
                            <div className="w-8 h-8 border-4 border-[#00AFE6]/20 border-t-[#00AFE6] rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-gray-600 dark:text-gray-400">Loading registration form...</p>
                          </div>
                        </div>
                      </iframe>
                    </div>
                  </div>
                </div>

                {/* Enhanced Form Footer */}
                <div className="relative p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700">
                  {/* Trust indicators with enhanced design */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <motion.div 
                      className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">Secure & Encrypted</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">SSL protected</p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">5-10 Minutes</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Average completion</p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">Review in 2-3 Weeks</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Professional review</p>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Help section */}
                  <div className="text-center p-4 bg-[#00AFE6]/5 rounded-xl border border-[#00AFE6]/20">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Need assistance with your application?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button 
                        onClick={() => window.open('https://forms.office.com/Pages/ResponsePage.aspx?id=7KAJxuOlMUaWhhkigL2RUV3g_7vFhtBCm2WYpb7e-YpUMUZNOTlCQ1dTNVJaV09NUzBJUFpCMzg5UC4u', '_blank')}
                        className="inline-flex items-center gap-2 text-[#00AFE6] hover:text-[#00DD89] font-medium transition-colors duration-200"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open in new window
                      </button>
                      <a 
                        href="mailto:info@amyloid.ca"
                        className="inline-flex items-center gap-2 text-[#00AFE6] hover:text-[#00DD89] font-medium transition-colors duration-200"
                      >
                        <Mail className="w-4 h-4" />
                        Email support
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}