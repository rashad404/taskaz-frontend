import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import * as Icons from 'lucide-react';
import { getTranslations } from 'next-intl/server';

interface CategoryPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

async function getCategoryData(slug: string) {
  try {
    // Fetch all categories
    const categoryRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories`,
      { cache: 'no-store' }
    );

    if (!categoryRes.ok) return { category: null, tasks: [] };
    const allCategories = await categoryRes.json();

    // Find the category by slug
    let category = allCategories.find((cat: any) => cat.slug === slug);

    if (!category) {
      return { category: null, tasks: [] };
    }

    // If this is a parent category, find its children
    if (!category.parent_id) {
      category.children = allCategories.filter((cat: any) => cat.parent_id === category.id);
    }

    // Fetch tasks for this category
    const tasksRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tasks?category=${slug}`,
      { cache: 'no-store' }
    );

    let tasks = [];
    if (tasksRes.ok) {
      const tasksData = await tasksRes.json();
      tasks = tasksData.data.data || [];
    }

    return { category, tasks };
  } catch (error) {
    return { category: null, tasks: [] };
  }
}

// Generate metadata for the category page
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const { category, tasks } = await getCategoryData(slug);
  const t = await getTranslations({ locale: lang, namespace: 'metadata.category' });

  if (!category) {
    return {
      title: t('notFound'),
      description: t('notFoundDescription'),
    };
  }

  const title = t('title', { name: category.name });
  const description = category.description || t('description', { name: category.name });
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://task.az'}/${lang}/categories/${slug}`;

  return {
    title,
    description,
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

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { lang, slug } = await params;
  const { category, tasks } = await getCategoryData(slug);

  if (!category) {
    notFound();
  }

  // Strip HTML tags from description
  const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').trim();
  };

  // Get icon component
  const IconComponent = category.icon ? (Icons as any)[category.icon] : null;

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Category Header */}
        <div className="mb-12">
          <div className="flex items-center gap-6 mb-4">
            {IconComponent && (
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[2px] transition-transform hover:scale-105 duration-300">
                <div className="w-full h-full rounded-2xl bg-white dark:bg-gray-900 flex items-center justify-center">
                  <IconComponent className="w-10 h-10 text-indigo-600 dark:text-indigo-400" strokeWidth={2} />
                </div>
              </div>
            )}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">
                <span className="gradient-text">{category.name}</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
                {tasks.length} tapşırıq tapıldı
              </p>
            </div>
          </div>
        </div>

        {/* Subcategories Grid - Show if this is a parent category */}
        {category.children && category.children.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">
              <span className="gradient-text">Alt Kateqoriyalar</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {category.children.map((subcategory: any) => (
                <Link
                  key={subcategory.id}
                  href={`/${lang}/categories/${subcategory.slug}`}
                  className="group relative cursor-pointer"
                >
                  <div className="h-full rounded-3xl p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 transition-all duration-500 group-hover:scale-[1.05] group-hover:shadow-xl">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {subcategory.name}
                    </h3>
                  </div>

                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Tasks Section */}
        {tasks.length > 0 ? (
          <div>
            <h2 className="text-3xl font-bold mb-8">
              <span className="gradient-text">Aktiv Tapşırıqlar</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task: any) => (
                <Link
                  key={task.id}
                  href={`/${lang}/tasks/${task.slug}`}
                  className="group relative h-full cursor-pointer"
                >
                  {/* Glass Card */}
                  <div className="h-full rounded-3xl p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-xl">
                    {/* Status Badge and Views */}
                    <div className="flex items-center justify-between mb-4">
                      {task.status && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          Aktiv
                        </span>
                      )}
                      {task.is_remote && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          Remote
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {task.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {stripHtml(task.description)}
                    </p>

                    {/* Budget */}
                    {task.budget_amount && (
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                          {task.budget_amount} AZN
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="rounded-3xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 p-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Bu kateqoriyada hələ tapşırıq yoxdur
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
