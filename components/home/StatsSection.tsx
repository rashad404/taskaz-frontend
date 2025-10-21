'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Users, Briefcase, CheckCircle, Star } from 'lucide-react';
import axios from 'axios';

interface StatsData {
  totalUsers: number;
  activeTasks: number;
  completedContracts: number;
  averageRating: number;
}

interface StatsSectionProps {
  locale: string;
}

export default function StatsSection({ locale }: StatsSectionProps) {
  const t = useTranslations('home.stats');
  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    activeTasks: 0,
    completedContracts: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch stats from API
    const fetchStats = async () => {
      try {
        // TODO: Replace with actual stats API endpoint when available
        // For now, we'll simulate a loading state
        await new Promise(resolve => setTimeout(resolve, 500));

        // This would be replaced with actual API call:
        // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/stats`);
        // setStats(response.data.data);

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsConfig = [
    {
      icon: Users,
      gradient: 'from-indigo-600 to-purple-600',
      value: stats.totalUsers,
      label: t('users'),
      suffix: '+',
    },
    {
      icon: Briefcase,
      gradient: 'from-blue-600 to-cyan-600',
      value: stats.activeTasks,
      label: t('activeTasks'),
      suffix: '',
    },
    {
      icon: CheckCircle,
      gradient: 'from-emerald-600 to-teal-600',
      value: stats.completedContracts,
      label: t('completed'),
      suffix: '+',
    },
    {
      icon: Star,
      gradient: 'from-purple-600 to-pink-600',
      value: stats.averageRating,
      label: t('rating'),
      suffix: '',
      decimals: 1,
    },
  ];

  return (
    <section className="px-6 py-16 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-50/50 to-transparent dark:via-purple-900/10" />

      <div className="max-w-6xl mx-auto relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statsConfig.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={index}
                className="text-center p-6 rounded-3xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 hover:scale-105 transition-transform duration-300"
              >
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                </div>

                {/* Value */}
                <div
                  className={`text-4xl font-bold bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent mb-2`}
                >
                  {loading ? (
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                  ) : (
                    <>
                      {stat.decimals
                        ? stat.value.toFixed(stat.decimals)
                        : stat.value.toLocaleString()}
                      {stat.suffix}
                    </>
                  )}
                </div>

                {/* Label */}
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
