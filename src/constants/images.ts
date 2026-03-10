// Images : logo, onboarding, inscription. Tous les sports représentés.
// Unsplash – libres d'utilisation

/**
 * URL du logo complet (symbole B + nom BIOSPORTS + slogan).
 * Définir ici si vous hébergez l’image du logo.
 * Sinon, passer logoSource={require('../../assets/logo.png')} au composant <Logo />
 * après avoir placé logo.png dans le dossier assets/.
 */
export const LOGO_IMAGE_URI: string | undefined = undefined;

/** Symbole B affiché au-dessus du nom BIOSPORTS (logo-b.png dans assets/). */
export const LOGO_SYMBOL_SOURCE = require('../../assets/logo-b.png');

/** Gourdes en inox – image boutique (assets). */
export const GOURDES_INOX_IMAGE = require('../../assets/gourdes-inox.png');

/** Balles de tennis premium – image boutique (assets). */
export const BALLES_TENNIS_IMAGE = require('../../assets/balles-tennis.png');

/** Sac sport (duffel noir et or) – image boutique (assets). */
export const SAC_SPORT_IMAGE = require('../../assets/sac-sport.png');

/** Sac à dos running (noir et or, logo B) – image boutique (assets). */
export const SAC_RUNNING_IMAGE = require('../../assets/sac-running.png');

/** Sac tennis (noir et or, logo B TENNIS) – image boutique (assets). */
export const SAC_TENNIS_IMAGE = require('../../assets/sac-tennis.png');
export const SAC_TENNIS_IMAGE_2 = require('../../assets/sac-tennis-2.png');

/** T-shirt sport (noir et or, logo B) – image boutique (assets). */
export const TSHIRT_SPORT_IMAGE = require('../../assets/tshirt-sport.png');

/** Ensemble sportif féminin (haut + legging marron et or) – image boutique (assets). */
export const ENSEMBLE_SPORTIF_FEMININ_IMAGE = require('../../assets/ensemble-sportif-feminin.png');

/** Retourne la source Image pour un accessoire (local ou URI). */
export function getAccessoireImageSource(imageUrl: string): number | { uri: string } {
  if (imageUrl === 'local:gourdes-inox') return GOURDES_INOX_IMAGE;
  if (imageUrl === 'local:balles-tennis') return BALLES_TENNIS_IMAGE;
  if (imageUrl === 'local:sac-sport') return SAC_SPORT_IMAGE;
  if (imageUrl === 'local:sac-running') return SAC_RUNNING_IMAGE;
  if (imageUrl === 'local:sac-tennis') return SAC_TENNIS_IMAGE;
  if (imageUrl === 'local:sac-tennis-2') return SAC_TENNIS_IMAGE_2;
  if (imageUrl === 'local:tshirt-sport') return TSHIRT_SPORT_IMAGE;
  if (imageUrl === 'local:ensemble-sportif-feminin') return ENSEMBLE_SPORTIF_FEMININ_IMAGE;
  return { uri: imageUrl };
}

/** Images par sport – tous les sports disponibles dans l'app */
export const SPORT_IMAGES: Record<string, string> = {
  tennis: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800',
  padel: 'https://images.unsplash.com/photo-1622163642998-1f32b690a933?w=800',
  basketball: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
  football: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
  badminton: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800',
  squash: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800',
  volleyball: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800',
  running: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800',
  musculation: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
  autre: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
};

/** Ordre des sports pour l'onboarding / galeries */
export const SPORT_IDS_ORDER = [
  'tennis',
  'padel',
  'basketball',
  'football',
  'badminton',
  'squash',
  'volleyball',
  'running',
  'musculation',
  'autre',
] as const;

/** Onboarding : 3 slides avec images variées (sports différents) */
export const ONBOARDING_IMAGES = {
  partners: SPORT_IMAGES.tennis,
  clubs: SPORT_IMAGES.basketball,
  community: SPORT_IMAGES.running,
};

/** Inscription : hero + galerie de tous les sports */
export const REGISTER_IMAGES = {
  tennis: SPORT_IMAGES.tennis,
  padel: SPORT_IMAGES.padel,
  basketball: SPORT_IMAGES.basketball,
  football: SPORT_IMAGES.football,
  badminton: SPORT_IMAGES.badminton,
  squash: SPORT_IMAGES.squash,
  volleyball: SPORT_IMAGES.volleyball,
  running: SPORT_IMAGES.running,
  musculation: SPORT_IMAGES.musculation,
  club: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600',
  court: SPORT_IMAGES.tennis,
};

export const WELCOME_HERO_IMAGE = SPORT_IMAGES.tennis;
