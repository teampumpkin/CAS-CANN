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
  Award,
  Newspaper,
  X,
  ChevronRight,
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
import cannLogoImg from "@assets/CAN_logo_1768484961432.png";
import summitImage1 from "@assets/summit_image_1_1768484961432.png";
import summitImage2 from "@assets/summit_image_2_1768484961431.png";
import summitImage3 from "@assets/summit_image_3_1768484961431.png";
import summitPosterImg from "@assets/summit_poster_1768484961427.png";
// Newsletter 2 images
import cannLogoDarkImg from "@assets/cann_rgb_dark_theme_1756219144378_dhmf_rl6_zc_v5_1553680000000_1768487481003.png";
import summit2025Photo1 from "@assets/6110ba86_43ba_413c_9bf7_00e4a1ce8c19_zc_v3_1553680000000116018_1768487481005.jpg";
import summit2025Photo2 from "@assets/d33be37a_54c0_47a5_891b_f018d610f554_zc_v3_1553680000000116018_1768487481005.jpg";
import summit2025Photo3 from "@assets/2d226423_9ba2_4a2b_b87c_05bf881cd89a_zc_v3_1553680000000116018_1768487481005.jpg";
import casLogoImg from "@assets/1767774519236_1_zc_v1_1553680000000116018_1768487481006.jpeg";

// Journal Club Sessions Data
const journalClubSessions = [
  {
    rawDate: "2025-09-25",
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
    topics: [
      {
        title: "Is it really hATTR?",
        presenter: "Dr. Gord Jewett, University of Calgary",
      },
      { title: "Topic To Be Announced", presenter: "TBD, Queen's University" },
    ],
  },
];

// Single source of truth for all events
const allEvents = [
  {
    id: 1,
    title: "Canadian Amyloidosis Summit",
    date: "2026-10-15",
    displayDate: "Fall 2026 – date TBD",
    time: "TBD",
    location: "TBD",
    type: "In-person & Virtual",
    description:
      "This annual educational conference is jointly hosted by the CAS and Transthyretin Amyloidosis Canada (TAC). The Summit unites both amyloidosis healthcare professionals and patients with accredited scientific sessions for professionals and dedicated sessions for patients/caregivers.",
    image: summitSaveTheDateImg,
    registrationUrl: "",
    isFeatured: true,
    isComingSoon: true,
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
  {
    id: 4,
    title: "CAS Journal Club - February Session",
    date: "2026-02-26",
    time: "3:00 PM - 4:00 PM MST",
    location: "Virtual Event",
    type: "Journal Club",
    description:
      "One-hour virtual session focusing on amyloidosis clinical case-based presentations and scientific updates.",
    image: "/api/placeholder/400/250",
    registrationUrl: "#",
    requiresMembershipCTA: true,
    membershipType: "CAS",
    topics: [
      {
        title: "Is it really hATTR?",
        presenter: "Dr. Gord Jewett, University of Calgary",
      },
      { title: "Topic To Be Announced", presenter: "TBD, Queen's University" },
    ],
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
    registrationUrl: "",
  },
];

// Newsletter Data
const newsletters = [
  {
    id: 1,
    title: "CAS Newsletter - Summer 2025",
    date: "2025-06-15",
    thumbnail: "/api/placeholder/400/250",
    excerpt:
      "Welcome to the Canadian Amyloidosis Society! Updates on the 2025 Summit, Journal Club, research fellowships, and the latest from the world of amyloidosis.",
    content: {
      intro: `Welcome to the Canadian Amyloidosis Society (CAS)!   The CAS was launched in October 2024 at the Canadian Amyloidosis Summit, and is a multidisciplinary medical organization dedicated to serving healthcare professionals who provide amyloidosis care within Canada. We are proud to announce that the CAS has over 180 members from across Canada, representing multiple different medical specialties and disciplines providing amyloid patient care! We are excited to announce that our website is nearing completion and will provide a separate announcement when it is officially launched. The website will have a new and updated registration link for new members wishing to join the CAS available shortly. Registration is free! As an important objective of the CAS, we are creating a map of amyloid services across Canada and are requesting the help of our members in the hopes that they are willing to have the amyloid services they offer listed on this map. This will be displayed on our website and announced when it officially goes live.`,
      sections: [
        {
          title: "",
          content: ``,
          hasCTA: true,
          ctaText: "CAS Registration",
          ctaLink: "/join-cas",
          hasLogo: true,
          logoImage: cannLogoImg,
        },
        {
          title: "",
          content: `The Canadian Amyloidosis Nursing Network (CANN) is an affiliate of the CAS. Nurses play a critical role in the management of amyloidosis patients yet are underrepresented with respect to educational and quality improvement initiatives in this field. In recognition of this gap, CANN was formed to support awareness and education, including professional development and knowledge translation for nurses providing amyloidosis patient care. CANN offers an educational series of live webinars to its members on a variety of amyloid topics curated specifically to address the learning needs of CANN members. Please contact CANN@amyloid.ca to learn more.`,
        },
        {
          title: "TELL US WHAT YOU THINK!",
          content: `We want your feedback! As members of the Canadian amyloidosis community, we want your help in shaping and growing the CAS. We are open to all questions, feedback, and ideas for ongoing or new initiatives. We also want to showcase our accomplishments. If you have updates or announcements you would like highlighted in our Newsletter, please let us know. Please contact us at CAS@amyloid.ca.`,
        },
        {
          title: "EVENTS",
          isHeader: true,
        },
        {
          title: "Canadian Amyloidosis Summit",
          content: `We are again excited to cohost the third annual Canadian Amyloidosis Summit, in partnership with Transthyretin Amyloidosis Canada (TAC), our national patient support organization. The Canadian Amyloidosis Summit will be held in Toronto, October 31 to November 2, 2025. It will again be a combined healthcare professional and patient/caregiver event, with dedicated sessions offered for each group of attendees. Continuing Medical Education (CME) accreditation again will be available for healthcare professionals attending. Attendance will again be free and offered both in person and virtual. The Canadian Amyloidosis Summit 2025 is again welcoming abstract submissions from amyloidosis researchers attending. Please consider submitting your abstract when registering to attend. Abstracts submissions are accepted on all topics related to amyloidosis research and the only requirement for submission is registering to attend. Abstracts that are accepted will be presented in poster format. Those attending may also present their abstract on behalf of their research team (student, trainee, supervisor).

Note: All members of CAS and CANN are invited to attend the first Annual General Meeting for the CAS at the Canadian Amyloidosis Summit on Saturday, November 1st at 4:00 EST, Toronto Airport Marriot, room TBA, virtual attendance available.`,
          hasThreeImages: true,
          threeImages: [summitImage1, summitImage2, summitImage3],
          hasBannerImage: true,
          bannerImage: summitPosterImg,
        },
        {
          title: "CAS Journal Club Webinar",
          content: `The CAS held its first virtual Journal Club Webinar in May 2025. Two very interesting case presentations were made, one by Dr. Victor Jimenez Zepeda (haematologist in Calgary) and the other by Dr. François Tournoux (cardiologist in Montreal). Our next journal club webinar will be held on Thursday, September 25, 2025, at 5 PM EST. We will again present two interesting cases and have time for discussion, as well as a brief update on other CAS activities. The virtual link to join has been circulated to members. Please join us for this exciting event!`,
        },
        {
          title: "OPPORTUNITIES",
          isHeader: true,
        },
        {
          title:
            "Amyloidosis Research Consortium (ARC) Clinical Fellowship Award Program - 2026 applications now open",
          content: `This Program is developing the next generation of leaders in amyloidosis care and research. The program funds one-year fellowships at leading U.S. and Canadian amyloidosis centers with ️up to 10 fellows funded. The award program focuses on: Clinical Care, Multi-Disciplinary Collaboration, Research Participation, and Health Equity. This fellowship is an opportunity to broaden expertise, collaborate with top specialists, and make a lasting impact on patient care and outcomes. Apply here: https://arci.org/fellowship/`,
        },
        {
          title:
            "International Society of Amyloidosis (ISA) Amyloidosis Fellowship Program - Call for applications for ISA 2026-2027 Fellowships is now open",
          content: `Applications for ISA 2026-2027 Fellowships is now open ISA awards a limited number of amyloidosis fellowships each year, with a focus on clinical training in all types of amyloidosis. The number of fellowships will depend on funds available. Apply here: https://www.isaamyloidosis.org/fellowships/`,
        },
        {
          title: "UPDATES FROM THE WORLD OF AMYLOIDOSIS",
          isHeader: true,
        },
        {
          title:
            "Phase 3 Clinical Trial of Anselamimab in AL Amyloidosis Fails to Meet Primary Endpoint:",
          content: `Alexion, AstraZeneca Rare Disease, has announced that the Phase 3 CARES clinical trial did not meet its main goal. Anselamimab did not show a statistically significant improvement in survival during the study period. The goal of the CARES study was to find out if the investigational drug anselamimab could help newly diagnosed AL amyloidosis patients live longer. Sadly, the drug did not show a significant benefit during the study period. Though this main goal of the trial was not met, anselamimab was considered generally safe and well-tolerated.`,
        },
        {
          title:
            "Phase 3 Clinical Trial of Birtmamimab in AL Amyloidosis Fails to Meet Primary Endpoint:",
          content: `Prothena Biosciences has announced that the Phase 3 AFFIRM-AL clinical trial evaluating birtamimab in patients with Mayo Stage IV AL amyloidosis has failed to meet its primary endpoint. This announcement means that treatment with birtamimab did not significantly prolong survival within the duration of the study, based on the data collected and analyzed as part of the study. The company also announced neither of the secondary endpoints were met (6-minute walk test distance and Short Form-36 version 2 Physical Component Score). Birtamimab development will be discontinued, including stopping the open label extension of the AFFIRM-AL clinical trial.`,
        },
        {
          title:
            "5th Annual International Amyloidosis Meeting for Patients and Doctors, September 25-26, 2025, Baveno, Italy",
          content: `The International ATTR Amyloidosis Meeting for Patients and Doctors is a highly anticipated event in the amyloidosis community. This meeting brings together patients, caregivers, families, scientists, doctors, and other healthcare providers to learn about the latest developments in the field. The hybrid format of the event ensures that it is accessible to a wider audience, allowing participants from around the world to join virtually. This approach promotes inclusivity and enables the exchange of insights regardless of geographical constraints. To facilitate the access, simultaneous translation will be offered for the patients' program. Find out more at: https://attr2025.com/`,
        },
      ],
    },
  },
  {
    id: 2,
    title: "CAS Newsletter - January 2026",
    date: "2026-01-15",
    thumbnail: "/api/placeholder/400/250",
    excerpt:
      "Updates from the 2025 Canadian Amyloidosis Summit, Journal Club sessions, CANN events, and the latest news from the world of amyloidosis.",
    content: {
      intro: ``,
      sections: [
        {
          title: "",
          content: ``,
          hasLogo: true,
          logoImage: casLogoImg,
        },
        {
          title: "EVENTS",
          isHeader: true,
        },
        {
          title: "Canadian Amyloidosis Summit 2025",
          content: `In partnership with Transthyretin Amyloidosis Canada (TAC), the Canadian Amyloidosis Summit was held in Toronto the weekend of November 1-2, 2025, with over 120 people attending. This hybrid event featured parallel sessions for both healthcare providers and patients/families, with CME accreditation for healthcare provider sessions. The Summit featured interesting presentations and panel discussions from many national and internationally recognized leaders from the amyloidosis community. The CAS also held its first Annual General Meeting (AGM) at the Summit. Planning for the 2026 Canadian Amyloidosis Summit next fall is already underway. Stay tuned for future updates and hope you can join us!`,
          hasThreeImages: true,
          threeImages: [summit2025Photo1, summit2025Photo2, summit2025Photo3],
        },
        {
          title: "CAS Journal Club",
          content: `CAS Journal Club continues with quarterly virtual presentations featuring interesting amyloidosis cases from across Canada. The November 2025 CAS journal club included great case discussions presented by Dr. Janine Mazengarb from the University of British Columbia and Dr. Rajin Choudhury from the University of Calgary.

Next Session: February 26th at 5-6 PM EST
Presenters to be announced.

All CAS members are welcome to join; the Zoom link will be sent by e-mail to all members in advance.`,
          hasCTA: true,
          ctaText: "More details at amyloid.ca/journal-club",
          ctaLink: "/journal-club",
        },
        {
          title: "Canadian Amyloidosis Nursing Network",
          content: `CANN is pleased to invite members to the following upcoming events:`,
          hasLogo: true,
          logoImage: cannLogoDarkImg,
        },
        {
          title: "CANN Townhall: January 22, 2026",
          content: `Join us for a virtual ideation workshop. This professionally facilitated round table discussion is designed for members to connect and share ideas. Registration is OPEN!`,
        },
        {
          title: "CANN Educational Series: February 18, 2026",
          content: `Join us to deepen understanding surrounding the role of PYP scans in the management of amyloidosis.`,
        },
        {
          title: "UPDATES FROM THE WORLD OF AMYLOIDOSIS",
          isHeader: true,
        },
        {
          title: "Health Canada Notice of Compliance for Vutrisiran",
          content: `In December 2025, Health Canada provided the Notice of Compliance for vutrisiran (Amvuttra, Alnylam Pharmaceuticals) for the treatment of wild-type or hereditary transthyretin-mediated amyloidosis cardiomyopathy. The approval broadens the indication for vutrisiran, from its existing indication for the treatment Stage 1 or stage 2 polyneuropathy in patients with hereditary transthyretin-mediated amyloidosis.`,
        },
        {
          title: "MAGNITUDE Clinical Trial Enrollment Placed on Hold",
          content: `On October 27, 2025, Intellia Therapeutics paused enrollment in its MAGNITUDE clinical trial after one participant experienced severe elevations in liver transaminases, meeting the study's pre-defined safety criteria. The participant was hospitalized and sadly passed away from complications of acute liver failure. Subsequently, the U.S. FDA placed the trial on clinical hold. The MAGNITUDE (NCT06128629) trial is evaluating nexiguran ziclumeran (nex-z) for the treatment of ATTR cardiomyopathy using CRISPR/Cas9 technology.`,
        },
        {
          title: "International Symposium on Amyloidosis",
          content: `The International Society of Amyloidosis (ISA) will be holding its international symposium November 15-18, 2026, in beautiful Montevideo, Uruguay. For more details and to register for this exciting event please visit the ISA website: isaamyloidosis.org`,
        },
      ],
    },
  },
];

// MST Timezone constant (America/Edmonton handles MST/MDT automatically)
const MST_TIMEZONE = "America/Edmonton";

// Helper to get current date in MST timezone
const getMSTDate = (): Date => {
  const now = new Date();
  const mstDateStr = now.toLocaleDateString("en-CA", {
    timeZone: MST_TIMEZONE,
  });
  const [year, month, day] = mstDateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

// Helper function to parse event date and compare with today in MST
const isEventPast = (dateString: string): boolean => {
  const [year, month, day] = dateString.split("-").map(Number);
  const eventDate = new Date(year, month - 1, day);
  const todayMST = getMSTDate();
  return eventDate < todayMST;
};

// Helper to parse date string for sorting (timezone-independent for date-only comparisons)
const parseLocalDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

// Helper function to categorize events dynamically
const categorizeEvents = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const featured = allEvents.filter(
    (event) => event.isFeatured && !isEventPast(event.date),
  );
  // Include ALL upcoming events (including featured ones) in the upcoming tab
  const upcoming = allEvents.filter((event) => !isEventPast(event.date));
  const past = allEvents.filter((event) => isEventPast(event.date));

  // Sort upcoming events by date (soonest first) - using local date parsing
  upcoming.sort((a, b) => {
    const dateA = parseLocalDate(a.date);
    const dateB = parseLocalDate(b.date);
    return dateA.getTime() - dateB.getTime();
  });

  // Sort past events by date (most recent first) - using local date parsing
  past.sort((a, b) => {
    const dateA = parseLocalDate(a.date);
    const dateB = parseLocalDate(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  return { featured, upcoming, past };
};

export default function Events() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [journalClubTab, setJournalClubTab] = useState("upcoming");
  const [summitTab, setSummitTab] = useState("upcoming");
  const [selectedNewsletter, setSelectedNewsletter] = useState<
    (typeof newsletters)[0] | null
  >(null);

  // Dynamically categorize events based on current date
  const {
    featured: featuredEvents,
    upcoming: upcomingEvents,
    past: pastEvents,
  } = categorizeEvents();

  // Categorize Journal Club sessions
  const upcomingJournalClubSessions = journalClubSessions
    .filter((session) => !isEventPast(session.rawDate))
    .sort(
      (a, b) =>
        parseLocalDate(a.rawDate).getTime() -
        parseLocalDate(b.rawDate).getTime(),
    );

  const pastJournalClubSessions = journalClubSessions
    .filter((session) => isEventPast(session.rawDate))
    .sort(
      (a, b) =>
        parseLocalDate(b.rawDate).getTime() -
        parseLocalDate(a.rawDate).getTime(),
    );

  // Categorize Summit events (type === "Summit" or "In-person & Virtual")
  const upcomingSummitEvents = allEvents
    .filter(
      (event) =>
        (event.type === "Summit" || event.type === "In-person & Virtual") &&
        !isEventPast(event.date),
    )
    .sort(
      (a, b) =>
        parseLocalDate(a.date).getTime() - parseLocalDate(b.date).getTime(),
    );

  const pastSummitEvents = allEvents
    .filter(
      (event) =>
        (event.type === "Summit" || event.type === "In-person & Virtual") &&
        isEventPast(event.date),
    )
    .sort(
      (a, b) =>
        parseLocalDate(b.date).getTime() - parseLocalDate(a.date).getTime(),
    );

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

  // Format date to "Thursday, September 25th, 2025" in MST timezone
  const formatEventDate = (dateString: string): string => {
    // Guard against empty or invalid date strings
    if (!dateString) return "TBD";

    // Check if it's a valid YYYY-MM-DD format
    const parts = dateString.split("-").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) {
      return dateString; // Return as-is if not ISO format
    }

    const [year, month, day] = parts;

    // Create a date that represents this date in MST
    // Use noon to avoid any edge cases with daylight saving
    const dateForFormatting = new Date(
      Date.UTC(year, month - 1, day, 18, 0, 0),
    ); // 18:00 UTC = noon MST

    // Validate the date is valid
    if (isNaN(dateForFormatting.getTime())) {
      return dateString;
    }

    // Format using MST timezone
    const dayName = dateForFormatting.toLocaleDateString("en-US", {
      weekday: "long",
      timeZone: MST_TIMEZONE,
    });
    const monthName = dateForFormatting.toLocaleDateString("en-US", {
      month: "long",
      timeZone: MST_TIMEZONE,
    });
    const dayNumber = parseInt(
      dateForFormatting.toLocaleDateString("en-US", {
        day: "numeric",
        timeZone: MST_TIMEZONE,
      }),
    );
    const yearNumber = parseInt(
      dateForFormatting.toLocaleDateString("en-US", {
        year: "numeric",
        timeZone: MST_TIMEZONE,
      }),
    );
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
              {t("eventsPage.badge")}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 font-rosarivo"
          >
            <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
              {t("eventsPage.title.events")}
            </span>
            <br />
            <span className="text-gray-800 dark:text-white">
              {t("eventsPage.title.education")}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            {t("eventsPage.description")}
          </motion.p>
        </div>
      </section>

      {/* Section 5: Featured Event Section */}
      <section id="summit" className="py-24 bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-white/10 relative overflow-hidden">
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
                  {t("eventsPage.featuredEvent")}
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
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                  {t("eventsPage.comingSoon")}
                </span>
              </motion.div>
            </div>

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

          {/* Summit Tabs */}
          <div className="flex justify-center mb-8 mt-12 overflow-x-auto pb-2">
            <div className="bg-gradient-to-r from-gray-100/80 to-blue-100/60 dark:bg-white/5 backdrop-blur-xl border border-[#00AFE6]/20 dark:border-white/20 rounded-2xl p-1 sm:p-2 shadow-2xl inline-flex min-w-max">
              <button
                onClick={() => setSummitTab("upcoming")}
                className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base whitespace-nowrap ${
                  summitTab === "upcoming"
                    ? "bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white shadow-lg"
                    : "text-gray-600 dark:text-white/80 hover:text-gray-800 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/10"
                }`}
              >
                {t("eventsPage.upcomingEvents")}
              </button>
              <button
                onClick={() => setSummitTab("past")}
                className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base whitespace-nowrap ${
                  summitTab === "past"
                    ? "bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white shadow-lg"
                    : "text-gray-600 dark:text-white/80 hover:text-gray-800 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/10"
                }`}
              >
                {t("eventsPage.pastEvents")}
              </button>
            </div>
          </div>

          {/* Upcoming Events - Event Details Card */}
          {summitTab === "upcoming" && (
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

          {/* Past Summit Events */}
          {summitTab === "past" && (
              <div>
                {pastSummitEvents.length > 0 ? (
                  <div
                    className={`grid gap-6 ${
                      pastSummitEvents.length === 1
                        ? "grid-cols-1 max-w-2xl mx-auto"
                        : pastSummitEvents.length === 2
                          ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
                          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    }`}
                  >
                    {pastSummitEvents.map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="h-full"
                      >
                        <Card className="bg-gradient-to-br from-gray-100/95 to-gray-200/95 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-xl border border-gray-300/60 dark:border-gray-600/40 transition-all duration-500 h-full flex flex-col rounded-3xl overflow-hidden opacity-70">
                          {/* Header Section */}
                          <div className="relative p-6 bg-gradient-to-br from-gray-200/50 via-gray-100/30 to-transparent dark:from-gray-700/30 dark:via-gray-800/20 dark:to-transparent">
                            <div className="flex justify-between items-start mb-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-gray-300/50 to-gray-400/30 dark:from-gray-600/50 dark:to-gray-700/30 rounded-2xl flex items-center justify-center">
                                <Award className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                              </div>
                              <Badge className="bg-gray-400 dark:bg-gray-600 text-white border-0 px-2 py-1 text-xs font-medium rounded">
                                {event.type}
                              </Badge>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 leading-snug">
                              {event.title}
                            </h3>
                          </div>

                          {/* Content Section */}
                          <CardContent className="p-6 pt-4 flex flex-col flex-1">
                            {/* Event Details */}
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span>
                                  {(event as any).displayDate ||
                                    formatEventDate(event.date)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span>{event.location}</span>
                              </div>
                            </div>

                            {/* Description */}
                            <p className="text-gray-400 dark:text-gray-500 text-sm leading-relaxed flex-1">
                              {event.description}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
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
                      <Award className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                      No Past Summit Events
                    </h3>
                    <p className="text-gray-600 dark:text-white/70 max-w-md mx-auto">
                      Past summit events will appear here after they conclude.
                    </p>
                  </motion.div>
                )}
              </div>
          )}
        </div>
      </section>

      {/* CAS Journal Club Section */}
      <section id="journal-club" className="py-24 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-white/10 relative overflow-hidden">
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
                {t("eventsPage.journalClubBadge")}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-rosarivo mb-6 leading-tight">
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                CAS Journal Club
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-white/70 max-w-3xl mx-auto leading-relaxed px-4">
              {t("eventsPage.journalClubDescription")}
            </p>
            <Link href="/journal-club">
              <Button className="mt-6 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/90 hover:to-[#00DD89]/90 text-white font-semibold px-6 py-3 rounded-xl shadow-lg">
                {t("eventsPage.viewFullSchedule")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>

          {/* Journal Club Tabs */}
          <div className="flex justify-center mb-6 sm:mb-8 overflow-x-auto pb-2">
            <div className="bg-gradient-to-r from-gray-100/80 to-blue-100/60 dark:bg-white/5 backdrop-blur-xl border border-[#00AFE6]/20 dark:border-white/20 rounded-2xl p-1 sm:p-2 shadow-2xl inline-flex min-w-max">
              <button
                onClick={() => setJournalClubTab("upcoming")}
                className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base whitespace-nowrap ${
                  journalClubTab === "upcoming"
                    ? "bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white shadow-lg"
                    : "text-gray-600 dark:text-white/80 hover:text-gray-800 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/10"
                }`}
              >
                {t("eventsPage.upcomingEvents")}
              </button>
              <button
                onClick={() => setJournalClubTab("past")}
                className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base whitespace-nowrap ${
                  journalClubTab === "past"
                    ? "bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white shadow-lg"
                    : "text-gray-600 dark:text-white/80 hover:text-gray-800 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/10"
                }`}
              >
                {t("eventsPage.pastEvents")}
              </button>
            </div>
          </div>

          {/* Journal Club Sessions Grid */}
          <div className="max-w-6xl mx-auto">
            <div
              className={`grid gap-6 ${
                (journalClubTab === "upcoming"
                  ? upcomingJournalClubSessions
                  : pastJournalClubSessions
                ).length === 1
                  ? "grid-cols-1 max-w-md mx-auto"
                  : (journalClubTab === "upcoming"
                        ? upcomingJournalClubSessions
                        : pastJournalClubSessions
                      ).length === 2
                    ? "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto"
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {(journalClubTab === "upcoming"
                ? upcomingJournalClubSessions
                : pastJournalClubSessions
              ).map((session, index) => {
                const isPast = isEventPast(session.rawDate);
                // Get month name for session title
                const sessionDate = parseLocalDate(session.rawDate);
                const monthName = sessionDate.toLocaleDateString("en-US", {
                  month: "long",
                  timeZone: MST_TIMEZONE,
                });

                return (
                  <motion.div
                    key={session.rawDate}
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
                            <Calendar
                              className={`w-8 h-8 ${isPast ? "text-gray-400" : "text-[#00AFE6]"}`}
                            />
                          </div>
                          <Badge
                            className={`${isPast ? "bg-gray-400" : "bg-gradient-to-r from-[#00AFE6] to-[#00DD89]"} text-white border-0 px-2 py-1 text-xs font-medium rounded`}
                          >
                            Journal Club
                          </Badge>
                        </div>
                        <h3
                          className={`text-xl font-semibold leading-snug ${isPast ? "text-gray-500 dark:text-gray-400" : "text-gray-800 dark:text-white"}`}
                        >
                          CAS Journal Club - {monthName} Session
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
                            <span>{formatEventDate(session.rawDate)}</span>
                          </div>
                          <div
                            className={`flex items-center gap-2 text-sm ${isPast ? "text-gray-400" : "text-gray-600 dark:text-white/70"}`}
                          >
                            <Clock
                              className={`w-4 h-4 ${isPast ? "text-gray-400" : "text-[#00AFE6]"}`}
                            />
                            <span>3:00 PM - 4:00 PM MST</span>
                          </div>
                          <div
                            className={`flex items-center gap-2 text-sm ${isPast ? "text-gray-400" : "text-gray-600 dark:text-white/70"}`}
                          >
                            <MapPin
                              className={`w-4 h-4 ${isPast ? "text-gray-400" : "text-[#00AFE6]"}`}
                            />
                            <span>Virtual Event</span>
                          </div>
                        </div>

                        {/* Topics Section */}
                        {session.topics && (
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
                            {session.topics.map((topic, idx) => (
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
                          One-hour virtual session focusing on amyloidosis
                          clinical case-based presentations and scientific
                          updates.
                        </p>

                        {/* CTA Section */}
                        {!isPast && (
                          <div className="text-center p-3 bg-gradient-to-r from-[#00AFE6]/15 to-[#00DD89]/15 rounded-xl border border-[#00AFE6]/40 shadow-md shadow-[#00AFE6]/10 relative overflow-hidden space-y-2">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#00AFE6]/5 to-[#00DD89]/5 opacity-50 animate-pulse"></div>
                            <div className="relative z-10">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <div className="w-1.5 h-1.5 bg-[#00AFE6] rounded-full animate-pulse"></div>
                                <p className="text-sm font-semibold text-[#00AFE6] dark:text-[#00AFE6]">
                                  {t("eventsPage.registrationNotRequired")}
                                </p>
                                <div className="w-1.5 h-1.5 bg-[#00AFE6] rounded-full animate-pulse"></div>
                              </div>
                              <p className="text-xs font-medium text-gray-700 dark:text-white/80 mb-2">
                                {t("eventsPage.zoomDetailsCAS")}
                              </p>
                              <Button
                                onClick={() =>
                                  (window.location.href = "/join-cas")
                                }
                                className="bg-[#00DD89] hover:bg-[#00DD89]/90 text-gray-800 border border-[#00DD89] hover:border-[#00DD89]/90 shadow-lg hover:shadow-xl hover:shadow-[#00DD89]/25 transition-all duration-300 group/btn py-2 px-6 rounded-lg font-semibold text-xs relative overflow-hidden"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#00DD89]/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative z-10 flex items-center justify-center text-gray-800">
                                  <Users className="w-3 h-3 mr-1 group-hover/btn:scale-110 transition-transform duration-300 text-gray-800" />
                                  Join CAS
                                  <div className="ml-1 w-1.5 h-1.5 bg-gray-800 rounded-full animate-pulse"></div>
                                </div>
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CANN Events Section */}
      <section id="cann-events" className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-gray-50/80 to-white/80 dark:from-gray-800/80 dark:to-gray-900/80 relative overflow-hidden">
        {/* Background Elements */}
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
              {/* Header Badge */}
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

              <Link href="/cann-resources">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 rounded-xl sm:rounded-2xl px-5 sm:px-8 md:px-10 py-3 sm:py-4 md:py-6 text-sm sm:text-base md:text-xl font-bold shadow-xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 group w-full sm:w-auto"
                    data-testid="button-view-cann-events"
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

      {/* News Section */}
      <section id="news" className="py-12 sm:py-16 md:py-24 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-white/10 relative overflow-hidden">
        {/* Frost Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-transparent to-cyan-100/20 dark:from-gray-800/30 dark:via-transparent dark:to-gray-700/20"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00AFE6]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#00DD89]/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 backdrop-blur-xl border border-[#00AFE6]/20 rounded-full px-6 py-3 mb-8 shadow-lg">
              <Newspaper className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-gray-800 dark:text-white/90 font-medium">
                News & Updates
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-rosarivo mb-6 leading-tight">
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                CAS Newsletter
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-white/70 max-w-3xl mx-auto leading-relaxed px-4">
              Stay informed with the latest updates, announcements, and news
              from the Canadian Amyloidosis Society.
            </p>
          </motion.div>

          {/* Newsletter Cards Grid */}
          <div
            className={`grid gap-6 ${
              newsletters.length === 1
                ? "grid-cols-1 max-w-2xl mx-auto"
                : newsletters.length === 2
                  ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {newsletters.map((newsletter, index) => (
              <motion.div
                key={newsletter.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <Card
                  className="bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-xl border border-gray-200/60 dark:border-white/20 hover:border-[#00AFE6]/50 dark:hover:border-[#00AFE6]/60 hover:shadow-2xl hover:shadow-[#00AFE6]/15 transition-all duration-500 h-full flex flex-col rounded-3xl overflow-hidden group cursor-pointer"
                  onClick={() => setSelectedNewsletter(newsletter)}
                >
                  {/* Header Section */}
                  <div className="relative p-6 bg-gradient-to-br from-[#00AFE6]/10 via-[#00DD89]/5 to-transparent">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#00AFE6]/20 to-[#00DD89]/20 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <Newspaper className="w-8 h-8 text-[#00AFE6] group-hover:text-[#00DD89] transition-colors duration-300" />
                      </div>
                      <Badge className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white border-0 px-2 py-1 text-xs font-medium rounded">
                        Newsletter
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white leading-snug group-hover:text-[#00AFE6] transition-colors duration-300">
                      {newsletter.title}
                    </h3>
                  </div>

                  {/* Content Section */}
                  <CardContent className="p-6 pt-4 flex flex-col flex-1">
                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/70 mb-4">
                      <Calendar className="w-4 h-4 text-[#00AFE6]" />
                      <span>{formatEventDate(newsletter.date)}</span>
                    </div>

                    {/* Excerpt */}
                    <p className="text-gray-600 dark:text-white/70 text-sm leading-relaxed flex-1 mb-4">
                      {newsletter.excerpt}
                    </p>

                    {/* Read More CTA */}
                    <div className="text-center p-3 bg-gradient-to-r from-[#00AFE6]/15 to-[#00DD89]/15 rounded-xl border border-[#00AFE6]/40 shadow-md shadow-[#00AFE6]/10 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#00AFE6]/5 to-[#00DD89]/5 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10 flex items-center justify-center gap-2 text-[#00AFE6] font-semibold text-sm">
                        <span>Read Full Newsletter</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Modal */}
      {selectedNewsletter && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/60 backdrop-blur-sm overflow-y-auto"
          onClick={() => setSelectedNewsletter(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-3xl max-w-4xl w-full max-h-[85vh] my-auto overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative p-6 sm:p-8 bg-gradient-to-br from-[#00AFE6]/10 via-[#00DD89]/5 to-transparent border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setSelectedNewsletter(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00AFE6]/20 to-[#00DD89]/20 rounded-xl flex items-center justify-center">
                  <Newspaper className="w-6 h-6 text-[#00AFE6]" />
                </div>
                <Badge className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white border-0 px-3 py-1 text-xs font-medium rounded">
                  Newsletter
                </Badge>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2 pr-12">
                {selectedNewsletter.title}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/70">
                <Calendar className="w-4 h-4 text-[#00AFE6]" />
                <span>{formatEventDate(selectedNewsletter.date)}</span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Intro */}
              <p className="text-gray-700 dark:text-white/80 text-base leading-relaxed mb-8">
                {selectedNewsletter.content.intro}
              </p>

              {/* Sections */}
              <div className="space-y-6">
                {selectedNewsletter.content.sections.map((section, index) =>
                  (section as any).isHeader ? (
                    <div key={index} className="mt-8 mb-4">
                      <h2 className="text-2xl font-bold text-[#00AFE6] dark:text-[#00AFE6] border-b-2 border-[#00AFE6]/30 pb-2">
                        {section.title}
                      </h2>
                    </div>
                  ) : (
                    <div
                      key={index}
                      className={
                        section.title ? "border-l-4 border-[#00AFE6] pl-6" : ""
                      }
                    >
                      {(section as any).hasLogo &&
                        (section as any).logoImage && (
                          <div className="mb-4 flex justify-center">
                            <img
                              src={(section as any).logoImage}
                              alt="CANN Logo"
                              className="max-w-xs h-auto"
                            />
                          </div>
                        )}
                      {(section as any).hasThreeImages &&
                        (section as any).threeImages && (
                          <div className="mb-4 grid grid-cols-3 gap-3">
                            {(section as any).threeImages.map(
                              (img: string, imgIndex: number) => (
                                <img
                                  key={imgIndex}
                                  src={img}
                                  alt={`Summit image ${imgIndex + 1}`}
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                              ),
                            )}
                          </div>
                        )}
                      {section.title && (
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
                          {section.title}
                        </h3>
                      )}
                      {section.content && (
                        <div className="text-gray-600 dark:text-white/70 text-sm leading-relaxed whitespace-pre-line">
                          {section.content.split("**").map((part, i) =>
                            i % 2 === 1 ? (
                              <strong
                                key={i}
                                className="text-gray-800 dark:text-white"
                              >
                                {part}
                              </strong>
                            ) : (
                              part
                            ),
                          )}
                        </div>
                      )}
                      {(section as any).hasBannerImage &&
                        (section as any).bannerImage && (
                          <div className="mt-4 mb-4">
                            <img
                              src={(section as any).bannerImage}
                              alt="Summit Banner"
                              className="w-full h-auto rounded-lg shadow-md"
                            />
                          </div>
                        )}
                      {(section as any).hasCTA && (
                        <div className="mt-4">
                          <Button
                            onClick={() =>
                              (window.location.href = (section as any).ctaLink)
                            }
                            className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/90 hover:to-[#00DD89]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-2 px-6 rounded-lg font-semibold text-sm"
                          >
                            {(section as any).ctaText}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>

              {/* Contact CTA */}
              <div className="mt-8 p-6 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 rounded-2xl border border-[#00AFE6]/20">
                <p className="text-center text-gray-700 dark:text-white/80">
                  Have questions or feedback? Contact us at{" "}
                  <a
                    href="mailto:CAS@amyloid.ca"
                    className="text-[#00AFE6] hover:underline font-semibold"
                  >
                    CAS@amyloid.ca
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
