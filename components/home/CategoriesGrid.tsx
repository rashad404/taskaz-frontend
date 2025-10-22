'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
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
        const allCategories = await categoriesApi.getAll();
        // Filter to show only parent categories and add their children
        const parentCategories = allCategories
          .filter((cat: any) => !cat.parent_id)
          .map((parent: any) => ({
            ...parent,
            children: allCategories.filter((cat: any) => cat.parent_id === parent.id)
          }));
        // Show only first 9 categories on homepage
        setCategories(parentCategories.slice(0, 9));
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

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {categories.map((category: any, index: number) => (
            <CategoryCard
              key={category.id}
              category={category}
              gradient={categoryGradients[index % categoryGradients.length]}
              locale={locale}
            />
          ))}
        </div>

        {/* View All Categories Button */}
        <div className="text-center">
          <Link
            href={`/${locale}/categories`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span>Bütün Kateqoriyaları Gör</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
