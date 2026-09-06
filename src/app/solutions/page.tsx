import type { Metadata } from 'next';
import { SolutionsContent } from './SolutionsContent';
import { getAllSolutions } from '@/lib/solutionsStorage';

export const metadata: Metadata = {
  title: 'Our Services — Akamco Technologies',
  description:
    'Explore Akamco\'s full range of IT, security, power, and infrastructure services — engineered for enterprise and government clients across Iraq and the Middle East.',
};

export default function SolutionsPage() {
  const solutions = getAllSolutions();
  return <SolutionsContent solutions={solutions} />;
}
