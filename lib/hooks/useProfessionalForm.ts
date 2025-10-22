import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';

const DRAFT_KEY = 'professional_draft';
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

interface PortfolioItem {
  title: string;
  description?: string;
  image_url?: string;
  project_url?: string;
}

interface ProfessionalFormData {
  bio: string;
  location: string;
  city_id?: number | null;
  district_id?: number | null;
  settlement_id?: number | null;
  metro_station_id?: number | null;
  skills: string[];
  hourly_rate: number | null;
  portfolio_items: PortfolioItem[];
}

interface ValidationErrors {
  bio?: string;
  location?: string;
  skills?: string;
  hourly_rate?: string;
  portfolio_items?: string[];
}

interface UseProfessionalFormReturn {
  formData: ProfessionalFormData;
  errors: ValidationErrors;
  lastSaved: Date | null;
  setFormField: (field: keyof ProfessionalFormData, value: any) => void;
  validate: () => boolean;
  saveDraft: () => void;
  loadDraft: () => boolean;
  clearDraft: () => void;
  resetForm: () => void;
  addSkill: (skill: string) => void;
  removeSkill: (index: number) => void;
  addPortfolioItem: () => void;
  updatePortfolioItem: (index: number, field: keyof PortfolioItem, value: string) => void;
  removePortfolioItem: (index: number) => void;
}

const initialFormData: ProfessionalFormData = {
  bio: '',
  location: '',
  city_id: null,
  district_id: null,
  settlement_id: null,
  metro_station_id: null,
  skills: [],
  hourly_rate: null,
  portfolio_items: [],
};

export function useProfessionalForm(): UseProfessionalFormReturn {
  const t = useTranslations('becomeProfessional.validation');
  const [formData, setFormData] = useState<ProfessionalFormData>(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load draft on mount
  useEffect(() => {
    loadDraft();
  }, []);

  // Auto-save
  useEffect(() => {
    const interval = setInterval(() => {
      const bioText = formData.bio.replace(/<[^>]*>/g, '').trim();
      if (bioText || formData.skills.length > 0) {
        try {
          localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
          setLastSaved(new Date());
        } catch (error) {
          console.error('Failed to save draft:', error);
        }
      }
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [formData]);

  const setFormField = useCallback((field: keyof ProfessionalFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when it's updated
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const addSkill = useCallback((skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !formData.skills.includes(trimmed) && formData.skills.length < 15) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, trimmed]
      }));
    }
  }, [formData.skills]);

  const removeSkill = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  }, []);

  const addPortfolioItem = useCallback(() => {
    if (formData.portfolio_items.length < 5) {
      setFormData(prev => ({
        ...prev,
        portfolio_items: [
          ...prev.portfolio_items,
          { title: '', description: '', image_url: '', project_url: '' }
        ]
      }));
    }
  }, [formData.portfolio_items]);

  const updatePortfolioItem = useCallback((index: number, field: keyof PortfolioItem, value: string) => {
    setFormData(prev => ({
      ...prev,
      portfolio_items: prev.portfolio_items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  }, []);

  const removePortfolioItem = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      portfolio_items: prev.portfolio_items.filter((_, i) => i !== index)
    }));
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};

    // Bio validation - strip HTML tags for character count
    const bioText = formData.bio.replace(/<[^>]*>/g, '').trim();
    if (!bioText) {
      newErrors.bio = t('bioRequired');
    } else if (bioText.length < 50) {
      newErrors.bio = t('bioMin');
    } else if (bioText.length > 1000) {
      newErrors.bio = t('bioMax');
    }

    // Location validation (check city_id)
    if (!formData.city_id) {
      newErrors.location = t('locationRequired');
    }

    // Skills validation
    if (formData.skills.length < 3) {
      newErrors.skills = t('skillsRequired');
    } else if (formData.skills.length > 15) {
      newErrors.skills = t('skillsMax');
    }

    // Hourly rate validation
    if (!formData.hourly_rate || formData.hourly_rate <= 0) {
      newErrors.hourly_rate = t('hourlyRateRequired');
    } else if (formData.hourly_rate < 1) {
      newErrors.hourly_rate = t('hourlyRateMin');
    }

    // Portfolio validation
    const portfolioErrors: string[] = [];
    formData.portfolio_items.forEach((item, index) => {
      if (!item.title.trim()) {
        portfolioErrors[index] = t('portfolioTitleRequired');
      }
      if (item.image_url && !isValidUrl(item.image_url)) {
        portfolioErrors[index] = t('portfolioImageInvalid');
      }
      if (item.project_url && !isValidUrl(item.project_url)) {
        portfolioErrors[index] = t('portfolioProjectInvalid');
      }
    });

    if (portfolioErrors.length > 0) {
      newErrors.portfolio_items = portfolioErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, t]);

  const saveDraft = useCallback(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  }, [formData]);

  const loadDraft = useCallback((): boolean => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
        setLastSaved(new Date());
        return true;
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
    return false;
  }, []);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_KEY);
      setLastSaved(null);
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    clearDraft();
  }, [clearDraft]);

  return {
    formData,
    errors,
    lastSaved,
    setFormField,
    validate,
    saveDraft,
    loadDraft,
    clearDraft,
    resetForm,
    addSkill,
    removeSkill,
    addPortfolioItem,
    updatePortfolioItem,
    removePortfolioItem,
  };
}

// Helper function to validate URLs
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
