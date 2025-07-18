import { motion } from 'framer-motion';
import { FileText, Download, Calendar, CheckCircle, Shield, Users, Scale, BookOpen, ExternalLink, Eye, Lock, Globe, Award, Building2, UserCheck, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ParallaxBackground from '../components/ParallaxBackground';

interface GovernanceDocument {
  id: string;
  title: string;
  titleFr: string;
  description: string;
  descriptionFr: string;
  category: 'corporate' | 'clinical' | 'financial' | 'operational' | 'strategic';
  type: 'policy' | 'procedure' | 'guideline' | 'report' | 'charter' | 'framework';
  lastUpdated: string;
  version: string;
  status: 'current' | 'under-review' | 'draft' | 'archived';
  accessLevel: 'public' | 'member' | 'restricted';
  language: 'EN' | 'FR' | 'EN/FR';
  pageCount?: number;
  approvedBy?: string;
  effectiveDate?: string;
  reviewDate?: string;
  downloadUrl?: string;
  metadata: {
    keywords: string[];
    audience: string[];
    relatedDocuments: string[];
  };
}

const governanceDocuments: GovernanceDocument[] = [
  {
    id: 'articles-incorporation',
    title: 'Articles of Incorporation',
    titleFr: 'Statuts Constitutifs',
    description: 'Legal founding documents establishing CAS as a federal not-for-profit corporation',
    descriptionFr: 'Documents juridiques de fondation établissant SCA comme corporation fédérale à but non lucratif',
    category: 'corporate',
    type: 'charter',
    lastUpdated: '2024-01-15',
    version: '2.0',
    status: 'current',
    accessLevel: 'public',
    language: 'EN/FR',
    pageCount: 12,
    approvedBy: 'Corporations Canada',
    effectiveDate: '2024-01-15',
    reviewDate: '2029-01-15',
    downloadUrl: '/documents/articles-incorporation.pdf',
    metadata: {
      keywords: ['incorporation', 'legal', 'founding', 'corporation'],
      audience: ['legal', 'members', 'regulatory'],
      relatedDocuments: ['bylaws', 'strategic-plan']
    }
  },
  {
    id: 'bylaws',
    title: 'Corporate Bylaws',
    titleFr: 'Règlements Généraux',
    description: 'Governing rules and procedures for CAS operations, board governance, and membership',
    descriptionFr: 'Règles et procédures régissant les opérations de SCA, la gouvernance du conseil et l\'adhésion',
    category: 'corporate',
    type: 'policy',
    lastUpdated: '2024-06-20',
    version: '3.1',
    status: 'current',
    accessLevel: 'public',
    language: 'EN/FR',
    pageCount: 28,
    approvedBy: 'Board of Directors',
    effectiveDate: '2024-07-01',
    reviewDate: '2025-07-01',
    downloadUrl: '/documents/corporate-bylaws.pdf',
    metadata: {
      keywords: ['bylaws', 'governance', 'board', 'membership', 'procedures'],
      audience: ['board', 'members', 'legal'],
      relatedDocuments: ['articles-incorporation', 'board-charter']
    }
  },
  {
    id: 'strategic-plan',
    title: '2024-2027 Strategic Plan',
    titleFr: 'Plan Stratégique 2024-2027',
    description: 'Three-year strategic roadmap for advancing amyloidosis care and research in Canada',
    descriptionFr: 'Feuille de route stratégique triennale pour faire progresser les soins et la recherche sur l\'amylose au Canada',
    category: 'strategic',
    type: 'framework',
    lastUpdated: '2024-03-15',
    version: '1.0',
    status: 'current',
    accessLevel: 'public',
    language: 'EN/FR',
    pageCount: 45,
    approvedBy: 'Board of Directors',
    effectiveDate: '2024-01-01',
    reviewDate: '2026-01-01',
    downloadUrl: '/documents/strategic-plan-2024-2027.pdf',
    metadata: {
      keywords: ['strategic', 'planning', 'roadmap', 'priorities', 'goals'],
      audience: ['board', 'members', 'stakeholders'],
      relatedDocuments: ['annual-report', 'impact-framework']
    }
  },
  {
    id: 'clinical-governance',
    title: 'Clinical Governance Framework',
    titleFr: 'Cadre de Gouvernance Clinique',
    description: 'Framework for evidence-based clinical resource development and quality assurance',
    descriptionFr: 'Cadre pour le développement de ressources cliniques fondées sur des preuves et l\'assurance qualité',
    category: 'clinical',
    type: 'framework',
    lastUpdated: '2024-09-10',
    version: '2.2',
    status: 'current',
    accessLevel: 'member',
    language: 'EN/FR',
    pageCount: 35,
    approvedBy: 'Clinical Advisory Committee',
    effectiveDate: '2024-10-01',
    reviewDate: '2025-10-01',
    downloadUrl: '/documents/clinical-governance-framework.pdf',
    metadata: {
      keywords: ['clinical', 'governance', 'quality', 'evidence', 'standards'],
      audience: ['clinicians', 'researchers', 'quality-assurance'],
      relatedDocuments: ['evidence-standards', 'peer-review-process']
    }
  },
  {
    id: 'financial-policy',
    title: 'Financial Management Policy',
    titleFr: 'Politique de Gestion Financière',
    description: 'Comprehensive financial policies, procedures, and accountability frameworks',
    descriptionFr: 'Politiques financières complètes, procédures et cadres de responsabilité',
    category: 'financial',
    type: 'policy',
    lastUpdated: '2024-05-30',
    version: '1.8',
    status: 'current',
    accessLevel: 'member',
    language: 'EN/FR',
    pageCount: 22,
    approvedBy: 'Finance Committee',
    effectiveDate: '2024-06-01',
    reviewDate: '2025-06-01',
    downloadUrl: '/documents/financial-management-policy.pdf',
    metadata: {
      keywords: ['financial', 'policy', 'accountability', 'procedures', 'oversight'],
      audience: ['board', 'finance-committee', 'auditors'],
      relatedDocuments: ['audit-framework', 'annual-report']
    }
  },
  {
    id: 'contributor-guidelines',
    title: 'Professional Contributor Guidelines',
    titleFr: 'Lignes Directrices pour Contributeurs Professionnels',
    description: 'Guidelines for healthcare professionals contributing clinical resources and expertise',
    descriptionFr: 'Lignes directrices pour les professionnels de la santé contribuant des ressources cliniques et de l\'expertise',
    category: 'operational',
    type: 'guideline',
    lastUpdated: '2024-11-15',
    version: '1.5',
    status: 'current',
    accessLevel: 'public',
    language: 'EN/FR',
    pageCount: 18,
    approvedBy: 'Professional Standards Committee',
    effectiveDate: '2024-12-01',
    reviewDate: '2025-12-01',
    downloadUrl: '/documents/contributor-guidelines.pdf',
    metadata: {
      keywords: ['contributor', 'guidelines', 'professional', 'standards', 'resources'],
      audience: ['clinicians', 'researchers', 'contributors'],
      relatedDocuments: ['clinical-governance', 'peer-review-process']
    }
  }
];

export default function Governance() {
  const { t, language } = useLanguage();

  const getDocumentsByCategory = (category: string) => {
    return governanceDocuments.filter(doc => doc.category === category);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'corporate': return Building2;
      case 'clinical': return UserCheck;
      case 'financial': return Scale;
      case 'operational': return Users;
      case 'strategic': return Award;
      default: return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'under-review': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'draft': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getAccessIcon = (level: string) => {
    switch (level) {
      case 'public': return Globe;
      case 'member': return Users;
      case 'restricted': return Lock;
      default: return Eye;
    }
  };

  const categories = [
    { id: 'corporate', name: 'Corporate Governance', nameFr: 'Gouvernance Corporative', description: 'Legal and corporate structure documents' },
    { id: 'strategic', name: 'Strategic Planning', nameFr: 'Planification Stratégique', description: 'Strategic plans and organizational roadmaps' },
    { id: 'clinical', name: 'Clinical Governance', nameFr: 'Gouvernance Clinique', description: 'Clinical standards and quality frameworks' },
    { id: 'financial', name: 'Financial Management', nameFr: 'Gestion Financière', description: 'Financial policies and accountability frameworks' },
    { id: 'operational', name: 'Operations & Procedures', nameFr: 'Opérations et Procédures', description: 'Operational policies and procedures' }
  ];

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
            <Shield className="w-5 h-5 text-[#00AFE6]" />
            <span className="text-white/90 font-medium">Governance & Transparency</span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Governance Documents
          </motion.h1>

          <motion.p
            className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Access our comprehensive governance framework, policies, and organizational documents that guide CAS operations and ensure transparent, accountable healthcare leadership.
          </motion.p>
        </div>
      </ParallaxBackground>

      {/* Document Categories */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Document Categories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our governance documents are organized into key categories to ensure easy access and comprehensive coverage of organizational oversight.
            </p>
          </div>

          <div className="space-y-16">
            {categories.map((category, categoryIndex) => {
              const documents = getDocumentsByCategory(category.id);
              const CategoryIcon = getCategoryIcon(category.id);
              
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: categoryIndex * 0.2 }}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-2xl">
                      <CategoryIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {language === 'fr' ? category.nameFr : category.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">{category.description}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {documents.map((document, docIndex) => {
                      const AccessIcon = getAccessIcon(document.accessLevel);
                      
                      return (
                        <Card key={document.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                          <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg text-gray-900 dark:text-white mb-2">
                                  {language === 'fr' ? document.titleFr : document.title}
                                </CardTitle>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                  {language === 'fr' ? document.descriptionFr : document.description}
                                </p>
                              </div>
                              <AccessIcon className="w-5 h-5 text-gray-400 ml-2 flex-shrink-0" />
                            </div>
                          </CardHeader>
                          
                          <CardContent className="pt-0">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(document.status)}>
                                  {document.status}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  v{document.version}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {document.language}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  <span>{document.lastUpdated}</span>
                                </div>
                                {document.pageCount && (
                                  <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    <span>{document.pageCount} pages</span>
                                  </div>
                                )}
                              </div>
                              
                              {document.effectiveDate && (
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                  <span className="font-medium">Effective:</span> {document.effectiveDate}
                                </div>
                              )}
                              
                              <div className="flex gap-2 pt-2">
                                <Button
                                  size="sm"
                                  className="flex-1 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00DD89] hover:to-[#00AFE6] text-white border-0"
                                  onClick={() => window.open(document.downloadUrl, '_blank')}
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                                  onClick={() => window.open(document.downloadUrl, '_blank')}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Document Request Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-[#00AFE6]" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Request Additional Documents
              </h3>
            </div>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Need access to restricted documents or have questions about our governance framework? 
              Contact our governance team for assistance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00DD89] hover:to-[#00AFE6] text-white border-0"
                onClick={() => window.location.href = '/contact'}
              >
                <Shield className="w-5 h-5 mr-2" />
                Contact Governance Team
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => window.open('mailto:governance@canadianamyloidosis.ca', '_blank')}
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Email Direct
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}