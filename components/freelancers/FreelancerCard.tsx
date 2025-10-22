'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Star, MapPin, Briefcase } from 'lucide-react';

export interface Freelancer {
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

interface FreelancerCardProps {
  freelancer: Freelancer;
  locale: string;
}

export default function FreelancerCard({ freelancer, locale }: FreelancerCardProps) {
  const t = useTranslations('freelancers');

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
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
    <Link href={`/${locale}/freelancers/${freelancer.slug}`}>
      <div className="group relative h-full cursor-pointer">
        {/* Glass Card */}
        <div className="h-full rounded-3xl p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-xl">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-1 mb-4">
              <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                {freelancer.avatar ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${freelancer.avatar}`}
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
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 text-center group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {freelancer.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-2">
              {renderStars(freelancer.average_rating)}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {freelancer.average_rating || 0}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({freelancer.total_reviews || 0})
              </span>
            </div>
          </div>

          {/* Bio */}
          {freelancer.bio && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 text-center min-h-[2.5rem]">
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
                {freelancer.completed_contracts || 0} {t('completedJobs')}
              </span>
            </div>
          </div>
        </div>

        {/* Shine effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000" />
        </div>
      </div>
    </Link>
  );
}
