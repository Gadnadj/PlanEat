"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  verifyAuth: () => Promise<boolean>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${savedToken}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            setToken(savedToken);
          } else if (response.status === 401) {
            // Token invalide, déconnecter
            console.log('Token invalide, déconnexion');
            localStorage.removeItem('token');
            setUser(null);
            setToken(null);
          } else {
            // Erreur serveur, ne pas déconnecter automatiquement
            console.log('Erreur serveur, garde la session');
            // On garde le token mais on ne met pas d'utilisateur temporaire
            setToken(savedToken);
          }
        } catch (error) {
          console.error('Erreur réseau, garde la session:', error);
          // En cas d'erreur réseau, garder le token
          setToken(savedToken);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('token', data.token);
      }

      return { success: data.success, message: data.message };
    } catch {
      return { success: false, message: 'Erreur de connexion' };
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('token', data.token);
      }

      return { success: data.success, message: data.message };
    } catch {
      return { success: false, message: 'Erreur lors de l\'inscription' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  // Fonction pour vérifier l'authentification de manière robuste
  const verifyAuth = async () => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) return false;

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${savedToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setToken(savedToken);
        return true;
      } else if (response.status === 401) {
        logout();
        return false;
      }
      return true; // Garde la session en cas d'erreur serveur
    } catch (error) {
      console.error('Erreur de vérification auth:', error);
      return true; // Garde la session en cas d'erreur réseau
    }
  };

  const value = {
    user,
    token,
    login,
    signup,
    logout,
    verifyAuth,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
