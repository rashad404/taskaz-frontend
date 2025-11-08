'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import TaskEditForm from '@/components/tasks/TaskEditForm';

export default function TaskEditPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.lang as string) || 'az';
  const slug = params?.slug as string;

  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push(`/${locale}/login`);
      return;
    }

    // Fetch task details
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${slug}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          // Check if user owns this task (backend provides is_owner flag)
          if (!data.data.is_owner) {
            setError('Yalnız öz tapşırığınızı redaktə edə bilərsiniz');
            return;
          }
          setTask(data.data);
        } else {
          setError('Tapşırıq tapılmadı');
        }
      })
      .catch(err => {
        console.error('Failed to fetch task:', err);
        setError('Tapşırıq yüklənərkən xəta baş verdi');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router, locale, slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || 'Tapşırıq tapılmadı'}
          </h2>
          <button
            onClick={() => router.push(`/${locale}/my-tasks`)}
            className="btn-primary"
          >
            Mənim Tapşırıqlarıma Qayıt
          </button>
        </div>
      </div>
    );
  }

  return <TaskEditForm locale={locale} task={task} />;
}
