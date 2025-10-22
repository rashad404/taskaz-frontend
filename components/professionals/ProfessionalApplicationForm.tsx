'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import {
  User,
  MapPin,
  Wallet,
  Briefcase,
  Plus,
  X,
  Save,
  Send,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { useProfessionalForm } from '@/lib/hooks/useProfessionalForm';
import LocationSelector from '@/components/common/LocationSelector';
import AuthModal from '@/components/auth/AuthModal';
import RichTextEditor from '@/components/ui/RichTextEditor';
import apiClient from '@/lib/api/client';

interface ProfessionalApplicationFormProps {
  locale: string;
}

export default function ProfessionalApplicationForm({ locale }: ProfessionalApplicationFormProps) {
  const t = useTranslations('becomeProfessional');
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
    resetForm,
    addSkill,
    removeSkill,
    addPortfolioItem,
    updatePortfolioItem,
    removePortfolioItem,
  } = useProfessionalForm();

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState('');
  const [cityId, setCityId] = useState<number | null>(null);
  const [districtId, setDistrictId] = useState<number | null>(null);
  const [settlementId, setSettlementId] = useState<number | null>(null);
  const [metroStationId, setMetroStationId] = useState<number | null>(null);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setShowAuthModal(true);
    }
  }, []);

  // Update location field when city is selected (for validation)
  useEffect(() => {
    if (cityId) {
      setFormField('location', 'selected'); // Just mark as selected for validation
    } else {
      setFormField('location', '');
    }
  }, [cityId, setFormField]);

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (skillInput.trim()) {
        addSkill(skillInput.trim());
        setSkillInput('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    setApiError(null);

    try {
      const response = await apiClient.post('/professional/apply', formData);

      if (response.data.status === 'success') {
        setSuccessMessage(true);
        clearDraft();

        setTimeout(() => {
          router.push(`/${locale}/dashboard`);
        }, 3000);
      }
    } catch (error: any) {
      console.error('Failed to submit application:', error);

      // If 401, show auth modal
      if (error.response?.status === 401) {
        setShowAuthModal(true);
        setApiError(null);
      } else if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else {
        setApiError(t('error.generic'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (successMessage) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="rounded-3xl p-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            <span className="gradient-text">{t('success.title')}</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {t('success.message')}
          </p>
          <button
            onClick={() => router.push(`/${locale}/dashboard`)}
            className="btn-primary"
          >
            {t('success.backToDashboard')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">{t('title')}</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t('subtitle')}
          </p>
        </div>

        {/* Error Message */}
        {apiError && (
          <div className="rounded-2xl p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
            {apiError}
          </div>
        )}

        {/* Basic Information */}
        <div className="rounded-3xl p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('steps.basicInfo')}
            </h2>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('form.bio')} <span className="text-red-500">*</span>
            </label>
            <RichTextEditor
              value={formData.bio}
              onChange={(value) => setFormField('bio', value)}
              placeholder={t('form.bioPlaceholder')}
              error={errors.bio}
            />
            <div className="flex justify-between mt-2">
              {errors.bio ? (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.bio}</p>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('form.bioHelp')} ({formData.bio ? formData.bio.replace(/<[^>]*>/g, '').length : 0}/1000)
                </p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('form.location')} <span className="text-red-500">*</span>
            </label>
            <LocationSelector
              isRemote={false}
              onRemoteChange={() => {}} // Professionals must have a location
              cityId={cityId}
              onCityChange={(id) => {
                setCityId(id);
                setFormField('city_id', id);
              }}
              districtId={districtId}
              onDistrictChange={(id) => {
                setDistrictId(id);
                setFormField('district_id', id);
              }}
              settlementId={settlementId}
              onSettlementChange={(id) => {
                setSettlementId(id);
                setFormField('settlement_id', id);
              }}
              metroStationId={metroStationId}
              onMetroStationChange={(id) => {
                setMetroStationId(id);
                setFormField('metro_station_id', id);
              }}
              locale={locale}
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location}</p>
            )}
          </div>
        </div>

        {/* Professional Details */}
        <div className="rounded-3xl p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('steps.professionalDetails')}
            </h2>
          </div>

          {/* Skills */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('form.skills')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              placeholder={t('form.skillsPlaceholder')}
              className="w-full px-4 py-3 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t('form.skillsHelp')} ({formData.skills.length}/15)
            </p>
            {errors.skills && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.skills}</p>
            )}

            {/* Skills Tags */}
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="hover:text-indigo-900 dark:hover:text-indigo-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Hourly Rate */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('form.hourlyRate')} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Wallet className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="number"
                min="1"
                step="0.01"
                value={formData.hourly_rate || ''}
                onChange={(e) => setFormField('hourly_rate', parseFloat(e.target.value))}
                placeholder={t('form.hourlyRatePlaceholder')}
                className={`w-full pl-10 px-4 py-3 rounded-2xl bg-white/50 dark:bg-gray-800/50 border ${errors.hourly_rate ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">AZN</span>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t('form.hourlyRateHelp')}
            </p>
            {errors.hourly_rate && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.hourly_rate}</p>
            )}
          </div>
        </div>

        {/* Portfolio */}
        <div className="rounded-3xl p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('steps.portfolio')}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('form.portfolioHelp')}
                </p>
              </div>
            </div>
            {formData.portfolio_items.length < 5 && (
              <button
                type="button"
                onClick={addPortfolioItem}
                className="btn-secondary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {t('form.addPortfolio')}
              </button>
            )}
          </div>

          {/* Portfolio Items */}
          {formData.portfolio_items.length > 0 && (
            <div className="space-y-4">
              {formData.portfolio_items.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl p-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Project #{index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removePortfolioItem(index)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updatePortfolioItem(index, 'title', e.target.value)}
                        placeholder={t('form.portfolioTitlePlaceholder')}
                        className="w-full px-4 py-3 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <textarea
                        value={item.description || ''}
                        onChange={(e) => updatePortfolioItem(index, 'description', e.target.value)}
                        placeholder={t('form.portfolioDescriptionPlaceholder')}
                        rows={3}
                        className="w-full px-4 py-3 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <input
                        type="url"
                        value={item.image_url || ''}
                        onChange={(e) => updatePortfolioItem(index, 'image_url', e.target.value)}
                        placeholder={t('form.portfolioImagePlaceholder')}
                        className="w-full px-4 py-3 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <input
                        type="url"
                        value={item.project_url || ''}
                        onChange={(e) => updatePortfolioItem(index, 'project_url', e.target.value)}
                        placeholder={t('form.portfolioProjectPlaceholder')}
                        className="w-full px-4 py-3 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {formData.portfolio_items.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>{t('form.portfolioHelp')}</p>
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 justify-between items-center">
          <button
            type="button"
            onClick={saveDraft}
            className="btn-secondary flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {tCommon('save')}
            {lastSaved && (
              <span className="text-xs text-gray-500">
                ({new Date(lastSaved).toLocaleTimeString()})
              </span>
            )}
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary flex items-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('submitting')}
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                {t('submit')}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
            window.location.reload();
          }}
        />
      )}
    </>
  );
}
