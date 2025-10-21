'use client';

import { Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Footer Content - Single Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Copyright */}
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} Task.az {t('footer.allRightsReserved')}
            </p>
          </div>

          {/* Center: Spacer */}
          <div className="flex-1"></div>

          {/* Right: Contact */}
          <div className="flex items-center gap-4 text-sm">
            <a
              href="mailto:info@task.az"
              className="text-gray-600 dark:text-gray-400 hover:text-[rgb(81,91,195)] transition-colors flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">info@task.az</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}