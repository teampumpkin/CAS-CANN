import { motion } from 'framer-motion';
import { 
  UserPlus, 
  Upload, 
  FileCheck, 
  Users, 
  Award, 
  BookOpen, 
  Shield, 
  Target,
  CheckCircle,
  Clock,
  Eye,
  Star,
  ArrowRight,
  Stethoscope,
  Search,
  Edit3,
  MessageSquare,
  Calendar,
  Network,
  Globe,
  ExternalLink,
  Download,
  AlertCircle,
  HelpCircle,
  Mail,
  Phone
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ParallaxBackground from '../components/ParallaxBackground';
import { useState } from 'react';

interface ContributorWorkflow {
  id: string;
  title: string;
  titleFr: string;
  description: string;
  descriptionFr: string;
  category: 'clinical' | 'research' | 'education' | 'policy' | 'quality';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeCommitment: string;
  requirements: string[];
  steps: {
    title: string;
    description: string;
    estimatedTime: string;
    resources: string[];
  }[];
  benefits: string[];
  examples: string[];
  contactPerson: string;
  contactEmail: string;
}

const contributorWorkflows: ContributorWorkflow[] = [
  {
    id: 'clinical-resource-contributor',
    title: 'Clinical Resource Contributor',
    titleFr: 'Contributeur de Ressources Cliniques',
    description: 'Develop and share evidence-based clinical tools, protocols, and diagnostic pathways',
    descriptionFr: 'Développer et partager des outils cliniques, protocoles et voies diagnostiques fondés sur des preuves',
    category: 'clinical',
    difficulty: 'intermediate',
    timeCommitment: '5-10 hours/month',
    requirements: [
      'Licensed healthcare professional',
      'Minimum 3 years clinical experience',
      'Experience with amyloidosis diagnosis/treatment',
      'Commitment to evidence-based practice'
    ],
    steps: [
      {
        title: 'Professional Registration',
        description: 'Complete professional verification and background check',
        estimatedTime: '30 minutes',
        resources: ['Professional registration form', 'License verification', 'Reference contacts']
      },
      {
        title: 'Clinical Orientation',
        description: 'Attend orientation session on CAS clinical governance and quality standards',
        estimatedTime: '2 hours',
        resources: ['Clinical governance framework', 'Quality standards guide', 'Orientation materials']
      },
      {
        title: 'Resource Development',
        description: 'Create clinical resources following CAS template and evidence standards',
        estimatedTime: '3-8 hours',
        resources: ['Resource templates', 'Evidence requirements', 'Style guide']
      },
      {
        title: 'Peer Review Process',
        description: 'Submit resources for peer review by clinical advisory committee',
        estimatedTime: '2-3 weeks',
        resources: ['Peer review guidelines', 'Feedback forms', 'Revision templates']
      },
      {
        title: 'Publication & Maintenance',
        description: 'Resources published to platform with ongoing maintenance responsibilities',
        estimatedTime: 'Ongoing',
        resources: ['Publication guidelines', 'Maintenance schedules', 'Update procedures']
      }
    ],
    benefits: [
      'Professional recognition and attribution',
      'Continuing education credits',
      'Network with national experts',
      'Contribute to improved patient outcomes',
      'Access to exclusive clinical resources'
    ],
    examples: [
      'Diagnostic pathway for cardiac amyloidosis',
      'Treatment protocol for AL amyloidosis',
      'Patient assessment tools',
      'Clinical decision support algorithms'
    ],
    contactPerson: 'Dr. Sarah Chen, Clinical Director',
    contactEmail: 'clinical@canadianamyloidosis.ca'
  },
  {
    id: 'research-collaborator',
    title: 'Research Collaborator',
    titleFr: 'Collaborateur de Recherche',
    description: 'Lead or participate in multi-center research studies and evidence synthesis',
    descriptionFr: 'Diriger ou participer à des études de recherche multi-centres et à la synthèse des preuves',
    category: 'research',
    difficulty: 'advanced',
    timeCommitment: '10-20 hours/month',
    requirements: [
      'PhD or equivalent research experience',
      'Research ethics training',
      'Experience with clinical research',
      'Statistical analysis capabilities'
    ],
    steps: [
      {
        title: 'Research Proposal',
        description: 'Submit research proposal for review by research advisory committee',
        estimatedTime: '2-4 weeks',
        resources: ['Research proposal template', 'Ethics requirements', 'Budget guidelines']
      },
      {
        title: 'Ethics Approval',
        description: 'Obtain ethics approval from institutional review boards',
        estimatedTime: '4-8 weeks',
        resources: ['Ethics submission forms', 'IRB contacts', 'Ethics guidelines']
      },
      {
        title: 'Study Implementation',
        description: 'Execute research study with CAS network support',
        estimatedTime: '6-24 months',
        resources: ['Study protocols', 'Data collection tools', 'Network contacts']
      },
      {
        title: 'Data Analysis & Publication',
        description: 'Analyze results and publish in peer-reviewed journals',
        estimatedTime: '3-6 months',
        resources: ['Statistical resources', 'Publication guidelines', 'Journal contacts']
      }
    ],
    benefits: [
      'Access to national patient database',
      'Multi-center collaboration opportunities',
      'Funding support for approved studies',
      'Co-authorship opportunities',
      'Research infrastructure access'
    ],
    examples: [
      'Multi-center diagnostic accuracy study',
      'Treatment outcomes analysis',
      'Patient-reported outcomes research',
      'Health economics studies'
    ],
    contactPerson: 'Dr. Michael Rodriguez, Research Director',
    contactEmail: 'research@canadianamyloidosis.ca'
  },
  {
    id: 'education-developer',
    title: 'Education Program Developer',
    titleFr: 'Développeur de Programmes Éducatifs',
    description: 'Create educational content and training programs for healthcare professionals',
    descriptionFr: 'Créer du contenu éducatif et des programmes de formation pour les professionnels de la santé',
    category: 'education',
    difficulty: 'intermediate',
    timeCommitment: '3-8 hours/month',
    requirements: [
      'Educational or training experience',
      'Subject matter expertise',
      'Instructional design knowledge',
      'Commitment to continuing education'
    ],
    steps: [
      {
        title: 'Education Planning',
        description: 'Identify learning needs and develop educational objectives',
        estimatedTime: '2-4 hours',
        resources: ['Needs assessment tools', 'Learning objectives framework', 'Educational standards']
      },
      {
        title: 'Content Development',
        description: 'Create educational materials using CAS templates and standards',
        estimatedTime: '4-12 hours',
        resources: ['Content templates', 'Style guidelines', 'Multimedia resources']
      },
      {
        title: 'Educational Review',
        description: 'Submit materials for educational review and accreditation',
        estimatedTime: '2-3 weeks',
        resources: ['Review criteria', 'Accreditation requirements', 'Feedback forms']
      },
      {
        title: 'Program Launch',
        description: 'Launch educational program with evaluation and feedback collection',
        estimatedTime: '1-2 hours',
        resources: ['Launch guidelines', 'Evaluation tools', 'Feedback systems']
      }
    ],
    benefits: [
      'Educational recognition and credits',
      'Professional development opportunities',
      'Access to educational resources',
      'National platform for expertise',
      'Collaborative learning network'
    ],
    examples: [
      'Webinar series on diagnostic approaches',
      'Interactive case studies',
      'Continuing education modules',
      'Professional certification programs'
    ],
    contactPerson: 'Dr. Jennifer Park, Education Director',
    contactEmail: 'education@canadianamyloidosis.ca'
  },
  {
    id: 'quality-improvement',
    title: 'Quality Improvement Specialist',
    titleFr: 'Spécialiste en Amélioration de la Qualité',
    description: 'Lead quality improvement initiatives and develop care standards',
    descriptionFr: 'Diriger des initiatives d\'amélioration de la qualité et développer des normes de soins',
    category: 'quality',
    difficulty: 'advanced',
    timeCommitment: '8-15 hours/month',
    requirements: [
      'Quality improvement experience',
      'Healthcare management background',
      'Data analysis capabilities',
      'Change management skills'
    ],
    steps: [
      {
        title: 'Quality Assessment',
        description: 'Conduct baseline quality assessment and identify improvement opportunities',
        estimatedTime: '4-6 hours',
        resources: ['Quality assessment tools', 'Benchmarking data', 'Assessment frameworks']
      },
      {
        title: 'Improvement Planning',
        description: 'Develop quality improvement plan with measurable outcomes',
        estimatedTime: '3-5 hours',
        resources: ['Improvement templates', 'Outcome measures', 'Planning tools']
      },
      {
        title: 'Implementation',
        description: 'Execute improvement initiatives with network support',
        estimatedTime: '6-12 months',
        resources: ['Implementation guides', 'Support resources', 'Monitoring tools']
      },
      {
        title: 'Evaluation & Sustainability',
        description: 'Evaluate outcomes and develop sustainability plans',
        estimatedTime: '2-4 hours',
        resources: ['Evaluation frameworks', 'Sustainability planning', 'Reporting templates']
      }
    ],
    benefits: [
      'Quality leadership recognition',
      'Access to quality improvement resources',
      'Network with quality experts',
      'Professional development opportunities',
      'Contribution to care standards'
    ],
    examples: [
      'Diagnostic time reduction initiatives',
      'Care coordination improvements',
      'Patient satisfaction programs',
      'Safety improvement projects'
    ],
    contactPerson: 'Dr. Lisa Thompson, Quality Director',
    contactEmail: 'quality@canadianamyloidosis.ca'
  }
];

export default function ContributorPortal() {
  const { t, language } = useLanguage();
  const [selectedWorkflow, setSelectedWorkflow] = useState<ContributorWorkflow | null>(null);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'clinical': return Stethoscope;
      case 'research': return Search;
      case 'education': return BookOpen;
      case 'policy': return Shield;
      case 'quality': return Target;
      default: return UserPlus;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'clinical': return 'from-blue-500 to-cyan-500';
      case 'research': return 'from-green-500 to-emerald-500';
      case 'education': return 'from-purple-500 to-violet-500';
      case 'policy': return 'from-orange-500 to-amber-500';
      case 'quality': return 'from-pink-500 to-rose-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <ParallaxBackground className="min-h-[60vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/85 to-gray-900/90"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#00AFE6]/10 via-[#00DD89]/8 to-[#00AFE6]/12"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 text-center">
          <motion.div
            className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Users className="w-5 h-5 text-[#00AFE6]" />
            <span className="text-white/90 font-medium">Professional Contribution</span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Contributor Portal
          </motion.h1>

          <motion.p
            className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Join Canada's leading healthcare professionals in advancing amyloidosis care through structured contribution workflows and collaborative excellence.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00AFE6] to-[#00DD89]">
                150+
              </div>
              <div className="text-sm text-white/80 mt-1">Active contributors</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00AFE6] to-[#00DD89]">
                45
              </div>
              <div className="text-sm text-white/80 mt-1">Published resources</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00AFE6] to-[#00DD89]">
                12
              </div>
              <div className="text-sm text-white/80 mt-1">Active research studies</div>
            </div>
          </motion.div>
        </div>
      </ParallaxBackground>

      {/* Contributor Workflows */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Structured Contribution Workflows
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose from our professionally designed contribution pathways, each with clear requirements, structured processes, and meaningful recognition.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contributorWorkflows.map((workflow, index) => {
              const CategoryIcon = getCategoryIcon(workflow.category);
              const categoryColor = getCategoryColor(workflow.category);
              
              return (
                <motion.div
                  key={workflow.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 h-full">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 bg-gradient-to-r ${categoryColor} rounded-xl`}>
                          <CategoryIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <Badge className={getDifficultyColor(workflow.difficulty)}>
                            {workflow.difficulty}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardTitle className="text-xl text-gray-900 dark:text-white mb-2">
                        {language === 'fr' ? workflow.titleFr : workflow.title}
                      </CardTitle>
                      
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {language === 'fr' ? workflow.descriptionFr : workflow.description}
                      </p>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <Clock className="w-4 h-4" />
                          <span>{workflow.timeCommitment}</span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="font-medium text-gray-900 dark:text-white">Key Requirements:</div>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            {workflow.requirements.slice(0, 2).map((req, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="font-medium text-gray-900 dark:text-white">Benefits:</div>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            {workflow.benefits.slice(0, 2).map((benefit, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex gap-2 pt-4">
                          <Button
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00DD89] hover:to-[#00AFE6] text-white border-0"
                            onClick={() => setSelectedWorkflow(workflow)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                            onClick={() => window.open(`mailto:${workflow.contactEmail}?subject=Interest in ${workflow.title}`, '_blank')}
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Workflow Detail Modal */}
      {selectedWorkflow && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {language === 'fr' ? selectedWorkflow.titleFr : selectedWorkflow.title}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedWorkflow(null)}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  ✕
                </Button>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="requirements">Requirements</TabsTrigger>
                  <TabsTrigger value="process">Process</TabsTrigger>
                  <TabsTrigger value="benefits">Benefits</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-300">
                      {language === 'fr' ? selectedWorkflow.descriptionFr : selectedWorkflow.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                        <div className="font-medium text-gray-900 dark:text-white mb-2">Time Commitment</div>
                        <div className="text-gray-600 dark:text-gray-300">{selectedWorkflow.timeCommitment}</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                        <div className="font-medium text-gray-900 dark:text-white mb-2">Difficulty Level</div>
                        <Badge className={getDifficultyColor(selectedWorkflow.difficulty)}>
                          {selectedWorkflow.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="requirements" className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Professional Requirements</h4>
                    <ul className="space-y-2">
                      {selectedWorkflow.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-300">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="process" className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Step-by-Step Process</h4>
                    <div className="space-y-4">
                      {selectedWorkflow.steps.map((step, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full flex items-center justify-center text-white font-bold">
                            {i + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-white mb-1">{step.title}</div>
                            <div className="text-gray-600 dark:text-gray-300 text-sm mb-2">{step.description}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Estimated time: {step.estimatedTime}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="benefits" className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Professional Benefits</h4>
                    <ul className="space-y-2">
                      {selectedWorkflow.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Star className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-300">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{selectedWorkflow.contactPerson}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{selectedWorkflow.contactEmail}</div>
                  </div>
                  <Button
                    className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00DD89] hover:to-[#00AFE6] text-white border-0"
                    onClick={() => window.open(`mailto:${selectedWorkflow.contactEmail}?subject=Interest in ${selectedWorkflow.title}`, '_blank')}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Support Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <HelpCircle className="w-8 h-8 text-[#00AFE6]" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Need Help Getting Started?
              </h3>
            </div>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Our professional support team is here to help you choose the right contribution pathway and guide you through the application process.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00DD89] hover:to-[#00AFE6] text-white border-0"
                onClick={() => window.location.href = '/contact'}
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Schedule Consultation
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => window.open('mailto:contributors@canadianamyloidosis.ca', '_blank')}
              >
                <Mail className="w-5 h-5 mr-2" />
                Email Support
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}