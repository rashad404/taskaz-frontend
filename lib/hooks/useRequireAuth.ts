'use client';

import { useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { openWalletLogin, getLocaleFromPathname } from '@/lib/utils/walletAuth';
import authService from '@/lib/api/auth';

interface UseRequireAuthOptions {
  onLoginSuccess?: () => void;
  onLoginError?: (error: string) => void;
}

/**
 * Hook for requiring authentication before performing an action.
 *
 * Usage:
 * ```tsx
 * const { requireAuth, triggerLogin, isAuthenticated } = useRequireAuth();
 *
 * // Option 1: Run callback only if authenticated, otherwise prompt login
 * const handleSubmit = () => {
 *   requireAuth(() => {
 *     // This runs after successful login or immediately if already logged in
 *     submitForm();
 *   });
 * };
 *
 * // Option 2: Just trigger login popup
 * <button onClick={triggerLogin}>Daxil ol</button>
 * ```
 */
export function useRequireAuth(options: UseRequireAuthOptions = {}) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname || '');

  /**
   * Triggers the Kimlik.az login popup
   */
  const triggerLogin = useCallback(async (onSuccess?: () => void) => {
    await openWalletLogin({
      locale,
      onSuccess: () => {
        // walletAuth already dispatches authStateChanged with user data
        if (onSuccess) {
          onSuccess();
        }
        if (options.onLoginSuccess) {
          options.onLoginSuccess();
        }
      },
      onError: (error) => {
        console.error('Login error:', error);
        if (options.onLoginError) {
          options.onLoginError(error);
        }
      },
    });
  }, [locale, options]);

  /**
   * Executes callback if authenticated, otherwise triggers login first
   * After successful login, the callback will be executed
   */
  const requireAuth = useCallback(async (callback: () => void | Promise<void>) => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        // Already authenticated, run callback immediately
        await callback();
      } else {
        // Not authenticated, trigger login then run callback
        await triggerLogin(async () => {
          // Small delay to ensure auth state is updated
          setTimeout(async () => {
            await callback();
          }, 500);
        });
      }
    } catch (error) {
      // Error checking auth, trigger login
      await triggerLogin(async () => {
        setTimeout(async () => {
          await callback();
        }, 500);
      });
    }
  }, [triggerLogin]);

  /**
   * Check if user is currently authenticated (sync check from localStorage)
   */
  const isAuthenticated = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  }, []);

  return {
    triggerLogin,
    requireAuth,
    isAuthenticated,
  };
}

export default useRequireAuth;
