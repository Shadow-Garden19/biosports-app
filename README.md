# BIOSPORTS – Mise en relation sportive

Application mobile pour trouver des partenaires sportifs à proximité, réserver des terrains et organiser des sessions.

## Fonctionnalités

- **Profil** : sports pratiqués, niveaux, disponibilités, préférences (match amical, entraînement, compétition)
- **Recherche** : filtres par sport, niveau, jour, heure, type de session
- **Sessions** : consulter les sessions à proximité, voir le détail, contacter l’organisateur
- **Chat** : messagerie intégrée avec les partenaires
- **Lieux** : liste des clubs et terrains partenaires
- **Réservation** : choix d’un lieu, affichage du prix et de la part par joueur, paiement (flux préparé)

## Démarrage

### Prérequis

- Node.js 18+
- npm ou yarn
- Expo Go sur smartphone (ou simulateur iOS/Android)

### Installation

```bash
cd biosports-app
npm install
npx expo start
```

Puis scanner le QR code avec Expo Go (Android) ou l’appareil photo (iOS).

### Connexion (mode démo)

- **Email** : n’importe quelle adresse (ex. `test@biosports.fr`)
- **Mot de passe** : n’importe lequel

La connexion est simulée : un profil type est chargé pour tester l’app.

## Structure du projet

```
biosports-app/
├── App.tsx                 # Point d’entrée, AuthProvider, navigation
├── src/
│   ├── context/            # AuthContext (état utilisateur)
│   ├── data/               # Données mock (utilisateurs, sessions, lieux, messages)
│   ├── navigation/         # React Navigation (stack + tabs)
│   ├── screens/            # Écrans (Accueil, Recherche, Profil, Chat, etc.)
│   ├── theme/              # Couleurs et espacements
│   └── types/              # Types TypeScript (Utilisateur, Session, Lieu, etc.)
├── app.json
└── package.json
```

## Évolutions possibles

- Backend (API) pour auth, profils, sessions, chat, réservations
- Géolocalisation réelle et calcul de distance
- Paiement (Stripe, etc.) et reversement aux clubs
- Notifications push pour nouvelles demandes et messages
- Notation des joueurs et historique des matchs

## Sports gérés

Tennis, padel, basketball, football, badminton, squash, volleyball, running, musculation, autre.

## Licence

Projet personnel / éducatif.
