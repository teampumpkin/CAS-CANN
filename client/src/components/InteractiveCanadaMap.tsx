import React, { useState } from 'react';
import CanadaMap, { Provinces } from 'react-canada-map';
import { motion } from 'framer-motion';
import { MapPin, Users, Building, Award } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

import { HealthcareCenter } from '@/data/healthcareCenters';

interface InteractiveCanadaMapProps {
  healthcareCenters: HealthcareCenter[];
  onCenterClick: (center: HealthcareCenter) => void;
}

export default function InteractiveCanadaMap({ healthcareCenters, onCenterClick }: InteractiveCanadaMapProps) {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
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
    
    // If province has centers, show the first one or open a list
    const provinceCenters = centersByProvince[province];
    if (provinceCenters && provinceCenters.length > 0) {
      // For now, show the first center - could be enhanced to show a list
      onCenterClick(provinceCenters[0]);
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
      {/* Interactive Canada Map */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <CanadaMap
          customize={provinceStyles}
          onClick={handleProvinceClick}
          className="w-full h-auto max-w-4xl mx-auto"
        />
        

      </div>

      {/* Map Legend */}
      <div className="mt-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-[#00AFE6]" />
            {t('map.legend.title')}
          </h4>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Click provinces to explore centers
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#00AFE6] rounded-full border border-white shadow-sm"></div>
            <span className="text-gray-700 dark:text-gray-300">10+ Centers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#00DD89] rounded-full border border-white shadow-sm"></div>
            <span className="text-gray-700 dark:text-gray-300">5-9 Centers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#7DD3FC] rounded-full border border-white shadow-sm"></div>
            <span className="text-gray-700 dark:text-gray-300">1-4 Centers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#E5E7EB] rounded-full border border-white shadow-sm"></div>
            <span className="text-gray-700 dark:text-gray-300">No Centers Yet</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <motion.div
          className="text-center p-4 bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 backdrop-blur-xl rounded-xl border border-[#00AFE6]/30 dark:border-[#00AFE6]/40"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-2xl font-bold bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent mb-1">
            {healthcareCenters.length}
          </div>
          <div className="text-[#00AFE6] dark:text-[#00AFE6] text-xs font-medium">Total Centers</div>
        </motion.div>
        
        <motion.div
          className="text-center p-4 bg-gradient-to-br from-[#00DD89]/15 to-[#00AFE6]/15 dark:from-[#00DD89]/20 dark:to-[#00AFE6]/20 backdrop-blur-xl rounded-xl border border-[#00DD89]/30 dark:border-[#00DD89]/40"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-2xl font-bold bg-gradient-to-r from-[#00DD89] to-[#00AFE6] bg-clip-text text-transparent mb-1">
            {Object.keys(centersByProvince).length}
          </div>
          <div className="text-[#00DD89] dark:text-[#00DD89] text-xs font-medium">Active Provinces</div>
        </motion.div>
        
        <motion.div
          className="text-center p-4 bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 backdrop-blur-xl rounded-xl border border-[#00AFE6]/30 dark:border-[#00AFE6]/40"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-2xl font-bold bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent mb-1">
            13
          </div>
          <div className="text-[#00AFE6] dark:text-[#00AFE6] text-xs font-medium">Provinces & Territories</div>
        </motion.div>
      </div>
    </div>
  );
}