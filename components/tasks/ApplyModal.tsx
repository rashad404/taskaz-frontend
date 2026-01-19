'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRequireAuth } from '@/lib/hooks/useRequireAuth';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: number;
  taskTitle: string;
  budgetAmount?: string;
  budgetType?: string;
  onSuccess?: () => void;
}

export default function ApplyModal({
  isOpen,
  onClose,
  taskId,
  taskTitle,
  budgetAmount,
  budgetType,
  onSuccess
}: ApplyModalProps) {
  const t = useTranslations();
  const { triggerLogin } = useRequireAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    proposed_amount: budgetAmount || '',
    estimated_days: '',
    message: ''
  });

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          task_id: taskId,
          message: formData.message,
          proposed_amount: formData.proposed_amount,
          estimated_days: formData.estimated_days || null
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setError('');
        // Reset form
        setFormData({
          proposed_amount: budgetAmount || '',
          estimated_days: '',
          message: ''
        });

        // Close modal after 2 seconds and call onSuccess
        setTimeout(() => {
          setSuccess(false);
          onSuccess?.();
          onClose();
        }, 2000);
      } else {
        // Check for authentication error - trigger Kimlik.az login
        if (response.status === 401 || data.error_code === 'unauthenticated') {
          setLoading(false);
          onClose();
          await triggerLogin();
          return;
        }
        setError(data.message || 'Müraciət göndərilərkən xəta baş verdi');
      }
    } catch (err) {
      console.error('Application error:', err);
      setError('Serverlə əlaqə xətası. Zəhmət olmasa yenidən cəhd edin.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto z-[10000]">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Müraciət Et
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Task Info */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Tapşırıq</p>
            <p className="font-semibold text-gray-900 dark:text-white">{taskTitle}</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl">
              <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                ✓ Müraciətiniz uğurla göndərildi! Tapşırıq sahibi tezliklə cavab verəcək.
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Proposed Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Təklif olunan məbləğ (AZN) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.proposed_amount}
              onChange={(e) => setFormData({ ...formData, proposed_amount: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="100.00"
            />
            {budgetType === 'hourly' && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Saatlıq tarif
              </p>
            )}
          </div>

          {/* Estimated Days */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Təxmini müddət (gün)
            </label>
            <input
              type="number"
              min="1"
              value={formData.estimated_days}
              onChange={(e) => setFormData({ ...formData, estimated_days: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="7"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mesaj *
            </label>
            <textarea
              required
              rows={6}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
              placeholder="Niyə bu tapşırıq üçün uyğun olduğunuzu izah edin..."
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Təcrübənizi və tapşırığı necə yerinə yetirəcəyinizi qeyd edin
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
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Göndərilir...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Müraciət Et
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
