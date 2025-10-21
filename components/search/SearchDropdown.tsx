'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Search, X, Clock, Loader2 } from 'lucide-react';
import { useSearch } from '@/lib/hooks/useSearch';
import SearchResultItem from './SearchResultItem';

interface SearchDropdownProps {
  locale: string;
  placeholder?: string;
  className?: string;
}

export default function SearchDropdown({ locale, placeholder, className = '' }: SearchDropdownProps) {
  const t = useTranslations('search');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    query,
    setQuery,
    results,
    loading,
    error,
    recentSearches,
    saveToRecent,
    clearRecent,
  } = useSearch();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate total results for keyboard navigation
  const getAllResults = () => {
    if (!results) return [];

    const allItems = [
      ...results.tasks.map((item: any) => ({ type: 'task', item })),
      ...results.freelancers.map((item: any) => ({ type: 'freelancer', item })),
      ...results.categories.map((item: any) => ({ type: 'category', item })),
    ];

    return allItems;
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const allResults = getAllResults();

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < allResults.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && allResults[selectedIndex]) {
        handleResultClick(allResults[selectedIndex].type, allResults[selectedIndex].item);
      } else if (query.trim()) {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  const handleSearch = () => {
    if (query.trim()) {
      saveToRecent(query);
      // Navigate to full search results page or perform action
      window.location.href = `/${locale}/search?q=${encodeURIComponent(query)}`;
    }
  };

  const handleResultClick = (type: string, item: any) => {
    saveToRecent(query);
    setIsOpen(false);
    setQuery('');
  };

  const handleRecentSearchClick = (searchQuery: string) => {
    setQuery(searchQuery);
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const clearInput = () => {
    setQuery('');
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const showRecent = isOpen && !query && recentSearches.length > 0;
  const showResults = isOpen && query.length >= 2;
  const hasResults = results && (results.tasks.length > 0 || results.freelancers.length > 0 || results.categories.length > 0);

  // Calculate dropdown position
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  const updateDropdownPosition = useCallback(() => {
    if (inputRef.current && isOpen) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: `${rect.bottom + 8}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    updateDropdownPosition();
  }, [isOpen, query, updateDropdownPosition]);

  // Update position on scroll and resize
  useEffect(() => {
    if (!isOpen) return;

    window.addEventListener('scroll', updateDropdownPosition, true);
    window.addEventListener('resize', updateDropdownPosition);

    return () => {
      window.removeEventListener('scroll', updateDropdownPosition, true);
      window.removeEventListener('resize', updateDropdownPosition);
    };
  }, [isOpen, updateDropdownPosition]);

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <Search className="w-5 h-5" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || t('placeholder')}
          className="w-full pl-12 pr-12 py-4 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
        />

        {query && (
          <button
            onClick={clearInput}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {(showRecent || showResults) && (
        <div
          style={dropdownStyle}
          className="z-[9999] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[500px] overflow-y-auto"
        >
          {/* Recent Searches */}
          {showRecent && (
            <div className="py-3">
              <div className="flex items-center justify-between px-4 pb-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  {t('recentSearches')}
                </div>
                <button
                  onClick={clearRecent}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {t('clearRecent')}
                </button>
              </div>

              <div className="space-y-1">
                {recentSearches.map((searchQuery, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(searchQuery)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center gap-3"
                  >
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{searchQuery}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {showResults && (
            <>
              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
                  <span className="ml-3 text-gray-600 dark:text-gray-400">{t('searching')}</span>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="px-4 py-8 text-center">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Results */}
              {!loading && !error && results && (
                <>
                  {hasResults ? (
                    <div className="py-2">
                      {/* Tasks */}
                      {results.tasks.length > 0 && (
                        <div className="mb-4">
                          <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {t('tasks')} ({results.tasks.length})
                          </div>
                          {results.tasks.map((task: any) => (
                            <SearchResultItem
                              key={`task-${task.id}`}
                              type="task"
                              item={task}
                              locale={locale}
                              onSelect={() => handleResultClick('task', task)}
                            />
                          ))}
                        </div>
                      )}

                      {/* Freelancers */}
                      {results.freelancers.length > 0 && (
                        <div className="mb-4">
                          <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {t('freelancers')} ({results.freelancers.length})
                          </div>
                          {results.freelancers.map((freelancer: any) => (
                            <SearchResultItem
                              key={`freelancer-${freelancer.id}`}
                              type="freelancer"
                              item={freelancer}
                              locale={locale}
                              onSelect={() => handleResultClick('freelancer', freelancer)}
                            />
                          ))}
                        </div>
                      )}

                      {/* Categories */}
                      {results.categories.length > 0 && (
                        <div className="mb-2">
                          <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {t('categories')} ({results.categories.length})
                          </div>
                          {results.categories.map((category: any) => (
                            <SearchResultItem
                              key={`category-${category.id}`}
                              type="category"
                              item={category}
                              locale={locale}
                              onSelect={() => handleResultClick('category', category)}
                            />
                          ))}
                        </div>
                      )}

                      {/* View All Link */}
                      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={handleSearch}
                          className="w-full text-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                        >
                          {t('viewAll')} →
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* No Results */
                    <div className="px-4 py-12 text-center">
                      <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">
                        {t('noResults')}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        {t('noResultsDesc')}
                      </p>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
