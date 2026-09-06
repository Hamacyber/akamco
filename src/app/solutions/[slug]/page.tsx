import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { solutions as staticSolutions } from '@/data/solutions';
import { getAllSolutions } from '@/lib/solutionsStorage';
import SolutionDetail from './SolutionDetail';

function getSolutions() {
  try { return getAllSolutions(); } catch { return staticSolutions; }
}

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return staticSolutions.map((s) => ({ slug: s.id }));
}

export function generateMetadata({ params }: Props): Metadata {
  const solution = getSolutions().find((s) => s.id === params.slug);
  if (!solution) return {};
  return {
    title: `${solution.title} | Akamco Technologies`,
    description: solution.description,
    openGraph: {
      title: solution.title,
      description: solution.description,
      images: [{ url: solution.image }],
    },
  };
}

export default function SolutionPage({ params }: Props) {
  const solution = getSolutions().find((s) => s.id === params.slug);
  if (!solution) notFound();
  return <SolutionDetail solution={solution} />;
}
