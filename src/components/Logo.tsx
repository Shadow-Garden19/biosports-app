import React from 'react';
import { View, Text, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import { colors } from '../theme/colors';
import { LOGO_IMAGE_URI, LOGO_SYMBOL_SOURCE } from '../constants/images';

type LogoSize = 'small' | 'medium' | 'large';

interface LogoProps {
  size?: LogoSize;
  showSlogan?: boolean;
  /** Image du logo complet (remplace tout). Prioritaire. */
  logoSource?: ImageSourcePropType;
  /** Afficher le symbole B au-dessus du nom (par défaut true si LOGO_SYMBOL_SOURCE disponible) */
  showSymbolAboveName?: boolean;
}

/** Logo BIOSPORTS : symbole B au-dessus du nom BIO SPORTS + slogan */
export function Logo({ size = 'large', showSlogan = true, logoSource, showSymbolAboveName = true }: LogoProps) {
  const isSmall = size === 'small';
  const isMedium = size === 'medium';
  const symbolSource = logoSource ?? LOGO_SYMBOL_SOURCE;
  const hasSymbolAbove = showSymbolAboveName && symbolSource;
  const hasFullImage = !hasSymbolAbove && (logoSource || LOGO_IMAGE_URI);

  if (hasFullImage) {
    const logoHeight = isSmall ? 36 : isMedium ? 44 : 56;
    const source = logoSource ?? (LOGO_IMAGE_URI ? { uri: LOGO_IMAGE_URI } : undefined);
    if (!source) return null;
    return (
      <View style={styles.container}>
        <Image
          source={source}
          style={[styles.logoImage, { height: logoHeight }]}
          resizeMode="contain"
        />
        {showSlogan && (
          <Text style={[styles.slogan, isSmall && styles.sloganSmall]}>
            PERFORMANCE • ÉQUILIBRE • PASSION
          </Text>
        )}
      </View>
    );
  }

  const logoHeight = isSmall ? 72 : isMedium ? 96 : 160;
  const logoWidth = isSmall ? 108 : isMedium ? 140 : 220;
  return (
    <View style={styles.container}>
      {hasSymbolAbove && (
        <Image
          source={symbolSource as any}
          style={[styles.logoSymbol, { height: logoHeight, width: logoWidth }]}
          resizeMode="contain"
        />
      )}
      <View style={[styles.brandRow, isSmall && styles.brandRowSmall, hasSymbolAbove && styles.brandRowWithSymbol]}>
        <Text style={[styles.bio, isSmall && styles.bioSmall, isMedium && styles.bioMedium]}>
          BIO
        </Text>
        <Text style={[styles.sports, isSmall && styles.sportsSmall, isMedium && styles.sportsMedium]}>
          SPORTS
        </Text>
      </View>
      {showSlogan && (
        <Text style={[styles.slogan, isSmall && styles.sloganSmall]}>
          PERFORMANCE • ÉQUILIBRE • PASSION
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logoImage: {
    width: 180,
  },
  logoSymbol: {
    marginBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    letterSpacing: 2,
  },
  brandRowSmall: {
    letterSpacing: 1,
  },
  brandRowWithSymbol: {
    marginTop: 4,
  },
  bio: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.logoGold,
  },
  bioSmall: {
    fontSize: 18,
  },
  bioMedium: {
    fontSize: 22,
  },
  sports: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.logoWhite,
    marginLeft: 2,
  },
  sportsSmall: {
    fontSize: 18,
  },
  sportsMedium: {
    fontSize: 22,
  },
  slogan: {
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginTop: 6,
  },
  sloganSmall: {
    fontSize: 9,
    marginTop: 2,
  },
});
