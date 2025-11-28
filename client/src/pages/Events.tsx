import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  ArrowRight,
  Plus,
  MapPin,
  Clock,
  ExternalLink,
  Users,
} from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import ParallaxBackground from "../components/ParallaxBackground";
import healthcareProfessionalImg from "@assets/DSC02826_1750068895453.jpg";
import summitSaveTheDateImg from "@assets/2025 Amyloidosis Summit Save the Date_page-0001_1753250815238.jpg";

// Single source of truth for all events
const allEvents = [
  {
    id: 1,
    title: "2025 Canadian Amyloidosis Summit",
    date: "2025-10-31",
    time: "All Day Event",
    location: "Toronto, ON",
    type: "Summit",
    description:
      "The 2025 Canadian Amyloidosis Summit, hosted by CAS and Transthyretin Amyloidosis Canada (TAC). A comprehensive gathering of healthcare professionals, researchers, and patients focused on advancing amyloidosis care in Canada.",
    image: summitSaveTheDateImg,
    registrationUrl: "https://madhattr.ca/events/",
    isFeatured: true, // Mark as featured event
  },
  {
    id: 2,
    title: "CAS Journal Club - November Session",
    date: "2025-11-27",
    time: "3:00 PM - 4:00 PM MST",
    location: "Virtual Event",
    type: "Journal Club",
    description:
      "Continuing the national journal club initiative for CAS members. One-hour virtual session focusing on amyloidosis clinical case-based presentation and scientific updates.",
    image: "/api/placeholder/400/250",
    registrationUrl: "#",
    requiresMembershipCTA: true,
    membershipType: "CAS",
  },
  {
    id: 3,
    title: "CANN Townhall – Ideation Workshop",
    date: "2025-12-15",
    time: "TBD",
    location: "Virtual Event",
    type: "CANN Workshop",
    description:
      "Join us for an interactive ideation workshop to shape the future of amyloidosis care in Canada. This exclusive event is open to CANN members only.",
    image: "/api/placeholder/400/250",
    internalRegistrationUrl: "/events/cann-townhall/register",
    requiresMembershipCTA: true,
    membershipType: "CANN",
  },
  {
    id: 4,
    title: "CAS Journal Club - September Session",
    date: "2025-09-25",
    time: "3:00 PM - 4:00 PM MST",
    location: "Virtual Event",
    type: "Journal Club",
    description:
      "One-hour virtual session focusing on amyloidosis clinical case-based presentations and scientific updates.",
    image: "/api/placeholder/400/250",
    registrationUrl: "#",
    confirmed: true,
  },
];

// Helper function to parse event date and compare with today
const isEventPast = (dateString: string): boolean => {
  const [year, month, day] = dateString.split("-").map(Number);
  const eventDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
  return eventDate < today;
};

// Helper function to categorize events dynamically
const categorizeEvents = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const featured = allEvents.filter(event => event.isFeatured && !isEventPast(event.date));
  const upcoming = allEvents.filter(event => !event.isFeatured && !isEventPast(event.date));
  const past = allEvents.filter(event => isEventPast(event.date));
  
  // Sort past events by date (most recent first)
  past.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
  
  return { featured, upcoming, past };
};

export default function Events() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Dynamically categorize events based on current date
  const { featured: featuredEvents, upcoming: upcomingEvents, past: pastEvents } = categorizeEvents();

  // Helper function to add ordinal suffix to day
  const getOrdinalSuffix = (day: number): string => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  // Format date to "Thursday, September 25th, 2025"
  // Fixed to handle dates as local dates instead of UTC to prevent timezone issues
  const formatEventDate = (dateString: string): string => {
    // Parse date as local date by splitting and using Date constructor to avoid UTC conversion
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed

    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    const monthName = date.toLocaleDateString("en-US", { month: "long" });
    const dayNumber = date.getDate();
    const yearNumber = date.getFullYear();
    const ordinalSuffix = getOrdinalSuffix(dayNumber);

    return `${dayName}, ${monthName} ${dayNumber}${ordinalSuffix}, ${yearNumber}`;
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

      {/* Section 5: Featured Event Section - Hidden for now but layout preserved */}
      {false && (
      <section className="py-24 bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-white/10 relative overflow-hidden">
        {/* Background Effects */}
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
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 backdrop-blur-xl border border-[#00AFE6]/20 rounded-full px-6 py-3 shadow-lg">
                <Calendar className="w-5 h-5 text-[#00AFE6]" />
                <span className="text-gray-800 dark:text-white/90 font-medium">
                  Featured Event
                </span>
              </div>

              {/* Status Badge */}
              <motion.div
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 backdrop-blur-xl border border-[#00AFE6]/20 rounded-full px-4 py-2"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="w-2 h-2 bg-[#00AFE6] rounded-full animate-pulse" />
                <span className="text-sm font-medium text-[#00AFE6] dark:text-[#00AFE6]">
                  Registration is open
                </span>
              </motion.div>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-rosarivo mb-8 leading-tight">
              <span className="text-gray-800 dark:text-white">
                2025 Canadian{" "}
              </span>
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Amyloidosis Summit
              </span>
            </h2>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-white/70 max-w-4xl mx-auto leading-relaxed px-4">
              Registration is open
            </p>
          </motion.div>

          <div className="max-w-7xl mx-auto">
            {/* Larger, Centered Save the Date Image */}
            <motion.div
              className="relative mb-16 flex justify-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/25 dark:to-[#00DD89]/25 backdrop-blur-xl rounded-3xl p-8 border border-[#00AFE6]/30 shadow-2xl max-w-4xl w-full">
                <img
                  src={summitSaveTheDateImg}
                  alt="Save the Date - 2025 Canadian Amyloidosis Summit"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00AFE6]/5 to-transparent rounded-3xl pointer-events-none" />

                {/* Floating accent elements around the image */}
                <motion.div
                  className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-3xl flex items-center justify-center shadow-2xl"
                  animate={{
                    y: [0, -12, 0],
                    rotate: [0, 8, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Calendar className="w-8 h-8 text-white" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-r from-[#00DD89] to-[#00AFE6] rounded-3xl flex items-center justify-center shadow-2xl"
                  animate={{
                    y: [0, 12, 0],
                    rotate: [0, -8, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2.5,
                  }}
                >
                  <MapPin className="w-8 h-8 text-white" />
                </motion.div>
              </div>
            </motion.div>

            {/* Summit Information Card - Centered Below Image */}
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
                    Event Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                    <div className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-[#00AFE6]/10 to-[#00DD89]/10 rounded-2xl border border-[#00AFE6]/20">
                      <Calendar className="w-8 h-8 text-[#00AFE6]" />
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-500 dark:text-white/60 mb-1">
                          Dates
                        </p>
                        <p className="text-gray-800 dark:text-white font-semibold">
                          October 31 - November 2, 2025
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-[#00DD89]/10 to-[#00AFE6]/10 rounded-2xl border border-[#00DD89]/20">
                      <MapPin className="w-8 h-8 text-[#00DD89]" />
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-500 dark:text-white/60 mb-1">
                          Location
                        </p>
                        <p className="text-gray-800 dark:text-white font-semibold">
                          Toronto, ON
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-white/70 mb-10 leading-relaxed text-lg">
                    Join us for the 2025 Canadian Amyloidosis Summit, hosted by
                    CAS and Transthyretin Amyloidosis Canada (TAC). Registration
                    is open through the TAC website.
                  </p>

                  <div className="space-y-4">
                    <Button
                      onClick={() =>
                        window.open("https://madhattr.ca/events/", "_blank")
                      }
                      className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/90 hover:to-[#00DD89]/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group px-8 py-4 text-lg font-semibold rounded-2xl"
                    >
                      Register Now
                      <ExternalLink className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>

                    <p className="text-sm text-gray-500 dark:text-white/50">
                      Registration is open
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      )}

      {/* Section 6: Events Section */}
      <section
        id="events"
        className="py-24 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-white/10 relative overflow-hidden"
      >
        {/* Frost Background Effect */}
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
                Community
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-rosarivo mb-6 leading-tight">
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Events & Community
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-white/70 max-w-3xl mx-auto leading-relaxed px-4">
              Join us at upcoming events and see highlights from our recent
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
                  onClick={() => setActiveTab("overview")}
                  className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base whitespace-nowrap ${
                    activeTab === "overview"
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

            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {upcomingEvents.map((event, index) => (
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
                        {/* Badge */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-[#00AFE6]/20 to-[#00DD89]/20 rounded-2xl flex items-center justify-center">
                            <Calendar className="w-8 h-8 text-[#00AFE6]" />
                          </div>
                          <Badge className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white border-0 px-2 py-1 text-xs font-medium rounded">
                            {event.type}
                          </Badge>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white leading-snug mb-6">
                          {event.title}
                        </h3>

                        {/* Event Details */}
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

                        {/* Description */}
                        <p className="text-gray-600 dark:text-white/70 text-sm leading-relaxed flex-1 mb-6">
                          {event.description}
                        </p>

                        {/* Registration button for events with internal registration */}
                        {event.internalRegistrationUrl && (
                          <div className="text-center p-3 bg-gradient-to-r from-[#00AFE6]/15 to-[#00DD89]/15 rounded-xl border border-[#00AFE6]/40 shadow-md shadow-[#00AFE6]/10 relative overflow-hidden space-y-2">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#00AFE6]/5 to-[#00DD89]/5 opacity-50 animate-pulse"></div>
                            <div className="relative z-10">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <div className="w-1.5 h-1.5 bg-[#00DD89] rounded-full animate-pulse"></div>
                                <p className="text-sm font-semibold text-[#00DD89] dark:text-[#00DD89]">
                                  CANN Members Only
                                </p>
                                <div className="w-1.5 h-1.5 bg-[#00DD89] rounded-full animate-pulse"></div>
                              </div>
                              <Link href={event.internalRegistrationUrl}>
                                <Button
                                  className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/90 hover:to-[#00DD89]/90 text-white border-0 shadow-lg hover:shadow-xl hover:shadow-[#00AFE6]/25 transition-all duration-300 group/btn py-2 px-6 rounded-lg font-semibold text-sm relative overflow-hidden"
                                  data-testid="button-register-townhall"
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                                  <div className="relative z-10 flex items-center justify-center">
                                    <Calendar className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-300" />
                                    Register Now
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                                  </div>
                                </Button>
                              </Link>
                            </div>
                          </div>
                        )}

                        {/* Membership info and Join button - Show for events that require membership but don't have internal registration */}
                        {event.requiresMembershipCTA && !event.internalRegistrationUrl && (
                          <div className="text-center p-3 bg-gradient-to-r from-[#00AFE6]/15 to-[#00DD89]/15 rounded-xl border border-[#00AFE6]/40 shadow-md shadow-[#00AFE6]/10 relative overflow-hidden space-y-2">
                            {/* Subtle animated background effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#00AFE6]/5 to-[#00DD89]/5 opacity-50 animate-pulse"></div>

                            <div className="relative z-10">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <div className="w-1.5 h-1.5 bg-[#00AFE6] rounded-full animate-pulse"></div>
                                <p className="text-sm font-semibold text-[#00AFE6] dark:text-[#00AFE6]">
                                  Registration Not Required.
                                </p>
                                <div className="w-1.5 h-1.5 bg-[#00AFE6] rounded-full animate-pulse"></div>
                              </div>
                              <p className="text-xs font-medium text-gray-700 dark:text-white/80 mb-2">
                                {event.membershipType === "CANN"
                                  ? "Zoom details are sent to CANN members"
                                  : "Zoom details are sent to CAS members"}
                              </p>

                              <Button
                                onClick={() =>
                                  (window.location.href =
                                    event.membershipType === "CANN"
                                      ? "/about-cann#join-section"
                                      : "/join-cas")
                                }
                                className={
                                  event.membershipType === "CANN"
                                    ? "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl hover:shadow-pink-500/25 transition-all duration-300 group/btn py-2 px-6 rounded-lg font-semibold text-xs relative overflow-hidden"
                                    : "bg-[#00DD89] hover:bg-[#00DD89]/90 text-gray-800 border border-[#00DD89] hover:border-[#00DD89]/90 shadow-lg hover:shadow-xl hover:shadow-[#00DD89]/25 transition-all duration-300 group/btn py-2 px-6 rounded-lg font-semibold text-xs relative overflow-hidden"
                                }
                                data-testid={
                                  event.membershipType === "CANN"
                                    ? "button-join-cann"
                                    : "button-join-cas"
                                }
                              >
                                {/* Animated background effect */}
                                <div
                                  className={
                                    event.membershipType === "CANN"
                                      ? "absolute inset-0 bg-gradient-to-r from-pink-500/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
                                      : "absolute inset-0 bg-gradient-to-r from-[#00DD89]/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
                                  }
                                ></div>

                                <div
                                  className={
                                    event.membershipType === "CANN"
                                      ? "relative z-10 flex items-center justify-center text-white"
                                      : "relative z-10 flex items-center justify-center text-gray-800"
                                  }
                                >
                                  <Users
                                    className={
                                      event.membershipType === "CANN"
                                        ? "w-3 h-3 mr-1 group-hover/btn:scale-110 transition-transform duration-300 text-white"
                                        : "w-3 h-3 mr-1 group-hover/btn:scale-110 transition-transform duration-300 text-gray-800"
                                    }
                                  />
                                  {event.membershipType === "CANN" ? "Join CANN" : "Join CAS"}
                                  <div
                                    className={
                                      event.membershipType === "CANN"
                                        ? "ml-1 w-1.5 h-1.5 bg-white rounded-full animate-pulse"
                                        : "ml-1 w-1.5 h-1.5 bg-gray-800 rounded-full animate-pulse"
                                    }
                                  ></div>
                                </div>
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="past" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pastEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-xl border border-gray-200/60 dark:border-white/20 hover:border-[#00AFE6]/50 dark:hover:border-[#00AFE6]/60 hover:shadow-2xl hover:shadow-[#00AFE6]/15 transition-all duration-500 h-full group rounded-3xl overflow-hidden">
                      {/* Enhanced Header */}
                      <div className="relative p-8 pb-6 bg-gradient-to-br from-[#00AFE6]/10 via-[#00DD89]/5 to-transparent">
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white border-0 px-3 py-1 text-xs font-medium rounded-full">
                            {event.type}
                          </Badge>
                        </div>

                        <div className="w-16 h-16 bg-gradient-to-br from-[#00AFE6]/20 to-[#00DD89]/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                          <Calendar className="w-8 h-8 text-[#00AFE6] group-hover:text-[#00DD89] transition-colors duration-300" />
                        </div>

                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 leading-tight group-hover:text-[#00AFE6] transition-colors duration-300">
                          {event.title}
                        </h3>
                      </div>

                      <CardContent className="p-8 pt-0 flex flex-col flex-1">
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#00AFE6]/5 to-[#00DD89]/5 rounded-xl border border-[#00AFE6]/10">
                            <Calendar className="w-5 h-5 text-[#00AFE6] flex-shrink-0" />
                            <span className="text-sm font-medium text-gray-700 dark:text-white/80">
                              {formatEventDate(event.date)}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#00DD89]/5 to-[#00AFE6]/5 rounded-xl border border-[#00DD89]/10">
                            <MapPin className="w-5 h-5 text-[#00DD89] flex-shrink-0" />
                            <span className="text-sm font-medium text-gray-700 dark:text-white/80">
                              {event.location}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-600 dark:text-white/70 text-sm leading-relaxed flex-1">
                          {event.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CANN Events Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50/80 to-white/80 dark:from-gray-800/80 dark:to-gray-900/80 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 to-white/80 dark:from-gray-800/80 dark:to-gray-900/80" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl -translate-x-48 -translate-y-48" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl translate-x-48 translate-y-48" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-gray-200/50 dark:border-gray-400/30 shadow-2xl">
              {/* Header Badge */}
              <motion.div
                className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500/10 to-purple-600/10 backdrop-blur-xl rounded-full px-6 py-3 border border-pink-500/20 dark:border-pink-500/30 mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Users className="w-5 h-5 text-pink-500" />
                <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                  CANN Events
                </span>
              </motion.div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-rosarivo mb-6">
                <span className="text-gray-900 dark:text-white">
                  Looking for{" "}
                </span>
                <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  CANN Events?
                </span>
              </h2>

              <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed mb-12">
                Explore the Canadian Amyloidosis Nursing Network (CANN) educational series, upcoming events, and professional development opportunities.
              </p>

              <Link href="/cann-resources">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 rounded-2xl px-10 py-6 text-xl font-bold shadow-xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 group"
                    data-testid="button-view-cann-events"
                  >
                    <Calendar className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                    View CANN Events
                    <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
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
