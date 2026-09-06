import dynamic from 'next/dynamic';
import fs from 'fs';
import path from 'path';
import { Hero } from '@/components/home/Hero';
import { getAllSolutions } from '@/lib/solutionsStorage';
import { getAllPosts } from '@/lib/blogStorage';
import type { SolutionDetail } from '@/data/solutions';

function getAdminPartners(): { name: string; logo: string; logoDark?: string }[] {
  try {
    const file = path.join(process.cwd(), 'partners-data.json');
    const raw = JSON.parse(fs.readFileSync(file, 'utf-8'));
    const list = raw.partners ?? raw;
    return (Array.isArray(list) ? list : [])
      .filter((p: { logo?: string }) => p.logo)
      .map((p: { name: string; logo: string; logoDark?: string }) => ({
        name: p.name,
        logo: p.logo,
        logoDark: p.logoDark,
      }));
  } catch {
    return [];
  }
}

const CapabilityHighlights = dynamic(
  () => import('@/components/home/CapabilityHighlights').then(m => m.CapabilityHighlights),
  { ssr: true }
);
const StatsSection = dynamic(
  () => import('@/components/home/StatsSection').then(m => m.StatsSection),
  { ssr: true }
);
const WhyChooseUs = dynamic(
  () => import('@/components/home/WhyChooseUs').then(m => m.WhyChooseUs),
  { ssr: true }
);
const PartnersStrip = dynamic(
  () => import('@/components/home/PartnersStrip').then(m => m.PartnersStrip),
  { ssr: true }
);
const Testimonials = dynamic(
  () => import('@/components/home/Testimonials').then(m => m.Testimonials),
  { ssr: false }
);
const CTASection = dynamic(
  () => import('@/components/home/CTASection').then(m => m.CTASection),
  { ssr: true }
);
const IndustryNews = dynamic(
  () => import('@/components/home/IndustryNews').then(m => m.IndustryNews),
  { ssr: true }
);

const CORE_IDS = [
  'datacenter-solutions',
  'cybersecurity',
  'network-infrastructure',
  'physical-security',
  'software-development',
  'renewable-energy',
  'fire-life-safety',
  'control-room-command',
  'ups-critical-power',
];

export default function HomePage() {
  const allSolutions = getAllSolutions();
  const adminPartners = getAdminPartners();
  const latestPosts = getAllPosts().filter(p => p.category === 'Industry News').slice(0, 5);
  const coreItems: SolutionDetail[] = CORE_IDS
    .map(id => allSolutions.find(s => s.id === id))
    .filter((s): s is SolutionDetail => !!s);

  return (
    <>
      <Hero />
      <StatsSection />
      <CapabilityHighlights items={coreItems} />
      <WhyChooseUs />
      <IndustryNews posts={latestPosts} />
      <PartnersStrip partners={adminPartners} />
      <Testimonials />
      <CTASection />
    </>
  );
}
