'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface HeroSectionProps {
  locale: string;
}

export default function HeroSection({ locale }: HeroSectionProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [underlineWidth, setUnderlineWidth] = useState(372);
  const textRef = useRef<HTMLParagraphElement>(null);

  const categoryTexts = [
    'usta lazımdırsa',
    'proqramçı lazımdırsa',
    'dizayner lazımdırsa',
    'təmizləyici lazımdırsa',
    'mexanik lazımdırsa',
  ];

  // Auto-rotate every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % categoryTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [categoryTexts.length]);

  // Update underline width when text changes
  useEffect(() => {
    if (textRef.current) {
      const width = textRef.current.offsetWidth;
      setUnderlineWidth(width + 20); // Add some padding
    }
  }, [currentSlide, categoryTexts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${locale}/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="relative bg-[#f5f8ff] dark:bg-gray-900 h-[700px] overflow-hidden">
      {/* Background Ellipse 4 - Purple gradient */}
      <div className="absolute left-[-277px] top-[137px] w-[491px] h-[492px]">
        <Image
          src="/assets/images/ellipse-purple.svg"
          alt=""
          width={491}
          height={492}
          className="block max-w-none w-full h-full"
        />
      </div>

      {/* Background Ellipse 5 - Blue gradient */}
      <div className="absolute left-[1177px] top-[137px] w-[656px] h-[656px]">
        <Image
          src="/assets/images/ellipse-blue.svg"
          alt=""
          width={656}
          height={656}
          className="block max-w-none w-full h-full"
        />
      </div>

      {/* Main Headline - "Evə təmir üçün / buna görə narahat olma" */}
      <div
        className="absolute left-[308px] top-[149px] w-[498px] h-[132px] font-bold text-[48px] leading-[62px] text-black dark:text-white whitespace-pre-wrap"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        <p className="mb-0">Evə təmir üçün  </p>
        <p className="mb-0">&nbsp;</p>
        <p className="mb-0">buna görə narahat olma </p>
      </div>

      {/* Animated gradient text - "usta lazımdırsa" */}
      <p
        ref={textRef}
        className="absolute left-[308px] top-[210px] font-bold text-[48px] leading-[54px] bg-clip-text mb-8"
        style={{
          fontFamily: 'Inter, sans-serif',
          backgroundImage: 'linear-gradient(90deg, #14b8a6 0%, #06b6d4 25%, #8b5cf6 75%, #ec4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        {categoryTexts[currentSlide]}
      </p>

      {/* Gradient underline decoration under animated text */}
      <div
        className="absolute left-[308px] top-[265px] h-[18px] flex items-center justify-start transition-all duration-300"
        style={{ width: `${underlineWidth}px` }}
      >
        <div className="flex-none w-full" style={{ transform: 'rotate(358.703deg)' }}>
          <Image
            src="/assets/images/gradient-underline.svg"
            alt=""
            width={underlineWidth}
            height={18}
            className="block w-full h-auto"
          />
        </div>
      </div>

      {/* Worker Image */}
      <div className="absolute left-[805px] top-[122px] w-[302px] h-[302px]">
        <Image
          src="/assets/images/worker.png"
          alt="Professional Worker"
          width={302}
          height={302}
          className="block max-w-none w-full h-full object-cover object-center"
          priority
        />
      </div>

      {/* Search Box Background - White translucent */}
      <div className="absolute left-1/2 top-[403px] -translate-x-1/2 w-[914px] h-[110px] bg-[rgba(255,255,255,0.3)] border border-solid border-white rounded-[80px]" />

      {/* Search Box - Main Input */}
      <form onSubmit={handleSearch} className="absolute left-1/2 top-[420px] -translate-x-1/2 w-[871px]">
        <div className="bg-white dark:bg-gray-800 border border-solid border-[#e5e5e5] dark:border-gray-700 rounded-[64px] flex items-center justify-between px-[32px] py-[24px]" style={{ boxShadow: '0px 4px 20px 0px rgba(0, 0, 0, 0.08)' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Hansı xidmət axtarırsınız?"
            className="flex-1 bg-transparent outline-none font-normal text-[18px] leading-[24px] text-black dark:text-white placeholder:text-[#6b7280]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          />
          <button type="submit" className="ml-4 shrink-0 w-[28px] h-[28px]">
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

      {/* Progress Indicators */}
      <div className="absolute left-1/2 top-[565px] -translate-x-1/2 w-[441px] flex gap-[8px] items-center">
        {categoryTexts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-[4px] rounded-[8px] transition-all duration-300 cursor-pointer ${
              index === 0 ? 'w-[166px]' : 'flex-1'
            } ${
              index === currentSlide
                ? 'bg-gradient-to-r from-[#06b6d4] to-[#3b82f6]'
                : 'bg-[#cbcbcb]'
            }`}
          />
        ))}
      </div>

      {/* Mesaj göndər Card */}
      <div className="absolute left-[984px] top-[224px]">
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

      {/* Vaxt dəqiqliyi Card */}
      <div className="absolute left-[748px] top-[329px]">
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
    </section>
  );
}
