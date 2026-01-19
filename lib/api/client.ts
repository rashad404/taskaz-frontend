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
    // Don't dispatch events here - let components handle 401 errors themselves
    // Dispatching authStateChanged on 401 causes infinite loops with useAuthState
    return Promise.reject(error);
  }
);

export default apiClient;