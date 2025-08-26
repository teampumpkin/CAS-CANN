import { motion } from 'framer-motion';
import { Heart, Activity, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AboutAmyloidosisSection() {
  const { t } = useLanguage();
  const amyloidosisTypes = [
    {
      name: t('about.types.al.name'),
      description: t('about.types.al.description'),
      prevalence: t('about.types.al.prevalence'),
      gradient: 'from-[#00AFE6] to-[#00DD89]'
    },
    {
      name: t('about.types.aa.name'), 
      description: t('about.types.aa.description'),
      prevalence: t('about.types.aa.prevalence'),
      gradient: 'from-[#00DD89] to-[#00AFE6]'
    },
    {
      name: t('about.types.hereditary.name'),
      description: t('about.types.hereditary.description'),
      prevalence: t('about.types.hereditary.prevalence'),
      gradient: 'from-[#00AFE6] to-[#00DD89]'
    },
    {
      name: t('about.types.other.name'),
      description: t('about.types.other.description'),
      prevalence: t('about.types.other.prevalence'),
      gradient: 'from-[#00DD89] to-[#00AFE6]'
    }
  ];

  return (
    <section className="relative py-10 lg:py-16 bg-gradient-to-br from-[#00DD89]/5 via-white to-[#00AFE6]/5 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Enhanced background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-[#00AFE6]/20 to-[#00DD89]/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-[#00DD89]/20 to-[#00AFE6]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-blue-400/8 to-teal-400/8 rounded-full blur-3xl"></div>
        
        {/* Medical pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #00AFE6 1px, transparent 1px), radial-gradient(circle at 80% 50%, #00DD89 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Enhanced Badge */}
          <motion.div
            className="inline-flex items-center gap-2 bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-[#00AFE6]/30 dark:border-white/20 rounded-full px-6 py-3 mb-4 shadow-lg shadow-[#00AFE6]/10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full animate-pulse"></div>
            <span className="text-gray-900 dark:text-white/90 font-medium tracking-wide">{t('about.badge')}</span>
          </motion.div>

          <h2 className="crawford-section-title mb-4">
            <span className="text-gray-900 dark:text-white">{t('about.title.what')} </span>
            <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">{t('about.title.amyloidosis')}</span>
            <span className="text-gray-900 dark:text-white">?</span>
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-gray-700 dark:text-white/80 leading-relaxed mb-4">
              {t('about.subtitle')}
            </p>
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="w-16 h-0.5 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full"></div>
              <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full"></div>
              <div className="w-16 h-0.5 bg-gradient-to-r from-[#00DD89] to-[#00AFE6] rounded-full"></div>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {amyloidosisTypes.map((type, index) => (
            <motion.div
              key={type.name}
              className="group relative backdrop-blur-xl rounded-3xl p-8 border transition-all duration-500 hover:shadow-2xl bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 border-[#00AFE6]/20 dark:border-[#00AFE6]/30 hover:from-[#00AFE6]/12 hover:to-[#00DD89]/12 dark:hover:from-[#00AFE6]/20 dark:hover:to-[#00DD89]/20 hover:border-[#00AFE6]/40 dark:hover:border-[#00AFE6]/50 hover:shadow-[#00AFE6]/25 dark:hover:shadow-[#00AFE6]/20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              {/* Animated glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00AFE6]/20 via-[#00DD89]/20 to-[#00AFE6]/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out skew-x-12" />
              </div>

              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-0 group-hover:opacity-8 transition-opacity duration-500 rounded-3xl`} />
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-12 h-12 bg-gradient-to-br ${type.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                
                <h3 className="text-xl font-bold mb-4 transition-colors duration-300 text-gray-900 dark:text-white group-hover:text-gray-800 dark:group-hover:text-gray-50">
                  {type.name}
                </h3>
                <p className="text-sm mb-6 leading-relaxed transition-colors duration-300 text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200">
                  {type.description}
                </p>
                <div className={`text-transparent bg-clip-text bg-gradient-to-r ${type.gradient} text-sm font-bold`}>
                  {type.prevalence}
                </div>
              </div>


            </motion.div>
          ))}
        </div>

        <motion.div
          className="relative bg-white/95 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-12 lg:p-16 border border-[#00AFE6]/30 dark:border-white/10 overflow-hidden shadow-xl shadow-blue-100/50 dark:shadow-none"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Enhanced background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#00AFE6]/15 via-blue-50/30 to-[#00DD89]/15 dark:from-[#00AFE6]/5 dark:via-transparent dark:to-[#00DD89]/5"></div>
          
          {/* Medical cross pattern */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(90deg, #00AFE6 1px, transparent 1px),
                linear-gradient(0deg, #00DD89 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
          
          <div className="relative grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="crawford-section-title mb-8 text-left">
                <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">{t('about.earlyDetection.title')}</span>
                <span className="text-gray-900 dark:text-white"> {t('about.earlyDetection.subtitle')}</span>
              </h3>
              <div className="space-y-6 mb-10">
                <p className="text-xl text-gray-700 dark:text-white/80 leading-relaxed">
                  {t('about.earlyDetection.description')}
                </p>
                <p className="text-lg text-gray-600 dark:text-white/70 leading-relaxed">
                  {t('about.earlyDetection.subdescription')}
                </p>
              </div>
              <motion.a
                href="/about-amyloidosis"
                className="group relative bg-gradient-to-r from-[#00DD89] to-[#00BB77] text-white px-10 py-4 rounded-2xl font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 inline-flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative">{t('about.learnMore')}</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.a>
            </div>
            <div className="space-y-8">
              <motion.div 
                className="relative bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 backdrop-blur-xl rounded-2xl p-8 border border-[#00AFE6]/20 dark:border-[#00AFE6]/30 hover:border-[#00AFE6]/40 dark:hover:border-[#00AFE6]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#00AFE6]/20"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00AFE6] to-[#00DD89] mb-3">{t('about.stats.diagnosisTime')}</div>
                <div className="text-gray-900 dark:text-white font-bold text-lg mb-2">{t('about.stats.diagnosisTimeLabel')}</div>
                <div className="text-gray-700 dark:text-white/70">{t('about.stats.diagnosisTimeDesc')}</div>
              </motion.div>
              <motion.div 
                className="relative bg-gradient-to-br from-[#00DD89]/15 to-[#00AFE6]/15 dark:from-[#00DD89]/20 to-[#00AFE6]/20 backdrop-blur-xl rounded-2xl p-8 border border-[#00DD89]/20 dark:border-[#00DD89]/30 hover:border-[#00DD89]/40 dark:hover:border-[#00DD89]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#00DD89]/20"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00DD89] to-[#00AFE6] mb-3">{t('about.stats.canadiansAffected')}</div>
                <div className="text-gray-900 dark:text-white font-bold text-lg mb-2">{t('about.stats.canadiansAffectedLabel')}</div>
                <div className="text-gray-700 dark:text-white/70">{t('about.stats.canadiansAffectedDesc')}</div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}