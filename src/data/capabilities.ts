import type { Capability } from '@/types';

export const capabilities: Capability[] = [
  {
    id: 'network-infrastructure',
    title: 'Network & Infrastructure',
    description:
      'Comprehensive network design, implementation, and optimization services for enterprise environments. From firewall deployment to data center networking, we deliver secure and scalable infrastructure solutions.',
    icon: 'globe',
    outcomes: [
      'Secure and resilient network architecture',
      'Optimized performance and bandwidth utilization',
      'Seamless connectivity across locations',
      'Enhanced network visibility and control',
    ],
    deliverables: [
      'Firewall Deployment & Hardening',
      'SD-WAN Implementation',
      'VPN Architecture',
      'Network Segmentation',
      'Wireless Infrastructure',
      'Data Center Network Design',
    ],
    compliance: ['ISO 27001', 'NIST Cybersecurity Framework'],
  },
  {
    id: 'security-solutions',
    title: 'Security Solutions',
    description:
      'Advanced physical security systems to protect your facilities, assets, and personnel. Our integrated security solutions combine surveillance, access control, and perimeter protection for comprehensive coverage.',
    icon: 'shield',
    outcomes: [
      'Enhanced facility security and monitoring',
      'Controlled access to sensitive areas',
      'Real-time threat detection and response',
      'Comprehensive video surveillance coverage',
    ],
    deliverables: [
      'CCTV & Surveillance Systems',
      'Access Control Systems',
      'Biometric Systems',
      'Perimeter Security Systems',
      'Video Management Systems (VMS)',
    ],
    compliance: ['ISO 27001', 'Physical Security Standards'],
  },
  {
    id: 'software-solutions',
    title: 'Software Solutions',
    description:
      'Enterprise software licensing, deployment, and custom development services. We help organizations optimize their software investments and develop tailored applications to meet unique business requirements.',
    icon: 'cpu',
    outcomes: [
      'Streamlined software licensing and compliance',
      'Efficient enterprise-wide software deployment',
      'Custom solutions aligned with business processes',
      'Automated workflows and improved productivity',
    ],
    deliverables: [
      'Software Licensing',
      'Enterprise Software Deployment',
      'Custom Software Development',
      'Business Application Solutions',
      'System Automation Solutions',
    ],
    compliance: ['CMMI', 'ISO 9001'],
  },
  {
    id: 'it-supply',
    title: 'IT Supply',
    description:
      'End-to-end IT equipment procurement and delivery services. We provide back-to-back order services for computing, networking, and storage equipment from leading manufacturers.',
    icon: 'server',
    outcomes: [
      'Reliable supply chain for IT hardware',
      'Competitive pricing through vendor partnerships',
      'Quality assured equipment from trusted brands',
      'Timely delivery and logistics support',
    ],
    deliverables: [
      'Computing Equipment Supply',
      'Networking Equipment Supply',
      'Server & Storage Supply',
      'Back-to-Back Order Services',
      'Hardware Procurement & Delivery',
    ],
    compliance: ['ISO 9001', 'Vendor Certifications'],
  },
  {
    id: 'system-integration',
    title: 'System Integration',
    description:
      'Expert integration of complex IT and security systems. Our team specializes in bringing together multi-vendor solutions into cohesive, efficient platforms with turnkey project deployment.',
    icon: 'layers',
    outcomes: [
      'Unified systems with seamless interoperability',
      'Reduced complexity and operational overhead',
      'Single point of contact for integrated solutions',
      'Comprehensive testing and quality assurance',
    ],
    deliverables: [
      'Enterprise System Integration',
      'IT Infrastructure Integration',
      'Security Systems Integration',
      'Multi-Vendor Solution Integration',
      'Turnkey Project Deployment',
    ],
    compliance: ['ITIL', 'ISO 20000'],
  },
  {
    id: 'safety-solutions',
    title: 'Safety Solutions',
    description:
      'Life-safety systems designed to protect people and property. Our fire alarm, fire fighting, and emergency detection systems ensure compliance with safety regulations and provide rapid response to emergencies.',
    icon: 'alert',
    outcomes: [
      'Compliant life-safety infrastructure',
      'Early detection of fire and emergencies',
      'Automated emergency response systems',
      'Continuous monitoring and alerting',
    ],
    deliverables: [
      'Fire Alarm Systems',
      'Fire Fighting Systems',
      'Emergency Detection Systems',
      'Safety Monitoring Systems',
      'Life-Safety Compliance Solutions',
    ],
    compliance: ['NFPA Standards', 'Local Fire Safety Codes'],
  },
  {
    id: 'smatv-iptv',
    title: 'SMATV & IPTV',
    description:
      'Satellite Master Antenna Television and Internet Protocol Television solutions for hotels, residential complexes, and enterprises. We design and deploy complete signal distribution and media control systems.',
    icon: 'tv',
    outcomes: [
      'High-quality TV signal distribution',
      'Flexible channel management and control',
      'Scalable systems for any facility size',
      'Enhanced guest and resident experience',
    ],
    deliverables: [
      'SMATV System Design & Deployment',
      'IPTV Solutions for Hotels',
      'Residential IPTV Systems',
      'Signal Distribution Systems',
      'Media Control Integration',
    ],
    compliance: ['Broadcasting Standards', 'HDMI/HDCP Compliance'],
  },
  {
    id: 'control-rooms',
    title: 'Control Rooms',
    description:
      'Mission-critical control room design and implementation. We create command centers with video walls, monitoring systems, and ergonomic furniture designed for 24/7 operations.',
    icon: 'monitor',
    outcomes: [
      'Centralized monitoring and command capability',
      'Improved situational awareness',
      'Operator efficiency and comfort',
      'Reliable power and redundancy systems',
    ],
    deliverables: [
      'Control Room Design',
      'Video Wall & Display Systems',
      'Control Room Furniture Design',
      'Monitoring & Command Systems',
      'Power & Redundancy Integration',
    ],
    compliance: ['ISO 11064', 'Ergonomic Standards'],
  },
  {
    id: 'power-solutions',
    title: 'Power Solutions',
    description:
      'Comprehensive power infrastructure for buildings and industrial facilities. From UPS systems to generator integration, we ensure continuous and reliable power distribution for critical operations.',
    icon: 'zap',
    outcomes: [
      'Uninterrupted power for critical systems',
      'Efficient power distribution and management',
      'Backup power during outages',
      'Reduced downtime and operational risks',
    ],
    deliverables: [
      'Building Power Systems',
      'Industrial Power Solutions',
      'Backup Power Systems (UPS)',
      'Generator Integration',
      'Power Distribution Systems',
    ],
    compliance: ['NEC Standards', 'IEC 62040'],
  },
];
