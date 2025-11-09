'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Star,
  Save,
  Loader2,
  ChevronLeft,
  DollarSign,
  Briefcase,
  FileText,
  Plus,
  X,
  MapPin,
  AlertCircle
} from 'lucide-react';
import LocationSelector from '@/components/common/LocationSelector';
import DashboardLayout from '@/components/layout/DashboardLayout';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/ui/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
});

interface PortfolioItem {
  title: string;
  description?: string;
  project_url?: string;
}

export default function ProfessionalSettingsPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.lang as string) || 'az';

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isRemote, setIsRemote] = useState(false);
  const [cityId, setCityId] = useState<number | null>(null);
  const [districtId, setDistrictId] = useState<number | null>(null);
  const [settlementId, setSettlementId] = useState<number | null>(null);
  const [metroStationId, setMetroStationId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    bio: '',
    hourly_rate: '',
    skills: [] as string[],
    portfolio_items: [] as PortfolioItem[]
  });

  const [newSkill, setNewSkill] = useState('');
  const [newPortfolio, setNewPortfolio] = useState<PortfolioItem>({
    title: '',
    description: '',
    project_url: ''
  });

  useEffect(() => {

    // Fetch user data and professional status
    const fetchData = async () => {
      try {
        // Check professional status first
        const statusRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/professional/status`, {
          credentials: 'include'
        });

        if (statusRes.ok) {
          const statusData = await statusRes.json();

          // Only approved professionals can access this page
          if (statusData.data?.professional_status !== 'approved') {
            router.push(`/${locale}/dashboard`);
            return;
          }
        } else {
          router.push(`/${locale}/dashboard`);
          return;
        }

        // Fetch user data
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
          credentials: 'include'
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          const user = userData.data;
          setUser(user);

          setFormData({
            bio: user.bio || '',
            hourly_rate: user.hourly_rate?.toString() || '',
            skills: user.skills || [],
            portfolio_items: user.portfolio_items || []
          });

          setCityId(user.city_id || null);
          setDistrictId(user.district_id || null);
          setSettlementId(user.settlement_id || null);
          setMetroStationId(user.metro_station_id || null);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setMessage({ type: 'error', text: 'Məlumatlar yüklənə bilmədi' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, locale]);

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleAddPortfolio = () => {
    if (newPortfolio.title.trim()) {
      setFormData({
        ...formData,
        portfolio_items: [...formData.portfolio_items, { ...newPortfolio }]
      });
      setNewPortfolio({ title: '', description: '', project_url: '' });
    }
  };

  const handleRemovePortfolio = (index: number) => {
    setFormData({
      ...formData,
      portfolio_items: formData.portfolio_items.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setErrors({});
    setSaving(true);

    try {      const submitData = {
        bio: formData.bio,
        city_id: cityId,
        district_id: districtId,
        settlement_id: settlementId,
        metro_station_id: metroStationId,
        skills: formData.skills,
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : 0,
        portfolio_items: formData.portfolio_items || []
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/professional/update`, {
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Peşəkar profil uğurla yeniləndi' });

        // Update user data
        const updatedUser = data.data;
        setUser(updatedUser);

        setFormData({
          bio: updatedUser.bio || '',
          hourly_rate: updatedUser.hourly_rate?.toString() || '',
          skills: updatedUser.skills || [],
          portfolio_items: updatedUser.portfolio_items || []
        });

        setErrors({});

        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        if (data.errors && typeof data.errors === 'object') {
          const fieldErrors: Record<string, string> = {};
          Object.keys(data.errors).forEach(field => {
            fieldErrors[field] = Array.isArray(data.errors[field])
              ? data.errors[field][0]
              : data.errors[field];
          });
          setErrors(fieldErrors);
          setMessage({
            type: 'error',
            text: 'Xahiş edirik, formdakı xətaları düzəldin'
          });
        } else {
          setMessage({ type: 'error', text: data.message || 'Xəta baş verdi' });
        }
      }
    } catch (err) {
      console.error('Professional update error:', err);
      setMessage({ type: 'error', text: 'Serverlə əlaqə xətası. Zəhmət olmasa yenidən cəhd edin.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout activePage="professional" title="Peşəkar Profil">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href={`/${locale}/settings`}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Parametrlərə qayıt
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-8 h-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Peşəkar Profil
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Peşəkar məlumatlarınızı və portfel nümunələrinizi idarə edin
          </p>
        </div>

        {/* Success/Error Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-2xl ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-start gap-3">
              {message.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />}
              <p className={`text-sm ${
                message.type === 'success'
                  ? 'text-green-700 dark:text-green-400'
                  : 'text-red-700 dark:text-red-400'
              }`}>
                {message.text}
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="rounded-3xl p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30">
          <div className="space-y-6">
            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Haqqında *
                </div>
              </label>
              <RichTextEditor
                value={formData.bio}
                onChange={(value: string) => setFormData({ ...formData, bio: value })}
                placeholder="Peşəkar təcrübəniz, xidmətləriniz və bacarıqlarınız haqqında məlumat verin..."
              />
              {errors.bio && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.bio}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Məkan *
                </div>
              </label>
              <LocationSelector
                isRemote={isRemote}
                onRemoteChange={setIsRemote}
                cityId={cityId}
                onCityChange={setCityId}
                districtId={districtId}
                onDistrictChange={setDistrictId}
                settlementId={settlementId}
                onSettlementChange={setSettlementId}
                metroStationId={metroStationId}
                onMetroStationChange={setMetroStationId}
                locale={locale}
              />
              {errors.city_id && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.city_id}</p>
              )}
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Bacarıqlar *
                </div>
              </label>

              {/* Selected Skills */}
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Add Skill */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  className="flex-1 px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Bacarıq əlavə edin (məs: Web Dizayn)"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Əlavə et
                </button>
              </div>
              {errors.skills && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.skills}</p>
              )}
            </div>

            {/* Hourly Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Saatlıq Qiymət (AZN) *
                </div>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.hourly_rate}
                onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                className={`w-full px-4 py-3 rounded-2xl border ${
                  errors.hourly_rate
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-700'
                } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                placeholder="50"
              />
              {errors.hourly_rate && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.hourly_rate}</p>
              )}
            </div>

            {/* Portfolio Items */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Portfel Nümunələri
              </label>

              {/* Existing Portfolio Items */}
              {formData.portfolio_items.length > 0 && (
                <div className="space-y-3 mb-4">
                  {formData.portfolio_items.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {item.title}
                          </h4>
                          {item.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {item.description}
                            </p>
                          )}
                          {item.project_url && (
                            <a
                              href={item.project_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                              {item.project_url}
                            </a>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemovePortfolio(index)}
                          className="p-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Portfolio Item */}
              <div className="p-4 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 space-y-3">
                <input
                  type="text"
                  value={newPortfolio.title}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Layihə adı"
                />
                <textarea
                  rows={2}
                  value={newPortfolio.description}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  placeholder="Qısa təsvir"
                />
                <input
                  type="url"
                  value={newPortfolio.project_url}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, project_url: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Layihə linki (optional)"
                />
                <button
                  type="button"
                  onClick={handleAddPortfolio}
                  disabled={!newPortfolio.title.trim()}
                  className="w-full px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Portfel Nümunəsi Əlavə Et
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex gap-4">
            <Link
              href={`/${locale}/settings`}
              className="flex-1 px-6 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center"
            >
              Ləğv et
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Yadda saxlanılır...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Dəyişiklikləri Yadda Saxla
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
