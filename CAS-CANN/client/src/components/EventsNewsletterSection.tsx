import { motion } from "framer-motion";
import {
  Calendar,
  Mail,
  Video,
  Heart,
  Users,
  ArrowRight,
  UserCheck,
  Globe,
  Star,
  MapPin,
  Stethoscope,
  GraduationCap,
  Building2,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import casLogo from "@assets/l_cas_vert_rgb_1753253116732.png";

export default function EventsNewsletterSection() {
  const { t } = useLanguage();
  const events = [
    {
      icon: Users,
      titleKey: "events.summit.title",
      descriptionKey: "events.summit.description",
      dateKey: "events.summit.date",
      gradient: "from-[#00AFE6] to-[#0088CC]",
      bgGradient: "from-[#00AFE6]/15 to-[#00DD89]/15",
      typeKey: "events.summit.type",
    },
    {
      icon: Video,
      titleKey: "events.journalClub.title",
      descriptionKey: "events.journalClub.description",
      dateKey: "events.journalClub.date",
      gradient: "from-[#00DD89] to-[#00BB77]",
      bgGradient: "from-[#00AFE6]/15 to-[#00DD89]/15",
      typeKey: "events.journalClub.type",
    },
    {
      icon: Globe,
      titleKey: "events.international.title",
      descriptionKey: "events.international.description",
      dateKey: "events.international.date",
      gradient: "from-[#00AFE6] to-[#00DD89]",
      bgGradient: "from-[#00AFE6]/15 to-[#00DD89]/15",
      typeKey: "events.international.type",
    },
  ];

  return (
    <section className="relative py-10 lg:py-16 bg-gradient-to-br from-[#00AFE6]/6 via-gray-50 to-[#00DD89]/6 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Background decorative elements matching amyloidosis section style */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-[#00AFE6]/12 to-[#00DD89]/12 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-[#00DD89]/12 to-[#00AFE6]/12 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header matching amyloidosis section style */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-gray-900/10 dark:bg-white/10 backdrop-blur-sm border border-gray-900/20 dark:border-white/20 rounded-full px-6 py-3 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full"></div>
            <span className="text-gray-900 dark:text-white/90 font-medium tracking-wide">
              {t("events.badge")}
            </span>
          </motion.div>

          <h2 className="crawford-section-title mb-4">
            <span className="text-gray-900 dark:text-white">{t("events.joinCASGetInvolved").split(" ").slice(0, -2).join(" ")} </span>
            <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
              {t("events.joinCASGetInvolved").split(" ").slice(-2).join(" ")}
            </span>
          </h2>

          <p className="text-xl text-gray-700 dark:text-white/80 max-w-4xl mx-auto leading-relaxed">
            {t("events.subtitle")}
          </p>
        </motion.div>

        {/* Interactive Newsletter Card */}
        <motion.div
          className="relative mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-white/95 via-[#00AFE6]/5 to-white/95 dark:from-[#00AFE6]/10 dark:via-[#00DD89]/5 dark:to-[#00AFE6]/10 backdrop-blur-xl border border-[#00AFE6]/30 dark:border-white/20">
            {/* Animated background pattern */}
            <div className="absolute inset-0">
              <motion.div
                className="absolute inset-0 opacity-20"
                animate={{
                  background: [
                    "radial-gradient(circle at 20% 50%, #00AFE6 0%, transparent 50%)",
                    "radial-gradient(circle at 80% 50%, #00DD89 0%, transparent 50%)",
                    "radial-gradient(circle at 20% 50%, #00AFE6 0%, transparent 50%)",
                  ],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Floating particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-gray-900/30 dark:bg-white/30 rounded-full"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + (i % 2) * 40}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-6 md:gap-12 p-4 sm:p-6 md:p-8 lg:p-12">
              {/* Newsletter Signup */}
              <div className="flex flex-col justify-center">
                {/* Logo */}
                <motion.div
                  className="flex justify-center mb-4 md:mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <img
                    src={casLogo}
                    alt="Canadian Amyloidosis Society Logo"
                    className="h-12 md:h-16 w-auto drop-shadow-lg"
                  />
                </motion.div>

                <motion.div
                  className="inline-flex items-center gap-2 bg-gray-900/20 dark:bg-white/20 backdrop-blur-sm rounded-full px-3 md:px-4 py-1.5 md:py-2 mb-4 md:mb-6 w-fit mx-auto"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-2 h-2 bg-[#00DD89] rounded-full animate-pulse"></div>
                  <span className="text-gray-900 dark:text-white/90 text-xs md:text-sm font-medium">
                    {t("events.stayConnected")}
                  </span>
                </motion.div>

                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4 font-rosarivo text-center">
                  {t("events.joinCommunity")}
                </h3>
                <p className="text-gray-700 dark:text-white/80 text-sm sm:text-base md:text-lg mb-6 md:mb-8 leading-relaxed text-center px-2">
                  {t("events.accessResearch")}
                </p>

                <div className="flex justify-center">
                  <motion.a
                    href="/join-cas"
                    className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-6 sm:px-8 md:px-12 py-3 md:py-4 rounded-xl md:rounded-2xl font-semibold text-base md:text-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2 md:gap-3"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>{t("events.joinCASButton")}</span>
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </motion.a>
                </div>
              </div>

              {/* Network Overview */}
              <div className="flex flex-col justify-center h-full mt-6 lg:mt-0">
                <div className="text-center mb-6 md:mb-12">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3 font-rosarivo">
                    {t("events.growingNetwork")}
                  </h3>
                  <p className="text-sm md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed px-2">
                    {t("events.growingNetworkDesc")}
                  </p>
                </div>

                {/* Network Statistics Cards - Vertical Layout */}
                <div className="flex flex-col gap-2 sm:gap-3 max-w-md mx-auto w-full px-2 sm:px-0">
                  {[
                    {
                      value: t("events.stats.over180"),
                      label: t("events.stats.members"),
                      testId: "members-count",
                      icon: Users,
                      color: "blue"
                    },
                    {
                      value: t("events.stats.provincesCount"),
                      label: t("events.stats.provincesTerritories"), 
                      testId: "provinces-count",
                      icon: MapPin,
                      color: "green"
                    },
                    {
                      value: t("events.stats.multipleDisciplines"),
                      label: t("events.stats.disciplines"),
                      testId: "disciplines-count", 
                      icon: GraduationCap,
                      color: "teal"
                    },
                  ].map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <motion.div
                        key={stat.label}
                        className="relative group"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.6,
                          delay: index * 0.15,
                          ease: "easeOut",
                        }}
                        viewport={{ once: true }}
                        data-testid={stat.testId}
                      >
                        <motion.div
                          className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl md:rounded-3xl px-4 sm:px-6 md:px-8 py-4 md:py-6 border-2 border-gray-200/60 dark:border-gray-600/60 shadow-xl md:shadow-2xl hover:shadow-2xl md:hover:shadow-3xl transition-all duration-300"
                          whileHover={{ x: 6, scale: 1.02 }}
                        >
                          {/* Background Pattern */}
                          <div className="absolute inset-0 rounded-2xl md:rounded-3xl opacity-5 dark:opacity-10">
                            <div className="absolute inset-0" style={{
                              backgroundImage: `radial-gradient(circle at 10% 50%, ${stat.color === 'blue' ? '#00AFE6' : stat.color === 'green' ? '#00DD89' : '#00AFE6'} 0%, transparent 40%)`
                            }} />
                          </div>

                          {/* Stat Content - Prominent Design */}
                          <div className="relative z-10 flex items-center gap-3 sm:gap-4 md:gap-6">
                            {/* Icon */}
                            <div className={`p-2.5 sm:p-3 md:p-4 rounded-xl md:rounded-2xl shrink-0 ${
                              stat.color === 'blue' 
                                ? 'bg-[#00AFE6]/10 text-[#00AFE6]' 
                                : stat.color === 'green' 
                                ? 'bg-[#00DD89]/10 text-[#00DD89]' 
                                : 'bg-[#00AFE6]/10 text-[#00AFE6]'
                            }`}>
                              <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
                            </div>

                            {/* Value and Label */}
                            <div className="flex-1 min-w-0">
                              <div className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-0.5 md:mb-1 ${
                                stat.color === 'blue' 
                                  ? 'text-[#00AFE6]' 
                                  : stat.color === 'green' 
                                  ? 'text-[#00DD89]' 
                                  : 'text-[#00AFE6]'
                              } dark:text-white`}>
                                {stat.value}
                              </div>
                              <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-700 dark:text-gray-200 tracking-wide truncate">
                                {stat.label}
                              </p>
                            </div>

                            {/* Prominent Side Accent */}
                            <div className={`w-1.5 md:w-2 h-10 md:h-16 rounded-full shrink-0 ${
                              stat.color === 'blue' 
                                ? 'bg-gradient-to-b from-[#00AFE6] to-[#0088CC]' 
                                : stat.color === 'green' 
                                ? 'bg-gradient-to-b from-[#00DD89] to-[#00BB77]' 
                                : 'bg-gradient-to-b from-[#00AFE6] to-[#00DD89]'
                            } shadow-lg`} />
                          </div>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Events Timeline */}
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="text-center mb-16">
            <motion.div
              className="inline-flex items-center gap-2 bg-gray-900/10 dark:bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Calendar className="w-4 h-4 text-[#00AFE6]" />
              <span className="text-gray-900 dark:text-white/90 font-medium">
                {t("events.upcomingEvents")}
              </span>
            </motion.div>
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-rosarivo">
              {t("events.communityCalendar")}
            </h3>
            <p className="text-gray-700 dark:text-white/80 text-lg max-w-2xl mx-auto">
              {t("events.communityCalendarDesc")}
            </p>
          </div>

          {/* Events grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {events.map((event, index) => (
              <motion.div
                key={index}
                className="relative h-full"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                {/* Event card */}
                <motion.div
                  className="h-full"
                  whileHover={{ scale: 1.02, y: -6 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <div className="group relative h-full rounded-3xl p-8 border transition-all duration-500 hover:shadow-2xl bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-800 dark:via-gray-800/80 dark:to-gray-900 border-gray-200/60 dark:border-gray-700/60 hover:border-[#00AFE6]/30 dark:hover:border-[#00AFE6]/40 backdrop-blur-sm">
                    {/* Subtle gradient overlay on hover */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#00AFE6]/3 to-[#00DD89]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col h-full">
                      {/* Header with Icon and Badge */}
                      <div className="flex items-start justify-between mb-6">
                        <div
                          className={`w-16 h-16 bg-gradient-to-br ${event.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 shrink-0`}
                        >
                          <event.icon className="w-8 h-8 text-white" />
                        </div>
                        <span className="px-4 py-2 bg-gradient-to-r from-[#00AFE6] to-[#0088CC] text-white text-xs font-bold rounded-full uppercase tracking-wide shadow-md shrink-0">
                          {t(event.typeKey)}
                        </span>
                      </div>

                      {/* Title - fixed height for alignment */}
                      <h4 className="text-xl font-bold font-rosarivo leading-tight text-gray-900 dark:text-white mb-4 group-hover:text-[#00AFE6] dark:group-hover:text-[#00AFE6] transition-colors duration-300 min-h-[56px]">
                        {t(event.titleKey)}
                      </h4>

                      {/* Date - fixed height for alignment */}
                      <div className="flex items-start gap-2 text-sm font-semibold text-[#00AFE6] dark:text-[#00AFE6] mb-5 min-h-[44px]">
                        <Calendar className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{t(event.dateKey)}</span>
                      </div>

                      {/* Description */}
                      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 mb-8 flex-1 min-h-[80px]">
                        {t(event.descriptionKey)}
                      </p>

                      {/* Footer */}
                      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                        {index === 0 ? (
                          <div className="block">
                            <motion.button
                              className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-6 py-4 rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:from-[#0088CC] group-hover:to-[#00BB77]"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <span>{t("events.stayTuned")}</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                            </motion.button>
                          </div>
                        ) : index === 2 ? (
                          <a
                            href="https://www.isaamyloidosis.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <motion.button
                              className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-6 py-4 rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:from-[#0088CC] group-hover:to-[#00BB77]"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <span>{t("events.stayTuned")}</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                            </motion.button>
                          </a>
                        ) : (
                          <a href="/journal-club" className="block">
                            <motion.button
                              className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-6 py-4 rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:from-[#0088CC] group-hover:to-[#00BB77]"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <span>{t("events.joinEvent")}</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                            </motion.button>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
