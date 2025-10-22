'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Briefcase, Plus, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HireModalProps {
  isOpen: boolean;
  onClose: () => void;
  professionalId: number;
  professionalName: string;
  locale?: string;
}

export default function HireModal({
  isOpen,
  onClose,
  professionalId,
  professionalName,
  locale = 'az'
}: HireModalProps) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleCreateTask = () => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');

    if (!token) {
      // Store current page for redirect after login
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('return_url', window.location.pathname);
      }
      router.push(`/${locale}/login`);
      return;
    }

    // Store professional info for later use (could be used to pre-fill or suggest)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('suggested_professional', JSON.stringify({
        id: professionalId,
        name: professionalName
      }));
    }

    // Redirect to task creation
    router.push(`/${locale}/tasks/create`);
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto z-[10000]">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              İşə Götür
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* professional Info */}
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {professionalName.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {professionalName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  professional
                </p>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Tapşırıq Yaradın
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {professionalName} ilə işləmək üçün əvvəlcə tapşırıq yaratmalısınız. Tapşırığınızın detallarını, büdcəsini və tələblərini qeyd edin.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  professional Müraciət Edər
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tapşırığınızı yaratdıqdan sonra, {professionalName} profilinizə keçib müraciət edə bilər və ya siz onunla birbaşa əlaqə saxlaya bilərsiniz.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Müraciəti Qəbul Edin
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {professionalName}-dan müraciət aldıqdan sonra, onu qəbul edin və iş başlasın.
                </p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Məsləhət:</span> Tapşırıq yaratdıqdan sonra, bu səhifəyə qayıdıb {professionalName} ilə mesaj göndərə bilərsiniz.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Ləğv et
            </button>
            <button
              type="button"
              onClick={handleCreateTask}
              className="flex-1 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Tapşırıq Yarat
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
