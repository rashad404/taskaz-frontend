'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import SearchDropdown from '@/components/search/SearchDropdown';

interface HeroSectionProps {
  locale: string;
}

export default function HeroSection({ locale }: HeroSectionProps) {
  const t = useTranslations('home');
  const router = useRouter();

  return (
    <section className="relative overflow-hidden px-6 py-20 md:py-32">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 -z-10 mesh-gradient opacity-30 dark:opacity-20" />

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">
              {t('hero.title')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-4">
            {t('hero.subtitle')}
          </p>

          <p className="text-base text-gray-500 dark:text-gray-400">
            {t('hero.description')}
          </p>
        </div>

        {/* Search Input */}
        <div className="max-w-3xl mx-auto relative z-50">
          <SearchDropdown
            locale={locale}
            placeholder={t('hero.searchPlaceholder')}
          />

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <button
              onClick={() => router.push(`/${locale}/tasks/create`)}
              className="btn-primary w-full sm:w-auto cursor-pointer"
            >
              {t('hero.postTask')}
            </button>
            <button
              onClick={() => router.push(`/${locale}/tasks`)}
              className="btn-secondary w-full sm:w-auto cursor-pointer"
            >
              {t('hero.browseTasks')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
