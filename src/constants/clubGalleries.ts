/**
 * Galeries photos locales par club (assets du projet).
 * Tennis Club Paris 1er : photo principale = vue du club (cover.png), puis bâtiment, terrains.
 * Salle de musculation retirée. Remplacer cover.png par la vue aérienne du club pour l’avoir en principale.
 */

export const TENNIS_CLUB_PARIS_1ER_ID = 'lieu1';

/** Images locales pour Tennis Club Paris 1er. Première = photo principale (carte + galerie). */
export const TENNIS_CLUB_PARIS_1ER_IMAGES = [
  require('../../assets/clubs/tennis-club-paris-1er/cover.png'), // Vue du club (principale)
  require('../../assets/clubs/tennis-club-paris-1er/2.png'),
  require('../../assets/clubs/tennis-club-paris-1er/3.png'),
  require('../../assets/clubs/tennis-club-paris-1er/4.png'),
  require('../../assets/clubs/tennis-club-paris-1er/5.png'),
];

export const TENNIS_CLUB_PARIS_1ER_LABELS = [
  'Vue du club · Terrains',
  'Bâtiment et entrée',
  'Courts de padel',
  'Court de tennis couvert',
  'Cours de fitness',
];

// Padel Arena (lieu2)
export const PADEL_ARENA_ID = 'lieu2';

export const PADEL_ARENA_IMAGES = [
  require('../../assets/clubs/padel-arena/1.png'),
  require('../../assets/clubs/padel-arena/2.png'),
];

export const PADEL_ARENA_LABELS = [
  'Vue des courts',
  'Installations · Arena',
];
