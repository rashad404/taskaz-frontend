'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useParams } from 'next/navigation';
import { Menu, X, User, LogOut } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useTranslations } from 'next-intl';
import StartupBar from '@/components/common/StartupBar';
import Image from 'next/image';

export default function Header() {
  const t = useTranslations();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const locale = (params?.lang as string) || 'az';

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      setUser({ name: 'User', email: 'user@example.com' });
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
    setIsMounted(true);

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

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('authStateChanged'));
    }

    router.push('/');
  };

  return (
    <header className="sticky top-0 z-[100] bg-[#f5f8ff] dark:bg-gray-900">
      <StartupBar />
      <nav className="relative bg-[#f5f8ff] dark:bg-gray-900 min-h-[78px]">
        {/* Desktop Header - Responsive */}
        <div className={`hidden md:flex absolute left-1/2 top-0 -translate-x-1/2 w-full max-w-[1200px] px-4 md:px-8 lg:px-0 border-b border-solid border-[rgba(0,0,0,0.1)] dark:border-gray-800 items-center justify-between py-[24px] transition-opacity duration-300 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <div className="w-[120px] md:w-[140px] lg:w-[152px] h-[24px] md:h-[28px] lg:h-[30px]">
              <Image
                src="/assets/images/logo.svg"
                alt="Task.az"
                width={152}
                height={30}
                className="block max-w-none w-full h-full"
                priority
              />
            </div>
          </Link>

          {/* Center + Right section - Responsive */}
          <div className="flex items-center justify-between flex-1 ml-4 md:ml-8 lg:ml-[54px]">
            {/* Left Navigation Links */}
            <div className="flex items-center gap-[12px] md:gap-[16px] lg:gap-[21px] font-semibold text-[14px] md:text-[15px] lg:text-[16px] leading-[20px] text-black dark:text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
              <Link
                href={`/${locale}/tasks`}
                className="shrink-0 hover:opacity-80 transition-opacity"
              >
                Tapşırıqlar
              </Link>
              <Link
                href={`/${locale}/professionals`}
                className="shrink-0 hover:opacity-80 transition-opacity"
              >
                Peşəkarlar
              </Link>
            </div>

            {/* Right Side - Auth & Actions */}
            <div className="flex items-center gap-[12px] md:gap-[16px] lg:gap-[20px]">
              {isAuthenticated ? (
                <>
                  <Link
                    href={`/${locale}/dashboard`}
                    className="shrink-0 font-semibold text-[14px] md:text-[15px] lg:text-[16px] leading-[20px] text-black dark:text-white hover:opacity-80 transition-opacity"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {t('nav.dashboard')}
                  </Link>
                  <div className="flex items-center gap-2 md:gap-3">
                    <Link
                      href={`/${locale}/settings`}
                      className="w-7 h-7 md:w-8 md:h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-600 dark:text-gray-400" />
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="shrink-0 font-semibold text-[14px] md:text-[15px] lg:text-[16px] leading-[20px] text-black dark:text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <Link href={`/${locale}/login`} className="hover:opacity-80 transition-opacity">
                      Daxil ol
                    </Link>
                  </p>
                  <div className="flex items-center gap-[8px]">
                    <Link
                      href={`/${locale}/tasks/create`}
                      className="flex items-center justify-center gap-[3px] md:gap-[4px] bg-black dark:bg-white px-[12px] md:px-[15px] h-[36px] md:h-[40px] rounded-[8px] hover:opacity-90 transition-opacity"
                      style={{ boxShadow: '0px 2px 0px 0px rgba(5,145,255,0.1)' }}
                    >
                      <div className="w-[20px] md:w-[24px] h-[18px] md:h-[22px] shrink-0">
                        <Image
                          src="/assets/images/plus-icon.svg"
                          alt=""
                          width={24}
                          height={22}
                          className="block max-w-none w-full h-full"
                        />
                      </div>
                      <p className="shrink-0 font-normal text-[14px] md:text-[16px] leading-[20px] md:leading-[24px] text-white dark:text-black" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Task aç
                      </p>
                    </Link>
                  </div>
                </>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-4 py-[24px]">
          <Link href="/" className="shrink-0">
            <div className="w-[120px] h-[24px]">
              <Image
                src="/assets/images/logo.svg"
                alt="Task.az"
                width={120}
                height={24}
                className="block max-w-none w-full h-full"
              />
            </div>
          </Link>

          <div className="flex items-center gap-3">
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

        {/* Mobile Navigation Menu */}
        {isMenuOpen && isMounted && (
          <div className="md:hidden py-3 border-t border-gray-200 dark:border-gray-800 px-4">
            <div className="space-y-1">
              <Link
                href={`/${locale}/tasks`}
                className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Tapşırıqlar
              </Link>
              <Link
                href={`/${locale}/professionals`}
                className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Peşəkarlar
              </Link>
              {isAuthenticated ? (
                <>
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
                </>
              ) : (
                <>
                  <Link
                    href={`/${locale}/login`}
                    className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Daxil ol
                  </Link>
                  <Link
                    href={`/${locale}/tasks/create`}
                    className="block px-3 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Task aç
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
