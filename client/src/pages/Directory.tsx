import { motion } from 'framer-motion';
import { MapPin, Users, Hospital, Search, Navigation, Phone, Mail, ExternalLink, Stethoscope, GraduationCap, Network, ArrowRight, Filter, Calendar, CheckCircle, Upload, Shield, Clock, FileText, AlertCircle, Eye, Building2, Heart, Microscope, UserCheck, Map, List } from 'lucide-react';
import ParallaxBackground from '../components/ParallaxBackground';
import canadaMapPath from '@assets/Canada Map_1750069387234.png';
import healthcareProfessionalImg from '@assets/DSC02826_1750068895453.jpg';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { healthcareCenters, HealthcareCenter } from '@/data/healthcareCenters';
import HealthcareCenterModal from '@/components/HealthcareCenterModal';

export default function Directory() {
  const { t } = useLanguage();
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgramType, setSelectedProgramType] = useState<string | null>(null);
  const [selectedCenter, setSelectedCenter] = useState<HealthcareCenter | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const provinces = [
    { name: 'British Columbia', code: 'BC', centers: 5, color: 'from-blue-500 to-cyan-500' },
    { name: 'Alberta', code: 'AB', centers: 3, color: 'from-green-500 to-emerald-500' },
    { name: 'Saskatchewan', code: 'SK', centers: 1, color: 'from-yellow-500 to-orange-500' },
    { name: 'Manitoba', code: 'MB', centers: 2, color: 'from-purple-500 to-violet-500' },
    { name: 'Ontario', code: 'ON', centers: 8, color: 'from-red-500 to-pink-500' },
    { name: 'Quebec', code: 'QC', centers: 4, color: 'from-indigo-500 to-blue-500' },
    { name: 'New Brunswick', code: 'NB', centers: 1, color: 'from-teal-500 to-cyan-500' },
    { name: 'Nova Scotia', code: 'NS', centers: 2, color: 'from-orange-500 to-red-500' },
    { name: 'Prince Edward Island', code: 'PE', centers: 1, color: 'from-pink-500 to-rose-500' },
    { name: 'Newfoundland and Labrador', code: 'NL', centers: 1, color: 'from-emerald-500 to-green-500' },
    { name: 'Northwest Territories', code: 'NT', centers: 1, color: 'from-cyan-500 to-blue-500' },
    { name: 'Yukon', code: 'YT', centers: 1, color: 'from-green-500 to-teal-500' },
    { name: 'Nunavut', code: 'NU', centers: 1, color: 'from-purple-500 to-pink-500' }
  ];

  const programTypes = [
    { name: 'Comprehensive Care', description: 'Full-service amyloidosis treatment programs', count: 12 },
    { name: 'Cardiac Amyloidosis', description: 'Heart-focused amyloidosis specialists', count: 8 },
    { name: 'Hematology/Oncology', description: 'AL amyloidosis treatment centers', count: 6 },
    { name: 'Neurology', description: 'Neurological amyloidosis specialists', count: 4 },
    { name: 'Nephrology', description: 'Kidney-focused amyloidosis care', count: 5 },
    { name: 'Research/Clinical Trials', description: 'Active research and trial participation', count: 3 },
    { name: 'Diagnostic Services', description: 'Specialized diagnostic capabilities', count: 7 }
  ];

  const treatmentCenters = [
    {
      name: 'Toronto General Hospital',
      city: 'Toronto',
      province: 'ON',
      specialties: ['AL Amyloidosis', 'ATTR Amyloidosis', 'Cardiac Care'],
      contact: { phone: '(416) 340-4800', email: 'info@uhn.ca' },
      services: ['Diagnosis', 'Treatment', 'Follow-up Care']
    },
    {
      name: 'Vancouver General Hospital',
      city: 'Vancouver',
      province: 'BC',
      specialties: ['ATTR Amyloidosis', 'Neurological Care'],
      contact: { phone: '(604) 875-4111', email: 'info@vch.ca' },
      services: ['Diagnosis', 'Treatment', 'Research']
    },
    {
      name: 'Montreal Heart Institute',
      city: 'Montreal',
      province: 'QC',
      specialties: ['Cardiac Amyloidosis', 'AL Amyloidosis'],
      contact: { phone: '(514) 376-3330', email: 'info@icm-mhi.org' },
      services: ['Cardiac Specialty', 'Treatment', 'Monitoring']
    },
    {
      name: 'Foothills Medical Centre',
      city: 'Calgary',
      province: 'AB',
      specialties: ['AL Amyloidosis', 'Multi-organ Care'],
      contact: { phone: '(403) 944-1110', email: 'info@ahs.ca' },
      services: ['Diagnosis', 'Treatment', 'Support Services']
    }
  ];

  const registries = [
    {
      name: 'Canadian Registry for Amyloidosis Research (CRAP)',
      description: 'National registry collecting comprehensive data on amyloidosis patients for research advancement.',
      participants: '500+',
      established: '2018'
    },
    {
      name: 'Canadian Amyloidosis Patient Experience Registry (CAPER)',
      description: 'Patient-reported outcome registry focusing on quality of life and treatment experiences.',
      participants: '300+',
      established: '2020'
    }
  ];

  const filteredCenters = healthcareCenters.filter(center => {
    const matchesSearch = center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesProvince = !selectedProvince || center.province === selectedProvince;
    const matchesProgramType = !selectedProgramType || center.type === selectedProgramType.toLowerCase();
    
    return matchesSearch && matchesProvince && matchesProgramType;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredCenters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCenters = filteredCenters.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedProvince, selectedProgramType, searchTerm]);

  const handleCenterClick = (center: HealthcareCenter) => {
    setSelectedCenter(center);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCenter(null);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Medical Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-gray-400 rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border-2 border-gray-400 rounded-full"></div>
          <div className="absolute bottom-32 left-32 w-28 h-28 border-2 border-gray-400 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-20 h-20 border-2 border-gray-400 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.6, -0.05, 0.01, 0.99] }}
            >
              <motion.div
                className="inline-block mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="flex items-center gap-3 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 backdrop-blur-xl rounded-full px-5 py-3 border border-[#00AFE6]/30">
                  <Hospital className="w-5 h-5 text-[#00AFE6]" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide">DIRECTORY - FIND SUPPORT</span>
                </div>
              </motion.div>
              
              <motion.h1
                className="text-5xl lg:text-6xl font-bold font-rosarivo mb-8 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                  Find
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                  Specialized Care
                </span>
              </motion.h1>
              
              <motion.p
                className="text-xl text-gray-600 dark:text-white/70 leading-relaxed mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                Use this tool to find clinics with experience diagnosing amyloidosis. Connect with specialized treatment centers across Canada.
              </motion.p>
              
              <motion.div
                className="bg-gradient-to-r from-[#00AFE6]/8 to-[#00DD89]/8 dark:from-[#00AFE6]/15 dark:to-[#00DD89]/15 backdrop-blur-xl rounded-2xl p-6 border border-[#00AFE6]/20 dark:border-[#00AFE6]/30 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <div className="flex items-start gap-4">
                  <UserCheck className="w-6 h-6 text-[#00AFE6] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Professional Directory</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      Vetted healthcare providers specializing in amyloidosis diagnosis and treatment, including referral requirements and program details.
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                <button
                  onClick={() => setViewMode('list')}
                  className={`group px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                    viewMode === 'list' 
                      ? 'bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white shadow-2xl shadow-[#00AFE6]/25' 
                      : 'bg-gray-900/10 dark:bg-white/10 backdrop-blur-xl text-gray-900 dark:text-white border border-gray-900/20 dark:border-white/20 hover:bg-gray-900/20 dark:hover:bg-white/20'
                  }`}
                >
                  <Hospital className="w-5 h-5" />
                  Browse Directory
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`group px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                    viewMode === 'map' 
                      ? 'bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white shadow-2xl shadow-[#00AFE6]/25' 
                      : 'bg-gray-900/10 dark:bg-white/10 backdrop-blur-xl text-gray-900 dark:text-white border border-gray-900/20 dark:border-white/20 hover:bg-gray-900/20 dark:hover:bg-white/20'
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                  Map View
                </button>
              </motion.div>
            </motion.div>
            
            {/* Hero Visual */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <div className="relative bg-gradient-to-br from-white/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 dark:border-gray-400/30">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Directory Statistics</h3>
                  
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-[#00AFE6]/8 to-[#00DD89]/8 dark:from-[#00AFE6]/15 dark:to-[#00DD89]/15 rounded-2xl p-6 border border-[#00AFE6]/20 dark:border-[#00AFE6]/30">
                      <Building2 className="w-8 h-8 text-[#00AFE6] mx-auto mb-4" />
                      <div className="text-3xl font-bold text-[#00AFE6] mb-2">{healthcareCenters.length}</div>
                      <div className="text-sm text-gray-600 dark:text-white/60">Treatment Centers</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-[#00DD89]/8 to-[#00AFE6]/8 dark:from-[#00DD89]/15 dark:to-[#00AFE6]/15 rounded-2xl p-6 border border-[#00DD89]/20 dark:border-[#00DD89]/30">
                      <Heart className="w-8 h-8 text-[#00DD89] mx-auto mb-4" />
                      <div className="text-3xl font-bold text-[#00DD89] mb-2">13</div>
                      <div className="text-sm text-gray-600 dark:text-white/60">Provinces/Territories</div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200/50 dark:border-gray-400/30">
                  <div className="text-center">
                    <div className="text-2xl font-bold bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent mb-1">95%</div>
                    <div className="text-xs text-gray-600 dark:text-white/60">Coverage Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold bg-gradient-to-r from-[#00DD89] to-[#00AFE6] bg-clip-text text-transparent mb-1">24/7</div>
                    <div className="text-xs text-gray-600 dark:text-white/60">Support Available</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent mb-1">3.2K+</div>
                    <div className="text-xs text-gray-600 dark:text-white/60">Patients Served</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Enhanced Filters and Search Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
              Filter & Search Directory
            </h2>
            <p className="text-gray-600 dark:text-white/70 text-center max-w-2xl mx-auto">
              Use advanced filters to find the right healthcare providers for your needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search centers, cities, or specialties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl pl-12 pr-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-[#00AFE6] transition-colors"
              />
            </div>
            
            {/* Province Filter */}
            <div>
              <select
                value={selectedProvince || ''}
                onChange={(e) => setSelectedProvince(e.target.value || null)}
                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#00AFE6] transition-colors"
              >
                <option value="">All Provinces/Territories</option>
                {provinces.map(province => (
                  <option key={province.code} value={province.code}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Program Type Filter */}
            <div>
              <select
                value={selectedProgramType || ''}
                onChange={(e) => setSelectedProgramType(e.target.value || null)}
                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#00AFE6] transition-colors"
              >
                <option value="">All Program Types</option>
                {programTypes.map(type => (
                  <option key={type.name} value={type.name}>
                    {type.name} ({type.count})
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Results Summary with View Mode Toggle */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-gray-600 dark:text-white/70">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredCenters.length)} of {filteredCenters.length} centers
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-white/50">Last Reviewed:</span>
                <span className="text-sm text-gray-900 dark:text-white font-medium">December 2024</span>
                <Clock className="w-4 h-4 text-gray-400" />
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                      : 'text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                  List
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'map' 
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                      : 'text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Map className="w-4 h-4" />
                  Map
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Enhanced Directory Listing */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          {viewMode === 'list' ? (
            <>
              <div className="grid lg:grid-cols-2 gap-8">
                {paginatedCenters.map((center, index) => (
                  <motion.div
                    key={center.id}
                    className="bg-gradient-to-br from-gray-50/80 to-white/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-400/30 hover:shadow-2xl transition-all duration-300 cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    onClick={() => handleCenterClick(center)}
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Header with metadata */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r from-[#00AFE6] to-[#00DD89]">
                          {center.type === 'hospital' ? <Hospital className="w-6 h-6 text-white" /> :
                           center.type === 'clinic' ? <Stethoscope className="w-6 h-6 text-white" /> :
                           center.type === 'research' ? <Microscope className="w-6 h-6 text-white" /> :
                           <Building2 className="w-6 h-6 text-white" />}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{center.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-white/70">{center.city}, {center.province}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/50 mb-1">
                          <Calendar className="w-4 h-4" />
                          <span>Last Updated: Dec 2024</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-600 dark:text-green-400 font-medium">Verified</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Subspecialty */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">Primary Subspecialty</h4>
                      <div className="flex flex-wrap gap-2">
                        {center.specialties.slice(0, 3).map((specialty, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 text-[#00AFE6] dark:text-[#00AFE6] rounded-full text-sm font-medium border border-[#00AFE6]/20">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Services */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">Services Available</h4>
                      <div className="flex flex-wrap gap-2">
                        {center.services.slice(0, 4).map((service, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white/80 rounded-full text-xs">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Referral Status */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-white/70">Referral Status:</span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">Required</span>
                      </div>
                    </div>
                    
                    {/* Contact Quick Actions */}
                    <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300">
                        <Phone className="w-4 h-4" />
                        Call
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300">
                        <Mail className="w-4 h-4" />
                        Email
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300">
                        <Eye className="w-4 h-4" />
                        Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        currentPage === page
                          ? 'bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Map View */
            <div className="bg-gradient-to-br from-gray-50/80 to-white/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50 dark:border-gray-400/30">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Clustered Geospatial Map View</h3>
                <p className="text-gray-600 dark:text-white/70">Interactive map showing healthcare centers across Canada</p>
              </div>
              
              <div className="relative w-full max-w-4xl mx-auto">
                <img 
                  src={canadaMapPath}
                  alt="Canada Map showing healthcare centers"
                  className="w-full h-auto rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-400/30"
                />
                
                {/* Interactive Map Points */}
                {healthcareCenters.map((center) => (
                  <motion.div
                    key={center.id}
                    className="absolute w-6 h-6 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full shadow-lg cursor-pointer hover:scale-125 transition-transform duration-300 z-10"
                    style={{
                      left: `${center.coordinates.x}%`,
                      top: `${center.coordinates.y}%`
                    }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: Math.random() * 2 }}
                    onClick={() => handleCenterClick(center)}
                    whileHover={{ scale: 1.3 }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Contributor CTA Section */}
      <section className="py-16 bg-gradient-to-br from-[#00AFE6]/5 to-[#00DD89]/5 dark:from-[#00AFE6]/10 dark:to-[#00DD89]/10">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <motion.div
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 backdrop-blur-xl rounded-full px-6 py-3 border border-[#00AFE6]/30 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Upload className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide">CONTRIBUTE TO DIRECTORY</span>
            </motion.div>
            
            <motion.h2
              className="text-4xl lg:text-5xl font-bold font-rosarivo mb-8 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                Know a clinic we're missing?
              </span>
            </motion.h2>
            
            <motion.p
              className="text-xl text-gray-600 dark:text-white/70 leading-relaxed mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Help us maintain the most comprehensive directory of amyloidosis care providers. Suggest new clinics or update existing information.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <button className="group bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-[#00AFE6]/25 transition-all duration-300 flex items-center gap-3">
                <Upload className="w-5 h-5" />
                Suggest a Clinic
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-gray-900/10 dark:bg-white/10 backdrop-blur-xl text-gray-900 dark:text-white px-8 py-4 rounded-xl font-semibold border border-gray-900/20 dark:border-white/20 hover:bg-gray-900/20 dark:hover:bg-white/20 transition-all duration-300 flex items-center gap-3">
                <FileText className="w-5 h-5" />
                Update Information
              </button>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Inclusion Criteria & Review Cycle Documentation */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 backdrop-blur-xl rounded-full px-6 py-3 border border-[#00AFE6]/30 mb-6">
              <Shield className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide">QUALITY ASSURANCE</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                Directory Standards &
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Review Process
              </span>
            </h2>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Inclusion Criteria */}
            <motion.div
              className="bg-gradient-to-br from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/50 dark:border-blue-400/30"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-200">Inclusion Criteria</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">Clinical Expertise</h4>
                    <p className="text-blue-800 dark:text-blue-300 text-sm">Healthcare providers with documented experience in amyloidosis diagnosis or treatment</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">Specialty Services</h4>
                    <p className="text-blue-800 dark:text-blue-300 text-sm">Dedicated amyloidosis programs, multidisciplinary teams, or specialized diagnostic capabilities</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">Geographic Coverage</h4>
                    <p className="text-blue-800 dark:text-blue-300 text-sm">Representation across all Canadian provinces and territories</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">Verified Information</h4>
                    <p className="text-blue-800 dark:text-blue-300 text-sm">Current contact details, services offered, and referral requirements</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Review Cycle */}
            <motion.div
              className="bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 backdrop-blur-xl rounded-2xl p-8 border border-green-200/50 dark:border-green-400/30"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-green-900 dark:text-green-200">Review Cycle</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-green-900 dark:text-green-200 mb-1">Quarterly Reviews</h4>
                    <p className="text-green-800 dark:text-green-300 text-sm">Complete directory review every 3 months to ensure accuracy</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-green-900 dark:text-green-200 mb-1">Real-time Updates</h4>
                    <p className="text-green-800 dark:text-green-300 text-sm">Immediate updates when centers report changes or new information</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-green-900 dark:text-green-200 mb-1">Professional Verification</h4>
                    <p className="text-green-800 dark:text-green-300 text-sm">Direct contact with healthcare providers to verify services and expertise</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-green-900 dark:text-green-200 mb-1">Community Feedback</h4>
                    <p className="text-green-800 dark:text-green-300 text-sm">Integration of feedback from patients, families, and healthcare professionals</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Backend Process Documentation */}
          <motion.div
            className="mt-12 bg-gradient-to-br from-purple-50/80 to-violet-50/80 dark:from-purple-900/20 dark:to-violet-900/20 backdrop-blur-xl rounded-2xl p-8 border border-purple-200/50 dark:border-purple-400/30"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-200">Backend Vetting Process</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-3">Initial Vetting</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                    <span className="text-purple-800 dark:text-purple-300 text-sm">Medical license verification</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                    <span className="text-purple-800 dark:text-purple-300 text-sm">Hospital/clinic accreditation check</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                    <span className="text-purple-800 dark:text-purple-300 text-sm">Specialty certification confirmation</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-3">Ongoing Maintenance</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">4</div>
                    <span className="text-purple-800 dark:text-purple-300 text-sm">Annual contact verification</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">5</div>
                    <span className="text-purple-800 dark:text-purple-300 text-sm">Service offering updates</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">6</div>
                    <span className="text-purple-800 dark:text-purple-300 text-sm">Quality assurance reviews</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Healthcare Center Modal */}
      <HealthcareCenterModal
        center={selectedCenter}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}
