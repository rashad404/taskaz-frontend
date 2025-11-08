import { notFound } from 'next/navigation';
import { getStorageUrl } from '@/lib/utils/url';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import {
  MapPin,
  Clock,
  Eye,
  Calendar,
  Briefcase,
  ChevronRight,
  User
} from 'lucide-react';
import type { Task } from '@/lib/types/marketplace';
import { formatDistanceToNow, format } from 'date-fns';
import { az, enUS, ru } from 'date-fns/locale';
import TaskCard from '@/components/tasks/TaskCard';
import TaskDetailActions from '@/components/tasks/TaskDetailActions';
import ShareButton from '@/components/tasks/ShareButton';
import { getImageUrl } from '@/lib/utils';

interface TaskDetailPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

async function getTask(slug: string, token?: string) {
  try {
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tasks/${slug}`,
      {
        cache: 'no-store',
        headers
      }
    );

    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    return null;
  }
}

// Generate metadata for the task detail page
export async function generateMetadata({ params }: TaskDetailPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const task = await getTask(slug);
  const t = await getTranslations({ locale: lang, namespace: 'metadata.task' });

  if (!task) {
    return {
      title: t('notFound'),
      description: t('notFoundDescription'),
    };
  }

  // Strip HTML tags from description
  const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').trim();
  };

  const title = t('title', { title: task.title });
  const description = stripHtml(task.description).substring(0, 160) || t('description');
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://task.az'}/${lang}/tasks/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: lang === 'az' ? `/tasks/${slug}` : `/${lang}/tasks/${slug}`,
      languages: {
        'az': `/tasks/${slug}`,
        'en': `/en/tasks/${slug}`,
        'ru': `/ru/tasks/${slug}`,
      },
    },
    openGraph: {
      type: 'article',
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

async function getSimilarTasks(categoryId: number, currentTaskId: number) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tasks?category=${categoryId}`,
      { cache: 'no-store' }
    );

    if (!res.ok) return [];
    const data = await res.json();
    // Filter out current task and limit to 6
    return (data.data.data || [])
      .filter((task: Task) => task.id !== currentTaskId)
      .slice(0, 6);
  } catch (error) {
    return [];
  }
}

function TaskDetailClient({ task, similarTasks, locale }: { task: Task; similarTasks: Task[]; locale: string }) {
  // Map locale to date-fns locale
  const dateLocale = locale === 'en' ? enUS : locale === 'ru' ? ru : az;

  const formatBudget = () => {
    if (!task.budget_amount) return 'Büdcə göstərilməyib';
    const amount = parseFloat(task.budget_amount);
    return task.budget_type === 'hourly'
      ? `${amount} AZN/saat`
      : `${amount} AZN`;
  };

  const getTimeAgo = () => {
    try {
      return formatDistanceToNow(new Date(task.created_at), {
        addSuffix: true,
        locale: dateLocale
      });
    } catch {
      return 'Bu yaxınlarda';
    }
  };

  const getDaysLeft = () => {
    if (!task.deadline) return null;
    try {
      const deadline = new Date(task.deadline);
      const today = new Date();
      const diffTime = deadline.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return null;
    }
  };

  const daysLeft = getDaysLeft();

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <Link href={`/${locale}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Ana Səhifə
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/${locale}/tasks`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Tapşırıqlar
          </Link>
          <ChevronRight className="w-4 h-4" />
          {task.category && (
            <>
              <Link
                href={`/${locale}/categories/${task.category.slug}`}
                className="hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                {task.category.name}
              </Link>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
          <span className="text-gray-900 dark:text-white truncate max-w-xs">
            {task.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Header */}
            <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                  {task.title}
                </h1>
                <ShareButton title={task.title} />
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {/* Status Badge */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.status === 'open'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : task.status === 'assigned'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                  }`}
                >
                  {task.status === 'open' ? 'Açıq' : task.status === 'assigned' ? 'Təyin Edilib' : 'Bağlı'}
                </span>

                {/* Category */}
                {task.category && (
                  <Link
                    href={`/${locale}/categories/${task.category.slug}`}
                    className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                  >
                    {task.category.name}
                  </Link>
                )}

                {/* Remote Badge */}
                {task.is_remote && (
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                    Remote
                  </span>
                )}

                {/* Views */}
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Eye className="w-3 h-3" />
                  <span>{task.views_count} baxış</span>
                </div>

                {/* Posted Time */}
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{getTimeAgo()}</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Büdcə</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatBudget()}
                  </p>
                </div>
                {task.deadline && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Son Tarix</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {daysLeft !== null && daysLeft > 0 ? `${daysLeft} gün qalıb` : daysLeft === 0 ? 'Bu gün' : 'Bitib'}
                    </p>
                  </div>
                )}
                {task.location && !task.is_remote && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Yer</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {task.location}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Büdcə Növü</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {task.budget_type === 'fixed' ? 'Sabit' : 'Saatlıq'}
                  </p>
                </div>
              </div>
            </div>

            {/* Task Description */}
            <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Təsvir
              </h2>
              <div
                className="text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: task.description }}
              />
            </div>

            {/* Attachments */}
            {task.attachments && task.attachments.length > 0 && (
              <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Əlavələr ({task.attachments.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {task.attachments.map((file: any, index: number) => (
                    <a
                      key={index}
                      href={getImageUrl(file.url || `storage/${file.path}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group"
                    >
                      {/* File Icon */}
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        {file.type?.includes('image') ? (
                          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        ) : file.type?.includes('pdf') ? (
                          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {file.original_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {file.size ? `${(file.size / 1024).toFixed(2)} KB` : 'Unknown size'}
                        </p>
                      </div>

                      {/* Download Icon */}
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Client Info Card */}
            {task.client && (
              <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Müştəri Haqqında
                </h2>
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 overflow-hidden">
                    {task.client.avatar ? (
                      <img
                        src={getStorageUrl(task.client.avatar)}
                        alt={task.client.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{task.client.name.charAt(0)}</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <Link
                      href={`/${locale}/clients/${task.client.slug}`}
                      className="text-xl font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      {task.client.name}
                    </Link>

                    {task.client.location && (
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{task.client.location}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>Üzv olub: {format(new Date(task.client.created_at), 'MMMM yyyy', { locale: dateLocale })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Action Card */}
              <div className="rounded-3xl p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30">
                <div className="mb-6">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {formatBudget()}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {task.budget_type === 'fixed' ? 'Sabit qiymət' : 'Saatlıq tarif'}
                  </p>
                </div>

                {task.deadline && (
                  <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl">
                    <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                      <Calendar className="w-5 h-5" />
                      <div>
                        <p className="text-xs font-medium">Son Tarix</p>
                        <p className="text-sm font-bold">
                          {daysLeft !== null && daysLeft >= 0
                            ? `${daysLeft} gün qalıb`
                            : 'Müddəti bitib'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <TaskDetailActions task={task} />
              </div>

              {/* Task Details Card */}
              <div className="rounded-3xl p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Tapşırıq Detalları
                </h3>

                <div className="space-y-4">
                  {task.location && !task.is_remote && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Yer</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {task.location}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">İş Rejimi</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {task.is_remote ? 'Remote' : 'Ofisdə'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Yerləşdirilib</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {getTimeAgo()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Eye className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Baxışlar</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {task.views_count}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Tasks Section */}
        {similarTasks.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Oxşar Tapşırıqlar
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {task.category?.name} kateqoriyasından digər tapşırıqlar
                </p>
              </div>
              {task.category && (
                <Link
                  href={`/${locale}/categories/${task.category.slug}`}
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium text-sm flex items-center gap-1"
                >
                  Hamısına bax
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarTasks.map((similarTask) => (
                <TaskCard key={similarTask.id} task={similarTask} locale={locale} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { lang, slug } = await params;
  const task = await getTask(slug);

  if (!task) {
    notFound();
  }

  // Fetch similar tasks
  const similarTasks = task.category
    ? await getSimilarTasks(task.category.id, task.id)
    : [];

  return <TaskDetailClient task={task} similarTasks={similarTasks} locale={lang} />;
}
