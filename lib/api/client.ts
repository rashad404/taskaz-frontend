import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Enable credentials to send cookies
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access - user needs to re-login
      if (typeof window !== 'undefined') {
        // Trigger auth state change event
        window.dispatchEvent(new Event('authStateChanged'));
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;