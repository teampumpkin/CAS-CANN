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
  const [isZoomedView, setIsZoomedView] = useState(false);
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

  // Handle cluster click - zoom into province geographically
  const handleClusterClick = (province: string) => {
    const provinceCenters = centersByProvince[province];
    if (provinceCenters && provinceCenters.length === 1) {
      // If only one center, open it directly
      onCenterClick(provinceCenters[0]);
    } else if (provinceCenters && provinceCenters.length > 1) {
      // If multiple centers, zoom into geographic region
      setZoomedProvince(province);
      setShowClusters(false);
      setSelectedProvince(province);
      setIsZoomedView(true);
    }
  };

  // Get individual center coordinates for zoomed province
  const getProvinceDetailedCoordinates = (provinceCode: string) => {
    const centers = centersByProvince[provinceCode] || [];
    
    // Define detailed coordinates for healthcare centers within each province
    const provinceDetailCoords: Record<string, Array<{x: number, y: number}>> = {
      'ON': [
        { x: 72, y: 45 }, // Toronto area
        { x: 68, y: 42 }, // London area  
        { x: 75, y: 41 }, // Hamilton area
        { x: 71, y: 38 }, // Kitchener area
        { x: 76, y: 35 }, // Ottawa area
      ],
      'QC': [
        { x: 85, y: 50 }, // Montreal area
        { x: 88, y: 58 }, // Quebec City area
        { x: 82, y: 45 }, // Sherbrooke area
      ],
      'BC': [
        { x: 25, y: 52 }, // Vancouver area
        { x: 28, y: 48 }, // Victoria area
        { x: 32, y: 55 }, // Kamloops area
      ],
      'AB': [
        { x: 42, y: 48 }, // Calgary area
        { x: 45, y: 42 }, // Edmonton area
      ],
      'MB': [
        { x: 55, y: 48 }, // Winnipeg area
      ],
      'SK': [
        { x: 52, y: 45 }, // Saskatoon area
        { x: 50, y: 50 }, // Regina area
      ],
      'NS': [
        { x: 92, y: 62 }, // Halifax area
      ],
      'NB': [
        { x: 90, y: 58 }, // Fredericton area
      ],
      'NL': [
        { x: 95, y: 55 }, // St. John's area
      ],
      'PE': [
        { x: 94, y: 60 }, // Charlottetown area
      ]
    };

    const coords = provinceDetailCoords[provinceCode] || [];
    return centers.map((center, index) => ({
      ...center,
      detailCoordinates: coords[index] || coords[0] || { x: 50, y: 50 }
    }));
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
                  setIsZoomedView(false);
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
          
          {/* True Geographic Province Zoom View */}
          <AnimatePresence>
            {zoomedProvince && centersByProvince[zoomedProvince] && isZoomedView && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg overflow-hidden"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {/* Province Region Background */}
                <div className="absolute inset-0">
                  {/* Render simplified province shape */}
                  <svg 
                    className="w-full h-full" 
                    viewBox="0 0 400 300" 
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                      <linearGradient id="provinceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{stopColor: '#00AFE6', stopOpacity: 0.1}} />
                        <stop offset="100%" style={{stopColor: '#00DD89', stopOpacity: 0.1}} />
                      </linearGradient>
                      <pattern id="provinceGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#00AFE6" strokeWidth="0.5" opacity="0.3"/>
                      </pattern>
                    </defs>
                    
                    {/* Province Shape Approximation */}
                    {zoomedProvince === 'ON' && (
                      <path 
                        d="M50,80 Q100,60 200,80 Q280,90 350,120 L350,200 Q300,220 200,210 Q100,200 50,180 Z" 
                        fill="url(#provinceGradient)" 
                        stroke="#00AFE6" 
                        strokeWidth="2" 
                        opacity="0.7"
                      />
                    )}
                    {zoomedProvince === 'QC' && (
                      <path 
                        d="M80,50 Q150,40 280,60 Q350,80 380,120 Q370,180 320,200 Q200,210 100,190 Q60,150 80,50 Z" 
                        fill="url(#provinceGradient)" 
                        stroke="#00AFE6" 
                        strokeWidth="2" 
                        opacity="0.7"
                      />
                    )}
                    {zoomedProvince === 'BC' && (
                      <path 
                        d="M50,60 Q120,40 200,70 Q250,100 280,150 Q260,200 200,220 Q120,210 80,180 Q40,120 50,60 Z" 
                        fill="url(#provinceGradient)" 
                        stroke="#00AFE6" 
                        strokeWidth="2" 
                        opacity="0.7"
                      />
                    )}
                    {zoomedProvince === 'AB' && (
                      <path 
                        d="M80,70 Q150,60 250,80 Q300,100 320,150 Q310,200 250,210 Q150,200 100,180 Q70,130 80,70 Z" 
                        fill="url(#provinceGradient)" 
                        stroke="#00AFE6" 
                        strokeWidth="2" 
                        opacity="0.7"
                      />
                    )}
                    {/* Default shape for other provinces */}
                    {!['ON', 'QC', 'BC', 'AB'].includes(zoomedProvince) && (
                      <path 
                        d="M100,100 Q200,80 300,120 Q320,180 280,220 Q200,240 120,210 Q80,160 100,100 Z" 
                        fill="url(#provinceGradient)" 
                        stroke="#00AFE6" 
                        strokeWidth="2" 
                        opacity="0.7"
                      />
                    )}
                    
                    {/* Grid overlay */}
                    <rect width="100%" height="100%" fill="url(#provinceGrid)" />
                  </svg>
                </div>

                {/* Province Header */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                  <div className="flex items-center gap-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-xl border border-gray-200 dark:border-gray-600">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full flex items-center justify-center shadow-lg">
                      <Building className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                        {getProvinceName(zoomedProvince)} Region
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        {centersByProvince[zoomedProvince].length} Healthcare Centers Available
                      </p>
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={() => {
                      setZoomedProvince(null);
                      setShowClusters(true);
                      setSelectedProvince(null);
                      setIsZoomedView(false);
                    }}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-200 text-sm font-bold shadow-xl"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MapPin className="w-4 h-4" />
                    Back to Canada
                  </motion.button>
                </div>
                
                {/* Individual Healthcare Center Dots */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    {getProvinceDetailedCoordinates(zoomedProvince).map((center, index) => (
                      <motion.button
                        key={center.id}
                        onClick={() => onCenterClick(center)}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                        style={{
                          left: `${20 + (center.detailCoordinates.x * 0.6)}%`,
                          top: `${15 + (center.detailCoordinates.y * 0.7)}%`
                        }}
                        initial={{ opacity: 0, scale: 0, rotate: 180 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
                        whileHover={{ scale: 1.5, y: -5 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {/* Healthcare Center Dot with Enhanced Design */}
                        <div className="relative">
                          <div className={`
                            w-12 h-12 rounded-full border-4 border-white shadow-2xl flex items-center justify-center relative overflow-hidden
                            ${center.type === 'hospital' ? 'bg-gradient-to-br from-[#00AFE6] to-[#0088CC]' : 
                              center.type === 'specialty' ? 'bg-gradient-to-br from-[#00DD89] to-[#00BB77]' :
                              center.type === 'research' ? 'bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED]' : 
                              'bg-gradient-to-br from-[#F59E0B] to-[#D97706]'}
                          `}>
                            {center.type === 'hospital' ? (
                              <Hospital className="w-6 h-6 text-white drop-shadow-lg" />
                            ) : (
                              <Stethoscope className="w-6 h-6 text-white drop-shadow-lg" />
                            )}
                            
                            {/* Shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                          </div>
                          
                          {/* Multiple pulsing rings */}
                          <div className={`
                            absolute inset-0 rounded-full opacity-40 animate-ping
                            ${center.type === 'hospital' ? 'bg-[#00AFE6]' : 
                              center.type === 'specialty' ? 'bg-[#00DD89]' :
                              center.type === 'research' ? 'bg-[#8B5CF6]' : 'bg-[#F59E0B]'}
                          `} style={{ animationDelay: '0s' }} />
                          <div className={`
                            absolute inset-0 rounded-full opacity-30 animate-ping
                            ${center.type === 'hospital' ? 'bg-[#00AFE6]' : 
                              center.type === 'specialty' ? 'bg-[#00DD89]' :
                              center.type === 'research' ? 'bg-[#8B5CF6]' : 'bg-[#F59E0B]'}
                          `} style={{ animationDelay: '0.5s' }} />
                        </div>
                        
                        {/* Enhanced tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-40">
                          <div className="bg-gray-900/95 backdrop-blur-sm text-white px-5 py-4 rounded-2xl text-sm shadow-2xl border border-gray-700 min-w-max max-w-sm">
                            <div className="font-bold text-lg mb-2 text-[#00AFE6]">{center.name}</div>
                            <div className="flex items-center gap-2 text-gray-300 mb-3">
                              <MapPin className="w-4 h-4 text-[#00DD89]" />
                              <span>{center.city}, {center.province}</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {center.specialties.slice(0, 3).map((specialty, idx) => (
                                <span key={idx} className="text-xs bg-[#00AFE6]/30 text-[#00AFE6] px-2 py-1.5 rounded-full font-medium">
                                  {specialty}
                                </span>
                              ))}
                              {center.specialties.length > 3 && (
                                <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1.5 rounded-full font-medium">
                                  +{center.specialties.length - 3} more
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed">
                              {center.description}
                            </p>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-gray-900/95"></div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
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