import axios from 'axios';
import type {
  Category,
  Task,
  Application,
  Contract,
  Payment,
  Review,
  Message,
  Conversation,
  ApiResponse,
  PaginatedResponse,
  ReviewsResponse,
  TaskFilters,
  TaskFormData,
  ApplicationFormData,
  PaymentFormData,
  ReviewFormData,
  MessageFormData,
} from '@/lib/types/marketplace';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://100.89.150.50:8008/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Categories API
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data;
  },

  getById: async (id: number): Promise<Category> => {
    const response = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data.data;
  },
};

// Tasks API
export const tasksApi = {
  getAll: async (filters?: TaskFilters): Promise<PaginatedResponse<Task>['data']> => {
    const response = await apiClient.get<PaginatedResponse<Task>>('/tasks', {
      params: filters,
    });
    return response.data.data;
  },

  getById: async (id: number): Promise<Task> => {
    const response = await apiClient.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data.data;
  },

  create: async (data: TaskFormData): Promise<Task> => {
    const response = await apiClient.post<ApiResponse<Task>>('/tasks', data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<TaskFormData>): Promise<Task> => {
    const response = await apiClient.put<ApiResponse<Task>>(`/tasks/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },

  getMyTasks: async (perPage = 20): Promise<PaginatedResponse<Task>['data']> => {
    const response = await apiClient.get<PaginatedResponse<Task>>('/my-tasks', {
      params: { per_page: perPage },
    });
    return response.data.data;
  },
};

// Applications API
export const applicationsApi = {
  create: async (data: ApplicationFormData): Promise<Application> => {
    const response = await apiClient.post<ApiResponse<Application>>('/applications', data);
    return response.data.data;
  },

  getMyApplications: async (perPage = 20): Promise<PaginatedResponse<Application>['data']> => {
    const response = await apiClient.get<PaginatedResponse<Application>>('/my-applications', {
      params: { per_page: perPage },
    });
    return response.data.data;
  },

  accept: async (id: number): Promise<Contract> => {
    const response = await apiClient.post<ApiResponse<Contract>>(`/applications/${id}/accept`);
    return response.data.data;
  },

  reject: async (id: number): Promise<void> => {
    await apiClient.post(`/applications/${id}/reject`);
  },
};

// Contracts API
export const contractsApi = {
  getAll: async (status?: string, perPage = 20): Promise<PaginatedResponse<Contract>['data']> => {
    const response = await apiClient.get<PaginatedResponse<Contract>>('/contracts', {
      params: { status, per_page: perPage },
    });
    return response.data.data;
  },

  getById: async (id: number): Promise<Contract> => {
    const response = await apiClient.get<ApiResponse<Contract>>(`/contracts/${id}`);
    return response.data.data;
  },

  complete: async (id: number, completionNotes?: string): Promise<Contract> => {
    const response = await apiClient.post<ApiResponse<Contract>>(`/contracts/${id}/complete`, {
      completion_notes: completionNotes,
    });
    return response.data.data;
  },

  cancel: async (id: number): Promise<Contract> => {
    const response = await apiClient.post<ApiResponse<Contract>>(`/contracts/${id}/cancel`);
    return response.data.data;
  },
};

// Payments API
export const paymentsApi = {
  getAll: async (perPage = 20): Promise<PaginatedResponse<Payment>['data']> => {
    const response = await apiClient.get<PaginatedResponse<Payment>>('/payments', {
      params: { per_page: perPage },
    });
    return response.data.data;
  },

  getById: async (id: number): Promise<Payment> => {
    const response = await apiClient.get<ApiResponse<Payment>>(`/payments/${id}`);
    return response.data.data;
  },

  create: async (data: PaymentFormData): Promise<Payment> => {
    const response = await apiClient.post<ApiResponse<Payment>>('/payments', data);
    return response.data.data;
  },

  confirmByClient: async (id: number): Promise<Payment> => {
    const response = await apiClient.post<ApiResponse<Payment>>(`/payments/${id}/confirm-client`);
    return response.data.data;
  },

  confirmByprofessional: async (id: number): Promise<Payment> => {
    const response = await apiClient.post<ApiResponse<Payment>>(`/payments/${id}/confirm-professional`);
    return response.data.data;
  },
};

// Reviews API
export const reviewsApi = {
  create: async (data: ReviewFormData): Promise<Review> => {
    const response = await apiClient.post<ApiResponse<Review>>('/reviews', data);
    return response.data.data;
  },

  getUserReviews: async (userId: number, perPage = 20): Promise<ReviewsResponse['data']> => {
    const response = await apiClient.get<ReviewsResponse>(`/users/${userId}/reviews`, {
      params: { per_page: perPage },
    });
    return response.data.data;
  },
};

// Messages API
export const messagesApi = {
  getTaskMessages: async (taskId: number): Promise<Message[]> => {
    const response = await apiClient.get<ApiResponse<Message[]>>(`/tasks/${taskId}/messages`);
    return response.data.data;
  },

  send: async (data: MessageFormData): Promise<Message> => {
    const response = await apiClient.post<ApiResponse<Message>>('/messages', data);
    return response.data.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get<ApiResponse<{ unread_count: number }>>('/messages/unread-count');
    return response.data.data.unread_count;
  },

  getConversations: async (): Promise<Conversation[]> => {
    const response = await apiClient.get<ApiResponse<Conversation[]>>('/conversations');
    return response.data.data;
  },
};

// Users API
export const usersApi = {
  getAll: async (filters?: any): Promise<any> => {
    const response = await apiClient.get<any>('/professionals', {
      params: filters,
    });
    return response.data.data;
  },

  getTopprofessionals: async (limit = 6): Promise<any[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>('/top-professionals', {
      params: { limit },
    });
    return response.data.data;
  },
};

// Export all
export const marketplaceApi = {
  categories: categoriesApi,
  tasks: tasksApi,
  applications: applicationsApi,
  contracts: contractsApi,
  payments: paymentsApi,
  reviews: reviewsApi,
  messages: messagesApi,
  users: usersApi,
};
