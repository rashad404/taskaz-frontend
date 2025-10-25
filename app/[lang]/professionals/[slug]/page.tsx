import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import {
  Star,
  MapPin,
  Briefcase,
  User,
  Calendar,
  ChevronRight,
  Mail,
  Phone
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { az, enUS, ru } from 'date-fns/locale';
import ProfessionalCard from '@/components/professionals/ProfessionalCard';
import ProfessionalDetailActions from '@/components/professionals/ProfessionalDetailActions';
import ContactInfo from '@/components/professionals/ContactInfo';

interface professionalPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

async function getprofessional(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/professionals/${slug}`,
      { cache: 'no-store' }
    );

    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    return null;
  }
}

// Generate metadata for the professional profile page
export async function generateMetadata({ params }: professionalPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const professional = await getprofessional(slug);
  const t = await getTranslations({ locale: lang, namespace: 'metadata.professionals' });

  if (!professional) {
    return {
      title: t('notFound'),
      description: t('notFoundDescription'),
    };
  }

  const title = t('title', { name: professional.name });
  const description = professional.bio
    ? `${professional.bio.substring(0, 160)}`
    : t('description', {
        name: professional.name,
        completedJobs: professional.completed_contracts || 0,
        rating: professional.average_rating || 0
      });
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://task.az'}/${lang}/professionals/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: lang === 'az' ? `/professionals/${slug}` : `/${lang}/professionals/${slug}`,
      languages: {
        'az': `/professionals/${slug}`,
        'en': `/en/professionals/${slug}`,
        'ru': `/ru/professionals/${slug}`,
      },
    },
    openGraph: {
      type: 'profile',
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

async function getSimilarprofessionals(currentprofessionalId: number) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/top-professionals?limit=6`,
      { cache: 'no-store' }
    );

    if (!res.ok) return [];
    const data = await res.json();
    return (data.data || []).filter((f: any) => f.id !== currentprofessionalId);
  } catch (error) {
    return [];
  }
}

function ProfessionalDetailClient({ professional, similarprofessionals, locale }: any) {
  // Map locale to date-fns locale
  const dateLocale = locale === 'en' ? enUS : locale === 'ru' ? ru : az;

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= Math.round(rating)
                ? 'text-yellow-500 fill-yellow-500'
                : 'text-gray-300 dark:text-gray-600'
            }`}
            strokeWidth={2}
          />
        ))}
      </div>
    );
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
          <Link href={`/${locale}/professionals`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Peşəkarlar
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-white truncate max-w-xs">
            {professional.name}
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
                    {professional.avatar ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${professional.avatar}`}
                        alt={professional.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                        {professional.name.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {professional.name}
                  </h1>

                  {professional.location && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3">
                      <MapPin className="w-5 h-5" />
                      <span>{professional.location}</span>
                    </div>
                  )}

                  {/* Rating */}
                  <div className="flex items-center gap-3 mb-4">
                    {renderStars(professional.average_rating || 0)}
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {professional.average_rating || 0}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      ({professional.total_reviews || 0} rəy)
                    </span>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Briefcase className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="font-medium">
                        {professional.completed_contracts || 0} Tamamlanmış İş
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span>
                        Üzv olub: {format(new Date(professional.created_at), 'MMMM yyyy', { locale: dateLocale })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            {professional.bio && (
              <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Haqqında
                </h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {professional.bio}
                </p>
              </div>
            )}

            {/* Reviews Section */}
            {professional.received_reviews && professional.received_reviews.length > 0 && (
              <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Rəylər ({professional.received_reviews.length})
                </h2>

                <div className="space-y-6">
                  {professional.received_reviews.map((review: any) => (
                    <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {review.reviewer?.name || 'Anonim'}
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

                <ProfessionalDetailActions professional={professional} locale={locale} />

                <ContactInfo
                  email={professional.email}
                  phone={professional.phone}
                  locale={locale}
                />
              </div>

              {/* Stats Card */}
              <div className="rounded-3xl p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Statistika
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Reytinq</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {professional.average_rating || 0} ⭐
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Rəylər</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {professional.total_reviews || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Tamamlanmış</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {professional.completed_contracts || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar professionals Section */}
        {similarprofessionals.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Digər professionallər
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Platformamızda digər professional professionallər
                </p>
              </div>
              <Link
                href={`/${locale}/professionals`}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium text-sm flex items-center gap-1"
              >
                Hamısına bax
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarprofessionals.map((similar: any) => (
                <ProfessionalCard key={similar.id} professional={similar} locale={locale} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default async function professionalPage({ params }: professionalPageProps) {
  const { lang, slug } = await params;
  const professional = await getprofessional(slug);

  if (!professional) {
    notFound();
  }

  // Fetch similar professionals
  const similarprofessionals = await getSimilarprofessionals(professional.id);

  return <ProfessionalDetailClient professional={professional} similarprofessionals={similarprofessionals} locale={lang} />;
}
