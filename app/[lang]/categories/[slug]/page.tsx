import { notFound } from 'next/navigation';

interface CategoryPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

async function getCategoryTasks(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tasks?category=${slug}`,
      { cache: 'no-store' }
    );

    if (!res.ok) return { tasks: [], category: null };
    const data = await res.json();
    return {
      tasks: data.data.data || [],
      category: data.data.data[0]?.category || null
    };
  } catch (error) {
    return { tasks: [], category: null };
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { lang, slug } = await params;
  const { tasks, category } = await getCategoryTasks(slug);

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {category?.name || 'Tapşırıqlar'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {tasks.length} tapşırıq tapıldı
          </p>
        </div>

        {/* Tasks Grid */}
        {tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task: any) => (
              <a
                key={task.id}
                href={`/${lang}/tasks/${task.slug}`}
                className="block bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
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
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Bu kateqoriyada tapşırıq tapılmadı
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
