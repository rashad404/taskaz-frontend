'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, Search, Users, Briefcase } from 'lucide-react';

export default function FAQPage() {
  const t = useTranslations('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'general' | 'clients' | 'professionals'>('general');
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const categories = [
    { id: 'general' as const, icon: Search, label: t('categories.general') },
    { id: 'clients' as const, icon: Users, label: t('categories.clients') },
    { id: 'professionals' as const, icon: Briefcase, label: t('categories.professionals') },
  ];

  const generalFaqs = [
    { q: t('general.q1.question'), a: t('general.q1.answer') },
    { q: t('general.q2.question'), a: t('general.q2.answer') },
    { q: t('general.q3.question'), a: t('general.q3.answer') },
    { q: t('general.q4.question'), a: t('general.q4.answer') },
    { q: t('general.q5.question'), a: t('general.q5.answer') },
  ];

  const clientFaqs = [
    { q: t('clients.q1.question'), a: t('clients.q1.answer') },
    { q: t('clients.q2.question'), a: t('clients.q2.answer') },
    { q: t('clients.q3.question'), a: t('clients.q3.answer') },
    { q: t('clients.q4.question'), a: t('clients.q4.answer') },
    { q: t('clients.q5.question'), a: t('clients.q5.answer') },
  ];

  const professionalFaqs = [
    { q: t('professionals.q1.question'), a: t('professionals.q1.answer') },
    { q: t('professionals.q2.question'), a: t('professionals.q2.answer') },
    { q: t('professionals.q3.question'), a: t('professionals.q3.answer') },
    { q: t('professionals.q4.question'), a: t('professionals.q4.answer') },
    { q: t('professionals.q5.question'), a: t('professionals.q5.answer') },
  ];

  const allFaqs = {
    general: generalFaqs,
    clients: clientFaqs,
    professionals: professionalFaqs,
  };

  const currentFaqs = allFaqs[activeCategory];

  const filteredFaqs = currentFaqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleQuestion = (question: string) => {
    setOpenQuestion(openQuestion === question ? null : question);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[rgb(81,91,195)] to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-white/90 mb-8">
              {t('hero.subtitle')}
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('hero.searchPlaceholder')}
                className="w-full pl-12 pr-4 py-4 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-none outline-none shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                    activeCategory === category.id
                      ? 'bg-[rgb(81,91,195)] text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {category.label}
                </button>
              );
            })}
          </div>

          {/* FAQ List */}
          <div className="max-w-4xl mx-auto">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {t('noResults')}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => {
                  const isOpen = openQuestion === faq.q;
                  return (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleQuestion(faq.q)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <span className="font-semibold text-gray-900 dark:text-white pr-4">
                          {faq.q}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {faq.a}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Still Have Questions */}
          <div className="max-w-4xl mx-auto mt-16 bg-gradient-to-br from-[rgb(81,91,195)] to-purple-600 rounded-lg p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">
              {t('stillHaveQuestions.title')}
            </h2>
            <p className="text-white/90 mb-6">
              {t('stillHaveQuestions.description')}
            </p>
            <a
              href="/az/contact"
              className="inline-block bg-white text-[rgb(81,91,195)] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              {t('stillHaveQuestions.button')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
