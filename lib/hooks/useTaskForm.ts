import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import type { TaskFormData } from '@/lib/types/marketplace';

const DRAFT_KEY = 'task_draft';
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

interface ValidationErrors {
  title?: string;
  category_id?: string;
  description?: string;
  budget_type?: string;
  budget_amount?: string;
  deadline?: string;
  location?: string;
  attachments?: string;
}

interface UseTaskFormReturn {
  formData: Partial<TaskFormData>;
  errors: ValidationErrors;
  lastSaved: Date | null;
  setFormField: (field: keyof TaskFormData, value: any) => void;
  validate: () => boolean;
  saveDraft: () => void;
  loadDraft: () => boolean;
  clearDraft: () => void;
  resetForm: () => void;
  addSkill: (skill: string) => void;
  removeSkill: (index: number) => void;
  addFile: (file: File) => boolean;
  removeFile: (index: number) => void;
}

const initialFormData: Partial<TaskFormData> = {
  title: '',
  description: '',
  category_id: undefined,
  budget_type: 'fixed',
  budget_amount: null,
  is_remote: false,
  location: '',
  deadline: null,
  skills: [],
  attachments: [],
};

export function useTaskForm(): UseTaskFormReturn {
  const t = useTranslations('taskCreate.validation');
  const [formData, setFormData] = useState<Partial<TaskFormData>>(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load draft on mount
  useEffect(() => {
    loadDraft();
  }, []);

  // Auto-save
  useEffect(() => {
    const interval = setInterval(() => {
      if (formData.title || formData.description) {
        saveDraft();
      }
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [formData]);

  const setFormField = useCallback((field: keyof TaskFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when it's updated
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const addSkill = useCallback((skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !formData.skills?.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), trimmed]
      }));
    }
  }, [formData.skills]);

  const removeSkill = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills?.filter((_, i) => i !== index) || []
    }));
  }, []);

  const addFile = useCallback((file: File): boolean => {
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const MAX_FILES = 5;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setErrors(prev => ({ ...prev, attachments: t('fileTooLarge') }));
      return false;
    }

    // Validate file count
    if ((formData.attachments?.length || 0) >= MAX_FILES) {
      setErrors(prev => ({ ...prev, attachments: t('tooManyFiles') }));
      return false;
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, attachments: t('invalidFileType') }));
      return false;
    }

    setFormData(prev => ({
      ...prev,
      attachments: [...(prev.attachments || []), file]
    }));
    setErrors(prev => ({ ...prev, attachments: undefined }));
    return true;
  }, [formData.attachments, t]);

  const removeFile = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments?.filter((_, i) => i !== index) || []
    }));
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};

    // Title validation
    if (!formData.title?.trim()) {
      newErrors.title = t('titleRequired');
    } else if (formData.title.trim().length < 3) {
      newErrors.titleMin = t('titleMin');
    } else if (formData.title.trim().length > 200) {
      newErrors.title = t('titleMax');
    }

    // Category validation
    if (!formData.category_id) {
      newErrors.category_id = t('categoryRequired');
    }

    // Description validation (strip HTML tags for length check)
    const descriptionText = formData.description?.replace(/<[^>]*>/g, '').trim() || '';
    if (!descriptionText) {
      newErrors.description = t('descriptionRequired');
    } else if (descriptionText.length < 50) {
      newErrors.description = t('descriptionMin');
    }

    // Budget type validation
    if (!formData.budget_type) {
      newErrors.budget_type = t('budgetTypeRequired');
    }

    // Budget amount validation (optional but must be positive if provided)
    if (formData.budget_amount !== null && formData.budget_amount !== undefined) {
      if (formData.budget_amount <= 0) {
        newErrors.budget_amount = t('budgetPositive');
      }
    }

    // Deadline validation (must be in future if provided)
    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline);
      if (deadlineDate < new Date()) {
        newErrors.deadline = t('deadlineFuture');
      }
    }

    // Location validation (required if not remote)
    if (!formData.is_remote && !formData.location?.trim()) {
      newErrors.location = t('locationRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, t]);

  const saveDraft = useCallback(() => {
    try {
      // Don't save files to localStorage (too large)
      const draftData = { ...formData };
      delete draftData.attachments;

      localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  }, [formData]);

  const loadDraft = useCallback((): boolean => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const draftData = JSON.parse(saved);
        setFormData(prev => ({ ...prev, ...draftData }));
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
    setLastSaved(null);
  }, []);

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
    addFile,
    removeFile,
  };
}
