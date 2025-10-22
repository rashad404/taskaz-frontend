'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Filter, X } from 'lucide-react';
import SearchDropdown from '@/components/search/SearchDropdown';
import type { Category, TaskFilters as TaskFiltersType } from '@/lib/types/marketplace';

interface City {
  id: number;
  name_az: string;
  name_en: string;
  name_ru: string;
  has_neighborhoods: boolean;
  sort_order: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://100.89.150.50:8000/api';

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
  const [cities, setCities] = useState<City[]>([]);

  // Fetch cities on mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(`${API_URL}/cities`);
        const data = await response.json();
        if (data.status === 'success') {
          setCities(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch cities:', error);
      }
    };
    fetchCities();
  }, []);

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

  const handleCityChange = (cityId: string) => {
    if (cityId === '') {
      onFilterChange({ city_id: undefined });
    } else {
      onFilterChange({ city_id: parseInt(cityId) });
    }
  };

  const clearFilters = () => {
    onFilterChange({
      category_id: undefined,
      budget_type: undefined,
      is_remote: undefined,
      city_id: undefined,
      location: undefined,
    });
  };

  const hasActiveFilters =
    currentFilters.category_id ||
    currentFilters.budget_type ||
    currentFilters.is_remote !== undefined ||
    currentFilters.city_id ||
    currentFilters.location;

  const getCityName = (city: City) => {
    const nameKey = `name_${locale}` as keyof City;
    return city[nameKey] || city.name_az;
  };

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {locale === 'az' ? 'Şəhər' : locale === 'en' ? 'City' : 'Город'}
              </label>
              <select
                value={currentFilters.city_id || ''}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full px-4 py-2 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">{locale === 'az' ? 'Bütün şəhərlər' : locale === 'en' ? 'All cities' : 'Все города'}</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {getCityName(city)}
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
