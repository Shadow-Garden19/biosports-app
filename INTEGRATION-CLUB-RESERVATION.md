# Intégration réservation club

L’application enregistre les réservations **directement dans le système du club** (même base et même planning que le site du club), pour éviter les doubles réservations et garder une synchronisation parfaite.

## Fonctionnement

- **Lieux** : chargés depuis l’API du club (ou mock en démo).
- **Disponibilités** : les créneaux viennent du planning du club (`/venues/:id/availability?date=`).
- **Réservation** : un clic sur « Payer et réserver » envoie la réservation à l’API du club (`POST /reservations`). Elle apparaît immédiatement dans le planning du club.

## Connecter l’API de votre club

1. **Configurer l’URL et la clé API**  
   Dans le code, définir les variables utilisées par `src/config/clubBooking.ts` :
   - `CLUB_BOOKING_API_URL` : URL de base de l’API du club (ex. `https://api.monclub.fr`).
   - `CLUB_BOOKING_API_KEY` : clé API si le club l’exige (optionnel).

   Pour Expo, vous pouvez passer ces valeurs via `app.config.js` :

   ```js
   export default {
     expo: {
       extra: {
         CLUB_BOOKING_API_URL: process.env.CLUB_BOOKING_API_URL || '',
         CLUB_BOOKING_API_KEY: process.env.CLUB_BOOKING_API_KEY || '',
       },
     },
   };
   ```

   Puis dans `src/config/clubBooking.ts`, lire `expo-constants` :  
   `Constants.expoConfig?.extra?.CLUB_BOOKING_API_URL`, etc.

2. **Contrat d’API attendu**  
   L’API du club doit exposer au minimum :

   | Méthode | Endpoint | Description |
   |--------|----------|-------------|
   | GET | `/venues` | Liste des lieux/terrains (réponse : `{ venues: Lieu[] }` ou `{ data: Lieu[] }`). |
   | GET | `/venues/:id/availability?date=YYYY-MM-DD` | Créneaux disponibles pour le lieu à la date donnée. |
   | POST | `/reservations` | Création d’une réservation (body : lieuId, date, heureDebut, dureeMinutes, userId, userEmail, etc.). |

   Les types TypeScript sont dans `src/types/clubBooking.ts` et `src/types/index.ts` (Lieu).

3. **Sans API (démo)**  
   Si `CLUB_BOOKING_API_URL` est vide, l’app utilise les données mock : les réservations sont simulées et ne sont pas enregistrées dans un vrai système.

## Fichiers concernés

- `src/config/clubBooking.ts` – configuration (URL, clé).
- `src/services/clubBookingApi.ts` – appels API + repli sur le mock.
- `src/context/ClubBookingContext.tsx` – état global (lieux, réservation).
- `src/screens/BookingScreen.tsx` – écran de réservation (appel à l’API club).
- `src/screens/VenuesScreen.tsx` – liste des lieux (depuis l’API club ou mock).
