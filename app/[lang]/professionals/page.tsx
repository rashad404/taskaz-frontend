import professionalsListing from '@/components/professionals/professionalsListing';
import type { Metadata } from 'next';

interface professionalsPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const metadata: Metadata = {
  title: 'Peşəkarlar | Task.az',
  description: 'Azərbaycanda ən yaxşı peşəkarları tapın. Müxtəlif sahələr üzrə ixtisaslı mütəxəssislər.',
};

export default async function professionalsPage({ params, searchParams }: professionalsPageProps) {
  const { lang } = await params;
  const filters = await searchParams;

  return (
    <div className="min-h-screen">
      <professionalsListing locale={lang} initialFilters={filters} />
    </div>
  );
}
