import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Utilisateur } from '../types';

interface AuthContextType {
  user: Utilisateur | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<Utilisateur>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Utilisateur | null>(null);

  const login = useCallback(async (email: string, _password: string) => {
    // Simulation : en production, appeler l'API
    const mockUser: Utilisateur = {
      id: '1',
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
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const updateProfile = useCallback((updates: Partial<Utilisateur>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateProfile,
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
