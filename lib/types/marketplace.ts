// TypeScript types for Task.az marketplace

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  parent_id: number | null;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
  children?: Category[];
  tasks?: Task[];
}

export interface User {
  id: number;
  name: string;
  slug: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  type: 'client' | 'professional' | 'both';
  bio: string | null;
  location: string | null;
  status: 'active' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface TaskAttachment {
  filename: string;
  original_name: string;
  path: string;
  url?: string;
  size: number;
  type: string;
}

export interface Task {
  id: number;
  user_id: number;
  category_id: number;
  title: string;
  slug: string;
  description: string;
  budget_type: 'fixed' | 'hourly';
  budget_amount: string | null;
  location: string | null;
  is_remote: boolean;
  status: 'open' | 'assigned' | 'completed' | 'cancelled';
  deadline: string | null;
  views_count: number;
  created_at: string;
  updated_at: string;
  attachments?: TaskAttachment[];
  client?: User;
  category?: Category;
  applications?: Application[];
  contracts?: Contract[];
  messages?: Message[];
}

export interface Application {
  id: number;
  task_id: number;
  user_id: number;
  proposed_amount: string;
  message: string;
  estimated_days: number | null;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  task?: Task;
  professional?: User;
}

export interface Contract {
  id: number;
  task_id: number;
  application_id: number;
  client_id: number;
  professional_id: number;
  final_amount: string;
  status: 'active' | 'completed' | 'cancelled';
  started_at: string | null;
  completed_at: string | null;
  completion_notes: string | null;
  created_at: string;
  updated_at: string;
  task?: Task;
  application?: Application;
  client?: User;
  professional?: User;
  payments?: Payment[];
  reviews?: Review[];
}

export interface Payment {
  id: number;
  contract_id: number;
  amount: string;
  method: 'cash' | 'bank_transfer' | 'online';
  status: 'pending' | 'sent' | 'confirmed';
  client_confirmed: boolean;
  professional_confirmed: boolean;
  notes: string | null;
  transaction_id: string | null;
  gateway: string | null;
  fee_amount: string | null;
  net_amount: string | null;
  client_confirmed_at: string | null;
  professional_confirmed_at: string | null;
  created_at: string;
  updated_at: string;
  contract?: Contract;
}

export interface Review {
  id: number;
  contract_id: number;
  reviewer_id: number;
  reviewed_id: number;
  rating: number;
  comment: string | null;
  type: 'client_to_professional' | 'professional_to_client';
  created_at: string;
  updated_at: string;
  contract?: Contract;
  reviewer?: User;
  reviewed?: User;
}

export interface Message {
  id: number;
  task_id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  task?: Task;
  sender?: User;
  receiver?: User;
}

export interface Conversation {
  task: Task;
  last_message: Message;
  unread_count: number;
}

// API Response types
export interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  status: 'success' | 'error';
  data: {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ReviewsResponse {
  status: 'success';
  data: {
    reviews: {
      data: Review[];
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
    average_rating: number;
    total_reviews: number;
  };
}

// Filter types
export interface TaskFilters {
  category_id?: number;
  budget_type?: 'fixed' | 'hourly';
  is_remote?: boolean;
  city_id?: number;
  location?: string;
  search?: string;
  sort_by?: 'created_at' | 'budget_amount' | 'views_count';
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

// Form types
export interface TaskFormData {
  category_id: number;
  title: string;
  description: string;
  budget_type: 'fixed' | 'hourly';
  budget_amount: number | null;
  location: string | null;
  is_remote: boolean;
  deadline: string | null;
  skills?: string[];
  attachments?: File[];
}

export interface ApplicationFormData {
  task_id: number;
  proposed_amount: number;
  message: string;
  estimated_days: number | null;
}

export interface PaymentFormData {
  contract_id: number;
  amount: number;
  method: 'cash' | 'bank_transfer' | 'online';
  notes: string | null;
}

export interface ReviewFormData {
  contract_id: number;
  rating: number;
  comment: string | null;
}

export interface MessageFormData {
  task_id: number;
  receiver_id: number;
  message: string;
}
