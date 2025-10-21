import TasksListing from '@/components/tasks/TasksListing';

interface TasksPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TasksPage({ params, searchParams }: TasksPageProps) {
  const { lang } = await params;
  const filters = await searchParams;

  return (
    <div className="min-h-screen">
      <TasksListing locale={lang} initialFilters={filters} />
    </div>
  );
}
