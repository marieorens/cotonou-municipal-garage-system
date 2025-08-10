import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, LoginCredentials } from '@/types';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

const cleanupAuthState = () => {
  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  } catch {}
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  const isAuthenticated = hasSession && !!user;

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;

    if (data) {
      const mapped: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role as User['role'],
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
      setUser(mapped);
    } else {
      setUser(null);
    }
  };

  // Initialize auth state and subscribe to changes
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setHasSession(!!session);
      const supaUser = session?.user;
      if (supaUser) {
        setTimeout(() => {
          loadProfile(supaUser.id).catch(() => setUser(null));
        }, 0);
      } else {
        setUser(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(!!session);
      const supaUser = session?.user;
      if (supaUser) {
        loadProfile(supaUser.id).catch(() => setUser(null));
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      cleanupAuthState();
      try { await supabase.auth.signOut({ scope: 'global' }); } catch {}

      const { error, data } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      if (error) throw error;

      const supaUser = data.user;
      if (supaUser) {
        await loadProfile(supaUser.id);
        toast({ title: 'Connexion réussie', description: `Bienvenue` });
      }
    } catch (error: any) {
      toast({ title: 'Erreur de connexion', description: error.message || 'Erreur', variant: 'destructive' });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (credentials: LoginCredentials, role: User['role'] = 'agent') => {
    try {
      setIsLoading(true);
      cleanupAuthState();
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: { role },
        },
      });
      if (error) throw error;
      toast({ title: 'Inscription réussie', description: 'Vérifiez votre email pour confirmer.' });
    } catch (error: any) {
      toast({ title: "Erreur d'inscription", description: error.message || 'Erreur', variant: 'destructive' });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      cleanupAuthState();
      supabase.auth.signOut({ scope: 'global' }).catch(() => {});
    } finally {
      setUser(null);
      toast({ title: 'Déconnexion', description: 'Vous avez été déconnecté avec succès' });
      window.location.href = '/login';
    }
  };

  const refreshUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const supaUser = session?.user;
    if (supaUser) {
      await loadProfile(supaUser.id);
    } else {
      setUser(null);
    }
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