import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Clock, RefreshCw, Send, Users, Building, FileText, HeartHandshake } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface SubmissionResponse {
  success: boolean;
  submissionId: number;
  formName: string;
  status: string;
  targetModule: string;
  message: string;
  timestamp: string;
  estimatedProcessingTime: string;
}

interface SubmissionStatus {
  id: number;
  formName: string;
  processingStatus: string;
  syncStatus: string;
  zohoModule: string;
  zohoCrmId?: string;
  errorMessage?: string;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
  logs: Array<{
    operation: string;
    status: string;
    details: any;
    duration?: number;
    createdAt: string;
    errorMessage?: string;
  }>;
}

export default function TestForms() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [submittedForms, setSubmittedForms] = useState<SubmissionResponse[]>([]);

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    interest: "",
    newsletter: false
  });

  // Event Registration Form State
  const [eventForm, setEventForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organization: "",
    jobTitle: "",
    eventType: "",
    dietaryRestrictions: "",
    accessibility: false,
    marketingConsent: false
  });

  // Partnership Inquiry Form State
  const [partnerForm, setPartnerForm] = useState({
    contactName: "",
    email: "",
    companyName: "",
    website: "",
    partnershipType: "",
    revenue: "",
    description: "",
    timeline: "",
    preferredContact: ""
  });

  // Product Demo Form State
  const [demoForm, setDemoForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    companySize: "",
    useCase: "",
    budget: "",
    timeframe: "",
    currentSolution: ""
  });

  // Submit form mutation
  const submitFormMutation = useMutation({
    mutationFn: async ({ formName, data }: { formName: string; data: any }): Promise<SubmissionResponse> => {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          form_name: formName,
          data
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: (data: SubmissionResponse) => {
      setSubmittedForms(prev => [data, ...prev]);
      toast({
        title: "Form Submitted Successfully!",
        description: `${data.formName} submitted. Processing in background...`
      });
      queryClient.invalidateQueries({ queryKey: ["/api/monitor/stats"] });
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    }
  });

  // Get system statistics
  const { data: systemStats } = useQuery({
    queryKey: ["/api/monitor/stats"],
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  // Get submission status
  const getSubmissionStatus = (submissionId: number) => {
    return useQuery<SubmissionStatus>({
      queryKey: ["/api/submit-form", submissionId],
      enabled: !!submissionId,
      refetchInterval: 2000 // Check status every 2 seconds
    });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFormMutation.mutate({
      formName: "contact_us_form",
      data: contactForm
    });
    setContactForm({
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
      interest: "",
      newsletter: false
    });
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFormMutation.mutate({
      formName: "event_registration",
      data: eventForm
    });
    setEventForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      organization: "",
      jobTitle: "",
      eventType: "",
      dietaryRestrictions: "",
      accessibility: false,
      marketingConsent: false
    });
  };

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFormMutation.mutate({
      formName: "partnership_inquiry",
      data: partnerForm
    });
    setPartnerForm({
      contactName: "",
      email: "",
      companyName: "",
      website: "",
      partnershipType: "",
      revenue: "",
      description: "",
      timeline: "",
      preferredContact: ""
    });
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFormMutation.mutate({
      formName: "product_demo_request",
      data: demoForm
    });
    setDemoForm({
      name: "",
      email: "",
      phone: "",
      company: "",
      role: "",
      companySize: "",
      useCase: "",
      budget: "",
      timeframe: "",
      currentSolution: ""
    });
  };

  const getStatusIcon = (processingStatus: string, syncStatus: string) => {
    if (processingStatus === "failed") return <XCircle className="w-4 h-4 text-red-500" />;
    if (processingStatus === "completed" && syncStatus === "synced") return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (processingStatus === "processing") return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
    return <Clock className="w-4 h-4 text-yellow-500" />;
  };

  const getStatusBadge = (processingStatus: string, syncStatus: string) => {
    if (processingStatus === "failed") return <Badge variant="destructive">Failed</Badge>;
    if (processingStatus === "completed" && syncStatus === "synced") return <Badge variant="default" className="bg-green-500">Completed</Badge>;
    if (processingStatus === "processing") return <Badge variant="secondary">Processing</Badge>;
    return <Badge variant="outline">Pending</Badge>;
  };

  return (
    <div className="container mx-auto p-6 space-y-6" data-testid="test-forms-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="page-title">Dynamic Multi-Form Lead Capture Test</h1>
          <p className="text-muted-foreground mt-2">
            Test different form types to see automatic field creation and CRM synchronization
          </p>
        </div>
        {systemStats && (systemStats as any).systemStatus && (
          <Card className="w-64">
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold" data-testid="total-submissions">
                  {(systemStats as any).systemStatus.totalSubmissions}
                </div>
                <div className="text-sm text-muted-foreground">Total Submissions</div>
                <div className="mt-2 text-sm">
                  Success Rate: <span className="font-semibold" data-testid="success-rate">
                    {(systemStats as any).systemStatus.successRate}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Tabs defaultValue="forms" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="forms" data-testid="tab-forms">Test Forms</TabsTrigger>
          <TabsTrigger value="submissions" data-testid="tab-submissions">Recent Submissions</TabsTrigger>
          <TabsTrigger value="monitor" data-testid="tab-monitor">System Monitor</TabsTrigger>
        </TabsList>

        <TabsContent value="forms" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Contact Us Form
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4" data-testid="contact-form">
                  <div>
                    <Label htmlFor="contact-name">Full Name *</Label>
                    <Input
                      id="contact-name"
                      data-testid="input-contact-name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-email">Email *</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      data-testid="input-contact-email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-phone">Phone</Label>
                    <Input
                      id="contact-phone"
                      data-testid="input-contact-phone"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-company">Company</Label>
                    <Input
                      id="contact-company"
                      data-testid="input-contact-company"
                      value={contactForm.company}
                      onChange={(e) => setContactForm({...contactForm, company: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-interest">Interest</Label>
                    <Select value={contactForm.interest} onValueChange={(value) => setContactForm({...contactForm, interest: value})}>
                      <SelectTrigger data-testid="select-contact-interest">
                        <SelectValue placeholder="Select interest" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general_inquiry">General Inquiry</SelectItem>
                        <SelectItem value="product_demo">Product Demo</SelectItem>
                        <SelectItem value="pricing">Pricing Information</SelectItem>
                        <SelectItem value="support">Support</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="contact-message">Message</Label>
                    <Textarea
                      id="contact-message"
                      data-testid="textarea-contact-message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="contact-newsletter"
                      data-testid="checkbox-contact-newsletter"
                      checked={contactForm.newsletter}
                      onCheckedChange={(checked) => setContactForm({...contactForm, newsletter: !!checked})}
                    />
                    <Label htmlFor="contact-newsletter">Subscribe to newsletter</Label>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={submitFormMutation.isPending}
                    data-testid="button-submit-contact"
                  >
                    {submitFormMutation.isPending ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Contact Form
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Event Registration Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Event Registration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEventSubmit} className="space-y-4" data-testid="event-form">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="event-firstName">First Name *</Label>
                      <Input
                        id="event-firstName"
                        data-testid="input-event-firstName"
                        value={eventForm.firstName}
                        onChange={(e) => setEventForm({...eventForm, firstName: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="event-lastName">Last Name *</Label>
                      <Input
                        id="event-lastName"
                        data-testid="input-event-lastName"
                        value={eventForm.lastName}
                        onChange={(e) => setEventForm({...eventForm, lastName: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="event-email">Email *</Label>
                    <Input
                      id="event-email"
                      type="email"
                      data-testid="input-event-email"
                      value={eventForm.email}
                      onChange={(e) => setEventForm({...eventForm, email: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="event-phone">Phone</Label>
                    <Input
                      id="event-phone"
                      data-testid="input-event-phone"
                      value={eventForm.phone}
                      onChange={(e) => setEventForm({...eventForm, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="event-organization">Organization</Label>
                    <Input
                      id="event-organization"
                      data-testid="input-event-organization"
                      value={eventForm.organization}
                      onChange={(e) => setEventForm({...eventForm, organization: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="event-jobTitle">Job Title</Label>
                    <Input
                      id="event-jobTitle"
                      data-testid="input-event-jobTitle"
                      value={eventForm.jobTitle}
                      onChange={(e) => setEventForm({...eventForm, jobTitle: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="event-type">Event Type</Label>
                    <Select value={eventForm.eventType} onValueChange={(value) => setEventForm({...eventForm, eventType: value})}>
                      <SelectTrigger data-testid="select-event-type">
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="webinar">Webinar</SelectItem>
                        <SelectItem value="conference">Conference</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="networking">Networking Event</SelectItem>
                        <SelectItem value="product_launch">Product Launch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="event-dietary">Dietary Restrictions</Label>
                    <Input
                      id="event-dietary"
                      data-testid="input-event-dietary"
                      value={eventForm.dietaryRestrictions}
                      onChange={(e) => setEventForm({...eventForm, dietaryRestrictions: e.target.value})}
                      placeholder="e.g., Vegetarian, Gluten-free, None"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="event-accessibility"
                        data-testid="checkbox-event-accessibility"
                        checked={eventForm.accessibility}
                        onCheckedChange={(checked) => setEventForm({...eventForm, accessibility: !!checked})}
                      />
                      <Label htmlFor="event-accessibility">Accessibility accommodations needed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="event-marketing"
                        data-testid="checkbox-event-marketing"
                        checked={eventForm.marketingConsent}
                        onCheckedChange={(checked) => setEventForm({...eventForm, marketingConsent: !!checked})}
                      />
                      <Label htmlFor="event-marketing">Consent to marketing communications</Label>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={submitFormMutation.isPending}
                    data-testid="button-submit-event"
                  >
                    {submitFormMutation.isPending ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Register for Event
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Partnership Inquiry Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5" />
                  Partnership Inquiry
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePartnerSubmit} className="space-y-4" data-testid="partner-form">
                  <div>
                    <Label htmlFor="partner-name">Contact Name *</Label>
                    <Input
                      id="partner-name"
                      data-testid="input-partner-name"
                      value={partnerForm.contactName}
                      onChange={(e) => setPartnerForm({...partnerForm, contactName: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="partner-email">Email *</Label>
                    <Input
                      id="partner-email"
                      type="email"
                      data-testid="input-partner-email"
                      value={partnerForm.email}
                      onChange={(e) => setPartnerForm({...partnerForm, email: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="partner-company">Company Name *</Label>
                    <Input
                      id="partner-company"
                      data-testid="input-partner-company"
                      value={partnerForm.companyName}
                      onChange={(e) => setPartnerForm({...partnerForm, companyName: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="partner-website">Website</Label>
                    <Input
                      id="partner-website"
                      data-testid="input-partner-website"
                      value={partnerForm.website}
                      onChange={(e) => setPartnerForm({...partnerForm, website: e.target.value})}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="partner-type">Partnership Type</Label>
                    <Select value={partnerForm.partnershipType} onValueChange={(value) => setPartnerForm({...partnerForm, partnershipType: value})}>
                      <SelectTrigger data-testid="select-partner-type">
                        <SelectValue placeholder="Select partnership type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reseller">Reseller Partner</SelectItem>
                        <SelectItem value="integration">Integration Partner</SelectItem>
                        <SelectItem value="referral">Referral Partner</SelectItem>
                        <SelectItem value="technology">Technology Partner</SelectItem>
                        <SelectItem value="strategic">Strategic Alliance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="partner-revenue">Annual Revenue</Label>
                    <Select value={partnerForm.revenue} onValueChange={(value) => setPartnerForm({...partnerForm, revenue: value})}>
                      <SelectTrigger data-testid="select-partner-revenue">
                        <SelectValue placeholder="Select revenue range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under_1m">Under $1M</SelectItem>
                        <SelectItem value="1m_5m">$1M - $5M</SelectItem>
                        <SelectItem value="5m_10m">$5M - $10M</SelectItem>
                        <SelectItem value="10m_50m">$10M - $50M</SelectItem>
                        <SelectItem value="over_50m">Over $50M</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="partner-timeline">Implementation Timeline</Label>
                    <Select value={partnerForm.timeline} onValueChange={(value) => setPartnerForm({...partnerForm, timeline: value})}>
                      <SelectTrigger data-testid="select-partner-timeline">
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate (1-30 days)</SelectItem>
                        <SelectItem value="short_term">Short term (1-3 months)</SelectItem>
                        <SelectItem value="medium_term">Medium term (3-6 months)</SelectItem>
                        <SelectItem value="long_term">Long term (6+ months)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="partner-contact">Preferred Contact Method</Label>
                    <Select value={partnerForm.preferredContact} onValueChange={(value) => setPartnerForm({...partnerForm, preferredContact: value})}>
                      <SelectTrigger data-testid="select-partner-contact">
                        <SelectValue placeholder="Select contact method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="video_call">Video Call</SelectItem>
                        <SelectItem value="in_person">In Person</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="partner-description">Partnership Description</Label>
                    <Textarea
                      id="partner-description"
                      data-testid="textarea-partner-description"
                      value={partnerForm.description}
                      onChange={(e) => setPartnerForm({...partnerForm, description: e.target.value})}
                      rows={3}
                      placeholder="Describe your partnership goals and how we can work together..."
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={submitFormMutation.isPending}
                    data-testid="button-submit-partner"
                  >
                    {submitFormMutation.isPending ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Partnership Inquiry
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Product Demo Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Product Demo Request
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDemoSubmit} className="space-y-4" data-testid="demo-form">
                  <div>
                    <Label htmlFor="demo-name">Full Name *</Label>
                    <Input
                      id="demo-name"
                      data-testid="input-demo-name"
                      value={demoForm.name}
                      onChange={(e) => setDemoForm({...demoForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="demo-email">Business Email *</Label>
                    <Input
                      id="demo-email"
                      type="email"
                      data-testid="input-demo-email"
                      value={demoForm.email}
                      onChange={(e) => setDemoForm({...demoForm, email: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="demo-phone">Phone Number</Label>
                    <Input
                      id="demo-phone"
                      data-testid="input-demo-phone"
                      value={demoForm.phone}
                      onChange={(e) => setDemoForm({...demoForm, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="demo-company">Company Name *</Label>
                    <Input
                      id="demo-company"
                      data-testid="input-demo-company"
                      value={demoForm.company}
                      onChange={(e) => setDemoForm({...demoForm, company: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="demo-role">Job Role</Label>
                    <Select value={demoForm.role} onValueChange={(value) => setDemoForm({...demoForm, role: value})}>
                      <SelectTrigger data-testid="select-demo-role">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ceo">CEO/Founder</SelectItem>
                        <SelectItem value="cto">CTO/Technical Leader</SelectItem>
                        <SelectItem value="vp_sales">VP Sales/Revenue</SelectItem>
                        <SelectItem value="marketing">Marketing Manager</SelectItem>
                        <SelectItem value="operations">Operations Manager</SelectItem>
                        <SelectItem value="it">IT Manager</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="demo-size">Company Size</Label>
                    <Select value={demoForm.companySize} onValueChange={(value) => setDemoForm({...demoForm, companySize: value})}>
                      <SelectTrigger data-testid="select-demo-size">
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-1000">201-1000 employees</SelectItem>
                        <SelectItem value="1000+">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="demo-budget">Budget Range</Label>
                    <Select value={demoForm.budget} onValueChange={(value) => setDemoForm({...demoForm, budget: value})}>
                      <SelectTrigger data-testid="select-demo-budget">
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under_10k">Under $10K</SelectItem>
                        <SelectItem value="10k_50k">$10K - $50K</SelectItem>
                        <SelectItem value="50k_100k">$50K - $100K</SelectItem>
                        <SelectItem value="100k_500k">$100K - $500K</SelectItem>
                        <SelectItem value="over_500k">Over $500K</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="demo-timeframe">Implementation Timeframe</Label>
                    <Select value={demoForm.timeframe} onValueChange={(value) => setDemoForm({...demoForm, timeframe: value})}>
                      <SelectTrigger data-testid="select-demo-timeframe">
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="1_month">Within 1 month</SelectItem>
                        <SelectItem value="3_months">Within 3 months</SelectItem>
                        <SelectItem value="6_months">Within 6 months</SelectItem>
                        <SelectItem value="planning">Just planning</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="demo-usecase">Primary Use Case</Label>
                    <Textarea
                      id="demo-usecase"
                      data-testid="textarea-demo-usecase"
                      value={demoForm.useCase}
                      onChange={(e) => setDemoForm({...demoForm, useCase: e.target.value})}
                      rows={2}
                      placeholder="Describe your primary use case..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="demo-current">Current Solution</Label>
                    <Input
                      id="demo-current"
                      data-testid="input-demo-current"
                      value={demoForm.currentSolution}
                      onChange={(e) => setDemoForm({...demoForm, currentSolution: e.target.value})}
                      placeholder="What solution are you currently using?"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={submitFormMutation.isPending}
                    data-testid="button-submit-demo"
                  >
                    {submitFormMutation.isPending ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Requesting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Request Product Demo
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Form Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              {submittedForms.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No forms submitted yet. Submit a form above to see real-time processing status.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {submittedForms.map((submission) => {
                    const statusQuery = getSubmissionStatus(submission.submissionId);
                    const status = statusQuery.data;
                    
                    return (
                      <Card key={submission.submissionId} className="border-l-4 border-l-blue-500">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {status ? getStatusIcon(status.processingStatus, status.syncStatus) : <Clock className="w-4 h-4 text-yellow-500" />}
                              <h3 className="font-semibold" data-testid={`submission-title-${submission.submissionId}`}>
                                {submission.formName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </h3>
                              {status ? getStatusBadge(status.processingStatus, status.syncStatus) : getStatusBadge("pending", "pending")}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              ID: {submission.submissionId}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <strong>Target Module:</strong> {submission.targetModule}
                            </div>
                            <div>
                              <strong>Submitted:</strong> {new Date(submission.timestamp).toLocaleString()}
                            </div>
                            {status?.zohoCrmId && (
                              <div>
                                <strong>Zoho CRM ID:</strong> {status.zohoCrmId}
                              </div>
                            )}
                            {status && status.retryCount > 0 && (
                              <div>
                                <strong>Retry Count:</strong> {status.retryCount}
                              </div>
                            )}
                          </div>
                          
                          {status?.errorMessage && (
                            <Alert className="mt-3" variant="destructive">
                              <AlertDescription>
                                <strong>Error:</strong> {status.errorMessage}
                              </AlertDescription>
                            </Alert>
                          )}
                          
                          {status?.logs && status.logs.length > 0 && (
                            <div className="mt-3">
                              <details className="cursor-pointer">
                                <summary className="text-sm font-medium">Processing Logs ({status.logs.length})</summary>
                                <div className="mt-2 space-y-1 text-xs">
                                  {status.logs.map((log, index) => (
                                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                                      <Badge variant="outline" className="text-xs">
                                        {log.operation}
                                      </Badge>
                                      <Badge variant={log.status === "success" ? "default" : log.status === "failed" ? "destructive" : "secondary"} className="text-xs">
                                        {log.status}
                                      </Badge>
                                      {log.duration && (
                                        <span className="text-muted-foreground">
                                          {log.duration}ms
                                        </span>
                                      )}
                                      <span className="text-muted-foreground">
                                        {new Date(log.createdAt).toLocaleTimeString()}
                                      </span>
                                      {log.errorMessage && (
                                        <span className="text-red-500 ml-auto">
                                          {log.errorMessage}
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </details>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitor" className="space-y-4">
          {systemStats && (systemStats as any).systemStatus && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#00AFE6]" data-testid="stat-total">
                        {(systemStats as any).systemStatus.totalSubmissions}
                      </div>
                      <div className="text-sm text-muted-foreground">Total</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600" data-testid="stat-completed">
                        {(systemStats as any).systemStatus.completedSubmissions}
                      </div>
                      <div className="text-sm text-muted-foreground">Completed</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600" data-testid="stat-processing">
                        {(systemStats as any).systemStatus.processingSubmissions + (systemStats as any).systemStatus.pendingSubmissions}
                      </div>
                      <div className="text-sm text-muted-foreground">Processing</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600" data-testid="stat-failed">
                        {(systemStats as any).systemStatus.failedSubmissions}
                      </div>
                      <div className="text-sm text-muted-foreground">Failed</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>System Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Processing Status</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Success Rate:</span>
                          <span className="font-semibold">{(systemStats as any).systemStatus.successRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Retry Processing:</span>
                          <Badge variant={(systemStats as any).systemStatus.retryProcessing ? "default" : "secondary"}>
                            {(systemStats as any).systemStatus.retryProcessing ? "Active" : "Idle"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Configuration</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Field Mappings:</span>
                          <span className="font-semibold">{(systemStats as any).configurationStatus?.fieldMappings || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Form Configurations:</span>
                          <span className="font-semibold">{(systemStats as any).configurationStatus?.formConfigurations || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {(systemStats as any).retryStatistics && (
                <Card>
                  <CardHeader>
                    <CardTitle>Retry Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Failed Submissions:</span>
                          <span className="font-semibold">{(systemStats as any).retryStatistics.failedSubmissions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Eligible for Retry:</span>
                          <span className="font-semibold text-[#00AFE6]">{(systemStats as any).retryStatistics.eligibleForRetry}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Max Retries Reached:</span>
                          <span className="font-semibold text-red-600">{(systemStats as any).retryStatistics.maxRetriesReached}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total Retry Attempts:</span>
                          <span className="font-semibold">{(systemStats as any).retryStatistics.totalRetryAttempts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Successful Retries:</span>
                          <span className="font-semibold text-green-600">{(systemStats as any).retryStatistics.successfulRetries}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Recent Retries</h4>
                        <div className="space-y-1 text-xs max-h-32 overflow-y-auto">
                          {(systemStats as any).retryStatistics.recentRetries?.slice(0, 5).map((retry: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-1 bg-muted rounded">
                              <span>ID: {retry.submissionId}</span>
                              <Badge variant="outline" className="text-xs">
                                Retry {retry.retryCount}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {(systemStats as any).recentActivity?.slice(0, 20).map((activity: any, index: number) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded text-sm">
                        <Badge variant="outline" className="text-xs">
                          {activity.operation}
                        </Badge>
                        <Badge variant={activity.status === "success" ? "default" : activity.status === "failed" ? "destructive" : "secondary"} className="text-xs">
                          {activity.status}
                        </Badge>
                        <span>ID: {activity.submissionId}</span>
                        {activity.duration && (
                          <span className="text-muted-foreground">
                            {activity.duration}ms
                          </span>
                        )}
                        <span className="text-muted-foreground ml-auto">
                          {new Date(activity.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}