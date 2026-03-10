import type { Utilisateur, SessionSportive, Lieu, Conversation, Message, Accessoire } from '../types';

export const mockUsers: Utilisateur[] = [
  {
    id: '2',
    username: 'thomas_martin',
    email: 'thomas@test.fr',
    nom: 'Martin',
    prenom: 'Thomas',
    sports: [
      { sportId: 'tennis', niveau: 'intermediaire', classement: '30/1' },
      { sportId: 'basketball', niveau: 'avance' },
    ],
    localisation: { latitude: 48.8584, longitude: 2.3542, ville: 'Paris', codePostal: '75002' },
    disponibilites: [
      { jour: 'samedi', heureDebut: '15:00', heureFin: '19:00' },
      { jour: 'dimanche', heureDebut: '09:00', heureFin: '14:00' },
    ],
    preferences: ['match_amical'],
    noteMoyenne: 4.5,
    nombreAvis: 8,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    username: 'sophie_bernard',
    email: 'sophie@test.fr',
    nom: 'Bernard',
    prenom: 'Sophie',
    sports: [
      { sportId: 'padel', niveau: 'avance' },
      { sportId: 'tennis', niveau: 'debutant' },
    ],
    localisation: { latitude: 48.8606, longitude: 2.3376, ville: 'Paris', codePostal: '75007' },
    disponibilites: [
      { jour: 'vendredi', heureDebut: '18:00', heureFin: '21:00' },
      { jour: 'samedi', heureDebut: '10:00', heureFin: '16:00' },
    ],
    preferences: ['entrainement', 'match_amical'],
    description: 'Padel le vendredi soir et tennis le samedi !',
    noteMoyenne: 4.9,
    nombreAvis: 15,
    createdAt: new Date().toISOString(),
  },
];

const in2Days = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
const in3Days = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const threeDaysAgo = new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0];
const fiveDaysAgo = new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0];

export const mockSessions: SessionSportive[] = [
  {
    id: 's1',
    sportId: 'tennis',
    createurId: '1',
    date: in2Days,
    heure: '16:00',
    niveauRecherche: 'intermediaire',
    typeSession: 'match_amical',
    localisation: { latitude: 48.8566, longitude: 2.3522, ville: 'Paris' },
    lieuId: 'lieu1',
    participantsIds: ['1', '2'],
    conversationId: 'c1',
    canInviteIds: ['2'],
    statut: 'ouverte',
    createdAt: new Date().toISOString(),
  },
  {
    id: 's2',
    sportId: 'padel',
    createurId: '3',
    date: in3Days,
    heure: '14:00',
    niveauRecherche: 'intermediaire',
    typeSession: 'entrainement',
    localisation: { latitude: 48.8584, longitude: 2.3542, ville: 'Paris' },
    participantsIds: ['3'],
    statut: 'ouverte',
    createdAt: new Date().toISOString(),
  },
  {
    id: 's3',
    sportId: 'tennis',
    createurId: '1',
    date: yesterday,
    heure: '10:00',
    niveauRecherche: 'intermediaire',
    typeSession: 'match_amical',
    localisation: { latitude: 48.8566, longitude: 2.3522, ville: 'Paris' },
    lieuId: 'lieu1',
    participantsIds: ['1', '2'],
    statut: 'terminee',
    createdAt: new Date().toISOString(),
  },
  {
    id: 's4',
    sportId: 'padel',
    createurId: '2',
    date: threeDaysAgo,
    heure: '18:00',
    niveauRecherche: 'avance',
    typeSession: 'entrainement',
    localisation: { latitude: 48.8584, longitude: 2.3542, ville: 'Paris' },
    participantsIds: ['1', '2'],
    statut: 'terminee',
    createdAt: new Date().toISOString(),
  },
  {
    id: 's5',
    sportId: 'basketball',
    createurId: '2',
    date: fiveDaysAgo,
    heure: '15:00',
    niveauRecherche: 'intermediaire',
    typeSession: 'match_amical',
    localisation: { latitude: 48.86, longitude: 2.35, ville: 'Paris' },
    participantsIds: ['1', '2', '3'],
    statut: 'terminee',
    createdAt: new Date().toISOString(),
  },
];

// Galeries spécifiques à chaque club (photos web – terrains, installations, club house, entrée)
// Tennis Club Paris 1er : courts tennis, court padel, installations type club
// Padel Arena : courts padel, salles indoor, espaces communs
const U = (id: string) => `https://images.unsplash.com/photo-${id}?w=800`;

export const mockLieux: Lieu[] = [
  {
    id: 'lieu1',
    nom: 'Tennis Club Paris 1er',
    type: 'club',
    adresse: '12 Rue du Sport, 75001 Paris',
    localisation: { latitude: 48.857, longitude: 2.353, ville: 'Paris' },
    sports: ['tennis', 'padel'],
    prixHoraire: 40,
    partenariat: true,
    imageUrl: U('1554068865-24cecd4e34b8'),
    // Galerie en assets locaux : assets/clubs/tennis-club-paris-1er/ (voir clubGalleries.ts)
  },
  {
    id: 'lieu2',
    nom: 'Padel Arena',
    type: 'club',
    adresse: '5 Avenue des Jeux, 75002 Paris',
    localisation: { latitude: 48.859, longitude: 2.355, ville: 'Paris' },
    sports: ['padel'],
    prixHoraire: 35,
    partenariat: true,
    imageUrl: U('1622163642998-1f32b690a933'),
    gallery: [
      U('1622163642998-1f32b690a933'),
      U('1552674605-db6ffd4facb5'),
      U('1612872087720-bb876e2e67d1'),
      U('1534438327276-14e5300c3a48'),
      U('1517836357463-d25dfeac3438'),
    ],
    galleryLabels: ['Courts padel', 'Court couvert', 'Arena', 'Installations', 'Entrée'],
  },
];

export const mockConversations: Conversation[] = [
  {
    id: 'c1',
    participants: ['1', '2'],
    sessionId: 's1',
    dernierMessage: {
      id: 'm1',
      conversationId: 'c1',
      expediteurId: '2',
      contenu: 'Parfait, on se voit samedi 16h !',
      createdAt: new Date().toISOString(),
      lu: true,
    },
  },
  {
    id: 'c2',
    participants: ['1', '3'],
    sessionId: 's2',
    dernierMessage: {
      id: 'dm2',
      conversationId: 'c2',
      expediteurId: '3',
      contenu: 'Padel ce week-end ?',
      createdAt: new Date().toISOString(),
      lu: false,
    },
  },
];

export const mockMessages: Record<string, Message[]> = {
  c1: [
    {
      id: 'm1',
      conversationId: 'c1',
      expediteurId: '1',
      contenu: 'Salut ! Tu es dispo samedi pour un tennis ?',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      lu: true,
    },
    {
      id: 'm2',
      conversationId: 'c1',
      expediteurId: '2',
      contenu: 'Oui avec plaisir ! 16h ça te va ?',
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      lu: true,
    },
    {
      id: 'm3',
      conversationId: 'c1',
      expediteurId: '1',
      contenu: 'Parfait, on se voit samedi 16h !',
      createdAt: new Date().toISOString(),
      lu: true,
    },
  ],
  c2: [
    {
      id: 'c2m1',
      conversationId: 'c2',
      expediteurId: '3',
      contenu: 'Salut ! Tu veux faire du padel dimanche ?',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      lu: true,
    },
    {
      id: 'c2m2',
      conversationId: 'c2',
      expediteurId: '1',
      contenu: 'Oui avec plaisir !',
      createdAt: new Date().toISOString(),
      lu: true,
    },
  ],
};

/** Accessoires sportifs pour la boutique */
export const mockAccessoires: Accessoire[] = [
  {
    id: 'acc1',
    nom: 'Raquette Tennis Pro',
    description: 'Raquette tout-terrain, équilibre tête légère, 300 g.',
    prix: 149.99,
    imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400',
    categorie: 'raquettes',
    sportIds: ['tennis'],
  },
  {
    id: 'acc2',
    nom: 'Raquette Padel Carbon',
    description: 'Cadre carbone, surface gommée, idéale pour le contrôle.',
    prix: 189.99,
    imageUrl: 'https://images.unsplash.com/photo-1622163642998-1f32b690a933?w=400',
    categorie: 'raquettes',
    sportIds: ['padel'],
  },
  {
    id: 'acc3',
    nom: 'Tube 3 balles Tennis',
    description: 'Balles pression standard, tube de 3, longue durée.',
    prix: 12.99,
    imageUrl: 'local:balles-tennis',
    categorie: 'balles',
    sportIds: ['tennis'],
  },
  {
    id: 'acc4',
    nom: 'Balles Padel x3',
    description: 'Lot de 3 balles padel haute visibilité.',
    prix: 14.99,
    imageUrl: 'https://images.unsplash.com/photo-1617083274660-2c57d307164c?w=400',
    categorie: 'balles',
    sportIds: ['padel'],
  },
  {
    id: 'acc5',
    nom: 'Gourde Isotherme 750 ml',
    description: 'Gourde inox, maintient le froid 12 h, bouchon sport.',
    prix: 24.99,
    imageUrl: 'local:gourdes-inox',
    categorie: 'gourdes',
  },
  {
    id: 'acc6',
    nom: 'Gourde Running 500 ml',
    description: 'Léger, grip antidérapant, compatible ceinture.',
    prix: 18.99,
    imageUrl: 'local:gourdes-inox',
    categorie: 'gourdes',
    sportIds: ['running'],
  },
  {
    id: 'acc7',
    nom: 'Sac Sport Multifonction',
    description: 'Grand compartiment, poche raquette, chaussures séparées.',
    prix: 59.99,
    imageUrl: 'local:sac-sport',
    categorie: 'sacs',
  },
  {
    id: 'acc8',
    nom: 'Sac à Dos Running',
    description: 'Format compact, poche à eau, bande réfléchissante.',
    prix: 39.99,
    imageUrl: 'local:sac-running',
    categorie: 'sacs',
    sportIds: ['running'],
  },
  {
    id: 'acc9',
    nom: 'T-shirt Sport Respirant',
    description: 'Tissu technique évacuation transpiration, coupe athlétique, noir et or logo B.',
    prix: 29.99,
    imageUrl: 'local:tshirt-sport',
    categorie: 'textiles',
  },
  {
    id: 'acc10',
    nom: 'Ensemble sportif féminin',
    description: 'Haut et legging marron et or, logo B, idéal Pilates, yoga et salle.',
    prix: 34.99,
    imageUrl: 'local:ensemble-sportif-feminin',
    categorie: 'textiles',
  },
  {
    id: 'acc11',
    nom: 'Sac Tennis',
    description: 'Sac à raquettes noir et or, logo B TENNIS, plusieurs compartiments, poignée renforcée.',
    prix: 49.99,
    imageUrl: 'local:sac-tennis',
    imageUrl2: 'local:sac-tennis-2',
    categorie: 'sacs',
    sportIds: ['tennis'],
  },
];
