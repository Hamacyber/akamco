// ─── Jobs Storage (server-only) ────────────────────────────────
import fs from 'fs';
import path from 'path';

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  active: boolean; // false = hidden from public page
  postedAt: string; // ISO date
}

const DATA_FILE = path.join(process.cwd(), 'jobs-data.json');

const SEED: Job[] = [
  {
    id: 'network-infrastructure-engineer',
    title: 'Network Infrastructure Engineer',
    department: 'Engineering',
    location: 'Baghdad, Iraq',
    type: 'Full-time',
    description:
      'Design, deploy and maintain enterprise LAN/WAN, WiFi and datacenter networks for government and private sector clients.',
    requirements: [
      'CCNA/CCNP or equivalent certification',
      '3+ years enterprise networking experience',
      'Hands-on with Cisco, Juniper, or Fortinet equipment',
      'Fluent in Arabic; English proficiency is a plus',
    ],
    active: true,
    postedAt: '2025-11-01',
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    department: 'Security',
    location: 'Baghdad, Iraq',
    type: 'Full-time',
    description:
      'Monitor, detect and respond to security threats across client environments. Conduct vulnerability assessments and security audits.',
    requirements: [
      'CEH, CompTIA Security+, or equivalent',
      '2+ years SOC or security operations experience',
      'Experience with SIEM, IDS/IPS, and firewall management',
      'Strong analytical and reporting skills',
    ],
    active: true,
    postedAt: '2025-11-01',
  },
  {
    id: 'physical-security-technician',
    title: 'Physical Security Systems Technician',
    department: 'Security',
    location: 'Baghdad, Iraq',
    type: 'Full-time',
    description:
      'Install, configure and maintain CCTV, access control, fire detection and alarm systems at government and commercial sites.',
    requirements: [
      '2+ years hands-on experience with security systems',
      'Knowledge of leading brands (Hikvision, Honeywell, Bosch, etc.)',
      'Ability to read technical drawings and project documentation',
      'Valid driving license',
    ],
    active: true,
    postedAt: '2025-11-01',
  },
  {
    id: 'software-developer',
    title: 'Software Developer',
    department: 'Technology',
    location: 'Baghdad, Iraq',
    type: 'Full-time',
    description:
      'Build custom enterprise applications and internal tools. Work across the full stack to deliver reliable, scalable software.',
    requirements: [
      'Proficiency in React, Next.js, Node.js or .NET',
      '2+ years commercial software development',
      'Experience with REST APIs and relational databases',
      'Strong problem-solving and team collaboration skills',
    ],
    active: true,
    postedAt: '2025-11-01',
  },
  {
    id: 'it-project-manager',
    title: 'IT Project Manager',
    department: 'Operations',
    location: 'Baghdad, Iraq',
    type: 'Full-time',
    description:
      'Lead end-to-end delivery of technology projects — from planning and vendor coordination to client handover and post-project support.',
    requirements: [
      'PMP certification preferred',
      '4+ years managing IT infrastructure projects',
      'Strong client-facing communication skills',
      'Experience with project management tools (MS Project, Jira, etc.)',
    ],
    active: true,
    postedAt: '2025-11-01',
  },
  {
    id: 'presales-consultant',
    title: 'Pre-Sales Technical Consultant',
    department: 'Sales & Advisory',
    location: 'Baghdad, Iraq',
    type: 'Full-time',
    description:
      'Provide technical expertise during client proposals and tenders. Prepare BOQs, technical specs and solution presentations.',
    requirements: [
      'Strong technical background in IT infrastructure or security',
      '3+ years pre-sales or solutions architect experience',
      'Excellent presentation and proposal writing skills',
      'Arabic required; English strongly preferred',
    ],
    active: true,
    postedAt: '2025-11-01',
  },
];

function read(): Job[] {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(SEED, null, 2));
    return SEED;
  }
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')) as Job[]; }
  catch { return SEED; }
}

function write(jobs: Job[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(jobs, null, 2));
}

export function getAllJobs(): Job[] { return read(); }

export function getActiveJobs(): Job[] { return read().filter(j => j.active); }

export function getJobById(id: string): Job | undefined {
  return read().find(j => j.id === id);
}

export function createJob(data: Omit<Job, 'postedAt'>): Job {
  const jobs = read();
  if (jobs.find(j => j.id === data.id)) throw new Error(`Job with id "${data.id}" already exists.`);
  const job: Job = { ...data, postedAt: new Date().toISOString().slice(0, 10) };
  write([...jobs, job]);
  return job;
}

export function updateJob(id: string, data: Partial<Omit<Job, 'id' | 'postedAt'>>): Job | null {
  const jobs = read();
  const idx = jobs.findIndex(j => j.id === id);
  if (idx === -1) return null;
  jobs[idx] = { ...jobs[idx], ...data };
  write(jobs);
  return jobs[idx];
}

export function deleteJob(id: string): boolean {
  const jobs = read();
  const next = jobs.filter(j => j.id !== id);
  if (next.length === jobs.length) return false;
  write(next);
  return true;
}
