import type { Metadata } from 'next';
import CompanyProfileContent from './CompanyProfileContent';

export const metadata: Metadata = {
  title: 'Company Profile — Akamco Technologies',
  description:
    'Browse the Akamco Technologies company profile. Explore our capabilities, partnerships, projects, and solutions in an interactive flipbook.',
};

export default function CompanyProfilePage() {
  return <CompanyProfileContent />;
}
