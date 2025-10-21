import FreelancersListing from '@/components/freelancers/FreelancersListing';

interface FreelancersPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function FreelancersPage({ params, searchParams }: FreelancersPageProps) {
  const { lang } = await params;
  const filters = await searchParams;

  return (
    <div className="min-h-screen">
      <FreelancersListing locale={lang} initialFilters={filters} />
    </div>
  );
}
