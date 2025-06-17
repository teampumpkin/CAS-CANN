import { motion } from 'framer-motion';
import { Mail, Upload, Users, MessageCircle, ExternalLink, Send, User, Building2, Shield, RefreshCw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiRequest } from '@/lib/queryClient';
import ParallaxBackground from '../components/ParallaxBackground';
import { useState, useEffect } from 'react';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  organization: z.string().optional(),
  inquiryType: z.string().min(1, 'Please select an inquiry type'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
  privacyConsent: z.boolean().refine(val => val === true, {
    message: 'You must agree to the privacy policy to continue'
  }),
  captchaToken: z.string().min(1, 'Please complete the security verification'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

// Simple CAPTCHA Component
function SimpleCaptcha({ onVerify }: { onVerify: (token: string) => void }) {
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operations = ['+', '-'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let answer;
    let question;
    
    if (operation === '+') {
      answer = num1 + num2;
      question = `${num1} + ${num2}`;
    } else {
      // Ensure positive result for subtraction
      const larger = Math.max(num1, num2);
      const smaller = Math.min(num1, num2);
      answer = larger - smaller;
      question = `${larger} - ${smaller}`;
    }
    
    setCaptchaQuestion(question);
    setCaptchaAnswer(answer.toString());
    setUserAnswer('');
    setIsVerified(false);
  };

  useEffect(() => {
    generateCaptcha();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyCaptcha = () => {
    if (userAnswer === captchaAnswer) {
      setIsVerified(true);
      onVerify(`captcha_${Date.now()}`);
      return true;
    } else {
      setIsVerified(false);
      onVerify('');
      return false;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/20 rounded-xl">
        <Shield className="w-5 h-5 text-[#00AFE6]" />
        <div className="flex-1">
          <span className="text-white text-sm">Security verification: What is </span>
          <span className="text-[#00AFE6] font-mono font-bold">{captchaQuestion}</span>
          <span className="text-white text-sm"> ?</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={generateCaptcha}
          className="text-white/60 hover:text-white hover:bg-white/10"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <Input
          value={userAnswer}
          onChange={(e) => {
            setUserAnswer(e.target.value);
            setTimeout(() => verifyCaptcha(), 100);
          }}
          placeholder="Enter answer"
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#00AFE6] focus:ring-[#00AFE6]/20 w-24"
        />
        {isVerified && (
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <Shield className="w-4 h-4" />
            Verified
          </div>
        )}
      </div>
    </div>
  );
}

export default function Contact() {
  const { toast } = useToast();
  
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      organization: '',
      inquiryType: '',
      subject: '',
      message: '',
      privacyConsent: false,
      captchaToken: '',
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      await apiRequest('/api/contact', 'POST', data);
    },
    onSuccess: () => {
      toast({
        title: 'Message sent successfully',
        description: 'We\'ll get back to you within 24-48 hours.',
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to send message',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  const contactSections = [
    {
      icon: MessageCircle,
      title: 'General Inquiries',
      description: 'Questions about CAS, media requests, or collaboration opportunities',
      email: 'info@amyloidosis.ca',
      gradient: 'from-[#00AFE6] to-[#00DD89]'
    },
    {
      icon: Upload,
      title: 'Resource & Directory Updates',
      description: 'Submit resources or update clinic listings using our forms',
      links: [
        { text: 'Upload Resource', url: '/upload-resource' },
        { text: 'Directory Updates', url: '/directory' }
      ],
      gradient: 'from-[#00DD89] to-[#00AFE6]'
    },
    {
      icon: Users,
      title: 'Join CAS',
      description: 'Become a member or stay updated on our work',
      links: [
        { text: 'Join CAS', url: '/get-involved' }
      ],
      gradient: 'from-purple-500 to-[#00AFE6]'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section with Interactive Elements */}
      <ParallaxBackground className="min-h-screen flex items-center relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#00AFE6]/20 rounded-full blur-3xl -translate-x-48 -translate-y-48" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00DD89]/20 rounded-full blur-3xl translate-x-48 translate-y-48" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
        
        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-20 w-3 h-3 bg-[#00AFE6] rounded-full"
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-32 w-2 h-2 bg-[#00DD89] rounded-full"
          animate={{ 
            y: [0, 30, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.6, -0.05, 0.01, 0.99] }}
            >
              <motion.div
                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Mail className="w-5 h-5 text-[#00AFE6]" />
                <span className="text-sm font-medium text-white/90">Connect & Collaborate</span>
              </motion.div>
              
              <h1 className="text-6xl lg:text-8xl font-bold font-rosarivo mb-8 leading-tight">
                <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  Let's
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                  Connect
                </span>
              </h1>
              
              <p className="text-xl text-white/70 mb-8 leading-relaxed">
                Join the conversation. Share insights. Build partnerships that advance amyloidosis care across Canada and beyond.
              </p>

              {/* Quick Contact Options */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <motion.a
                  href="mailto:info@amyloidosis.ca"
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Mail className="w-5 h-5 text-[#00AFE6] group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-white font-medium">Quick Email</span>
                </motion.a>
                
                <motion.a
                  href="#contact-form"
                  className="flex items-center gap-3 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-2xl px-6 py-4 hover:from-[#00AFE6]/80 hover:to-[#00DD89]/80 transition-all duration-300 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageCircle className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-white font-medium">Send Message</span>
                </motion.a>
              </div>
            </motion.div>

            {/* Right Side - Interactive Contact Cards */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              {contactSections.map((section, index) => (
                <motion.div
                  key={section.title}
                  className="relative group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00AFE6]/20 to-[#00DD89]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 group-hover:border-white/40 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${section.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <section.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-[#00AFE6] transition-colors duration-300">
                        {section.title}
                      </h3>
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed mb-4">
                      {section.description}
                    </p>
                    
                    {section.email && (
                      <motion.a
                        href={`mailto:${section.email}`}
                        className="inline-flex items-center gap-2 text-[#00AFE6] hover:text-[#00DD89] font-medium text-sm transition-colors duration-300"
                        whileHover={{ x: 4 }}
                      >
                        <Mail className="w-4 h-4" />
                        Direct Contact
                      </motion.a>
                    )}
                    
                    {section.links && (
                      <div className="flex flex-wrap gap-2">
                        {section.links.map((link, linkIndex) => (
                          <motion.a
                            key={linkIndex}
                            href={link.url}
                            className="inline-flex items-center gap-2 text-[#00AFE6] hover:text-[#00DD89] font-medium text-sm transition-colors duration-300"
                            whileHover={{ x: 4 }}
                          >
                            <ExternalLink className="w-4 h-4" />
                            {link.text}
                          </motion.a>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </ParallaxBackground>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-32 bg-gray-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#00DD89]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00AFE6]/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 relative z-10">
          {/* Section Header */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 mb-6">
              <MessageCircle className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-sm font-medium text-white/90">Start the Conversation</span>
            </div>
            
            <h2 className="text-5xl lg:text-6xl font-bold font-rosarivo mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Share Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Vision
              </span>
            </h2>
            
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Whether you're a researcher with breakthrough insights, a clinician seeking collaboration, or someone with questions about amyloidosis—we're here to listen and connect.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {/* Contact Form */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-2xl">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-2xl flex items-center justify-center shadow-lg">
                    <Send className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold font-rosarivo text-white mb-2">
                      Send us a Message
                    </h3>
                    <p className="text-white/70">
                      We'll respond within 24-48 hours with thoughtful insights
                    </p>
                  </div>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/90 font-medium">Name *</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Your full name"
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#00AFE6] focus:ring-[#00AFE6]/20"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/90 font-medium">Email *</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder="your.email@example.com"
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#00AFE6] focus:ring-[#00AFE6]/20"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="organization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/90 font-medium">Organization</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Your organization or institution"
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#00AFE6] focus:ring-[#00AFE6]/20"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="inquiryType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/90 font-medium">Inquiry Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-[#00AFE6] focus:ring-[#00AFE6]/20">
                                <SelectValue placeholder="Select inquiry type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-800 border-white/20">
                              <SelectItem value="general">General Inquiry</SelectItem>
                              <SelectItem value="upload-followup">Upload Follow-up</SelectItem>
                              <SelectItem value="technical">Technical Support</SelectItem>
                              <SelectItem value="media">Media Request</SelectItem>
                              <SelectItem value="collaboration">Collaboration</SelectItem>
                              <SelectItem value="research">Research Partnership</SelectItem>
                              <SelectItem value="resource">Resource Submission</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/90 font-medium">Subject *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Brief subject line"
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#00AFE6] focus:ring-[#00AFE6]/20"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/90 font-medium">Message *</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Please provide details about your inquiry..."
                              rows={6}
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#00AFE6] focus:ring-[#00AFE6]/20 resize-none"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    {/* CAPTCHA Field */}
                    <FormField
                      control={form.control}
                      name="captchaToken"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/90 font-medium">Security Verification *</FormLabel>
                          <FormControl>
                            <SimpleCaptcha 
                              onVerify={(token) => {
                                field.onChange(token);
                              }}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    {/* Privacy Consent */}
                    <FormField
                      control={form.control}
                      name="privacyConsent"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <div className="flex items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="border-white/20 data-[state=checked]:bg-[#00AFE6] data-[state=checked]:border-[#00AFE6]"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-white/90 text-sm leading-relaxed">
                                I agree to the collection and processing of my personal data as outlined in the{' '}
                                <a 
                                  href="/privacy-policy" 
                                  className="text-[#00AFE6] hover:text-[#00DD89] underline transition-colors duration-300"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Privacy Policy
                                </a>
                                . My information will only be used to respond to this inquiry and will not be shared with third parties without consent. *
                              </FormLabel>
                            </div>
                          </div>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    {/* Privacy Notice */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-[#00AFE6] mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-white/80 leading-relaxed">
                          <p className="font-medium text-white mb-2">Your Privacy Matters</p>
                          <p>
                            We collect only the information necessary to respond to your inquiry. Your data is stored securely, 
                            used solely for communication purposes, and never shared without your explicit consent. 
                            You can request deletion of your data at any time by contacting us.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={contactMutation.isPending}
                      className="w-full bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/80 hover:to-[#00DD89]/80 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 disabled:opacity-50 shadow-xl hover:shadow-2xl"
                    >
                      {contactMutation.isPending ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span className="text-lg">Sending your message...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <Send className="w-5 h-5" />
                          <span className="text-lg">Send Message</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </motion.div>

            {/* Sidebar - Contact Methods & Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Direct Contact */}
              <motion.div
                className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Direct Contact
                  </h3>
                  <p className="text-white/70 text-sm">
                    For immediate assistance
                  </p>
                </div>
                
                <motion.a
                  href="mailto:info@amyloidosis.ca"
                  className="flex items-center justify-center gap-3 bg-white/10 rounded-xl px-6 py-4 hover:bg-white/20 transition-all duration-300 group"
                  whileHover={{ y: -2 }}
                >
                  <span className="text-white font-medium">info@amyloidosis.ca</span>
                  <ExternalLink className="w-4 h-4 text-white/60 group-hover:text-[#00AFE6] transition-colors duration-300" />
                </motion.a>
              </motion.div>

              {/* Response Time */}
              <motion.div
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-[#00DD89] rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">
                      Quick Response
                    </h4>
                    <p className="text-white/80 text-sm leading-relaxed">
                      We typically respond within 24-48 hours during business days. Urgent matters receive priority attention.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Office Hours */}
              <motion.div
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-[#00AFE6] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">
                      Based in Canada
                    </h4>
                    <p className="text-white/80 text-sm leading-relaxed">
                      Operating across all provinces and territories, with team members from coast to coast.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Community Note */}
              <motion.div
                className="bg-gradient-to-br from-[#00AFE6]/10 to-[#00DD89]/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-3">
                    Join Our Community
                  </h4>
                  <p className="text-white/80 text-sm leading-relaxed mb-4">
                    Connect with healthcare professionals, researchers, and advocates working together to advance amyloidosis care.
                  </p>
                  <motion.a
                    href="/get-involved"
                    className="inline-flex items-center gap-2 text-[#00AFE6] hover:text-[#00DD89] font-medium text-sm transition-colors duration-300"
                    whileHover={{ x: 4 }}
                  >
                    <span>Learn More</span>
                    <ExternalLink className="w-4 h-4" />
                  </motion.a>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 bg-gray-900 relative border-t border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 mb-8">
              <MessageCircle className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-sm font-medium text-white/90">Making a Difference Together</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Every Connection
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Creates Impact
              </span>
            </h2>
            
            <p className="text-xl text-white/70 leading-relaxed mb-12">
              Your insights, questions, and collaboration help us build a stronger network of care for everyone affected by amyloidosis. Together, we're advancing research, improving diagnosis, and creating hope.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Collaborative Network
                  </h3>
                  <p className="text-white/70 text-sm">
                    Connect with experts and advocates across Canada
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#00DD89] to-[#00AFE6] rounded-xl flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Knowledge Sharing
                  </h3>
                  <p className="text-white/70 text-sm">
                    Share research, insights, and best practices
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-[#00AFE6] rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    System Impact
                  </h3>
                  <p className="text-white/70 text-sm">
                    Drive improvements in amyloidosis care nationwide
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}