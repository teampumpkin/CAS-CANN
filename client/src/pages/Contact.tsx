import { motion } from 'framer-motion';
import { Mail, Upload, Users, MessageCircle, ExternalLink, Send, User, Building2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiRequest } from '@/lib/queryClient';
import ParallaxBackground from '../components/ParallaxBackground';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  organization: z.string().optional(),
  inquiryType: z.string().min(1, 'Please select an inquiry type'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

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
      {/* Hero Section */}
      <ParallaxBackground className="min-h-[70vh] flex items-center relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#00AFE6]/20 rounded-full blur-3xl -translate-x-48 -translate-y-48" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00DD89]/20 rounded-full blur-3xl translate-x-48 translate-y-48" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Mail className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-sm font-medium text-white/90">Get in Touch</span>
            </motion.div>
            
            <h1 className="text-5xl lg:text-7xl font-bold font-rosarivo mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Contact
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Us
              </span>
            </h1>
            
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              We welcome questions, insights, and collaboration.
            </p>
          </motion.div>
        </div>
      </ParallaxBackground>

      {/* Main Content Section */}
      <section className="py-24 bg-gray-900 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center">
                    <Send className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-rosarivo text-white">
                      Send us a Message
                    </h2>
                    <p className="text-white/70 text-sm">
                      We'll get back to you within 24-48 hours
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
                              <SelectItem value="media">Media Request</SelectItem>
                              <SelectItem value="collaboration">Collaboration</SelectItem>
                              <SelectItem value="research">Research Partnership</SelectItem>
                              <SelectItem value="resource">Resource Submission</SelectItem>
                              <SelectItem value="technical">Technical Support</SelectItem>
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

                    <Button
                      type="submit"
                      disabled={contactMutation.isPending}
                      className="w-full bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/80 hover:to-[#00DD89]/80 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50"
                    >
                      {contactMutation.isPending ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          Send Message
                        </div>
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {contactSections.map((section, index) => (
                <motion.div
                  key={section.title}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${section.gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <section.icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-bold font-rosarivo text-white mb-2">
                        {section.title}
                      </h3>
                      
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
                          {section.email}
                        </motion.a>
                      )}
                      
                      {section.links && (
                        <div className="flex flex-col gap-2">
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
                  </div>
                </motion.div>
              ))}

              {/* Additional Note */}
              <motion.div
                className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      We Value Your Input
                    </h3>
                    <p className="text-white/80 text-sm leading-relaxed">
                      The Canadian Amyloidosis Society is committed to fostering collaboration across the amyloidosis community. Whether you're a healthcare professional, researcher, patient, or family member, we welcome your questions and look forward to connecting with you.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}