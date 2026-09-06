import { getAllServices } from '@/lib/servicesStorage';
import { ServicesContent } from './ServicesContent';

export const metadata = {
  title: 'Services | Akamco Technologies',
  description: 'Comprehensive IT services from consultancy and system design to managed services and training — covering the full lifecycle of enterprise technology delivery.',
};

export default function ServicesPage() {
  const services = getAllServices();
  return <ServicesContent services={services} />;
}
