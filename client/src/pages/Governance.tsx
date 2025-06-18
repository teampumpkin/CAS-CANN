import { motion } from 'framer-motion';
import { Users, Target, Award, Globe, ArrowRight, Shield, CheckCircle, Calendar, FileText, ExternalLink } from 'lucide-react';
import ParallaxBackground from '../components/ParallaxBackground';

export default function Governance() {
  const strategicPillars = [
    {
      icon: Users,
      title: "Community Building",
      description: "Foster a collaborative network of healthcare professionals, researchers, patients, and caregivers across Canada.",
      objectives: [
        "Expand membership across all provinces and territories",
        "Facilitate knowledge sharing and best practice development",
        "Support patient advocacy and education initiatives"
      ],
      color: "from-[#00AFE6] to-[#00DD89]"
    },
    {
      icon: Target,
      title: "Research Excellence",
      description: "Advance amyloidosis research through strategic partnerships and knowledge translation.",
      objectives: [
        "Support multi-center collaborative research initiatives",
        "Promote translation of research findings into clinical practice",
        "Develop national patient registries and databases"
      ],
      color: "from-[#00DD89] to-[#00AFE6]"
    },
    {
      icon: Award,
      title: "Clinical Excellence",
      description: "Enhance the quality and accessibility of amyloidosis care across Canada.",
      objectives: [
        "Develop clinical practice guidelines and standards",
        "Support healthcare professional education and training",
        "Improve diagnostic and treatment pathways"
      ],
      color: "from-purple-500 to-blue-500"
    },
    {
      icon: Globe,
      title: "Global Leadership",
      description: "Position Canada as a leader in amyloidosis research and care on the international stage.",
      objectives: [
        "Collaborate with international amyloidosis organizations",
        "Participate in global research and clinical trials",
        "Share Canadian innovations and best practices globally"
      ],
      color: "from-orange-500 to-red-500"
    }
  ];

  const boardMembers = [
    {
      name: "Dr. Sarah Chen",
      role: "President & Chair",
      affiliation: "University of Toronto",
      specialty: "Hematology-Oncology",
      bio: "Leading expert in AL amyloidosis with over 15 years of clinical and research experience."
    },
    {
      name: "Dr. Michael Rodriguez",
      role: "Vice President",
      affiliation: "University of British Columbia",
      specialty: "Cardiology",
      bio: "Cardiac amyloidosis specialist focused on early diagnosis and treatment optimization."
    },
    {
      name: "Dr. Jennifer Thompson",
      role: "Secretary-Treasurer",
      affiliation: "McGill University",
      specialty: "Nephrology",
      bio: "Researcher in renal amyloidosis and patient outcome studies."
    },
    {
      name: "Dr. Robert Kim",
      role: "Research Director",
      affiliation: "University of Calgary",
      specialty: "Neurology",
      bio: "Expert in hereditary amyloidosis and genetic counseling initiatives."
    }
  ];

  const committees = [
    {
      name: "Research & Clinical Affairs",
      chair: "Dr. Michael Rodriguez",
      focus: "Oversees research initiatives, clinical guidelines, and professional education",
      members: 8
    },
    {
      name: "Patient Advocacy & Education",
      chair: "Dr. Jennifer Thompson",
      focus: "Develops patient resources, advocacy programs, and public awareness campaigns",
      members: 6
    },
    {
      name: "Membership & Engagement",
      chair: "Dr. Robert Kim",
      focus: "Manages membership growth, professional development, and community outreach",
      members: 5
    },
    {
      name: "Finance & Operations",
      chair: "Dr. Sarah Chen",
      focus: "Oversees financial management, strategic planning, and operational efficiency",
      members: 4
    }
  ];

  const governanceDocuments = [
    {
      title: "CAS Constitution & Bylaws",
      description: "Foundational governance documents outlining organizational structure and procedures",
      type: "Constitutional",
      lastUpdated: "2023"
    },
    {
      title: "Strategic Plan 2024-2027",
      description: "Four-year strategic roadmap defining priorities and measurable outcomes",
      type: "Strategic",
      lastUpdated: "2024"
    },
    {
      title: "Code of Conduct",
      description: "Professional standards and ethical guidelines for all CAS members",
      type: "Policy",
      lastUpdated: "2023"
    },
    {
      title: "Research Ethics Policy",
      description: "Guidelines for ethical conduct in research activities and collaborations",
      type: "Policy",
      lastUpdated: "2024"
    },
    {
      title: "Privacy & Data Protection",
      description: "Comprehensive privacy policy governing data collection and usage",
      type: "Policy",
      lastUpdated: "2024"
    },
    {
      title: "Annual Report 2023",
      description: "Comprehensive review of achievements, finances, and strategic progress",
      type: "Report",
      lastUpdated: "2024"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <ParallaxBackground className="min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#00AFE6]/20 rounded-full blur-3xl -translate-x-48 -translate-y-48" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00DD89]/20 rounded-full blur-3xl translate-x-48 translate-y-48" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              className="inline-block mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20">
                <Shield className="w-4 h-4 text-[#00AFE6]" />
                <span className="text-sm font-medium text-white/90">Governance & Strategy</span>
              </div>
            </motion.div>
            
            <motion.h1
              className="text-5xl lg:text-7xl font-bold font-rosarivo mb-8 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                Leading Through
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Strategic Vision
              </span>
            </motion.h1>
            
            <motion.p
              className="text-xl text-white/70 leading-relaxed mb-10 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Discover how the Canadian Amyloidosis Society is governed, our strategic priorities, 
              and the leadership driving innovation in amyloidosis care and research across Canada.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <button className="group bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-8 py-4 rounded-full font-medium hover:shadow-2xl hover:shadow-[#00AFE6]/25 transition-all duration-300 flex items-center gap-2">
                View Strategic Plan
                <FileText className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white/10 backdrop-blur-xl text-white px-8 py-4 rounded-full font-medium border border-white/20 hover:bg-white/20 transition-all duration-300">
                Meet Our Leadership
              </button>
            </motion.div>
          </div>
        </div>
      </ParallaxBackground>

      {/* Strategic Pillars Section */}
      <section className="py-24 bg-gray-900 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 mb-8">
              <Target className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-white/90 font-medium">Strategic Framework</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold font-rosarivo mb-6">
              <span className="text-white">Four Strategic </span>
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Pillars
              </span>
            </h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">
              Our strategic approach is built on four foundational pillars that guide all initiatives and drive measurable impact in amyloidosis care.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {strategicPillars.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-6 mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${pillar.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <pillar.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-3 font-rosarivo">{pillar.title}</h3>
                    <p className="text-white/70 leading-relaxed mb-6">{pillar.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-white/90 mb-3 uppercase tracking-wide">Key Objectives</h4>
                  {pillar.objectives.map((objective, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#00AFE6] flex-shrink-0 mt-0.5" />
                      <span className="text-white/80 text-sm leading-relaxed">{objective}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-24 bg-gray-900 border-t border-white/10">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 mb-8">
              <Users className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-white/90 font-medium">Leadership</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold font-rosarivo mb-6">
              <span className="text-white">Board of </span>
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Directors
              </span>
            </h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">
              Our diverse leadership team brings together clinical expertise, research excellence, and strategic vision to advance amyloidosis care across Canada.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
            {boardMembers.map((member, index) => (
              <motion.div
                key={member.name}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
                    <p className="text-[#00AFE6] font-medium mb-2">{member.role}</p>
                    <p className="text-white/70 text-sm mb-2">{member.affiliation}</p>
                    <p className="text-white/60 text-sm mb-3">{member.specialty}</p>
                    <p className="text-white/80 text-sm leading-relaxed">{member.bio}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Committees */}
          <motion.div
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-white mb-6 font-rosarivo">Standing Committees</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {committees.map((committee, index) => (
                <div key={committee.name} className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-2">{committee.name}</h4>
                  <p className="text-[#00AFE6] text-sm font-medium mb-3">Chair: {committee.chair}</p>
                  <p className="text-white/70 text-sm mb-3 leading-relaxed">{committee.focus}</p>
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <Users className="w-4 h-4" />
                    <span>{committee.members} members</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Governance Documents */}
      <section className="py-24 bg-gray-900 border-t border-white/10">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 mb-8">
              <FileText className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-white/90 font-medium">Governance</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold font-rosarivo mb-6">
              <span className="text-white">Official </span>
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Documents
              </span>
            </h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">
              Access our foundational documents, policies, and reports that ensure transparent governance and strategic accountability.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {governanceDocuments.map((doc, index) => (
              <motion.div
                key={doc.title}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <ExternalLink className="w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors" />
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-white/90 transition-colors">
                  {doc.title}
                </h3>
                <p className="text-white/70 text-sm mb-4 leading-relaxed">{doc.description}</p>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="bg-[#00AFE6]/20 text-[#00AFE6] px-3 py-1 rounded-full">
                    {doc.type}
                  </span>
                  <div className="flex items-center gap-1 text-white/60">
                    <Calendar className="w-3 h-3" />
                    <span>Updated {doc.lastUpdated}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 border border-[#00AFE6]/20 rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">Stay Informed</h3>
              <p className="text-white/80 mb-6 leading-relaxed">
                For questions about governance, strategic initiatives, or to request additional documentation, 
                please contact our administrative office.
              </p>
              <button className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-8 py-4 rounded-full font-medium hover:shadow-2xl hover:shadow-[#00AFE6]/25 transition-all duration-300 flex items-center gap-2 mx-auto">
                Contact Governance Team
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}