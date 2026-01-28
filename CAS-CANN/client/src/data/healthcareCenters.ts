export interface HealthcareCenter {
  id: string;
  name: string;
  city: string;
  province: string;
  coordinates: { x: number; y: number }; // Relative to Canada map image
  type: 'hospital' | 'clinic' | 'research' | 'specialty';
  specialties: string[];
  contact: {
    phone: string;
    email: string;
    website?: string;
    address: string;
  };
  services: string[];
  description: string;
  establishedYear?: number;
  certifications?: string[];
}

export const healthcareCenters: HealthcareCenter[] = [
  // British Columbia
  {
    id: 'bc-vancouver-general',
    name: 'Vancouver General Hospital',
    city: 'Vancouver',
    province: 'BC',
    coordinates: { x: 12, y: 70 },
    type: 'hospital',
    specialties: ['AL Amyloidosis', 'ATTR Amyloidosis', 'Cardiac Amyloidosis'],
    contact: {
      phone: '(604) 875-4111',
      email: 'amyloidosis@vch.ca',
      website: 'https://www.vch.ca',
      address: '899 West 12th Avenue, Vancouver, BC V5Z 1M9'
    },
    services: ['Diagnosis', 'Treatment', 'Clinical Trials', 'Cardiac Care'],
    description: 'Leading comprehensive amyloidosis treatment center in Western Canada with specialized cardiac unit.',
    establishedYear: 1906,
    certifications: ['Canadian Hospital Association', 'Cardiac Care Network']
  },
  {
    id: 'bc-st-pauls',
    name: 'St. Paul\'s Hospital',
    city: 'Vancouver',
    province: 'BC',
    coordinates: { x: 12, y: 68 },
    type: 'hospital',
    specialties: ['Cardiac Amyloidosis', 'Heart Failure'],
    contact: {
      phone: '(604) 682-2344',
      email: 'cardiology@sth.ca',
      address: '1081 Burrard Street, Vancouver, BC V6Z 1Y6'
    },
    services: ['Cardiac Assessment', 'Specialized Imaging', 'Treatment'],
    description: 'Specialized cardiac amyloidosis center with advanced imaging capabilities.',
    establishedYear: 1894
  },
  
  // Alberta
  {
    id: 'ab-foothills',
    name: 'Foothills Medical Centre',
    city: 'Calgary',
    province: 'AB',
    coordinates: { x: 22, y: 70 },
    type: 'hospital',
    specialties: ['AL Amyloidosis', 'Multi-organ Care', 'Hematology'],
    contact: {
      phone: '(403) 944-1110',
      email: 'amyloidosis@ahs.ca',
      website: 'https://www.albertahealthservices.ca',
      address: '1403 29 Street NW, Calgary, AB T2N 2T9'
    },
    services: ['Diagnosis', 'Chemotherapy', 'Stem Cell Transplant', 'Monitoring'],
    description: 'Premier amyloidosis treatment center serving Alberta and Saskatchewan.',
    establishedYear: 1966,
    certifications: ['Alberta Health Services', 'Canadian Blood Services']
  },
  {
    id: 'ab-university',
    name: 'University of Alberta Hospital',
    city: 'Edmonton',
    province: 'AB',
    coordinates: { x: 22, y: 65 },
    type: 'hospital',
    specialties: ['Research', 'Clinical Trials', 'AL Amyloidosis'],
    contact: {
      phone: '(780) 407-8822',
      email: 'research@ualberta.ca',
      address: '8440 112 Street NW, Edmonton, AB T6G 2B7'
    },
    services: ['Research', 'Clinical Trials', 'Consultation'],
    description: 'Leading research institution with active amyloidosis clinical trials.',
    establishedYear: 1958
  },
  
  // Saskatchewan
  {
    id: 'sk-royal-university',
    name: 'Royal University Hospital',
    city: 'Saskatoon',
    province: 'SK',
    coordinates: { x: 28, y: 67 },
    type: 'hospital',
    specialties: ['General Amyloidosis', 'Nephrology'],
    contact: {
      phone: '(306) 655-1000',
      email: 'amyloidosis@saskhealthauthority.ca',
      address: '103 Hospital Drive, Saskatoon, SK S7N 0W8'
    },
    services: ['Diagnosis', 'Treatment', 'Kidney Care'],
    description: 'Regional referral center for amyloidosis care in Saskatchewan.',
    establishedYear: 1955
  },
  
  // Manitoba
  {
    id: 'mb-st-boniface',
    name: 'St. Boniface Hospital',
    city: 'Winnipeg',
    province: 'MB',
    coordinates: { x: 35, y: 68 },
    type: 'hospital',
    specialties: ['Cardiac Amyloidosis', 'ATTR Amyloidosis'],
    contact: {
      phone: '(204) 235-3131',
      email: 'cardiology@sbgh.mb.ca',
      address: '409 Tache Avenue, Winnipeg, MB R2H 2A6'
    },
    services: ['Cardiac Care', 'Diagnosis', 'Treatment'],
    description: 'Specialized cardiac amyloidosis program serving Manitoba.',
    establishedYear: 1871
  },
  
  // Ontario
  {
    id: 'on-toronto-general',
    name: 'Toronto General Hospital',
    city: 'Toronto',
    province: 'ON',
    coordinates: { x: 48, y: 75 },
    type: 'hospital',
    specialties: ['AL Amyloidosis', 'ATTR Amyloidosis', 'Liver Transplant'],
    contact: {
      phone: '(416) 340-4800',
      email: 'amyloidosis@uhn.ca',
      website: 'https://www.uhn.ca',
      address: '200 Elizabeth Street, Toronto, ON M5G 2C4'
    },
    services: ['Comprehensive Care', 'Transplant', 'Research', 'Clinical Trials'],
    description: 'Canada\'s largest amyloidosis program with comprehensive multidisciplinary care.',
    establishedYear: 1812,
    certifications: ['University Health Network', 'Canadian Association of Transplantation']
  },
  {
    id: 'on-princess-margaret',
    name: 'Princess Margaret Cancer Centre',
    city: 'Toronto',
    province: 'ON',
    coordinates: { x: 48, y: 76 },
    type: 'specialty',
    specialties: ['AL Amyloidosis', 'Hematology', 'Stem Cell Transplant'],
    contact: {
      phone: '(416) 946-4501',
      email: 'hematology@uhn.ca',
      address: '610 University Avenue, Toronto, ON M5G 2M9'
    },
    services: ['Hematology', 'Stem Cell Transplant', 'Clinical Trials'],
    description: 'Leading cancer center specializing in AL amyloidosis treatment.',
    establishedYear: 1952
  },
  {
    id: 'on-ottawa-heart',
    name: 'University of Ottawa Heart Institute',
    city: 'Ottawa',
    province: 'ON',
    coordinates: { x: 50, y: 72 },
    type: 'specialty',
    specialties: ['Cardiac Amyloidosis', 'ATTR Amyloidosis'],
    contact: {
      phone: '(613) 696-7000',
      email: 'cardiology@ottawaheart.ca',
      website: 'https://www.ottawaheart.ca',
      address: '40 Ruskin Street, Ottawa, ON K1Y 4W7'
    },
    services: ['Cardiac Assessment', 'Specialized Imaging', 'Treatment'],
    description: 'Specialized cardiac amyloidosis center with advanced diagnostic capabilities.',
    establishedYear: 1976
  },
  {
    id: 'on-hamilton-general',
    name: 'Hamilton General Hospital',
    city: 'Hamilton',
    province: 'ON',
    coordinates: { x: 47, y: 77 },
    type: 'hospital',
    specialties: ['AL Amyloidosis', 'Nephrology'],
    contact: {
      phone: '(905) 527-4322',
      email: 'nephrology@hhsc.ca',
      address: '237 Barton Street East, Hamilton, ON L8L 2X2'
    },
    services: ['Diagnosis', 'Treatment', 'Kidney Care'],
    description: 'Regional amyloidosis center serving southwestern Ontario.',
    establishedYear: 1848
  },
  
  // Quebec
  {
    id: 'qc-montreal-heart',
    name: 'Montreal Heart Institute',
    city: 'Montreal',
    province: 'QC',
    coordinates: { x: 53, y: 72 },
    type: 'specialty',
    specialties: ['Cardiac Amyloidosis', 'ATTR Amyloidosis', 'Research'],
    contact: {
      phone: '(514) 376-3330',
      email: 'amyloidosis@icm-mhi.org',
      website: 'https://www.icm-mhi.org',
      address: '5000 Belanger Street, Montreal, QC H1T 1C8'
    },
    services: ['Cardiac Care', 'Research', 'Clinical Trials', 'Genetic Testing'],
    description: 'Leading cardiac amyloidosis research and treatment center in Quebec.',
    establishedYear: 1954,
    certifications: ['Cardiac Care Network', 'Canadian Cardiovascular Society']
  },
  {
    id: 'qc-chum',
    name: 'Centre Hospitalier de l\'Université de Montréal',
    city: 'Montreal',
    province: 'QC',
    coordinates: { x: 53, y: 73 },
    type: 'hospital',
    specialties: ['AL Amyloidosis', 'Hematology'],
    contact: {
      phone: '(514) 890-8000',
      email: 'hematologie@chum.qc.ca',
      address: '1051 Rue Sanguinet, Montreal, QC H2X 3E4'
    },
    services: ['Hematology', 'Diagnosis', 'Treatment'],
    description: 'University hospital with specialized hematology-oncology amyloidosis program.',
    establishedYear: 1996
  },
  {
    id: 'qc-quebec-heart',
    name: 'Institut Universitaire de Cardiologie et de Pneumologie de Québec',
    city: 'Quebec City',
    province: 'QC',
    coordinates: { x: 56, y: 70 },
    type: 'specialty',
    specialties: ['Cardiac Amyloidosis', 'Pulmonary Care'],
    contact: {
      phone: '(418) 656-8711',
      email: 'cardiologie@criucpq.ulaval.ca',
      address: '2725 Chemin Sainte-Foy, Quebec City, QC G1V 4G5'
    },
    services: ['Cardiac Care', 'Pulmonary Assessment', 'Treatment'],
    description: 'Specialized cardiac and pulmonary amyloidosis program.',
    establishedYear: 1963
  },
  
  // New Brunswick
  {
    id: 'nb-saint-john',
    name: 'Saint John Regional Hospital',
    city: 'Saint John',
    province: 'NB',
    coordinates: { x: 60, y: 76 },
    type: 'hospital',
    specialties: ['General Amyloidosis', 'Cardiology'],
    contact: {
      phone: '(506) 648-6000',
      email: 'cardiology@horizonnb.ca',
      address: '400 University Avenue, Saint John, NB E2L 4L2'
    },
    services: ['Diagnosis', 'Treatment', 'Cardiology'],
    description: 'Regional hospital serving Atlantic Canada with amyloidosis expertise.',
    establishedYear: 1982
  },
  
  // Nova Scotia
  {
    id: 'ns-qeii',
    name: 'QEII Health Sciences Centre',
    city: 'Halifax',
    province: 'NS',
    coordinates: { x: 62, y: 78 },
    type: 'hospital',
    specialties: ['AL Amyloidosis', 'Hematology', 'Cardiology'],
    contact: {
      phone: '(902) 473-2700',
      email: 'amyloidosis@nshealth.ca',
      website: 'https://www.nshealth.ca',
      address: '1276 South Park Street, Halifax, NS B3H 2Y9'
    },
    services: ['Comprehensive Care', 'Hematology', 'Cardiology', 'Research'],
    description: 'Maritime region\'s primary amyloidosis treatment center.',
    establishedYear: 1980,
    certifications: ['Nova Scotia Health Authority', 'Canadian Association of Transplantation']
  },
  
  // Prince Edward Island
  {
    id: 'pe-qeh',
    name: 'Queen Elizabeth Hospital',
    city: 'Charlottetown',
    province: 'PE',
    coordinates: { x: 64, y: 75 },
    type: 'hospital',
    specialties: ['General Amyloidosis', 'Consultation'],
    contact: {
      phone: '(902) 894-2111',
      email: 'consultation@ihis.org',
      address: '60 Riverside Drive, Charlottetown, PE C1A 8T5'
    },
    services: ['Consultation', 'Referral', 'Basic Care'],
    description: 'Regional consultation center with referral to specialized centers.',
    establishedYear: 1982
  },
  
  // Newfoundland and Labrador
  {
    id: 'nl-health-sciences',
    name: 'Health Sciences Centre',
    city: 'St. John\'s',
    province: 'NL',
    coordinates: { x: 70, y: 74 },
    type: 'hospital',
    specialties: ['General Amyloidosis', 'Nephrology'],
    contact: {
      phone: '(709) 777-6300',
      email: 'nephrology@easternhealth.ca',
      address: '300 Prince Philip Drive, St. John\'s, NL A1B 3V6'
    },
    services: ['Diagnosis', 'Treatment', 'Nephrology'],
    description: 'Primary amyloidosis care center for Newfoundland and Labrador.',
    establishedYear: 1977
  },
  
  // Northwest Territories
  {
    id: 'nt-stanton',
    name: 'Stanton Territorial Hospital',
    city: 'Yellowknife',
    province: 'NT',
    coordinates: { x: 25, y: 45 },
    type: 'hospital',
    specialties: ['General Medicine', 'Consultation'],
    contact: {
      phone: '(867) 669-4111',
      email: 'consultation@gov.nt.ca',
      address: '550 Byrnes Road, Yellowknife, NT X1A 2N1'
    },
    services: ['Consultation', 'Referral', 'Basic Care'],
    description: 'Regional hospital with consultation services and referral to specialized centers.',
    establishedYear: 1972
  },
  
  // Yukon
  {
    id: 'yt-whitehorse',
    name: 'Whitehorse General Hospital',
    city: 'Whitehorse',
    province: 'YT',
    coordinates: { x: 15, y: 42 },
    type: 'hospital',
    specialties: ['General Medicine', 'Consultation'],
    contact: {
      phone: '(867) 393-8700',
      email: 'consultation@gov.yk.ca',
      address: '5 Hospital Road, Whitehorse, YT Y1A 3H7'
    },
    services: ['Consultation', 'Referral', 'Basic Care'],
    description: 'Regional hospital serving Yukon with referral services to specialized centers.',
    establishedYear: 1992
  },
  
  // Nunavut
  {
    id: 'nu-qikiqtani',
    name: 'Qikiqtani General Hospital',
    city: 'Iqaluit',
    province: 'NU',
    coordinates: { x: 58, y: 35 },
    type: 'hospital',
    specialties: ['General Medicine', 'Consultation'],
    contact: {
      phone: '(867) 975-8600',
      email: 'consultation@gov.nu.ca',
      address: 'Building 142, Iqaluit, NU X0A 0H0'
    },
    services: ['Consultation', 'Referral', 'Basic Care'],
    description: 'Regional hospital serving Nunavut with referral services to specialized centers.',
    establishedYear: 1999
  }
];

export const getHealthcareCenterById = (id: string): HealthcareCenter | undefined => {
  return healthcareCenters.find(center => center.id === id);
};

export const getHealthcareCentersByProvince = (province: string): HealthcareCenter[] => {
  return healthcareCenters.filter(center => center.province === province);
};

export const getHealthcareCentersByType = (type: string): HealthcareCenter[] => {
  return healthcareCenters.filter(center => center.type === type);
};