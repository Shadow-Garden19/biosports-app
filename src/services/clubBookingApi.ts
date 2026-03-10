/**
 * Service d’appel à l’API de réservation du club.
 * Toute réservation passée par l’app est enregistrée dans le système du club
 * (même base / même planning que le site du club) pour éviter les doubles réservations.
 */
import { clubBookingConfig, isClubApiEnabled } from '../config/clubBooking';
import type { Lieu } from '../types';
import type { CreneauDisponible, ReservationClubPayload, ReservationClubResponse } from '../types/clubBooking';
import { mockLieux } from '../data/mockData';

const { apiBaseUrl, apiKey, timeoutMs } = clubBookingConfig;

async function fetchApi<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${apiBaseUrl.replace(/\/$/, '')}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API club ${res.status}: ${text || res.statusText}`);
    }
    return (await res.json()) as T;
  } catch (e) {
    clearTimeout(timeout);
    throw e;
  }
}

/**
 * Récupère la liste des lieux/terrains depuis le système du club.
 * En mode démo (pas d’API configurée), retourne les lieux mock.
 */
export async function fetchVenues(): Promise<Lieu[]> {
  if (!isClubApiEnabled()) {
    return Promise.resolve(mockLieux);
  }
  try {
    const data = await fetchApi<{ venues?: Lieu[]; data?: Lieu[] }>('/venues');
    const list = data.venues ?? data.data ?? (Array.isArray(data) ? data : []);
    return Array.isArray(list) ? list : mockLieux;
  } catch {
    return mockLieux;
  }
}

/**
 * Récupère les créneaux disponibles pour un lieu à une date donnée.
 * Les créneaux viennent du planning du club (pas de planning indépendant dans l’app).
 */
export async function fetchAvailability(
  lieuId: string,
  date: string
): Promise<CreneauDisponible[]> {
  if (!isClubApiEnabled()) {
    return getMockCreneaux(lieuId, date);
  }
  try {
    const data = await fetchApi<{ slots?: CreneauDisponible[]; creneaux?: CreneauDisponible[] }>(
      `/venues/${encodeURIComponent(lieuId)}/availability?date=${encodeURIComponent(date)}`
    );
    const list = data.slots ?? data.creneaux ?? (Array.isArray(data) ? data : []);
    return Array.isArray(list) ? list : getMockCreneaux(lieuId, date);
  } catch {
    return getMockCreneaux(lieuId, date);
  }
}

/** Génère des créneaux mock pour la démo (1h de 9h à 20h). */
function getMockCreneaux(lieuId: string, date: string): CreneauDisponible[] {
  const lieu = mockLieux.find((l) => l.id === lieuId);
  const prix = lieu?.prixHoraire ?? 40;
  const creneaux: CreneauDisponible[] = [];
  for (let h = 9; h < 20; h++) {
    const heureDebut = `${h.toString().padStart(2, '0')}:00`;
    const heureFin = `${(h + 1).toString().padStart(2, '0')}:00`;
    creneaux.push({
      heureDebut,
      heureFin,
      dureeMinutes: 60,
      prixTotal: prix,
    });
  }
  return creneaux;
}

/**
 * Crée une réservation dans le système du club.
 * La réservation apparaît immédiatement dans la base et le planning du club.
 */
export async function createReservation(
  payload: ReservationClubPayload
): Promise<ReservationClubResponse> {
  if (!isClubApiEnabled()) {
    return simulateCreateReservation(payload);
  }
  const response = await fetchApi<ReservationClubResponse>('/reservations', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response;
}

/** Simule la création côté club en démo (réponse succès). */
function simulateCreateReservation(
  payload: ReservationClubPayload
): Promise<ReservationClubResponse> {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          id: `resa-${Date.now()}`,
          statut: 'confirmee',
          message: 'Réservation enregistrée (mode démo). En production, elle sera enregistrée dans le système du club.',
        }),
      800
    );
  });
}
