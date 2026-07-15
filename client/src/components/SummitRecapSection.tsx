import { motion } from "framer-motion";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import summitPosterImg from "@assets/2026_CAS_SUMMIT_Banner_1_1784121427159.png";
import summitPhoto1 from "@assets/2d226423-9ba2-4a2b-b87c-05bf881cd89a_1771244987107.jpg";
import summitPhoto2 from "@assets/6110ba86-43ba-413c-9bf7-00e4a1ce8c19_1771244987108.jpg";
import summitPhoto3 from "@assets/d33be37a-54c0-47a5-891b-f018d610f554_1771244987108.jpg";

export default function SummitRecapSection() {
  const { language } = useLanguage();

  const title = "Canadian Amyloidosis Summit 2025";
  const description = language === 'en'
    ? "In partnership with Transthyretin Amyloidosis Canada (TAC), the Canadian Amyloidosis Summit was held in Toronto the weekend of November 1-2, 2025, with over 120 people attending. This hybrid event featured parallel sessions for both healthcare providers and patients/families, with CME accreditation for healthcare provider sessions."
    : "En partenariat avec Amylose à Transthyrétine Canada (TAC), le Sommet canadien sur l'amylose s'est tenu à Toronto la fin de semaine du 1er au 2 novembre 2025, avec plus de 120 participants. Cet événement hybride proposait des sessions parallèles pour les professionnels de la santé et les patients/familles, avec une accréditation EMC pour les sessions des professionnels de la santé.";

  const description2 = language === 'en'
    ? "The Summit featured interesting presentations and panel discussions from many national and internationally recognized leaders from the amyloidosis community. The CAS also held its first Annual General Meeting (AGM) at the Summit. Registration is now open for the 2026 Canadian Amyloidosis Summit, October 23–25, 2026 in Toronto. We hope you can join us!"
    : "Le Sommet a présenté des présentations et des discussions en panel intéressantes de nombreux leaders nationaux et internationaux reconnus de la communauté de l'amylose. La SCA a également tenu sa première Assemblée générale annuelle (AGA) lors du Sommet. L'inscription est maintenant ouverte pour le Sommet canadien sur l'amylose 2026, du 23 au 25 octobre 2026 à Toronto. Nous espérons que vous pourrez vous joindre à nous!";

  const registrationUrl = "https://madhattr.ca/event/canadian-amyloidosis-summit-october-23-october-25-2026/";

  const photos = [
    { src: summitPhoto1, alt: "Summit keynote presentation" },
    { src: summitPhoto2, alt: "Summit panel discussion" },
    { src: summitPhoto3, alt: "Summit medical presentation" },
  ];

  return (
    <section className="relative py-10 lg:py-16 bg-gradient-to-br from-[#00AFE6]/5 via-white to-[#00DD89]/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-[#00DD89]/15 to-[#00AFE6]/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-[#00AFE6]/30 dark:border-white/20 rounded-full px-6 py-3 mb-4 shadow-lg shadow-[#00AFE6]/10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full animate-pulse"></div>
            <span className="text-gray-900 dark:text-white/90 font-medium tracking-wide">
              {language === 'en' ? 'Event Recap' : 'Récapitulatif de l\'événement'}
            </span>
          </motion.div>

          <h2 className="crawford-section-title mb-4">
            <span className="text-gray-900 dark:text-white">Canadian Amyloidosis </span>
            <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
              Summit 2025
            </span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-start mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <p className="text-gray-700 dark:text-white/80 leading-relaxed text-lg mb-6">
              {description}
            </p>
            <p className="text-gray-700 dark:text-white/80 leading-relaxed text-lg">
              {description2}
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="grid grid-cols-2 gap-4">
              {photos.slice(1).map((photo, index) => (
                <motion.div
                  key={index}
                  className="group relative rounded-2xl overflow-hidden border border-[#00AFE6]/20 dark:border-white/10 shadow-lg hover:shadow-xl hover:shadow-[#00AFE6]/15 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 * index }}
                  viewport={{ once: true }}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
              ))}
            </div>
            <motion.div
              className="group relative rounded-2xl overflow-hidden border border-[#00AFE6]/20 dark:border-white/10 shadow-lg hover:shadow-xl hover:shadow-[#00AFE6]/15 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <img
                src={photos[0].src}
                alt={photos[0].alt}
                className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <Link href="/events-and-news#summit">
            <div className="rounded-2xl overflow-hidden border border-[#00AFE6]/20 dark:border-white/10 shadow-xl shadow-[#00AFE6]/10 cursor-pointer hover:shadow-2xl hover:shadow-[#00AFE6]/20 hover:border-[#00AFE6]/40 transition-all duration-300">
              <img
                src={summitPosterImg}
                alt="2026 Canadian Amyloidosis Summit - Registration Open, October 23-25, 2026"
                className="w-full h-auto hover:scale-[1.01] transition-transform duration-300"
                loading="lazy"
              />
            </div>
          </Link>
          <div className="text-center mt-8">
            <a
              href={registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:shadow-[#00AFE6]/30 hover:scale-[1.02] transition-all duration-300"
            >
              {language === 'en' ? 'Register for the 2026 Summit' : "S'inscrire au Sommet 2026"}
            </a>
            <p className="text-sm text-gray-500 dark:text-white/60 mt-3">
              {language === 'en'
                ? 'Registration is hosted on the Transthyretin Amyloidosis Canada (TAC) website.'
                : "L'inscription se fait sur le site de Transthyretin Amyloidosis Canada (TAC)."}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
