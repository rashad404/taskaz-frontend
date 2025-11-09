import apiClient from './client';

export interface User {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  telegram_chat_id?: string;
  whatsapp_number?: string;
  slack_webhook?: string;
  push_token?: string;
  available_notification_channels?: string[];
  email_verified_at?: string;
  phone_verified_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  return_url?: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  password_confirmation: string;
  locale?: string;
  timezone?: string;
}

export interface OTPRequest {
  phone: string;
  purpose?: 'login' | 'verify';
}

export interface OTPVerify {
  phone: string;
  code: string;
  name?: string;
  return_url?: string;
}

export interface AuthResponse {
  status: string;
  message?: string;
  data?: {
    user: User;
    return_url?: string;
  };
}

class AuthService {
  // Email/Password Authentication
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/register', data);
    // Token is now in httpOnly cookie - trigger auth state change
    if (response.data.status === 'success') {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('authStateChanged'));
      }
    }
    return response.data;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', credentials);
    // Token is now in httpOnly cookie - trigger auth state change
    if (response.data.status === 'success') {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('authStateChanged'));
      }
    }
    return response.data;
  }

  // Phone OTP Authentication
  async sendOTP(data: OTPRequest): Promise<any> {
    const response = await apiClient.post('/auth/otp/send', data);
    return response.data;
  }

  async verifyOTP(data: OTPVerify): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/otp/verify', data);
    // Token is now in httpOnly cookie - trigger auth state change
    if (response.data.status === 'success') {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('authStateChanged'));
      }
    }
    return response.data;
  }

  // OAuth Authentication
  redirectToOAuth(provider: 'google' | 'facebook', returnUrl?: string) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://100.89.150.50:8007/api';
    const params = returnUrl ? `?return_url=${encodeURIComponent(returnUrl)}` : '';
    window.location.href = `${baseUrl}/auth/${provider}${params}`;
  }

  // User Management
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get('/user');
      return response.data.data;
    } catch (error) {
      return null;
    }
  }

  async updateProfile(data: Partial<User>): Promise<AuthResponse> {
    const response = await apiClient.put('/user', data);
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
      // httpOnly cookie will be cleared by the server
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('authStateChanged'));
      }
    } catch (error) {
      // Ignore errors
    }
  }

  // User Management - Check auth status by calling API
  async isAuthenticated(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return !!user;
    } catch (error) {
      return false;
    }
  }

  // Store return URL for after authentication
  setReturnUrl(url: string) {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('return_url', url);
    }
  }

  getReturnUrl(): string | null {
    if (typeof window !== 'undefined') {
      const url = sessionStorage.getItem('return_url');
      sessionStorage.removeItem('return_url');
      return url;
    }
    return null;
  }
}

export default new AuthService();