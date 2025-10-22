import TaskCreateForm from '@/components/tasks/TaskCreateForm';
import type { Metadata } from 'next';

interface TaskCreatePageProps {
  params: Promise<{ lang: string }>;
}

export const metadata: Metadata = {
  title: 'Yeni Tapşırıq Yarat | Task.az',
  description: 'Yeni tapşırıq yaradın və ən yaxşı peşəkarları tapın. Azərbaycanda iş tapmaq indi daha asan.',
};

export default async function TaskCreatePage({ params }: TaskCreatePageProps) {
  const { lang } = await params;

  return (
    <div className="min-h-screen px-6 py-16">
      <TaskCreateForm locale={lang} />
    </div>
  );
}
