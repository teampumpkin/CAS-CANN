import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import anneMarieCarrImg from "@assets/anne-marie-carr-in-memoriam.jpg";

export default function InMemoriamSection() {
  const { t } = useLanguage();

  return (
    <section className="relative py-16 lg:py-24 bg-gray-50 dark:bg-gray-900 border-t border-gray-200/70 dark:border-white/10">
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-[minmax(0,320px)_1fr] gap-10 lg:gap-14 items-center">
          {/* Portrait */}
          <motion.div
            className="mx-auto w-full max-w-[300px] lg:max-w-none"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg">
              <img
                src={anneMarieCarrImg}
                alt="Anne Marie Carr"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* Tribute */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00AFE6] mb-3">
              {t("inMemoriam.badge")}
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold font-rosarivo text-gray-900 dark:text-white mb-6">
              {t("inMemoriam.name")}
            </h2>
            <p className="text-base lg:text-lg leading-relaxed text-gray-700 dark:text-white/80 whitespace-pre-line">
              {t("inMemoriam.body")}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
