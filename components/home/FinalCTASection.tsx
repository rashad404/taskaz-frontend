'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { ArrowRight, Briefcase, Wallet, Star } from 'lucide-react';

interface FinalCTASectionProps {
  locale: string;
}

export default function FinalCTASection({ locale }: FinalCTASectionProps) {
  const t = useTranslations('home.finalCTA');
  const router = useRouter();

  return (
    <section className="px-6 py-16 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Client CTA */}
          <div className="group relative cursor-pointer" onClick={() => router.push(`/${locale}/tasks/create`)}>
            {/* Background Gradient */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-500 opacity-90 group-hover:opacity-100 transition-all duration-500" />

            {/* Content */}
            <div className="relative rounded-3xl p-12 text-white">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
                <Briefcase className="w-8 h-8 text-white" strokeWidth={2} />
              </div>

              {/* Title */}
              <h3 className="text-3xl font-bold mb-4">
                {t('clients.title')}
              </h3>

              {/* Description */}
              <p className="text-white/90 mb-8 text-lg">
                {t('clients.description')}
              </p>

              {/* Button */}
              <button className="group/btn inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-medium bg-white text-indigo-600 hover:bg-gray-100 transition-all duration-300 cursor-pointer">
                <span>{t('clients.button')}</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Shine effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000" />
            </div>
          </div>

          {/* Freelancer CTA */}
          <div className="group relative cursor-pointer" onClick={() => router.push(`/${locale}/tasks`)}>
            {/* Background Gradient */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 opacity-90 group-hover:opacity-100 transition-all duration-500" />

            {/* Content */}
            <div className="relative rounded-3xl p-12 text-white">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
                <Wallet className="w-8 h-8 text-white" strokeWidth={2} />
              </div>

              {/* Title */}
              <h3 className="text-3xl font-bold mb-4">
                {t('freelancers.title')}
              </h3>

              {/* Description */}
              <p className="text-white/90 mb-8 text-lg">
                {t('freelancers.description')}
              </p>

              {/* Button */}
              <button className="group/btn inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-medium bg-white text-emerald-600 hover:bg-gray-100 transition-all duration-300 cursor-pointer">
                <span>{t('freelancers.button')}</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Shine effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000" />
            </div>
          </div>

          {/* Become Professional CTA */}
          <div className="group relative cursor-pointer" onClick={() => router.push(`/${locale}/become-professional`)}>
            {/* Background Gradient */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 opacity-90 group-hover:opacity-100 transition-all duration-500" />

            {/* Content */}
            <div className="relative rounded-3xl p-12 text-white">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
                <Star className="w-8 h-8 text-white" strokeWidth={2} />
              </div>

              {/* Title */}
              <h3 className="text-3xl font-bold mb-4">
                Peşəkar Olun
              </h3>

              {/* Description */}
              <p className="text-white/90 mb-8 text-lg">
                Özünüzü göstərin və qazanmağa başlayın
              </p>

              {/* Button */}
              <button className="group/btn inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-medium bg-white text-purple-600 hover:bg-gray-100 transition-all duration-300 cursor-pointer">
                <span>İndi Müraciət Et</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Shine effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
