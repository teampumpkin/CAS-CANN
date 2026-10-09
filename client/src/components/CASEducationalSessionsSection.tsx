import { motion } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/** Event details card for the Dec 3, 2026 CAS Educational Sessions (same design as the Summit event card). */
export function CASEducationalSessionsCard() {
  const { t } = useLanguage();

  const details = [
    { icon: Calendar, label: t("casEduSessions.dateLabel"), value: t("casEduSessions.date") },
    { icon: Clock, label: t("casEduSessions.timeLabel"), value: t("casEduSessions.time") },
    { icon: MapPin, label: t("casEduSessions.formatLabel"), value: t("casEduSessions.format") },
  ];

  return (
    <motion.div
      className="flex justify-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      viewport={{ once: true }}
    >
      <div className="bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-gray-200/50 dark:border-white/20 shadow-2xl max-w-4xl w-full">
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 font-rosarivo">
            {t("eventsPage.eventDetails")}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {details.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-[#00DD89]/10 to-[#00AFE6]/10 rounded-2xl border border-[#00DD89]/20"
              >
                <Icon className="w-8 h-8 text-[#00DD89]" />
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500 dark:text-white/60 mb-1">{label}</p>
                  <p className="text-gray-800 dark:text-white font-semibold">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-gray-600 dark:text-white/70 mb-6 leading-relaxed text-lg">
            {t("casEduSessions.description")}
          </p>
          <p className="text-gray-800 dark:text-white font-semibold text-lg mb-6">
            {t("casEduSessions.welcome")}
          </p>
          <p className="text-sm text-gray-500 dark:text-white/60">
            {t("casEduSessions.registration")}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/** Homepage section announcing the CAS Educational Sessions. */
export default function CASEducationalSessionsSection() {
  const { t } = useLanguage();

  return (
    <section className="relative py-10 lg:py-16 bg-gradient-to-br from-[#00AFE6]/5 via-white to-[#00DD89]/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-[#00AFE6]/30 dark:border-white/20 rounded-full px-6 py-3 shadow-lg shadow-[#00AFE6]/10 mb-6">
            <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full animate-pulse"></div>
            <span className="text-gray-900 dark:text-white/90 font-medium tracking-wide">
              {t("casEduSessions.badge")}
            </span>
          </div>
          <h2 className="crawford-section-title">
            <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
              {t("casEduSessions.title")}
            </span>
          </h2>
        </motion.div>

        <CASEducationalSessionsCard />
      </div>
    </section>
  );
}
