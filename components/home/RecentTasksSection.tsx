'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { tasksApi } from '@/lib/api/marketplace';
import type { Task } from '@/lib/types/marketplace';
import TaskCard from '../tasks/TaskCard';
import { Loader2, ArrowRight } from 'lucide-react';

interface RecentTasksSectionProps {
  locale: string;
}

export default function RecentTasksSection({ locale }: RecentTasksSectionProps) {
  const t = useTranslations('home.recentTasks');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await tasksApi.getAll({
          per_page: 9,
          status: 'open' as any,
          sort_by: 'created_at',
          sort_order: 'desc',
        });
        setTasks(data.data);
      } catch (error) {
        console.error('Failed to fetch recent tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16 relative">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">{t('title')}</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="rounded-3xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 p-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {t('noTasks')}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} locale={locale} />
              ))}
            </div>

            {/* View All Button */}
            <div className="flex justify-center mt-12">
              <Link href={`/${locale}/tasks`}>
                <button className="group flex items-center gap-2 px-8 py-4 rounded-2xl font-medium text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 hover:shadow-lg hover:scale-105">
                  <span>{t('viewAll')}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
