import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  ArrowRight,
  MapPin,
  Clock,
  Users,
} from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import ParallaxBackground from "../components/ParallaxBackground";
import healthcareProfessionalImg from "@assets/DSC02826_1750068895453.jpg";

const casEvents = [
  {
    id: 1,
    title: "CAS Journal Club - February 2026",
    date: "2026-02-26",
    time: "5:00 PM - 6:00 PM EST",
    location: "Virtual Event",
    type: "Journal Club",
    description:
      "One-hour virtual session designed for CAS members. Topics: Is it really hATTR? by Dr. Gord Jewett and Topic TBD by Queen's University presenter.",
    isUpcoming: true,
  },
  {
    id: 2,
    title: "CAS Journal Club - November 2025",
    date: "2025-11-27",
    time: "3:00 PM - 4:00 PM MST",
    location: "Virtual Event",
    type: "Journal Club",
    description:
      "Topics covered: AL Amyloidosis by Dr. Janine Mazengarb (UBC) and Diagnostic Dilemmas by Dr. Rajin Choudhury (University of Calgary).",
    isUpcoming: false,
  },
  {
    id: 3,
    title: "CAS Journal Club - September 2025",
    date: "2025-09-25",
    time: "3:00 PM - 4:00 PM MST",
    location: "Virtual Event",
    type: "Journal Club",
    description:
      "Topics covered: ATTR Neuropathy by Dr. Genevieve Matte (University of Montreal) and Cardiac Amyloidosis by Dr. Edgar Da Silva (University of Ottawa).",
    isUpcoming: false,
  },
  {
    id: 4,
    title: "CAS Journal Club - May 2025",
    date: "2025-05-08",
    time: "3:00 PM - 4:00 PM MST",
    location: "Virtual Event",
    type: "Journal Club",
    description:
      "The inaugural CAS Journal Club session featuring Proper Typing for Proper Treatment by Dr. Victor Jimenez-Zepeda and Heart Failure Therapy in ATTR Amyloidosis by Dr. Francois Tournoux.",
    isUpcoming: false,
  },
];

const EST_TIMEZONE = "America/Toronto";

export default function EventsOld() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("upcoming");

  const upcomingEvents = casEvents.filter((e) => e.isUpcoming);
  const pastEvents = casEvents.filter((e) => !e.isUpcoming);

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

    const getOrdinalSuffix = (d: number): string => {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };

    return `${dayName}, ${monthName} ${dayNumber}${getOrdinalSuffix(dayNumber)}, ${yearNumber}`;
  };

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

      {/* Canadian Amyloidosis Summit Section */}
      <section id="summit" className="py-24 bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-transparent to-cyan-100/20 dark:from-gray-800/50 dark:via-transparent dark:to-gray-700/30"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00AFE6]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00DD89]/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
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
        </div>
      </section>

      {/* CAS Events Section */}
      <section
        id="events"
        className="py-24 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-white/10 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-transparent to-cyan-100/20 dark:from-gray-800/30 dark:via-transparent dark:to-gray-700/20"></div>
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
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 backdrop-blur-xl border border-[#00AFE6]/20 rounded-full px-6 py-3 mb-8 shadow-lg">
              <Calendar className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-gray-800 dark:text-white/90 font-medium">
                CAS Events
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-rosarivo mb-6 leading-tight">
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                CAS Journal Club & Events
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-white/70 max-w-3xl mx-auto leading-relaxed px-4">
              Join us at upcoming CAS events and see highlights from our past
              community gatherings.
            </p>
          </motion.div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="max-w-6xl mx-auto px-4"
          >
            <div className="flex justify-center mb-6 sm:mb-8 overflow-x-auto pb-2">
              <div className="bg-gradient-to-r from-gray-100/80 to-blue-100/60 dark:bg-white/5 backdrop-blur-xl border border-[#00AFE6]/20 dark:border-white/20 rounded-2xl p-1 sm:p-2 shadow-2xl inline-flex min-w-max">
                <button
                  onClick={() => setActiveTab("upcoming")}
                  className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base whitespace-nowrap ${
                    activeTab === "upcoming"
                      ? "bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white shadow-lg"
                      : "text-gray-600 dark:text-white/80 hover:text-gray-800 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/10"
                  }`}
                >
                  Upcoming Events
                </button>
                <button
                  onClick={() => setActiveTab("past")}
                  className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base whitespace-nowrap ${
                    activeTab === "past"
                      ? "bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white shadow-lg"
                      : "text-gray-600 dark:text-white/80 hover:text-gray-800 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/10"
                  }`}
                >
                  Past Events
                </button>
              </div>
            </div>

            <TabsContent value="upcoming" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="h-full"
                    >
                      <Card className="bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-xl border border-gray-200/60 dark:border-white/20 hover:border-[#00AFE6]/50 dark:hover:border-[#00AFE6]/60 hover:shadow-2xl hover:shadow-[#00AFE6]/15 transition-all duration-500 h-full flex flex-col rounded-3xl overflow-hidden">
                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex justify-between items-start mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#00AFE6]/20 to-[#00DD89]/20 rounded-2xl flex items-center justify-center">
                              <Calendar className="w-8 h-8 text-[#00AFE6]" />
                            </div>
                            <Badge className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white border-0 px-2 py-1 text-xs font-medium rounded">
                              {event.type}
                            </Badge>
                          </div>

                          <h3 className="text-xl font-semibold text-gray-800 dark:text-white leading-snug mb-6">
                            {event.title}
                          </h3>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/70">
                              <Calendar className="w-4 h-4" />
                              <span>{formatEventDate(event.date)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/70">
                              <Clock className="w-4 h-4" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/70">
                              <MapPin className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                          </div>

                          <p className="text-gray-600 dark:text-white/70 text-sm leading-relaxed flex-1 mb-6 line-clamp-3">
                            {event.description}
                          </p>

                          <div className="space-y-4">
                            <div className="text-center p-4 bg-gradient-to-r from-[#00AFE6]/5 to-[#00DD89]/5 rounded-xl border border-[#00AFE6]/20">
                              <p className="text-sm font-medium text-gray-700 dark:text-white/90 mb-1">
                                Registration not required.
                              </p>
                              <p className="text-xs text-gray-600 dark:text-white/70">
                                Zoom details are sent to CAS members
                              </p>
                            </div>
                            <Link href="/join-cas">
                              <Button
                                className="w-full bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/90 hover:to-[#00DD89]/90 text-white border-0 shadow-lg hover:shadow-xl hover:shadow-[#00AFE6]/25 transition-all duration-300 group/btn py-3 rounded-2xl font-semibold text-sm"
                              >
                                Join CAS
                                <Users className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">
                      No upcoming events at this time. Check back soon!
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="past" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="h-full"
                  >
                    <Card className="bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-xl border border-gray-200/60 dark:border-white/20 hover:border-gray-400/50 dark:hover:border-gray-500/60 hover:shadow-xl transition-all duration-500 h-full flex flex-col rounded-3xl overflow-hidden opacity-80">
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-gray-300/20 to-gray-400/20 rounded-2xl flex items-center justify-center">
                            <Calendar className="w-8 h-8 text-gray-500" />
                          </div>
                          <Badge className="bg-gray-400 text-white border-0 px-2 py-1 text-xs font-medium rounded">
                            {event.type}
                          </Badge>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-700 dark:text-white/80 leading-snug mb-6">
                          {event.title}
                        </h3>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/60">
                            <Calendar className="w-4 h-4" />
                            <span>{formatEventDate(event.date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/60">
                            <Clock className="w-4 h-4" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/60">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                        </div>

                        <p className="text-gray-500 dark:text-white/60 text-sm leading-relaxed flex-1 mb-6 line-clamp-3">
                          {event.description}
                        </p>

                        <div className="text-center p-3 bg-gray-100 dark:bg-gray-700/50 rounded-xl">
                          <p className="text-sm text-gray-500 dark:text-white/60">
                            This event has ended
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
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
