import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshRequest: Promise<unknown> | null = null;
const REFRESH_PATH = '/auth/refresh-token';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Enable HTTP-only cookie sending
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  config.withCredentials = true;

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const status = error.response?.status;

    // Do not attempt to refresh if the original request was for login
    if (
      !originalRequest ||
      status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes('/auth/login')
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshRequest) {
        refreshRequest = axios.post(
          `${API_BASE_URL}${REFRESH_PATH}`,
          {},
          {
            withCredentials: true,
          }
        );
      }

      await refreshRequest;

      return axiosInstance(originalRequest);
    } catch (renewError) {
      return Promise.reject(renewError);
    } finally {
      refreshRequest = null;
    }
  }
);

export default axiosInstance;
