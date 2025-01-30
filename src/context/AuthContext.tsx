'use client'

import { createContext, useContext, useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { User } from "@prisma/client";

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const userId = Cookies.get('userId');
    if (userId) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);

    // Set cookie with 7 days expiry
    Cookies.set('userId', userData.id.toString(), { 
      expires: 7,
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    Cookies.remove('userId', { path: '/' });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
