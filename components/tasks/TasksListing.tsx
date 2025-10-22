'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { tasksApi, categoriesApi } from '@/lib/api/marketplace';
import type { Task, Category, TaskFilters } from '@/lib/types/marketplace';
import TaskCard from './TaskCard';
import TaskFilters from './TaskFilters';
import { Loader2 } from 'lucide-react';

interface TasksListingProps {
  locale: string;
  initialFilters?: { [key: string]: string | string[] | undefined };
}

export default function TasksListing({ locale, initialFilters }: TasksListingProps) {
  const t = useTranslations('tasks');
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });

  // Build filters from URL params
  const buildFilters = (): TaskFilters => {
    const filters: TaskFilters = {
      page: parseInt(searchParams?.get('page') || '1'),
      per_page: 20,
    };

    if (searchParams?.get('category_id')) {
      filters.category_id = parseInt(searchParams.get('category_id')!);
    }
    if (searchParams?.get('budget_type')) {
      filters.budget_type = searchParams.get('budget_type') as 'fixed' | 'hourly';
    }
    if (searchParams?.get('is_remote')) {
      filters.is_remote = searchParams.get('is_remote') === 'true';
    }
    if (searchParams?.get('city_id')) {
      filters.city_id = parseInt(searchParams.get('city_id')!);
    }
    if (searchParams?.get('location')) {
      filters.location = searchParams.get('location')!;
    }
    if (searchParams?.get('search')) {
      filters.search = searchParams.get('search')!;
    }
    if (searchParams?.get('sort_by')) {
      filters.sort_by = searchParams.get('sort_by') as any;
    }
    if (searchParams?.get('sort_order')) {
      filters.sort_order = searchParams.get('sort_order') as 'asc' | 'desc';
    }

    return filters;
  };

  // Fetch tasks and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [tasksData, categoriesData] = await Promise.all([
          tasksApi.getAll(buildFilters()),
          categoriesApi.getAll(),
        ]);

        setTasks(tasksData.data);
        setPagination({
          current_page: tasksData.current_page,
          last_page: tasksData.last_page,
          per_page: tasksData.per_page,
          total: tasksData.total,
        });
        setCategories(categoriesData);
      } catch (err: any) {
        console.error('Failed to fetch tasks:', err);
        setError(err.response?.data?.message || 'Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  const handleFilterChange = (newFilters: Partial<TaskFilters>) => {
    const current = buildFilters();
    const updated = { ...current, ...newFilters, page: 1 }; // Reset to page 1 on filter change

    // Build query string
    const params = new URLSearchParams();
    Object.entries(updated).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value));
      }
    });

    router.push(`/${locale}/tasks?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const current = buildFilters();
    const updated = { ...current, page };

    const params = new URLSearchParams();
    Object.entries(updated).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value));
      }
    });

    router.push(`/${locale}/tasks?${params.toString()}`);
  };

  if (error) {
    return (
      <div className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center p-12 rounded-3xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 rounded-2xl bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              {t('tryAgain')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="gradient-text">{t('title')}</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {pagination.total} {t('tasksAvailable')}
          </p>
        </div>

        {/* Filters */}
        <TaskFilters
          categories={categories}
          currentFilters={buildFilters()}
          onFilterChange={handleFilterChange}
          locale={locale}
        />

        {/* Task Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20">
            <div className="rounded-3xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 p-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {t('noTasksFound')}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} locale={locale} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.last_page > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                  className="px-4 py-2 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                >
                  {t('previous')}
                </button>

                <span className="px-4 py-2 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/20">
                  {t('page')} {pagination.current_page} {t('of')} {pagination.last_page}
                </span>

                <button
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                  className="px-4 py-2 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                >
                  {t('next')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
