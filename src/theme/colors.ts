// Thème BIOSPORTS – inspiré du logo : noir premium, or, blanc/argenté

export const colors = {
  // Primaire = or / bronze (accents du logo)
  primary: '#C9A227',
  primaryDark: '#A68521',
  primaryLight: '#D4AF37',

  secondary: '#B8860B', // Dark goldenrod
  secondaryDark: '#8B6914',

  // Fond sombre (comme le logo)
  background: '#0D0D0D',
  surface: '#1A1A1A',
  surfaceElevated: '#262626',

  // Texte (blanc / argenté comme le logo)
  text: '#FFFFFF',
  textSecondary: '#B3B3B3',
  textMuted: '#808080',

  // États
  success: '#2E7D32',
  warning: '#C9A227',
  error: '#C62828',
  info: '#1565C0',

  // Bordures (discret sur fond sombre)
  border: '#333333',
  borderLight: '#404040',

  // Logo : BIO en or, SPORT en blanc
  logoGold: '#C9A227',
  logoWhite: '#F5F5F5',

  // Sports (badges – tons assortis au thème)
  sportTennis: '#4CAF50',
  sportPadel: '#C9A227',
  sportBasket: '#FF9800',
  sportFoot: '#2196F3',
  sportBadminton: '#9C27B0',
  sportSquash: '#E91E63',
  sportVolley: '#00BCD4',
  sportRunning: '#5C6BC0',
  sportMuscu: '#78909C',
};

export type Colors = typeof colors;
