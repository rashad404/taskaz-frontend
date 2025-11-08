'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Briefcase,
  MessageSquare,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Loader2,
  Star
} from 'lucide-react';
import { getStorageUrl } from '@/lib/utils/url';

export default function SettingsPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.lang as string) || 'az';

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProfessional, setIsProfessional] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push(`/${locale}/login`);
      return;
    }

    // Fetch user data
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setUser(data.data);
          setIsProfessional(data.data.professional_status === 'approved');
        }
      })
      .catch(err => {
        console.error('Failed to fetch user:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router, locale]);

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

  const baseSettingsMenu = [
    {
      id: 'profile',
      title: 'Profil Məlumatları',
      description: 'Şəxsi məlumatlarınızı və profil şəklinizi dəyişdirin',
      icon: User,
      href: `/${locale}/settings/profile`,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30'
    },
    {
      id: 'notifications',
      title: 'Bildirişlər',
      description: 'Email, SMS və push bildirişlərini idarə edin',
      icon: Bell,
      href: `/${locale}/settings/notifications`,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30'
    },
    {
      id: 'security',
      title: 'Təhlükəsizlik',
      description: 'Parol və hesab təhlükəsizliyi parametrləri',
      icon: Shield,
      href: `/${locale}/settings/security`,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      id: 'tasks',
      title: 'Mənim Tapşırıqlarım',
      description: 'Yaratdığınız və müraciət etdiyiniz tapşırıqlar',
      icon: Briefcase,
      href: `/${locale}/my-tasks`,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      id: 'messages',
      title: 'Mesajlar',
      description: 'Müştərilər və professionallərlə danışıqlar',
      icon: MessageSquare,
      href: `/${locale}/conversations`,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
      id: 'payments',
      title: 'Ödənişlər',
      description: 'Ödəniş metodları və əməliyyat tarixçəsi',
      icon: CreditCard,
      href: `/${locale}/settings/payments`,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/30'
    }
  ];

  // Add professional settings if user is an approved professional
  const settingsMenu = isProfessional
    ? [
        baseSettingsMenu[0], // Profile
        {
          id: 'professional',
          title: 'Peşəkar Profil',
          description: 'Peşəkar məlumatlarınızı və portfelinizi idarə edin',
          icon: Star,
          href: `/${locale}/settings/professional`,
          color: 'text-amber-600 dark:text-amber-400',
          bgColor: 'bg-amber-100 dark:bg-amber-900/30'
        },
        ...baseSettingsMenu.slice(1) // Rest of the menu
      ]
    : baseSettingsMenu;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Parametrlər
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Hesab parametrlərinizi və tərcihlərinizi idarə edin
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 sticky top-8">
              {/* Avatar */}
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-1">
                  <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img
                        src={getStorageUrl(user.avatar)}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                        {user.name?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {user.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
              </div>

              {/* Quick Info */}
              <div className="space-y-3 mb-6">
                {user.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                )}
              </div>

              {/* Edit Profile Button */}
              <Link
                href={`/${locale}/settings/profile`}
                className="w-full btn-primary py-2.5 px-4 text-center font-medium text-sm flex items-center justify-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Profili Redaktə Et
              </Link>
            </div>
          </div>

          {/* Settings Menu */}
          <div className="lg:col-span-2 space-y-4">
            {settingsMenu.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="block rounded-3xl p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${item.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${item.color}`} />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex-shrink-0" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
