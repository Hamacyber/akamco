import type { Capability } from '@/types';

export interface ServiceDetail extends Capability {
  tagline: string;
  image: string;
  heroStat: { value: string; label: string };
  longDescription: string[];
  features: { title: string; description: string }[];
  forWhom: string[];
  process: { step: string; title: string; description: string }[];
  gradient: string;
}

export const services: ServiceDetail[] = [
  // ─── 1. Consultancy & Technical Advisory ────────────────────────────────
  {
    id: 'consultancy-advisory',
    title: 'Consultancy & Technical Advisory',
    tagline: 'Clarity before commitment. Strategy before steel.',
    description:
      'Independent technical advisory services covering site surveys, risk analysis, capacity planning, and full tender documentation — giving you the insight to invest with confidence.',
    image:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80',
    heroStat: { value: '100+', label: 'Advisory Engagements' },
    gradient: 'linear-gradient(135deg, #00C46A, #0EA5E9)',
    icon: 'chartbar',
    outcomes: [
      'Informed investment decisions backed by data',
      'Risk exposure identified before project kick-off',
      'Accurate BoQ and tender-ready documentation',
      'Optimised power and capacity roadmaps',
    ],
    deliverables: [
      'Site Survey Report',
      'Risk & Security Analysis',
      'Capacity Planning Study',
      'Datacenter Design Brief',
      'Fiber Strategy Document',
      'Tender BoQ Package',
    ],
    compliance: ['ISO 27001', 'TIA-942', 'IEC 62443'],
    longDescription: [
      "Every major infrastructure project begins as a decision made with incomplete information. Akamco's Consultancy & Technical Advisory practice exists to close that gap — transforming raw requirements into precise, actionable specifications before a single component is purchased or a cable is pulled.",
      'Our consultants conduct rigorous site surveys and technical assessments that document the physical environment, existing infrastructure, and operational constraints. From that foundation we layer risk and security analysis, power and capacity modelling, and datacenter design planning — producing a blueprint that architects can build from and procurement teams can price with accuracy.',
      'Whether you need a fiber network design strategy for a cross-city backbone or a complete tender package with Bill of Quantities for a government ministry, our advisory team delivers structured, vendor-neutral documentation that protects your interests throughout the full project lifecycle.',
    ],
    features: [
      { title: 'Site Survey & Technical Assessment', description: 'Comprehensive on-site evaluation of existing infrastructure, physical conditions, cable pathways, and environmental factors — producing a detailed baseline report that drives all subsequent design decisions.' },
      { title: 'Risk & Security Analysis', description: 'Systematic identification of technical, operational, and security risks across your proposed or existing infrastructure, with mitigation recommendations aligned to recognised frameworks.' },
      { title: 'Power & Capacity Planning', description: 'Load analysis and growth modelling to right-size power feeds, UPS capacity, cooling plant, and network bandwidth — avoiding both under-provisioning and costly over-engineering.' },
      { title: 'Datacenter Design Planning', description: 'Conceptual and detailed datacenter layout design covering rack density, cooling strategy, power distribution, structured cabling, and redundancy tiers aligned to TIA-942 standards.' },
      { title: 'Fiber Network Design Strategy', description: 'End-to-end fiber topology design for campus, metropolitan, and long-haul networks — including route planning, splicing strategy, and future capacity provisions.' },
      { title: 'Tender Documentation & BoQ Preparation', description: 'Production of complete tender packages including technical specifications, Bill of Quantities, evaluation criteria, and compliance matrices — ensuring fair, competitive procurement outcomes.' },
    ],
    forWhom: [
      'Government ministries planning infrastructure upgrades',
      'Enterprises embarking on datacenter projects',
      'Developers tendering large-scale ICT contracts',
      'Organisations requiring independent technical review',
    ],
    process: [
      { step: '01', title: 'Discovery & Briefing', description: 'Stakeholder workshops to understand business objectives, operational constraints, budget parameters, and compliance requirements.' },
      { step: '02', title: 'Site Survey & Data Collection', description: 'On-site assessment capturing physical, electrical, and network conditions alongside existing documentation review.' },
      { step: '03', title: 'Analysis & Strategy', description: 'Risk analysis, capacity modelling, and design strategy development with interim review sessions to validate direction.' },
      { step: '04', title: 'Documentation Delivery', description: 'Formal report and tender package delivery with presentation to decision-makers and optional support through the procurement process.' },
    ],
  },

  // ─── 2. System Design & Engineering ─────────────────────────────────────
  {
    id: 'system-design-engineering',
    title: 'System Design & Engineering',
    tagline: 'Engineered to last. Designed to perform.',
    description:
      'Detailed technical design across network, cybersecurity, fire and low-current systems, and renewable energy — translating strategy into precise, buildable engineering specifications.',
    image:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1400&q=80',
    heroStat: { value: '200+', label: 'Systems Engineered' },
    gradient: 'linear-gradient(135deg, #0EA5E9, #6366F1)',
    icon: 'cpu',
    outcomes: [
      'Buildable designs ready for competitive tender',
      'Integrated multi-system architectures',
      'Compliance-aligned engineering specifications',
      'Reduced rework through rigorous design reviews',
    ],
    deliverables: [
      'Network Architecture Drawings',
      'Cybersecurity Architecture Document',
      'Low Current System Design',
      'Renewable Energy Engineering Report',
      'UPS & Power Sizing Calculations',
      'Design Review & Sign-off Package',
    ],
    compliance: ['ISO 27001', 'NFPA 72', 'IEC 62109', 'IEEE 1547'],
    longDescription: [
      "Sound engineering is the difference between infrastructure that holds up under real-world conditions and systems that fail at the worst possible moment. Akamco's System Design & Engineering team produces detailed, multi-discipline engineering deliverables that are built for construction, not just for presentations.",
      "We cover the full spectrum of modern critical infrastructure: network and cybersecurity architecture designed to carrier-grade resilience standards; fire and low-current system design for complex facilities; renewable energy engineering for solar and hybrid power plants; and UPS sizing with precise power calculations that account for load growth and maintenance windows.",
      'Every design passes through formal review gates — internal QA, client validation, and where required, third-party approval authority sign-off. The result is a documented, stamped engineering package that procurement, installation, and commissioning teams can rely on without ambiguity.',
    ],
    features: [
      { title: 'Network Architecture Design', description: 'Layer 1 through layer 3 network blueprints covering physical topology, switching and routing design, IP addressing, VLAN segmentation, and redundancy strategies for LAN, WAN, and datacenter environments.' },
      { title: 'Cybersecurity Architecture Design', description: 'Zero-trust security architecture design including firewall zoning, DMZ layouts, identity and access management frameworks, and detection and response architectures aligned to NIST and ISO 27001.' },
      { title: 'Fire & Low Current System Design', description: 'Comprehensive design for fire alarm, access control, CCTV, public address, and building management systems — fully coordinated with architectural and MEP drawings.' },
      { title: 'Renewable Energy Engineering', description: 'Solar PV system engineering including panel layout, inverter sizing, grid-tie or off-grid configuration, single-line diagrams, and energy yield modelling for government and commercial sites.' },
      { title: 'UPS Sizing & Power Engineering', description: 'Critical power design covering load calculations, UPS topology selection, battery runtime modelling, static transfer switch sizing, and power distribution unit layout for data centres and mission-critical facilities.' },
    ],
    forWhom: [
      'Main contractors requiring sub-system engineering',
      'Owners needing independent design review',
      'PMC firms managing multi-discipline projects',
      'Government entities with technical compliance requirements',
    ],
    process: [
      { step: '01', title: 'Requirements Capture', description: 'Detailed requirements workshops, review of architectural and MEP drawings, and alignment on applicable codes and standards.' },
      { step: '02', title: 'Concept Design', description: 'Preliminary design and schematic drawings submitted for client review and approval before progressing to detailed design.' },
      { step: '03', title: 'Detailed Engineering', description: 'Full engineering package production including single-line diagrams, floor plans, cable schedules, equipment datasheets, and calculations.' },
      { step: '04', title: 'IFC Issue & Support', description: 'Issued-for-Construction drawing set with RFI support throughout the build phase and design-change management as required.' },
    ],
  },

  // ─── 3. Supply & Procurement ─────────────────────────────────────────────
  {
    id: 'supply-procurement',
    title: 'Supply & Procurement',
    tagline: 'The right equipment. The right time. The right price.',
    description:
      'End-to-end hardware and software procurement for IT, network, datacenter, security, and power infrastructure — with vendor-neutral sourcing and full logistics coordination.',
    image:
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1400&q=80',
    heroStat: { value: '$50M+', label: 'Equipment Procured' },
    gradient: 'linear-gradient(135deg, #F59E0B, #00C46A)',
    icon: 'server',
    outcomes: [
      'Authentic, warranty-backed equipment from authorised channels',
      'Competitive pricing through established vendor relationships',
      'On-time delivery coordinated with project schedules',
      'Single point of accountability for all procurement',
    ],
    deliverables: [
      'Procurement Strategy & Vendor Shortlist',
      'Technical Compliance Evaluation',
      'Purchase Orders & Tracking Reports',
      'Delivery & Inspection Reports',
      'Warranty & Support Documentation',
      'Asset Register',
    ],
    compliance: ['ISO 9001', 'Authorised Reseller Certifications'],
    longDescription: [
      'Procurement failures — late deliveries, counterfeit equipment, incompatible firmware versions — can derail even the most carefully designed project. Akamco operates as a single, accountable procurement partner, managing the full supply chain from technical specification through final delivery and inspection.',
      'We source IT and network hardware, datacenter infrastructure, security and power equipment, and software licenses through authorised distribution channels. Our vendor relationships with leading OEMs — Cisco, HPE, Dell, Fortinet, APC, Schneider Electric, and others — give our clients access to genuine equipment with full manufacturer warranty and local support entitlements.',
      'For complex projects involving multiple vendors and phased deliveries, our logistics and vendor coordination team manages shipping, customs clearance, warehousing, and just-in-time delivery to site — maintaining full chain-of-custody documentation throughout.',
    ],
    features: [
      { title: 'IT & Network Hardware Supply', description: 'Routers, switches, firewalls, wireless access points, structured cabling, and optical fibre products sourced from authorised distributors with full warranty and local support.' },
      { title: 'Datacenter Equipment', description: 'Server racks, PDUs, in-row cooling, KVM systems, raised flooring, and containment solutions procured and delivered to meet datacenter build schedules.' },
      { title: 'Security & Power Equipment', description: 'CCTV cameras, access control panels, UPS systems, solar inverters, and road-blocker mechanisms sourced with full compliance documentation and installation-readiness checks.' },
      { title: 'Software Licensing Procurement', description: 'Operating system, security, virtualisation, and productivity software licensing procured through authorised channels — with licence management support and renewal tracking.' },
      { title: 'Vendor Coordination & Logistics', description: 'Multi-vendor shipment coordination, import documentation, customs handling, and staged delivery scheduling to align with installation milestones and site readiness.' },
    ],
    forWhom: [
      'Project managers needing a single supply partner',
      'Government entities with stringent procurement compliance',
      'Contractors requiring coordinated staged deliveries',
      'Organisations replacing end-of-life infrastructure',
    ],
    process: [
      { step: '01', title: 'Technical Specification Review', description: 'Validate BoQ and technical specs, identify approved equivalent options, and produce a vendor shortlist for client approval.' },
      { step: '02', title: 'Quotation & Evaluation', description: 'Obtain competitive quotes, perform technical and commercial evaluation, and present a recommendation with full compliance matrix.' },
      { step: '03', title: 'Order Placement & Tracking', description: 'Raise purchase orders, confirm lead times, and provide regular delivery status updates aligned with the project programme.' },
      { step: '04', title: 'Delivery, Inspection & Handover', description: 'Receive, inspect, and document all goods with photographic evidence, serial number recording, and formal handover to the installation team.' },
    ],
  },

  // ─── 4. Installation & Deployment ───────────────────────────────────────
  {
    id: 'installation-deployment',
    title: 'Installation & Deployment',
    tagline: 'Precision installation. Zero-disruption delivery.',
    description:
      'Professional installation and deployment of datacenter infrastructure, network and fiber systems, CCTV, fire alarms, physical security, solar, and UPS across enterprise and government sites.',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80',
    heroStat: { value: '500+', label: 'Sites Commissioned' },
    gradient: 'linear-gradient(135deg, #6366F1, #00C46A)',
    icon: 'layers',
    outcomes: [
      'Clean, standards-compliant cable and equipment installation',
      'Minimal disruption to ongoing operations',
      'Fully documented and labelled infrastructure',
      'Systems ready for commissioning on schedule',
    ],
    deliverables: [
      'Installation Method Statement',
      'Cable & Equipment Labelling Schedule',
      'As-Built Drawings',
      'Inspection & Test Records',
      'Commissioning Checklist',
      'Handover Pack',
    ],
    compliance: ['BS EN 50174', 'NFPA 70', 'IEC 60364', 'TIA-568'],
    longDescription: [
      "Flawless installation is invisible — it's only noticed when it goes wrong. Akamco's delivery teams are trained, certified, and equipped to install complex, multi-system infrastructure to exacting standards, on schedule, and with the site discipline that sensitive operational environments demand.",
      'Our installation scope spans the full physical layer: datacenter build and rack installation, structured cabling and fiber splicing, CCTV and access control deployment, fire alarm cabling and device installation, road-blocker and perimeter barrier commissioning, and solar PV with UPS integration. Each discipline is executed by specialist engineers with the appropriate trade certifications and OEM accreditations.',
      'Every installation is documented with method statements, inspection records, photographic evidence, and as-built drawings — so the handover pack reflects exactly what was installed and how, giving operations teams the foundation they need for ongoing maintenance.',
    ],
    features: [
      { title: 'Datacenter Build & Rack Installation', description: 'Full datacenter fit-out including raised floor installation, rack assembly, cable management, PDU mounting, and patch panel termination to TIA-942 standards.' },
      { title: 'Network & Fiber Installation', description: 'Structured copper and fiber cabling, trunking and conduit, MDF/IDF build, patch panel termination, and optical fiber splicing with OTDR test certification.' },
      { title: 'CCTV & Security System Deployment', description: 'IP and analogue camera installation, NVR/DVR rack mounting, access control panel and reader installation, electric lock fitting, and cabling termination.' },
      { title: 'Fire Alarm Installation', description: 'Fire alarm control panel installation, detector and manual call-point positioning, cable routing in accordance with NFPA 72 or BS 5839, and input/output module wiring.' },
      { title: 'Road Blocker & Barrier Installation', description: 'Civil and mechanical installation of hydraulic road blockers, rising bollards, and barrier arms — including loop detector installation, control panel wiring, and safety interlock testing.' },
      { title: 'Solar & UPS Installation', description: 'Solar panel mounting and array wiring, inverter and battery bank installation, UPS bypass switch installation, and earthing and surge protection in compliance with electrical codes.' },
    ],
    forWhom: [
      'Main contractors requiring specialist sub-contractors',
      'Government facilities undergoing infrastructure upgrades',
      'Enterprises building new offices or datacenters',
      'Critical infrastructure operators adding security layers',
    ],
    process: [
      { step: '01', title: 'Pre-Installation Survey', description: 'Site readiness check, installation method statement approval, and risk assessment before mobilisation.' },
      { step: '02', title: 'Staged Installation', description: 'Phased installation aligned with construction programme, with daily progress reporting and photographic documentation.' },
      { step: '03', title: 'Testing & Inspection', description: 'Point-to-point continuity testing, OTDR certification for fiber, and system-level inspection against design drawings.' },
      { step: '04', title: 'As-Built & Handover', description: 'As-built drawing update, labelling completion, snagging close-out, and formal handover pack delivery.' },
    ],
  },

  // ─── 5. System Integration & Commissioning ──────────────────────────────
  {
    id: 'system-integration-commissioning',
    title: 'System Integration & Commissioning',
    tagline: 'Many systems. One unified operation.',
    description:
      'Multi-system integration, control room consolidation, and full commissioning services — ensuring every technology deployed works as a coherent, tested whole before go-live.',
    image:
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1400&q=80',
    heroStat: { value: '99.9%', label: 'FAT Pass Rate' },
    gradient: 'linear-gradient(135deg, #00C46A, #6366F1)',
    icon: 'globe',
    outcomes: [
      'Fully integrated, interoperable multi-system environments',
      'Documented FAT and SAT evidence packages',
      'Reduced operational complexity through centralised management',
      'Go-live confidence backed by rigorous commissioning',
    ],
    deliverables: [
      'Integration Architecture Document',
      'FAT Test Scripts & Results',
      'SAT Test Scripts & Results',
      'Commissioning Certificates',
      'Integrated System User Guide',
      'Punch List & Defect Close-out Report',
    ],
    compliance: ['IEC 62443', 'ISO/IEC 27001', 'NIST SP 800-82'],
    longDescription: [
      "Modern infrastructure projects rarely involve a single system. Security, fire, access control, building management, fiber monitoring, and IT networks must all be integrated into a coherent operational picture — and that integration is where projects most frequently fail. Akamco's System Integration & Commissioning practice exists to make that convergence work.",
      'Our integration engineers design and implement the middleware, APIs, and protocol gateways that allow disparate systems to share data and act in concert. For control rooms, we deliver unified operator interfaces that consolidate alarm management, video, access events, and network status into a single pane of glass — reducing operator cognitive load and accelerating response times.',
      "Commissioning is always evidence-based: every Factory Acceptance Test and Site Acceptance Test is executed against pre-approved scripts, with results documented and signed off by both Akamco and the client — producing the commissioning certificate that closes out the contract and transitions the system to operations.",
    ],
    features: [
      { title: 'Multi-System Integration', description: 'Protocol-level and API-based integration between security, fire, BMS, SCADA, and IT systems using open standards including OSDP, BACnet, MODBUS, REST, and OPC-UA.' },
      { title: 'Control Room Integration', description: 'Unified operator workstation design, video wall integration, alarm management platform configuration, and operator workflow optimisation for security and operations control rooms.' },
      { title: 'Fiber Monitoring Integration', description: 'Integration of OTDR and fiber sensing systems with network management platforms to provide real-time alerting on fiber link degradation, cuts, and intrusion events.' },
      { title: 'Software & Hardware Integration', description: 'Configuration and integration of network management systems, SIEM platforms, physical security information management (PSIM) software, and building automation controllers.' },
      { title: 'Testing & Commissioning', description: 'Structured commissioning programme covering loop checks, functional tests, performance tests, and integrated system scenario testing — with full documentation for each test step.' },
      { title: 'FAT & SAT', description: "Factory Acceptance Testing at the system integrator's premises and Site Acceptance Testing post-installation, executed against pre-approved test scripts with client witness and sign-off." },
    ],
    forWhom: [
      'Large facility operators managing multiple sub-systems',
      'Government security command and control projects',
      'Industrial sites with OT/IT convergence requirements',
      'Contractors handing over complex integrated installations',
    ],
    process: [
      { step: '01', title: 'Integration Design', description: 'Define system interfaces, data flows, protocol mappings, and integration architecture with all sub-system vendors.' },
      { step: '02', title: 'FAT Preparation & Execution', description: 'Develop FAT test scripts, configure systems in a test environment, and execute acceptance tests with client representation.' },
      { step: '03', title: 'Site Integration & SAT', description: 'Install integration middleware on-site, connect sub-systems, and execute Site Acceptance Tests against the approved scripts.' },
      { step: '04', title: 'Go-Live & Defect Close-out', description: 'Supervised go-live, operator familiarisation, punch list management, and final commissioning certificate issue.' },
    ],
  },

  // ─── 6. Managed Services & Monitoring ───────────────────────────────────
  {
    id: 'managed-services-monitoring',
    title: 'Managed Services & Monitoring',
    tagline: 'Always watching. Always optimising.',
    description:
      '24/7 remote monitoring, SOC and NOC operations, preventive maintenance, and continuous performance optimisation — keeping your infrastructure performing at its peak around the clock.',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80',
    heroStat: { value: '24/7', label: 'Eyes on Your Network' },
    gradient: 'linear-gradient(135deg, #0EA5E9, #00C46A)',
    icon: 'monitor',
    outcomes: [
      'Threats and faults detected and escalated in minutes',
      'Proactive maintenance before issues become outages',
      'Firmware and patch currency maintained continuously',
      'Monthly performance reports with actionable insights',
    ],
    deliverables: [
      'Monthly Operations Report',
      'Incident & Ticket Log',
      'Patch & Firmware Status Report',
      'Network Performance Dashboard',
      'Security Event Summary',
      'Capacity Trend Analysis',
    ],
    compliance: ['ISO 27001', 'ISO 20000', 'NIST CSF'],
    longDescription: [
      "Infrastructure without ongoing management deteriorates silently — firmware vulnerabilities accumulate, bandwidth bottlenecks creep in, and the first sign of a problem is often the outage itself. Akamco's Managed Services & Monitoring practice keeps this from happening by maintaining a continuous operational presence across your environment.",
      'Our combined Security Operations Centre (SOC) and Network Operations Centre (NOC) capabilities mean that security events and network performance issues are handled by specialists in each domain, working from a common toolset and escalation process. We monitor fiber links, security systems, servers, and network devices — correlating alerts to distinguish genuine incidents from noise and acting on what matters.',
      'Preventive maintenance, patch management, and performance optimisation are handled proactively on agreed schedules, ensuring that your infrastructure stays current and healthy between incidents — not just after them.',
    ],
    features: [
      { title: '24/7 Remote Monitoring', description: 'Round-the-clock monitoring of network, security, and power infrastructure using enterprise-grade NMS and SIEM platforms — with defined SLA response times for each alert severity.' },
      { title: 'SOC & NOC Services', description: 'Dedicated Security Operations Centre and Network Operations Centre functions — threat detection, triage, and escalation combined with network performance management and fault resolution.' },
      { title: 'Fiber Link Monitoring', description: 'Continuous optical power monitoring and OTDR-based fault localisation for fiber infrastructure, with automated alerting and rapid field dispatch on confirmed link failures.' },
      { title: 'Preventive Maintenance', description: 'Scheduled on-site preventive maintenance visits covering physical inspection, cleaning, tightening connections, cooling checks, and battery health testing across all covered systems.' },
      { title: 'Patch & Firmware Management', description: 'Systematic vulnerability assessment and patching of network devices, security platforms, and servers — tested in a staging environment before production deployment.' },
      { title: 'Performance Optimisation', description: 'Ongoing analysis of network utilisation, application response times, and security policy effectiveness — with tuning recommendations and implementation to maintain peak performance.' },
    ],
    forWhom: [
      'Enterprises without in-house 24/7 operations capability',
      'Government facilities with critical uptime requirements',
      'Organisations augmenting their internal IT teams',
      'Multi-site operators needing centralised visibility',
    ],
    process: [
      { step: '01', title: 'Onboarding & Discovery', description: 'Asset discovery, monitoring agent deployment, alert threshold configuration, and escalation matrix establishment.' },
      { step: '02', title: 'Operations Commencement', description: 'Live monitoring activation with a hypercare period for tuning and false-positive reduction before standard operations.' },
      { step: '03', title: 'Ongoing Operations', description: 'Continuous monitoring, incident management, preventive maintenance execution, and patch deployment on agreed schedules.' },
      { step: '04', title: 'Monthly Reporting & Review', description: 'Monthly service review meeting, performance and security report delivery, and service improvement planning.' },
    ],
  },

  // ─── 7. Annual Maintenance Contracts (AMC) ──────────────────────────────
  {
    id: 'annual-maintenance-contracts',
    title: 'Annual Maintenance Contracts (AMC)',
    tagline: 'Investment protection. Guaranteed response.',
    description:
      'Structured AMC programs providing scheduled preventive maintenance, emergency technical support, spare parts replacement, and SLA-backed response times for all installed systems.',
    image:
      'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1400&q=80',
    heroStat: { value: '4hr', label: 'Emergency Response SLA' },
    gradient: 'linear-gradient(135deg, #00C46A, #F59E0B)',
    icon: 'shield',
    outcomes: [
      'Extended equipment lifespan through proactive care',
      'Predictable maintenance budgeting with fixed annual fees',
      'Rapid emergency response with defined SLA commitments',
      'Full visibility into system health through regular reporting',
    ],
    deliverables: [
      'AMC Agreement & SLA Schedule',
      'Preventive Maintenance Visit Reports',
      'Emergency Call-Out Records',
      'Spare Parts Consumption Log',
      'Firmware & Update History',
      'Annual System Health Report',
    ],
    compliance: ['ISO 20000', 'ISO 9001'],
    longDescription: [
      "A system installed without a maintenance plan is a system with a countdown to failure. Akamco's Annual Maintenance Contracts give organisations the assurance of knowing that their infrastructure is being actively cared for by the engineers who built it — with documented commitments on visit frequency, response times, and service scope.",
      'Each AMC is structured around the specific systems covered, with scheduled preventive maintenance visits performed at agreed intervals. During each visit, our engineers carry out physical inspections, performance checks, firmware reviews, and minor adjustments — catching issues that would otherwise silently grow into outages.',
      "For emergencies, our AMC clients benefit from priority dispatch with a defined SLA response time — whether the issue is a failed UPS, a down security camera, or a critical network fault. Spare parts coverage, firmware update management, and periodic system health reporting complete a service that genuinely protects the value of your infrastructure investment.",
    ],
    features: [
      { title: 'Scheduled Preventive Visits', description: 'Regular on-site preventive maintenance visits at contractually defined intervals — covering physical inspections, cleaning, cable dress, cooling checks, and functional testing.' },
      { title: 'Emergency Technical Support', description: 'Priority emergency response with SLA-backed arrival times for critical faults — covering all systems within the AMC scope with 24/7 call-out availability.' },
      { title: 'Spare Parts Replacement', description: 'Pre-agreed spare parts coverage for common consumables and failure-prone components — minimising lead times and ensuring rapid restoration of failed equipment.' },
      { title: 'Firmware & Software Updates', description: 'Managed firmware and software update cycle for all covered devices — including change management documentation and rollback capabilities.' },
      { title: 'SLA-Based Response Time', description: 'Contractually committed response and restoration time SLAs tiered by severity — from 4-hour emergency response to next business day for non-critical faults.' },
      { title: 'System Health Reporting', description: 'Periodic system health reports summarising maintenance activities, incident history, component aging, and recommendations for refresh or upgrade — supporting lifecycle planning.' },
    ],
    forWhom: [
      'Organisations with post-warranty infrastructure',
      'Government facilities requiring documented maintenance records',
      'Critical sites where unplanned downtime is unacceptable',
      'Enterprises managing multiple installed systems',
    ],
    process: [
      { step: '01', title: 'Systems Audit & Scoping', description: 'Inventory all systems, assess current condition, and define AMC scope, coverage levels, and SLA parameters.' },
      { step: '02', title: 'Contract Agreement & Schedule', description: 'Finalise AMC agreement, preventive visit schedule, spare parts provision, and escalation contact matrix.' },
      { step: '03', title: 'Ongoing Preventive & Reactive Services', description: 'Execute scheduled preventive visits, respond to emergency call-outs, and manage firmware and spare parts.' },
      { step: '04', title: 'Annual Review & Renewal', description: 'Annual service review, health report presentation, contract performance assessment, and next-year scope refinement.' },
    ],
  },

  // ─── 8. IT Outsourcing & Technical Staffing ──────────────────────────────
  {
    id: 'it-outsourcing-staffing',
    title: 'IT Outsourcing & Technical Staffing',
    tagline: 'The right expertise. Right where you need it.',
    description:
      'Flexible IT outsourcing and on-site technical staffing — placing qualified engineers including IT helpdesk, security specialists, network engineers, and fiber technicians directly within your operations.',
    image:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80',
    heroStat: { value: '100+', label: 'Engineers Deployed' },
    gradient: 'linear-gradient(135deg, #6366F1, #0EA5E9)',
    icon: 'building',
    outcomes: [
      'Immediate access to verified, certified technical talent',
      'Flexible engagement — project-based or long-term',
      'Reduced hiring costs and HR overhead',
      'Seamless integration with your existing IT team',
    ],
    deliverables: [
      'Candidate Technical Assessment Report',
      'Staff Deployment Plan',
      'Monthly Attendance & Activity Log',
      'Performance Review Reports',
      'Escalation & Support Matrix',
      'Knowledge Transfer Documentation',
    ],
    compliance: ['ISO 9001', 'Data Protection Compliance'],
    longDescription: [
      "The gap between the technical capability an organisation needs and what its in-house team can sustainably provide is real — and growing. Akamco's IT Outsourcing & Technical Staffing service bridges that gap by embedding verified, experienced engineers directly into your operations — without the recruitment cycle, HR overhead, or long-term headcount commitment.",
      'We provide IT helpdesk engineers and level 1/2/3 support staff for day-to-day operations; IT security specialists for vulnerability management, SIEM operations, and incident response; network engineers for ongoing infrastructure management; fiber technicians for plant maintenance and fault response; and complete on-site technical support teams for complex facilities.',
      'Every staff member we place is technically assessed, reference-checked, and briefed on your environment before deployment. Our staffing coordinator remains the ongoing point of contact — managing performance, handling escalations, and providing cover for leave and sick days — so your operations are never left exposed.',
    ],
    features: [
      { title: 'IT Helpdesk Engineers', description: 'Level 1, 2, and 3 IT helpdesk staff for end-user support, service desk operations, asset management, and incident ticketing — deployed on-site or as a hybrid remote function.' },
      { title: 'IT Security Specialists', description: 'Certified security analysts and engineers for SOC operations, vulnerability assessments, penetration test support, policy review, and security awareness programmes.' },
      { title: 'Network Engineers', description: 'Senior and mid-level network engineers for day-to-day infrastructure management, change implementations, troubleshooting, and configuration management.' },
      { title: 'Fiber Technicians', description: 'Qualified fiber splicing and testing technicians for plant maintenance, fault localisation, OTDR testing, and new fiber installation within your facilities.' },
      { title: 'On-Site Technical Support Teams', description: 'Complete multi-discipline technical teams for large facilities and government installations — covering network, security, power, and structured cabling disciplines under a single team lead.' },
    ],
    forWhom: [
      'Enterprises augmenting their internal IT capability',
      'Government ministries with headcount constraints',
      'Large facilities requiring resident technical teams',
      'Organisations managing post-project operational support',
    ],
    process: [
      { step: '01', title: 'Requirement & Role Definition', description: 'Define technical skills, certifications, experience levels, and soft skills required for each role or team.' },
      { step: '02', title: 'Candidate Sourcing & Assessment', description: 'Technical screening, skills assessment, and reference checks — presenting a shortlist of qualified candidates for client interview.' },
      { step: '03', title: 'Deployment & Onboarding', description: 'Staff deployment with environment briefing, system access provisioning, and an induction period with Akamco oversight.' },
      { step: '04', title: 'Ongoing Management', description: 'Regular performance reviews, cover management, skills development, and account management to ensure service quality.' },
    ],
  },

  // ─── 9. Training & Knowledge Transfer ───────────────────────────────────
  {
    id: 'training-knowledge-transfer',
    title: 'Training & Knowledge Transfer',
    tagline: 'Technology delivered. Knowledge embedded.',
    description:
      'Structured training programmes for end-users, system administrators, and technical teams — covering cybersecurity awareness, datacenter operations, and full system documentation handover.',
    image:
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1400&q=80',
    heroStat: { value: '1,000+', label: 'Professionals Trained' },
    gradient: 'linear-gradient(135deg, #00C46A, #6366F1)',
    icon: 'zap',
    outcomes: [
      'Staff empowered to operate and maintain systems independently',
      'Cybersecurity awareness embedded across the organisation',
      'Complete documentation package for ongoing reference',
      'Reduced dependency on vendor support',
    ],
    deliverables: [
      'Training Needs Analysis',
      'Course Material & Presentations',
      'Practical Lab Exercises',
      'Training Attendance Records',
      'Assessment Results',
      'System Documentation & Handover Pack',
    ],
    compliance: ['ISO 27001 Awareness Requirements', 'NIST CSF PR.AT'],
    longDescription: [
      "Technology only delivers its potential when the people operating it understand it. Akamco's Training & Knowledge Transfer service ensures that every system we design, supply, or deploy comes with the human capability to run it — from the end-user logging in for the first time to the datacenter engineer performing a maintenance cycle.",
      'Our training programmes are designed around the actual systems in your environment, not generic product slides. End-user training covers day-to-day operations, security awareness, and incident reporting. Administrator training covers system configuration, backup and recovery procedures, and escalation paths. Cybersecurity awareness programmes are delivered as interactive workshops designed to change behaviour, not just tick a compliance box.',
      'For complex infrastructure handovers, our Knowledge Transfer engagements include structured shadowing periods, as-built documentation review, and a formal handover sign-off — ensuring that your team is genuinely ready to own the environment long after Akamco completes its engagement.',
    ],
    features: [
      { title: 'End-User Training', description: 'Role-appropriate training for staff who use but do not administer the systems — covering day-to-day operations, access procedures, and security responsibilities.' },
      { title: 'Administrator Training', description: 'Technical training for IT and facilities staff responsible for system administration — covering configuration, backup and recovery, user management, and escalation procedures.' },
      { title: 'Cybersecurity Awareness Programs', description: 'Interactive cybersecurity awareness workshops covering phishing, social engineering, password hygiene, incident reporting, and security culture — designed to change behaviour, not just inform.' },
      { title: 'Datacenter Operations Training', description: 'Hands-on training for datacenter operations staff covering physical infrastructure management, environmental monitoring, change control procedures, and emergency response.' },
      { title: 'System Documentation & Handover', description: 'Comprehensive documentation package including as-built drawings, configuration backups, standard operating procedures, contact matrices, and a structured knowledge transfer session with sign-off.' },
    ],
    forWhom: [
      'Organisations receiving newly deployed infrastructure',
      'Teams onboarding new technology platforms',
      'HR and compliance teams meeting security training obligations',
      'Facilities transitioning from vendor to in-house management',
    ],
    process: [
      { step: '01', title: 'Training Needs Analysis', description: 'Assess audience roles, existing knowledge levels, and learning objectives to design the most effective programme.' },
      { step: '02', title: 'Content Development', description: 'Develop custom training materials, lab exercises, and assessments tailored to your specific systems and environment.' },
      { step: '03', title: 'Training Delivery', description: 'Instructor-led training sessions — classroom, on-site, or hybrid — with practical exercises on live or lab systems.' },
      { step: '04', title: 'Assessment & Handover', description: 'Post-training assessment, certification of completion, and formal documentation package handover with sign-off.' },
    ],
  },
];
