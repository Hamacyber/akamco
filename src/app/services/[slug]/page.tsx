import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { services as staticServices } from '@/data/services';
import { getAllServices } from '@/lib/servicesStorage';
import ServiceDetail from './ServiceDetail';

function getServices() {
  try { return getAllServices(); } catch { return staticServices; }
}

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return staticServices.map((s) => ({ slug: s.id }));
}

export function generateMetadata({ params }: Props): Metadata {
  const service = getServices().find((s) => s.id === params.slug);
  if (!service) return {};
  return {
    title: `${service.title} | Akamco Technologies`,
    description: service.description,
    openGraph: {
      title: service.title,
      description: service.description,
      images: [{ url: service.image }],
    },
  };
}

export default function ServicePage({ params }: Props) {
  const service = getServices().find((s) => s.id === params.slug);
  if (!service) notFound();
  return <ServiceDetail service={service} />;
}
