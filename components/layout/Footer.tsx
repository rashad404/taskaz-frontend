'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getLocalizedPath } from '@/lib/utils/locale';

export default function Footer() {
  const t = useTranslations();
  const params = useParams();
  const lang = (params?.lang as string) || 'az';
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: t('footer.links.about'), href: getLocalizedPath(lang, '/about') },
      { name: t('footer.links.contact'), href: getLocalizedPath(lang, '/contact') },
      { name: t('footer.links.faq'), href: getLocalizedPath(lang, '/faq') },
    ],
    legal: [
      { name: t('footer.links.terms'), href: getLocalizedPath(lang, '/terms') },
      { name: t('footer.links.privacy'), href: getLocalizedPath(lang, '/privacy') },
    ],
    services: [
      { name: t('nav.tasks'), href: getLocalizedPath(lang, '/tasks') },
      { name: t('nav.professionals'), href: getLocalizedPath(lang, '/professionals') },
      { name: t('nav.createTask'), href: getLocalizedPath(lang, '/tasks/create') },
    ],
  };

  return (
    <footer className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Task.az
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('footer.description')}
            </p>
            <div className="flex flex-col space-y-2 text-sm">
              <a
                href="mailto:info@task.az"
                className="text-gray-600 dark:text-gray-400 hover:text-[rgb(81,91,195)] transition-colors flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                info@task.az
              </a>
              <a
                href="tel:+994123456789"
                className="text-gray-600 dark:text-gray-400 hover:text-[rgb(81,91,195)] transition-colors flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                +994 12 345 67 89
              </a>
              <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {t('footer.location')}
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              {t('footer.sections.company')}
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-[rgb(81,91,195)] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              {t('footer.sections.services')}
            </h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-[rgb(81,91,195)] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              {t('footer.sections.legal')}
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-[rgb(81,91,195)] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
              © {currentYear} Task.az. {t('footer.allRightsReserved')}
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link
                href={getLocalizedPath(lang, '/terms')}
                className="text-gray-600 dark:text-gray-400 hover:text-[rgb(81,91,195)] transition-colors"
              >
                {t('footer.links.terms')}
              </Link>
              <Link
                href={getLocalizedPath(lang, '/privacy')}
                className="text-gray-600 dark:text-gray-400 hover:text-[rgb(81,91,195)] transition-colors"
              >
                {t('footer.links.privacy')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}