import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Phone, Mail, Globe, Building2, Heart, Users, Award, Calendar } from 'lucide-react';
import { HealthcareCenter } from '@/data/healthcareCenters';
import { useLanguage } from '@/contexts/LanguageContext';

interface HealthcareCenterModalProps {
  center: HealthcareCenter | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function HealthcareCenterModal({ center, isOpen, onClose }: HealthcareCenterModalProps) {
  const { t } = useLanguage();

  if (!center) return null;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hospital': return 'from-blue-500 to-blue-700';
      case 'clinic': return 'from-green-500 to-green-700';
      case 'research': return 'from-purple-500 to-purple-700';
      case 'specialty': return 'from-orange-500 to-orange-700';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hospital': return Building2;
      case 'clinic': return Heart;
      case 'research': return Users;
      case 'specialty': return Award;
      default: return Building2;
    }
  };

  const TypeIcon = getTypeIcon(center.type);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-[#00AFE6] to-[#00DD89] p-8 text-white">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 bg-gradient-to-r ${getTypeColor(center.type)} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <TypeIcon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2 font-rosarivo">{center.name}</h2>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5" />
                    <span className="text-lg">{center.city}, {center.province}</span>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm">
                    <span className="capitalize">{center.type}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
              {/* Description */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('modal.aboutThisCenter')}</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{center.description}</p>
              </div>

              {/* Quick Info Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Specialties */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    {t('modal.specialties')}
                  </h4>
                  <div className="space-y-2">
                    {center.specialties.map((specialty, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#00AFE6] rounded-full" />
                        <span className="text-gray-700 dark:text-gray-300">{specialty}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Services */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    {t('modal.services')}
                  </h4>
                  <div className="space-y-2">
                    {center.services.map((service, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#00DD89] rounded-full" />
                        <span className="text-gray-700 dark:text-gray-300">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 dark:from-[#00AFE6]/5 dark:to-[#00DD89]/5 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('modal.contactInformation')}</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-[#00AFE6]" />
                      <span className="text-gray-700 dark:text-gray-300">{center.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-[#00AFE6]" />
                      <span className="text-gray-700 dark:text-gray-300">{center.contact.email}</span>
                    </div>
                    {center.contact.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-[#00AFE6]" />
                        <a 
                          href={center.contact.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#00AFE6] hover:text-[#0088CC] transition-colors"
                        >
                          {t('modal.visitWebsite')}
                        </a>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#00AFE6] mt-1" />
                      <div className="text-gray-700 dark:text-gray-300">
                        <p>{center.contact.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              {(center.establishedYear || center.certifications) && (
                <div className="grid md:grid-cols-2 gap-6">
                  {center.establishedYear && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-purple-500" />
                        {t('modal.established')}
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300">{center.establishedYear}</p>
                    </div>
                  )}
                  
                  {center.certifications && center.certifications.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-500" />
                        {t('modal.certifications')}
                      </h4>
                      <div className="space-y-2">
                        {center.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                            <span className="text-gray-700 dark:text-gray-300">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  className="flex-1 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.open(`tel:${center.contact.phone}`, '_self')}
                >
                  {t('modal.callNow')}
                </motion.button>
                <motion.button
                  className="flex-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-3 rounded-2xl font-semibold border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.open(`mailto:${center.contact.email}`, '_self')}
                >
                  {t('modal.sendEmail')}
                </motion.button>
                {center.contact.website && (
                  <motion.button
                    className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-6 py-3 rounded-2xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.open(center.contact.website, '_blank')}
                  >
                    {t('modal.visitWebsite')}
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}