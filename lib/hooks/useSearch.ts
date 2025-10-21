import { useState, useEffect, useCallback } from 'react';
import { searchApi, SearchResult } from '../api/search';

const RECENT_SEARCHES_KEY = 'taskaz_recent_searches';
const MAX_RECENT_SEARCHES = 5;

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        try {
          setRecentSearches(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse recent searches:', e);
        }
      }
    }
  }, []);

  // Save search to recent searches
  const saveToRecent = useCallback((searchQuery: string) => {
    if (!searchQuery.trim() || typeof window === 'undefined') return;

    setRecentSearches((prev) => {
      const newRecent = [searchQuery, ...prev.filter(s => s !== searchQuery)].slice(0, MAX_RECENT_SEARCHES);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(newRecent));
      return newRecent;
    });
  }, []);

  // Clear recent searches
  const clearRecent = useCallback(() => {
    setRecentSearches([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    }
  }, []);

  // Debounced search function
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const timeoutId = setTimeout(async () => {
      try {
        const response = await searchApi.search(query);
        setResults(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Search failed');
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [query]);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    recentSearches,
    saveToRecent,
    clearRecent,
  };
}
