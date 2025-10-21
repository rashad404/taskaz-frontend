import { notFound } from 'next/navigation';
import Link from 'next/link';
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
import FreelancerCard from '@/components/freelancers/FreelancerCard';
import FreelancerDetailActions from '@/components/freelancers/FreelancerDetailActions';
import ContactInfo from '@/components/freelancers/ContactInfo';

interface FreelancerPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

async function getFreelancer(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/freelancers/${slug}`,
      { cache: 'no-store' }
    );

    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    return null;
  }
}

async function getSimilarFreelancers(currentFreelancerId: number) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/top-freelancers?limit=6`,
      { cache: 'no-store' }
    );

    if (!res.ok) return [];
    const data = await res.json();
    return (data.data || []).filter((f: any) => f.id !== currentFreelancerId);
  } catch (error) {
    return [];
  }
}

function FreelancerDetailClient({ freelancer, similarFreelancers, locale }: any) {
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
          <Link href={`/${locale}/freelancers`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Freelancerlər
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-white truncate max-w-xs">
            {freelancer.name}
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
                    {freelancer.avatar ? (
                      <img
                        src={freelancer.avatar}
                        alt={freelancer.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                        {freelancer.name.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {freelancer.name}
                  </h1>

                  {freelancer.location && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3">
                      <MapPin className="w-5 h-5" />
                      <span>{freelancer.location}</span>
                    </div>
                  )}

                  {/* Rating */}
                  <div className="flex items-center gap-3 mb-4">
                    {renderStars(freelancer.average_rating || 0)}
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {freelancer.average_rating || 0}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      ({freelancer.total_reviews || 0} rəy)
                    </span>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Briefcase className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="font-medium">
                        {freelancer.completed_contracts || 0} Tamamlanmış İş
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span>
                        Üzv olub: {format(new Date(freelancer.created_at), 'MMMM yyyy', { locale: dateLocale })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            {freelancer.bio && (
              <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Haqqında
                </h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {freelancer.bio}
                </p>
              </div>
            )}

            {/* Reviews Section */}
            {freelancer.received_reviews && freelancer.received_reviews.length > 0 && (
              <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Rəylər ({freelancer.received_reviews.length})
                </h2>

                <div className="space-y-6">
                  {freelancer.received_reviews.map((review: any) => (
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

                <FreelancerDetailActions freelancer={freelancer} locale={locale} />

                <ContactInfo
                  email={freelancer.email}
                  phone={freelancer.phone}
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
                      {freelancer.average_rating || 0} ⭐
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Rəylər</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {freelancer.total_reviews || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Tamamlanmış</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {freelancer.completed_contracts || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Freelancers Section */}
        {similarFreelancers.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Digər Freelancerlər
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Platformamızda digər professional freelancerlər
                </p>
              </div>
              <Link
                href={`/${locale}/freelancers`}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium text-sm flex items-center gap-1"
              >
                Hamısına bax
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarFreelancers.map((similar: any) => (
                <FreelancerCard key={similar.id} freelancer={similar} locale={locale} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default async function FreelancerPage({ params }: FreelancerPageProps) {
  const { lang, slug } = await params;
  const freelancer = await getFreelancer(slug);

  if (!freelancer) {
    notFound();
  }

  // Fetch similar freelancers
  const similarFreelancers = await getSimilarFreelancers(freelancer.id);

  return <FreelancerDetailClient freelancer={freelancer} similarFreelancers={similarFreelancers} locale={lang} />;
}
