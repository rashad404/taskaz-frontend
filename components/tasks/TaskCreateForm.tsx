'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Calendar, Upload, X, Plus, Save, Eye, Loader2 } from 'lucide-react';
import { useTaskForm } from '@/lib/hooks/useTaskForm';
import { tasksApi, categoriesApi } from '@/lib/api/marketplace';
import type { Category } from '@/lib/types/marketplace';
import TaskPreview from './TaskPreview';
import RichTextEditor from '@/components/ui/RichTextEditor';
import AuthModal from '@/components/auth/AuthModal';

interface TaskCreateFormProps {
  locale: string;
}

export default function TaskCreateForm({ locale }: TaskCreateFormProps) {
  const t = useTranslations('taskCreate');
  const tCommon = useTranslations('common');
  const router = useRouter();

  const {
    formData,
    errors,
    lastSaved,
    setFormField,
    validate,
    saveDraft,
    clearDraft,
    addSkill,
    removeSkill,
    addFile,
    removeFile,
  } = useTaskForm();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.getAll();
        const parentCategories = data.filter((cat: Category) => !cat.parent_id);
        setCategories(parentCategories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      addSkill(skillInput);
      setSkillInput('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => addFile(file));
    }
    e.target.value = ''; // Reset input
  };

  const handlePreview = () => {
    if (validate()) {
      setShowPreview(true);
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    // Check if user is authenticated before making API call
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      // Save draft and show auth modal instead of making API call
      saveDraft();
      setShowAuthModal(true);
      setShowPreview(false);
      return;
    }

    setSubmitting(true);
    setApiError(null);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();

      formDataToSend.append('title', formData.title!);
      formDataToSend.append('description', formData.description!);
      formDataToSend.append('category_id', formData.category_id!.toString());
      formDataToSend.append('budget_type', formData.budget_type!);

      if (formData.budget_amount) {
        formDataToSend.append('budget_amount', formData.budget_amount.toString());
      }

      formDataToSend.append('is_remote', formData.is_remote ? '1' : '0');

      if (!formData.is_remote && formData.location) {
        formDataToSend.append('location', formData.location);
      }

      if (formData.deadline) {
        formDataToSend.append('deadline', formData.deadline);
      }

      // Add files if any
      if (formData.attachments && formData.attachments.length > 0) {
        formData.attachments.forEach((file) => {
          formDataToSend.append('attachments[]', file);
        });
      }

      // Send multipart form data
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create task');
      }

      const result = await response.json();
      const task = result.data;

      // Clear draft
      clearDraft();

      // Show success message
      setSuccessMessage(true);
      setShowPreview(false);

      // Redirect to task page after 2 seconds
      setTimeout(() => {
        router.push(`/${locale}/tasks/${task.slug}`);
      }, 2000);
    } catch (error: any) {
      console.error('Failed to create task:', error);

      // Show API error
      setApiError(error.message || t('error.generic'));
      setShowPreview(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAuthSuccess = () => {
    // Close modal
    setShowAuthModal(false);
    // User is now logged in, they can try to publish again
    // Form data is already saved in draft
  };

  const selectedCategory = categories.find(c => c.id === formData.category_id);

  if (successMessage) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="rounded-3xl p-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4 gradient-text">{t('success.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{t('success.message')}</p>
          <div className="flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
            <span className="ml-2 text-sm text-gray-500">Yönləndirilir...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">
            <span className="gradient-text">{t('pageTitle')}</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t('pageSubtitle')}
          </p>
          {lastSaved && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {t('lastSaved')}: {lastSaved.toLocaleTimeString('az-AZ')}
            </p>
          )}
        </div>

        {/* API Error Message */}
        {apiError && (
          <div className="mb-6 rounded-2xl p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{t('error.title')}</h3>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">{apiError}</p>
                </div>
              </div>
              <button
                onClick={() => setApiError(null)}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="rounded-3xl p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30">
          {/* Basic Information */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              {t('basicInfo')}
            </h3>

            {/* Title */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('title')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormField('title', e.target.value)}
                placeholder={t('titlePlaceholder')}
                className="w-full px-4 py-3 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
              )}
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('category')} <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category_id || ''}
                onChange={(e) => setFormField('category_id', parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={loadingCategories}
              >
                <option value="">{t('categoryPlaceholder')}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category_id}</p>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('description')} <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                value={formData.description || ''}
                onChange={(value) => setFormField('description', value)}
                placeholder={t('descriptionPlaceholder')}
                error={errors.description}
              />
              <div className="flex justify-between mt-2">
                {errors.description ? (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                ) : (
                  <p className="text-sm text-gray-500">
                    {formData.description ? formData.description.replace(/<[^>]*>/g, '').length : 0} simvol (min. 50)
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Budget & Timeline */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              {t('budgetTimeline')}
            </h3>

            {/* Budget Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t('budgetType')} <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex-1 flex items-center gap-3 p-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 cursor-pointer hover:border-indigo-500 transition-colors">
                  <input
                    type="radio"
                    name="budget_type"
                    value="fixed"
                    checked={formData.budget_type === 'fixed'}
                    onChange={(e) => setFormField('budget_type', e.target.value)}
                    className="w-4 h-4 text-indigo-600"
                  />
                  <span className="text-gray-900 dark:text-white font-medium">{t('fixedPrice')}</span>
                </label>
                <label className="flex-1 flex items-center gap-3 p-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 cursor-pointer hover:border-indigo-500 transition-colors">
                  <input
                    type="radio"
                    name="budget_type"
                    value="hourly"
                    checked={formData.budget_type === 'hourly'}
                    onChange={(e) => setFormField('budget_type', e.target.value)}
                    className="w-4 h-4 text-indigo-600"
                  />
                  <span className="text-gray-900 dark:text-white font-medium">{t('hourlyRate')}</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Budget Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('budgetAmount')} {t('optional')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.budget_amount || ''}
                    onChange={(e) => setFormField('budget_amount', e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder={t('budgetAmountPlaceholder')}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 pr-16 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">AZN</span>
                </div>
                {errors.budget_amount && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.budget_amount}</p>
                )}
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('deadline')} {t('optional')}
                </label>
                <input
                  type="date"
                  value={formData.deadline || ''}
                  onChange={(e) => setFormField('deadline', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.deadline && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.deadline}</p>
                )}
              </div>
            </div>
          </div>

          {/* Location & Work Style */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              {t('locationWorkStyle')}
            </h3>

            {/* Remote Checkbox */}
            <div className="mb-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_remote || false}
                  onChange={(e) => setFormField('is_remote', e.target.checked)}
                  className="w-5 h-5 text-indigo-600 rounded"
                />
                <span className="text-gray-900 dark:text-white font-medium">{t('remote')}</span>
              </label>
            </div>

            {/* Location */}
            {!formData.is_remote && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('location')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormField('location', e.target.value)}
                  placeholder={t('locationPlaceholder')}
                  className="w-full px-4 py-3 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location}</p>
                )}
              </div>
            )}
          </div>

          {/* Additional Details */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              {t('additionalDetails')}
            </h3>

            {/* Skills */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('skills')} {t('optional')}
              </label>
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder={t('skillsPlaceholder')}
                className="w-full px-4 py-3 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {formData.skills && formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="hover:text-indigo-900 dark:hover:text-indigo-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* File Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('attachments')} {t('optional')}
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center">
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400 mb-2">{t('attachmentsDragDrop')}</p>
                <p className="text-sm text-gray-500 mb-4">{t('attachmentsLimit')}</p>
                <input
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block px-6 py-2 rounded-2xl bg-indigo-500 text-white hover:bg-indigo-600 transition-colors cursor-pointer"
                >
                  Fayl seç
                </label>
              </div>
              {errors.attachments && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.attachments}</p>
              )}
              {formData.attachments && formData.attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {formData.attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-2xl bg-gray-100 dark:bg-gray-800"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={saveDraft}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              <Save className="w-4 h-4" />
              {t('saveDraft')}
            </button>
            <button
              type="button"
              onClick={handlePreview}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-indigo-500 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors font-medium"
            >
              <Eye className="w-4 h-4" />
              {t('preview')}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('publishing')}
                </>
              ) : (
                t('publish')
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <TaskPreview
          formData={formData}
          categoryName={selectedCategory?.name}
          onClose={() => setShowPreview(false)}
          onPublish={handleSubmit}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        message={t('authRequired.message')}
      />
    </>
  );
}
