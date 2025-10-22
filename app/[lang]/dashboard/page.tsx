'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Briefcase,
  Plus,
  Users,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  FileText,
  Search,
  Loader2,
  AlertCircle,
  Star,
  ArrowRight
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.lang as string) || 'az';

  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    myTasks: 0,
    applications: 0,
    activeContracts: 0,
    unreadMessages: 0
  });
  const [professionalStatus, setProfessionalStatus] = useState<any>(null);
  const [recentTasks, setRecentTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push(`/${locale}/login`);
      return;
    }

    // Fetch user data
    const fetchData = async () => {
      try {
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData.data);
        }

        // Fetch my tasks
        const tasksRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/my-tasks`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          setRecentTasks(tasksData.data?.data?.slice(0, 3) || []);
          setStats(prev => ({ ...prev, myTasks: tasksData.data?.total || 0 }));
        }

        // Fetch my applications
        const appsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/my-applications`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (appsRes.ok) {
          const appsData = await appsRes.json();
          setStats(prev => ({ ...prev, applications: appsData.data?.total || 0 }));
        }

        // Fetch contracts
        const contractsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contracts`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (contractsRes.ok) {
          const contractsData = await contractsRes.json();
          // Handle both paginated and direct array responses
          const contracts = Array.isArray(contractsData.data)
            ? contractsData.data
            : (contractsData.data?.data || []);
          const activeContracts = contracts.filter((c: any) => c.status === 'active').length || 0;
          setStats(prev => ({ ...prev, activeContracts }));
        }

        // Fetch unread messages count
        const messagesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/unread-count`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (messagesRes.ok) {
          const messagesData = await messagesRes.json();
          setStats(prev => ({ ...prev, unreadMessages: messagesData.data?.unread_count || 0 }));
        }

        // Fetch professional status
        const professionalRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/professional/status`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (professionalRes.ok) {
          const professionalData = await professionalRes.json();
          setProfessionalStatus(professionalData.data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router, locale]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Xoş gəldiniz, {user.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            İşlərinizi və freelancerlərinizi burada idarə edin
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-12 flex flex-wrap gap-4">
          <Link
            href={`/${locale}/tasks/create`}
            className="inline-flex items-center gap-2 btn-primary group"
          >
            <Plus className="w-5 h-5" />
            <span>Tapşırıq Yarat</span>
          </Link>

          <Link
            href={`/${locale}/professionals`}
            className="inline-flex items-center gap-2 btn-secondary group"
          >
            <Search className="w-5 h-5" />
            <span>Peşəkar Tap</span>
          </Link>
        </div>

        {/* Professional Status Widget */}
        {professionalStatus && (
          <div className="mb-12">
            {/* Not Applied */}
            {professionalStatus.can_apply && !professionalStatus.professional_status && (
              <Link href={`/${locale}/become-professional`}>
                <div className="group relative cursor-pointer">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-90 group-hover:opacity-100 transition-all duration-500" />
                  <div className="relative rounded-3xl p-8 text-white">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center">
                        <Star className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2">Peşəkar Olun</h3>
                        <p className="text-white/90">
                          Platformamızda peşəkar kimi özünüzü göstərin və işlər qazanmağa başlayın
                        </p>
                      </div>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Pending */}
            {professionalStatus.professional_status === 'pending' && (
              <div className="rounded-3xl p-6 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-yellow-900 dark:text-yellow-100 mb-1">
                      Təsdiqlənir
                    </h3>
                    <p className="text-yellow-700 dark:text-yellow-300">
                      Peşəkar müraciətiniz nəzərdən keçirilir. Tezliklə məlumatlandırılacaqsınız.
                    </p>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
                      Müraciət tarixi: {new Date(professionalStatus.application_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Approved */}
            {professionalStatus.professional_status === 'approved' && (
              <div className="rounded-3xl p-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-green-900 dark:text-green-100 mb-1">
                      Təbriklər! Siz artıq peşəkarsınız
                    </h3>
                    <p className="text-green-700 dark:text-green-300">
                      Peşəkar profiliniz təsdiqləndi. İndi tapşırıqlara müraciət edə bilərsiniz.
                    </p>
                    <Link
                      href={`/${locale}/professionals/${user?.slug}`}
                      className="inline-flex items-center gap-2 mt-4 text-green-700 dark:text-green-300 font-medium hover:text-green-900 dark:hover:text-green-100"
                    >
                      Profilə bax <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Rejected */}
            {professionalStatus.professional_status === 'rejected' && (
              <div className="rounded-3xl p-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/50 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-red-900 dark:text-red-100 mb-1">
                      Müraciət Rədd Edildi
                    </h3>
                    <p className="text-red-700 dark:text-red-300 mb-2">
                      Səbəb: {professionalStatus.rejected_reason || 'Göstərilməyib'}
                    </p>
                    <Link
                      href={`/${locale}/become-professional`}
                      className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                    >
                      Yenidən Müraciət Et <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* My Tasks */}
          <div className="rounded-3xl p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.myTasks}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Mənim Tapşırıqlarım</div>
          </div>

          {/* Applications */}
          <div className="rounded-3xl p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.applications}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Müraciətlərim</div>
          </div>

          {/* Active Contracts */}
          <div className="rounded-3xl p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.activeContracts}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Aktiv İşlər</div>
          </div>

          {/* Messages */}
          <div className="rounded-3xl p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center relative">
                <MessageSquare className="w-6 h-6 text-white" />
                {stats.unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {stats.unreadMessages > 9 ? '9+' : stats.unreadMessages}
                  </span>
                )}
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.unreadMessages}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Oxunmamış Mesajlar</div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="rounded-3xl p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Son Tapşırıqlar
            </h2>
            <Link
              href={`/${locale}/my-tasks`}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm font-medium"
            >
              Hamısına bax →
            </Link>
          </div>

          <div className="space-y-4">
            {recentTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 relative">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-500 opacity-20 blur-xl" />
                  <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-500 p-[1px]">
                    <div className="w-full h-full rounded-3xl bg-white dark:bg-gray-900 flex items-center justify-center">
                      <Briefcase className="w-8 h-8 text-gray-900 dark:text-white" />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Hələ tapşırıq yoxdur
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  İlk tapşırığınızı yaradın və ən yaxşı freelancerləri tapın
                </p>
                <Link
                  href={`/${locale}/tasks/create`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <Plus className="w-5 h-5" />
                  İlk Tapşırığı Yarat
                </Link>
              </div>
            ) : (
              recentTasks.map((task) => (
                <Link
                  key={task.id}
                  href={`/${locale}/tasks/${task.slug}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all"
                >
                  {/* Icon */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 p-[1px]">
                      <div className="w-full h-full rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-gray-900 dark:text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {task.budget_amount} AZN • {task.applications_count || 0} müraciət
                    </p>
                  </div>

                  {/* Status */}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    task.status === 'open'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : task.status === 'assigned'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {task.status === 'open' ? 'Açıq' : task.status === 'assigned' ? 'Təyin edilib' : 'Tamamlandı'}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href={`/${locale}/my-tasks`}
            className="rounded-3xl p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 hover:scale-105 transition-transform duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  Tapşırıqlarım
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Bütün tapşırıqlarınızı görün
                </p>
              </div>
            </div>
          </Link>

          <Link
            href={`/${locale}/conversations`}
            className="rounded-3xl p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 hover:scale-105 transition-transform duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center relative">
                <MessageSquare className="w-6 h-6 text-white" />
                {stats.unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {stats.unreadMessages > 9 ? '9+' : stats.unreadMessages}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  Mesajlar
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Danışıqlarınız
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
