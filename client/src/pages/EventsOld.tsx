import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  ArrowRight,
  MapPin,
  Clock,
  Users,
  Award,
  Star,
} from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ParallaxBackground from "../components/ParallaxBackground";
import healthcareProfessionalImg from "@assets/DSC02826_1750068895453.jpg";
import summitSaveTheDateImg from "@assets/2025 Amyloidosis Summit Save the Date_page-0001_1753250815238.jpg";

// Journal Club Sessions Data (from Events.tsx)
const journalClubSessions = [
  {
    rawDate: "2025-05-08",
    type: "Journal Club",
    title: "CAS Journal Club May 2025",
    time: "5:00 PM - 6:00 PM EST",
    location: "Virtual Event",
    description: "The inaugural CAS Journal Club session featuring case presentations on proper typing for treatment and heart failure therapy in ATTR amyloidosis.",
    topics: [
      {
        title: "Proper Typing for Proper Treatment",
        presenter: "Dr. Victor Jimenez-Zepeda, University of Calgary",
      },
      {
        title: "Heart Failure Therapy in ATTR Amyloidosis: Is it time to go against the grain?",
        presenter: "Dr. Francois Tournoux, University of Montreal",
      },
    ],
  },
  {
    rawDate: "2025-09-25",
    type: "Journal Club",
    title: "CAS Journal Club September 2025",
    time: "5:00 PM - 6:00 PM EST",
    location: "Virtual Event",
    description: "One-hour virtual session focusing on amyloidosis clinical case-based presentations and scientific updates.",
    topics: [
      {
        title: "ATTR Neuropathy",
        presenter: "Dr. Genevieve Matte, University of Montreal",
      },
      {
        title: "Cardiac Amyloidosis",
        presenter: "Dr. Edgar Da Silva, University of Ottawa",
      },
    ],
  },
  {
    rawDate: "2025-11-27",
    type: "Journal Club",
    title: "CAS Journal Club November 2025",
    time: "5:00 PM - 6:00 PM EST",
    location: "Virtual Event",
    description: "Continuing the national journal club initiative for CAS members. One-hour virtual session focusing on amyloidosis clinical case-based presentation and scientific updates.",
    topics: [
      {
        title: "AL Amyloidosis",
        presenter: "Dr. Janine Mazengarb, University of British Columbia",
      },
      {
        title: "Diagnostic Dilemmas",
        presenter: "Dr. Rajin Choudhury, University of Calgary",
      },
    ],
  },
  {
    rawDate: "2026-02-26",
    type: "Journal Club",
    title: "CAS Journal Club February 2026",
    time: "5:00 PM - 6:00 PM EST",
    location: "Virtual Event",
    description: "One-hour virtual session focusing on amyloidosis clinical case-based presentations and scientific updates.",
    topics: [
      {
        title: "Is it really hATTR?",
        presenter: "Dr. Gord Jewett, University of Calgary",
      },
      { title: "Topic To Be Announced", presenter: "TBD, Queen's University" },
    ],
  },
];

// Summit Events Data (from Events.tsx)
const summitEvents = [
  {
    id: 1,
    title: "Canadian Amyloidosis Summit 2026",
    date: "2026-10-15",
    displayDate: "Fall 2026 – date TBD",
    time: "TBD",
    location: "TBD",
    type: "Summit",
    description:
      "This annual educational conference is jointly hosted by the CAS and Transthyretin Amyloidosis Canada (TAC). The Summit unites both amyloidosis healthcare professionals and patients with accredited scientific sessions for professionals and dedicated sessions for patients/caregivers.",
    image: summitSaveTheDateImg,
  },
  {
    id: 5,
    title: "2025 Canadian Amyloidosis Summit",
    date: "2025-10-31",
    displayDate: "October 31 – November 2, 2025",
    time: "8:00 AM - 5:00 PM EST",
    location: "Toronto, ON",
    type: "Summit",
    description:
      "The 2025 Canadian Amyloidosis Summit, hosted by CAS and Transthyretin Amyloidosis Canada (TAC). A comprehensive gathering of healthcare professionals, researchers, and patients focused on advancing amyloidosis care in Canada.",
    image: summitSaveTheDateImg,
  },
];

const EST_TIMEZONE = "America/Toronto";

// Helper to parse date string
const parseLocalDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

// Helper function to check if event is past
const isEventPast = (dateString: string): boolean => {
  const [year, month, day] = dateString.split("-").map(Number);
  const eventDate = new Date(year, month - 1, day);
  const now = new Date();
  const estDateStr = now.toLocaleDateString("en-CA", { timeZone: EST_TIMEZONE });
  const [todayYear, todayMonth, todayDay] = estDateStr.split("-").map(Number);
  const todayEST = new Date(todayYear, todayMonth - 1, todayDay);
  return eventDate < todayEST;
};

export default function EventsOld() {
  const { t } = useLanguage();
  const [eventsTab, setEventsTab] = useState("upcoming");

  // Helper function to add ordinal suffix to day
  const getOrdinalSuffix = (day: number): string => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  // Format date to "Thursday, September 25th, 2025" in EST timezone
  const formatEventDate = (dateString: string): string => {
    if (!dateString) return "TBD";
    const parts = dateString.split("-").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) {
      return dateString;
    }
    const [year, month, day] = parts;
    const dateForFormatting = new Date(year, month - 1, day, 12, 0, 0);

    const dayName = dateForFormatting.toLocaleDateString("en-US", {
      weekday: "long",
      timeZone: EST_TIMEZONE,
    });
    const monthName = dateForFormatting.toLocaleDateString("en-US", {
      month: "long",
      timeZone: EST_TIMEZONE,
    });
    const dayNumber = parseInt(
      dateForFormatting.toLocaleDateString("en-US", {
        day: "numeric",
        timeZone: EST_TIMEZONE,
      }),
    );
    const yearNumber = parseInt(
      dateForFormatting.toLocaleDateString("en-US", {
        year: "numeric",
        timeZone: EST_TIMEZONE,
      }),
    );

    return `${dayName}, ${monthName} ${dayNumber}${getOrdinalSuffix(dayNumber)}, ${yearNumber}`;
  };

  // Combine all CAS events (Journal Club + Summit) for the events section
  const allCASEvents = [
    ...journalClubSessions.map((session) => ({
      id: `jc-${session.rawDate}`,
      title: session.title,
      date: session.rawDate,
      displayDate: formatEventDate(session.rawDate),
      time: session.time,
      location: session.location,
      type: session.type,
      description: session.description,
      topics: session.topics,
    })),
    ...summitEvents.map((event) => ({
      id: `summit-${event.id}`,
      title: event.title,
      date: event.date,
      displayDate: event.displayDate,
      time: event.time,
      location: event.location,
      type: event.type,
      description: event.description,
      topics: undefined,
    })),
  ];

  // Categorize events
  const upcomingEvents = allCASEvents
    .filter((event) => !isEventPast(event.date))
    .sort((a, b) => parseLocalDate(a.date).getTime() - parseLocalDate(b.date).getTime());

  const pastEvents = allCASEvents
    .filter((event) => isEventPast(event.date))
    .sort((a, b) => parseLocalDate(b.date).getTime() - parseLocalDate(a.date).getTime());

  // Get the featured (upcoming) summit for the Featured section
  const featuredSummit = summitEvents.find((e) => !isEventPast(e.date));

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
            <Calendar className="w-4 h-4 text-[#00AFE6]" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Educational Events
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 font-rosarivo"
          >
            <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
              Events &
            </span>
            <br />
            <span className="text-gray-800 dark:text-white">Education</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Join our community for educational conferences, expert webinars,
            support groups, and professional development opportunities across
            Canada.
          </motion.p>
        </div>
      </section>

      {/* Featured: Canadian Amyloidosis Summit Section */}
      <section id="summit" className="py-24 bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-transparent to-cyan-100/20 dark:from-gray-800/50 dark:via-transparent dark:to-gray-700/30"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00AFE6]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00DD89]/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Featured Badge */}
            <motion.div
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm border border-amber-500/30 rounded-full px-6 py-2 mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                Featured Event
              </span>
            </motion.div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-rosarivo mb-8 leading-tight">
              <span className="text-gray-800 dark:text-white">Canadian </span>
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Amyloidosis Summit
              </span>
            </h2>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-white/70 max-w-4xl mx-auto leading-relaxed px-4">
              {t("events.summit.description")}
            </p>
          </motion.div>

          {/* Upcoming Summit Info (no tabs) */}
          {featuredSummit && (
            <div className="max-w-7xl mx-auto">
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-xl rounded-3xl p-10 border border-gray-200/50 dark:border-white/20 shadow-2xl max-w-2xl w-full">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 font-rosarivo">
                      {t("eventsPage.eventDetails")}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                      <div className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-[#00AFE6]/10 to-[#00DD89]/10 rounded-2xl border border-[#00AFE6]/20">
                        <Calendar className="w-8 h-8 text-[#00AFE6]" />
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-500 dark:text-white/60 mb-1">
                            {t("eventsPage.dates")}
                          </p>
                          <p className="text-gray-800 dark:text-white font-semibold">
                            {t("events.summit.date")}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-[#00DD89]/10 to-[#00AFE6]/10 rounded-2xl border border-[#00DD89]/20">
                        <MapPin className="w-8 h-8 text-[#00DD89]" />
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-500 dark:text-white/60 mb-1">
                            {t("eventsPage.format")}
                          </p>
                          <p className="text-gray-800 dark:text-white font-semibold">
                            {t("events.summit.type")}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-white/70 mb-10 leading-relaxed text-lg">
                      {t("eventsPage.summitHostedBy")}
                    </p>

                    <div className="space-y-4">
                      <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                        {t("eventsPage.registrationComingSoon")}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* CAS Events Section (Journal Club + Summit with tabs) */}
      <section id="events" className="py-24 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00AFE6]/5 via-transparent to-[#00DD89]/5"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00AFE6]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#00DD89]/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 backdrop-blur-xl border border-[#00AFE6]/20 rounded-full px-6 py-3 mb-8 shadow-lg">
              <Calendar className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-gray-800 dark:text-white/90 font-medium">
                CAS Events
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-rosarivo mb-6 leading-tight">
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                CAS Events
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-white/70 max-w-3xl mx-auto leading-relaxed px-4">
              Join us at upcoming CAS events including Journal Club sessions and Summit gatherings.
            </p>
          </motion.div>

          {/* Events Tabs */}
          <div className="flex justify-center mb-8 overflow-x-auto pb-2">
            <div className="bg-gradient-to-r from-gray-100/80 to-blue-100/60 dark:bg-white/5 backdrop-blur-xl border border-[#00AFE6]/20 dark:border-white/20 rounded-2xl p-1 sm:p-2 shadow-2xl inline-flex min-w-max">
              <button
                onClick={() => setEventsTab("upcoming")}
                className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base whitespace-nowrap ${
                  eventsTab === "upcoming"
                    ? "bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white shadow-lg"
                    : "text-gray-600 dark:text-white/80 hover:text-gray-800 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/10"
                }`}
              >
                {t("eventsPage.upcomingEvents")}
              </button>
              <button
                onClick={() => setEventsTab("past")}
                className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base whitespace-nowrap ${
                  eventsTab === "past"
                    ? "bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white shadow-lg"
                    : "text-gray-600 dark:text-white/80 hover:text-gray-800 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/10"
                }`}
              >
                {t("eventsPage.pastEvents")}
              </button>
            </div>
          </div>

          {/* Events Grid - 2 column max layout */}
          <div className="max-w-4xl mx-auto">
            {((eventsTab === "upcoming" ? upcomingEvents : pastEvents).length > 0) ? (
              <div
                className={`grid gap-6 ${
                  (eventsTab === "upcoming" ? upcomingEvents : pastEvents).length === 1
                    ? "grid-cols-1 max-w-lg mx-auto"
                    : "grid-cols-1 md:grid-cols-2"
                }`}
              >
                {(eventsTab === "upcoming" ? upcomingEvents : pastEvents).map((event, index) => {
                  const isPast = eventsTab === "past";
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="h-full"
                    >
                      <Card
                        className={`h-full flex flex-col rounded-3xl overflow-hidden transition-all duration-500 ${
                          isPast
                            ? "bg-gradient-to-br from-gray-100/95 to-gray-50/95 dark:from-gray-800/50 dark:to-gray-900/50 border-gray-200/50 dark:border-gray-700/50 opacity-70"
                            : "bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-xl border border-gray-200/60 dark:border-white/20 hover:border-[#00AFE6]/50 dark:hover:border-[#00AFE6]/60 hover:shadow-2xl hover:shadow-[#00AFE6]/15"
                        }`}
                      >
                        {/* Header Section */}
                        <div
                          className={`relative p-6 ${isPast ? "bg-gray-100/50 dark:bg-gray-700/30" : "bg-gradient-to-br from-[#00AFE6]/10 via-[#00DD89]/5 to-transparent"}`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div
                              className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isPast ? "bg-gray-200/50 dark:bg-gray-600/30" : "bg-gradient-to-br from-[#00AFE6]/20 to-[#00DD89]/20"}`}
                            >
                              {event.type === "Summit" ? (
                                <Award className={`w-8 h-8 ${isPast ? "text-gray-400" : "text-[#00AFE6]"}`} />
                              ) : (
                                <Calendar className={`w-8 h-8 ${isPast ? "text-gray-400" : "text-[#00AFE6]"}`} />
                              )}
                            </div>
                            <Badge
                              className={`${isPast ? "bg-gray-400" : "bg-gradient-to-r from-[#00AFE6] to-[#00DD89]"} text-white border-0 px-2 py-1 text-xs font-medium rounded`}
                            >
                              {event.type}
                            </Badge>
                          </div>
                          <h3
                            className={`text-xl font-semibold leading-snug ${isPast ? "text-gray-500 dark:text-gray-400" : "text-gray-800 dark:text-white"}`}
                          >
                            {event.title}
                          </h3>
                        </div>

                        {/* Content Section */}
                        <CardContent className="p-6 pt-4 flex flex-col flex-1">
                          {/* Event Details */}
                          <div className="space-y-2 mb-4">
                            <div
                              className={`flex items-center gap-2 text-sm ${isPast ? "text-gray-400" : "text-gray-600 dark:text-white/70"}`}
                            >
                              <Calendar
                                className={`w-4 h-4 ${isPast ? "text-gray-400" : "text-[#00AFE6]"}`}
                              />
                              <span>{event.displayDate}</span>
                            </div>
                            <div
                              className={`flex items-center gap-2 text-sm ${isPast ? "text-gray-400" : "text-gray-600 dark:text-white/70"}`}
                            >
                              <Clock
                                className={`w-4 h-4 ${isPast ? "text-gray-400" : "text-[#00AFE6]"}`}
                              />
                              <span>{event.time}</span>
                            </div>
                            <div
                              className={`flex items-center gap-2 text-sm ${isPast ? "text-gray-400" : "text-gray-600 dark:text-white/70"}`}
                            >
                              <MapPin
                                className={`w-4 h-4 ${isPast ? "text-gray-400" : "text-[#00AFE6]"}`}
                              />
                              <span>{event.location}</span>
                            </div>
                          </div>

                          {/* Topics Section */}
                          {event.topics && (
                            <div
                              className={`mb-4 p-3 rounded-xl border space-y-3 ${
                                isPast
                                  ? "bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600"
                                  : "bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 border-[#00AFE6]/20"
                              }`}
                            >
                              <div
                                className={`text-xs font-medium ${isPast ? "text-gray-400" : "text-[#00AFE6]"}`}
                              >
                                {t("eventsPage.sessionTopics")}
                              </div>
                              {event.topics.map((topic, idx) => (
                                <div
                                  key={idx}
                                  className={`border-l-2 pl-3 ${isPast ? "border-gray-300" : "border-[#00AFE6]/40"}`}
                                >
                                  <div
                                    className={`text-sm font-medium italic ${isPast ? "text-gray-500 dark:text-gray-400" : "text-gray-800 dark:text-white"}`}
                                  >
                                    "{topic.title}"
                                  </div>
                                  <div
                                    className={`text-xs mt-1 ${isPast ? "text-gray-400" : "text-gray-600 dark:text-white/70"}`}
                                  >
                                    {t("eventsPage.presenter")}: {topic.presenter}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Description */}
                          <p
                            className={`text-sm leading-relaxed flex-1 mb-4 ${isPast ? "text-gray-400" : "text-gray-600 dark:text-white/70"}`}
                          >
                            {event.description}
                          </p>

                          {/* CTA Section */}
                          {isPast ? (
                            <div className="text-center p-3 bg-gray-100 dark:bg-gray-700/50 rounded-xl mt-auto">
                              <p className="text-sm text-gray-500 dark:text-white/60">
                                This event has ended
                              </p>
                            </div>
                          ) : event.type === "Summit" ? (
                            <div className="space-y-2 mt-auto">
                              <div className="text-center p-3 bg-gradient-to-r from-[#00AFE6]/15 to-[#00DD89]/15 rounded-xl border border-[#00AFE6]/40 shadow-md shadow-[#00AFE6]/10 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#00AFE6]/5 to-[#00DD89]/5 opacity-50 animate-pulse"></div>
                                <div className="relative z-10">
                                  <p className="text-sm font-semibold text-[#00AFE6] dark:text-[#00AFE6]">
                                    Registration coming soon
                                  </p>
                                </div>
                              </div>
                              <Button
                                onClick={() => (window.location.href = "/join-cas")}
                                className="w-full bg-[#00DD89] hover:bg-[#00DD89]/90 text-gray-800 border border-[#00DD89] hover:border-[#00DD89]/90 shadow-lg hover:shadow-xl hover:shadow-[#00DD89]/25 transition-all duration-300 group/btn py-2 px-6 rounded-lg font-semibold text-sm relative overflow-hidden"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#00DD89]/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative z-10 flex items-center justify-center text-gray-800">
                                  <Users className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-300 text-gray-800" />
                                  Join CAS
                                  <div className="ml-2 w-1.5 h-1.5 bg-gray-800 rounded-full animate-pulse"></div>
                                </div>
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-2 mt-auto">
                              <div className="text-center p-3 bg-gradient-to-r from-[#00AFE6]/15 to-[#00DD89]/15 rounded-xl border border-[#00AFE6]/40 shadow-md shadow-[#00AFE6]/10 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#00AFE6]/5 to-[#00DD89]/5 opacity-50 animate-pulse"></div>
                                <div className="relative z-10">
                                  <div className="flex items-center justify-center gap-1 mb-1">
                                    <div className="w-1.5 h-1.5 bg-[#00AFE6] rounded-full animate-pulse"></div>
                                    <p className="text-sm font-semibold text-[#00AFE6] dark:text-[#00AFE6]">
                                      {t("eventsPage.registrationNotRequired")}
                                    </p>
                                    <div className="w-1.5 h-1.5 bg-[#00AFE6] rounded-full animate-pulse"></div>
                                  </div>
                                  <p className="text-xs font-medium text-gray-700 dark:text-white/80">
                                    {t("eventsPage.zoomDetailsCAS")}
                                  </p>
                                </div>
                              </div>
                              <Button
                                onClick={() => (window.location.href = "/join-cas")}
                                className="w-full bg-[#00DD89] hover:bg-[#00DD89]/90 text-gray-800 border border-[#00DD89] hover:border-[#00DD89]/90 shadow-lg hover:shadow-xl hover:shadow-[#00DD89]/25 transition-all duration-300 group/btn py-2 px-6 rounded-lg font-semibold text-sm relative overflow-hidden"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#00DD89]/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative z-10 flex items-center justify-center text-gray-800">
                                  <Users className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-300 text-gray-800" />
                                  Join CAS
                                  <div className="ml-2 w-1.5 h-1.5 bg-gray-800 rounded-full animate-pulse"></div>
                                </div>
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  {eventsTab === "upcoming" ? "No Upcoming Events" : "No Past Events"}
                </h3>
                <p className="text-gray-600 dark:text-white/70 max-w-md mx-auto">
                  {eventsTab === "upcoming"
                    ? "New events will be announced soon."
                    : "Past events will appear here after they conclude."}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* CANN Events Section */}
      <section id="cann-events" className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-gray-50/80 to-white/80 dark:from-gray-800/80 dark:to-gray-900/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 to-white/80 dark:from-gray-800/80 dark:to-gray-900/80" />
        <div className="absolute top-0 left-0 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-pink-500/10 rounded-full blur-3xl -translate-x-24 sm:-translate-x-36 md:-translate-x-48 -translate-y-24 sm:-translate-y-36 md:-translate-y-48" />
        <div className="absolute bottom-0 right-0 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-purple-600/10 rounded-full blur-3xl translate-x-24 sm:translate-x-36 md:translate-x-48 translate-y-24 sm:translate-y-36 md:translate-y-48" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 border border-gray-200/50 dark:border-gray-400/30 shadow-2xl">
              <motion.div
                className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-pink-500/10 to-purple-600/10 backdrop-blur-xl rounded-full px-4 sm:px-6 py-2 sm:py-3 border border-pink-500/20 dark:border-pink-500/30 mb-4 sm:mb-6 md:mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
                <span className="text-xs sm:text-sm font-medium text-gray-800 dark:text-white/90">
                  CANN Events
                </span>
              </motion.div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-rosarivo mb-4 sm:mb-6">
                <span className="text-gray-900 dark:text-white">
                  Looking for{" "}
                </span>
                <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  CANN Events?
                </span>
              </h2>

              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-white/70 leading-relaxed mb-6 sm:mb-8 md:mb-12 px-2">
                Explore the Canadian Amyloidosis Nursing Network (CANN)
                educational series, upcoming events, and professional
                development opportunities.
              </p>

              <Link href="/cann-resources#cann-events">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 rounded-xl sm:rounded-2xl px-5 sm:px-8 md:px-10 py-3 sm:py-4 md:py-6 text-sm sm:text-base md:text-xl font-bold shadow-xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 group w-full sm:w-auto"
                  >
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 sm:mr-3 group-hover:scale-110 transition-transform duration-300" />
                    <span className="whitespace-nowrap">View CANN Events</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
