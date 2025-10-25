'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import SearchDropdown from '@/components/search/SearchDropdown';

interface HeroSectionProps {
  locale: string;
}

export default function HeroSection({ locale }: HeroSectionProps) {
  const t = useTranslations('home');
  const router = useRouter();

  // Get promo messages from translations
  const promoMessages = t.raw('hero.promoMessages') as string[];
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Rotate promo messages every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentPromoIndex((prev) => (prev + 1) % promoMessages.length);
        setIsAnimating(false);
      }, 300); // Animation duration
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [promoMessages.length]);

  return (
    <section className="relative overflow-hidden px-6 py-20 md:py-32">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 -z-10 mesh-gradient opacity-30 dark:opacity-20" />

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          {/* Main Headline with Gradient */}
          <h1 className="text-5xl md:text-7xl font-bold mb-8">
            <span className="gradient-text">
              {t('hero.title')}
            </span>
          </h1>

          {/* Rotating Promotional Messages */}
          <div className="relative h-24 md:h-28 mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`transition-all duration-300 ${
                  isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
                }`}
              >
                <p className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                  {promoMessages[currentPromoIndex]}
                </p>
                <p className="text-lg md:text-xl text-indigo-600 dark:text-indigo-400 font-medium">
                  {t('hero.promoSubtext')}
                </p>
              </div>
            </div>
          </div>

          {/* Slider Dots Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {promoMessages.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAnimating(true);
                  setTimeout(() => {
                    setCurrentPromoIndex(index);
                    setIsAnimating(false);
                  }, 300);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentPromoIndex
                    ? 'w-8 bg-indigo-600 dark:bg-indigo-400'
                    : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                aria-label={`Go to promo message ${index + 1}`}
              />
            ))}
          </div>
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
