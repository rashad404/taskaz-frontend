'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Loader2, Briefcase, Users, FolderOpen } from 'lucide-react';
import axios from 'axios';

interface SearchPageProps {
  params: Promise<{ lang: string }>;
}

function SearchResults({ locale }: { locale: string }) {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Strip HTML tags from description
  const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').trim();
  };

  useEffect(() => {
    const performSearch = async () => {
      if (!query) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/search?q=${encodeURIComponent(query)}`
        );
        setResults(response.data.data);
      } catch (err: any) {
        setError('Axtarış zamanı xəta baş verdi');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query]);

  const hasResults = results && (
    results.tasks?.length > 0 ||
    results.professionals?.length > 0 ||
    results.categories?.length > 0
  );

  if (!query) {
    return (
      <div className="text-center py-12">
        <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Axtarış sorğusu yoxdur
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Xahiş edirik bir şey axtarın
        </p>
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all"
        >
          Ana Səhifəyə Qayıt
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-spin" />
        <span className="ml-4 text-xl text-gray-600 dark:text-gray-400">Axtarılır...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 dark:text-red-400 mb-4">{error}</div>
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all"
        >
          Ana Səhifəyə Qayıt
        </Link>
      </div>
    );
  }

  if (!hasResults) {
    return (
      <div className="text-center py-12">
        <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Nəticə tapılmadı
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          "<span className="font-semibold">{query}</span>" üçün nəticə tapılmadı
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
          Başqa açar sözlər ilə yenidən cəhd edin
        </p>
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all"
        >
          Ana Səhifəyə Qayıt
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Tasks */}
      {results.tasks && results.tasks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Tapşırıqlar ({results.tasks.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.tasks.map((task: any) => (
              <Link
                key={task.id}
                href={`/${locale}/tasks/${task.slug}`}
                className="block bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {task.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                  {stripHtml(task.description)}
                </p>
                <div className="flex items-center justify-between">
                  {task.budget_amount && (
                    <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                      {task.budget_amount} AZN
                    </span>
                  )}
                  {task.is_remote && (
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs font-medium">
                      Remote
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* professionals */}
      {results.professionals && results.professionals.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Peşəkarlar ({results.professionals.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.professionals.map((professional: any) => (
              <Link
                key={professional.id}
                href={`/${locale}/professionals/${professional.slug}`}
                className="block bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                    {professional.avatar ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${professional.avatar}`}
                        alt={professional.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{professional.name?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {professional.name}
                    </h3>
                    {professional.bio && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                        {professional.bio}
                      </p>
                    )}
                    {professional.location && (
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                        📍 {professional.location}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      {results.categories && results.categories.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FolderOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Kateqoriyalar ({results.categories.length})
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.categories.map((category: any) => (
              <Link
                key={category.id}
                href={`/${locale}/categories/${category.slug}`}
                className="block bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 text-center"
              >
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage({ params }: SearchPageProps) {
  const [locale, setLocale] = useState('az');

  useEffect(() => {
    params.then(({ lang }) => setLocale(lang));
  }, [params]);

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-spin" />
          </div>
        }>
          <SearchResults locale={locale} />
        </Suspense>
      </div>
    </div>
  );
}
