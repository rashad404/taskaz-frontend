import { notFound } from 'next/navigation';
import { getStorageUrl } from '@/lib/utils/url';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Star,
  MapPin,
  Briefcase,
  Calendar,
  ChevronRight,
  Mail,
  Phone,
  FileText,
  CheckCircle
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { az, enUS, ru } from 'date-fns/locale';

interface ClientPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

async function getClient(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/clients/${slug}`,
      { cache: 'no-store' }
    );

    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    return null;
  }
}

// Generate metadata for the client profile page
export async function generateMetadata({ params }: ClientPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const client = await getClient(slug);

  if (!client) {
    return {
      title: 'Task.az - Müştəri Tapılmadı',
      description: 'Axtardığınız müştəri tapılmadı.',
    };
  }

  const description = client.bio
    ? `${client.bio.substring(0, 160)}`
    : `${client.name} - Müştəri profili. ${client.total_tasks || 0} tapşırıq, ${client.completed_contracts || 0} tamamlanmış iş.`;

  return {
    title: `${client.name} - Müştəri Profili | Task.az`,
    description,
  };
}

function ClientDetailClient({ client, locale }: any) {
  // Map locale to date-fns locale
  const dateLocale = locale === 'en' ? enUS : locale === 'ru' ? ru : az;

  // Strip HTML tags from description
  const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').trim();
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <Link href={`/${locale}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Ana Səhifə
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/${locale}/clients`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Müştərilər
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-white truncate max-w-xs">
            {client.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30">
              <div className="flex items-start gap-6 mb-6">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-1 flex-shrink-0">
                  <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                    {client.avatar ? (
                      <img
                        src={getStorageUrl(client.avatar)}
                        alt={client.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                        {client.name.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {client.name}
                  </h1>

                  {client.location && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3">
                      <MapPin className="w-5 h-5" />
                      <span>{client.location}</span>
                    </div>
                  )}

                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span className="font-medium">
                        {client.total_tasks || 0} Tapşırıq
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="font-medium">
                        {client.completed_contracts || 0} Tamamlanmış
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <span>
                        Üzv olub: {format(new Date(client.created_at), 'MMMM yyyy', { locale: dateLocale })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            {client.bio && (
              <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Haqqında
                </h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {client.bio}
                </p>
              </div>
            )}

            {/* Posted Tasks Section */}
            {client.posted_tasks && client.posted_tasks.length > 0 && (
              <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Aktiv Tapşırıqlar ({client.posted_tasks.length})
                </h2>

                <div className="space-y-4">
                  {client.posted_tasks.map((task: any) => (
                    <Link
                      key={task.id}
                      href={`/${locale}/tasks/${task.id}`}
                      className="block p-4 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                        {stripHtml(task.description)}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                          {task.budget} AZN
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {formatDistanceToNow(new Date(task.created_at), {
                            addSuffix: true,
                            locale: dateLocale
                          })}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Written Section */}
            {client.written_reviews && client.written_reviews.length > 0 && (
              <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Yazılmış Rəylər ({client.written_reviews.length})
                </h2>

                <div className="space-y-6">
                  {client.written_reviews.map((review: any) => (
                    <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {review.reviewed?.name || 'Anonim'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDistanceToNow(new Date(review.created_at), {
                              addSuffix: true,
                              locale: dateLocale
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                          <span className="font-bold text-gray-900 dark:text-white">
                            {review.rating}
                          </span>
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-gray-700 dark:text-gray-300">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Contact Card */}
              <div className="rounded-3xl p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Əlaqə
                </h3>

                {client.email && (
                  <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 break-all">
                      {client.email}
                    </span>
                  </div>
                )}

                {client.phone && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {client.phone}
                    </span>
                  </div>
                )}
              </div>

              {/* Stats Card */}
              <div className="rounded-3xl p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Statistika
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Ümumi Tapşırıqlar</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {client.total_tasks || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Ümumi Müqavilələr</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {client.total_contracts || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Tamamlanmış</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {client.completed_contracts || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Yazılmış Rəylər</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {client.total_reviews_written || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function ClientPage({ params }: ClientPageProps) {
  const { lang, slug } = await params;
  const client = await getClient(slug);

  if (!client) {
    notFound();
  }

  return <ClientDetailClient client={client} locale={lang} />;
}
