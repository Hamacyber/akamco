/**
 * Social Responsibility (CSR) page storage — server-only.
 * Reads / writes csr-data.json at project root.
 */
import fs   from 'fs';
import path from 'path';

const FILE = path.join(process.cwd(), 'csr-data.json');

// ─── Types ────────────────────────────────────────────────────────
export interface CSRHero {
  badge:       string;
  title:       string;
  subtitle:    string;
  heroImage:   string;
  quoteText:   string;
  quoteAuthor: string;
}

export interface CSRStat {
  id:    string;
  value: string;
  label: string;
}

export interface CSRPillarStat {
  value: string;
  label: string;
}

export interface CSRPillar {
  id:      string;
  tag:     string;
  title:   string;
  body:    string;
  image:   string;
  alt:     string;
  reverse: boolean;
  stats:   CSRPillarStat[];
}

export interface CSRInitiative {
  id:       string;
  iconName: string;
  title:    string;
  desc:     string;
}

export interface CSRGalleryImage {
  id:   string;
  src:  string;
  alt:  string;
  span: string;
}

export interface CSRCta {
  title:       string;
  description: string;
}

export interface CSRData {
  hero:        CSRHero;
  impactStats: CSRStat[];
  pillars:     CSRPillar[];
  initiatives: CSRInitiative[];
  gallery:     CSRGalleryImage[];
  cta:         CSRCta;
}

// ─── Seed data ────────────────────────────────────────────────────
const SEED: CSRData = {
  hero: {
    badge:       'Corporate Social Responsibility',
    title:       'Technology with Purpose',
    subtitle:    "At Akamco, we measure success not only by the projects we deliver but by the lasting positive impact we create in the communities we serve. For over 25 years, giving back has been as central to our identity as the technology we provide.",
    heroImage:   'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1400&q=85',
    quoteText:   "Technology only matters when it improves people's lives.",
    quoteAuthor: 'Akamco Founding Principle',
  },
  impactStats: [
    { id: 'is1', value: '25+',   label: 'Years of Community Engagement' },
    { id: 'is2', value: '5,000+', label: 'Lives Directly Impacted' },
    { id: 'is3', value: '60+',    label: 'Schools & NGOs Supported' },
    { id: 'is4', value: '300+',   label: 'Local Jobs Created' },
  ],
  pillars: [
    {
      id: 'p1', tag: 'Education & Youth', title: 'Investing in the Next Generation',
      body: 'We believe that technology access starts with knowledge. Akamco partners with universities, technical colleges and vocational institutes across Iraq to offer structured internship programmes, hands-on lab sessions and sponsored certification courses. Since 2010, we have hosted over 400 student interns and sponsored more than 200 certifications for young engineers entering the workforce.',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=80',
      alt: 'Students learning technology in a classroom', reverse: false,
      stats: [
        { value: '400+', label: 'Student Interns' },
        { value: '200+', label: 'Certifications Sponsored' },
        { value: '15+',  label: 'University Partners' },
      ],
    },
    {
      id: 'p2', tag: 'Environment', title: 'Building a Greener Future',
      body: "As a provider of renewable energy and sustainable infrastructure, Akamco practices what it preaches. We have transitioned our own offices to partially solar-powered operations, enforce a strict e-waste recycling programme for all decommissioned hardware, and prioritise energy-efficient equipment in every project design.",
      image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&w=900&q=80',
      alt: 'Solar panels and renewable energy installation', reverse: true,
      stats: [
        { value: '40%',  label: 'Office Energy from Solar' },
        { value: '100%', label: 'E-Waste Recycled' },
        { value: '30%',  label: 'Carbon Reduction Goal by 2030' },
      ],
    },
    {
      id: 'p3', tag: 'Digital Inclusion', title: 'Connecting Communities',
      body: 'The digital divide is a barrier we work actively to close. Akamco donates refurbished IT equipment to schools, community centres and NGOs, and runs free digital literacy workshops in underserved areas. We have equipped over 60 schools and community organisations with working computers, networking equipment, and internet access infrastructure.',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
      alt: 'People working together on computers in a community setting', reverse: false,
      stats: [
        { value: '60+',   label: 'Schools Equipped' },
        { value: '5,000+', label: 'Beneficiaries Reached' },
        { value: '120+',  label: 'Workshops Delivered' },
      ],
    },
    {
      id: 'p4', tag: 'Local Employment', title: 'Empowering Local Talent',
      body: "Over 95% of our workforce is Iraqi. We are committed to hiring, training and retaining local talent rather than relying on expatriate specialists. Our internal training academy runs continuous upskilling programmes so that our team members grow alongside the company.",
      image: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=900&q=80',
      alt: 'Diverse team working together in an office environment', reverse: true,
      stats: [
        { value: '95%+', label: 'Iraqi Workforce' },
        { value: '25+',  label: 'Years of Local Investment' },
        { value: '300+', label: 'Jobs Created' },
      ],
    },
  ],
  initiatives: [
    { id: 'i1', iconName: 'book',      title: 'Annual Scholarship Fund',       desc: 'Each year we fund full university scholarships for two outstanding IT students from low-income families in Baghdad, Basra and Erbil.' },
    { id: 'i2', iconName: 'computer',  title: 'IT Equipment Donations',         desc: 'Decommissioned enterprise hardware is refurbished and donated to schools and NGOs instead of going to landfill — over 2,000 devices to date.' },
    { id: 'i3', iconName: 'users',     title: 'Employee Volunteering',           desc: 'Akamco staff receive two paid volunteering days per year to contribute to community projects.' },
    { id: 'i4', iconName: 'lightning', title: 'Women in Tech Programme',         desc: "A dedicated mentorship and placement programme encouraging women to enter and advance in Iraq's technology sector, running since 2019." },
    { id: 'i5', iconName: 'globe',     title: 'Free Cybersecurity Awareness',    desc: 'We run free cybersecurity awareness sessions for SMEs, government departments and community groups to help Iraq stay safer online.' },
    { id: 'i6', iconName: 'building',  title: 'Infrastructure for Underserved', desc: 'In partnership with local authorities, Akamco has contributed network and solar infrastructure to clinics and schools in rural areas.' },
  ],
  gallery: [
    { id: 'g1', src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=700&q=80', alt: 'Team training session for young engineers', span: 'row-span-1' },
    { id: 'g2', src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=700&q=80', alt: 'Students attending a technology workshop',   span: 'md:row-span-2' },
    { id: 'g3', src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=700&q=80', alt: 'Modern office and collaborative workspace',   span: 'row-span-1' },
    { id: 'g4', src: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=700&q=80', alt: 'Solar panels and renewable energy system',    span: 'row-span-1' },
    { id: 'g5', src: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=700&q=80', alt: 'Community support and social outreach',       span: 'row-span-1' },
    { id: 'g6', src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=700&q=80', alt: 'Digital literacy workshop for community',     span: 'row-span-1' },
  ],
  cta: {
    title:       'Partner With Us on CSR',
    description: 'Are you an NGO, school, or community organisation looking for technology support? Or a business that wants to co-fund a CSR initiative? We would love to hear from you.',
  },
};

// ─── I/O helpers ──────────────────────────────────────────────────
function read(): CSRData {
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify(SEED, null, 2), 'utf-8');
    return SEED;
  }
  try { return JSON.parse(fs.readFileSync(FILE, 'utf-8')) as CSRData; }
  catch { return SEED; }
}

function write(data: CSRData): void {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function uuid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ─── Public API ───────────────────────────────────────────────────
export function getCSRData(): CSRData { return read(); }

export function saveCSRData(data: CSRData): CSRData {
  write(data);
  return data;
}

/** Ensures every item has a unique id; fills missing ids. */
export function sanitizeCSRData(raw: Partial<CSRData>): CSRData {
  const base = read();
  const out: CSRData = {
    hero:        { ...base.hero,        ...(raw.hero        ?? {}) },
    cta:         { ...base.cta,         ...(raw.cta         ?? {}) },
    impactStats: (raw.impactStats ?? base.impactStats).map(s => ({ ...s, id: s.id || uuid() })),
    pillars:     (raw.pillars     ?? base.pillars).map(p => ({
      ...p, id: p.id || uuid(),
      stats: (p.stats ?? []).map(s => ({ ...s })),
    })),
    initiatives: (raw.initiatives ?? base.initiatives).map(i => ({ ...i, id: i.id || uuid() })),
    gallery:     (raw.gallery     ?? base.gallery).map(g => ({ ...g, id: g.id || uuid() })),
  };
  return out;
}
