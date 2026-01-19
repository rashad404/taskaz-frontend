'use client';

import { Mail, Phone, Lock } from 'lucide-react';
import { useAuthState } from '@/lib/hooks/useAuthState';
import { useRequireAuth } from '@/lib/hooks/useRequireAuth';

interface ContactInfoProps {
  email?: string;
  phone?: string;
  locale?: string;
}

export default function ContactInfo({ email, phone }: ContactInfoProps) {
  const { isAuthenticated, isLoading } = useAuthState();
  const { triggerLogin } = useRequireAuth();

  const maskEmail = (email: string) => {
    const [username, domain] = email.split('@');
    const extension = domain.split('.').pop() || 'com';

    // Mask username
    let maskedUsername = '';
    if (username.length <= 2) {
      maskedUsername = username[0] + '***';
    } else {
      maskedUsername = username.substring(0, 2) + '***';
    }

    return `${maskedUsername}@***.${extension}`;
  };

  const maskPhone = (phone: string) => {
    // Mask phone number, showing only first 3 and last 2 digits
    if (phone.length <= 5) {
      return '***' + phone.slice(-2);
    }
    return phone.substring(0, 3) + '***' + phone.slice(-2);
  };

  const handleSignInClick = async () => {
    await triggerLogin();
  };

  if (isLoading) {
    // Return nothing during initial load to avoid flash
    return null;
  }

  if (!email && !phone) {
    return null;
  }

  return (
    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
      <div className="space-y-3">
        {email && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Mail className="w-4 h-4" />
            <span className="truncate">
              {isAuthenticated ? email : maskEmail(email)}
            </span>
          </div>
        )}

        {phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Phone className="w-4 h-4" />
            <span>
              {isAuthenticated ? phone : maskPhone(phone)}
            </span>
          </div>
        )}

        {!isAuthenticated && (
          <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl">
            <div className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-indigo-900 dark:text-indigo-100 mb-2">
                  Tam əlaqə məlumatlarını görmək üçün daxil olun
                </p>
                <button
                  onClick={handleSignInClick}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 underline"
                >
                  Daxil ol
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
