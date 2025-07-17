import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'es';

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
    'about.learnMore': 'Learn More About Amyloidosis',
    
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
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.about': 'Acerca de',
    'nav.resources': 'Recursos',
    'nav.directory': 'Directorio',
    'nav.community': 'Comunidad',
    'nav.contact': 'Contacto',
    'nav.getHelp': 'Obtener Ayuda',
    
    // Hero Section
    'hero.badge': 'Transformando el Cuidado de la Amiloidosis en Canadá',
    'hero.title.canadian': 'Sociedad',
    'hero.title.amyloidosis': 'Canadiense',
    'hero.title.society': 'de Amiloidosis',
    'hero.subtitle': 'Acelerando la conciencia, el diagnóstico y la atención',
    'hero.getStarted': 'Comenzar',
    'hero.learnMore': 'Saber Más',
    
    // Welcome Section
    'welcome.badge': 'Quiénes somos',
    'welcome.title.welcome': 'Bienvenido a la',
    'welcome.title.cas': 'Sociedad Canadiense de Amiloidosis',
    'welcome.subtitle': 'Su socio de confianza en el cuidado de la amiloidosis, conectando pacientes, familias y profesionales de la salud en todo Canadá.',
    'welcome.description': 'Estamos dedicados a mejorar las vidas de quienes se ven afectados por la amiloidosis a través de la educación, el apoyo y la defensa. Nuestra plataforma integral proporciona recursos esenciales, lo conecta con atención especializada y construye una comunidad de apoyo para pacientes y familias en todo el país.',
    'welcome.mission': 'Nuestra Misión',
    'welcome.missionText': 'Acelerar la conciencia, mejorar el diagnóstico y mejorar la atención para pacientes con amiloidosis en todo Canadá a través de la educación, la defensa y el apoyo comunitario.',
    'welcome.vision': 'Nuestra Visión',
    'welcome.visionText': 'Un futuro donde cada canadiense afectado por la amiloidosis reciba un diagnóstico oportuno, tratamiento óptimo y apoyo integral.',
    'welcome.exploreResources': 'Aprenda Más Sobre Nuestro Trabajo',
    
    // About Amyloidosis Section
    'about.badge': 'Información Médica',
    'about.title.what': '¿Qué es la',
    'about.title.amyloidosis': 'Amiloidosis',
    'about.subtitle': 'La amiloidosis es una enfermedad rara con consecuencias que cambian la vida, pero la detección temprana puede mejorar dramáticamente los resultados. La Sociedad Canadiense de Amiloidosis está construyendo un centro nacional confiable para médicos, investigadores y familias que buscan respuestas.',
    'about.description': 'La amiloidosis es una condición rara pero seria donde las proteínas mal plegadas (amiloide) se acumulan en órganos y tejidos por todo el cuerpo. Entender los diferentes tipos, reconocer los síntomas tempranos y acceder a atención especializada son cruciales para manejar esta condición efectivamente.',
    'about.earlyDetection': 'La Detección Temprana Salva Vidas',
    'about.earlyDetectionText': 'Reconocer los síntomas temprano y obtener un diagnóstico adecuado puede mejorar significativamente los resultados del tratamiento y la calidad de vida.',
    'about.learnMore': 'Aprenda Más Sobre la Amiloidosis',
    
    // Events & Newsletter Section
    'events.badge': 'Manténgase Conectado',
    'events.title.events': 'Eventos',
    'events.title.newsletter': 'y Boletín',
    'events.subtitle': 'Manténgase informado sobre las últimas investigaciones, avances en tratamiento y eventos comunitarios en el cuidado de la amiloidosis.',
    'events.description': 'Únase a nuestra comunidad para recibir actualizaciones regulares, contenido educativo e información sobre próximos eventos, webinarios y reuniones de grupos de apoyo.',
    'events.upcomingEvents': 'Próximos Eventos',
    'events.latestNews': 'Últimas Noticias y Actualizaciones',
    'events.emailPlaceholder': 'Ingrese su dirección de correo electrónico',
    'events.subscribe': 'Suscribirse al Boletín',
    
    // Directory Section
    'directory.badge': 'Encontrar Atención',
    'directory.title.find': 'Encontrar',
    'directory.title.specialized': 'Atención Especializada',
    'directory.subtitle': 'Conectando la atención médica en toda la nación',
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
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
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