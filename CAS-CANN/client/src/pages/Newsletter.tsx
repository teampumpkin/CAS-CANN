import { motion } from 'framer-motion';
import { Mail, Send, Download, Calendar, Users, BookOpen, ArrowRight, CheckCircle, Zap, Globe } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ParallaxBackground from '../components/ParallaxBackground';
import healthcareProfessionalImg from '@assets/DSC02826_1750068895453.jpg';

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  role: z.string().min(1, 'Please select your role'),
  interests: z.array(z.string()).min(1, 'Please select at least one interest'),
  frequency: z.string().min(1, 'Please select your preferred frequency'),
  consent: z.boolean().refine(val => val === true, {
    message: 'You must agree to receive our newsletter'
  })
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

export default function Newsletter() {
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      role: '',
      interests: [],
      frequency: '',
      consent: false
    }
  });

  const onSubmit = async (data: NewsletterFormData) => {
    // Simulate API call
    console.log('Newsletter subscription:', data);
    setIsSubmitted(true);
  };

  const roles = [
    { value: 'patient', label: 'Patient' },
    { value: 'caregiver', label: 'Caregiver/Family Member' },
    { value: 'physician', label: 'Physician' },
    { value: 'nurse', label: 'Nurse' },
    { value: 'researcher', label: 'Researcher' },
    { value: 'other-healthcare', label: 'Other Healthcare Professional' },
    { value: 'student', label: 'Student' },
    { value: 'other', label: 'Other' }
  ];

  const interests = [
    { value: 'research-updates', label: 'Research Updates' },
    { value: 'treatment-news', label: 'Treatment News' },
    { value: 'patient-stories', label: 'Patient Stories' },
    { value: 'events', label: 'Events & Webinars' },
    { value: 'clinical-trials', label: 'Clinical Trials' },
    { value: 'guidelines', label: 'Clinical Guidelines' },
    { value: 'advocacy', label: 'Advocacy & Policy' },
    { value: 'support-resources', label: 'Support Resources' }
  ];

  const frequencies = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'bi-weekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' }
  ];

  const pastNewsletters = [
    {
      title: "December 2024 - Year in Review",
      date: "December 15, 2024",
      description: "A comprehensive look at 2024's major developments in amyloidosis research and care.",
      highlights: ["New treatment guidelines", "Registry milestone", "Partnership announcements"]
    },
    {
      title: "November 2024 - Research Spotlight",
      date: "November 15, 2024",
      description: "Focus on groundbreaking research initiatives and clinical trial updates.",
      highlights: ["Phase III trial results", "Diagnostic innovations", "Canadian research network"]
    },
    {
      title: "October 2024 - Patient Voices",
      date: "October 15, 2024",
      description: "Featuring patient stories, advocacy updates, and community achievements.",
      highlights: ["Patient journey stories", "Advocacy successes", "Support group highlights"]
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Breaking News First",
      description: "Be the first to know about new treatments, research breakthroughs, and important updates."
    },
    {
      icon: BookOpen,
      title: "Educational Content",
      description: "In-depth articles, patient resources, and expert insights delivered to your inbox."
    },
    {
      icon: Users,
      title: "Community Stories",
      description: "Inspiring patient journeys, caregiver experiences, and healthcare professional perspectives."
    },
    {
      icon: Calendar,
      title: "Event Updates",
      description: "Early access to webinars, conferences, support group meetings, and educational events."
    }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
              Welcome to Our Community!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Thank you for subscribing to the CAS newsletter. You'll receive your first edition soon, 
              and we're excited to keep you informed about the latest developments in amyloidosis care.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/90 hover:to-[#00DD89]/90 text-white border-0 rounded-3xl px-8 py-3"
              onClick={() => window.location.href = '/'}
            >
              Return to Homepage
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <ParallaxBackground className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
            style={{ backgroundImage: `url(${healthcareProfessionalImg})` }}
          />
        </ParallaxBackground>
        
        <div className="absolute inset-0 bg-gradient-to-br from-[#00AFE6]/20 via-white/50 to-[#00DD89]/15 dark:from-[#00AFE6]/30 dark:via-gray-900/50 dark:to-[#00DD89]/25" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00AFE6]/20 to-[#00DD89]/20 backdrop-blur-sm border border-[#00AFE6]/30 rounded-full px-6 py-2 mb-6"
          >
            <Mail className="w-4 h-4 text-[#00AFE6]" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Stay Connected</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
              CAS
            </span>
            <br />
            <span className="text-gray-800 dark:text-white">
              Newsletter
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Join over 5,000 community members receiving the latest amyloidosis research, treatment updates, 
            and patient stories delivered directly to your inbox.
          </motion.p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
              Why Subscribe?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Get exclusive access to the latest developments in amyloidosis care and research
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-900 rounded-3xl">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#00AFE6]/20 to-[#00DD89]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="w-8 h-8 text-[#00AFE6]" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Form */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
              Subscribe Today
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Customize your newsletter experience to receive the content most relevant to you
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="border-0 shadow-xl bg-white dark:bg-gray-800 rounded-3xl">
              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300">First Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your first name" 
                                className="rounded-2xl border-gray-300 focus:border-[#00AFE6] focus:ring-[#00AFE6]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300">Last Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your last name" 
                                className="rounded-2xl border-gray-300 focus:border-[#00AFE6] focus:ring-[#00AFE6]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300">Email Address</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="Enter your email address" 
                              className="rounded-2xl border-gray-300 focus:border-[#00AFE6] focus:ring-[#00AFE6]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300">Your Role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-2xl border-gray-300">
                                <SelectValue placeholder="Select your role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role.value} value={role.value}>
                                  {role.label}
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
                      name="interests"
                      render={() => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300">Content Interests</FormLabel>
                          <div className="grid md:grid-cols-2 gap-3">
                            {interests.map((interest) => (
                              <FormField
                                key={interest.value}
                                control={form.control}
                                name="interests"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={interest.value}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(interest.value)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, interest.value])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== interest.value
                                                  )
                                                )
                                          }}
                                          className="border-[#00AFE6] data-[state=checked]:bg-[#00AFE6] data-[state=checked]:border-[#00AFE6]"
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal cursor-pointer text-gray-600 dark:text-gray-400">
                                        {interest.label}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="frequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300">Email Frequency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-2xl border-gray-300">
                                <SelectValue placeholder="How often would you like to hear from us?" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {frequencies.map((frequency) => (
                                <SelectItem key={frequency.value} value={frequency.value}>
                                  {frequency.label}
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
                      name="consent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-[#00AFE6] data-[state=checked]:bg-[#00AFE6] data-[state=checked]:border-[#00AFE6]"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal cursor-pointer text-gray-600 dark:text-gray-400">
                              I agree to receive the CAS newsletter and understand that I can unsubscribe at any time. 
                              I have read and agree to the privacy policy.
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/90 hover:to-[#00DD89]/90 text-white border-0 rounded-3xl py-3"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? 'Subscribing...' : 'Subscribe to Newsletter'}
                      <Send className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Past Newsletters */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
              Previous Editions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Catch up on what you might have missed
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastNewsletters.map((newsletter, index) => (
              <motion.div
                key={newsletter.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-900 rounded-3xl">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
                      {newsletter.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{newsletter.date}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                      {newsletter.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Highlights:</h4>
                      <ul className="space-y-1">
                        {newsletter.highlights.map((highlight, idx) => (
                          <li key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-[#00AFE6] flex-shrink-0" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full border-[#00AFE6] text-[#00AFE6] hover:bg-[#00AFE6]/10 rounded-2xl"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}