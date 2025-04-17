'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  User,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from '../../firebase/config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const defaultAuthContextValue: AuthContextType = {
  user: null,
  loading: true,
  signOut: async () => {
    console.warn('SignOut function called before AuthProvider mounted');
  },
};

const AuthContext = createContext<AuthContextType>(defaultAuthContextValue);

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      // Remove console.log for production
      // console.log('Auth state changed:', currentUser ? currentUser.uid : 'No user');
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      // Usuń ciasteczko przy wylogowaniu (good practice)
      document.cookie =
        'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const value = {
    user,
    loading,
    signOut,
  };

  // Don't render children until auth state is determined
  // This prevents flashes of incorrect UI states
  // if (loading) {
  //   return null; // Or a global loading indicator
  // }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
