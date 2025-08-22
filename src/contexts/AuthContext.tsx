import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, LoginCredentials } from '@/types';
import { toast } from '@/hooks/use-toast';
import { mockUsers } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: LoginCredentials, role?: User['role']) => Promise<void>;
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

  const isAuthenticated = !!user;

  // Mock user credentials
  const mockCredentials = [
    { email: 'admin@test.com', password: 'Admin123!' },
    { email: 'agent@test.com', password: 'Agent123!' },
    { email: 'finance@test.com', password: 'Finance123!' }
  ];

  // Initialize auth state
  useEffect(() => {
    const savedUser = localStorage.getItem('mock_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        localStorage.removeItem('mock_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check credentials against mock data
      const isValidCredential = mockCredentials.find(
        cred => cred.email === credentials.email && cred.password === credentials.password
      );
      
      if (!isValidCredential) {
        throw new Error('Email ou mot de passe incorrect');
      }
      
      // Find user in mock data
      const foundUser = mockUsers.find(u => u.email === credentials.email);
      if (!foundUser) {
        throw new Error('Utilisateur non trouvé');
      }
      
      setUser(foundUser);
      localStorage.setItem('mock_user', JSON.stringify(foundUser));
      
      toast({ 
        title: 'Connexion réussie', 
        description: `Bienvenue ${foundUser.name}` 
      });
    } catch (error: any) {
      toast({ 
        title: 'Erreur de connexion', 
        description: error.message || 'Erreur', 
        variant: 'destructive' 
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (credentials: LoginCredentials, role: User['role'] = 'agent') => {
    try {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === credentials.email);
      if (existingUser) {
        throw new Error('Un utilisateur avec cet email existe déjà');
      }
      
      // Create new user (in a real app, this would be sent to the server)
      const newUser: User = {
        id: (mockUsers.length + 1).toString(),
        name: credentials.email.split('@')[0],
        email: credentials.email,
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      mockUsers.push(newUser);
      
      toast({ 
        title: 'Inscription réussie', 
        description: 'Compte créé avec succès' 
      });
    } catch (error: any) {
      toast({ 
        title: "Erreur d'inscription", 
        description: error.message || 'Erreur', 
        variant: 'destructive' 
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mock_user');
    toast({ 
      title: 'Déconnexion', 
      description: 'Vous avez été déconnecté avec succès' 
    });
    window.location.href = '/login';
  };

  const refreshUser = async () => {
    // In mock mode, just return the current user
    return Promise.resolve();
  };

  const hasRole = (role: string): boolean => user?.role === role;
  const hasAnyRole = (roles: string[]): boolean => (user ? roles.includes(user.role) : false);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
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