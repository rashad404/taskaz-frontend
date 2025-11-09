'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  Star,
  Menu,
  X,
  Loader2
} from 'lucide-react';
import { getLocalizedPath } from '@/lib/utils/locale';

interface DashboardLayoutProps {
  children: ReactNode;
  activePage?: 'dashboard' | 'my-tasks' | 'my-applications' | 'conversations' | 'settings' | 'professional';
  title?: string;
}

export default function DashboardLayout({ children, activePage = 'dashboard', title }: DashboardLayoutProps) {
  const router = useRouter();
  const params = useParams();
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

  const navigationItems = [
    {
      id: 'dashboard',
      name: 'İdarə Paneli',
      href: getLocalizedPath(locale, '/dashboard'),
      icon: LayoutDashboard,
    },
    {
      id: 'my-tasks',
      name: 'Mənim Tapşırıqlarım',
      href: getLocalizedPath(locale, '/my-tasks'),
      icon: Briefcase,
      badge: stats.myTasks
    },
    {
      id: 'my-applications',
      name: 'Müraciətlərim',
      href: getLocalizedPath(locale, '/my-applications'),
      icon: FileText,
      badge: stats.applications
    },
    {
      id: 'conversations',
      name: 'Mesajlar',
      href: getLocalizedPath(locale, '/conversations'),
      icon: MessageSquare,
      badge: stats.unreadMessages
    },
    ...(professionalStatus?.professional_status === 'approved' ? [{
      id: 'professional',
      name: 'Peşəkar Profil',
      href: getLocalizedPath(locale, '/settings/professional'),
      icon: Star,
      isPro: true
    }] : [])
  ];

  if (loading) {
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
              const isActive = item.id === activePage;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                    isActive
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
          {title && (
            <div className="lg:hidden mb-6 flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {title}
              </h1>
            </div>
          )}

          {/* Page Content */}
          {children}
        </div>
      </div>
    </div>
  );
}
