import React, { useState } from 'react';
import CanadaMap, { Provinces } from 'react-canada-map';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Users, Building, Award, Hospital, Stethoscope, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

import { HealthcareCenter } from '@/data/healthcareCenters';

interface InteractiveCanadaMapProps {
  healthcareCenters: HealthcareCenter[];
  onCenterClick: (center: HealthcareCenter) => void;
}

export default function InteractiveCanadaMap({ healthcareCenters, onCenterClick }: InteractiveCanadaMapProps) {
  const [selectedCenter, setSelectedCenter] = useState<HealthcareCenter | null>(null);
  const [showCentersList, setShowCentersList] = useState<string | null>(null);
  const { t } = useLanguage();

  // Group healthcare centers by province
  const centersByProvince = healthcareCenters.reduce((acc, center) => {
    const provinceCode = getProvinceCode(center.province);
    if (!acc[provinceCode]) acc[provinceCode] = [];
    acc[provinceCode].push(center);
    return acc;
  }, {} as Record<string, HealthcareCenter[]>);

  // Get healthcare center count for each province
  const getProvinceCenterCount = (provinceCode: string) => {
    return centersByProvince[provinceCode]?.length || 0;
  };

  // Convert province name to code
  function getProvinceCode(provinceName: string): string {
    const provinceMap: Record<string, string> = {
      'Ontario': 'ON',
      'Quebec': 'QC', 
      'British Columbia': 'BC',
      'Alberta': 'AB',
      'Manitoba': 'MB',
      'Saskatchewan': 'SK',
      'Nova Scotia': 'NS',
      'New Brunswick': 'NB',
      'Newfoundland and Labrador': 'NL',
      'Prince Edward Island': 'PE',
      'Northwest Territories': 'NT',
      'Nunavut': 'NU',
      'Yukon': 'YT'
    };
    return provinceMap[provinceName] || provinceName;
  }

  // Get province display name
  function getProvinceName(provinceCode: string): string {
    const codeMap: Record<string, string> = {
      'ON': 'Ontario',
      'QC': 'Quebec',
      'BC': 'British Columbia', 
      'AB': 'Alberta',
      'MB': 'Manitoba',
      'SK': 'Saskatchewan',
      'NS': 'Nova Scotia',
      'NB': 'New Brunswick',
      'NL': 'Newfoundland and Labrador',
      'PE': 'Prince Edward Island',
      'NT': 'Northwest Territories',
      'NU': 'Nunavut',
      'YT': 'Yukon'
    };
    return codeMap[provinceCode] || provinceCode;
  }

  // Handle cluster click - show list of centers
  const handleClusterClick = (province: string) => {
    const provinceCenters = centersByProvince[province];
    if (provinceCenters && provinceCenters.length === 1) {
      // If only one center, open it directly
      setSelectedCenter(provinceCenters[0]);
    } else if (provinceCenters && provinceCenters.length > 1) {
      // Show list of centers for selection
      setShowCentersList(province);
    }
  };

  // Handle center selection from list
  const handleCenterSelect = (center: HealthcareCenter) => {
    setShowCentersList(null);
    setSelectedCenter(center);
  };

  // Color provinces based on healthcare center density
  const getProvinceColor = (provinceCode: string) => {
    const count = getProvinceCenterCount(provinceCode);
    if (count === 0) return '#E5E7EB'; // Light gray for no centers
    if (count >= 10) return '#00AFE6'; // Primary brand color for high density
    if (count >= 5) return '#00DD89';  // Secondary brand color for medium density
    return '#7DD3FC'; // Light blue for low density
  };

  // Create province customization
  const provinceStyles = Object.keys(Provinces).reduce((acc, provinceCode) => {
    const count = getProvinceCenterCount(provinceCode);
    acc[provinceCode as keyof typeof Provinces] = {
      fillColor: getProvinceColor(provinceCode),
      strokeColor: '#FFFFFF',
      strokeWidth: 2,
      opacity: 0.9
    };
    return acc;
  }, {} as any);

  return (
    <div className="relative w-full">
      {/* Compact Interactive Canada Map */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        
        {/* Map Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#00AFE6]" />
            Healthcare Network Map
          </h3>
          <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">
            Click clusters to view center details
          </div>
        </div>
        
        {/* Map Container - Expanded Size */}
        <div className="relative h-80 md:h-96 lg:h-[28rem] overflow-hidden rounded-lg">
          <div className="w-full h-full flex items-center justify-center">
            <CanadaMap
              customize={provinceStyles}
            />
          </div>
          
          {/* Cluster Markers Overlay */}
          {true && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative" style={{ width: '100%', height: '100%', maxWidth: '600px', maxHeight: '400px' }}>
                {Object.entries(centersByProvince).map(([provinceCode, centers]) => {
                  if (centers.length === 0) return null;
                  
                  // Adjust coordinates to fit within the properly scaled map
                  const coords = centers[0].coordinates;
                  // Scale coordinates to fit within the constrained map size
                  const scaledX = coords.x * 0.85 + 7.5; // Scale and center horizontally
                  const scaledY = coords.y * 0.85 + 7.5; // Scale and center vertically
                  
                  return (
                    <motion.button
                      key={provinceCode}
                      onClick={() => handleClusterClick(provinceCode)}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                      style={{
                        left: `${scaledX}%`,
                        top: `${scaledY}%`
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.8 }}
                    >
                      {/* Cluster Circle */}
                      <div className={`
                        w-7 h-7 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold
                        ${centers.length >= 10 ? 'bg-[#00AFE6]' : 
                          centers.length >= 5 ? 'bg-[#00DD89]' : 
                          centers.length >= 2 ? 'bg-[#7DD3FC]' : 'bg-[#F59E0B]'}
                      `}>
                        {centers.length}
                      </div>
                      
                      {/* Hover Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30">
                        <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg">
                          <div className="font-semibold">{getProvinceName(provinceCode)}</div>
                          <div className="text-xs text-gray-300">{centers.length} Healthcare Centers</div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Centers List Popup - Enhanced Design */}
          <AnimatePresence>
            {showCentersList && (
              <motion.div
                className="absolute inset-0 bg-black/60 backdrop-blur-md rounded-lg flex items-center justify-center z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCentersList(null)}
              >
                <motion.div
                  className="bg-white dark:bg-gray-900/95 backdrop-blur-lg rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl border border-gray-200 dark:border-gray-700/50 max-h-[80vh] flex flex-col"
                  initial={{ scale: 0.8, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: 50 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700/50 flex-shrink-0">
                    <div className="flex-1 min-w-0 pr-4">
                      <h3 className="text-xl font-bold bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent mb-1 truncate">
                        {getProvinceName(showCentersList)}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        {centersByProvince[showCentersList]?.length} Healthcare Centers
                      </p>
                    </div>
                    <button
                      onClick={() => setShowCentersList(null)}
                      className="w-10 h-10 bg-gray-100 dark:bg-gray-700/50 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex-shrink-0"
                    >
                      <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>

                  {/* Scrollable Centers List */}
                  <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                    {centersByProvince[showCentersList]?.map((center, index) => (
                      <motion.button
                        key={center.id}
                        onClick={() => handleCenterSelect(center)}
                        className="w-full text-left p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors border border-gray-200 dark:border-gray-600/30 hover:border-[#00AFE6]/30 group min-h-[100px]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-start gap-3 h-full">
                          {/* Icon */}
                          <div className={`
                            w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md flex-shrink-0
                            ${center.type === 'hospital' ? 'bg-gradient-to-br from-[#00AFE6] to-[#0088CC]' : 
                              center.type === 'specialty' ? 'bg-gradient-to-br from-[#00DD89] to-[#00BB77]' :
                              center.type === 'research' ? 'bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED]' : 
                              'bg-gradient-to-br from-[#F59E0B] to-[#D97706]'}
                          `}>
                            {center.type === 'hospital' ? (
                              <Hospital className="w-6 h-6" />
                            ) : (
                              <Stethoscope className="w-6 h-6" />
                            )}
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0 flex flex-col justify-start h-full">
                            <div className="text-left">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm leading-tight line-clamp-2 text-left">
                                {center.name}
                              </h4>
                              <div className="flex items-center gap-1 mb-3 justify-start">
                                <MapPin className="w-3 h-3 text-[#00DD89] flex-shrink-0" />
                                <p className="text-xs text-gray-600 dark:text-gray-300 truncate text-left">
                                  {center.city}
                                </p>
                              </div>
                            </div>
                            {/* Specialties - Fixed at bottom */}
                            <div className="flex flex-wrap gap-1 justify-start mt-auto">
                              {center.specialties.slice(0, 2).map((specialty, idx) => (
                                <span
                                  key={idx}
                                  className="inline-block px-2 py-0.5 bg-[#00AFE6]/15 dark:bg-[#00AFE6]/25 text-[#00AFE6] rounded text-xs font-medium max-w-20 truncate"
                                >
                                  {specialty}
                                </span>
                              ))}
                              {center.specialties.length > 2 && (
                                <span className="inline-block px-2 py-0.5 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded text-xs font-medium">
                                  +{center.specialties.length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Healthcare Center Detail Popup - Enhanced Design */}
          <AnimatePresence>
            {selectedCenter && (
              <motion.div
                className="absolute inset-0 bg-black/60 backdrop-blur-md rounded-lg flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedCenter(null)}
              >
                <motion.div
                  className="bg-gray-900/95 backdrop-blur-lg text-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl border border-gray-700"
                  initial={{ scale: 0.5, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.5, opacity: 0, y: 50 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedCenter(null)}
                    className="absolute top-4 right-4 w-10 h-10 bg-gray-700/80 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-300" />
                  </button>

                  {/* Center Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`
                      w-16 h-16 rounded-full border-4 border-white shadow-xl flex items-center justify-center
                      ${selectedCenter.type === 'hospital' ? 'bg-gradient-to-br from-[#00AFE6] to-[#0088CC]' : 
                        selectedCenter.type === 'specialty' ? 'bg-gradient-to-br from-[#00DD89] to-[#00BB77]' :
                        selectedCenter.type === 'research' ? 'bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED]' : 
                        'bg-gradient-to-br from-[#F59E0B] to-[#D97706]'}
                    `}>
                      {selectedCenter.type === 'hospital' ? (
                        <Hospital className="w-8 h-8 text-white drop-shadow-lg" />
                      ) : (
                        <Stethoscope className="w-8 h-8 text-white drop-shadow-lg" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                        {selectedCenter.name}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-300">
                        <MapPin className="w-5 h-5 text-[#00DD89]" />
                        <span className="font-medium">{selectedCenter.city}, {selectedCenter.province}</span>
                      </div>
                    </div>
                  </div>

                  {/* Center Details */}
                  <div className="space-y-6">
                    {/* Specialties */}
                    <div>
                      <h4 className="text-lg font-semibold mb-3 text-white">
                        Specialties
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCenter.specialties.map((specialty, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-2 bg-[#00AFE6]/30 text-[#00AFE6] rounded-full text-sm font-semibold border border-[#00AFE6]/20"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h4 className="text-lg font-semibold mb-3 text-white">
                        About This Center
                      </h4>
                      <p className="text-gray-300 leading-relaxed">
                        {selectedCenter.description}
                      </p>
                    </div>

                    {/* Contact Actions */}
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => onCenterClick(selectedCenter)}
                        className="flex-1 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200"
                      >
                        View Full Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Compact Legend & Stats */}
      <div className="mt-3 grid md:grid-cols-2 gap-3">
        {/* Legend */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 border border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-[#00AFE6]" />
            Cluster Legend
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#00AFE6] rounded-full border border-white"></div>
              <span className="text-gray-700 dark:text-gray-300">10+ Centers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#00DD89] rounded-full border border-white"></div>
              <span className="text-gray-700 dark:text-gray-300">5-9 Centers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#7DD3FC] rounded-full border border-white"></div>
              <span className="text-gray-700 dark:text-gray-300">2-4 Centers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#F59E0B] rounded-full border border-white"></div>
              <span className="text-gray-700 dark:text-gray-300">1 Center</span>
            </div>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 border border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-[#00DD89]" />
            Network Stats
          </h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="text-lg font-bold bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                {healthcareCenters.length}
              </div>
              <div className="text-[#00AFE6] dark:text-[#00AFE6]">Centers</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold bg-gradient-to-r from-[#00DD89] to-[#00AFE6] bg-clip-text text-transparent">
                {Object.keys(centersByProvince).length}
              </div>
              <div className="text-[#00DD89] dark:text-[#00DD89]">Provinces</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                13
              </div>
              <div className="text-[#00AFE6] dark:text-[#00AFE6]">Total P&T</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}