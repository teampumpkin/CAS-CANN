import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Video, Globe, ArrowRight, Plus, Filter, Search, BookOpen, Heart, Stethoscope } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ParallaxBackground from '../components/ParallaxBackground';
import healthcareProfessionalImg from '@assets/DSC02826_1750068895453.jpg';

export default function Events() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');

  const upcomingEvents = [
    {
      id: 1,
      title: "Annual Patient & Family Conference",
      type: "Conference",
      date: "2025-03-15",
      time: "9:00 AM - 5:00 PM",
      location: "Metro Toronto Convention Centre",
      format: "In-Person",
      attendees: "300+ expected",
      description: "Join patients, families, and healthcare professionals for a full day of education, networking, and support.",
      highlights: ["Expert speaker panels", "Patient testimonials", "Resource fair", "Networking lunch"],
      registration: "Early Bird Until Feb 15",
      featured: true
    },
    {
      id: 2,
      title: "ATTR Amyloidosis Research Update Webinar",
      type: "Webinar",
      date: "2025-02-08",
      time: "7:00 PM - 8:30 PM",
      location: "Online",
      format: "Virtual",
      attendees: "500+ registered",
      description: "Latest breakthroughs in ATTR amyloidosis research and treatment options with Dr. Sarah Chen.",
      highlights: ["Phase III trial results", "New treatment protocols", "Q&A session", "CME credits available"],
      registration: "Free - Registration Required",
      featured: true
    },
    {
      id: 3,
      title: "Caregiver Support Workshop",
      type: "Workshop",
      date: "2025-02-22",
      time: "2:00 PM - 4:00 PM",
      location: "Vancouver General Hospital",
      format: "Hybrid",
      attendees: "50+ expected",
      description: "Practical strategies and emotional support for caregivers of amyloidosis patients.",
      highlights: ["Caregiver wellness", "Communication strategies", "Resource navigation", "Peer support"],
      registration: "Free - RSVP Required",
      featured: false
    },
    {
      id: 4,
      title: "AL Amyloidosis Treatment Options Seminar",
      type: "Seminar",
      date: "2025-03-05",
      time: "6:30 PM - 8:00 PM",
      location: "Princess Margaret Cancer Centre",
      format: "In-Person",
      attendees: "75+ expected",
      description: "Comprehensive overview of current and emerging AL amyloidosis treatment approaches.",
      highlights: ["Treatment pathways", "Clinical trials", "Side effect management", "Patient Q&A"],
      registration: "Free - Limited Seating",
      featured: false
    },
    {
      id: 5,
      title: "Monthly Support Group - Toronto",
      type: "Support Group",
      date: "2025-02-01",
      time: "2:00 PM - 4:00 PM",
      location: "North York General Hospital",
      format: "In-Person",
      attendees: "40+ members",
      description: "Regular monthly gathering for Toronto-area patients and families.",
      highlights: ["Peer support", "Guest speakers", "Resource sharing", "Social connection"],
      registration: "Drop-in Welcome",
      featured: false
    },
    {
      id: 6,
      title: "Nursing Excellence in Amyloidosis Care",
      type: "Professional Development",
      date: "2025-03-20",
      time: "1:00 PM - 5:00 PM",
      location: "Calgary Health Sciences Centre",
      format: "Hybrid",
      attendees: "100+ healthcare professionals",
      description: "Advanced training for nursing professionals caring for amyloidosis patients.",
      highlights: ["Care protocols", "Patient assessment", "Family support", "Nursing research"],
      registration: "CNE Credits Available",
      featured: false
    }
  ];

  const eventTypes = [
    { value: 'all', label: 'All Events' },
    { value: 'Conference', label: 'Conferences' },
    { value: 'Webinar', label: 'Webinars' },
    { value: 'Workshop', label: 'Workshops' },
    { value: 'Seminar', label: 'Seminars' },
    { value: 'Support Group', label: 'Support Groups' },
    { value: 'Professional Development', label: 'Professional Development' }
  ];

  const months = [
    { value: 'all', label: 'All Months' },
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' }
  ];

  const filteredEvents = upcomingEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || event.type === selectedType;
    const matchesMonth = selectedMonth === 'all' || event.date.split('-')[1] === selectedMonth;
    return matchesSearch && matchesType && matchesMonth;
  });

  const featuredEvents = filteredEvents.filter(event => event.featured);
  const regularEvents = filteredEvents.filter(event => !event.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'Conference': return Calendar;
      case 'Webinar': return Video;
      case 'Workshop': return BookOpen;
      case 'Seminar': return Stethoscope;
      case 'Support Group': return Heart;
      case 'Professional Development': return Users;
      default: return Calendar;
    }
  };

  const eventStats = [
    {
      icon: Calendar,
      number: "24+",
      label: "Annual Events",
      description: "Conferences, webinars, and workshops"
    },
    {
      icon: Users,
      number: "2,500+",
      label: "Event Attendees",
      description: "Patients, families, and professionals"
    },
    {
      icon: Globe,
      number: "12",
      label: "Cities Hosting",
      description: "Events across Canada"
    },
    {
      icon: Video,
      number: "15+",
      label: "Virtual Events",
      description: "Accessible from anywhere"
    }
  ];

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
            <Calendar className="w-4 h-4 text-[#00AFE6]" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Educational Events</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[60px] font-bold mb-6 font-rosarivo"
          >
            <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
              Events &
            </span>
            <br />
            <span className="text-gray-800 dark:text-white">
              Education
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Join our community for educational conferences, expert webinars, support groups, 
            and professional development opportunities across Canada.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/90 hover:to-[#00DD89]/90 text-white border-0 rounded-3xl px-8 py-3">
              View Upcoming Events
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="border-[#00AFE6] text-[#00AFE6] hover:bg-[#00AFE6]/10 rounded-3xl px-8 py-3">
              Submit Event Proposal
              <Plus className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>
      {/* Event Stats */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {eventStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-900 rounded-3xl text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#00AFE6]/20 to-[#00DD89]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="w-8 h-8 text-[#00AFE6]" />
                    </div>
                    <div className="text-3xl font-bold text-[#00AFE6] mb-2">{stat.number}</div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">{stat.label}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Filters Section */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-3xl border-gray-300 focus:border-[#00AFE6] focus:ring-[#00AFE6]"
                />
              </div>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full sm:w-[200px] rounded-3xl border-gray-300">
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-full sm:w-[150px] rounded-3xl border-gray-300">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
      </section>
      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white font-rosarivo">Featured Events</h2>
              <p className="text-gray-600 dark:text-gray-400">Don't miss these important upcoming events</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {featuredEvents.map((event, index) => {
                const IconComponent = getEventIcon(event.type);
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary" className="bg-gradient-to-r from-[#00AFE6]/20 to-[#00DD89]/20 text-[#00AFE6] border-0">
                            Featured
                          </Badge>
                          <Badge variant="outline" className="border-gray-300 text-gray-600 dark:text-gray-400">
                            {event.type}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">
                          {event.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4 text-[#00AFE6]" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4 text-[#00AFE6]" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <MapPin className="w-4 h-4 text-[#00AFE6]" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Users className="w-4 h-4 text-[#00AFE6]" />
                            <span>{event.attendees}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                          {event.description}
                        </p>
                        
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Highlights:</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {event.highlights.map((highlight, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <div className="w-1.5 h-1.5 bg-[#00AFE6] rounded-full" />
                                {highlight}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-[#00AFE6]">
                            {event.registration}
                          </span>
                          <Button 
                            size="sm"
                            className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/90 hover:to-[#00DD89]/90 text-white border-0 rounded-2xl"
                          >
                            Register Now
                            <ArrowRight className="w-3 h-3 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}
      {/* All Events */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white font-rosarivo">Upcoming Events</h2>
            <p className="text-gray-600 dark:text-gray-400">Complete schedule of educational opportunities</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularEvents.map((event, index) => {
              const IconComponent = getEventIcon(event.type);
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 rounded-3xl">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <IconComponent className="w-4 h-4 text-[#00AFE6]" />
                        <Badge variant="outline" className="border-gray-300 text-gray-600 dark:text-gray-400 text-xs">
                          {event.type}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-2">
                        {event.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 mb-3 text-xs text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 leading-relaxed line-clamp-3">
                        {event.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#00AFE6] font-medium">
                          {event.registration}
                        </span>
                        <Button 
                          variant="outline"
                          size="sm"
                          className="border-[#00AFE6] text-[#00AFE6] hover:bg-[#00AFE6]/10 rounded-2xl"
                        >
                          Details
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#00AFE6]/10 via-white to-[#00DD89]/10 dark:from-[#00AFE6]/20 dark:via-gray-900 dark:to-[#00DD89]/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white font-rosarivo">
              Host an Event
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Have an idea for an educational event or support group? We'd love to help you bring it to life. 
              CAS provides resources, promotion, and support for community-led initiatives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/90 hover:to-[#00DD89]/90 text-white border-0 rounded-3xl px-8 py-3">
                Submit Event Proposal
                <Plus className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="border-[#00AFE6] text-[#00AFE6] hover:bg-[#00AFE6]/10 rounded-3xl px-8 py-3">
                Event Planning Guide
                <BookOpen className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}