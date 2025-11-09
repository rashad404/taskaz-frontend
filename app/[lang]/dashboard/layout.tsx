'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useRouter, useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  Star,
  Menu,
  X,
  Loader2,
  LogOut,
  User
} from 'lucide-react';
import { getLocalizedPath } from '@/lib/utils/locale';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const locale = (params?.lang as string) || 'az';

  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    myTasks: 0,
    applications: 0,
    unreadMessages: 0
  });
  const [professionalStatus, setProfessionalStatus] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
          credentials: 'include'
        });

        if (userRes.status === 401) {
          router.push(getLocalizedPath(locale, '/login'));
          return;
        }

        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData.data);
        }

        // Fetch stats in parallel
        const [tasksRes, appsRes, messagesRes, professionalRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/my-tasks`, { credentials: 'include' }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/my-applications`, { credentials: 'include' }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/unread-count`, { credentials: 'include' }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/professional/status`, { credentials: 'include' })
        ]);

        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          setStats(prev => ({ ...prev, myTasks: tasksData.data?.total || 0 }));
        }

        if (appsRes.ok) {
          const appsData = await appsRes.json();
          setStats(prev => ({ ...prev, applications: appsData.data?.total || 0 }));
        }

        if (messagesRes.ok) {
          const messagesData = await messagesRes.json();
          setStats(prev => ({ ...prev, unreadMessages: messagesData.data?.unread_count || 0 }));
        }

        if (professionalRes.ok) {
          const professionalData = await professionalRes.json();
          setProfessionalStatus(professionalData.data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router, locale]);

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      router.push(getLocalizedPath(locale, '/'));
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const navigationItems = [
    {
      id: 'dashboard',
      name: 'İdarə Paneli',
      href: getLocalizedPath(locale, '/dashboard'),
      icon: LayoutDashboard,
    },
    {
      id: 'tasks',
      name: 'Mənim Tapşırıqlarım',
      href: getLocalizedPath(locale, '/dashboard/tasks'),
      icon: Briefcase,
      badge: stats.myTasks
    },
    {
      id: 'applications',
      name: 'Müraciətlərim',
      href: getLocalizedPath(locale, '/dashboard/applications'),
      icon: FileText,
      badge: stats.applications
    },
    {
      id: 'messages',
      name: 'Mesajlar',
      href: getLocalizedPath(locale, '/dashboard/messages'),
      icon: MessageSquare,
      badge: stats.unreadMessages
    },
    ...(professionalStatus?.professional_status === 'approved' ? [{
      id: 'professional',
      name: 'Peşəkar Profil',
      href: getLocalizedPath(locale, '/dashboard/settings/professional'),
      icon: Star,
      isPro: true
    }] : [])
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Determine active page from pathname
  const getActiveId = () => {
    if (pathname?.includes('/dashboard/tasks')) return 'tasks';
    if (pathname?.includes('/dashboard/applications')) return 'applications';
    if (pathname?.includes('/dashboard/messages')) return 'messages';
    if (pathname?.includes('/dashboard/settings/professional')) return 'professional';
    return 'dashboard';
  };

  const activeId = getActiveId();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
            <Link href={getLocalizedPath(locale, '/')} className="flex items-center">
              <Image
                src="/assets/images/logo.svg"
                alt="Task.az"
                width={152}
                height={30}
                className="h-7 w-auto object-contain"
                priority
              />
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeId;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                      : item.isPro
                      ? 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{item.name}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs font-bold rounded-full min-w-[20px] text-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            {/* User Info */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Link
                href={getLocalizedPath(locale, '/dashboard/settings/profile')}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors"
              >
                <User className="w-4 h-4" />
                Profil
              </Link>
              <button
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 border border-gray-200 dark:border-gray-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Çıxış
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Mobile header - only hamburger */}
        <div className="lg:hidden sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-16 px-4 flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
