import ProfessionalsListing from '@/components/professionals/ProfessionalsListing';
import type { Metadata } from 'next';

interface ProfessionalsPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const metadata: Metadata = {
  title: 'Peşəkarlar | Task.az',
  description: 'Azərbaycanda ən yaxşı peşəkarları tapın. Müxtəlif sahələr üzrə ixtisaslı mütəxəssislər.',
};

export default async function ProfessionalsPage({ params, searchParams }: ProfessionalsPageProps) {
  const { lang } = await params;
  const filters = await searchParams;

  return (
    <div className="min-h-screen">
      <ProfessionalsListing locale={lang} initialFilters={filters} />
    </div>
  );
}
