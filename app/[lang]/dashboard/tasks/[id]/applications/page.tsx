'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft,
  Loader2,
  Briefcase,
  User,
  MapPin,
  DollarSign,
  FileText,
  Check,
  X as XIcon,
  Star,
  Calendar,
  Clock
} from 'lucide-react';
import { getStorageUrl } from '@/lib/utils/url';
import { getLocalizedPath } from '@/lib/utils/locale';

interface Application {
  id: number;
  cover_letter: string;
  proposed_amount: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  professional: {
    id: number;
    name: string;
    slug: string;
    email: string;
    phone: string | null;
    avatar: string | null;
    bio: string | null;
    location: string | null;
    rating: number | null;
    completed_tasks_count: number;
  };
}

interface Task {
  id: number;
  title: string;
  slug: string;
  budget_amount: string;
  budget_type: string;
  status: string;
  applications_count: number;
}

export default function TaskApplicationsPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.lang as string) || 'az';
  const taskId = params?.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  useEffect(() => {
    if (!taskId) return;

    // Fetch task details and applications
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`, {
        credentials: 'include'
      }),
    ])
      .then(([taskRes]) => {
        if (taskRes.status === 401) {
          router.push(getLocalizedPath(locale, '/login'));
          return;
        }
        return Promise.all([taskRes.json()]);
      })
      .then(([taskData]) => {
        if (taskData && taskData.status === 'success') {
          const taskInfo = taskData.data;
          setTask(taskInfo);
          setApplications(taskInfo.applications || []);
        }
      })
      .catch(err => {
        console.error('Failed to fetch data:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [taskId, router, locale]);

  const handleAccept = async (applicationId: number) => {
    if (!confirm('Bu müraciəti qəbul etmək istədiyinizə əminsiniz? Bu, digər bütün müraciətləri rədd edəcək.')) {
      return;
    }

    setActionLoading(applicationId);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/${applicationId}/accept`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Update local state
        setApplications(prev =>
          prev.map(app =>
            app.id === applicationId
              ? { ...app, status: 'accepted' as const }
              : { ...app, status: 'rejected' as const }
          )
        );
        alert('Müraciət qəbul edildi!');
      } else {
        alert(data.message || 'Xəta baş verdi');
      }
    } catch (error) {
      console.error('Error accepting application:', error);
      alert('Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (applicationId: number) => {
    if (!confirm('Bu müraciəti rədd etmək istədiyinizə əminsiniz?')) {
      return;
    }

    setActionLoading(applicationId);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/${applicationId}/reject`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Update local state
        setApplications(prev =>
          prev.map(app =>
            app.id === applicationId ? { ...app, status: 'rejected' as const } : app
          )
        );
        alert('Müraciət rədd edildi');
      } else {
        alert(data.message || 'Xəta baş verdi');
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert('Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
    } finally {
      setActionLoading(null);
    }
  };

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

  const filteredApplications = filter === 'all'
    ? applications
    : applications.filter(app => app.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Tapşırıq tapılmadı
        </h3>
        <Link
          href={getLocalizedPath(locale, '/dashboard/tasks')}
          className="text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Tapşırıqlara qayıt
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Back Button */}
      <Link
        href={getLocalizedPath(locale, '/dashboard/tasks')}
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        Tapşırıqlara qayıt
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {task.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span className="font-semibold">{task.budget_amount} AZN</span>
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                <span>{task.budget_type === 'fixed' ? 'Sabit' : 'Saatlıq'}</span>
              </div>
            </div>
          </div>
          <Link
            href={getLocalizedPath(locale, `/tasks/${task.slug}`)}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Tapşırığa bax
          </Link>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Bu tapşırığa gələn müraciətlər ({applications.length})
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
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
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {filter === 'all' ? 'Hələ müraciət yoxdur' : `${filter === 'pending' ? 'Gözləyən' : filter === 'accepted' ? 'Qəbul edilmiş' : 'Rədd edilmiş'} müraciət yoxdur`}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {filter === 'all' ? 'Peşəkarlar tərəfindən müraciət gözlənilir' : 'Bu filtrdə müraciət yoxdur'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <div
              key={application.id}
              className="rounded-3xl p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all"
            >
              {/* Professional Info */}
              <div className="flex items-start gap-4 mb-4">
                {/* Avatar */}
                <Link
                  href={getLocalizedPath(locale, `/professionals/${application.professional.slug}`)}
                  className="flex-shrink-0"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold overflow-hidden hover:scale-105 transition-transform">
                    {application.professional.avatar ? (
                      <img
                        src={getStorageUrl(application.professional.avatar)}
                        alt={application.professional.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{application.professional.name.charAt(0)}</span>
                    )}
                  </div>
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <Link
                        href={getLocalizedPath(locale, `/professionals/${application.professional.slug}`)}
                        className="text-lg font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        {application.professional.name}
                      </Link>
                      {application.professional.rating && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {application.professional.rating.toFixed(1)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({application.professional.completed_tasks_count} tamamlanmış)
                          </span>
                        </div>
                      )}
                    </div>
                    {getStatusBadge(application.status)}
                  </div>

                  {/* Contact Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {application.professional.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{application.professional.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(application.created_at).toLocaleDateString('az-AZ', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Bio */}
                  {application.professional.bio && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {application.professional.bio}
                    </p>
                  )}

                  {/* Cover Letter */}
                  {application.cover_letter && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Təklif məktubu:
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                        {application.cover_letter}
                      </p>
                    </div>
                  )}

                  {/* Proposed Amount */}
                  {application.proposed_amount && (
                    <div className="flex items-center gap-2 mb-4">
                      <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        Təklif olunan məbləğ:
                      </span>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        {application.proposed_amount} AZN
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {application.status === 'pending' && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleAccept(application.id)}
                        disabled={actionLoading !== null}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === application.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Yüklənir...
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            Qəbul Et
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleReject(application.id)}
                        disabled={actionLoading !== null}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === application.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Yüklənir...
                          </>
                        ) : (
                          <>
                            <XIcon className="w-4 h-4" />
                            Rədd Et
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
