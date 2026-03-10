/**
 * Configuration de l’API de réservation du club.
 * Connecte l’app au système de réservation du club (site du club, Anybuddy, etc.).
 *
 * Pour activer la connexion au club :
 * 1. Définir CLUB_BOOKING_API_URL avec l’URL de base de l’API du club
 *    (ex. https://api.monclub.fr ou l’API fournie par le prestataire type Anybuddy)
 * 2. Si l’API exige une clé : CLUB_BOOKING_API_KEY
 *
 * L’API du club doit exposer au minimum :
 * - GET /venues (ou /terrains) → liste des lieux/terrains
 * - GET /venues/:id/availability?date=YYYY-MM-DD → créneaux disponibles
 * - POST /reservations → créer une réservation (enregistrée côté club)
 */

// En production, utiliser des variables d’environnement (expo: app.config.js extra, ou .env)
const getEnv = (key: string): string | undefined => {
  if (typeof (global as any).__CLUB_BOOKING_ENV__ === 'object' && (global as any).__CLUB_BOOKING_ENV__[key] != null) {
    return String((global as any).__CLUB_BOOKING_ENV__[key]);
  }
  return undefined;
};

export const clubBookingConfig = {
  /** URL de base de l’API du club (sans slash final). Vide = mode démo (mock). */
  apiBaseUrl: getEnv('CLUB_BOOKING_API_URL') || '',
  /** Clé API si le club l’exige (header Authorization ou query). */
  apiKey: getEnv('CLUB_BOOKING_API_KEY') || '',
  /** Timeout des requêtes en ms */
  timeoutMs: 15000,
};

export const isClubApiEnabled = (): boolean => !!clubBookingConfig.apiBaseUrl;
