'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchStartups, type Startup } from '@/lib/api/startups';

/**
 * StartupBar - Cross-promotion bar for displaying links to all startups
 * Shows a minimal, text-based promotion bar in the header
 */
export default function StartupBar() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadStartups = async () => {
      try {
        const data = await fetchStartups();
        setStartups(data);
        setError(false);
      } catch (err) {
        console.error('Error loading startups:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadStartups();
  }, []);

  // Don't render anything if loading, error, or no startups
  if (loading || error || startups.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="py-2 flex items-center justify-center flex-wrap gap-x-4 gap-y-1 text-sm">
          <span className="hidden md:inline text-gray-600 dark:text-gray-400 font-medium">
            Layihələrimiz:
          </span>

          <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
            {startups.map((startup, index) => (
              <div key={startup.name} className="flex items-center">
                <Link
                  href={startup.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  title={startup.tagline}
                >
                  {startup.name}
                </Link>

                {index < startups.length - 1 && (
                  <span className="ml-3 text-gray-400 dark:text-gray-600">•</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
