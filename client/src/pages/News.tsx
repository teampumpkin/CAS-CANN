import { motion } from 'framer-motion';
import { Calendar, User, Clock, ArrowRight, Tag, Search, Filter, ChevronDown, ExternalLink, Bookmark, Share2 } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ParallaxBackground from '../components/ParallaxBackground';
import healthcareProfessionalImg from '@assets/DSC02826_1750068895453.jpg';

export default function News() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');

  const newsArticles = [
    {
      id: 1,
      title: "New Treatment Guidelines for AL Amyloidosis Released",
      excerpt: "Updated international consensus guidelines provide new recommendations for diagnosis and treatment of AL amyloidosis patients.",
      category: "Medical Guidelines",
      date: "2024-12-15",
      author: "Dr. Sarah Chen",
      readTime: "5 min read",
      featured: true,
      tags: ["AL Amyloidosis", "Guidelines", "Treatment"]
    },
    {
      id: 2,
      title: "Canadian Amyloidosis Registry Reaches 1,000 Patients",
      excerpt: "Milestone achievement in patient data collection will accelerate research and improve understanding of amyloidosis in Canada.",
      category: "Research",
      date: "2024-12-10",
      author: "Research Team",
      readTime: "3 min read",
      featured: true,
      tags: ["Registry", "Research", "Canada"]
    },
    {
      id: 3,
      title: "New ATTR Treatment Shows Promise in Phase III Trial",
      excerpt: "Clinical trial results demonstrate significant improvement in quality of life and cardiac function for ATTR amyloidosis patients.",
      category: "Clinical Trials",
      date: "2024-12-05",
      author: "Dr. Michael Thompson",
      readTime: "7 min read",
      featured: false,
      tags: ["ATTR", "Clinical Trial", "Treatment"]
    },
    {
      id: 4,
      title: "Patient Story: Living with Amyloidosis - Jennifer's Journey",
      excerpt: "A powerful account of diagnosis, treatment, and advocacy from one of our community members.",
      category: "Patient Stories",
      date: "2024-11-28",
      author: "Jennifer Walsh",
      readTime: "10 min read",
      featured: false,
      tags: ["Patient Story", "Advocacy", "Community"]
    },
    {
      id: 5,
      title: "CAS Partners with International Amyloidosis Foundation",
      excerpt: "New partnership will enhance research collaboration and expand patient support programs across North America.",
      category: "Partnerships",
      date: "2024-11-20",
      author: "CAS Communications",
      readTime: "4 min read",
      featured: false,
      tags: ["Partnership", "International", "Collaboration"]
    },
    {
      id: 6,
      title: "Breakthrough in Early Diagnosis of Cardiac Amyloidosis",
      excerpt: "New diagnostic technique using advanced imaging shows potential for earlier detection and improved outcomes.",
      category: "Research",
      date: "2024-11-15",
      author: "Dr. Lisa Martinez",
      readTime: "6 min read",
      featured: false,
      tags: ["Diagnosis", "Cardiac", "Imaging"]
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Medical Guidelines', label: 'Medical Guidelines' },
    { value: 'Research', label: 'Research' },
    { value: 'Clinical Trials', label: 'Clinical Trials' },
    { value: 'Patient Stories', label: 'Patient Stories' },
    { value: 'Partnerships', label: 'Partnerships' }
  ];

  const years = [
    { value: 'all', label: 'All Years' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' }
  ];

  const filteredArticles = newsArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesYear = selectedYear === 'all' || article.date.startsWith(selectedYear);
    return matchesSearch && matchesCategory && matchesYear;
  });

  const featuredArticles = filteredArticles.filter(article => article.featured);
  const regularArticles = filteredArticles.filter(article => !article.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Latest Updates</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
              News &
            </span>
            <br />
            <span className="text-gray-800 dark:text-white">
              Updates
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Stay informed about the latest developments in amyloidosis research, treatment advances, 
            and community news from across Canada and around the world.
          </motion.p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search news and updates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-3xl border-gray-300 focus:border-[#00AFE6] focus:ring-[#00AFE6]"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[200px] rounded-3xl border-gray-300">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-full sm:w-[150px] rounded-3xl border-gray-300">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year.value} value={year.value}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">Featured Stories</h2>
              <p className="text-gray-600 dark:text-gray-400">Most important updates and developments</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {featuredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 rounded-3xl overflow-hidden group">
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="secondary" className="bg-gradient-to-r from-[#00AFE6]/20 to-[#00DD89]/20 text-[#00AFE6] border-0">
                          Featured
                        </Badge>
                        <Badge variant="outline" className="border-gray-300 text-gray-600 dark:text-gray-400">
                          {article.category}
                        </Badge>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white group-hover:text-[#00AFE6] transition-colors">
                        {article.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs border-gray-300 text-gray-500">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{article.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(article.date)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{article.readTime}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        className="p-0 h-auto text-[#00AFE6] hover:text-[#00AFE6]/80 hover:bg-transparent group"
                      >
                        Read Full Article
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Regular Articles */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">All News & Updates</h2>
            <p className="text-gray-600 dark:text-gray-400">Latest developments and announcements</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-900 rounded-3xl overflow-hidden group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="border-gray-300 text-gray-600 dark:text-gray-400 text-xs">
                        {article.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-[#00AFE6] transition-colors line-clamp-2">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {article.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-gray-300 text-gray-500">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex flex-col gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(article.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{article.readTime}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="p-0 h-auto text-[#00AFE6] hover:text-[#00AFE6]/80 hover:bg-transparent group"
                    >
                      Read More
                      <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-gradient-to-br from-[#00AFE6]/10 via-white to-[#00DD89]/10 dark:from-[#00AFE6]/20 dark:via-gray-900 dark:to-[#00DD89]/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white">
              Stay Updated
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Subscribe to our newsletter to receive the latest news, research updates, and community stories 
              directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/90 hover:to-[#00DD89]/90 text-white border-0 rounded-3xl px-8 py-3">
                Subscribe to Newsletter
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="border-[#00AFE6] text-[#00AFE6] hover:bg-[#00AFE6]/10 rounded-3xl px-8 py-3">
                View Archive
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}