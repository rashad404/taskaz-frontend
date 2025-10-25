'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Code, Wrench, Car, Home, Terminal, Palette, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import SearchDropdown from '@/components/search/SearchDropdown';

interface HeroSectionProps {
  locale: string;
}

interface PromoSlide {
  message: string;
  subtext: string;
  icon: string;
}

const iconMap = {
  code: Code,
  wrench: Wrench,
  car: Car,
  home: Home,
  terminal: Terminal,
  palette: Palette,
  book: BookOpen,
};

export default function HeroSection({ locale }: HeroSectionProps) {
  const t = useTranslations('home');
  const router = useRouter();

  const promoSlides = t.raw('hero.promoSlides') as PromoSlide[];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const slideInterval = useRef<NodeJS.Timeout | null>(null);

  const SLIDE_DURATION = 7000; // 7 seconds
  const ANIMATION_DURATION = 500; // 500ms for slide transition

  // Progress bar animation
  useEffect(() => {
    if (isPaused) {
      if (progressInterval.current) clearInterval(progressInterval.current);
      return;
    }

    setProgress(0);
    const increment = 100 / (SLIDE_DURATION / 50); // Update every 50ms

    progressInterval.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + increment;
      });
    }, 50);

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [currentSlide, isPaused]);

  // Auto-advance slides
  useEffect(() => {
    if (isPaused) {
      if (slideInterval.current) clearInterval(slideInterval.current);
      return;
    }

    slideInterval.current = setInterval(() => {
      handleNext();
    }, SLIDE_DURATION);

    return () => {
      if (slideInterval.current) clearInterval(slideInterval.current);
    };
  }, [currentSlide, isPaused]);

  const handleNext = () => {
    if (isAnimating) return;
    setDirection('next');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % promoSlides.length);
      setIsAnimating(false);
    }, ANIMATION_DURATION);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setDirection('prev');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + promoSlides.length) % promoSlides.length);
      setIsAnimating(false);
    }, ANIMATION_DURATION);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setDirection(index > currentSlide ? 'next' : 'prev');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsAnimating(false);
    }, ANIMATION_DURATION);
  };

  // Touch/Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeThreshold = 50;
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const currentSlideData = promoSlides[currentSlide];
  const Icon = iconMap[currentSlideData.icon as keyof typeof iconMap] || Code;

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
          <h1 className="text-5xl md:text-7xl font-bold mb-12">
            <span className="gradient-text">
              {t('hero.title')}
            </span>
          </h1>

          {/* Card-based Promo Slider */}
          <div
            className="relative mb-8 max-w-4xl mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Slider Container */}
            <div className="relative h-56 md:h-48 overflow-hidden">
              {/* Glass Card */}
              <div
                className={`absolute inset-0 transition-all duration-500 ${
                  isAnimating
                    ? direction === 'next'
                      ? 'translate-x-full opacity-0'
                      : '-translate-x-full opacity-0'
                    : 'translate-x-0 opacity-100'
                }`}
              >
                <div className="relative h-full rounded-3xl p-8 md:p-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-2 border-white/30 dark:border-gray-700/30 shadow-2xl">
                  {/* Gradient Border Effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-50 pointer-events-none" />

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col md:flex-row items-center gap-6">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                        <Icon className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={2} />
                      </div>
                    </div>

                    {/* Text Content */}
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                        {currentSlideData.message}
                      </h2>
                      <p className="text-lg md:text-xl text-indigo-600 dark:text-indigo-400 font-medium">
                        {currentSlideData.subtext}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows - Hidden on mobile */}
            <button
              onClick={handlePrev}
              disabled={isAnimating}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 w-12 h-12 items-center justify-center rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 shadow-lg hover:bg-white dark:hover:bg-gray-900 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
            </button>
            <button
              onClick={handleNext}
              disabled={isAnimating}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 w-12 h-12 items-center justify-center rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 shadow-lg hover:bg-white dark:hover:bg-gray-900 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-gray-900 dark:text-white" />
            </button>
          </div>

          {/* Progress Bar and Indicators */}
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="relative h-1 bg-gray-200 dark:bg-gray-800 rounded-full mb-4 overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Dot Indicators */}
            <div className="flex items-center justify-center gap-2">
              {promoSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  disabled={isAnimating}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'w-8 bg-indigo-600 dark:bg-indigo-400'
                      : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  } disabled:cursor-not-allowed`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
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
