'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LoginCredentials, RegisterCredentials } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: { email: string } | null;
  isAdmin: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ email: string; token: string } | null>;
  register: (credentials: RegisterCredentials) => Promise<{ email: string; token: string } | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const login = async ({ email, password }: LoginCredentials): Promise<{ email: string; token: string } | null> => {
    setLoading(true);
    try {
      if (typeof password !== 'string') {
        throw new Error('Password must be provided');
      }

      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, action: 'login' }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error('Failed to log in');
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON but got: ${text.slice(0, 200)}`);
      }

      const { email: userEmail, token } = await response.json();
      setUser({ email: userEmail });
      setIsAdmin(userEmail === 'abubakar@shopsphere.com');
      localStorage.setItem('token', token);
      return { email: userEmail, token };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ email, password, name, phone, address }: RegisterCredentials): Promise<{ email: string; token: string } | null> => {
    setLoading(true);
    try {
      if (!password || !name || !phone || !address) {
        throw new Error('All fields are required');
      }

      const hashedPassword = await bcryptjs.hash(password, 10);
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: hashedPassword, name, phone, address, action: 'register' }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error('Failed to register');
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON but got: ${text.slice(0, 200)}`);
      }

      const { email: userEmail, token } = await response.json();
      setUser({ email: userEmail });
      localStorage.setItem('token', token);
      return { email: userEmail, token };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('token');
  };

  React.useEffect(() => {
    const showPromo = async () => {
      if (user && !sessionStorage.getItem('promoShown')) {
        try {
          const res = await fetch('/api/settings');
          const settings = await res.json();
          if (settings.promotion_message) {
            toast({ title: 'Notice', description: settings.promotion_message });
            sessionStorage.setItem('promoShown', 'true');
          }
        } catch {
          // Optionally handle fetch error
        }
      }
    };
    showPromo();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
