'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {  FileText, Users, Handshake, CreditCard, Search, Send, CheckCircle, Wallet } from 'lucide-react';

interface HowItWorksSectionProps {
  locale: string;
}

export default function HowItWorksSection({ locale }: HowItWorksSectionProps) {
  const t = useTranslations('home.howItWorks');
  const [activeTab, setActiveTab] = useState<'client' | 'professional'>('client');

  const clientSteps = [
    {
      icon: FileText,
      title: t('client.step1Title'),
      description: t('client.step1Desc'),
      gradient: 'from-orange-500 to-yellow-500',
    },
    {
      icon: Users,
      title: t('client.step2Title'),
      description: t('client.step2Desc'),
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Handshake,
      title: t('client.step3Title'),
      description: t('client.step3Desc'),
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: CreditCard,
      title: t('client.step4Title'),
      description: t('client.step4Desc'),
      gradient: 'from-purple-500 to-pink-500',
    },
  ];

  const professionalSteps = [
    {
      icon: Search,
      title: t('professional.step1Title'),
      description: t('professional.step1Desc'),
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Send,
      title: t('professional.step2Title'),
      description: t('professional.step2Desc'),
      gradient: 'from-sky-500 to-blue-500',
    },
    {
      icon: CheckCircle,
      title: t('professional.step3Title'),
      description: t('professional.step3Desc'),
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Wallet,
      title: t('professional.step4Title'),
      description: t('professional.step4Desc'),
      gradient: 'from-rose-500 to-pink-500',
    },
  ];

  const steps = activeTab === 'client' ? clientSteps : professionalSteps;

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-50/30 to-transparent dark:via-indigo-900/10" />

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">{t('title')}</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            {t('subtitle')}
          </p>

          {/* Tab Toggle */}
          <div className="inline-flex rounded-3xl p-1 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/20">
            <button
              onClick={() => setActiveTab('client')}
              className={`px-8 py-3 rounded-3xl font-medium transition-all duration-300 ${
                activeTab === 'client'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50'
              }`}
            >
              {t('forClients')}
            </button>
            <button
              onClick={() => setActiveTab('professional')}
              className={`px-8 py-3 rounded-3xl font-medium transition-all duration-300 ${
                activeTab === 'professional'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50'
              }`}
            >
              {t('forprofessionals')}
            </button>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={index}
                className="relative group"
              >
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg z-10">
                  {index + 1}
                </div>

                {/* Card */}
                <div className="h-full rounded-3xl p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 transition-all duration-500 group-hover:scale-105 group-hover:shadow-xl">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connecting Arrow (except for last step) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-20">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-white dark:bg-gray-900" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
