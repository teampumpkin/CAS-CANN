import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Search, 
  Filter, 
  Download, 
  FileText, 
  BookOpen, 
  Video, 
  Users, 
  Globe, 
  FileCheck,
  Calendar,
  User,
  ChevronDown,
  X,
  Plus,
  Eye,
  Upload,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  MapPin,
  Languages,
  Stethoscope,
  FileUserIcon,
  ClipboardList,
  ArrowRight,
  Heart,
  ExternalLink,
  Flag,
  Sparkles,
  Edit3,
  FileEdit,
  Award,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { Resource } from "@shared/schema";

interface ResourceFilters {
  search: string;
  amyloidosisType: string;
  resourceType: string;
  category: string;
  audience: string;
  language: string;
  region: string;
}

// Helper function to get amyloidosis types with translations
const getAmyloidosisTypes = (t: any) => [
  { value: "all", label: t('resources.types.all') },
  { value: "AL", label: t('resources.types.al') },
  { value: "ATTR", label: t('resources.types.attr') },
  { value: "AA", label: t('resources.types.aa') },
  { value: "ALect2", label: t('resources.types.alect2') },
  { value: "General", label: t('resources.types.general') }
];

const resourceTypes = [
  { value: "all", label: "All Types" },
  { value: "form", label: "Forms" },
  { value: "tool", label: "Tools" },
  { value: "article", label: "Articles" },
  { value: "pathway", label: "Pathways" },
  { value: "visual", label: "Visuals" },
  { value: "research", label: "Research" }
];

const categories = [
  { value: "all", label: "All Categories" },
  { value: "diagnostic-tools", label: "Diagnostic Tools", icon: Stethoscope },
  { value: "referral-pathways", label: "Referral Pathways", icon: ArrowRight },
  { value: "sops", label: "SOPs", icon: ClipboardList },
  { value: "patient-handouts", label: "Patient Handouts", icon: FileUserIcon }
];

const audiences = [
  { value: "all", label: "All Audiences" },
  { value: "clinician", label: "Clinicians" },
  { value: "patient", label: "Patients" },
  { value: "caregiver", label: "Caregivers" },
  { value: "researcher", label: "Researchers" }
];

const languages = [
  { value: "all", label: "All Languages" },
  { value: "en", label: "English" },
  { value: "fr", label: "French" },
  { value: "bilingual", label: "Bilingual (EN/FR)" }
];

const regions = [
  { value: "all", label: "All Regions" },
  { value: "national", label: "National" },
  { value: "BC", label: "British Columbia" },
  { value: "AB", label: "Alberta" },
  { value: "SK", label: "Saskatchewan" },
  { value: "MB", label: "Manitoba" },
  { value: "ON", label: "Ontario" },
  { value: "QC", label: "Quebec" },
  { value: "NB", label: "New Brunswick" },
  { value: "NS", label: "Nova Scotia" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "YT", label: "Yukon" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NU", label: "Nunavut" }
];

const getFileIcon = (fileType: string) => {
  switch (fileType.toLowerCase()) {
    case 'pdf':
      return <FileText className="w-5 h-5 text-red-500" />;
    case 'docx':
    case 'doc':
      return <FileCheck className="w-5 h-5 text-blue-500" />;
    case 'xlsx':
    case 'xls':
      return <BookOpen className="w-5 h-5 text-green-500" />;
    case 'png':
    case 'jpg':
    case 'jpeg':
      return <Eye className="w-5 h-5 text-purple-500" />;
    default:
      return <FileText className="w-5 h-5 text-gray-500" />;
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'toolkit':
      return <FileCheck className="w-4 h-4" />;
    case 'guidelines':
      return <BookOpen className="w-4 h-4" />;
    case 'articles':
      return <FileText className="w-4 h-4" />;
    case 'webinars':
      return <Video className="w-4 h-4" />;
    case 'libraries':
      return <Globe className="w-4 h-4" />;
    case 'education':
      return <Users className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

const formatFileSize = (size: string | null) => {
  if (!size) return '';
  return ` (${size})`;
};

const formatDate = (date: string | Date | null) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function Resources() {
  const { t } = useLanguage();
  
  // Get translated amyloidosis types
  const amyloidosisTypes = getAmyloidosisTypes(t);
  
  const [filters, setFilters] = useState<ResourceFilters>({
    search: '',
    amyloidosisType: 'all',
    resourceType: 'all',
    category: 'all',
    audience: 'all',
    language: 'all',
    region: 'all'
  });
  
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const queryClient = useQueryClient();

  // Build query parameters
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.amyloidosisType !== 'all') params.append('amyloidosisType', filters.amyloidosisType);
    if (filters.resourceType !== 'all') params.append('resourceType', filters.resourceType);
    if (filters.category !== 'all') params.append('category', filters.category);
    if (filters.audience !== 'all') params.append('audience', filters.audience);
    if (filters.language !== 'all') params.append('language', filters.language);
    if (filters.region !== 'all') params.append('region', filters.region);
    
    // Always show only approved and public resources for now
    params.append('isApproved', 'true');
    params.append('isPublic', 'true');
    
    return params.toString();
  }, [filters]);

  const { data: resources = [], isLoading, error } = useQuery({
    queryKey: ['/api/resources', queryParams],
    queryFn: async () => {
      const response = await fetch(`/api/resources?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch resources');
      }
      return response.json() as Promise<Resource[]>;
    }
  });

  const handleDownload = async (resource: Resource) => {
    // Track download
    try {
      await fetch(`/api/resources/${resource.id}/download`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Failed to track download:', error);
    }
    
    // Open file in new tab
    window.open(resource.fileUrl, '_blank');
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      amyloidosisType: 'all',
      resourceType: 'all',
      category: 'all',
      audience: 'all',
      language: 'all',
      region: 'all'
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => value && value !== 'all').length;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Enhanced Header */}
      <section className="py-24 bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-50 dark:bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/60 via-cyan-50/40 to-slate-100/60 dark:from-gray-800 dark:via-gray-900 dark:to-black" />
        
        {/* Brand Color Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#00AFE6]/15 rounded-full blur-3xl -translate-x-48 -translate-y-48" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00DD89]/15 rounded-full blur-3xl translate-x-48 translate-y-48" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 backdrop-blur-xl rounded-full px-6 py-3 border border-[#00AFE6]/20 mb-6 shadow-lg">
              <BookOpen className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-sm font-medium text-gray-800 dark:text-white/90">Professional Resources</span>
            </div>
            
            <h1 className="text-5xl font-bold font-rosarivo mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                Clinical Practice Resources
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-white/70 mb-8 max-w-3xl mx-auto">
              Evidence-based tools, pathways, and resources for healthcare professionals managing amyloidosis patients across Canada
            </p>
            
            {/* Resource Categories Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {categories.filter(cat => cat.value !== 'all').map((category, index) => {
                const Icon = category.icon;
                return (
                  <motion.div
                    key={category.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-800/80 dark:to-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-[#00AFE6]/30 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{category.label}</h3>
                    <p className="text-sm text-gray-600 dark:text-white/70">
                      {category.value === 'diagnostic-tools' && 'Assessment tools, screening protocols, and diagnostic aids'}
                      {category.value === 'referral-pathways' && 'Structured referral guidelines and care pathways'}
                      {category.value === 'sops' && 'Standard operating procedures and clinical protocols'}
                      {category.value === 'patient-handouts' && 'Educational materials and patient information sheets'}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Enhanced Resource Categories with Submission CTA */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Submission CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 rounded-xl p-8 mb-12 border border-[#00AFE6]/20"
            >
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-center lg:text-left">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    <Upload className="w-6 h-6 inline mr-2 text-[#00AFE6]" />
                    Contribute to the Knowledge Base
                  </h2>
                  <p className="text-gray-600 dark:text-white/70 mb-4">
                    Share your clinical tools, protocols, and educational materials with the Canadian amyloidosis community
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                    <Badge variant="outline" className="border-[#00AFE6]/30 text-[#00AFE6]">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Peer Reviewed
                    </Badge>
                    <Badge variant="outline" className="border-[#00DD89]/30 text-[#00DD89]">
                      <Shield className="w-3 h-3 mr-1" />
                      Quality Assured
                    </Badge>
                    <Badge variant="outline" className="border-gray-400 text-gray-600 dark:text-gray-400">
                      <Globe className="w-3 h-3 mr-1" />
                      National Access
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/80 hover:to-[#00DD89]/80 text-white border-0 shadow-lg"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Resource
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-gray-300 hover:border-[#00AFE6]/50"
                  >
                    <FileEdit className="w-5 h-5 mr-2" />
                    Editorial Policy
                  </Button>
                </div>
              </div>
            </motion.div>
            
            {/* Enhanced Filters Section */}
            <div className="bg-white/80 dark:bg-white/10 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/20 p-6 mb-8 shadow-lg">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-white/60 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search resources..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-12 h-12 bg-white dark:bg-white/20 border-gray-300 dark:border-white/30 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/60 rounded-xl focus:ring-2 focus:ring-[#00AFE6] focus:border-[#00AFE6]"
                  />
                </div>
                
                {/* Filter Controls */}
                <div className="flex flex-wrap gap-4 items-center">
                  <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="w-48 h-12 bg-white dark:bg-white/20 border-gray-300 dark:border-white/30 rounded-xl">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={filters.language} onValueChange={(value) => setFilters(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger className="w-48 h-12 bg-white dark:bg-white/20 border-gray-300 dark:border-white/30 rounded-xl">
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map(lang => (
                        <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={filters.region} onValueChange={(value) => setFilters(prev => ({ ...prev, region: value }))}>
                    <SelectTrigger className="w-48 h-12 bg-white dark:bg-white/20 border-gray-300 dark:border-white/30 rounded-xl">
                      <SelectValue placeholder="Region" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map(region => (
                        <SelectItem key={region.value} value={region.value}>{region.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="h-12 px-4 border-gray-300 dark:border-white/30 hover:border-red-400 hover:text-red-600"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Clear ({activeFiltersCount})
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Resource Display */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Results Summary */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Resources Found
                </h2>
                <Badge variant="outline" className="bg-[#00AFE6]/10 border-[#00AFE6]/30 text-[#00AFE6] px-3 py-1">
                  {resources.length} resources
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/70">
                <Clock className="w-4 h-4" />
                <span>Updated daily</span>
              </div>
            </div>

            {/* Resource Cards */}
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00AFE6]"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-white/70">Failed to load resources. Please try again.</p>
              </div>
            ) : resources.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-white/70">No resources found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group"
                  >
                    <Card className="h-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:border-[#00AFE6]/50 group-hover:scale-105">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2">
                              {resource.title}
                            </CardTitle>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge 
                                variant="secondary" 
                                className={`
                                  ${resource.category === 'diagnostic-tools' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : ''}
                                  ${resource.category === 'referral-pathways' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : ''}
                                  ${resource.category === 'sops' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : ''}
                                  ${resource.category === 'patient-handouts' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' : ''}
                                `}
                              >
                                {categories.find(cat => cat.value === resource.category)?.label || 'Resource'}
                              </Badge>
                              
                              {/* New/Updated Flag */}
                              {resource.createdAt && new Date(resource.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000 && (
                                <Badge className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  New
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        {resource.description && (
                          <p className="text-gray-600 dark:text-white/70 text-sm mb-4 line-clamp-3">
                            {resource.description}
                          </p>
                        )}
                        
                        {/* Enhanced Metadata */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-white/50">
                            <User className="w-3 h-3" />
                            <span>Source: {resource.submittedBy || 'CAS Editorial Team'}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-white/50">
                            <Shield className="w-3 h-3" />
                            <span>Review Status: {resource.isApproved ? 'Peer Reviewed' : 'Under Review'}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-white/50">
                            <Languages className="w-3 h-3" />
                            <span>Language: {resource.language === 'en' ? 'English' : resource.language === 'fr' ? 'French' : 'Bilingual'}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-white/50">
                            <MapPin className="w-3 h-3" />
                            <span>Region: {resource.region || 'National'}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-white/50">
                            <Download className="w-3 h-3" />
                            <span>{resource.downloadCount || 0} downloads</span>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => handleDownload(resource)}
                          className="w-full bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/80 hover:to-[#00DD89]/80 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Resource
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
