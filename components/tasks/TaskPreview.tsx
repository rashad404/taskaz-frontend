'use client';

import { useTranslations } from 'next-intl';
import { X, MapPin, Calendar, DollarSign, Tag } from 'lucide-react';
import type { TaskFormData } from '@/lib/types/marketplace';

interface TaskPreviewProps {
  formData: Partial<TaskFormData>;
  onClose: () => void;
  onPublish: () => void;
  categoryName?: string;
}

export default function TaskPreview({ formData, onClose, onPublish, categoryName }: TaskPreviewProps) {
  const t = useTranslations('taskCreate');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-900 rounded-3xl max-w-3xl w-full p-8 shadow-2xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t('previewModal.title')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tapşırığınızın necə görünəcəyini yoxlayın
            </p>
          </div>

          {/* Preview Card - Similar to TaskCard */}
          <div className="rounded-3xl p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 mb-6">
            {/* Status Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Açıq
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              {formData.title || 'Başlıq...'}
            </h3>

            {/* Description */}
            <div
              className="text-sm text-gray-600 dark:text-gray-400 mb-4 prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: formData.description || 'Təsvir...' }}
            />

            {/* Meta Info */}
            <div className="space-y-2 mb-4">
              {/* Budget */}
              {(formData.budget_amount || formData.budget_type) && (
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="font-medium">
                    {formData.budget_amount
                      ? `${formData.budget_amount} AZN${formData.budget_type === 'hourly' ? '/saat' : ''}`
                      : 'Büdcə göstərilməyib'}
                  </span>
                </div>
              )}

              {/* Location */}
              {(formData.location || formData.is_remote) && (
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>{formData.is_remote ? 'Remote' : formData.location}</span>
                </div>
              )}

              {/* Deadline */}
              {formData.deadline && (
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span>Son tarix: {new Date(formData.deadline).toLocaleDateString('az-AZ')}</span>
                </div>
              )}

              {/* Skills */}
              {formData.skills && formData.skills.length > 0 && (
                <div className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Tag className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5" />
                  <div className="flex flex-wrap gap-1">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="w-3 h-3" />
                <span>İndi</span>
              </div>

              {categoryName && (
                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                  {categoryName}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              {t('previewModal.edit')}
            </button>
            <button
              onClick={onPublish}
              className="flex-1 btn-primary"
            >
              {t('previewModal.publishNow')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
