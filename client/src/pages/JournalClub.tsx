import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  ArrowLeft,
  MapPin,
} from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "../contexts/LanguageContext";
import { useEffect } from "react";

export default function JournalClub() {
  const { t } = useLanguage();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const upcomingClubs = [
    {
      date: "September 25, 2025",
      time: "3-4 PM MST",
      topic: "An Interesting Case of ATTR-neuropathy",
      presenter: "Dr. Genevieve Matte, University of Montreal",
      location: "Virtual",
      registrationNotRequired: true,
    },
    {
      date: "November 27, 2025",
      time: "12:00 PM EST",
      topic: "Cardiac Amyloidosis",
      presenter: "Dr. Edgar Da Silva, Cardiology Fellow, University of Ottawa",
      location: "Virtual",
      registrationNotRequired: true,
      comingSoon: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <motion.div
        className="relative bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-7xl mx-auto px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-8 h-8" />
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-rosarivo">
                CAS Journal Club
              </h1>
            </div>
            <p className="text-xl text-white/90 max-w-3xl">
              Join our regular Journal Club sessions where healthcare
              professionals discuss the latest research, clinical guidelines,
              and best practices in amyloidosis care.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Overview */}
        <motion.div
          className="mb-16"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 font-rosarivo">
                About Our Journal Club
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  The CAS Journal Club brings together clinicians, researchers,
                  and healthcare professionals from across Canada to discuss
                  cutting-edge research and share clinical insights in
                  amyloidosis care.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Each session features expert presentations, interactive
                  discussions, and opportunities to connect with colleagues
                  working in amyloidosis care. Sessions are available both
                  in-person and virtually.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 h-fit">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Session Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Calendar className="w-5 h-5 text-[#00AFE6]" />
                  <span>Occurs 4-5 times per year</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Clock className="w-5 h-5 text-[#00AFE6]" />
                  <span>Thursday afternoons 3-4 PM MST</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <MapPin className="w-5 h-5 text-[#00AFE6]" />
                  <span>Virtual sessions</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Users className="w-5 h-5 text-[#00AFE6]" />
                  <span>CAS Members only</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Upcoming Sessions */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 font-rosarivo">
            Upcoming Sessions
          </h2>

          <div className="grid gap-6">
            {upcomingClubs.map((club, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-4 py-2 rounded-full text-sm font-bold">
                        {club.date}
                      </div>
                      {club.comingSoon && (
                        <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                          Coming Soon
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{club.time}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {club.topic}
                    </h3>

                    <div className="space-y-2 text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#00AFE6]" />
                        <span className="text-sm">
                          Presenter: {club.presenter}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#00AFE6]" />
                        <span className="text-sm">{club.location}</span>
                      </div>
                      {club.comingSoon && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#00DD89]" />
                          <span className="text-sm italic text-[#00DD89]">
                            Zoom access details sent to CAS members
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {club.registrationNotRequired ? (
                      <motion.button
                        className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                      >
                        Registration Not Required
                      </motion.button>
                    ) : (
                      <div className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-6 py-3 rounded-xl font-bold">
                        Registration Not Required
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="mt-16 text-center bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 rounded-2xl p-12"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 font-rosarivo">
            Not a CAS Member Yet?
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Join the Canadian Amyloidosis Society to access our Journal Club
            sessions, research updates, and connect with the amyloidosis care
            community.
          </p>
          <Link href="/join-cas">
            <motion.button
              className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Become a CAS Member
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
