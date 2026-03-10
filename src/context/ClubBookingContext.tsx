import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Lieu } from '../types';
import type { CreneauDisponible, ReservationClubResponse } from '../types/clubBooking';
import { fetchVenues, fetchAvailability, createReservation as apiCreateReservation } from '../services/clubBookingApi';
import { useAuth } from './AuthContext';
import { mockUsers } from '../data/mockData';

interface ClubBookingContextType {
  /** Lieux/terrains (depuis l’API du club ou mock). */
  venues: Lieu[];
  /** Chargement de la liste des lieux. */
  loadingVenues: boolean;
  /** Erreur éventuelle (lieux ou réservation). */
  error: string | null;
  /** Recharger la liste des lieux. */
  refreshVenues: () => Promise<void>;
  /** Récupérer les créneaux disponibles pour un lieu à une date (planning du club). */
  getAvailability: (lieuId: string, date: string) => Promise<CreneauDisponible[]>;
  /**
   * Créer une réservation dans le système du club.
   * La réservation est enregistrée côté club (même base que le site du club).
   */
  createReservation: (params: {
    lieuId: string;
    date: string;
    heureDebut: string;
    dureeMinutes: number;
    sessionId?: string;
    terrainId?: string;
    /** Nombre de participants (2 à 6). Défaut 2. Utilisé pour joueursIds et part par joueur. */
    nbPersonnes?: number;
  }) => Promise<ReservationClubResponse>;
  /** En cours de création de réservation. */
  reserving: boolean;
}

const ClubBookingContext = createContext<ClubBookingContextType | undefined>(undefined);

export function ClubBookingProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [venues, setVenues] = useState<Lieu[]>([]);
  const [loadingVenues, setLoadingVenues] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reserving, setReserving] = useState(false);

  const loadVenues = useCallback(async () => {
    setLoadingVenues(true);
    setError(null);
    try {
      const list = await fetchVenues();
      setVenues(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Impossible de charger les lieux');
      setVenues([]);
    } finally {
      setLoadingVenues(false);
    }
  }, []);

  useEffect(() => {
    loadVenues();
  }, [loadVenues]);

  const getAvailability = useCallback(async (lieuId: string, date: string) => {
    return fetchAvailability(lieuId, date);
  }, []);

  const createReservation = useCallback(
    async (params: {
      lieuId: string;
      date: string;
      heureDebut: string;
      dureeMinutes: number;
      sessionId?: string;
      terrainId?: string;
      nbPersonnes?: number;
    }) => {
      setReserving(true);
      setError(null);
      try {
        const nb = Math.min(6, Math.max(2, params.nbPersonnes ?? 2));
        const others = mockUsers.filter((u) => u.id !== user?.id).slice(0, nb - 1).map((u) => u.id);
        const joueursIds = user ? [user.id, ...others] : [];
        const payload = {
          lieuId: params.lieuId,
          terrainId: params.terrainId,
          date: params.date,
          heureDebut: params.heureDebut,
          dureeMinutes: params.dureeMinutes,
          userId: user?.id ?? '',
          userEmail: user?.email ?? '',
          sessionId: params.sessionId,
          joueursIds,
        };
        const result = await apiCreateReservation(payload);
        return result;
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Erreur lors de la réservation';
        setError(msg);
        throw e;
      } finally {
        setReserving(false);
      }
    },
    [user]
  );

  return (
    <ClubBookingContext.Provider
      value={{
        venues,
        loadingVenues,
        error,
        refreshVenues: loadVenues,
        getAvailability,
        createReservation,
        reserving,
      }}
    >
      {children}
    </ClubBookingContext.Provider>
  );
}

export function useClubBooking() {
  const ctx = useContext(ClubBookingContext);
  if (ctx === undefined) {
    throw new Error('useClubBooking must be used within ClubBookingProvider');
  }
  return ctx;
}
