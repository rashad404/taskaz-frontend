'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Briefcase,
  Clock,
  Loader2,
  Wallet,
  Filter,
  FileText
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function MyApplicationsPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.lang as string) || 'az';

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  // Strip HTML tags from description
  const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').trim();
  };

  useEffect(() => {
    // Fetch my applications
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/my-applications`, {
      credentials: 'include'
    })
      .then(res => {
        if (res.status === 401) {
          router.push(`/${locale}/login`);
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data && data.status === 'success') {
          setApplications(data.data?.data || []);
        }
      })
      .catch(err => {
        console.error('Failed to fetch applications:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router, locale]);

  const filteredApplications = filter === 'all'
    ? applications
    : applications.filter(app => app.status === filter);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300', label: 'Gözləyir' },
      accepted: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', label: 'Qəbul edildi' },
      rejected: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', label: 'Rədd edildi' },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <DashboardLayout activePage="my-applications" title="Müraciətlərim">
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : (
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Müraciətlərim
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tapşırıqlara göndərdiyiniz bütün müraciətlər
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-white/80 dark:bg-gray-900/80 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            Hamısı ({applications.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-white/80 dark:bg-gray-900/80 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            Gözləyir ({applications.filter(a => a.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('accepted')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === 'accepted'
                ? 'bg-green-600 text-white'
                : 'bg-white/80 dark:bg-gray-900/80 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            Qəbul edildi ({applications.filter(a => a.status === 'accepted').length})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === 'rejected'
                ? 'bg-red-600 text-white'
                : 'bg-white/80 dark:bg-gray-900/80 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            Rədd edildi ({applications.filter(a => a.status === 'rejected').length})
          </button>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="text-center py-16 rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 relative">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 opacity-20 blur-xl" />
              <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 p-[1px]">
                <div className="w-full h-full rounded-3xl bg-white dark:bg-gray-900 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-900 dark:text-white" />
                </div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {filter === 'all' ? 'Hələ müraciət yoxdur' : `${filter === 'pending' ? 'Gözləyən' : filter === 'accepted' ? 'Qəbul edilmiş' : 'Rədd edilmiş'} müraciət yoxdur`}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filter === 'all' ? 'Tapşırıqlara müraciət edin' : 'Bu filtrdə müraciət yoxdur'}
            </p>
            {filter === 'all' && (
              <Link
                href={`/${locale}/tasks`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <Briefcase className="w-5 h-5" />
                Tapşırıqlara Bax
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredApplications.map((application) => (
              <div
                key={application.id}
                className="rounded-3xl p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 hover:border-purple-200 dark:hover:border-purple-800 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <Link href={`/${locale}/tasks/${application.task?.slug}`}>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {application.task?.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      <span className="font-medium">Təklifiniz:</span> {application.cover_letter}
                    </p>
                    {application.proposed_amount && (
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Təklif etdiyiniz məbləğ:</span> {application.proposed_amount} AZN
                      </p>
                    )}
                  </div>
                  <div className="ml-4">
                    {getStatusBadge(application.status)}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  {application.task?.budget_amount && (
                    <div className="flex items-center gap-1.5">
                      <Wallet className="w-4 h-4" />
                      <span className="font-semibold">{application.task.budget_amount} AZN</span>
                      {application.task.budget_type === 'hourly' && <span className="text-xs">(saatlıq)</span>}
                    </div>
                  )}

                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>Müraciət tarixi: {new Date(application.created_at).toLocaleDateString('az-AZ')}</span>
                  </div>

                  {application.task?.category && (
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-medium">
                      {application.task.category.name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      )}
    </DashboardLayout>
  );
}
