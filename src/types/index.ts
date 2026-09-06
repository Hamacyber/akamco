export interface CaseStudy {
  slug: string;
  title: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string[];
  tags: string[];
  image?: string;
}

export interface Capability {
  id: string;
  title: string;
  description: string;
  icon: string;
  outcomes: string[];
  deliverables: string[];
  compliance: string[];
}

export interface Partner {
  name: string;
  description: string;
  category: string;
  logo?: string;
  logoDark?: string;
  url?: string;
}

export interface StoredPartner extends Partner {
  id: string;
  order: number;
}

export interface PartnerCategory {
  name: string;
  partners: Partner[];
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  organization: string;
  companyUrl?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image?: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface ContactFormData {
  name: string;
  organization: string;
  email: string;
  phone: string;
  projectType: string;
  budgetRange: string;
  message: string;
}
