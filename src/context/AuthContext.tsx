import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Utilisateur } from '../types';

const STORAGE_KEY = '@biosports_user';

interface AuthContextType {
  user: Utilisateur | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<Utilisateur>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Utilisateur | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as Utilisateur;
            setUser(parsed);
          } catch {
            AsyncStorage.removeItem(STORAGE_KEY);
          }
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const persistUser = useCallback((u: Utilisateur | null) => {
    if (u) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } else {
      AsyncStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    const mockUser: Utilisateur = {
      id: '1',
      username: 'marie_dupont',
      email,
      nom: 'Dupont',
      prenom: 'Marie',
      sports: [
        { sportId: 'tennis', niveau: 'intermediaire', classement: '30/2' },
        { sportId: 'padel', niveau: 'debutant' },
      ],
      localisation: { latitude: 48.8566, longitude: 2.3522, ville: 'Paris', codePostal: '75001' },
      disponibilites: [
        { jour: 'samedi', heureDebut: '14:00', heureFin: '18:00' },
        { jour: 'dimanche', heureDebut: '10:00', heureFin: '12:00' },
      ],
      preferences: ['match_amical', 'entrainement'],
      description: 'Passionnée de tennis, je cherche des partenaires pour jouer le week-end !',
      noteMoyenne: 4.8,
      nombreAvis: 12,
      createdAt: new Date().toISOString(),
    };
    setUser(mockUser);
    persistUser(mockUser);
  }, [persistUser]);

  const logout = useCallback(() => {
    setUser(null);
    persistUser(null);
  }, [persistUser]);

  const updateProfile = useCallback((updates: Partial<Utilisateur>) => {
    setUser((prev) => {
      if (!prev) return null;
      const next = { ...prev, ...updates };
      persistUser(next);
      return next;
    });
  }, [persistUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateProfile,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
