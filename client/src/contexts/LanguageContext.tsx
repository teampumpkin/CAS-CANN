import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation data
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.resources': 'Resources',
    'nav.directory': 'Directory',
    'nav.community': 'Community',
    'nav.contact': 'Contact',
    'nav.getHelp': 'Get Help',
    
    // Hero Section
    'hero.badge': 'Transforming Amyloidosis Care in Canada',
    'hero.title.canadian': 'Canadian',
    'hero.title.amyloidosis': 'Amyloidosis',
    'hero.title.society': 'Society',
    'hero.subtitle': 'Accelerating awareness, diagnosis, and care',
    'hero.getStarted': 'Get Started',
    'hero.learnMore': 'Learn More',
    
    // Welcome Section
    'welcome.badge': 'Who we are',
    'welcome.title.welcome': 'Welcome to the',
    'welcome.title.cas': 'Canadian Amyloidosis Society',
    'welcome.subtitle': 'Your trusted partner in amyloidosis care, connecting patients, families, and healthcare professionals across Canada.',
    'welcome.description': 'We are dedicated to improving the lives of those affected by amyloidosis through education, support, and advocacy. Our comprehensive platform provides essential resources, connects you with specialized care, and builds a supportive community for patients and families nationwide.',
    'welcome.mission': 'Our Mission',
    'welcome.missionText': 'To accelerate awareness, improve diagnosis, and enhance care for amyloidosis patients across Canada through education, advocacy, and community support.',
    'welcome.vision': 'Our Vision',
    'welcome.visionText': 'A future where every Canadian affected by amyloidosis receives timely diagnosis, optimal treatment, and comprehensive support.',
    'welcome.exploreResources': 'Learn More About Our Work',
    
    // About Amyloidosis Section
    'about.badge': 'Medical Information',
    'about.title.what': 'What is',
    'about.title.amyloidosis': 'Amyloidosis',
    'about.subtitle': 'Amyloidosis is a rare disease with life-altering consequences—but early detection can dramatically improve outcomes. The Canadian Amyloidosis Society is building a trusted national hub for clinicians, researchers, and families seeking answers.',
    'about.description': 'Amyloidosis is a rare but serious condition where misfolded proteins (amyloid) accumulate in organs and tissues throughout the body. Understanding the different types, recognizing early symptoms, and accessing specialized care are crucial for managing this condition effectively.',
    'about.earlyDetection': 'Early Detection Saves Lives',
    'about.earlyDetectionText': 'Recognizing symptoms early and getting proper diagnosis can significantly improve treatment outcomes and quality of life.',
    'about.earlyDetection.title': 'Early Detection',
    'about.earlyDetection.subtitle': 'Saves Lives',
    'about.earlyDetection.description': 'Amyloidosis is often misdiagnosed or diagnosed late because its symptoms mimic other conditions. Early recognition and proper testing are crucial for better patient outcomes.',
    'about.earlyDetection.subdescription': 'Our directory connects patients with specialized centers and healthcare providers experienced in diagnosing and treating amyloidosis across Canada.',
    'about.learnMore': 'Learn More',
    'about.types.al.name': 'AL Amyloidosis',
    'about.types.al.description': 'Most common form, affects heart, kidneys, liver, and nervous system',
    'about.types.al.prevalence': '70% of cases',
    'about.types.aa.name': 'AA Amyloidosis',
    'about.types.aa.description': 'Secondary to chronic inflammatory conditions',
    'about.types.aa.prevalence': '20% of cases',
    'about.types.hereditary.name': 'Hereditary',
    'about.types.hereditary.description': 'Genetic forms including TTR, fibrinogen, and lysozyme',
    'about.types.hereditary.prevalence': '5% of cases',
    'about.types.other.name': 'Other Types',
    'about.types.other.description': 'Including β2-microglobulin and localized forms',
    'about.types.other.prevalence': '5% of cases',
    'about.stats.diagnosisTime': '2-3 years',
    'about.stats.diagnosisTimeLabel': 'Average time to diagnosis',
    'about.stats.diagnosisTimeDesc': 'Many patients see multiple doctors before receiving proper diagnosis',
    'about.stats.canadiansAffected': '3,000+',
    'about.stats.canadiansAffectedLabel': 'Canadians affected',
    'about.stats.canadiansAffectedDesc': 'Estimated number of people living with amyloidosis in Canada',
    
    // Events & Newsletter Section
    'events.badge': 'Stay Connected',
    'events.title.events': 'Events',
    'events.title.newsletter': '& Newsletter',
    'events.subtitle': 'Stay informed about the latest research, treatment advances, and community events in amyloidosis care.',
    'events.description': 'Join our community to receive regular updates, educational content, and information about upcoming events, webinars, and support group meetings.',
    'events.upcomingEvents': 'Upcoming Events',
    'events.latestNews': 'Latest News & Updates',
    'events.emailPlaceholder': 'Enter your email address',
    'events.subscribe': 'Subscribe to Newsletter',
    'events.stayConnected': 'Stay Connected',
    'events.joinCommunity': 'Join Our Community',
    'events.joinCommunityDesc': 'Get exclusive access to research updates, community events, and expert insights delivered monthly.',
    'events.joinMembers': 'Join 5,000+ community members',
    'events.stats.subscribers': 'Subscribers',
    'events.stats.eventsYear': 'Events/Year',
    'events.stats.provinces': 'Provinces',
    'events.stats.satisfaction': 'Satisfaction',
    'events.communityCalendar': 'Community Calendar',
    'events.communityCalendarDesc': 'Connect with experts, patients, and researchers through our comprehensive event program.',
    
    // Directory Section
    'directory.badge': 'Find Care',
    'directory.title.find': 'Find',
    'directory.title.specialized': 'Specialized Care',
    'directory.subtitle': 'Connecting healthcare across the nation',
    'directory.networkReach': 'Network Reach',
    'directory.healthcareProviders': 'Healthcare Providers',
    'directory.provincesAndTerritories': 'Provinces & Territories',
    'directory.majorCities': 'Major Cities',
    'directory.resourcesAvailable': 'Resources Available',
    'directory.browseDirectory': 'Browse Directory',
    'directory.searchableDirectory': 'Searchable Healthcare Directory',
    'directory.searchableDescription': 'Find specialized amyloidosis treatment centers, experienced physicians, and clinical experts across all Canadian provinces and territories.',
    'directory.exploreDirectory': 'Explore Full Directory',
    'directory.liveStats': 'Live Stats',
    'directory.directoryInsights': 'Directory Insights',
    'directory.needHelp': 'Need Help Finding Care?',
    'directory.nationalNetwork': 'National Network',
    'directory.canadaWide': 'Canada-Wide Coverage',
    'directory.connectingHealthcare': 'Connecting healthcare across the nation',
    
    // Quick Links Section
    'quickLinks.badge': 'Quick Access',
    'quickLinks.title.essential': 'Essential',
    'quickLinks.title.resources': 'Resources',
    'quickLinks.subtitle': 'Quick access to the most important tools and information for patients, families, and healthcare professionals.',
    'quickLinks.patientResources': 'Patient Resources',
    'quickLinks.patientResourcesDesc': 'Comprehensive guides and support materials',
    'quickLinks.findSpecialists': 'Find Specialists',
    'quickLinks.findSpecialistsDesc': 'Locate amyloidosis experts near you',
    'quickLinks.researchLibrary': 'Research Library',
    'quickLinks.researchLibraryDesc': 'Latest studies and clinical findings',
    'quickLinks.supportGroups': 'Support Groups',
    'quickLinks.supportGroupsDesc': 'Connect with other patients and families',
    'quickLinks.treatmentOptions': 'Treatment Options',
    'quickLinks.treatmentOptionsDesc': 'Explore available therapies and care',
    'quickLinks.contactUs': 'Contact Us',
    'quickLinks.contactUsDesc': 'Get in touch with our team',
    'quickLinks.getInvolved': 'Get Involved',
    'quickLinks.getInvolvedDesc': 'Volunteer, donate, or advocate with us',
    'quickLinks.events': 'Events',
    'quickLinks.eventsDesc': 'Upcoming conferences and webinars',
    'quickLinks.available': 'Available',
    'quickLinks.accessNow': 'Access Now',
    'quickLinks.needHelp': "Need help finding what you're looking for?",
    'quickLinks.contactSupport': 'Contact Support',
    
    // About Page
    'about.values.patientCentered.title': 'Patient-Centered',
    'about.values.patientCentered.description': 'We elevate lived experience alongside clinical and scientific expertise.',
    'about.values.collaborative.title': 'Collaborative',
    'about.values.collaborative.description': 'We bridge sectors and geographies to drive collective impact.',
    'about.values.evidenceInformed.title': 'Evidence-Informed',
    'about.values.evidenceInformed.description': 'We prioritize data, research, and clinical excellence.',
    'about.values.transparent.title': 'Transparent',
    'about.values.transparent.description': 'We uphold clarity, governance, and responsible leadership.',
    'about.services.directory': 'Curate a national Directory of clinics, care teams, and resources',
    'about.services.diagnosis': 'Facilitate access to tools that support earlier and more accurate diagnosis',
    'about.services.information': 'Share trusted information for patients, families, and care providers',
    'about.services.resources': 'Enable clinicians to upload, share, and adapt resources',
    'about.services.committee': 'Convene a national Executive Committee for strategic alignment',
    
    // Contact Page
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Get in touch with our team',
    'contact.form.name': 'Name',
    'contact.form.email': 'Email',
    'contact.form.organization': 'Organization',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Message',
    'contact.form.send': 'Send Message',
    
    // Directory Page
    'directory.page.title': 'Healthcare Directory',
    'directory.page.subtitle': 'Find specialized amyloidosis care across Canada',
    'directory.search.placeholder': 'Search by location, specialty, or provider name',
    'directory.provinces': 'Provinces & Territories',
    'directory.centers': 'Treatment Centers',
    'directory.specialists': 'Specialists',
    
    // Resources Page
    'resources.title': 'Resource Library',
    'resources.subtitle': 'Access comprehensive amyloidosis resources',
    'resources.search.placeholder': 'Search resources...',
    'resources.filters.type': 'Resource Type',
    'resources.filters.audience': 'Audience',
    'resources.filters.language': 'Language',
    'resources.types.all': 'All Types',
    'resources.types.al': 'AL (Light Chain)',
    'resources.types.attr': 'ATTR (Transthyretin)',
    'resources.types.aa': 'AA (Inflammatory)',
    'resources.types.alect2': 'ALect2',
    'resources.types.general': 'General',
    'resources.filters.advanced': 'Advanced Filters',
    'resources.filters.clearAll': 'Clear All',
    
    // About Page - Hero Section
    'about.hero.badge': 'About Canadian Amyloidosis Society',
    'about.hero.title.connecting': 'Connecting',
    'about.hero.title.healthcare': 'Healthcare',
    'about.hero.title.canada': 'Canada',
    'about.hero.description': 'Connecting patients, clinicians, researchers, and advocates to improve outcomes in amyloidosis care across Canada.',
    'about.hero.ourMission': 'Our Mission',
    'about.hero.getInvolved': 'Get Involved',
    
    // Contact Page
    'contact.hero.badge': 'Contact Us',
    'contact.hero.title': 'Get in Touch',
    'contact.hero.description': 'We\'re here to help. Whether you\'re a patient, caregiver, or healthcare professional, reach out to us.',
    
    // Directory Page
    'directory.hero.badge': 'Directory - Find Support',
    'directory.hero.title.find': 'Find',
    'directory.hero.title.support': 'Support',
    'directory.hero.title.nearYou': 'Near You',
    'directory.hero.description': 'Connect with specialized treatment centers, research programs, and healthcare professionals across Canada.',
    
    // AboutAmyloidosis Page
    'aboutAmyloidosis.hero.badge': 'About Amyloidosis',
    'aboutAmyloidosis.hero.title.understanding': 'Understanding',
    'aboutAmyloidosis.hero.title.amyloidosis': 'Amyloidosis',
    'aboutAmyloidosis.hero.description': 'Learn about the signs, types, diagnosis, and treatment of amyloidosis to help you or your loved one.',
    
    // Healthcare Center Modal
    'modal.aboutThisCenter': 'About This Center',
    'modal.specialties': 'Specialties',
    'modal.services': 'Services',
    'modal.contactInformation': 'Contact Information',
    'modal.established': 'Established',
    'modal.certifications': 'Certifications',
    'modal.callNow': 'Call Now',
    'modal.sendEmail': 'Send Email',
    'modal.visitWebsite': 'Visit Website',
    'modal.viewOnMap': 'View on Map',
    
    // Healthcare Map Legend
    'map.legend.title': 'Healthcare Centers',
    'map.legend.hospitals': 'Hospitals',
    'map.legend.specialty': 'Specialty Centers',
    'map.legend.research': 'Research Centers',
    'map.legend.clinics': 'Clinics',
    
    // Footer
    'footer.aboutUs': 'About Us',
    'footer.ourMission': 'Our Mission',
    'footer.boardOfDirectors': 'Board of Directors',
    'footer.annualReports': 'Annual Reports',
    'footer.resources': 'Resources',
    'footer.patientResources': 'Patient Resources',
    'footer.educationalMaterials': 'Educational Materials',
    'footer.researchLibrary': 'Research Library',
    'footer.support': 'Support',
    'footer.supportGroups': 'Support Groups',
    'footer.events': 'Events',
    'footer.newsletter': 'Newsletter',
    'footer.getInvolved': 'Get Involved',
    'footer.contact': 'Contact',
    'footer.getHelp': 'Get Help',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.copyright': '© 2024 Canadian Amyloidosis Society. All rights reserved.',
    'footer.registeredCharity': 'Registered Charity #123456789RR0001'
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.about': 'À propos',
    'nav.resources': 'Ressources',
    'nav.directory': 'Répertoire',
    'nav.community': 'Communauté',
    'nav.contact': 'Contact',
    'nav.getHelp': 'Obtenir de l\'aide',
    
    // Hero Section
    'hero.badge': 'Transformer les soins de l\'amylose au Canada',
    'hero.title.canadian': 'Société',
    'hero.title.amyloidosis': 'Canadienne',
    'hero.title.society': 'd\'Amylose',
    'hero.subtitle': 'Accélérer la sensibilisation, le diagnostic et les soins',
    'hero.getStarted': 'Commencer',
    'hero.learnMore': 'En savoir plus',
    
    // Welcome Section
    'welcome.badge': 'Qui nous sommes',
    'welcome.title.welcome': 'Bienvenue à la',
    'welcome.title.cas': 'Société Canadienne d\'Amylose',
    'welcome.subtitle': 'Votre partenaire de confiance dans les soins de l\'amylose, connectant les patients, les familles et les professionnels de la santé à travers le Canada.',
    'welcome.description': 'Nous nous consacrons à améliorer la vie de ceux qui sont touchés par l\'amylose grâce à l\'éducation, au soutien et à la défense des droits. Notre plateforme complète fournit des ressources essentielles, vous connecte avec des soins spécialisés et construit une communauté de soutien pour les patients et les familles à travers le pays.',
    'welcome.mission': 'Notre Mission',
    'welcome.missionText': 'Accélérer la sensibilisation, améliorer le diagnostic et améliorer les soins pour les patients d\'amylose à travers le Canada grâce à l\'éducation, à la défense et au soutien communautaire.',
    'welcome.vision': 'Notre Vision',
    'welcome.visionText': 'Un avenir où chaque Canadien affecté par l\'amylose reçoit un diagnostic opportun, un traitement optimal et un soutien complet.',
    'welcome.exploreResources': 'En savoir plus sur notre travail',
    
    // About Amyloidosis Section
    'about.badge': 'Information Médicale',
    'about.title.what': 'Qu\'est-ce que l\'',
    'about.title.amyloidosis': 'Amylose',
    'about.subtitle': 'L\'amylose est une maladie rare aux conséquences bouleversantes, mais la détection précoce peut considérablement améliorer les résultats. La Société Canadienne d\'Amylose construit un centre national fiable pour les cliniciens, les chercheurs et les familles qui cherchent des réponses.',
    'about.description': 'L\'amylose est une condition rare mais sérieuse où les protéines mal repliées (amyloïde) s\'accumulent dans les organes et les tissus à travers le corps. Comprendre les différents types, reconnaître les symptômes précoces et accéder aux soins spécialisés sont cruciaux pour gérer cette condition efficacement.',
    'about.earlyDetection': 'La Détection Précoce Sauve des Vies',
    'about.earlyDetectionText': 'Reconnaître les symptômes tôt et obtenir un diagnostic approprié peut considérablement améliorer les résultats du traitement et la qualité de vie.',
    'about.earlyDetection.title': 'Détection Précoce',
    'about.earlyDetection.subtitle': 'Sauve des Vies',
    'about.earlyDetection.description': 'L\'amylose est souvent mal diagnostiquée ou diagnostiquée tard parce que ses symptômes imitent d\'autres conditions. La reconnaissance précoce et les tests appropriés sont cruciaux pour de meilleurs résultats du patient.',
    'about.earlyDetection.subdescription': 'Notre répertoire connecte les patients avec des centres spécialisés et des fournisseurs de soins de santé expérimentés dans le diagnostic et le traitement de l\'amylose à travers le Canada.',
    'about.learnMore': 'En savoir plus',
    'about.types.al.name': 'Amiloidosis AL',
    'about.types.al.description': 'Forma más común, afecta corazón, riñones, hígado y sistema nervioso',
    'about.types.al.prevalence': '70% de los casos',
    'about.types.aa.name': 'Amiloidosis AA',
    'about.types.aa.description': 'Secundaria a condiciones inflamatorias crónicas',
    'about.types.aa.prevalence': '20% de los casos',
    'about.types.hereditary.name': 'Hereditaria',
    'about.types.hereditary.description': 'Formas genéticas incluyendo TTR, fibrinógeno y lisozima',
    'about.types.hereditary.prevalence': '5% de los casos',
    'about.types.other.name': 'Otros Tipos',
    'about.types.other.description': 'Incluyendo β2-microglobulina y formas localizadas',
    'about.types.other.prevalence': '5% de los casos',
    'about.stats.diagnosisTime': '2-3 años',
    'about.stats.diagnosisTimeLabel': 'Tiempo promedio para el diagnóstico',
    'about.stats.diagnosisTimeDesc': 'Muchos pacientes ven múltiples médicos antes de recibir un diagnóstico adecuado',
    'about.stats.canadiansAffected': '3,000+',
    'about.stats.canadiansAffectedLabel': 'Canadienses afectados',
    'about.stats.canadiansAffectedDesc': 'Número estimado de personas que viven con amiloidosis en Canadá',
    
    // Events & Newsletter Section
    'events.badge': 'Manténgase Conectado',
    'events.title.events': 'Eventos',
    'events.title.newsletter': '& Boletín',
    'events.subtitle': 'Únase a nuestra comunidad para mantenerse informado sobre las últimas investigaciones, eventos próximos y actualizaciones importantes en el cuidado de la amiloidosis en todo Canadá.',
    'events.description': 'Únase a nuestra comunidad para recibir actualizaciones regulares, contenido educativo e información sobre próximos eventos, webinarios y reuniones de grupos de apoyo.',
    'events.upcomingEvents': 'Próximos Eventos',
    'events.latestNews': 'Últimas Noticias y Actualizaciones',
    'events.emailPlaceholder': 'Ingrese su dirección de correo electrónico',
    'events.subscribe': 'Suscribirse al Boletín',
    'events.stayConnected': 'Manténgase Conectado',
    'events.joinCommunity': 'Únase a Nuestra Comunidad',
    'events.joinCommunityDesc': 'Obtenga acceso exclusivo a actualizaciones de investigación, eventos comunitarios y perspectivas de expertos entregadas mensualmente.',
    'events.joinMembers': 'Únase a más de 5,000 miembros de la comunidad',
    'events.stats.subscribers': 'Suscriptores',
    'events.stats.eventsYear': 'Eventos/Año',
    'events.stats.provinces': 'Provincias',
    'events.stats.satisfaction': 'Satisfacción',
    'events.communityCalendar': 'Calendario Comunitario',
    'events.communityCalendarDesc': 'Conéctese con expertos, pacientes e investigadores a través de nuestro programa integral de eventos.',
    
    // Directory Section
    'directory.badge': 'Encontrar Atención',
    'directory.title.find': 'Encontrar',
    'directory.title.specialized': 'Atención Especializada',
    'directory.subtitle': 'Acceso a atención especializada, recursos clínicos y redes de apoyo en todo Canadá',
    'directory.networkReach': 'Alcance de la Red',
    'directory.healthcareProviders': 'Proveedores de Atención Médica',
    'directory.provincesAndTerritories': 'Provincias y Territorios',
    'directory.majorCities': 'Ciudades Principales',
    'directory.resourcesAvailable': 'Recursos Disponibles',
    'directory.browseDirectory': 'Explorar Directorio',
    'directory.searchableDirectory': 'Directorio Médico Buscable',
    'directory.searchableDescription': 'Encuentre centros de tratamiento especializados en amiloidosis, médicos experimentados y expertos clínicos en todas las provincias y territorios canadienses.',
    'directory.exploreDirectory': 'Explorar Directorio Completo',
    'directory.liveStats': 'Estadísticas en Vivo',
    'directory.directoryInsights': 'Perspectivas del Directorio',
    'directory.needHelp': '¿Necesita Ayuda para Encontrar Atención?',
    'directory.nationalNetwork': 'Red Nacional',
    'directory.canadaWide': 'Cobertura Nacional de Canadá',
    'directory.connectingHealthcare': 'Conectando la atención médica en toda la nación',
    
    // Quick Links Section
    'quickLinks.badge': 'Acceso Rápido',
    'quickLinks.title.essential': 'Recursos',
    'quickLinks.title.resources': 'Esenciales',
    'quickLinks.subtitle': 'Acceso rápido a las herramientas e información más importantes para pacientes, familias y profesionales de la salud.',
    'quickLinks.patientResources': 'Recursos para Pacientes',
    'quickLinks.patientResourcesDesc': 'Guías integrales y materiales de apoyo',
    'quickLinks.findSpecialists': 'Encontrar Especialistas',
    'quickLinks.findSpecialistsDesc': 'Localice expertos en amiloidosis cerca de usted',
    'quickLinks.researchLibrary': 'Biblioteca de Investigación',
    'quickLinks.researchLibraryDesc': 'Últimos estudios y hallazgos clínicos',
    'quickLinks.supportGroups': 'Grupos de Apoyo',
    'quickLinks.supportGroupsDesc': 'Conectar con otros pacientes y familias',
    'quickLinks.treatmentOptions': 'Opciones de Tratamiento',
    'quickLinks.treatmentOptionsDesc': 'Explorar terapias disponibles y cuidados',
    'quickLinks.contactUs': 'Contáctanos',
    'quickLinks.contactUsDesc': 'Póngase en contacto con nuestro equipo',
    'quickLinks.getInvolved': 'Participar',
    'quickLinks.getInvolvedDesc': 'Voluntariado, donar o abogar con nosotros',
    'quickLinks.events': 'Eventos',
    'quickLinks.eventsDesc': 'Próximas conferencias y webinarios',
    'quickLinks.available': 'Disponible',
    'quickLinks.accessNow': 'Acceder Ahora',
    'quickLinks.needHelp': '¿Necesita ayuda para encontrar lo que busca?',
    'quickLinks.contactSupport': 'Contactar Soporte',
    
    // About Page
    'about.values.patientCentered.title': 'Centrado en el Paciente',
    'about.values.patientCentered.description': 'Elevamos la experiencia vivida junto con la experiencia clínica y científica.',
    'about.values.collaborative.title': 'Colaborativo',
    'about.values.collaborative.description': 'Conectamos sectores y geografías para impulsar el impacto colectivo.',
    'about.values.evidenceInformed.title': 'Basado en Evidencia',
    'about.values.evidenceInformed.description': 'Priorizamos los datos, la investigación y la excelencia clínica.',
    'about.values.transparent.title': 'Transparente',
    'about.values.transparent.description': 'Defendemos la claridad, la gobernanza y el liderazgo responsable.',
    'about.services.directory': 'Curar un Directorio nacional de clínicas, equipos de atención y recursos',
    'about.services.diagnosis': 'Facilitar el acceso a herramientas que apoyen el diagnóstico más temprano y preciso',
    'about.services.information': 'Compartir información confiable para pacientes, familias y proveedores de atención',
    'about.services.resources': 'Permitir que los médicos suban, compartan y adapten recursos',
    'about.services.committee': 'Convocar un Comité Ejecutivo nacional para la alineación estratégica',
    
    // Contact Page
    'contact.title': 'Contáctanos',
    'contact.subtitle': 'Ponte en contacto con nuestro equipo',
    'contact.form.name': 'Nombre',
    'contact.form.email': 'Correo Electrónico',
    'contact.form.organization': 'Organización',
    'contact.form.subject': 'Asunto',
    'contact.form.message': 'Mensaje',
    'contact.form.send': 'Enviar Mensaje',
    
    // Directory Page
    'directory.page.title': 'Directorio de Atención Médica',
    'directory.page.subtitle': 'Encuentra atención especializada en amiloidosis en todo Canadá',
    'directory.search.placeholder': 'Buscar por ubicación, especialidad o nombre del proveedor',
    'directory.provinces': 'Provincias y Territorios',
    'directory.centers': 'Centros de Tratamiento',
    'directory.specialists': 'Especialistas',
    
    // Resources Page
    'resources.title': 'Biblioteca de Recursos',
    'resources.subtitle': 'Accede a recursos integrales sobre amiloidosis',
    'resources.search.placeholder': 'Buscar recursos...',
    'resources.filters.type': 'Tipo de Recurso',
    'resources.filters.audience': 'Audiencia',
    'resources.filters.language': 'Idioma',
    'resources.types.all': 'Todos los Tipos',
    'resources.types.al': 'AL (Cadena Ligera)',
    'resources.types.attr': 'ATTR (Transtiretina)',
    'resources.types.aa': 'AA (Inflamatoria)',
    'resources.types.alect2': 'ALect2',
    'resources.types.general': 'General',
    'resources.filters.advanced': 'Filtros Avanzados',
    'resources.filters.clearAll': 'Limpiar Todo',
    
    // About Page - Hero Section
    'about.hero.badge': 'Acerca de la Sociedad Canadiense de Amiloidosis',
    'about.hero.title.connecting': 'Conectando',
    'about.hero.title.healthcare': 'Atención Médica',
    'about.hero.title.canada': 'Canadá',
    'about.hero.description': 'Conectando pacientes, médicos, investigadores y defensores para mejorar los resultados en la atención de amiloidosis en todo Canadá.',
    'about.hero.ourMission': 'Nuestra Misión',
    'about.hero.getInvolved': 'Involucrarse',
    
    // Contact Page
    'contact.hero.badge': 'Contáctanos',
    'contact.hero.title': 'Ponte en Contacto',
    'contact.hero.description': 'Estamos aquí para ayudar. Ya sea paciente, cuidador o profesional de la salud, contáctanos.',
    
    // Directory Page
    'directory.hero.badge': 'Directorio - Encuentra Apoyo',
    'directory.hero.title.find': 'Encuentra',
    'directory.hero.title.support': 'Apoyo',
    'directory.hero.title.nearYou': 'Cerca de Ti',
    'directory.hero.description': 'Conecta con centros de tratamiento especializados, programas de investigación y profesionales de la salud en todo Canadá.',
    
    // AboutAmyloidosis Page
    'aboutAmyloidosis.hero.badge': 'Acerca de la Amiloidosis',
    'aboutAmyloidosis.hero.title.understanding': 'Entendiendo',
    'aboutAmyloidosis.hero.title.amyloidosis': 'Amiloidosis',
    'aboutAmyloidosis.hero.description': 'Aprende sobre los signos, tipos, diagnóstico y tratamiento de la amiloidosis para ayudarte a ti o a tu ser querido.',
    
    // Healthcare Center Modal
    'modal.aboutThisCenter': 'Acerca de Este Centro',
    'modal.specialties': 'Especialidades',
    'modal.services': 'Servicios',
    'modal.contactInformation': 'Información de Contacto',
    'modal.established': 'Establecido',
    'modal.certifications': 'Certificaciones',
    'modal.callNow': 'Llamar Ahora',
    'modal.sendEmail': 'Enviar Email',
    'modal.visitWebsite': 'Visitar Sitio Web',
    'modal.viewOnMap': 'Ver en Mapa',
    
    // Healthcare Map Legend
    'map.legend.title': 'Centros de Atención Médica',
    'map.legend.hospitals': 'Hospitales',
    'map.legend.specialty': 'Centros Especializados',
    'map.legend.research': 'Centros de Investigación',
    'map.legend.clinics': 'Clínicas',
    
    // Footer
    'footer.aboutUs': 'Acerca de Nosotros',
    'footer.ourMission': 'Nuestra Misión',
    'footer.boardOfDirectors': 'Junta Directiva',
    'footer.annualReports': 'Informes Anuales',
    'footer.resources': 'Recursos',
    'footer.patientResources': 'Recursos para Pacientes',
    'footer.educationalMaterials': 'Materiales Educativos',
    'footer.researchLibrary': 'Biblioteca de Investigación',
    'footer.support': 'Apoyo',
    'footer.supportGroups': 'Grupos de Apoyo',
    'footer.events': 'Eventos',
    'footer.newsletter': 'Boletín',
    'footer.getInvolved': 'Involucrarse',
    'footer.contact': 'Contacto',
    'footer.getHelp': 'Obtener Ayuda',
    'footer.privacy': 'Política de Privacidad',
    'footer.terms': 'Términos de Servicio',
    'footer.copyright': '© 2024 Sociedad Canadiense de Amiloidosis. Todos los derechos reservados.',
    'footer.registeredCharity': 'Organización Benéfica Registrada #123456789RR0001'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fr')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};