import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { apiRequest } from "@/lib/queryClient";
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
  { value: "toolkit", label: "Toolkit" },
  { value: "guidelines", label: "Guidelines" },
  { value: "articles", label: "Articles" },
  { value: "webinars", label: "Webinars" },
  { value: "libraries", label: "Libraries" },
  { value: "education", label: "Education" }
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
  { value: "fr", label: "French" }
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

  const downloadMutation = useMutation({
    mutationFn: async (resourceId: number) => {
      await apiRequest(`/api/resources/${resourceId}/download`, 'POST');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/resources'] });
    }
  });

  const handleDownload = async (resource: Resource) => {
    // Track download
    downloadMutation.mutate(resource.id);
    
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
      {/* Header */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-black" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-gray-200/20 dark:via-white/5 to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 mb-6">
              <BookOpen className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-sm font-medium text-white/90">{t('resources.title')}</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold font-rosarivo mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                {t('resources.title')}
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                for Healthcare Professionals
              </span>
            </h1>
            
            <p className="text-xl text-white/70 leading-relaxed max-w-3xl mx-auto">
              {t('resources.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-white/10">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Search and Filter Controls */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-8 shadow-2xl">
              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <Input
                  type="text"
                  placeholder={t('resources.search.placeholder')}
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-12 h-14 bg-white/20 border-white/30 text-white placeholder-white/60 text-lg rounded-xl focus:ring-2 focus:ring-[#00AFE6] focus:border-[#00AFE6]"
                />
              </div>

              {/* Filter Toggle and Quick Filters */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" className="border-white/30 text-white hover:bg-white/20 bg-white/15">
                        <Filter className="w-4 h-4 mr-2" />
                        {t('resources.filters.advanced')}
                        {activeFiltersCount > 0 && (
                          <Badge variant="secondary" className="ml-2 bg-[#00AFE6] text-white">
                            {activeFiltersCount}
                          </Badge>
                        )}
                        <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 ${isFiltersOpen ? 'rotate-180' : ''}`} />
                      </Button>
                    </CollapsibleTrigger>
                  </Collapsible>

                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" onClick={clearFilters} className="text-white/80 hover:text-white hover:bg-white/20">
                      <X className="w-4 h-4 mr-2" />
                      {t('resources.filters.clearAll')}
                    </Button>
                  )}
                </div>

                {/* Quick Filter Buttons */}
                <div className="flex flex-wrap gap-2">
                  {['AL', 'ATTR', 'AA', 'ALect2'].map((type) => (
                    <Button
                      key={type}
                      size="sm"
                      onClick={() => setFilters(prev => ({ 
                        ...prev, 
                        amyloidosisType: prev.amyloidosisType === type ? 'all' : type 
                      }))}
                      className={
                        filters.amyloidosisType === type 
                          ? "bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white border-0 hover:from-[#00AFE6]/90 hover:to-[#00DD89]/90 font-medium" 
                          : "bg-white/10 border border-white/30 text-white hover:text-white hover:bg-white/20 font-medium"
                      }
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Advanced Filters */}
              <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                <CollapsibleContent className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-white/15 rounded-xl border border-white/20">
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">Amyloidosis Type</label>
                      <Select value={filters.amyloidosisType} onValueChange={(value) => setFilters(prev => ({ ...prev, amyloidosisType: value }))}>
                        <SelectTrigger className="bg-white/20 border-white/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {amyloidosisTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">Resource Type</label>
                      <Select value={filters.resourceType} onValueChange={(value) => setFilters(prev => ({ ...prev, resourceType: value }))}>
                        <SelectTrigger className="bg-white/20 border-white/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {resourceTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">Category</label>
                      <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger className="bg-white/20 border-white/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">Audience</label>
                      <Select value={filters.audience} onValueChange={(value) => setFilters(prev => ({ ...prev, audience: value }))}>
                        <SelectTrigger className="bg-white/20 border-white/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {audiences.map(audience => (
                            <SelectItem key={audience.value} value={audience.value}>{audience.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">Language</label>
                      <Select value={filters.language} onValueChange={(value) => setFilters(prev => ({ ...prev, language: value }))}>
                        <SelectTrigger className="bg-white/20 border-white/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map(language => (
                            <SelectItem key={language.value} value={language.value}>{language.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">Region</label>
                      <Select value={filters.region} onValueChange={(value) => setFilters(prev => ({ ...prev, region: value }))}>
                        <SelectTrigger className="bg-white/20 border-white/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map(region => (
                            <SelectItem key={region.value} value={region.value}>{region.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-12 bg-gray-900">
        <div className="container mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className={`backdrop-blur-xl border animate-pulse ${
                  i % 4 === 0 
                    ? 'bg-gradient-to-br from-blue-900/25 to-indigo-900/25 border-blue-400/30'
                    : i % 4 === 1
                    ? 'bg-gradient-to-br from-emerald-900/25 to-green-900/25 border-emerald-400/30'
                    : i % 4 === 2
                    ? 'bg-gradient-to-br from-purple-900/25 to-violet-900/25 border-purple-400/30'
                    : 'bg-gradient-to-br from-pink-900/25 to-rose-900/25 border-pink-400/30'
                }`}>
                  <CardHeader>
                    <div className="h-4 bg-white/10 rounded mb-2"></div>
                    <div className="h-3 bg-white/10 rounded w-2/3"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-white/10 rounded mb-4"></div>
                    <div className="h-8 bg-white/10 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400 text-lg mb-4">Failed to load resources</p>
              <p className="text-white/60">Please try again later or contact support if the problem persists.</p>
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <p className="text-white/60 text-lg mb-4">No resources found</p>
              <p className="text-white/40">Try adjusting your search criteria or filters.</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-white/60">
                  Showing {resources.length} resource{resources.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className={`backdrop-blur-xl border transition-all duration-300 h-full hover:shadow-2xl ${
                      resource.id % 4 === 0 
                        ? 'bg-gradient-to-br from-blue-900/25 to-indigo-900/25 border-blue-400/30 hover:from-blue-800/35 hover:to-indigo-800/35 hover:border-blue-300/40 hover:shadow-blue-500/25'
                        : resource.id % 4 === 1
                        ? 'bg-gradient-to-br from-emerald-900/25 to-green-900/25 border-emerald-400/30 hover:from-emerald-800/35 hover:to-green-800/35 hover:border-emerald-300/40 hover:shadow-emerald-500/25'
                        : resource.id % 4 === 2
                        ? 'bg-gradient-to-br from-purple-900/25 to-violet-900/25 border-purple-400/30 hover:from-purple-800/35 hover:to-violet-800/35 hover:border-purple-300/40 hover:shadow-purple-500/25'
                        : 'bg-gradient-to-br from-pink-900/25 to-rose-900/25 border-pink-400/30 hover:from-pink-800/35 hover:to-rose-800/35 hover:border-pink-300/40 hover:shadow-pink-500/25'
                    }`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(resource.category)}
                            <Badge variant="secondary" className="text-xs">
                              {resource.category}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            {getFileIcon(resource.fileType)}
                            <span className="text-xs text-white/60 uppercase">
                              {resource.fileType}
                            </span>
                          </div>
                        </div>
                        
                        <CardTitle className="text-lg font-semibold text-white line-clamp-2">
                          {resource.title}
                        </CardTitle>
                        
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="outline" className="text-xs border-[#00AFE6]/30 text-[#00AFE6]">
                            {resource.amyloidosisType}
                          </Badge>
                          <Badge variant="outline" className="text-xs border-white/20 text-white/70">
                            {resource.audience}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        {resource.description && (
                          <p className="text-white/70 text-sm mb-4 line-clamp-3">
                            {resource.description}
                          </p>
                        )}
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-xs text-white/50">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(resource.createdAt || null)}</span>
                          </div>
                          
                          {resource.submittedBy && (
                            <div className="flex items-center gap-2 text-xs text-white/50">
                              <User className="w-3 h-3" />
                              <span>By {resource.submittedBy}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 text-xs text-white/50">
                            <Download className="w-3 h-3" />
                            <span>{resource.downloadCount || 0} downloads</span>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => handleDownload(resource)}
                          className="w-full bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/80 hover:to-[#00DD89]/80 text-white border-0"
                          disabled={downloadMutation.isPending}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download{formatFileSize(resource.fileSize)}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}