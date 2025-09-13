import { motion } from "framer-motion";
import { 
  ArrowRight, 
  CheckCircle, 
  ExternalLink, 
  Users, 
  Heart,
  Mail,
  Calendar,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from '@/contexts/LanguageContext';
import healthcareProfessionalImg from "@assets/DSC02826_1750068895453.jpg";
import summitSaveTheDateImg from "@assets/2025 Amyloidosis Summit Save the Date_page-0001_1753250815238.jpg";

export default function GetInvolved() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#00AFE6]/5 via-white to-[#00DD89]/5 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00DD89]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#00AFE6]/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-rosarivo mb-8 leading-tight">
              Join Our Mission
              <br />
              <span className="bg-gradient-to-r from-[#00DD89] to-[#00AFE6] bg-clip-text text-transparent">
                To Improve Awareness, Diagnosis, and Care
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-white/80 mb-8 leading-relaxed max-w-3xl mx-auto">
              The Canadian Amyloidosis Society is powered by people who care. Whether you're a clinician, 
              researcher, patient, caregiver, or ally—you have a role to play in accelerating change.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Ways to Participate Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-rosarivo mb-6">
              Ways to Participate
            </h2>
            <p className="text-lg text-gray-600 dark:text-white/70 max-w-3xl mx-auto">
              Choose how you'd like to contribute to our mission of improving amyloidosis care across Canada.
            </p>
          </motion.div>

          {/* Join CAS Section */}
          <motion.div
            className="max-w-4xl mx-auto mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 border-2 border-[#00AFE6]/20 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900 shadow-xl">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-3xl font-bold font-rosarivo mb-4">
                  Join CAS
                </CardTitle>
                <p className="text-gray-600 dark:text-white/70 text-lg">
                  CAS membership is exclusively for healthcare professionals including clinicians, researchers, 
                  and health system leaders. Patients and family members are valued community participants 
                  and can contribute through other ways listed here.
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-8">
                  <Button 
                    className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/90 hover:to-[#00DD89]/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 text-lg"
                  >
                    Register Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>

                {/* Member Benefits */}
                <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 mb-6">
                  <h3 className="text-2xl font-bold font-rosarivo mb-6 text-center">
                    Member Benefits
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Periodic updates on amyloidosis research and initiatives",
                      "Invitations to contribute resources and expertise",
                      "Recognition as contributor on shared resources",
                      "Early access to events and educational content"
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-[#00DD89] mt-1 flex-shrink-0" />
                        <p className="text-gray-600 dark:text-white/70">{benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Participation Notes */}
                <div className="bg-[#00AFE6]/5 dark:bg-gray-700/50 rounded-xl p-6">
                  <h4 className="font-bold text-lg mb-4">Participation Notes</h4>
                  <div className="space-y-3 text-sm text-gray-600 dark:text-white/70">
                    <p>Membership in CAS is voluntary and non-financial. There are no membership fees or obligations.</p>
                    <p>CAS is governed by an Executive Committee – a dedicated group of Canadian amyloidosis experts collaborating in a leadership role to advance the mission of CAS and serve its members.</p>
                    <p>Your privacy is protected - we only use your information for CAS communications and activities, and you can unsubscribe at any time.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Canadian Amyloidosis Nursing Network Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Badge className="bg-[#00DD89]/10 text-[#00DD89] border-[#00DD89]/20 mb-6">
                  Professional Network
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold font-rosarivo mb-6">
                  Canadian Amyloidosis
                  <br />
                  <span className="text-[#00AFE6]">Nursing Network</span>
                </h2>
                <p className="text-gray-600 dark:text-white/70 mb-6 leading-relaxed">
                  The field of amyloidosis has experienced tremendous growth in recent years. 
                  Within this multidisciplinary community, nurses play a vital role in enhancing 
                  the quality, accessibility, and coordination of healthcare services for amyloidosis patients.
                </p>
                <p className="text-sm text-gray-500 dark:text-white/60 mb-6 italic">
                  CANN is an affiliate of the Canadian Amyloidosis Society (CAS)
                </p>

                <div className="space-y-3 mb-8">
                  {[
                    "Unite amyloidosis nurses across the country through professional development",
                    "Knowledge translation and best practice sharing",
                    "Facilitate collaboration while supporting patients with amyloidosis"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#00DD89] mt-1 flex-shrink-0" />
                      <p className="text-gray-600 dark:text-white/70">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 text-[#00AFE6]">Join the Movement</h3>
                  <p className="text-gray-600 dark:text-white/70 mb-4">
                    We invite you to join this exciting movement!
                  </p>
                  <Button 
                    variant="outline"
                    className="border-2 border-[#00AFE6] text-[#00AFE6] hover:bg-[#00AFE6] hover:text-white"
                  >
                    Learn About CANN
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src={healthcareProfessionalImg}
                    alt="Healthcare professional working in amyloidosis care"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl border">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-[#00DD89] rounded-full animate-pulse"></div>
                    <div>
                      <p className="font-semibold text-sm">Dedicated Nursing Network</p>
                      <p className="text-xs text-gray-500 dark:text-white/60">Connecting nurses across Canada</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Event - 2025 Canadian Amyloidosis Summit */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-[#00AFE6]/10 text-[#00AFE6] border-[#00AFE6]/20 mb-6">
              Featured Event
            </Badge>
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <CheckCircle className="w-4 h-4" />
              Registration is open
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-rosarivo mb-6">
              2025 Canadian Amyloidosis Summit
            </h2>
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900">
              <div className="relative">
                <img
                  src={summitSaveTheDateImg}
                  alt="Save the Date - 2025 Canadian Amyloidosis Summit"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Registration is open
                </div>
              </div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold font-rosarivo mb-6">Event Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#00AFE6]" />
                    <div>
                      <p className="font-semibold">Dates</p>
                      <p className="text-gray-600 dark:text-white/70">October 31 - November 2, 2025</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-[#00AFE6]" />
                    <div>
                      <p className="font-semibold">Location</p>
                      <p className="text-gray-600 dark:text-white/70">Toronto, ON</p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-white/70 mb-8 leading-relaxed">
                  Join us for the 2025 Canadian Amyloidosis Summit, hosted by CAS and Transthyretin Amyloidosis Canada (TAC). 
                  Registration is open through the TAC website.
                </p>

                <div className="text-center">
                  <Button 
                    className="bg-gradient-to-r from-[#00DD89] to-[#00AFE6] hover:from-[#00DD89]/90 hover:to-[#00AFE6]/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 text-lg"
                  >
                    Register Now
                    <ExternalLink className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-[#00AFE6]/5 via-white to-[#00DD89]/5 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold font-rosarivo mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600 dark:text-white/70 mb-8">
              Join our community of healthcare professionals, researchers, and advocates working together 
              to advance amyloidosis awareness and care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/90 hover:to-[#00DD89]/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 text-lg"
              >
                Join CAS
                <Users className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline"
                className="border-2 border-[#00AFE6] text-[#00AFE6] hover:bg-[#00AFE6] hover:text-white px-8 py-3 text-lg"
              >
                View Events
                <Calendar className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}