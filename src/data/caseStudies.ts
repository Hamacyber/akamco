import type { CaseStudy } from '@/types';

export const caseStudies: CaseStudy[] = [
  {
    slug: 'government-network-modernization',
    title: 'National Government Network Modernization',
    industry: 'Government',
    challenge:
      'A federal agency required a complete network overhaul across 120+ locations with legacy systems dating back 15 years, creating critical security vulnerabilities and operational inefficiencies.',
    solution:
      'Designed and deployed a modern SD-WAN architecture with zero-trust network access, centralized management, and automated threat response across all locations within an 18-month timeline.',
    results: [
      '99.99% network uptime achieved',
      '60% reduction in operational costs',
      '120+ sites migrated with zero unplanned downtime',
      'Full NIST 800-53 compliance',
    ],
    tags: ['Government', 'Network Infrastructure', 'SD-WAN', 'Zero Trust'],
  },
  {
    slug: 'financial-services-soc',
    title: 'Enterprise SOC for Financial Services',
    industry: 'Financial Services',
    challenge:
      'A major financial institution needed a 24/7 Security Operations Center to meet regulatory requirements and address increasing cyber threats targeting financial data.',
    solution:
      'Built and operationalized a Tier 2 SOC with SIEM integration, automated playbooks, threat intelligence feeds, and a team of certified analysts providing round-the-clock monitoring.',
    results: [
      '85% reduction in mean-time-to-detect',
      '50M+ events processed daily',
      'PCI DSS compliance achieved',
      '24/7/365 monitoring operational within 90 days',
    ],
    tags: ['Financial Services', 'SOC', 'SIEM', 'Compliance'],
  },
  {
    slug: 'smart-city-surveillance',
    title: 'AI-Powered Smart City Surveillance',
    industry: 'Government',
    challenge:
      'A metropolitan government sought to modernize its public safety infrastructure with intelligent video analytics while ensuring privacy compliance and system reliability across 500+ camera feeds.',
    solution:
      'Deployed an AI-driven video analytics platform with real-time object detection, behavioral analysis, and automated alerting integrated with the city\'s emergency response systems.',
    results: [
      '500+ cameras integrated into unified platform',
      '40% improvement in incident response times',
      '95% accuracy in threat detection',
      'Privacy-by-design architecture implemented',
    ],
    tags: ['Government', 'AI', 'Smart City', 'Surveillance'],
  },
  {
    slug: 'healthcare-data-center',
    title: 'Healthcare Data Center Migration',
    industry: 'Healthcare',
    challenge:
      'A national healthcare provider needed to migrate 200+ critical applications from aging on-premise data centers to a hybrid cloud environment while maintaining HIPAA compliance and zero patient data exposure.',
    solution:
      'Executed a phased hybrid cloud migration with encrypted data transfer, compliance-first architecture, and comprehensive disaster recovery spanning two geographic regions.',
    results: [
      '200+ applications migrated successfully',
      'Zero data breaches during migration',
      '45% reduction in infrastructure costs',
      'Full HIPAA compliance maintained',
    ],
    tags: ['Healthcare', 'Data Center', 'Cloud Migration', 'HIPAA'],
  },
  {
    slug: 'energy-sector-vapt',
    title: 'Critical Infrastructure VAPT Program',
    industry: 'Energy',
    challenge:
      'An energy utility company required comprehensive vulnerability assessment and penetration testing across its operational technology (OT) and IT environments to meet NERC CIP requirements.',
    solution:
      'Conducted extensive VAPT engagements across IT/OT convergence points, SCADA systems, and corporate networks with detailed remediation roadmaps and continuous reassessment cycles.',
    results: [
      '340+ vulnerabilities identified and remediated',
      'NERC CIP compliance achieved',
      'OT/IT security posture score improved by 78%',
      'Ongoing quarterly assessment program established',
    ],
    tags: ['Energy', 'VAPT', 'OT Security', 'Critical Infrastructure'],
  },
  {
    slug: 'defense-contractor-hardening',
    title: 'Defense Contractor Security Hardening',
    industry: 'Defense',
    challenge:
      'A defense contractor required comprehensive security hardening of its classified and unclassified networks to meet CMMC Level 3 certification requirements ahead of a critical contract renewal.',
    solution:
      'Implemented end-to-end security hardening across network, endpoint, application, and data layers with comprehensive documentation, training, and continuous monitoring capabilities.',
    results: [
      'CMMC Level 3 certification achieved',
      'Contract renewal secured ($12M value)',
      '100% endpoint compliance across 3,000+ devices',
      'Incident response time reduced to under 15 minutes',
    ],
    tags: ['Defense', 'Security Hardening', 'CMMC', 'Compliance'],
  },
];
