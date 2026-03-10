import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { theme } from '../theme';
import { SPORTS_LABELS } from '../types';
import { useClubBooking } from '../context/ClubBookingContext';
import { TENNIS_CLUB_PARIS_1ER_ID, TENNIS_CLUB_PARIS_1ER_IMAGES, PADEL_ARENA_ID, PADEL_ARENA_IMAGES } from '../constants/clubGalleries';
import type { RootStackParamList } from '../navigation/AppNavigator';

export function VenuesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { venues, loadingVenues, error } = useClubBooking();

  if (loadingVenues) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Chargement des lieux…</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Lieux et clubs partenaires</Text>
      <Text style={styles.subtitle}>
        Réservation synchronisée avec le planning du club. Pas de double réservation.
      </Text>
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
      {venues.map((lieu) => (
        <TouchableOpacity
          key={lieu.id}
          style={styles.card}
          onPress={() => navigation.navigate('Booking', { lieuId: lieu.id })}
          activeOpacity={0.8}
        >
          {(lieu.id === TENNIS_CLUB_PARIS_1ER_ID && TENNIS_CLUB_PARIS_1ER_IMAGES[0]) ? (
            <Image
              source={TENNIS_CLUB_PARIS_1ER_IMAGES[0]}
              style={styles.cardImage}
              resizeMode="cover"
            />
          ) : (lieu.id === PADEL_ARENA_ID && PADEL_ARENA_IMAGES[0]) ? (
            <Image
              source={PADEL_ARENA_IMAGES[0]}
              style={styles.cardImage}
              resizeMode="cover"
            />
          ) : lieu.imageUrl ? (
            <Image
              source={{ uri: lieu.imageUrl }}
              style={styles.cardImage}
              resizeMode="cover"
            />
          ) : null}
          <View style={styles.cardBody}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardName}>{lieu.nom}</Text>
              {lieu.partenariat && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Partenaire</Text>
                </View>
              )}
            </View>
            <Text style={styles.cardAddress}>{lieu.adresse}</Text>
            <View style={styles.sportsRow}>
              {lieu.sports.map((s) => (
                <View key={s} style={styles.sportTag}>
                  <Text style={styles.sportTagText}>{SPORTS_LABELS[s]}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.cardPrice}>{lieu.prixHoraire} € / heure</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: theme.spacing.lg, paddingBottom: 100 },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 160,
    backgroundColor: colors.surfaceElevated,
  },
  cardBody: {
    padding: theme.spacing.md,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardName: { fontSize: theme.fontSize.lg, fontWeight: '600', color: colors.text },
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  cardAddress: { fontSize: theme.fontSize.sm, color: colors.textSecondary, marginTop: 4 },
  sportsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  sportTag: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  sportTagText: { fontSize: 12, color: colors.text },
  cardPrice: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: colors.primary,
    marginTop: theme.spacing.sm,
  },
  centered: { justifyContent: 'center', alignItems: 'center', padding: theme.spacing.xl },
  loadingText: { color: colors.textSecondary, marginTop: theme.spacing.md },
  errorBox: {
    backgroundColor: 'rgba(198, 40, 40, 0.15)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  errorText: { color: colors.error, fontSize: theme.fontSize.sm },
});
