import type { Metadata } from 'next';
import { CareersContent } from './CareersContent';
import { getActiveJobs } from '@/lib/jobsStorage';

export const metadata: Metadata = {
  title: 'Careers — Join the Akamco Team',
  description:
    'Explore career opportunities at Akamco Technologies. We are hiring engineers, security specialists, developers, and consultants to deliver cutting-edge infrastructure solutions across Iraq and the Middle East.',
};

export default function CareersPage() {
  const jobs = getActiveJobs();
  return <CareersContent jobs={jobs} />;
}
