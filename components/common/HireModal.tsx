'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Briefcase, Plus, ArrowRight, CheckCircle, MessageCircle, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getLocalizedPath } from '@/lib/utils/locale';

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
    // Store professional info for later use (could be used to pre-fill or suggest)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('suggested_professional', JSON.stringify({
        id: professionalId,
        name: professionalName
      }));
    }

    // Redirect to task creation
    router.push(getLocalizedPath(locale, '/tasks/create'));
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
          {/* Professional Info Card */}
          <div className="relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-10"></div>
            <div className="relative p-5 border border-indigo-200 dark:border-indigo-800/50">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full blur-md opacity-50"></div>
                  <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {professionalName.charAt(0)}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg text-gray-900 dark:text-white">
                    {professionalName}
                  </p>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                    Təcrübəli Peşəkar
                  </p>
                </div>
                <div className="hidden sm:block">
                  <div className="px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                    <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">İşə Götür</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How it Works Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
              Necə işləyir?
            </h3>

            <div className="space-y-3">
              {/* Step 1 */}
              <div className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative p-4 flex items-start gap-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center border-2 border-indigo-500">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">1</span>
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1.5">
                      Tapşırıq Yaradın
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      Tapşırığınızın detallarını, büdcəsini və tələblərini dəqiq şəkildə qeyd edin
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative p-4 flex items-start gap-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center border-2 border-purple-500">
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400">2</span>
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1.5">
                      Peşəkara Tapşırığı Göndərin
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {professionalName} tapşırığınızı görüb müraciət edəcək və ya birbaşa əlaqə saxlaya bilərsiniz
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative p-4 flex items-start gap-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center border-2 border-green-500">
                      <span className="text-xs font-bold text-green-600 dark:text-green-400">3</span>
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1.5">
                      İş İcra Olunsun
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      Müraciəti qəbul edin və {professionalName} ilə işbirliyi başlasın
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="sm:flex-1 px-6 py-3.5 rounded-xl border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              Ləğv et
            </button>
            <button
              type="button"
              onClick={handleCreateTask}
              className="sm:flex-1 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-[1.02]"
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
