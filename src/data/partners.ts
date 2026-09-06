import type { Partner, PartnerCategory } from '@/types';

export const partners: Partner[] = [
  // Technology & Infrastructure
  {
    name: 'Dell',
    category: 'Technology & Infrastructure',
    description: 'Dell Technologies is a global leader in IT infrastructure, offering servers, storage, and end-user computing solutions. Their products help organizations modernize data centers and drive digital transformation.',
    logo: '/images/partners/dell.png',
  },
  {
    name: 'Cisco',
    category: 'Technology & Infrastructure',
    description: 'Cisco is the world\'s leading provider of networking and cybersecurity solutions. Their routers, switches, and collaboration tools power secure, connected enterprises worldwide.',
    logo: '/images/partners/cisco.png',
  },
  {
    name: 'Lenovo',
    category: 'Technology & Infrastructure',
    description: 'Lenovo delivers innovative laptops, desktops, and enterprise IT solutions, combining performance with reliability for businesses of all sizes.',
    logo: '/images/partners/lenovo.png',
  },
  {
    name: 'HPE',
    category: 'Technology & Infrastructure',
    description: 'HPE specializes in enterprise IT, cloud computing, and networking solutions, enabling organizations to scale and innovate securely.',
    logo: '/images/partners/hpe.png',
  },
  {
    name: 'Getac',
    category: 'Technology & Infrastructure',
    description: 'Getac manufactures rugged laptops and tablets designed for extreme environments, trusted by defense, manufacturing, and field service industries.',
    logo: '/images/partners/getac.png',
  },
  {
    name: 'Ecom Instruments',
    category: 'Technology & Infrastructure',
    description: 'Ecom provides intrinsically safe mobile devices for hazardous areas, ensuring safety and communication in industries like oil & gas and mining.',
    logo: '/images/partners/ecom.png',
  },
  {
    name: 'Rittal',
    category: 'Technology & Infrastructure',
    description: 'Rittal is a global leader in enclosures, climate control, and IT infrastructure, supporting reliable datacenter and industrial solutions.',
    logo: '/images/partners/rittal.png',
  },
  // Security & Surveillance
  {
    name: 'Axis Communications',
    category: 'Security & Surveillance',
    description: 'Axis pioneered IP cameras and continues to lead in network video solutions, offering intelligent surveillance systems.',
    logo: '/images/partners/axis.png',
  },
  {
    name: 'Hikvision',
    category: 'Security & Surveillance',
    description: 'Hikvision is a leading provider of video surveillance products and AIoT solutions, delivering advanced monitoring and analytics.',
    logo: '/images/partners/hikvision.png',
  },
  {
    name: 'Huawei',
    category: 'Security & Surveillance',
    description: 'Huawei provides networking, cloud, and security solutions, empowering digital transformation across industries worldwide.',
    logo: '/images/partners/huawei.png',
  },
  {
    name: 'ZKTeco',
    category: 'Security & Surveillance',
    description: 'ZKTeco specializes in biometric and access control systems, offering fingerprint, facial recognition, and time attendance solutions.',
    logo: '/images/partners/zkteco.png',
  },
  {
    name: 'Fortinet',
    category: 'Security & Surveillance',
    description: 'Fortinet delivers integrated cybersecurity solutions, including firewalls, endpoint protection, and secure SD-WAN.',
    logo: '/images/partners/fortinet.png',
  },
  {
    name: 'Sophos',
    category: 'Security & Surveillance',
    description: 'Sophos provides advanced cybersecurity, including endpoint protection and managed threat response services.',
    logo: '/images/partners/sophos.png',
  },
  {
    name: 'Palo Alto Networks',
    category: 'Security & Surveillance',
    description: 'Palo Alto is a leader in next-generation firewalls and cloud security, protecting enterprises against evolving cyber threats.',
    logo: '/images/partners/paloalto.png',
  },
  {
    name: 'SonicWall',
    category: 'Security & Surveillance',
    description: 'SonicWall offers secure, scalable network security solutions, including firewalls and threat intelligence services.',
    logo: '/images/partners/sonicwall.png',
  },
  {
    name: 'Barracuda Networks',
    category: 'Security & Surveillance',
    description: 'Barracuda specializes in email, network, and data security, helping organizations defend against cyberattacks.',
    logo: '/images/partners/barracuda.png',
  },
  {
    name: 'Milestone Systems',
    category: 'Security & Surveillance',
    description: 'Milestone develops video management software (XProtect), enabling scalable and intelligent surveillance solutions.',
    logo: '/images/partners/milestone.png',
  },
  {
    name: 'HID Global',
    category: 'Security & Surveillance',
    description: 'HID provides trusted identity and access management solutions, including smart cards, readers, and secure authentication.',
    logo: '/images/partners/hid.png',
  },
  // Power & Energy
  {
    name: 'APC by Schneider Electric',
    category: 'Power & Energy',
    description: 'APC is a leader in UPS systems and power protection, ensuring business continuity and reliable energy.',
    logo: '/images/partners/apc.png',
  },
  {
    name: 'Longi Solar',
    category: 'Power & Energy',
    description: 'Longi is the world\'s largest supplier of solar PV solutions, driving sustainable energy adoption globally.',
    logo: '/images/partners/longi.png',
  },
  // Software & Cloud
  {
    name: 'Microsoft',
    category: 'Software & Cloud',
    description: 'Microsoft is a global leader in software, cloud computing, and productivity solutions, including Windows, Office, and Azure.',
    logo: '/images/partners/microsoft.png',
  },
  {
    name: 'Kaspersky',
    category: 'Software & Cloud',
    description: 'Kaspersky provides award-winning cybersecurity and antivirus solutions, protecting millions of users worldwide.',
    logo: '/images/partners/kaspersky.png',
  },
  {
    name: 'Veeam',
    category: 'Software & Cloud',
    description: 'Veeam specializes in backup, recovery, and data management, ensuring business continuity and resilience.',
    logo: '/images/partners/veeam.png',
  },
  {
    name: 'Broadcom',
    category: 'Software & Cloud',
    description: 'Broadcom delivers semiconductors and enterprise infrastructure software, powering modern IT ecosystems.',
    logo: '/images/partners/broadcom.png',
  },
  {
    name: 'VMware',
    category: 'Software & Cloud',
    description: 'VMware is a leader in virtualization and cloud infrastructure, enabling businesses to modernize IT environments.',
    logo: '/images/partners/vmware.png',
  },
  // Networking & Communication
  {
    name: 'Samsung',
    category: 'Networking & Communication',
    description: 'Samsung is a global technology leader in electronics, IT, and communications, offering innovative solutions across industries.',
    logo: '/images/partners/samsung.png',
  },
  {
    name: 'Netgear',
    category: 'Networking & Communication',
    description: 'Netgear provides advanced WiFi and networking solutions for homes and businesses.',
    logo: '/images/partners/netgear.png',
  },
  {
    name: 'Planet Technology',
    category: 'Networking & Communication',
    description: 'Planet delivers networking and connectivity solutions, including switches, PoE, and industrial networking.',
    logo: '/images/partners/planet.png',
  },
  {
    name: 'Jabra',
    category: 'Networking & Communication',
    description: 'Jabra is known for professional headsets, speakerphones, and video solutions that enhance collaboration.',
    logo: '/images/partners/jabra.png',
  },
  {
    name: 'Logicom',
    category: 'Networking & Communication',
    description: 'Logicom is a regional distributor of technology solutions across EMEA, supporting IT vendors and resellers.',
    logo: '/images/partners/logicom.png',
  },
  {
    name: 'Poly',
    category: 'Networking & Communication',
    description: 'Poly, now part of HP, provides video and voice collaboration solutions, including headsets and conferencing systems.',
    logo: '/images/partners/poly.png',
  },
  // Test & Measurement Solutions
  {
    name: 'EXFO',
    category: 'Test & Measurement Solutions',
    description: 'EXFO is a global leader in test, monitoring, and analytics solutions for the telecommunications industry. Their products help service providers and network operators ensure performance, reliability, and quality across fiber optic and mobile networks.',
    logo: '/images/partners/exfo.png',
  },
  {
    name: 'VIAVI Solutions',
    category: 'Test & Measurement Solutions',
    description: 'VIAVI delivers advanced test and measurement equipment, optical technologies, and network assurance solutions. Their tools are widely used by telecom operators, enterprises, and government agencies to optimize and secure complex networks.',
    logo: '/images/partners/viavi.png',
  },
  {
    name: 'Fujikura',
    category: 'Test & Measurement Solutions',
    description: 'Fujikura is a renowned Japanese company specializing in fiber optic cables, splicing equipment, and connectivity solutions. Their products are trusted worldwide for building high-performance communication networks and supporting next-generation broadband infrastructure.',
    logo: '/images/partners/fujikura.png',
  },
];

export const partnerCategories: PartnerCategory[] = [
  {
    name: 'Technology & Infrastructure',
    partners: partners.filter(p => p.category === 'Technology & Infrastructure'),
  },
  {
    name: 'Security & Surveillance',
    partners: partners.filter(p => p.category === 'Security & Surveillance'),
  },
  {
    name: 'Power & Energy',
    partners: partners.filter(p => p.category === 'Power & Energy'),
  },
  {
    name: 'Software & Cloud',
    partners: partners.filter(p => p.category === 'Software & Cloud'),
  },
  {
    name: 'Networking & Communication',
    partners: partners.filter(p => p.category === 'Networking & Communication'),
  },
  {
    name: 'Test & Measurement Solutions',
    partners: partners.filter(p => p.category === 'Test & Measurement Solutions'),
  },
];
