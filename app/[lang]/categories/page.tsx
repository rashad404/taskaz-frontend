import Link from 'next/link';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import * as Icons from 'lucide-react';

interface CategoriesPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: CategoriesPageProps): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: 'metadata.categories' });

  const title = t('listTitle');
  const description = t('listDescription');
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://task.az'}/${lang}/categories`;

  return {
    title,
    description,
    alternates: {
      canonical: lang === 'az' ? '/categories' : `/${lang}/categories`,
      languages: {
        'az': '/categories',
        'en': '/en/categories',
        'ru': '/ru/categories',
      },
    },
    openGraph: {
      type: 'website',
      locale: lang === 'az' ? 'az_AZ' : lang === 'en' ? 'en_US' : 'ru_RU',
      url,
      siteName: 'Task.az',
      title,
      description,
      images: [
        {
          url: '/images/taskaz-image.jpg',
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/taskaz-image.jpg'],
    },
  };
}

async function getCategories() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories`,
      { cache: 'no-store' }
    );

    if (!res.ok) return [];
    const allCategories = await res.json();

    // Filter to show only parent categories and add their children
    const parentCategories = allCategories
      .filter((cat: any) => !cat.parent_id)
      .map((parent: any) => ({
        ...parent,
        children: allCategories.filter((cat: any) => cat.parent_id === parent.id)
      }));

    return parentCategories;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

export default async function CategoriesPage({ params }: CategoriesPageProps) {
  const { lang } = await params;
  const categories = await getCategories();

  const categoryGradients = [
    'from-orange-500 to-yellow-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-purple-500 to-pink-500',
    'from-indigo-500 to-purple-500',
    'from-sky-500 to-blue-500',
    'from-rose-500 to-pink-500',
    'from-teal-500 to-cyan-500',
    'from-amber-500 to-orange-500',
    'from-lime-500 to-green-500',
  ];

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Bütün Kateqoriyalar</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {categories.length} əsas kateqoriya mövcuddur
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category: any, index: number) => {
            const IconComponent = category.icon ? (Icons as any)[category.icon] : Icons.Folder;
            const gradient = categoryGradients[index % categoryGradients.length];

            return (
              <Link key={category.id} href={`/${lang}/categories/${category.slug}`}>
                <div className="relative group cursor-pointer h-full">
                  {/* Card Background Gradient */}
                  <div
                    className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-15 transition-all duration-500 pointer-events-none`}
                  />

                  {/* Glass Card */}
                  <div className="relative h-full rounded-3xl p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 transition-all duration-500 group-hover:scale-[1.02]">
                    {/* Hover Gradient Effect */}
                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-50 bg-gradient-to-br ${gradient} blur-3xl transition-opacity duration-500 pointer-events-none`}
                    />

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col justify-between">
                      {/* Icon and Title */}
                      <div>
                        <div
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}
                        >
                          {IconComponent && (
                            <IconComponent className="w-7 h-7 text-white" strokeWidth={2} />
                          )}
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {category.name}
                        </h3>

                        {/* Subcategories count */}
                        {category.children && category.children.length > 0 && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {category.children.length} alt kateqoriya
                          </p>
                        )}
                      </div>

                      {/* Arrow Icon */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          <span>Bax</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                          >
                            <path d="M5 12h14"/>
                            <path d="m12 5 7 7-7 7"/>
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Back to Home Button */}
        <div className="text-center mt-12">
          <Link
            href={`/${lang}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M19 12H5"/>
              <path d="m12 19-7-7 7-7"/>
            </svg>
            <span>Ana Səhifəyə Qayıt</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
