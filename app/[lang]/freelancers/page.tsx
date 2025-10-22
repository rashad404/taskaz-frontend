import FreelancersListing from '@/components/freelancers/FreelancersListing';
import type { Metadata } from 'next';

interface FreelancersPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const metadata: Metadata = {
  title: 'Peşəkarlar | Task.az',
  description: 'Azərbaycanda ən yaxşı peşəkarları tapın. Müxtəlif sahələr üzrə ixtisaslı mütəxəssislər.',
};

export default async function FreelancersPage({ params, searchParams }: FreelancersPageProps) {
  const { lang } = await params;
  const filters = await searchParams;

  return (
    <div className="min-h-screen">
      <FreelancersListing locale={lang} initialFilters={filters} />
    </div>
  );
}
