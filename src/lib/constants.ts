// ─── Brand & Site Constants ────────────────────────────────────────
export const SITE_NAME = 'Akamco Technologies';
export const SITE_DESCRIPTION =
  'Engineering Secure Digital Infrastructure — Enterprise IT, Cybersecurity, AI Solutions & Data Center Architecture for Government and Critical Infrastructure.';
export const SITE_URL = 'https://akamco.co';
export const SITE_OG_IMAGE = '/images/logo-dark.png';

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  {
    label: 'About us',
    href: '/about',
    dropdown: [
      { label: 'About Us', href: '/about' },
      { label: 'Company Profile', href: '/company-profile' },
      { label: 'Social Responsibility', href: '/social-responsibility' },
      { label: 'Careers', href: '/careers' },
    ]
  },
  {
    label: 'Services',
    href: '/services',
    dropdown: [
      { label: 'Consultancy & Advisory', href: '/services/consultancy-advisory' },
      { label: 'System Design & Engineering', href: '/services/system-design-engineering' },
      { label: 'Supply & Procurement', href: '/services/supply-procurement' },
      { label: 'Installation & Deployment', href: '/services/installation-deployment' },
      { label: 'System Integration & Commissioning', href: '/services/system-integration-commissioning' },
      { label: 'Managed Services & Monitoring', href: '/services/managed-services-monitoring' },
      { label: 'Annual Maintenance Contracts', href: '/services/annual-maintenance-contracts' },
      { label: 'IT Outsourcing & Staffing', href: '/services/it-outsourcing-staffing' },
      { label: 'Training & Knowledge Transfer', href: '/services/training-knowledge-transfer' },
    ]
  },
  {
    label: 'Solutions',
    href: '/solutions',
    dropdown: [
      { label: 'Datacenter Solutions', href: '/solutions/datacenter-solutions' },
      { label: 'Network Infrastructure', href: '/solutions/network-infrastructure' },
      { label: 'Fiber Measurement', href: '/solutions/fiber-measurement' },
      { label: 'Cybersecurity', href: '/solutions/cybersecurity' },
      { label: 'Software Development', href: '/solutions/software-development' },
      { label: 'Software Licensing', href: '/solutions/software-licensing' },
      { label: 'IT Supply & Hardware', href: '/solutions/it-supply-hardware' },
      { label: 'Low Current Systems', href: '/solutions/low-current-systems' },
      { label: 'Physical Security', href: '/solutions/physical-security' },
      { label: 'Fire & Life Safety', href: '/solutions/fire-life-safety' },
      { label: 'Gate & Perimeter Security', href: '/solutions/gate-perimeter-security' },
      { label: 'Control Room & Command Center', href: '/solutions/control-room-command' },
      { label: 'AV Systems', href: '/solutions/av-systems' },
      { label: 'Renewable Energy', href: '/solutions/renewable-energy' },
      { label: 'UPS & Critical Power', href: '/solutions/ups-critical-power' },
    ]
  },
  { label: 'Partnerships', href: '/partners' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
] as const;

export const FOOTER_LINKS = {
  services: [
    { label: 'Consultancy & Advisory', href: '/services/consultancy-advisory' },
    { label: 'System Design & Engineering', href: '/services/system-design-engineering' },
    { label: 'Managed Services & Monitoring', href: '/services/managed-services-monitoring' },
    { label: 'IT Outsourcing & Staffing', href: '/services/it-outsourcing-staffing' },
    { label: 'Training & Knowledge Transfer', href: '/services/training-knowledge-transfer' },
  ],
  solutions: [
    { label: 'Datacenter Solutions', href: '/solutions/datacenter-solutions' },
    { label: 'Cybersecurity', href: '/solutions/cybersecurity' },
    { label: 'Network Infrastructure', href: '/solutions/network-infrastructure' },
    { label: 'Physical Security', href: '/solutions/physical-security' },
    { label: 'Renewable Energy', href: '/solutions/renewable-energy' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Partners', href: '/partners' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
  ],
} as const;

export const STATS = [
  { value: 24, suffix: '/7', label: 'Operations' },
  { value: 500, suffix: '+', label: 'Projects' },
  { value: 25, suffix: '', label: 'Years in Business' },
  { value: 300, suffix: '+', label: 'Clients Served' },
] as const;

export const TRUST_BADGES = [
  'Government',
  'Enterprise',
  'Critical Infrastructure',
  'Defense',
  'Financial Services',
] as const;

export const BUDGET_RANGES = [
  'Under $50,000',
  '$50,000 – $250,000',
  '$250,000 – $1,000,000',
  '$1,000,000 – $5,000,000',
  '$5,000,000+',
  'To be determined',
] as const;

export const PROJECT_TYPES = [
  'IT Infrastructure',
  'Cybersecurity Assessment',
  'SOC / Managed Security',
  'AI & Smart Security',
  'Data Center / Cloud',
  'Government Contract',
  'Consulting / Advisory',
  'Other',
] as const;

export const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: 'https://linkedin.com/company/akam-company', icon: 'linkedin' },
  { label: 'Instagram', href: 'https://instagram.com/akamcompany', icon: 'instagram' },
  { label: 'Facebook', href: 'https://facebook.com/akamcompany', icon: 'facebook' },
] as const;
