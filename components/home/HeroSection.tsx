'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useSearch } from '@/lib/hooks/useSearch';
import SearchResultItem from '@/components/search/SearchResultItem';

interface HeroSectionProps {
  locale: string;
}

export default function HeroSection({ locale }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [previousSlide, setPreviousSlide] = useState(0);
  const [underlineWidth, setUnderlineWidth] = useState(372);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);

  const {
    query,
    setQuery,
    results,
    loading,
    error,
    saveToRecent,
  } = useSearch();

  const slides = [
    {
      image: '/assets/images/worker.png',
      lines: [
        { text: 'Evə təmir üçün', gradient: false },
        { text: 'usta lazımdırsa', gradient: true },
        { text: 'buna görə narahat olma', gradient: false },
      ]
    },
    {
      image: '/images/hero/copywriter.png',
      lines: [
        { text: 'Copywriter', gradient: false },
        { text: 'axtarırsan?', gradient: true },
        { text: 'mütəxəssislərdən', gradient: false },
        { text: 'seçim et', gradient: false },
      ]
    },
    {
      image: '/images/hero/home.png',
      lines: [
        { text: 'Evinin təmiri üçün', gradient: false },
        { text: 'usta axtarırsan?', gradient: true },
        { text: 'ustalardan', gradient: false },
        { text: 'seçim et', gradient: false },
      ]
    },
    {
      image: '/images/hero/automobile.png',
      lines: [
        { text: 'Avtomobilin', gradient: false },
        { text: 'xarab olub?', gradient: true },
        { text: 'yolda qalmısan?', gradient: false },
      ]
    },
    {
      image: '/images/hero/teacher.png',
      lines: [
        { text: 'İngilis dili dərsi', gradient: false },
        { text: 'təşkil etmək', gradient: true },
        { text: 'istəyirsən?', gradient: false },
      ]
    },
    {
      image: '/images/hero/developer.png',
      lines: [
        { text: 'Proqramçı', gradient: false },
        { text: 'axtarırsan?', gradient: true },
        { text: 'mütəxəssislərdən', gradient: false },
        { text: 'seçim et', gradient: false },
      ]
    },
    {
      image: '/images/hero/designer.png',
      lines: [
        { text: 'Dizayner', gradient: false },
        { text: 'axtarırsan?', gradient: true },
        { text: 'kreativ dizayner', gradient: false },
        { text: 'tap', gradient: false },
      ]
    },
  ];

  // Preload all slide images on mount
  useEffect(() => {
    slides.forEach((slide) => {
      const img = new window.Image();
      img.src = slide.image;
    });
  }, []);

  // Auto-rotate every 3 seconds with crossfade transition
  useEffect(() => {
    const interval = setInterval(() => {
      setPreviousSlide(currentSlide);
      setIsTransitioning(true);

      // Change slide immediately and let CSS handle the crossfade
      setCurrentSlide((prev) => (prev + 1) % slides.length);

      // Reset transition state after animation completes
      setTimeout(() => {
        setIsTransitioning(false);
      }, 400); // 400ms to allow transition to complete
    }, 3000);
    return () => clearInterval(interval);
  }, [currentSlide, slides.length]);

  // Update underline width when text changes
  useEffect(() => {
    if (textRef.current) {
      const width = textRef.current.offsetWidth;
      setUnderlineWidth(width + 20); // Add some padding
    }
  }, [currentSlide, slides]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate dropdown position
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  const updateDropdownPosition = useCallback(() => {
    if (searchInputRef.current && isSearchOpen) {
      const rect = searchInputRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: `${rect.bottom + 8}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
      });
    }
  }, [isSearchOpen]);

  useEffect(() => {
    updateDropdownPosition();
  }, [isSearchOpen, query, updateDropdownPosition]);

  // Update position on scroll and resize
  useEffect(() => {
    if (!isSearchOpen) return;

    window.addEventListener('scroll', updateDropdownPosition, true);
    window.addEventListener('resize', updateDropdownPosition);

    return () => {
      window.removeEventListener('scroll', updateDropdownPosition, true);
      window.removeEventListener('resize', updateDropdownPosition);
    };
  }, [isSearchOpen, updateDropdownPosition]);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setIsSearchOpen(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveToRecent(query);
      window.location.href = `/${locale}/search?q=${encodeURIComponent(query)}`;
    }
  };

  const handleResultClick = (type: string, item: any) => {
    saveToRecent(query);
    setIsSearchOpen(false);
    setQuery('');
  };

  const showResults = isSearchOpen && query.length >= 2;
  const hasResults = results && (results.tasks.length > 0 || results.professionals.length > 0 || results.categories.length > 0);

  // Helper function to render a slide
  const renderSlide = (slideIndex: number, isCurrent: boolean) => {
    const slide = slides[slideIndex];
    const opacity = isCurrent ? (isTransitioning ? 'opacity-0' : 'opacity-100') : (isTransitioning ? 'opacity-100' : 'opacity-0');

    return (
      <div key={`slide-${slideIndex}-${isCurrent ? 'current' : 'previous'}`} className="absolute inset-0">
        {/* Hero Image */}
        <div className="absolute right-0 md:right-[8%] lg:right-[12%] xl:right-[308px] top-[30px] md:top-[122px] w-[200px] md:w-[250px] lg:w-[302px] h-[200px] md:h-[250px] lg:h-[302px] z-0">
          <div className="relative w-full h-full">
            <Image
              src={slide.image}
              alt="Professional"
              width={302}
              height={302}
              className={`block max-w-none w-full h-full object-cover object-center transition-opacity duration-400 ${opacity}`}
              priority={slideIndex === 0}
            />
          </div>
        </div>

        {/* Text Elements */}
        {slide.lines.map((line, index) => {
          const isGradientLine = line.gradient;

          return (
            <div key={`text-${index}`}>
              {isGradientLine ? (
                <>
                  <p
                    ref={isCurrent && isGradientLine ? textRef : null}
                    className={`absolute left-0 md:left-[20%] lg:left-[22%] xl:left-[308px] top-[65px] md:top-[211px] font-bold text-[24px] md:text-[40px] lg:text-[48px] leading-[32px] md:leading-[52px] lg:leading-[54px] bg-clip-text max-w-[calc(100%-20px)] z-10 transition-opacity duration-400 ${opacity}`}
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      backgroundImage: 'linear-gradient(90deg, #14b8a6 0%, #06b6d4 30%, #8b5cf6 50%, #ec4899 60%, #ec4899 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    {line.text}
                  </p>
                  <div
                    className={`absolute left-0 md:left-[20%] lg:left-[22%] xl:left-[308px] top-[118px] md:top-[265px] h-[10px] md:h-[18px] flex items-center justify-start transition-opacity duration-400 z-10 ${opacity}`}
                    style={{ width: `${isCurrent ? underlineWidth : 372}px` }}
                  >
                    <div className="flex-none w-full" style={{ transform: 'rotate(358.703deg)' }}>
                      <Image
                        src="/assets/images/gradient-underline.svg"
                        alt=""
                        width={isCurrent ? underlineWidth : 372}
                        height={18}
                        className="block w-full h-auto"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div
                  className={`absolute left-0 md:left-[20%] lg:left-[22%] xl:left-[308px] ${
                    index === 0 ? 'top-[30px] md:top-[149px]' :
                    index === 2 ? 'top-[145px] md:top-[273px]' :
                    index === 3 ? 'top-[180px] md:top-[335px]' :
                    'top-[145px] md:top-[273px]'
                  } w-[calc(100%-200px)] md:w-auto font-bold text-[24px] md:text-[40px] lg:text-[48px] leading-[32px] md:leading-[52px] lg:leading-[62px] text-black dark:text-white z-10 transition-opacity duration-400 ${opacity}`}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {line.text}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className="relative bg-[#f5f8ff] dark:bg-gray-900 h-[420px] md:h-[700px] overflow-hidden z-10">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-0 max-w-[1440px] h-full relative">
        {/* Background Ellipse 4 - Purple gradient */}
        <div className="absolute left-[-15%] top-[137px] w-[491px] h-[492px] hidden md:block">
          <Image
            src="/assets/images/ellipse-purple.svg"
            alt=""
            width={491}
            height={492}
            className="block max-w-none w-full h-full"
          />
        </div>

        {/* Background Ellipse 5 - Blue gradient */}
        <div className="absolute right-[-300px] md:right-[-10%] top-[50px] md:top-[137px] w-[500px] md:w-[656px] h-[500px] md:h-[656px] opacity-20 md:opacity-100">
          <Image
            src="/assets/images/ellipse-blue.svg"
            alt=""
            width={656}
            height={656}
            className="block max-w-none w-full h-full"
          />
        </div>

        {/* Content Container */}
        <div className="relative h-full">
          {/* Render previous slide (fading out) */}
          {isTransitioning && previousSlide !== currentSlide && renderSlide(previousSlide, false)}

          {/* Render current slide (fading in) */}
          {renderSlide(currentSlide, true)}

          {/* Static Info Cards - remain visible during transitions */}
          <div className="absolute right-0 md:right-[8%] lg:right-[12%] xl:right-[308px] top-[30px] md:top-[122px] w-[200px] md:w-[250px] lg:w-[302px] h-[200px] md:h-[250px] lg:h-[302px] z-20 pointer-events-none">

            {/* Mesaj göndər Card - positioned relative to worker image */}
            <div className="hidden lg:block absolute left-[179px] top-[102px] w-[234px]">
              {/* White background with backdrop blur */}
              <div className="absolute left-0 top-0 w-[234px] h-[58px] bg-[rgba(255,255,255,0.8)] backdrop-blur-[10px] rounded-[100px]" style={{ backdropFilter: 'blur(10px)' }} />

              {/* Text content */}
              <p
                className="absolute left-[57px] top-[11px] w-[107px] h-[17px] font-semibold text-[14px] leading-[20px] text-[#383838] dark:text-white whitespace-nowrap"
                style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.28px' }}
              >
                Mesaj göndər
              </p>
              <p
                className="absolute left-[57px] top-[28px] font-normal text-[12px] leading-[16px] text-[#545567] dark:text-gray-400 whitespace-nowrap"
                style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.24px' }}
              >
                Qarşılıqlı rahat mesajlaşma
              </p>

              {/* Orange circle with icon */}
              <div
                className="absolute left-[10.88px] top-[9.88px] w-[38.231px] h-[38.231px] bg-[#f88c3d] rounded-[100px]"
                style={{ boxShadow: '0px 0px 12px 0px #f88c3d' }}
              />

              {/* Email icon */}
              <div className="absolute left-[20.9px] top-[19.9px] w-[18.205px] h-[18.205px]">
                <Image
                  src="/assets/images/email-icon.svg"
                  alt=""
                  width={18}
                  height={18}
                  className="block max-w-none w-full h-full"
                />
              </div>
            </div>

            {/* Vaxt dəqiqliyi Card - positioned relative to worker image */}
            <div className="hidden lg:block absolute left-[-57px] top-[207px] w-[185px]">
              {/* White background with backdrop blur */}
              <div className="absolute left-0 top-0 w-[185px] h-[58px] bg-[rgba(255,255,255,0.8)] backdrop-blur-[10px] rounded-[100px]" style={{ backdropFilter: 'blur(10px)' }} />

              {/* Text content */}
              <p
                className="absolute left-[57px] top-[9px] font-semibold text-[14px] leading-[20px] text-[#383838] dark:text-white whitespace-nowrap"
                style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.28px' }}
              >
                Vaxt dəqiqliyi
              </p>
              <p
                className="absolute left-[57px] top-[29px] font-normal text-[12px] leading-[16px] text-[#545567] dark:text-gray-400 whitespace-nowrap"
                style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.24px' }}
              >
                Rahatlıqla təyin et
              </p>

              {/* Blue circle */}
              <div className="absolute left-[10px] top-[8px] w-[42px] h-[42px] bg-[#23bdee] rounded-[100px]" />

              {/* Calendar icon */}
              <div className="absolute left-[21px] top-[19px] w-[20px] h-[20px]">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="4" width="14" height="13" rx="2" stroke="white" strokeWidth="1.5" fill="none"/>
                  <path d="M7 2V6M13 2V6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M3 8H17" stroke="white" strokeWidth="1.5"/>
                  <circle cx="7" cy="11" r="0.5" fill="white"/>
                  <circle cx="10" cy="11" r="0.5" fill="white"/>
                  <circle cx="13" cy="11" r="0.5" fill="white"/>
                  <circle cx="7" cy="14" r="0.5" fill="white"/>
                  <circle cx="10" cy="14" r="0.5" fill="white"/>
                  <circle cx="13" cy="14" r="0.5" fill="white"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search Box with Dropdown */}
        <div ref={searchDropdownRef} className="absolute left-0 right-0 md:left-[12%] md:right-[12%] lg:left-[17%] lg:right-[17%] xl:left-[250px] xl:right-auto xl:w-[940px] top-[225px] md:top-[420px] mx-8 md:mx-0">
          <form onSubmit={handleSearch}>
            <div className="bg-white dark:bg-gray-800 border-[1.5px] border-solid border-[#d1d5db] dark:border-gray-700 rounded-[40px] md:rounded-[64px] flex items-center justify-between px-[20px] md:px-[32px] py-[14px] md:py-[24px]" style={{ boxShadow: '0px 4px 20px 0px rgba(0, 0, 0, 0.08)' }}>
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Hansı xidmət axtarırsınız?"
                className="flex-1 bg-transparent outline-none font-normal text-[14px] md:text-[18px] leading-[20px] md:leading-[24px] text-black dark:text-white placeholder:text-[#1f2937]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
              <button type="submit" className="ml-2 md:ml-4 shrink-0 w-[20px] md:w-[28px] h-[20px] md:h-[28px]">
                <Image
                  src="/assets/images/search-icon.svg"
                  alt="Search"
                  width={28}
                  height={28}
                  className="block max-w-none w-full h-full"
                />
              </button>
            </div>
          </form>

          {/* Search Dropdown Results */}
          {showResults && (
            <div
              style={dropdownStyle}
              className="z-[9999] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[500px] overflow-y-auto"
            >
              {!loading && !error && results && hasResults && (
                <div className="py-2">
                  {/* Tasks */}
                  {results.tasks.length > 0 && (
                    <div className="mb-4">
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Tapşırıqlar ({results.tasks.length})
                      </div>
                      {results.tasks.map((task: any) => (
                        <SearchResultItem
                          key={`task-${task.id}`}
                          type="task"
                          item={task}
                          locale={locale}
                          onSelect={() => handleResultClick('task', task)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Professionals */}
                  {results.professionals.length > 0 && (
                    <div className="mb-4">
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Peşəkarlar ({results.professionals.length})
                      </div>
                      {results.professionals.map((professional: any) => (
                        <SearchResultItem
                          key={`professional-${professional.id}`}
                          type="professional"
                          item={professional}
                          locale={locale}
                          onSelect={() => handleResultClick('professional', professional)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Categories */}
                  {results.categories.length > 0 && (
                    <div className="mb-2">
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Kateqoriyalar ({results.categories.length})
                      </div>
                      {results.categories.map((category: any) => (
                        <SearchResultItem
                          key={`category-${category.id}`}
                          type="category"
                          item={category}
                          locale={locale}
                          onSelect={() => handleResultClick('category', category)}
                        />
                      ))}
                    </div>
                  )}

                  {/* View All Link */}
                  <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={handleSearch}
                      className="w-full text-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                    >
                      Bütün nəticələrə bax →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      {/* Progress Indicators */}
      <div className="absolute left-1/2 top-[335px] md:top-[565px] -translate-x-1/2 w-[calc(100%-40px)] md:w-[441px] flex gap-[6px] md:gap-[8px] items-center">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-[3px] md:h-[4px] rounded-[8px] transition-all duration-300 cursor-pointer ${
              index === 0 ? 'w-[80px] md:w-[166px]' : 'flex-1 min-w-0'
            } ${
              index === currentSlide
                ? 'bg-gradient-to-r from-[#14b8a6] via-[#06b6d4] via-[#8b5cf6] to-[#ec4899]'
                : 'bg-gradient-to-r from-[#e5e7eb] to-[#d1d5db]'
            }`}
          />
        ))}
      </div>
      </div>
    </section>
  );
}
