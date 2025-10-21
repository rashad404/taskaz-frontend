'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { usersApi } from '@/lib/api/marketplace';
import { Star, MapPin, Briefcase, Loader2 } from 'lucide-react';

interface Freelancer {
  id: number;
  name: string;
  slug: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  average_rating: number;
  total_reviews: number;
  completed_contracts: number;
}

interface TopFreelancersSectionProps {
  locale: string;
}

export default function TopFreelancersSection({ locale }: TopFreelancersSectionProps) {
  const t = useTranslations('home.topFreelancers');
  const router = useRouter();
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const data = await usersApi.getTopFreelancers(6);
        setFreelancers(data);
      } catch (error) {
        console.error('Failed to fetch top freelancers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancers();
  }, []);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
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
    <section className="px-6 py-16 relative">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">{t('title')}</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            {t('subtitle')}
          </p>
          <button
            onClick={() => router.push(`/${locale}/freelancers`)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition-colors font-medium"
          >
            Hamısına Bax
          </button>
        </div>
      </div>

      {/* Freelancers Grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : freelancers.length === 0 ? (
          <div className="text-center py-12">
            <div className="rounded-3xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 p-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {t('noFreelancers')}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freelancers.map((freelancer) => (
              <div
                key={freelancer.id}
                onClick={() => router.push(`/${locale}/freelancers/${freelancer.slug}`)}
                className="group relative h-full cursor-pointer"
              >
                {/* Glass Card */}
                <div className="h-full rounded-3xl p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-xl">
                  {/* Avatar */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-1 mb-4">
                      <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                        {freelancer.avatar ? (
                          <img
                            src={freelancer.avatar}
                            alt={freelancer.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                            {freelancer.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Name */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 text-center">
                      {freelancer.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(Math.round(freelancer.average_rating))}
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {freelancer.average_rating}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({freelancer.total_reviews})
                      </span>
                    </div>
                  </div>

                  {/* Bio */}
                  {freelancer.bio && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 text-center">
                      {freelancer.bio}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {/* Location */}
                    {freelancer.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>{freelancer.location}</span>
                      </div>
                    )}

                    {/* Completed Jobs */}
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Briefcase className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span>
                        {freelancer.completed_contracts} {t('completedJobs')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
