import TaskCreateForm from '@/components/tasks/TaskCreateForm';

interface TaskCreatePageProps {
  params: Promise<{ lang: string }>;
}

export default async function TaskCreatePage({ params }: TaskCreatePageProps) {
  const { lang } = await params;

  return (
    <div className="min-h-screen px-6 py-16">
      <TaskCreateForm locale={lang} />
    </div>
  );
}
