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
import { useEffect, useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";

// MST Timezone constant (America/Edmonton handles MST/MDT automatically)
const MST_TIMEZONE = 'America/Edmonton';

// Helper to get current date in MST timezone
const getMSTDate = (): Date => {
  const now = new Date();
  const mstDateStr = now.toLocaleDateString('en-CA', { timeZone: MST_TIMEZONE });
  const [year, month, day] = mstDateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

// Check if session date has passed (using MST timezone)
const isSessionPast = (rawDate: string): boolean => {
  const [year, month, day] = rawDate.split("-").map(Number);
  const sessionDate = new Date(year, month - 1, day);
  const todayMST = getMSTDate();
  return sessionDate < todayMST;
};

interface Session {
  rawDate: string;
  dateKey: string;
  topics?: { topicKey: string; presenterName: string }[];
  topic?: string;
  presenter?: string;
  location: string;
  registrationNotRequired: boolean;
  comingSoon?: boolean;
}

const allSessions: Session[] = [
  {
    rawDate: "2025-09-25",
    dateKey: "journalClub.dates.sept2025",
    topics: [
      { topicKey: "journalClub.topics.attrNeuropathy", presenterName: "Dr. Genevieve Matte, University of Montreal" },
      { topicKey: "journalClub.topics.cardiacAmyloidosis", presenterName: "Dr. Edgar Da Silva, Cardiology Fellow, University of Ottawa" },
    ],
    location: "Virtual",
    registrationNotRequired: true,
  },
  {
    rawDate: "2025-11-27",
    dateKey: "journalClub.dates.nov2025",
    topics: [
      { topicKey: "journalClub.topics.alAmyloidosis", presenterName: "Dr. Janine Mazengarb, University of British Columbia" },
      { topicKey: "journalClub.topics.diagnosticDilemmas", presenterName: "Dr. Rajin Choudhury, University of Calgary" },
    ],
    location: "Virtual",
    registrationNotRequired: true,
  },
  {
    rawDate: "2026-02-26",
    dateKey: "journalClub.dates.feb2026",
    topics: [
      { topicKey: "journalClub.topics.hATTR", presenterName: "Dr. Gord Jewett, University of Calgary" },
      { topicKey: "journalClub.topics.tbd", presenterName: "TBD, Queen's University" },
    ],
    location: "Virtual",
    registrationNotRequired: true,
  },
];

export default function JournalClub() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const categorizeSessions = () => {
    const upcoming = allSessions.filter(session => !isSessionPast(session.rawDate));
    const past = allSessions.filter(session => isSessionPast(session.rawDate));
    
    past.sort((a, b) => {
      const dateA = new Date(a.rawDate);
      const dateB = new Date(b.rawDate);
      return dateB.getTime() - dateA.getTime();
    });
    
    upcoming.sort((a, b) => {
      const dateA = new Date(a.rawDate);
      const dateB = new Date(b.rawDate);
      return dateA.getTime() - dateB.getTime();
    });
    
    return { upcoming, past };
  };

  const { upcoming: upcomingSessions, past: pastSessions } = categorizeSessions();

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
            {t('journalClub.backToHome')}
          </Link>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-8 h-8" />
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-rosarivo">
                {t('journalClub.title')}
              </h1>
            </div>
            <p className="text-xl text-white/90 max-w-3xl">
              {t('journalClub.subtitle')}
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
                {t('journalClub.about.title')}
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  {t('journalClub.about.description1')}
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t('journalClub.about.description2')}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 h-fit">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {t('journalClub.sessionDetails.title')}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Calendar className="w-5 h-5 text-[#00AFE6]" />
                  <span>{t('journalClub.sessionDetails.frequency')}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Clock className="w-5 h-5 text-[#00AFE6]" />
                  <span>{t('journalClub.sessionDetails.time')}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <MapPin className="w-5 h-5 text-[#00AFE6]" />
                  <span>{t('journalClub.sessionDetails.location')}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Users className="w-5 h-5 text-[#00AFE6]" />
                  <span>{t('journalClub.sessionDetails.access')}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sessions with Tabs */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            {/* Tab Buttons */}
            <div className="flex justify-center mb-8 overflow-x-auto pb-2">
              <div className="bg-gradient-to-r from-gray-100/80 to-blue-100/60 dark:bg-white/5 backdrop-blur-xl border border-[#00AFE6]/20 dark:border-white/20 rounded-2xl p-1 sm:p-2 shadow-2xl inline-flex min-w-max">
                <button
                  onClick={() => setActiveTab("upcoming")}
                  className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base whitespace-nowrap ${
                    activeTab === "upcoming"
                      ? "bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white shadow-lg"
                      : "text-gray-600 dark:text-white/80 hover:text-gray-800 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/10"
                  }`}
                  data-testid="tab-upcoming-sessions"
                >
                  {t('journalClub.upcomingSessions')}
                </button>
                <button
                  onClick={() => setActiveTab("past")}
                  className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base whitespace-nowrap ${
                    activeTab === "past"
                      ? "bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white shadow-lg"
                      : "text-gray-600 dark:text-white/80 hover:text-gray-800 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/10"
                  }`}
                  data-testid="tab-past-sessions"
                >
                  {t('journalClub.pastSessions')}
                </button>
              </div>
            </div>

            {/* Upcoming Sessions Tab */}
            <TabsContent value="upcoming" className="mt-0">
              {upcomingSessions.length > 0 ? (
                <div className="grid gap-6">
                  {upcomingSessions.map((session, index) => (
                    <motion.div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-4 py-2 rounded-full text-sm font-bold">
                              {t(session.dateKey)}
                            </div>
                            {session.comingSoon && (
                              <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                                {t('journalClub.session.comingSoon')}
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">{t('journalClub.session.time')}</span>
                            </div>
                          </div>

                          {/* Topics and Presenters grouped together */}
                          <div className="mb-3 space-y-3">
                            {session.topics ? (
                              session.topics.map((topicItem, topicIndex) => (
                                <div key={topicIndex}>
                                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {t(topicItem.topicKey)}
                                  </h3>
                                  <div className="text-gray-700 dark:text-gray-300">
                                    <span className="text-lg font-semibold">
                                      {t('journalClub.session.presenter')}: {topicItem.presenterName}
                                    </span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                  {session.topic ? t(session.topic) : ''}
                                </h3>
                                <div className="text-gray-700 dark:text-gray-300">
                                  <span className="text-lg font-semibold">
                                    {t('journalClub.session.presenter')}: {session.presenter ? t(session.presenter) : ''}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex-shrink-0">
                          <div className="space-y-3">
                            {/* Location */}
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                              <MapPin className="w-4 h-4 text-[#00AFE6]" />
                              <span className="text-sm">{t('journalClub.session.virtual')}</span>
                            </div>

                            {/* Zoom Details */}
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                              <Calendar className="w-4 h-4 text-[#00DD89]" />
                              <span className="text-sm italic text-[#00DD89]">
                                {t('journalClub.session.zoomAccess')}
                              </span>
                            </div>

                            {/* Registration Badge */}
                            <div className="pt-2">
                              {session.registrationNotRequired ? (
                                <div
                                  className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] px-3 py-2 rounded-full text-xs font-bold inline-block"
                                  style={{ color: "#2a2a2a" }}
                                >
                                  {t('journalClub.session.noRegistration')}
                                </div>
                              ) : (
                                <div className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-3 py-2 rounded-full text-xs font-bold inline-block">
                                  {t('journalClub.session.noRegistration')}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#00AFE6]/20 to-[#00DD89]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-10 h-10 text-[#00AFE6]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {t('journalClub.noUpcoming.title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('journalClub.noUpcoming.description')}
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Past Sessions Tab */}
            <TabsContent value="past" className="mt-0">
              {pastSessions.length > 0 ? (
                <div className="grid gap-6">
                  {pastSessions.map((session, index) => (
                    <motion.div
                      key={index}
                      className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 opacity-90"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="bg-gray-400 text-white px-4 py-2 rounded-full text-sm font-bold">
                              {t(session.dateKey)}
                            </div>
                            <div className="bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-bold">
                              {t('journalClub.session.pastEvent')}
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-500">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">{t('journalClub.session.time')}</span>
                            </div>
                          </div>

                          {/* Topics and Presenters grouped together */}
                          <div className="mb-3 space-y-3">
                            {session.topics ? (
                              session.topics.map((topicItem, topicIndex) => (
                                <div key={topicIndex}>
                                  <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    {t(topicItem.topicKey)}
                                  </h3>
                                  <div className="text-gray-600 dark:text-gray-400">
                                    <span className="text-lg font-semibold">
                                      {t('journalClub.session.presenter')}: {topicItem.presenterName}
                                    </span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div>
                                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                                  {session.topic ? t(session.topic) : ''}
                                </h3>
                                <div className="text-gray-600 dark:text-gray-400">
                                  <span className="text-lg font-semibold">
                                    {t('journalClub.session.presenter')}: {session.presenter ? t(session.presenter) : ''}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex-shrink-0">
                          <div className="space-y-3">
                            {/* Location */}
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm">{t('journalClub.session.virtual')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {t('eventsPage.noPastEvents')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('eventsPage.checkBackSoon')}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="mt-16 text-center bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 rounded-2xl p-12"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 font-rosarivo">
            {t('journalClub.cta.title')}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            {t('journalClub.cta.description')}
          </p>
          <Link href="/join-cas">
            <motion.button
              className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {t('journalClub.cta.button')}
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
