// Types pour l'application BIOSPORTS

export type SportId =
  | 'tennis'
  | 'padel'
  | 'basketball'
  | 'football'
  | 'badminton'
  | 'squash'
  | 'volleyball'
  | 'running'
  | 'musculation'
  | 'autre';

export type Niveau = 'debutant' | 'intermediaire' | 'avance' | 'expert';

export type TypeSession = 'match_amical' | 'entrainement' | 'competition';

export type JourSemaine =
  | 'lundi'
  | 'mardi'
  | 'mercredi'
  | 'jeudi'
  | 'vendredi'
  | 'samedi'
  | 'dimanche';

export interface SportProfil {
  sportId: SportId;
  niveau: Niveau;
  classement?: string; // ex: "15/2" pour tennis
}

export interface Disponibilite {
  jour: JourSemaine;
  heureDebut: string; // "09:00"
  heureFin: string;   // "12:00"
}

export interface Localisation {
  latitude: number;
  longitude: number;
  ville?: string;
  codePostal?: string;
}

export interface Utilisateur {
  id: string;
  /** Identifiant unique pour la recherche d'amis (ex: marie_dupont → affiché @marie_dupont). */
  username: string;
  email: string;
  nom: string;
  prenom: string;
  photoUrl?: string;
  sports: SportProfil[];
  localisation: Localisation;
  disponibilites: Disponibilite[];
  preferences: TypeSession[];
  description?: string;
  noteMoyenne?: number;
  nombreAvis?: number;
  createdAt: string;
}

export interface SessionSportive {
  id: string;
  sportId: SportId;
  /** Initiateur/organisateur de la session (gère les participants). */
  createurId: string;
  date: string;       // ISO date
  heure: string;      // "16:00"
  niveauRecherche: Niveau;
  typeSession: TypeSession;
  localisation: Localisation;
  lieuId?: string;    // club partenaire
  participantsIds: string[];
  /** Ids des participants autorisés à ajouter d'autres personnes au groupe/chat. */
  canInviteIds?: string[];
  /** Chat de groupe lié à la session (créé à la réservation ou quand un groupe existe). */
  conversationId?: string;
  statut: 'ouverte' | 'complete' | 'terminee' | 'annulee';
  createdAt: string;
}

export interface Lieu {
  id: string;
  nom: string;
  type: 'club' | 'terrain_public' | 'salle';
  adresse: string;
  localisation: Localisation;
  sports: SportId[];
  prixHoraire: number;
  partenariat: boolean;
  /** Photo principale (liste des lieux, couverture). */
  imageUrl?: string;
  /** Galerie d’images du club (terrains, club house, installations) pour la fiche club. */
  gallery?: string[];
  /** Légendes optionnelles pour chaque image de la galerie (même ordre que gallery). */
  galleryLabels?: string[];
}

export interface Message {
  id: string;
  conversationId: string;
  expediteurId: string;
  contenu: string;
  createdAt: string;
  lu: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  dernierMessage?: Message;
  sessionId?: string;
}

export interface Reservation {
  id: string;
  sessionId: string;
  lieuId: string;
  date: string;
  heure: string;
  duree: number; // minutes
  prixTotal: number;
  partParJoueur: number;
  statut: 'en_attente' | 'payee' | 'confirmee' | 'annulee';
  joueursIds: string[];
}

export type AccessoireCategory = 'raquettes' | 'balles' | 'gourdes' | 'sacs' | 'textiles' | 'autre';

export interface Accessoire {
  id: string;
  nom: string;
  description: string;
  prix: number;
  imageUrl: string;
  /** Seconde image optionnelle (ex. galerie sur la page d'achat). */
  imageUrl2?: string;
  categorie: AccessoireCategory;
  sportIds?: SportId[];
}

export const ACCESSOIRE_CATEGORY_LABELS: Record<AccessoireCategory, string> = {
  raquettes: 'Raquettes',
  balles: 'Balles',
  gourdes: 'Gourdes',
  sacs: 'Sacs',
  textiles: 'Textiles',
  autre: 'Autre',
};

export const SPORTS_LABELS: Record<SportId, string> = {
  tennis: 'Tennis',
  padel: 'Padel',
  basketball: 'Basketball',
  football: 'Football',
  badminton: 'Badminton',
  squash: 'Squash',
  volleyball: 'Volleyball',
  running: 'Running',
  musculation: 'Musculation',
  autre: 'Autre',
};

export const NIVEAUX_LABELS: Record<Niveau, string> = {
  debutant: 'Débutant',
  intermediaire: 'Intermédiaire',
  avance: 'Avancé',
  expert: 'Expert',
};

export const TYPES_SESSION_LABELS: Record<TypeSession, string> = {
  match_amical: 'Match amical',
  entrainement: 'Entraînement',
  competition: 'Compétition',
};
