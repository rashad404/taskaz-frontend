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
  ArrowRight,
  X,
  LayoutDashboard,
  Menu
} from 'lucide-react';
import { getLocalizedPath } from '@/lib/utils/locale';
import TaskStatusBadge from '@/components/tasks/TaskStatusBadge';

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
  const [dismissedProApproval, setDismissedProApproval] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push(getLocalizedPath(locale, '/login'));
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

        // Fetch announcement statuses from API
        const announcementsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/announcements`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (announcementsRes.ok) {
          const announcementsData = await announcementsRes.json();
          const professionalApprovalStatus = announcementsData.data?.professional_approval;

          if (professionalApprovalStatus?.dismissed) {
            setDismissedProApproval(true);
            // Sync to localStorage for instant UX on next load
            localStorage.setItem('dismissedProApproval', 'true');
          } else {
            // Check localStorage as fallback for instant UX
            const dismissed = localStorage.getItem('dismissedProApproval');
            if (dismissed === 'true') {
              setDismissedProApproval(true);
            }
          }
        } else {
          // Fallback to localStorage if API fails
          const dismissed = localStorage.getItem('dismissedProApproval');
          if (dismissed === 'true') {
            setDismissedProApproval(true);
          }
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

  const handleDismissProApproval = async () => {
    const token = localStorage.getItem('token');

    // Instant UI update
    setDismissedProApproval(true);
    localStorage.setItem('dismissedProApproval', 'true');

    // Background sync to database
    if (token) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/announcements/dismiss`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ type: 'professional_approval' })
        });
      } catch (error) {
        console.error('Failed to sync dismissal to server:', error);
        // Don't revert UI state - user already dismissed it locally
      }
    }
  };

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

  const navigationItems = [
    {
      name: 'İdarə Paneli',
      href: getLocalizedPath(locale, '/dashboard'),
      icon: LayoutDashboard,
      active: true
    },
    {
      name: 'Mənim Tapşırıqlarım',
      href: getLocalizedPath(locale, '/my-tasks'),
      icon: Briefcase,
      badge: stats.myTasks
    },
    {
      name: 'Mesajlar',
      href: getLocalizedPath(locale, '/conversations'),
      icon: MessageSquare,
      badge: stats.unreadMessages
    },
    ...(professionalStatus?.professional_status === 'approved' ? [{
      name: 'Peşəkar Profil',
      href: getLocalizedPath(locale, '/settings/professional'),
      icon: Star,
      isPro: true
    }] : [])
  ];

  return (
    <div className="min-h-screen">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-[110] h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Top spacer to match StartupBar height */}
          <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="py-2 px-6">
              <div className="h-5"></div>
            </div>
          </div>

          {/* Sidebar Header */}
          <div className="px-6 py-[24px] border-b border-gray-200 dark:border-gray-800 flex items-center bg-[#f5f8ff] dark:bg-gray-900">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menu</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                    item.active
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                      : item.isPro
                      ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-1 text-xs font-bold rounded-full bg-indigo-600 text-white">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile in Sidebar */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <Link
              href={getLocalizedPath(locale, '/settings')}
              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  Parametrlər
                </p>
              </div>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        <div className="py-8 px-4 sm:px-6">
          {/* Mobile Header with Menu Button */}
          <div className="lg:hidden mb-6 flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              İdarə Paneli
            </h1>
          </div>

          <div className="max-w-7xl mx-auto">
            {/* Header - Desktop Only */}
            <div className="mb-12 hidden lg:block">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Xoş gəldiniz, {user.name}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                İşlərinizi və professionallərinizi burada idarə edin
              </p>
            </div>

            {/* Quick Actions */}
            <div className="mb-12 flex flex-wrap gap-4">
              <Link
                href={getLocalizedPath(locale, '/tasks/create')}
                className="inline-flex items-center gap-2 btn-primary group"
              >
                <Plus className="w-5 h-5" />
                <span>Tapşırıq Yarat</span>
              </Link>

              <Link
                href={getLocalizedPath(locale, '/professionals')}
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
              <Link href={getLocalizedPath(locale, '/become-professional')}>
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
            {professionalStatus.professional_status === 'approved' && !dismissedProApproval && (
              <div className="rounded-3xl p-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 relative">
                <button
                  onClick={handleDismissProApproval}
                  className="absolute top-4 right-4 p-1 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                  aria-label="Bağla"
                >
                  <X className="w-5 h-5 text-green-600 dark:text-green-400" />
                </button>
                <div className="flex items-start gap-4 pr-8">
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
                    <div className="flex flex-wrap items-center gap-3 mt-4">
                      <Link
                        href={getLocalizedPath(locale, `/professionals/${user?.slug}`)}
                        className="inline-flex items-center gap-2 text-green-700 dark:text-green-300 font-medium hover:text-green-900 dark:hover:text-green-100"
                      >
                        Profilə bax <ArrowRight className="w-4 h-4" />
                      </Link>
                      <Link
                        href={getLocalizedPath(locale, '/settings/professional')}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
                      >
                        <Star className="w-4 h-4" />
                        Profili İdarə Et
                      </Link>
                    </div>
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
                      href={getLocalizedPath(locale, '/become-professional')}
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
              Mənim Tapşırıqlarım
            </h2>
            <Link
              href={getLocalizedPath(locale, '/my-tasks')}
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
                  İlk tapşırığınızı yaradın və ən yaxşı professionalləri tapın
                </p>
                <Link
                  href={getLocalizedPath(locale, '/tasks/create')}
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
                  href={getLocalizedPath(locale, `/tasks/${task.slug}`)}
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
                  <TaskStatusBadge task={task} className="whitespace-nowrap" />
                </Link>
                ))
              )}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
