'use client';

import { useTranslations } from 'next-intl';
import { Shield, Star, MapPin, MessageSquare } from 'lucide-react';

interface WhyTaskazSectionProps {
  locale: string;
}

export default function WhyTaskazSection({ locale }: WhyTaskazSectionProps) {
  const t = useTranslations('home.whyTaskaz');

  const benefits = [
    {
      icon: Shield,
      title: t('securePayments.title'),
      description: t('securePayments.description'),
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: Star,
      title: t('qualityTalent.title'),
      description: t('qualityTalent.description'),
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: MapPin,
      title: t('localPlatform.title'),
      description: t('localPlatform.description'),
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: MessageSquare,
      title: t('messaging.title'),
      description: t('messaging.description'),
      gradient: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16 relative">
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

      {/* Benefits Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <div
                key={index}
                className="group relative h-full"
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${benefit.gradient} opacity-10 group-hover:opacity-15 transition-all duration-500`}
                />

                {/* Glass Card */}
                <div className="relative h-full rounded-3xl p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 transition-all duration-500 group-hover:scale-105">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {benefit.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
