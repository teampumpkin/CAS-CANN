import React, { useState } from 'react';
import CanadaMap, { Provinces } from 'react-canada-map';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Users, Building, Award, ZoomIn, Hospital, Stethoscope } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

import { HealthcareCenter } from '@/data/healthcareCenters';

interface InteractiveCanadaMapProps {
  healthcareCenters: HealthcareCenter[];
  onCenterClick: (center: HealthcareCenter) => void;
}

export default function InteractiveCanadaMap({ healthcareCenters, onCenterClick }: InteractiveCanadaMapProps) {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [zoomedProvince, setZoomedProvince] = useState<string | null>(null);
  const [showClusters, setShowClusters] = useState(true);
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

  // Handle province click
  const handleProvinceClick = (province: string) => {
    setSelectedProvince(province);
    
    // Toggle zoom for the province
    if (zoomedProvince === province) {
      setZoomedProvince(null);
      setShowClusters(true);
    } else {
      setZoomedProvince(province);
      setShowClusters(false);
    }
  };

  // Handle cluster click
  const handleClusterClick = (province: string) => {
    const provinceCenters = centersByProvince[province];
    if (provinceCenters && provinceCenters.length === 1) {
      // If only one center, open it directly
      onCenterClick(provinceCenters[0]);
    } else if (provinceCenters && provinceCenters.length > 1) {
      // If multiple centers, zoom to province
      handleProvinceClick(province);
    }
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
      fillColor: selectedProvince === provinceCode 
        ? '#FF6B6B' 
        : getProvinceColor(provinceCode),
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
        
        {/* Map Header with Controls */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#00AFE6]" />
            Healthcare Network Map
          </h3>
          <div className="flex items-center gap-2">
            {zoomedProvince && (
              <motion.button
                onClick={() => {
                  setZoomedProvince(null);
                  setShowClusters(true);
                  setSelectedProvince(null);
                }}
                className="text-sm bg-[#00AFE6] text-white px-3 py-1 rounded-full hover:bg-[#00DD89] transition-colors duration-200"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                Back to Canada
              </motion.button>
            )}
            <div className="text-xs text-gray-600 dark:text-gray-300">
              {zoomedProvince ? `${getProvinceName(zoomedProvince)} Region` : 'Click provinces to zoom'}
            </div>
          </div>
        </div>
        
        {/* Map Container - Properly Scaled */}
        <div className="relative h-64 md:h-80 overflow-hidden rounded-lg">
          <div className="w-full h-full flex items-center justify-center">
            <CanadaMap
              customize={provinceStyles}
              onClick={handleProvinceClick}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          
          {/* Cluster Markers Overlay - Properly Positioned */}
          {showClusters && !zoomedProvince && (
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
          
          {/* Province Zoom Detail View */}
          <AnimatePresence>
            {zoomedProvince && centersByProvince[zoomedProvince] && (
              <motion.div
                className="absolute inset-0 bg-white/96 dark:bg-gray-800/96 backdrop-blur-md rounded-lg border border-gray-200 dark:border-gray-600"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="p-4 h-full flex flex-col">
                  {/* Header with Back Button */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-3">
                      <Building className="w-6 h-6 text-[#00AFE6]" />
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                          {getProvinceName(zoomedProvince)}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {centersByProvince[zoomedProvince].length} Healthcare Centers
                        </p>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => {
                        setZoomedProvince(null);
                        setShowClusters(true);
                        setSelectedProvince(null);
                      }}
                      className="flex items-center gap-2 bg-[#00AFE6] text-white px-4 py-2 rounded-full hover:bg-[#00DD89] transition-colors duration-200 text-sm font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <MapPin className="w-4 h-4" />
                      Back to Map
                    </motion.button>
                  </div>
                  
                  {/* Scrollable Centers Grid */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="grid gap-3">
                      {centersByProvince[zoomedProvince].map((center, index) => (
                        <motion.button
                          key={center.id}
                          onClick={() => onCenterClick(center)}
                          className="text-left p-4 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 dark:from-[#00AFE6]/15 dark:to-[#00DD89]/15 rounded-xl border border-[#00AFE6]/20 hover:border-[#00AFE6]/50 transition-all duration-300 hover:shadow-lg group"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
                          whileHover={{ scale: 1.02, y: -2 }}
                        >
                          <div className="flex items-start gap-4">
                            {/* Center Type Icon */}
                            <div className={`
                              w-12 h-12 rounded-full border-2 border-white shadow-md flex items-center justify-center flex-shrink-0
                              ${center.type === 'hospital' ? 'bg-[#00AFE6]' : 
                                center.type === 'specialty' ? 'bg-[#00DD89]' :
                                center.type === 'research' ? 'bg-[#8B5CF6]' : 'bg-[#F59E0B]'}
                            `}>
                              {center.type === 'hospital' ? (
                                <Hospital className="w-6 h-6 text-white" />
                              ) : (
                                <Stethoscope className="w-6 h-6 text-white" />
                              )}
                            </div>
                            
                            {/* Center Information */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <h5 className="font-semibold text-gray-900 dark:text-white text-lg leading-tight">
                                  {center.name}
                                </h5>
                                <ZoomIn className="w-5 h-5 text-[#00AFE6] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0 ml-2" />
                              </div>
                              
                              <div className="space-y-2">
                                <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-[#00DD89]" />
                                  {center.city}, {center.province}
                                </p>
                                
                                <div className="flex flex-wrap gap-1">
                                  {center.specialties.slice(0, 3).map((specialty, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-block px-2 py-1 bg-[#00AFE6]/20 text-[#00AFE6] dark:bg-[#00AFE6]/30 dark:text-[#00AFE6] rounded-full text-xs font-medium"
                                    >
                                      {specialty}
                                    </span>
                                  ))}
                                  {center.specialties.length > 3 && (
                                    <span className="inline-block px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-full text-xs">
                                      +{center.specialties.length - 3} more
                                    </span>
                                  )}
                                </div>
                                
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                  {center.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
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