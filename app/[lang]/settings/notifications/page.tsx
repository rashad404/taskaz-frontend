'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Save,
  Loader2,
  ChevronLeft
} from 'lucide-react';

export default function NotificationSettingsPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.lang as string) || 'az';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [settings, setSettings] = useState({
    email: true,
    sms: false,
    push: true
  });

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push(`/${locale}/login`);
      return;
    }

    // Fetch user data including notification preferences
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && data.data) {
          const prefs = data.data.notification_preferences || {};
          setSettings({
            email: prefs.email ?? true,
            sms: prefs.sms ?? false,
            push: prefs.push ?? true
          });
        }
      })
      .catch(err => {
        console.error('Failed to fetch notification settings:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router, locale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setSaving(true);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          notification_preferences: {
            email: settings.email,
            sms: settings.sms,
            push: settings.push
          }
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Bildiriş parametrləri uğurla yeniləndi' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Xəta baş verdi' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Serverlə əlaqə xətası' });
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (key: 'email' | 'sms' | 'push') => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href={`/${locale}/settings`}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Parametrlərə qayıt
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Bildiriş Parametrləri
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Bildiriş almaq üçün kanalları seçin
          </p>
        </div>

        {/* Success/Error Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-2xl ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            <p className={`text-sm ${
              message.type === 'success'
                ? 'text-green-700 dark:text-green-400'
                : 'text-red-700 dark:text-red-400'
            }`}>
              {message.text}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="rounded-3xl p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30">
          <div className="space-y-6">
            {/* Email Notifications */}
            <div className="flex items-start justify-between p-4 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Email Bildirişləri
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Yeni tapşırıqlar, müraciətlər və mesajlar haqqında email bildirişləri alın
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={settings.email}
                  onChange={() => handleToggle('email')}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* SMS Notifications */}
            <div className="flex items-start justify-between p-4 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    SMS Bildirişləri
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Vacib bildirişləri SMS vasitəsilə telefon nömrənizə göndərin
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={settings.sms}
                  onChange={() => handleToggle('sms')}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* Push Notifications */}
            <div className="flex items-start justify-between p-4 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Push Bildirişləri
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Brauzer və ya mobil tətbiq vasitəsilə ani bildirişlər alın
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={settings.push}
                  onChange={() => handleToggle('push')}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex gap-4">
            <Link
              href={`/${locale}/settings`}
              className="flex-1 px-6 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center"
            >
              Ləğv et
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Yadda saxlanılır...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Yadda saxla
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
