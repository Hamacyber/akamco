import type { Metadata } from 'next';
import { AboutContent } from './AboutContent';
import { getAllSolutions } from '@/lib/solutionsStorage';
import type { SolutionDetail } from '@/data/solutions';

export const metadata: Metadata = {
  title: 'About — Mission, Vision & Leadership',
  description:
    'Learn about Akamco Technologies, our mission to secure digital infrastructure, our leadership team, and our journey building trust with government and enterprise clients.',
};

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

export default function AboutPage() {
  const allSolutions = getAllSolutions();
  const coreItems: SolutionDetail[] = CORE_IDS
    .map(id => allSolutions.find(s => s.id === id))
    .filter((s): s is SolutionDetail => !!s);
  return <AboutContent solutions={coreItems} />;
}
