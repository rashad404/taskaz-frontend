'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Filter, X } from 'lucide-react';
import SearchDropdown from '@/components/search/SearchDropdown';

export interface FreelancerFilters {
  location?: string;
  min_rating?: number;
  search?: string;
  sort_by?: 'rating' | 'completed_contracts' | 'created_at';
  sort_order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

interface FreelancersFiltersProps {
  currentFilters: FreelancerFilters;
  onFilterChange: (filters: Partial<FreelancerFilters>) => void;
  locale: string;
}

export default function FreelancersFilters({
  currentFilters,
  onFilterChange,
  locale,
}: FreelancersFiltersProps) {
  const t = useTranslations('freelancers');
  const [showFilters, setShowFilters] = useState(false);

  const handleLocationChange = (location: string) => {
    if (location === '') {
      onFilterChange({ location: undefined });
    } else {
      onFilterChange({ location });
    }
  };

  const handleRatingChange = (rating: string) => {
    if (rating === '') {
      onFilterChange({ min_rating: undefined });
    } else {
      onFilterChange({ min_rating: parseFloat(rating) });
    }
  };

  const handleSortChange = (sortBy: string) => {
    if (sortBy === '') {
      onFilterChange({ sort_by: undefined });
    } else {
      onFilterChange({ sort_by: sortBy as any });
    }
  };

  const clearFilters = () => {
    onFilterChange({
      location: undefined,
      min_rating: undefined,
      sort_by: undefined,
    });
  };

  const hasActiveFilters =
    currentFilters.location ||
    currentFilters.min_rating ||
    currentFilters.sort_by;

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
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('location')}
              </label>
              <input
                type="text"
                value={currentFilters.location || ''}
                onChange={(e) => handleLocationChange(e.target.value)}
                placeholder={t('locationPlaceholder')}
                className="w-full px-4 py-2 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Min Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('minRating')}
              </label>
              <select
                value={currentFilters.min_rating || ''}
                onChange={(e) => handleRatingChange(e.target.value)}
                className="w-full px-4 py-2 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">{t('allRatings')}</option>
                <option value="4.5">4.5+ ⭐</option>
                <option value="4.0">4.0+ ⭐</option>
                <option value="3.5">3.5+ ⭐</option>
                <option value="3.0">3.0+ ⭐</option>
              </select>
            </div>

            {/* Sort By Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('sortBy')}
              </label>
              <select
                value={currentFilters.sort_by || ''}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-4 py-2 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">{t('defaultSort')}</option>
                <option value="rating">{t('topRated')}</option>
                <option value="completed_contracts">{t('mostExperienced')}</option>
                <option value="created_at">{t('newest')}</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
