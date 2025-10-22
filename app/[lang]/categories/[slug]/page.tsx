import { notFound } from 'next/navigation';
import Link from 'next/link';
import * as Icons from 'lucide-react';

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

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { lang, slug } = await params;
  const { category, tasks } = await getCategoryData(slug);

  if (!category) {
    notFound();
  }

  // Get icon component
  const IconComponent = category.icon ? (Icons as any)[category.icon] : null;

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Category Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {IconComponent && (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <IconComponent className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
            )}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {category.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {tasks.length} tapşırıq tapıldı
              </p>
            </div>
          </div>
        </div>

        {/* Subcategories Grid - Show if this is a parent category */}
        {category.children && category.children.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Alt Kateqoriyalar
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {category.children.map((subcategory: any) => (
                <Link
                  key={subcategory.id}
                  href={`/${lang}/categories/${subcategory.slug}`}
                  className="group"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {subcategory.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Tasks Section */}
        {tasks.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Aktiv Tapşırıqlar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task: any) => (
                <Link
                  key={task.id}
                  href={`/${lang}/tasks/${task.slug}`}
                  className="block bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500"
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                    {task.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {task.description}
                  </p>

                  <div className="flex items-center justify-between">
                    {task.budget_amount && (
                      <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                        {task.budget_amount} AZN
                      </span>
                    )}

                    {task.is_remote && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-sm">
                        Remote
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Bu kateqoriyada hələ tapşırıq yoxdur
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
