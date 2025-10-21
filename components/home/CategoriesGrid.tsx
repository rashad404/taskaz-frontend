'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { categoriesApi } from '@/lib/api/marketplace';
import CategoryCard from './CategoryCard';

interface CategoriesGridProps {
  locale: string;
}

export default function CategoriesGrid({ locale }: CategoriesGridProps) {
  const t = useTranslations('home.categories');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.getAll();
        // Filter to show only parent categories
        const parentCategories = data.filter((cat: any) => !cat.parent_id);
        setCategories(parentCategories);
      } catch (err: any) {
        setError(err);
        console.error('Failed to fetch categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Category gradient map for visual diversity
  const categoryGradients = [
    'from-orange-500 to-yellow-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-purple-500 to-pink-500',
    'from-indigo-500 to-purple-500',
    'from-sky-500 to-blue-500',
    'from-rose-500 to-pink-500',
    'from-teal-500 to-cyan-500',
  ];

  if (loading) {
    return (
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">{t('title')}</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t('subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-3xl h-64 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center p-12 rounded-3xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400">
              Kateqoriyaları yükləmək mümkün olmadı. Zəhmət olmasa yenidən cəhd edin.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center p-12 rounded-3xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">
              Hələ kateqoriya mövcud deyil.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-16 relative">
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

      {/* Categories Grid with Scroll */}
      <div className="max-w-7xl mx-auto">
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:snap-none scrollbar-hide pb-4">
          {categories.map((category: any, index: number) => (
            <div
              key={category.id}
              className="min-w-[280px] md:min-w-0 snap-start flex-shrink-0"
            >
              <CategoryCard
                category={category}
                gradient={categoryGradients[index % categoryGradients.length]}
                locale={locale}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
