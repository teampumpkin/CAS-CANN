import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Upload, 
  FileText, 
  Check, 
  X, 
  AlertCircle,
  Info,
  Shield,
  UserCheck,
  Clock,
  Users,
  ExternalLink,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const uploadFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(255, "Title too long"),
  description: z.string().min(20, "Description must be at least 20 characters").max(1000, "Description too long"),
  amyloidosisType: z.string().min(1, "Please select an amyloidosis type"),
  resourceType: z.string().min(1, "Please select a document type"),
  category: z.string().min(1, "Please select a category"),
  audience: z.string().min(1, "Please select target audience"),
  language: z.string().min(1, "Please select language"),
  region: z.string().min(1, "Please select jurisdiction"),
  tags: z.string().min(1, "Please provide relevant tags"),
  submittedBy: z.string().min(1, "Please provide your name"),
  submitterRole: z.string().min(1, "Please specify your role"),
  submitterOrganization: z.string().min(1, "Please specify your organization"),
  consentAgreed: z.boolean().refine(val => val === true, "You must agree to the consent terms"),
  phiConfirmation: z.boolean().refine(val => val === true, "You must confirm no PHI is included"),
  editorialCharter: z.boolean().refine(val => val === true, "You must acknowledge the editorial charter"),
});

type UploadFormData = z.infer<typeof uploadFormSchema>;

const amyloidosisTypes = [
  { value: "AL", label: "AL (Light Chain)" },
  { value: "ATTR", label: "ATTR (Transthyretin)" },
  { value: "AA", label: "AA (Inflammatory)" },
  { value: "ALect2", label: "ALect2" },
  { value: "General", label: "General/Multiple Types" }
];

const resourceTypes = [
  { value: "diagnostic-tools", label: "Diagnostic Tools" },
  { value: "referral-pathways", label: "Referral Pathways" },
  { value: "sops", label: "Standard Operating Procedures" },
  { value: "patient-handouts", label: "Patient Handouts" },
  { value: "clinical-forms", label: "Clinical Forms" },
  { value: "research-materials", label: "Research Materials" }
];

const categories = [
  { value: "toolkit", label: "Clinical Toolkit" },
  { value: "guidelines", label: "Guidelines & Protocols" },
  { value: "articles", label: "Articles & Publications" },
  { value: "webinars", label: "Educational Content" },
  { value: "libraries", label: "Resource Libraries" },
  { value: "education", label: "Patient Education" }
];

const audiences = [
  { value: "clinician", label: "Clinicians & Healthcare Providers" },
  { value: "patient", label: "Patients" },
  { value: "caregiver", label: "Caregivers & Families" },
  { value: "researcher", label: "Researchers & Academics" }
];

const languages = [
  { value: "en", label: "English" },
  { value: "fr", label: "French" }
];

const regions = [
  { value: "national", label: "National (Canada-wide)" },
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

const acceptedFileTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/png",
  "image/jpeg",
  "image/jpg"
];

const getFileIcon = (fileType: string) => {
  const type = fileType.toLowerCase();
  if (type.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
  if (type.includes('word') || type.includes('document')) return <FileText className="w-5 h-5 text-blue-500" />;
  if (type.includes('excel') || type.includes('sheet')) return <FileText className="w-5 h-5 text-green-500" />;
  if (type.includes('image')) return <FileText className="w-5 h-5 text-purple-500" />;
  return <FileText className="w-5 h-5 text-gray-500" />;
};

export default function UploadResource() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<UploadFormData>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      title: "",
      description: "",
      amyloidosisType: "",
      resourceType: "",
      category: "",
      audience: "",
      language: "en",
      region: "national",
      tags: "",
      submittedBy: "",
      submitterRole: "",
      submitterOrganization: "",
      consentAgreed: false,
      phiConfirmation: false,
      editorialCharter: false,
    }
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: UploadFormData & { fileUrl: string; fileName: string; fileType: string; fileSize: string }) => {
      return await apiRequest('/api/resources', 'POST', {
        ...data,
        isPublic: true,
        requiresLogin: false,
        isApproved: false, // Requires moderation
        tags: [data.amyloidosisType, data.resourceType, data.category, data.audience, ...data.tags.split(',').map(tag => tag.trim()).filter(tag => tag)],
        downloadCount: 0
      });
    },
    onSuccess: () => {
      toast({
        title: "Resource Submitted Successfully",
        description: "Your resource has been submitted for review. It will be published after moderation approval.",
      });
      form.reset();
      setSelectedFile(null);
      setUploadProgress(0);
      queryClient.invalidateQueries({ queryKey: ['/api/resources'] });
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: "There was an error submitting your resource. Please try again.",
        variant: "destructive",
      });
      console.error("Upload error:", error);
    }
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    if (!acceptedFileTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF, DOCX, XLSX, or PNG file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const simulateFileUpload = async (file: File): Promise<{ url: string; size: string }> => {
    // Simulate file upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // In a real implementation, this would upload to a file storage service
    // For now, we'll use a placeholder URL
    const fileSize = (file.size / 1024 / 1024).toFixed(2) + " MB";
    return {
      url: `https://example.com/uploads/${Date.now()}-${file.name}`,
      size: fileSize
    };
  };

  const onSubmit = async (data: UploadFormData) => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Simulate file upload
      const { url, size } = await simulateFileUpload(selectedFile);
      
      // Submit resource data
      await uploadMutation.mutateAsync({
        ...data,
        fileUrl: url,
        fileName: selectedFile.name,
        fileType: selectedFile.name.split('.').pop()?.toUpperCase() || 'FILE',
        fileSize: size
      });
    } catch (error) {
      console.error("Upload process failed:", error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-900 dark:to-black" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-gray-900/5 dark:via-white/5 to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 bg-gray-900/10 dark:bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-gray-900/20 dark:border-white/20 mb-6">
              <Upload className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-sm font-medium text-gray-900/90 dark:text-white/90">Resource Submission</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold font-rosarivo mb-6 leading-none">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                Help Us Grow
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Canada's Trusted Resource Library
              </span>
            </h1>
            
            <p className="text-xl text-gray-700 dark:text-white/70 leading-relaxed max-w-3xl mx-auto">
              This upload tool allows clinicians, researchers, and administrators to share tools, documents, or links that improve amyloidosis diagnosis, treatment, and coordination.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Upload Form */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            
            {/* Submission Guidelines */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Who Can Submit */}
              <Card className="bg-gradient-to-br from-blue-50/95 to-cyan-50/95 dark:from-blue-900/25 dark:to-cyan-900/25 backdrop-blur-xl border-blue-200/50 dark:border-white/20">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#00AFE6]" />
                    Who Can Submit
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm text-gray-700 dark:text-white/80">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00DD89]" />
                      <span>Healthcare professionals (physicians, nurses, allied health)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00DD89]" />
                      <span>Researchers and academics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00DD89]" />
                      <span>Healthcare administrators</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00DD89]" />
                      <span>Medical societies and organizations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00DD89]" />
                      <span>Patient advocacy groups</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* What's Accepted */}
              <Card className="bg-gradient-to-br from-emerald-50/95 to-green-50/95 dark:from-emerald-900/25 dark:to-green-900/25 backdrop-blur-xl border-emerald-200/50 dark:border-white/20">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#00AFE6]" />
                    What Types Are Accepted
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm text-gray-700 dark:text-white/80">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00DD89]" />
                      <span>Diagnostic tools and checklists</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00DD89]" />
                      <span>Referral pathways and protocols</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00DD89]" />
                      <span>Standard operating procedures</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00DD89]" />
                      <span>Patient education materials</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00DD89]" />
                      <span>Clinical forms and templates</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge variant="outline" className="text-gray-700 dark:text-white/70 border-gray-400 dark:border-white/30">PDF</Badge>
                    <Badge variant="outline" className="text-gray-700 dark:text-white/70 border-gray-400 dark:border-white/30">DOCX</Badge>
                    <Badge variant="outline" className="text-gray-700 dark:text-white/70 border-gray-400 dark:border-white/30">XLSX</Badge>
                    <Badge variant="outline" className="text-gray-700 dark:text-white/70 border-gray-400 dark:border-white/30">PNG</Badge>
                    <Badge variant="outline" className="text-gray-700 dark:text-white/70 border-gray-400 dark:border-white/30">JPG</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Review Process */}
              <Card className="bg-gradient-to-br from-purple-50/95 to-violet-50/95 dark:from-purple-900/25 dark:to-violet-900/25 backdrop-blur-xl border-purple-200/50 dark:border-white/20">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#00AFE6]" />
                    Review Process
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-3 text-sm text-gray-700 dark:text-white/80">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#00AFE6] text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Initial Review</p>
                        <p className="text-gray-600 dark:text-white/70">Within 3-5 business days</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#00AFE6] text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Clinical Review</p>
                        <p className="text-gray-600 dark:text-white/70">7-14 business days</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#00DD89] text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Publication</p>
                        <p className="text-gray-600 dark:text-white/70">2-3 business days after approval</p>
                      </div>
                    </div>
                  </div>
                  <Alert className="bg-[#00AFE6]/10 border-[#00AFE6]/30">
                    <Clock className="w-4 h-4 text-[#00AFE6]" />
                    <AlertDescription className="text-gray-900 dark:text-white/90">
                      <strong>Estimated Total Review Time: 2-3 weeks</strong>
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Licensing Rules */}
              <Card className="bg-gradient-to-br from-orange-50/95 to-amber-50/95 dark:from-orange-900/25 dark:to-amber-900/25 backdrop-blur-xl border-orange-200/50 dark:border-white/20">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#00AFE6]" />
                    Licensing & Terms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm text-gray-700 dark:text-white/80">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <span>Resources must be free of copyright restrictions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <span>Must not contain personal health information (PHI)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <span>Resources will be published under Creative Commons</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <span>Must comply with Canadian health information standards</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-gray-100 dark:bg-white/5 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-white/70">
                      By submitting, you confirm that you have the right to share this resource 
                      and agree to make it available under open licensing terms.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                {/* File Upload Section */}
                <Card className="bg-gradient-to-br from-blue-50/95 to-cyan-50/95 dark:from-blue-900/25 dark:to-cyan-900/25 backdrop-blur-xl border-blue-200/50 dark:border-white/20">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Upload File</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                        dragActive 
                          ? "border-[#00AFE6] bg-[#00AFE6]/10" 
                          : "border-gray-300 dark:border-white/30 hover:border-gray-400 dark:hover:border-white/50"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      {selectedFile ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-center gap-3">
                            {getFileIcon(selectedFile.type)}
                            <div className="text-left">
                              <p className="text-gray-900 dark:text-white font-medium">{selectedFile.name}</p>
                              <p className="text-gray-600 dark:text-white/60 text-sm">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          {uploadProgress > 0 && uploadProgress < 100 && (
                            <div className="w-full bg-gray-200 dark:bg-white/20 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setSelectedFile(null)}
                            className="text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Remove File
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Upload className="w-12 h-12 text-gray-400 dark:text-white/40 mx-auto" />
                          <div>
                            <p className="text-gray-900 dark:text-white text-lg mb-2">Drop your file here or click to browse</p>
                            <p className="text-gray-600 dark:text-white/60 text-sm">
                              Supports PDF, DOCX, XLSX, PNG, JPG (max 10MB)
                            </p>
                          </div>
                          <input
                            type="file"
                            accept=".pdf,.docx,.doc,.xlsx,.xls,.png,.jpg,.jpeg"
                            onChange={(e) => e.target.files && handleFileSelection(e.target.files[0])}
                            className="hidden"
                            id="file-upload"
                          />
                          <label htmlFor="file-upload">
                            <Button type="button" asChild className="bg-gray-200 dark:bg-white/15 hover:bg-gray-300 dark:hover:bg-white/25 text-gray-900 dark:text-white border-gray-300 dark:border-white/30">
                              <span>Choose File</span>
                            </Button>
                          </label>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Resource Information */}
                <Card className="bg-gradient-to-br from-emerald-50/95 to-green-50/95 dark:from-emerald-900/25 dark:to-green-900/25 backdrop-blur-xl border-emerald-200/50 dark:border-white/20">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Resource Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="text-gray-900 dark:text-white/90">Resource Title *</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="e.g., AL Amyloidosis Diagnosis Checklist"
                                className="bg-white dark:bg-white/10 border-gray-300 dark:border-white/30 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="amyloidosisType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-900 dark:text-white/90">Amyloidosis Type *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white dark:bg-white/10 border-gray-300 dark:border-white/30 text-gray-900 dark:text-white">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {amyloidosisTypes.map(type => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="resourceType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-900 dark:text-white/90">Document Type *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white dark:bg-white/10 border-gray-300 dark:border-white/30 text-gray-900 dark:text-white">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {resourceTypes.map(type => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-900 dark:text-white/90">Category *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white dark:bg-white/10 border-gray-300 dark:border-white/30 text-gray-900 dark:text-white">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map(category => (
                                  <SelectItem key={category.value} value={category.value}>
                                    {category.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="audience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-900 dark:text-white/90">Target Audience *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white dark:bg-white/10 border-gray-300 dark:border-white/30 text-gray-900 dark:text-white">
                                  <SelectValue placeholder="Select audience" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {audiences.map(audience => (
                                  <SelectItem key={audience.value} value={audience.value}>
                                    {audience.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-900 dark:text-white/90">Language *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white dark:bg-white/10 border-gray-300 dark:border-white/30 text-gray-900 dark:text-white">
                                  <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {languages.map(language => (
                                  <SelectItem key={language.value} value={language.value}>
                                    {language.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="region"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-900 dark:text-white/90">Jurisdiction *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white dark:bg-white/10 border-gray-300 dark:border-white/30 text-gray-900 dark:text-white">
                                  <SelectValue placeholder="Select region" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {regions.map(region => (
                                  <SelectItem key={region.value} value={region.value}>
                                    {region.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 dark:text-white/90">Description *</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field}
                              placeholder="Provide a detailed description of the resource, its purpose, and how it should be used..."
                              rows={4}
                              className="bg-white dark:bg-white/10 border-gray-300 dark:border-white/30 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 dark:text-white/90">Tags *</FormLabel>
                          <FormControl>
                            <Input 
                              {...field}
                              placeholder="e.g., diagnosis, cardiac, biopsy, screening, treatment"
                              className="bg-white dark:bg-white/10 border-gray-300 dark:border-white/30 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50"
                            />
                          </FormControl>
                          <p className="text-sm text-gray-600 dark:text-white/60">
                            Enter relevant keywords separated by commas to help others find this resource
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Contributor Information */}
                <Card className="bg-gradient-to-br from-purple-50/95 to-violet-50/95 dark:from-purple-900/25 dark:to-violet-900/25 backdrop-blur-xl border-purple-200/50 dark:border-white/20">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-[#00AFE6]" />
                      Contributor Information *
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="submittedBy"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-900 dark:text-white/90">Name *</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Your full name"
                                className="bg-white dark:bg-white/10 border-gray-300 dark:border-white/30 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="submitterRole"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-900 dark:text-white/90">Role/Title *</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="e.g., Cardiologist, Researcher, Nurse"
                                className="bg-white dark:bg-white/10 border-gray-300 dark:border-white/30 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="submitterOrganization"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="text-gray-900 dark:text-white/90">Organization *</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="e.g., Toronto General Hospital, University of Toronto"
                                className="bg-white dark:bg-white/10 border-gray-300 dark:border-white/30 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Consent and Privacy */}
                <Card className="bg-gradient-to-br from-pink-50/95 to-rose-50/95 dark:from-pink-900/25 dark:to-rose-900/25 backdrop-blur-xl border-pink-200/50 dark:border-white/20">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                      <Shield className="w-5 h-5 text-[#00AFE6]" />
                      Consent & Privacy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Alert className="bg-yellow-500/10 border-yellow-500/30">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <AlertDescription className="text-gray-900 dark:text-white/90">
                        All uploads are reviewed by CAS moderators before public display. Resources may be flagged for enhancement (e.g., French translation, visual accessibility) prior to publishing.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="consentAgreed"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="border-gray-300 dark:border-white/30"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-gray-900 dark:text-white/90">
                                I have the rights to submit and share this resource *
                              </FormLabel>
                              <p className="text-sm text-gray-600 dark:text-white/60">
                                I confirm that I have the necessary permissions to share this resource and that it does not violate any copyright or licensing restrictions.
                              </p>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phiConfirmation"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="border-gray-300 dark:border-white/30"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-gray-900 dark:text-white/90">
                                No personal health information (PHI) is included *
                              </FormLabel>
                              <p className="text-sm text-gray-600 dark:text-white/60">
                                I confirm that this resource does not contain any personal health information, patient identifiers, or confidential medical data.
                              </p>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="editorialCharter"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="border-gray-300 dark:border-white/30"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-gray-900 dark:text-white/90">
                                I acknowledge the Editorial Charter *
                              </FormLabel>
                              <p className="text-sm text-gray-600 dark:text-white/60">
                                I have reviewed and agree to the{' '}
                                <a 
                                  href="/editorial-charter" 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-[#00AFE6] hover:text-[#00DD89] underline transition-colors"
                                >
                                  Editorial Charter
                                  <ExternalLink className="w-3 h-3 ml-1 inline" />
                                </a>
                                {' '}and submission guidelines.
                              </p>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={!selectedFile || isUploading || uploadMutation.isPending}
                    className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/80 hover:to-[#00DD89]/80 text-white border-0 px-8 py-3"
                  >
                    {isUploading || uploadMutation.isPending ? (
                      <>
                        <Upload className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Submit Your Clinical Tool
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </div>
  );
}