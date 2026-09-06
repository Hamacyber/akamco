import type { Metadata } from 'next';
import { PartnersContent } from './PartnersContent';
import { getAllPartners, getCategories } from '@/lib/partnerStorage';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Technology Partners | Akamco',
  description:
    'Akamco partners with world-leading technology brands including Dell, Cisco, Microsoft, Fortinet, Palo Alto Networks, HPE, and 30+ more to deliver innovative IT, security, power, and communication solutions across Iraq and the Middle East.',
};

export default function PartnersPage() {
  const partners   = getAllPartners();
  const categories = getCategories();
  return <PartnersContent partners={partners} categories={categories} />;
}
