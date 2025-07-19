import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from '@/hooks/use-toast';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Token management
export const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const removeToken = (): void => {
  localStorage.removeItem('auth_token');
  delete api.defaults.headers.common['Authorization'];
};

// Initialize token on app start
const token = getToken();
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = '/login';
      toast({
        title: 'Session expirée',
        description: 'Veuillez vous reconnecter',
        variant: 'destructive',
      });
    } else if (error.response?.status === 403) {
      toast({
        title: 'Accès refusé',
        description: 'Vous n\'avez pas les permissions nécessaires',
        variant: 'destructive',
      });
    } else if (error.response?.status >= 500) {
      toast({
        title: 'Erreur serveur',
        description: 'Une erreur est survenue. Veuillez réessayer.',
        variant: 'destructive',
      });
    }
    
    return Promise.reject(error);
  }
);

// API endpoints helper
export const endpoints = {
  // Authentication
  login: '/auth/login',
  logout: '/auth/logout',
  changePassword: '/auth/change-password',
  profile: '/auth/profile',

  // Vehicles
  vehicles: '/vehicles',
  vehicleById: (id: string) => `/vehicles/${id}`,
  vehiclePhotos: (id: string) => `/vehicles/${id}/photos`,
  vehicleQrCode: (id: string) => `/vehicles/${id}/qr-code`,

  // Owners
  owners: '/owners',
  ownerById: (id: string) => `/owners/${id}`,
  ownerVehicles: (id: string) => `/owners/${id}/vehicles`,

  // Procedures
  procedures: '/procedures',
  procedureById: (id: string) => `/procedures/${id}`,
  procedureDocuments: (id: string) => `/procedures/${id}/documents`,

  // Payments
  payments: '/payments',
  paymentById: (id: string) => `/payments/${id}`,
  generateReceipt: (id: string) => `/payments/${id}/receipt`,

  // Users (Admin only)
  users: '/admin/users',
  userById: (id: string) => `/admin/users/${id}`,
  roles: '/admin/roles',

  // Notifications
  notifications: '/notifications',
  sendNotification: '/notifications/send',

  // Dashboard & Reports
  dashboard: '/dashboard/stats',
  reports: '/reports',
  export: '/export',

  // Settings
  settings: '/settings',
  updateSettings: '/settings',
};

export default api;