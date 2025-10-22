import TasksListing from '@/components/tasks/TasksListing';
import type { Metadata } from 'next';

interface TasksPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const metadata: Metadata = {
  title: 'Bütün Tapşırıqlar | Task.az',
  description: 'Azərbaycanda müxtəlif kateqoriyalar üzrə bütün açıq tapşırıqlara baxın və müraciət edin.',
};

export default async function TasksPage({ params, searchParams }: TasksPageProps) {
  const { lang } = await params;
  const filters = await searchParams;

  return (
    <div className="min-h-screen">
      <TasksListing locale={lang} initialFilters={filters} />
    </div>
  );
}
