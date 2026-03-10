import type { Lieu } from './index';

/** Créneau horaire disponible renvoyé par l’API du club */
export interface CreneauDisponible {
  heureDebut: string; // "14:00"
  heureFin: string;   // "15:00"
  dureeMinutes: number;
  prixTotal?: number;
  terrainId?: string;
  terrainNom?: string;
}

/** Payload pour créer une réservation côté club */
export interface ReservationClubPayload {
  lieuId: string;
  terrainId?: string;
  date: string;       // YYYY-MM-DD
  heureDebut: string;  // "14:00"
  heureFin?: string;  // "15:00"
  dureeMinutes: number;
  userId: string;
  userEmail: string;
  sessionId?: string;  // id session BIOSPORTS si liée
  joueursIds?: string[];
}

/** Réponse de l’API du club après création de réservation */
export interface ReservationClubResponse {
  id: string;
  statut: 'en_attente' | 'confirmee' | 'payee' | 'annulee';
  message?: string;
}

/** Format attendu de l’API lieux (si différent de Lieu) */
export type LieuApi = Lieu;
