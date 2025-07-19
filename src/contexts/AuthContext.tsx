import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, LoginCredentials, AuthResponse } from '@/types';
import { api, setToken, removeToken, getToken, endpoints } from '@/services/api';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!getToken();

  // Check authentication status on app load
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          await refreshUser();
        } catch (error) {
          removeToken();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await api.post<AuthResponse>(endpoints.login, credentials);
      const { user, token } = response.data;

      setToken(token);
      setUser(user);

      toast({
        title: 'Connexion réussie',
        description: `Bienvenue, ${user.name}`,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erreur de connexion';
      toast({
        title: 'Erreur de connexion',
        description: message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      api.post(endpoints.logout).catch(() => {
        // Ignore logout errors - user is logging out anyway
      });
    } finally {
      removeToken();
      setUser(null);
      toast({
        title: 'Déconnexion',
        description: 'Vous avez été déconnecté avec succès',
      });
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.get<{ user: User }>(endpoints.profile);
      setUser(response.data.user);
    } catch (error) {
      removeToken();
      setUser(null);
      throw error;
    }
  };

  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    hasRole,
    hasAnyRole,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};