import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { theme } from '../theme';
import { SPORTS_LABELS } from '../types';
import { mockLieux } from '../data/mockData';
import type { RootStackParamList } from '../navigation/AppNavigator';

export function VenuesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Lieux et clubs partenaires</Text>
      <Text style={styles.subtitle}>
        Réservation rapide, prix partagés entre joueurs.
      </Text>
      {mockLieux.map((lieu) => (
        <TouchableOpacity
          key={lieu.id}
          style={styles.card}
          onPress={() => navigation.navigate('Booking', { lieuId: lieu.id })}
          activeOpacity={0.8}
        >
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
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
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
});
