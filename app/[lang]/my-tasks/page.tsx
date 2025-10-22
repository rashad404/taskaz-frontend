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
    const token = localStorage.getItem('token');

    if (!token) {
      router.push(`/${locale}/login`);
      return;
    }

    // Fetch my tasks
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/my-tasks`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
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

  const getStatusBadge = (status: string) => {
    const badges = {
      open: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-300', label: 'Açıq' },
      assigned: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-300', label: 'Təyin edilib' },
      completed: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-300', label: 'Tamamlandı' },
      cancelled: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-300', label: 'Ləğv edildi' }
    };
    const badge = badges[status as keyof typeof badges] || badges.open;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6">
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
              <Link
                key={task.id}
                href={`/${locale}/tasks/${task.slug}`}
                className="rounded-3xl p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {task.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                      {stripHtml(task.description)}
                    </p>
                  </div>
                  <div className="ml-4">
                    {getStatusBadge(task.status)}
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
