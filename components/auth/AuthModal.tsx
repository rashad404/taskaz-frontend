'use client';

import { useState } from 'react';
import { X, Loader2, Wallet } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { openWalletLogin, getLocaleFromPathname } from '@/lib/utils/walletAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  returnUrl?: string;
  message?: string;
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  message
}: AuthModalProps) {
  const t = useTranslations('login');
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleWalletLogin = async () => {
    setLoading(true);
    setError('');

    const locale = getLocaleFromPathname(pathname || '');

    await openWalletLogin({
      locale,
      onSuccess: () => {
        setLoading(false);
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      },
      onError: (err) => {
        setLoading(false);
        setError(err || t('walletAuthFailed'));
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                <Wallet className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t('authRequired')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {t('pleaseLoginToContinue')}
            </p>
          </div>

          {/* Custom Message */}
          {message && (
            <div className="mb-6 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
              <p className="text-sm text-indigo-900 dark:text-indigo-200 text-center">
                {message}
              </p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
            </div>
          )}

          {/* Kimlik.az Login Button */}
          <button
            onClick={handleWalletLogin}
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-3 py-4"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t('signingIn')}</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
                <span>{t('loginWithKimlik')}</span>
              </>
            )}
          </button>

          <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            {t('secureLoginViaKimlik')}
          </p>
        </div>
      </div>
    </div>
  );
}
