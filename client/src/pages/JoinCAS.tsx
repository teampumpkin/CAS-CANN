import { motion } from "framer-motion";
import {
  ArrowRight,
  UserPlus,
  BookOpen,
  Vote,
  Network,
  Gift,
  Calendar,
  Stethoscope,
  Info,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const membershipBenefits = [
  {
    icon: Vote,
    title: "Amyloidosis Updates",
    description:
      "Updates from important news and developments from the world of amyloidosis in Canada and internationally.",
  },
  {
    icon: Network,
    title: "Professional Network",
    description:
      "Access to exclusive professional network of amyloidosis specialists across Canada",
  },
  {
    icon: Gift,
    title: "Clinical Tools Access",
    description:
      "Access to new clinical tools, research findings, and professional development resources",
  },
  {
    icon: Calendar,
    title: "Event Access",
    description:
      "Notification and registration for conferences, webinars, and professional development events",
  },
];

const whoCanJoin = [
  {
    icon: Stethoscope,
    title: "Healthcare Professionals",
    description:
      "Physicians, nurses, allied health professionals involved in amyloidosis care",
  },
  {
    icon: BookOpen,
    title: "Researchers & Academics",
    description:
      "Scientists, academics, and research professionals studying amyloidosis",
  },
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
              <span className="text-sm font-medium text-gray-900 dark:text-white/90">
                Professional Membership
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-rosarivo mb-6 leading-tight text-gray-900 dark:text-white">
              Join the{" "}
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Canadian Amyloidosis Society
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Become part of Canada's premier professional network for
              amyloidosis care. Access clinical tools, contribute to governance
              decisions, and collaborate with leading experts across the
              country.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() =>
                  document
                    .getElementById("join-form")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-10 py-6 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-[#00AFE6]/25 transition-all duration-300 group"
                data-testid="button-register-membership"
              >
                <span>Register for Membership</span>
                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  document
                    .getElementById("why-join")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="border-[#00AFE6]/30 text-[#00AFE6] hover:bg-[#00AFE6]/10 px-8 py-6 rounded-2xl font-semibold text-lg"
                data-testid="button-learn-more"
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
              Why Join{" "}
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                CAS?
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-white/70 max-w-3xl mx-auto">
              CAS membership provides access to professional tools, governance
              participation, and a network of Canada's leading amyloidosis
              experts.
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
                      <CardTitle className="text-gray-900 dark:text-white">
                        {benefit.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-white/70">
                      {benefit.description}
                    </p>
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
              Who Can{" "}
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Join?
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-white/70 max-w-3xl mx-auto">
              CAS membership is open to professionals who contribute to
              amyloidosis care, research, and patient advocacy in Canada.
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
                      <CardTitle className="text-gray-900 dark:text-white">
                        {category.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-white/70 mb-4">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section
        id="join-form"
        className="py-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-white/10"
      >
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
                Register for{" "}
                <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                  CAS
                </span>
              </h2>
              <p className="text-gray-600 dark:text-white/70 max-w-2xl mx-auto mb-8">
                Join Canada's leading professional network for amyloidosis care
                by submitting the registration form below.
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
                  <strong>Terms of Participation & Privacy Policy:</strong> By
                  applying, you agree to abide by our professional standards and
                  governance framework. All personal information is handled
                  according to our privacy policy.
                </AlertDescription>
              </Alert>

              <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#00AFE6]/5 via-transparent to-[#00DD89]/5" />

                {/* Form Header */}
                <div className="relative bg-gradient-to-r from-[#00AFE6] to-[#00DD89] p-4 text-center">
                  {/* Floating elements */}
                  <div className="absolute top-3 left-3 w-6 h-6 bg-white/10 rounded-full blur-sm animate-pulse" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 bg-white/10 rounded-full blur-sm animate-pulse delay-1000" />

                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                  </motion.div>

                  <h3 className="text-xl font-bold text-white mb-2 font-rosarivo">
                    CAS Registration Form
                  </h3>
                  <p className="text-white/90 text-sm max-w-sm mx-auto leading-relaxed">
                    Complete the registration form below. All fields are secure
                    and confidential.
                  </p>

                  {/* Progress indicators */}
                  <div className="flex justify-center gap-1.5 mt-4">
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                    <div className="w-6 h-1.5 bg-white/60 rounded-full" />
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                  </div>
                </div>

                {/* Registration Form */}
                <div className="relative bg-white dark:bg-gray-800">
                  {/* Form frame decoration */}
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent dark:from-gray-700/50 pointer-events-none" />

                  <div className="p-8">
                    {/* Form content will be added here */}
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