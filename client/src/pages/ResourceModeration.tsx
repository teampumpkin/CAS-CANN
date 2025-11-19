import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Shield, 
  Check, 
  X, 
  Eye, 
  Download, 
  Clock, 
  User, 
  FileText, 
  AlertTriangle,
  Filter,
  Search,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Resource } from "@shared/schema";

interface ModerationFilters {
  search: string;
  status: string;
  amyloidosisType: string;
  category: string;
  submittedBy: string;
}

const moderationStatuses = [
  { value: "all", label: "All Submissions" },
  { value: "pending", label: "Pending Review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "flagged", label: "Flagged for Enhancement" }
];

const getStatusColor = (isApproved: boolean, isFlagged?: boolean) => {
  if (isApproved) return "text-green-400 bg-green-400/20 border-green-400/30";
  if (isFlagged) return "text-yellow-400 bg-yellow-400/20 border-yellow-400/30";
  return "text-orange-400 bg-orange-400/20 border-orange-400/30";
};

const getStatusLabel = (isApproved: boolean, isFlagged?: boolean) => {
  if (isApproved) return "Approved";
  if (isFlagged) return "Flagged";
  return "Pending";
};

const formatDate = (date: string | Date | null) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function ResourceModeration() {
  const [filters, setFilters] = useState<ModerationFilters>({
    search: '',
    status: 'pending',
    amyloidosisType: 'all',
    category: 'all',
    submittedBy: ''
  });
  
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [moderationNote, setModerationNote] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Build query parameters for moderation queue
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.amyloidosisType !== 'all') params.append('amyloidosisType', filters.amyloidosisType);
    if (filters.category !== 'all') params.append('category', filters.category);
    if (filters.submittedBy) params.append('submittedBy', filters.submittedBy);
    
    // Filter by approval status
    if (filters.status === 'pending') {
      params.append('isApproved', 'false');
    } else if (filters.status === 'approved') {
      params.append('isApproved', 'true');
    }
    
    return params.toString();
  }, [filters]);

  const { data: resources = [], isLoading, error } = useQuery({
    queryKey: ['/api/resources/moderation', queryParams],
    queryFn: async () => {
      const response = await fetch(`/api/resources?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch resources for moderation');
      }
      return response.json() as Promise<Resource[]>;
    }
  });

  const approveMutation = useMutation({
    mutationFn: async ({ resourceId, note }: { resourceId: number; note?: string }) => {
      return await apiRequest('PUT', `/api/resources/${resourceId}`, {
        isApproved: true,
        moderatedBy: 'Admin', // In real app, this would be the current user
        moderationNote: note
      });
    },
    onSuccess: () => {
      toast({
        title: "Resource Approved",
        description: "The resource has been approved and is now publicly available.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/resources/moderation'] });
      queryClient.invalidateQueries({ queryKey: ['/api/resources'] });
      setSelectedResource(null);
      setModerationNote('');
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve resource. Please try again.",
        variant: "destructive",
      });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ resourceId, note }: { resourceId: number; note: string }) => {
      return await apiRequest('DELETE', `/api/resources/${resourceId}`);
    },
    onSuccess: () => {
      toast({
        title: "Resource Rejected",
        description: "The resource has been rejected and removed from the queue.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/resources/moderation'] });
      queryClient.invalidateQueries({ queryKey: ['/api/resources'] });
      setSelectedResource(null);
      setModerationNote('');
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject resource. Please try again.",
        variant: "destructive",
      });
    }
  });

  const flagMutation = useMutation({
    mutationFn: async ({ resourceId, note }: { resourceId: number; note: string }) => {
      return await apiRequest('PUT', `/api/resources/${resourceId}`, {
        isFlagged: true,
        moderatedBy: 'Admin',
        moderationNote: note
      });
    },
    onSuccess: () => {
      toast({
        title: "Resource Flagged",
        description: "The resource has been flagged for enhancement.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/resources/moderation'] });
      queryClient.invalidateQueries({ queryKey: ['/api/resources'] });
      setSelectedResource(null);
      setModerationNote('');
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to flag resource. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleApprove = (resource: Resource) => {
    approveMutation.mutate({ 
      resourceId: resource.id, 
      note: moderationNote || 'Approved without modifications' 
    });
  };

  const handleReject = (resource: Resource) => {
    if (!moderationNote.trim()) {
      toast({
        title: "Moderation Note Required",
        description: "Please provide a reason for rejecting this resource.",
        variant: "destructive",
      });
      return;
    }
    
    rejectMutation.mutate({ 
      resourceId: resource.id, 
      note: moderationNote 
    });
  };

  const handleFlag = (resource: Resource) => {
    if (!moderationNote.trim()) {
      toast({
        title: "Enhancement Note Required",
        description: "Please specify what enhancements are needed.",
        variant: "destructive",
      });
      return;
    }
    
    flagMutation.mutate({ 
      resourceId: resource.id, 
      note: moderationNote 
    });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'pending',
      amyloidosisType: 'all',
      category: 'all',
      submittedBy: ''
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value && value !== 'all' && value !== 'pending'
  ).length;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <section className="py-24 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 mb-6">
              <Shield className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-sm font-medium text-white/90">Resource Moderation</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold font-rosarivo mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Moderation
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
            
            <p className="text-xl text-white/70 leading-relaxed max-w-3xl mx-auto">
              Review and moderate submitted resources to maintain the quality and accuracy of Canada's trusted amyloidosis resource library.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-12 bg-gray-900 border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-8">
              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search resources by title or submitter..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-12 h-14 bg-white/20 border-white/30 text-white placeholder-white/60 text-lg rounded-xl"
                />
              </div>

              {/* Filter Controls */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger className="bg-white/15 border-white/30 text-white w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {moderationStatuses.map(status => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" className="border-white/30 text-white hover:bg-white/20 bg-white/15">
                        <Filter className="w-4 h-4 mr-2" />
                        More Filters
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
                      Clear All
                    </Button>
                  )}
                </div>

                <div className="text-white/60 text-sm">
                  {resources.length} resource{resources.length !== 1 ? 's' : ''} in queue
                </div>
              </div>

              {/* Advanced Filters */}
              <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                <CollapsibleContent className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-white/15 rounded-xl border border-white/20">
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">Amyloidosis Type</label>
                      <Select value={filters.amyloidosisType} onValueChange={(value) => setFilters(prev => ({ ...prev, amyloidosisType: value }))}>
                        <SelectTrigger className="bg-white/20 border-white/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="AL">AL (Light Chain)</SelectItem>
                          <SelectItem value="ATTR">ATTR (Transthyretin)</SelectItem>
                          <SelectItem value="AA">AA (Inflammatory)</SelectItem>
                          <SelectItem value="ALect2">ALect2</SelectItem>
                          <SelectItem value="General">General</SelectItem>
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
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="toolkit">Toolkit</SelectItem>
                          <SelectItem value="guidelines">Guidelines</SelectItem>
                          <SelectItem value="articles">Articles</SelectItem>
                          <SelectItem value="webinars">Webinars</SelectItem>
                          <SelectItem value="libraries">Libraries</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">Submitted By</label>
                      <Input
                        placeholder="Filter by submitter name..."
                        value={filters.submittedBy}
                        onChange={(e) => setFilters(prev => ({ ...prev, submittedBy: e.target.value }))}
                        className="bg-white/20 border-white/30 text-white placeholder-white/60"
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Queue */}
      <section className="py-12 bg-gray-900">
        <div className="container mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="bg-white/5 backdrop-blur-xl border-white/20 animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-white/10 rounded mb-4"></div>
                    <div className="h-4 bg-white/10 rounded mb-2"></div>
                    <div className="h-4 bg-white/10 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-400 text-lg mb-4">Failed to load moderation queue</p>
              <p className="text-white/60">Please try again later or contact support if the problem persists.</p>
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-12">
              <Check className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <p className="text-white/60 text-lg mb-4">No resources in moderation queue</p>
              <p className="text-white/40">All submitted resources have been reviewed.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {resources.map((resource) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="bg-white/5 backdrop-blur-xl border-white/20 hover:bg-white/10 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-lg font-semibold text-white">{resource.title}</h3>
                                <Badge className={`text-xs ${getStatusColor(resource.isApproved || false)}`}>
                                  {getStatusLabel(resource.isApproved || false)}
                                </Badge>
                                <Badge variant="outline" className="text-xs border-[#00AFE6]/30 text-[#00AFE6]">
                                  {resource.amyloidosisType}
                                </Badge>
                                <Badge variant="outline" className="text-xs border-white/20 text-white/70">
                                  {resource.category}
                                </Badge>
                              </div>
                              
                              <p className="text-white/70 text-sm mb-4 line-clamp-2">
                                {resource.description}
                              </p>
                              
                              <div className="flex items-center gap-6 text-xs text-white/50 mb-4">
                                <div className="flex items-center gap-2">
                                  <User className="w-3 h-3" />
                                  <span>{resource.submittedBy || 'Anonymous'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-3 h-3" />
                                  <span>{formatDate(resource.createdAt || null)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FileText className="w-3 h-3" />
                                  <span>{resource.fileType} • {resource.fileSize}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedResource(resource)}
                                className="border-white/30 text-white hover:bg-white/20"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-gray-800 border-white/20 text-white max-w-4xl">
                              <DialogHeader>
                                <DialogTitle className="text-white">Review Resource</DialogTitle>
                              </DialogHeader>
                              
                              {selectedResource && (
                                <div className="space-y-6">
                                  {/* File Preview Section */}
                                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                    <div className="flex items-center justify-between mb-3">
                                      <h4 className="font-medium text-white">File Preview</h4>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(selectedResource.fileUrl, '_blank')}
                                        className="border-[#00AFE6]/30 text-[#00AFE6] hover:bg-[#00AFE6]/20"
                                      >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download File
                                      </Button>
                                    </div>
                                    
                                    <div className="bg-white/10 rounded-lg overflow-hidden">
                                      {selectedResource.fileType?.startsWith('image/') ? (
                                        <img 
                                          src={selectedResource.fileUrl} 
                                          alt={selectedResource.fileName}
                                          className="w-full max-h-96 object-contain"
                                        />
                                      ) : selectedResource.fileType === 'application/pdf' ? (
                                        <iframe
                                          src={selectedResource.fileUrl}
                                          className="w-full h-96"
                                          title={selectedResource.fileName}
                                        />
                                      ) : (
                                        <div className="flex flex-col items-center justify-center py-12">
                                          <FileText className="w-16 h-16 text-white/40 mb-4" />
                                          <p className="text-white/60 text-sm mb-2">{selectedResource.fileName}</p>
                                          <p className="text-white/40 text-xs">{selectedResource.fileType}</p>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open(selectedResource.fileUrl, '_blank')}
                                            className="mt-4 border-white/30 text-white hover:bg-white/20"
                                          >
                                            <Eye className="w-4 h-4 mr-2" />
                                            Open File
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <h4 className="font-medium text-white mb-2">Resource Details</h4>
                                      <div className="space-y-2 text-sm">
                                        <div><span className="text-white/60">Title:</span> {selectedResource.title}</div>
                                        <div><span className="text-white/60">Type:</span> {selectedResource.amyloidosisType}</div>
                                        <div><span className="text-white/60">Category:</span> {selectedResource.category}</div>
                                        <div><span className="text-white/60">Audience:</span> {selectedResource.audience}</div>
                                        <div><span className="text-white/60">Language:</span> {selectedResource.language}</div>
                                        <div><span className="text-white/60">Region:</span> {selectedResource.region}</div>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <h4 className="font-medium text-white mb-2">Submission Info</h4>
                                      <div className="space-y-2 text-sm">
                                        <div><span className="text-white/60">Submitted by:</span> {selectedResource.submittedBy || 'Anonymous'}</div>
                                        <div><span className="text-white/60">File:</span> {selectedResource.fileName}</div>
                                        <div><span className="text-white/60">Size:</span> {selectedResource.fileSize}</div>
                                        <div><span className="text-white/60">Submitted:</span> {formatDate(selectedResource.createdAt || null)}</div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium text-white mb-2">Description</h4>
                                    <p className="text-white/80 text-sm bg-white/5 p-3 rounded-3xl">
                                      {selectedResource.description}
                                    </p>
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-white/90 mb-2">
                                      Moderation Note (Optional)
                                    </label>
                                    <Textarea
                                      value={moderationNote}
                                      onChange={(e) => setModerationNote(e.target.value)}
                                      placeholder="Add notes about your decision or required enhancements..."
                                      rows={3}
                                      className="bg-white/10 border-white/30 text-white placeholder-white/50"
                                    />
                                  </div>
                                  
                                  <Alert className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89]/10 border-blue-500/30">
                                    <AlertTriangle className="h-4 w-4 text-blue-400" />
                                    <AlertDescription className="text-white/90">
                                      Please review the resource carefully before making a decision. Approved resources will be immediately available to all users.
                                    </AlertDescription>
                                  </Alert>
                                  
                                  <div className="flex justify-end gap-3">
                                    <Button
                                      variant="outline"
                                      onClick={() => handleReject(selectedResource)}
                                      disabled={rejectMutation.isPending}
                                      className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                                    >
                                      <X className="w-4 h-4 mr-2" />
                                      Reject
                                    </Button>
                                    
                                    <Button
                                      variant="outline"
                                      onClick={() => handleFlag(selectedResource)}
                                      disabled={flagMutation.isPending}
                                      className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20"
                                    >
                                      <AlertTriangle className="w-4 h-4 mr-2" />
                                      Flag for Enhancement
                                    </Button>
                                    
                                    <Button
                                      onClick={() => handleApprove(selectedResource)}
                                      disabled={approveMutation.isPending}
                                      className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-600/80 hover:to-green-500/80 text-white"
                                    >
                                      <Check className="w-4 h-4 mr-2" />
                                      Approve
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(resource.fileUrl, '_blank')}
                            className="text-white/70 hover:text-white hover:bg-white/20"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}