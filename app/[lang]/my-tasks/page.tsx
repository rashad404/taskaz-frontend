'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Briefcase,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Users,
  Wallet,
  Filter
} from 'lucide-react';
import TaskStatusBadge from '@/components/tasks/TaskStatusBadge';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function MyTasksPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.lang as string) || 'az';

  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'assigned' | 'completed'>('all');

  // Strip HTML tags from description
  const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').trim();
  };

  useEffect(() => {
    // Fetch my tasks
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/my-tasks`, {
      credentials: 'include'
    })
      .then(res => {
        if (res.status === 401) {
          router.push(`/${locale}/login`);
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data && data.status === 'success') {
          setTasks(data.data?.data || []);
        }
      })
      .catch(err => {
        console.error('Failed to fetch tasks:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router, locale]);

  const filteredTasks = filter === 'all'
    ? tasks
    : tasks.filter(task => task.status === filter);

  return (
    <DashboardLayout activePage="my-tasks" title="Mənim Tapşırıqlarım">
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : (
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Mənim Tapşırıqlarım
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Yaratdığınız bütün tapşırıqlar
            </p>
          </div>
          <Link
            href={`/${locale}/tasks/create`}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Yeni Tapşırıq
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-white/80 dark:bg-gray-900/80 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            Hamısı ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('open')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === 'open'
                ? 'bg-green-600 text-white'
                : 'bg-white/80 dark:bg-gray-900/80 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            Açıq ({tasks.filter(t => t.status === 'open').length})
          </button>
          <button
            onClick={() => setFilter('assigned')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === 'assigned'
                ? 'bg-blue-600 text-white'
                : 'bg-white/80 dark:bg-gray-900/80 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            Təyin edilib ({tasks.filter(t => t.status === 'assigned').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === 'completed'
                ? 'bg-gray-600 text-white'
                : 'bg-white/80 dark:bg-gray-900/80 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            Tamamlandı ({tasks.filter(t => t.status === 'completed').length})
          </button>
        </div>

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-16 rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 relative">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-500 opacity-20 blur-xl" />
              <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-500 p-[1px]">
                <div className="w-full h-full rounded-3xl bg-white dark:bg-gray-900 flex items-center justify-center">
                  <Briefcase className="w-8 h-8 text-gray-900 dark:text-white" />
                </div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {filter === 'all' ? 'Hələ tapşırıq yoxdur' : `${filter === 'open' ? 'Açıq' : filter === 'assigned' ? 'Təyin edilmiş' : 'Tamamlanmış'} tapşırıq yoxdur`}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filter === 'all' ? 'İlk tapşırığınızı yaradın' : 'Bu filtrdə tapşırıq yoxdur'}
            </p>
            {filter === 'all' && (
              <Link
                href={`/${locale}/tasks/create`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                Yeni Tapşırıq Yarat
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-3xl p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <Link href={`/${locale}/tasks/${task.slug}`}>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {task.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                      {stripHtml(task.description)}
                    </p>
                  </div>
                  <div className="ml-4 flex items-center gap-2">
                    <TaskStatusBadge task={task} />
                    <Link
                      href={`/${locale}/tasks/${task.slug}/edit`}
                      className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                      title="Redaktə et"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Wallet className="w-4 h-4" />
                    <span className="font-semibold">{task.budget_amount} AZN</span>
                    {task.budget_type === 'hourly' && <span className="text-xs">(saatlıq)</span>}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>{task.applications_count || 0} müraciət</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(task.created_at).toLocaleDateString('az-AZ')}</span>
                  </div>

                  {task.category && (
                    <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-medium">
                      {task.category.name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      )}
    </DashboardLayout>
  );
}
