'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { usersApi } from '@/lib/api/marketplace';
import { Star, MapPin, Briefcase, Loader2 } from 'lucide-react';
import { getStorageUrl } from '@/lib/utils/url';

interface professional {
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

interface TopProfessionalsSectionProps {
  locale: string;
}

export default function TopProfessionalsSection({ locale }: TopProfessionalsSectionProps) {
  const t = useTranslations('home.topprofessionals');
  const router = useRouter();
  const [professionals, setprofessionals] = useState<professional[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchprofessionals = async () => {
      try {
        const data = await usersApi.getTopprofessionals(6);
        setprofessionals(data);
      } catch (error) {
        console.error('Failed to fetch top professionals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchprofessionals();
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
            onClick={() => router.push(`/${locale}/professionals`)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition-colors font-medium"
          >
            Hamısına Bax
          </button>
        </div>
      </div>

      {/* professionals Grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : professionals.length === 0 ? (
          <div className="text-center py-12">
            <div className="rounded-3xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 p-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {t('noprofessionals')}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professionals.map((professional) => (
              <div
                key={professional.id}
                onClick={() => router.push(`/${locale}/professionals/${professional.slug}`)}
                className="group relative h-full cursor-pointer"
              >
                {/* Glass Card */}
                <div className="h-full rounded-3xl p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-xl">
                  {/* Avatar */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-1 mb-4">
                      <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                        {professional.avatar ? (
                          <img
                            src={getStorageUrl(professional.avatar)}
                            alt={professional.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                            {professional.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Name */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 text-center">
                      {professional.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(Math.round(professional.average_rating))}
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {professional.average_rating}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({professional.total_reviews})
                      </span>
                    </div>
                  </div>

                  {/* Bio */}
                  {professional.bio && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 text-center">
                      {professional.bio}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {/* Location */}
                    {professional.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>{professional.location}</span>
                      </div>
                    )}

                    {/* Completed Jobs */}
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Briefcase className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span>
                        {professional.completed_contracts} {t('completedJobs')}
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
