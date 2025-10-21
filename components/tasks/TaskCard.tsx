'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { MapPin, Clock, DollarSign, Eye, Calendar } from 'lucide-react';
import type { Task } from '@/lib/types/marketplace';
import { formatDistanceToNow } from 'date-fns';
import { az, enUS, ru } from 'date-fns/locale';

interface TaskCardProps {
  task: Task;
  locale: string;
}

export default function TaskCard({ task, locale }: TaskCardProps) {
  const t = useTranslations('tasks');

  // Map locale to date-fns locale
  const dateLocale = locale === 'en' ? enUS : locale === 'ru' ? ru : az;

  const formatBudget = () => {
    if (!task.budget_amount) return t('budgetNotSpecified');
    const amount = parseFloat(task.budget_amount);
    return task.budget_type === 'hourly'
      ? `${amount} ${t('aznPerHour')}`
      : `${amount} ${t('azn')}`;
  };

  const getTimeAgo = () => {
    try {
      return formatDistanceToNow(new Date(task.created_at), {
        addSuffix: true,
        locale: dateLocale
      });
    } catch {
      return t('recently');
    }
  };

  return (
    <Link href={`/${locale}/tasks/${task.slug}`}>
      <div className="group relative h-full cursor-pointer">
        {/* Glass Card */}
        <div className="h-full rounded-3xl p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-xl">
          {/* Status Badge */}
          <div className="flex items-center justify-between mb-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                task.status === 'open'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : task.status === 'assigned'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
              }`}
            >
              {t(`status.${task.status}`)}
            </span>

            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Eye className="w-3 h-3" />
              <span>{task.views_count}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {task.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {task.description}
          </p>

          {/* Meta Info */}
          <div className="space-y-2 mb-4">
            {/* Budget */}
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="font-medium">{formatBudget()}</span>
            </div>

            {/* Location */}
            {(task.location || task.is_remote) && (
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{task.is_remote ? t('remote') : task.location}</span>
              </div>
            )}

            {/* Deadline */}
            {task.deadline && (
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span>
                  {t('due')}{' '}
                  {formatDistanceToNow(new Date(task.deadline), {
                    addSuffix: true,
                    locale: dateLocale
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            {/* Posted time */}
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{getTimeAgo()}</span>
            </div>

            {/* Category */}
            {task.category && (
              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                {task.category.name}
              </span>
            )}
          </div>
        </div>

        {/* Shine effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000" />
        </div>
      </div>
    </Link>
  );
}
