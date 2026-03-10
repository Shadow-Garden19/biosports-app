import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { theme } from '../theme';
import { SPORTS_LABELS, NIVEAUX_LABELS, TYPES_SESSION_LABELS } from '../types';

export function ProfileScreen() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {user.prenom[0]}
          {user.nom[0]}
        </Text>
      </View>
      <Text style={styles.name}>
        {user.prenom} {user.nom}
      </Text>
      {user.noteMoyenne != null && (
        <Text style={styles.rating}>
          ★ {user.noteMoyenne.toFixed(1)} ({user.nombreAvis} avis)
        </Text>
      )}
      {user.description ? (
        <Text style={styles.description}>{user.description}</Text>
      ) : null}

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => Alert.alert('Modifier le profil', 'Fonctionnalité à venir.')}
      >
        <Text style={styles.editButtonText}>Modifier mon profil</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Sports et niveaux</Text>
      <View style={styles.section}>
        {user.sports.map((s) => (
          <View key={s.sportId} style={styles.sportRow}>
            <Text style={styles.sportLabel}>{SPORTS_LABELS[s.sportId]}</Text>
            <Text style={styles.sportValue}>
              {NIVEAUX_LABELS[s.niveau]}
              {s.classement ? ` (${s.classement})` : ''}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Préférences</Text>
      <View style={styles.chipRow}>
        {user.preferences.map((p) => (
          <View key={p} style={styles.chip}>
            <Text style={styles.chipText}>{TYPES_SESSION_LABELS[p]}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Disponibilités</Text>
      <View style={styles.section}>
        {user.disponibilites.map((d, i) => (
          <Text key={i} style={styles.dispo}>
            {d.jour} : {d.heureDebut} - {d.heureFin}
          </Text>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: theme.spacing.lg, paddingBottom: 100 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: theme.spacing.sm,
  },
  avatarText: { fontSize: 28, fontWeight: '700', color: '#fff' },
  name: {
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  rating: {
    fontSize: theme.fontSize.sm,
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  description: {
    fontSize: theme.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  editButton: {
    backgroundColor: colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  editButtonText: { color: '#fff', fontWeight: '600' },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: theme.spacing.sm,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  sportLabel: { color: colors.text },
  sportValue: { color: colors.textSecondary },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: theme.spacing.lg },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: { fontSize: theme.fontSize.sm, color: colors.text },
  dispo: { fontSize: theme.fontSize.sm, color: colors.textSecondary, paddingVertical: 2 },
  logoutButton: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  logoutText: { color: colors.error, fontSize: theme.fontSize.md },
});
