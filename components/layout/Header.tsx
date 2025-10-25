'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useParams } from 'next/navigation';
import { Menu, X, CheckSquare, User, LogOut } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useTranslations } from 'next-intl';
import StartupBar from '@/components/common/StartupBar';

export default function Header() {
  const t = useTranslations();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  // Get locale from params (proper way for next-intl)
  const locale = (params?.lang as string) || 'az';

  // Check authentication status
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // You could fetch user data here
      setUser({ name: 'User', email: 'user@example.com' });
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    // Check on mount and route changes
    checkAuth();
    setIsMounted(true);

    // Listen for auth state changes (from modal login/register)
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('authStateChanged', handleAuthChange);

    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);

    // Dispatch event to notify other components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('authStateChanged'));
    }

    router.push('/');
  };

  return (
    <header className="sticky top-0 z-[100] bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <StartupBar />
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[1px] transition-transform group-hover:scale-105 duration-300">
                <div className="w-full h-full rounded-2xl bg-white dark:bg-gray-900 flex items-center justify-center">
                  <div className="relative">
                    <CheckSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" strokeWidth={2} fill="none" />
                    <div className="absolute inset-0 w-5 h-5">
                      <CheckSquare className="w-5 h-5 text-purple-500 opacity-50" strokeWidth={2} fill="none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <span className="gradient-text text-lg font-bold">Task.az</span>
          </Link>

          {/* Desktop Navigation */}
          <div className={`hidden md:flex items-center gap-6 transition-opacity duration-300 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
            {isAuthenticated && (
              <Link
                href={`/${locale}/dashboard`}
                className={`text-sm font-medium transition-colors ${
                  pathname === '/dashboard'
                    ? 'text-[rgb(81,91,195)]'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t('nav.dashboard')}
              </Link>
            )}

            <ThemeToggle />

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  href={`/${locale}/settings`}
                  className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href={`/${locale}/login`}
                  className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {t('nav.signIn')}
                </Link>
                <Link
                  href={`/${locale}/register`}
                  className="px-4 py-1.5 bg-[rgb(81,91,195)] text-white text-sm font-medium rounded-lg hover:bg-[rgb(61,71,175)] transition-colors"
                >
                  {t('nav.getStarted')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && isMounted && (
          <div className="md:hidden py-3 border-t border-gray-200 dark:border-gray-800">
            {isAuthenticated ? (
              <div className="space-y-1">
                <Link
                  href={`/${locale}/dashboard`}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.dashboard')}
                </Link>
                <Link
                  href={`/${locale}/settings`}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.settings')}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <Link
                  href={`/${locale}/login`}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.signIn')}
                </Link>
                <Link
                  href={`/${locale}/register`}
                  className="block px-3 py-2 text-sm font-medium text-white bg-[rgb(81,91,195)] hover:bg-[rgb(61,71,175)] rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.getStarted')}
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}