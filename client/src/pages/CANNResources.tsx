import { motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  Download,
  FileText,
  GraduationCap,
  Users,
  PlayCircle,
  ExternalLink,
  Award,
  Search,
  Globe,
  Mail,
  Clock,
  MapPin,
  Video,
  Copy,
  Check,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import ParallaxBackground from "../components/ParallaxBackground";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import healthcareProfessionalImg from "@assets/DSC02826_1750068895453.jpg";
import cardiacAmyloidosisBooklet from "@assets/Living-with-cardiac-amyloidosis_1763624816977.pdf";
import patientJourneyVideo from "@assets/video1888503207.mp4";

// MST Timezone constant (America/Edmonton handles MST/MDT automatically)
const MST_TIMEZONE = 'America/Edmonton';

// Helper to get current date in MST timezone
const getMSTDate = (): Date => {
  const now = new Date();
  const mstDateStr = now.toLocaleDateString('en-CA', { timeZone: MST_TIMEZONE });
  const [year, month, day] = mstDateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export default function CANNResources() {
  const { t } = useLanguage();
  const [isCopied, setIsCopied] = useState(false);
  const [playingVideoIndex, setPlayingVideoIndex] = useState<number | null>(null);
  const [activeEventTab, setActiveEventTab] = useState("upcoming");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Helper function to add ordinal suffix to day
  const getOrdinalSuffix = (day: number): string => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd'; 
      case 3: return 'rd';
      default: return 'th';
    }
  };

  // Format date to "Thursday, September 25th, 2025" in MST timezone
  const formatEventDate = (dateString: string): string => {
    // Guard against empty or invalid date strings
    if (!dateString) return "TBD";
    
    // Check if it's a valid YYYY-MM-DD format
    const parts = dateString.split("-").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) {
      // Not a YYYY-MM-DD format, return the original string (already human-readable)
      return dateString;
    }
    
    const [year, month, day] = parts;
    
    // Create a date that represents this date in MST
    // Use noon to avoid any edge cases with daylight saving
    const dateForFormatting = new Date(Date.UTC(year, month - 1, day, 18, 0, 0)); // 18:00 UTC = noon MST
    
    // Validate the date is valid
    if (isNaN(dateForFormatting.getTime())) {
      return dateString;
    }
    
    // Format using MST timezone
    const dayName = dateForFormatting.toLocaleDateString('en-US', { weekday: 'long', timeZone: MST_TIMEZONE });
    const monthName = dateForFormatting.toLocaleDateString('en-US', { month: 'long', timeZone: MST_TIMEZONE });
    const dayNumber = parseInt(dateForFormatting.toLocaleDateString('en-US', { day: 'numeric', timeZone: MST_TIMEZONE }));
    const yearNumber = parseInt(dateForFormatting.toLocaleDateString('en-US', { year: 'numeric', timeZone: MST_TIMEZONE }));
    const ordinalSuffix = getOrdinalSuffix(dayNumber);
    
    return `${dayName}, ${monthName} ${dayNumber}${ordinalSuffix}, ${yearNumber}`;
  };

  // Check if an event date has passed (using MST timezone)
  const isEventPast = (dateString: string): boolean => {
    if (!dateString || dateString === 'TBD') return false;
    
    // Check if it's a valid YYYY-MM-DD format
    const parts = dateString.split("-").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) {
      return false; // Can't determine if non-ISO date is past
    }
    
    const [year, month, day] = parts;
    const eventDate = new Date(year, month - 1, day);
    
    if (isNaN(eventDate.getTime())) {
      return false;
    }
    
    const todayMST = getMSTDate();
    return eventDate < todayMST;
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("CANN@amyloid.ca");
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  const educationalResources = [
    {
      title: t('cannResources.resources.guidelines.title'),
      description: t('cannResources.resources.guidelines.description'),
      type: t('cannResources.resources.guidelines.type'),
      format: t('cannResources.resources.format.pdf'),
      size: t('cannResources.resources.guidelines.size'),
      updated: t('cannResources.resources.guidelines.updated'),
      category: t('cannResources.resources.categories.guidelines'),
    },
    {
      title: t('cannResources.resources.protocols.title'),
      description: t('cannResources.resources.protocols.description'),
      type: t('cannResources.resources.protocols.type'),
      format: t('cannResources.resources.format.pdf'),
      size: t('cannResources.resources.protocols.size'),
      updated: t('cannResources.resources.protocols.updated'),
      category: t('cannResources.resources.categories.nursing'),
    },
    {
      title: t('cannResources.resources.assessment.title'),
      description: t('cannResources.resources.assessment.description'),
      type: t('cannResources.resources.assessment.type'),
      format: t('cannResources.resources.format.pdf'),
      size: t('cannResources.resources.assessment.size'),
      updated: t('cannResources.resources.assessment.updated'),
      category: t('cannResources.resources.categories.assessment'),
    },
    {
      title: t('cannResources.resources.imaging.title'),
      description: t('cannResources.resources.imaging.description'),
      type: t('cannResources.resources.imaging.type'),
      format: t('cannResources.resources.format.pdf'),
      size: t('cannResources.resources.imaging.size'),
      updated: t('cannResources.resources.imaging.updated'),
      category: t('cannResources.resources.categories.diagnostics'),
    },
  ];

  const educationalSeries = [
    {
      rawDate: "2025-10-07",
      speaker: t('cannResources.series.session1.speaker'),
      topic: t('cannResources.series.session1.topic'),
    },
    {
      rawDate: "2025-05-13",
      speaker: t('cannResources.series.session2.speaker'),
      topic: t('cannResources.series.session2.topic'),
    },
    {
      rawDate: "2025-01-28",
      speaker: t('cannResources.series.session3.speaker'),
      topic: t('cannResources.series.session3.topic'),
    },
    {
      rawDate: "2024-10-08",
      speaker: t('cannResources.series.session4.speaker'),
      topic: t('cannResources.series.session4.topic'),
    },
    {
      rawDate: "2024-04-16",
      speaker: t('cannResources.series.session5.speaker'),
      topic: t('cannResources.series.session5.topic'),
    },
    {
      rawDate: "2023-12-13",
      speaker: t('cannResources.series.session6.speaker'),
      topic: t('cannResources.series.session6.topic'),
    },
  ];

  // All CANN events with rawDate for automatic past/upcoming categorization
  const allCANNEvents = [
    {
      id: 1,
      title: t('cannResources.events.eduSeries.title'),
      date: t('cannResources.events.eduSeries.date'),
      rawDate: "2026-02-18", // February 18, 2026 MST
      time: t('cannResources.events.eduSeries.time'),
      location: t('cannResources.events.eduSeries.location'),
      format: t('cannResources.events.eduSeries.format'),
      description: t('cannResources.events.eduSeries.description'),
      topic: undefined as string | undefined,
      presentationTitle: t('cannResources.events.eduSeries.presentationTitle'),
      speaker: t('cannResources.events.eduSeries.speaker'),
      registrationDeadline: t('cannResources.events.noRegistration'),
      cmeCredits: t('cannResources.events.eduSeries.credits'),
      type: t('cannResources.events.types.webinar'),
    },
    {
      id: 2,
      title: t('cannResources.events.quarterly.title'),
      date: t('cannResources.events.quarterly.date'),
      rawDate: "2025-12-02",
      time: t('cannResources.events.quarterly.time'),
      location: t('cannResources.events.quarterly.location'),
      format: t('cannResources.events.quarterly.format'),
      description: t('cannResources.events.quarterly.description'),
      registrationDeadline: t('cannResources.events.noRegistration'),
      cmeCredits: t('cannResources.events.quarterly.credits'),
      type: t('cannResources.events.types.meeting'),
    },
    {
      id: 3,
      title: t('cannResources.events.townhall.title'),
      date: t('cannResources.events.townhall.date'),
      rawDate: "2026-01-22",
      time: t('cannResources.events.townhall.time'),
      location: t('cannResources.events.townhall.location'),
      format: t('cannResources.events.townhall.format'),
      description: t('cannResources.events.townhall.description'),
      registrationDeadline: t('cannResources.events.townhall.registration'),
      cmeCredits: t('cannResources.events.townhall.credits'),
      type: t('cannResources.events.types.townhall'),
      registrationUrl: "https://pangaea-consultants.typeform.com/to/uakirBOt?typeform-source=www.google.com",
      requiresCANNMembership: true,
    },
    {
      id: 4,
      title: t('cannResources.events.quarterlyMar2026.title'),
      date: t('cannResources.events.quarterlyMar2026.date'),
      rawDate: "2026-03-10",
      time: t('cannResources.events.quarterlyMar2026.time'),
      location: t('cannResources.events.quarterlyMar2026.location'),
      format: t('cannResources.events.quarterlyMar2026.format'),
      description: t('cannResources.events.quarterlyMar2026.description'),
      registrationDeadline: t('cannResources.events.noRegistration'),
      cmeCredits: t('cannResources.events.quarterlyMar2026.credits'),
      type: t('cannResources.events.types.meeting'),
    },
    {
      id: 5,
      title: t('cannResources.events.summit.title'),
      date: t('cannResources.events.summit.date'),
      rawDate: "2026-10-15", // Fall 2026 TBD
      displayDate: "Fall 2026 – date TBD",
      time: t('cannResources.events.summit.time'),
      location: t('cannResources.events.summit.location'),
      format: t('cannResources.events.summit.format'),
      description: t('cannResources.events.summit.description'),
      registrationDeadline: t('cannResources.comingSoon'),
      cmeCredits: t('cannResources.events.summit.credits'),
      type: t('cannResources.events.types.conference'),
    },
  ];

  // Helper to parse raw date string as local date for consistent timezone handling
  const parseLocalDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  // Categorize events into upcoming and past
  const categorizeEvents = () => {
    const upcoming = allCANNEvents.filter(event => !isEventPast(event.rawDate));
    const past = allCANNEvents.filter(event => isEventPast(event.rawDate));
    
    // Sort upcoming by date (soonest first) - using local date parsing
    upcoming.sort((a, b) => {
      const dateA = parseLocalDate(a.rawDate);
      const dateB = parseLocalDate(b.rawDate);
      return dateA.getTime() - dateB.getTime();
    });
    
    // Sort past by date (most recent first) - using local date parsing
    past.sort((a, b) => {
      const dateA = parseLocalDate(a.rawDate);
      const dateB = parseLocalDate(b.rawDate);
      return dateB.getTime() - dateA.getTime();
    });
    
    return { upcoming, past };
  };

  const { upcoming: upcomingEvents, past: pastEvents } = categorizeEvents();

  const trainingPrograms = [
    {
      title: t('cannResources.training.certification.title'),
      duration: t('cannResources.training.certification.duration'),
      format: t('cannResources.training.certification.format'),
      level: t('cannResources.training.levels.advanced'),
      description: t('cannResources.training.certification.description'),
      modules: [
        t('cannResources.training.modules.pathophysiology'),
        t('cannResources.training.modules.diagnosis'),
        t('cannResources.training.modules.treatment'),
        t('cannResources.training.modules.patientManagement'),
      ],
      nextStart: t('cannResources.training.certification.nextStart'),
    },
    {
      title: t('cannResources.training.detection.title'),
      duration: t('cannResources.training.detection.duration'),
      format: t('cannResources.training.detection.format'),
      level: t('cannResources.training.levels.intermediate'),
      description: t('cannResources.training.detection.description'),
      modules: [
        t('cannResources.training.modules.redFlags'),
        t('cannResources.training.modules.screeningTools'),
        t('cannResources.training.modules.referralPathways'),
      ],
      nextStart: t('cannResources.training.detection.nextStart'),
    },
    {
      title: t('cannResources.training.research.title'),
      duration: t('cannResources.training.research.duration'),
      format: t('cannResources.training.research.format'),
      level: t('cannResources.training.levels.advanced'),
      description: t('cannResources.training.research.description'),
      modules: [
        t('cannResources.training.modules.studyDesign'),
        t('cannResources.training.modules.dataCollection'),
        t('cannResources.training.modules.statisticalAnalysis'),
        t('cannResources.training.modules.publication'),
      ],
      nextStart: t('cannResources.training.research.nextStart'),
    },
  ];

  const researchPublications = [
    {
      title: t('cannResources.publications.registry.title'),
      authors: t('cannResources.publications.registry.authors'),
      journal: t('cannResources.publications.registry.journal'),
      year: "2024",
      type: t('cannResources.publications.types.report'),
      abstract: t('cannResources.publications.registry.abstract'),
    },
    {
      title: t('cannResources.publications.ai.title'),
      authors: t('cannResources.publications.ai.authors'),
      journal: t('cannResources.publications.ai.journal'),
      year: "2024",
      type: t('cannResources.publications.types.article'),
      abstract: t('cannResources.publications.ai.abstract'),
    },
    {
      title: t('cannResources.publications.nursing.title'),
      authors: t('cannResources.publications.nursing.authors'),
      journal: t('cannResources.publications.nursing.journal'),
      year: "2024",
      type: t('cannResources.publications.types.study'),
      abstract: t('cannResources.publications.nursing.abstract'),
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <ParallaxBackground>{null}</ParallaxBackground>
      {/* Hero Section */}
      <section className="py-32 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
            style={{ backgroundImage: `url(${healthcareProfessionalImg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-white/50 to-purple-600/15 dark:from-pink-500/30 dark:via-gray-900/50 dark:to-purple-600/25" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 bg-pink-500/10 dark:bg-pink-400/10 backdrop-blur-xl rounded-full px-6 py-3 border border-pink-500/20 dark:border-pink-400/20 mb-6">
              <BookOpen className="w-5 h-5 text-pink-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-white/90">
                {t('cannResources.badge')}
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold font-rosarivo mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                CANN
              </span>
              <br />
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                {t('cannResources.heroTitle.resourcesEvents')}
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed mb-8 max-w-3xl mx-auto">
              {t('cannResources.heroDescription')}
            </p>
          </motion.div>
        </div>
      </section>
      {/* Training Programs Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
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
                {t('cannResources.educationalSeries.title')}
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed max-w-3xl mx-auto">
              {t('cannResources.educationalSeries.subtitle')}
            </p>
          </motion.div>

          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-lg border border-pink-500/20 max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-full p-2 flex-shrink-0">
                    <Users className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {t('cannResources.membersOnly.title')}
                    </h3>
                    <p className="text-gray-600 dark:text-white/70 text-sm">
                      {t('cannResources.membersOnly.description')}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() =>
                    (window.location.href = "/about-cann#join-section")
                  }
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 rounded-2xl px-8 w-full sm:w-auto sm:flex-shrink-0"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Join CANN
                </Button>
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {educationalSeries.map((session, index) => (
              <motion.div
                key={index}
                className="h-full"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 h-full flex flex-col">
                  {/* Thumbnail Section */}
                  <div className="relative w-full aspect-video bg-gray-900 overflow-hidden group">
                    {/* Gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00AFE6]/80 to-[#00DD89]/80 dark:from-[#00AFE6]/70 dark:to-[#00DD89]/70" />
                    
                    {/* Subtle dark overlay */}
                    <div className="absolute inset-0 bg-black/20" />
                    
                    {/* Coming Soon badge centered */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/95 dark:bg-gray-900/95 rounded-full px-6 py-3 shadow-2xl">
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                          Coming Soon
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details Section */}
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 px-3 py-1 rounded-full border border-[#00AFE6]/20 mb-3 w-fit">
                      <Calendar className="w-4 h-4 text-[#00AFE6]" />
                      <span className="text-sm font-medium text-[#00AFE6] dark:text-[#00DD89]">
                        {formatEventDate(session.rawDate)}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white leading-tight">
                      {session.topic}
                    </h3>
                    
                    <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-start gap-2">
                        <User className="w-4 h-4 text-[#00AFE6] mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            Speaker:
                          </div>
                          <div className="text-sm text-gray-600 dark:text-white/70 font-bold">
                            {session.speaker}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Educational Resources Section */}
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
                {t('cannResources.materials.title')}
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed max-w-3xl mx-auto">
              {t('cannResources.materials.description')}
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
              <Card className="bg-gradient-to-br from-white to-pink-50/30 dark:from-gray-900 dark:to-pink-900/10 border border-gray-200 dark:border-gray-700 hover:border-pink-500/50 dark:hover:border-pink-500/50 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 h-full flex flex-col rounded-2xl overflow-hidden group">
                <CardContent className="p-6 flex flex-col flex-1">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                    <BookOpen className="w-8 h-8 text-pink-600 dark:text-pink-400" />
                  </div>

                  {/* Badge */}
                  <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0 px-3 py-1 text-xs font-medium rounded-full mb-4 w-fit">
                    Patient and Caregiver Resource
                  </Badge>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-300">
                    Living with Cardiac Amyloidosis Patient Booklet
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-white/70 text-sm leading-relaxed flex-1 mb-4">
                    This comprehensive guide is meant to help patients and their caregivers better understand cardiac amyloidosis. It covers many topics including clarifying the disease process, symptoms, diagnosis, treatment, and other important aspects of living with this condition. The booklet can be downloaded and/or printed to share with others.
                  </p>

                  {/* French Translation Notice */}
                  <div className="mb-6 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800">
                    <p className="text-xs text-pink-700 dark:text-pink-300 font-medium text-center italic">
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
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 rounded-xl w-full shadow-lg hover:shadow-xl hover:shadow-pink-500/25 transition-all duration-300 group/btn"
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
      {/* Events Section with Tabs */}
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
                {t('cannResources.eventsSection.title')}
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed max-w-3xl mx-auto">
              {t('cannResources.eventsSection.subtitle')}
            </p>
          </motion.div>

          <Tabs
            value={activeEventTab}
            onValueChange={setActiveEventTab}
            className="max-w-6xl mx-auto"
          >
            {/* Tab Buttons */}
            <div className="flex justify-center mb-8 overflow-x-auto pb-2">
              <div className="bg-gradient-to-r from-pink-100/80 to-purple-100/60 dark:from-pink-900/20 dark:to-purple-900/20 backdrop-blur-xl border border-pink-500/20 dark:border-pink-500/30 rounded-2xl p-1 sm:p-2 shadow-2xl inline-flex min-w-max">
                <button
                  onClick={() => setActiveEventTab("upcoming")}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base whitespace-nowrap ${
                    activeEventTab === "upcoming"
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                      : "text-gray-600 dark:text-white/80 hover:text-gray-800 dark:hover:text-white hover:bg-pink-100/50 dark:hover:bg-pink-900/30"
                  }`}
                  data-testid="tab-upcoming-events"
                >
                  {t('cannResources.tabs.upcomingEvents')}
                </button>
                <button
                  onClick={() => setActiveEventTab("past")}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base whitespace-nowrap ${
                    activeEventTab === "past"
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                      : "text-gray-600 dark:text-white/80 hover:text-gray-800 dark:hover:text-white hover:bg-pink-100/50 dark:hover:bg-pink-900/30"
                  }`}
                  data-testid="tab-past-events"
                >
                  {t('cannResources.tabs.pastEvents')}
                </button>
              </div>
            </div>

            {/* Upcoming Events Tab */}
            <TabsContent value="upcoming" className="mt-0">
              {/* Members Only Banner */}
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl p-6 shadow-lg border border-pink-200/50 dark:border-slate-700/50 max-w-4xl mx-auto">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-full p-3 flex-shrink-0">
                        <Users className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                          {t('cannResources.eventsAccess.title')}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          {t('cannResources.eventsAccess.description')}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => (window.location.href = "/about-cann#join-section")}
                      size="lg"
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 rounded-2xl px-8 w-full sm:w-auto sm:flex-shrink-0"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      {t('cannResources.eventsAccess.joinButton')}
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Upcoming Events List */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      <Card className="bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-xl border border-gray-200/60 dark:border-white/20 hover:border-pink-500/50 dark:hover:border-pink-500/60 hover:shadow-2xl hover:shadow-pink-500/15 transition-all duration-500 h-full flex flex-col rounded-3xl overflow-hidden">
                        {/* Header Section */}
                        <div className="relative p-6 pb-4 bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-transparent">
                          <div className="flex justify-between items-start mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center">
                              <Calendar className="w-8 h-8 text-pink-500" />
                            </div>
                            <div className="flex flex-wrap gap-2 justify-end">
                              <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0 px-2 py-1 text-xs font-medium rounded">
                                {event.type}
                              </Badge>
                              {event.format && (
                                <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs">
                                  {event.format}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-800 dark:text-white leading-snug">
                            {event.title}{event.presentationTitle && ` - ${event.presentationTitle}`}
                          </h3>
                          {/* Speaker - in header below presentation title */}
                          {event.speaker && (
                            <div className="flex items-start gap-2 text-sm mt-3">
                              <User className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="font-medium text-gray-600 dark:text-white/70">{t('cannResources.events.speakerLabel')}</span>
                                <p className="text-gray-800 dark:text-white font-bold mt-1 whitespace-pre-line">
                                  {event.speaker}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Content Section */}
                        <CardContent className="p-6 pt-0 flex flex-col flex-1">
                          {/* Event Details */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/70">
                              <Calendar className="w-4 h-4 text-pink-500" />
                              <span>{event.displayDate || formatEventDate(event.rawDate)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/70">
                              <Clock className="w-4 h-4 text-pink-500" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/70">
                              <MapPin className="w-4 h-4 text-pink-500" />
                              <span>{event.location}</span>
                            </div>
                          </div>

                          {/* Optional Topic Box */}
                          {event.topic && (
                            <div className="mb-4 p-3 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border border-pink-200 dark:border-pink-800 rounded-xl">
                              <div className="text-xs font-medium text-pink-600 dark:text-pink-400 mb-1">
                                {t('cannResources.events.sessionTopic')}
                              </div>
                              <div className="text-sm text-gray-800 dark:text-white font-medium italic">
                                "{event.topic}"
                              </div>
                            </div>
                          )}

                          {/* Description */}
                          <p className="text-gray-600 dark:text-white/70 text-sm leading-relaxed flex-1 mb-4">
                            {event.description}
                          </p>

                          {/* Optional CME Credits */}
                          {event.cmeCredits && (
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                              <Award className="w-4 h-4 text-pink-500" />
                              <span>{event.cmeCredits}</span>
                            </div>
                          )}

                          {/* CTA Section */}
                          {event.registrationUrl ? (
                            <div className="text-center p-3 bg-gradient-to-r from-pink-500/15 to-purple-600/15 rounded-xl border border-pink-500/40 shadow-md shadow-pink-500/10 relative overflow-hidden space-y-2">
                              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-600/5 opacity-50 animate-pulse"></div>
                              <div className="relative z-10">
                                {/* Registration Message */}
                                {event.registrationDeadline && (
                                  <p className="text-xs font-medium text-gray-700 dark:text-white/80 mb-2">
                                    {event.registrationDeadline}
                                  </p>
                                )}
                                {event.requiresCANNMembership && (
                                  <div className="flex items-center justify-center gap-1 mb-2">
                                    <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse"></div>
                                    <p className="text-xs font-medium text-pink-600 dark:text-pink-400">
                                      {t('cannResources.events.cannMembersOnly')}
                                    </p>
                                    <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse"></div>
                                  </div>
                                )}
                                <a 
                                  href={event.registrationUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Button
                                    size="sm"
                                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl hover:shadow-pink-500/25 transition-all duration-300 group/btn py-2 px-6 rounded-lg font-semibold text-xs relative overflow-hidden"
                                    data-testid={`button-register-${event.id}`}
                                  >
                                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative z-10 flex items-center justify-center text-white">
                                      <ExternalLink className="w-3 h-3 mr-1 group-hover/btn:scale-110 transition-transform duration-300" />
                                      {t('cannResources.events.registerNow')}
                                      <div className="ml-1 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                    </div>
                                  </Button>
                                </a>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center p-3 bg-gradient-to-r from-pink-500/10 to-purple-600/10 rounded-xl border border-pink-500/30">
                              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                {t('cannResources.events.registration')}
                              </div>
                              <div className="text-sm font-semibold text-pink-600 dark:text-pink-400">
                                {event.registrationDeadline}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Calendar className="w-16 h-16 text-pink-300 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                      {t('cannResources.events.noUpcoming')}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Past Events Tab */}
            <TabsContent value="past" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pastEvents.length > 0 ? (
                  pastEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Card className="bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-xl border border-gray-200/60 dark:border-white/20 hover:border-pink-500/50 dark:hover:border-pink-500/60 hover:shadow-2xl hover:shadow-pink-500/15 transition-all duration-500 h-full group rounded-3xl overflow-hidden">
                        <div className="relative p-8 pb-6 bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-transparent">
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0 px-3 py-1 text-xs font-medium rounded-full">
                              {event.type}
                            </Badge>
                          </div>

                          <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                            <Calendar className="w-8 h-8 text-pink-500 group-hover:text-purple-500 transition-colors duration-300" />
                          </div>

                          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 leading-tight group-hover:text-pink-500 transition-colors duration-300">
                            {event.title}
                          </h3>
                        </div>

                        <CardContent className="p-8 pt-0 flex flex-col flex-1">
                          <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-pink-500/5 to-purple-600/5 rounded-xl border border-pink-500/10">
                              <Calendar className="w-5 h-5 text-pink-500 flex-shrink-0" />
                              <span className="text-sm font-medium text-gray-700 dark:text-white/80">
                                {formatEventDate(event.rawDate)}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-pink-500/5 to-purple-600/5 rounded-xl border border-pink-500/10">
                              <Clock className="w-5 h-5 text-pink-500 flex-shrink-0" />
                              <span className="text-sm font-medium text-gray-700 dark:text-white/80">
                                {event.time}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-pink-500/5 to-purple-600/5 rounded-xl border border-pink-500/10">
                              <MapPin className="w-5 h-5 text-pink-500 flex-shrink-0" />
                              <span className="text-sm font-medium text-gray-700 dark:text-white/80">
                                {event.location}
                              </span>
                            </div>
                          </div>

                          <p className="text-gray-600 dark:text-white/70 text-sm leading-relaxed mb-4 flex-grow">
                            {event.description}
                          </p>

                          {event.cmeCredits && (
                            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <Award className="w-4 h-4 text-pink-500" />
                                <span>{event.cmeCredits}</span>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Calendar className="w-16 h-16 text-pink-300 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                      {t('cannResources.events.noPast')}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Contact Section */}
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
                <Mail className="w-5 h-5 text-pink-500" />
                <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                  Get in Touch
                </span>
              </motion.div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-rosarivo mb-6">
                <span className="text-gray-900 dark:text-white">
                  Need More{" "}
                </span>
                <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  Information?
                </span>
              </h2>

              <p className="text-xl text-gray-600 dark:text-white/70 leading-relaxed mb-12">
                Contact the CANN team for additional resources, collaboration
                opportunities, or specific questions about our programs.
              </p>

              <div className="flex flex-col gap-8 items-center">
                {/* Contact CANN Section */}
                <div className="flex flex-col items-center gap-6">
                  {/* Contact CANN Button */}
                  <motion.a
                    href="mailto:CANN@amyloid.ca"
                    className="group inline-flex items-center gap-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-pink-500/25 transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    data-testid="button-contact-cann"
                  >
                    <Mail className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-xl">Contact CANN</span>
                  </motion.a>

                  {/* Email with Copy Feature */}
                  <div className="flex items-center gap-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl px-5 py-4 border border-gray-200/50 dark:border-gray-600/30 shadow-lg">
                    <span
                      className="text-gray-800 dark:text-white/90 font-medium text-lg"
                      data-testid="text-cann-email"
                    >
                      CANN@amyloid.ca
                    </span>
                    <motion.button
                      onClick={copyEmail}
                      className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-pink-500/10 to-purple-600/10 hover:from-pink-500/20 hover:to-purple-600/20 border border-pink-500/20 hover:border-pink-500/30 transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      data-testid="button-copy-cann-email"
                    >
                      {isCopied ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5 text-pink-500" />
                      )}
                    </motion.button>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>

                {/* Join CANN Button */}
                <Link href="/about-cann#join-section">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 rounded-2xl px-10 py-4 text-lg font-bold shadow-xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
                    >
                      <Users className="w-6 h-6 mr-3" />
                      Join CANN
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
