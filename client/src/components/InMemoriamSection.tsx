import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import anneMarieCarrImg from "@assets/anne-marie-carr-in-memoriam.jpg";

/** A small botanical spray used to frame the corners of the section. */
function CornerFlourish({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      {/* stems */}
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M6 10 C 48 34, 66 78, 74 150" />
        <path d="M26 24 C 66 40, 108 36, 156 26" />
        <path d="M40 44 C 58 58, 60 82, 56 104" />
      </g>
      {/* leaves */}
      <g fill="currentColor" opacity="0.55">
        <path d="M0 0 C 7 -4, 14 -2, 16 4 C 11 7, 3 6, 0 0 Z" transform="translate(30 28) rotate(-8)" />
        <path d="M0 0 C 7 -4, 14 -2, 16 4 C 11 7, 3 6, 0 0 Z" transform="translate(52 70) rotate(70)" />
        <path d="M0 0 C 7 -4, 14 -2, 16 4 C 11 7, 3 6, 0 0 Z" transform="translate(66 120) rotate(80)" />
        <path d="M0 0 C 7 -4, 14 -2, 16 4 C 11 7, 3 6, 0 0 Z" transform="translate(96 34) rotate(-20)" />
        <path d="M0 0 C 7 -4, 14 -2, 16 4 C 11 7, 3 6, 0 0 Z" transform="translate(128 30) rotate(10)" />
        <path d="M0 0 C 7 -4, 14 -2, 16 4 C 11 7, 3 6, 0 0 Z" transform="translate(48 96) rotate(120)" />
      </g>
      {/* blossoms */}
      {[
        { x: 156, y: 26, s: 1.1 },
        { x: 74, y: 150, s: 1.15 },
        { x: 56, y: 104, s: 0.85 },
      ].map((b, i) => (
        <g key={i} transform={`translate(${b.x} ${b.y}) scale(${b.s})`}>
          <g fill="currentColor" opacity="0.75">
            {[0, 72, 144, 216, 288].map((r) => (
              <ellipse key={r} cx="0" cy="-6.5" rx="2.7" ry="5.2" transform={`rotate(${r})`} />
            ))}
          </g>
          <circle cx="0" cy="0" r="2.4" className="text-[#00AFE6]" fill="currentColor" />
        </g>
      ))}
    </svg>
  );
}

export default function InMemoriamSection() {
  const { t } = useLanguage();

  return (
    <section className="relative py-16 lg:py-24 bg-gray-50 dark:bg-gray-900 border-t border-gray-200/70 dark:border-white/10 overflow-hidden">
      {/* Floral frame around the whole section */}
      <div className="pointer-events-none absolute inset-0 text-[#00DD89]/70 dark:text-[#00DD89]/55">
        <CornerFlourish className="absolute top-0 left-0 w-36 h-36 sm:w-56 sm:h-56" />
        <CornerFlourish className="absolute top-0 right-0 w-36 h-36 sm:w-56 sm:h-56 -scale-x-100" />
        <CornerFlourish className="absolute bottom-0 left-0 w-36 h-36 sm:w-56 sm:h-56 -scale-y-100" />
        <CornerFlourish className="absolute bottom-0 right-0 w-36 h-36 sm:w-56 sm:h-56 -scale-x-100 -scale-y-100" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-[minmax(0,340px)_1fr] gap-10 lg:gap-14 items-center">
          {/* Portrait in a matted frame */}
          <motion.div
            className="mx-auto w-full max-w-[320px] lg:max-w-none"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 p-3 shadow-2xl ring-1 ring-black/5 dark:ring-white/10">
              <div className="relative p-[3px] rounded-md bg-gradient-to-br from-[#00AFE6] to-[#00DD89]">
                <div className="rounded-[5px] bg-white dark:bg-gray-800 p-2">
                  <img
                    src={anneMarieCarrImg}
                    alt="Anne Marie Carr"
                    className="block w-full h-auto rounded-[3px]"
                    loading="lazy"
                  />
                </div>

                {/* Floral accents inside the frame corners (clipped to the frame) */}
                <div className="pointer-events-none absolute inset-0 z-10 text-[#00DD89]/90 dark:text-[#00DD89]/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
                  <CornerFlourish className="absolute top-0 left-0 w-16 h-16 sm:w-20 sm:h-20" />
                  <CornerFlourish className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 -scale-x-100" />
                  <CornerFlourish className="absolute bottom-0 left-0 w-16 h-16 sm:w-20 sm:h-20 -scale-y-100" />
                  <CornerFlourish className="absolute bottom-0 right-0 w-16 h-16 sm:w-20 sm:h-20 -scale-x-100 -scale-y-100" />
                </div>
              </div>
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
