'use client';

import { useState, useEffect, useRef } from 'react';
import authService from '@/lib/api/auth';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  isLoading: boolean;
}

/**
 * Hook for reactive auth state that updates instantly on login/logout.
 *
 * Uses CustomEvent with user data from walletAuth for instant updates,
 * no API call needed after login.
 *
 * Usage:
 * ```tsx
 * const { isAuthenticated, user, isLoading } = useAuthState();
 * ```
 */
export function useAuthState(): AuthState {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Track if we've received an event-based update to prevent race conditions
  const eventUpdatedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    eventUpdatedRef.current = false;

    // Initial auth check
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        // Only update if mounted AND no event has updated the state
        if (isMounted && !eventUpdatedRef.current) {
          if (currentUser) {
            setIsAuthenticated(true);
            setUser(currentUser);
          } else {
            setIsAuthenticated(false);
            setUser(null);
          }
        }
      } catch (error) {
        if (isMounted && !eventUpdatedRef.current) {
          setIsAuthenticated(false);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    // Listen for auth state changes (only explicit login/logout events)
    const handleAuthChange = (event: Event) => {
      const customEvent = event as CustomEvent;

      if (customEvent.detail?.user) {
        // Mark that event has updated state - prevents race condition with checkAuth
        eventUpdatedRef.current = true;
        // Instant update from login event - no API call needed
        setIsAuthenticated(true);
        setUser(customEvent.detail.user);
        setIsLoading(false);
      } else if (customEvent.detail?.logout) {
        // Instant update from logout event
        eventUpdatedRef.current = true;
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
      }
      // Ignore events without user/logout data to prevent loops
    };

    window.addEventListener('authStateChanged', handleAuthChange);

    return () => {
      isMounted = false;
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  return { isAuthenticated, user, isLoading };
}

export default useAuthState;
