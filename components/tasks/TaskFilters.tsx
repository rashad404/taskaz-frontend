'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Filter, X } from 'lucide-react';
import SearchDropdown from '@/components/search/SearchDropdown';
import type { Category, TaskFilters as TaskFiltersType } from '@/lib/types/marketplace';

interface TaskFiltersProps {
  categories: Category[];
  currentFilters: TaskFiltersType;
  onFilterChange: (filters: Partial<TaskFiltersType>) => void;
  locale: string;
}

export default function TaskFilters({
  categories,
  currentFilters,
  onFilterChange,
  locale,
}: TaskFiltersProps) {
  const t = useTranslations('tasks');
  const [showFilters, setShowFilters] = useState(false);

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === '') {
      onFilterChange({ category_id: undefined });
    } else {
      onFilterChange({ category_id: parseInt(categoryId) });
    }
  };

  const handleBudgetTypeChange = (budgetType: string) => {
    if (budgetType === '') {
      onFilterChange({ budget_type: undefined });
    } else {
      onFilterChange({ budget_type: budgetType as 'fixed' | 'hourly' });
    }
  };

  const handleRemoteChange = (value: string) => {
    if (value === '') {
      onFilterChange({ is_remote: undefined });
    } else {
      onFilterChange({ is_remote: value === 'true' });
    }
  };

  const clearFilters = () => {
    onFilterChange({
      category_id: undefined,
      budget_type: undefined,
      is_remote: undefined,
      location: undefined,
    });
  };

  const hasActiveFilters =
    currentFilters.category_id ||
    currentFilters.budget_type ||
    currentFilters.is_remote !== undefined ||
    currentFilters.location;

  return (
    <div className="mb-8">
      {/* Search Bar */}
      <div className="mb-4 flex gap-3">
        <div className="flex-1">
          <SearchDropdown
            locale={locale}
            placeholder={t('searchPlaceholder')}
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-6 py-4 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition-colors whitespace-nowrap"
        >
          <Filter className="w-4 h-4" />
          <span>{t('filters')}</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="rounded-3xl p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 mb-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {t('filters')}
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 hover:underline"
              >
                <X className="w-4 h-4" />
                {t('clearAll')}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('category')}
              </label>
              <select
                value={currentFilters.category_id || ''}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-2 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">{t('allCategories')}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('budgetType')}
              </label>
              <select
                value={currentFilters.budget_type || ''}
                onChange={(e) => handleBudgetTypeChange(e.target.value)}
                className="w-full px-4 py-2 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">{t('allTypes')}</option>
                <option value="fixed">{t('fixedPrice')}</option>
                <option value="hourly">{t('hourlyRate')}</option>
              </select>
            </div>

            {/* Remote Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('location')}
              </label>
              <select
                value={
                  currentFilters.is_remote === undefined
                    ? ''
                    : currentFilters.is_remote
                    ? 'true'
                    : 'false'
                }
                onChange={(e) => handleRemoteChange(e.target.value)}
                className="w-full px-4 py-2 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">{t('allLocations')}</option>
                <option value="true">{t('remoteOnly')}</option>
                <option value="false">{t('onsiteOnly')}</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
