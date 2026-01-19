'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ArrowRight, Shield, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { openWalletLogin, getLocaleFromPathname } from '@/lib/utils/walletAuth';

export default function LoginPage() {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleWalletLogin = async () => {
    setError('');
    setIsLoading(true);

    const locale = getLocaleFromPathname(pathname);

    await openWalletLogin({
      locale,
      onSuccess: () => {
        // Check for return URL in sessionStorage
        const returnUrl = sessionStorage.getItem('return_url');
        if (returnUrl) {
          sessionStorage.removeItem('return_url');
          router.push(returnUrl);
        } else {
          router.push('/dashboard');
        }
      },
      onError: (errorMsg) => {
        setIsLoading(false);
        if (errorMsg === 'popup_blocked') {
          setError(t('login.popupBlocked'));
        } else {
          setError(errorMsg || t('login.walletAuthFailed'));
        }
      },
    });

    // Reset loading after a timeout (in case popup is closed without response)
    setTimeout(() => {
      setIsLoading(false);
    }, 60000);
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* Background Effects */}
      <div className="fixed inset-0 z-[-10]">
        <div className="absolute inset-0 mesh-gradient opacity-30" />
      </div>

      <div className="w-full max-w-md px-6 py-12">
        {/* Welcome Text */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('login.welcomeBack')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('login.signInWithKimlik')}
          </p>
        </div>

        {/* Login Card */}
        <div className="card-glass rounded-3xl p-8">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Kimlik.az Login Button */}
          <button
            onClick={handleWalletLogin}
            disabled={isLoading}
            className="w-full btn-primary group flex items-center justify-center gap-3 py-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t('login.connecting')}</span>
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                <span>{t('login.signInWithKimlik')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* Info text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('login.kimlikDescription')}
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('login.noKimlikAccount')}{' '}
            <a
              href={`${process.env.NEXT_PUBLIC_WALLET_URL || 'http://100.89.150.50:3011'}/register`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              {t('login.createKimlikAccount')}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
