import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { theme } from '../theme';
import { SPORTS_LABELS, NIVEAUX_LABELS, TYPES_SESSION_LABELS } from '../types';
import { useSessions } from '../context/SessionsContext';
import { mockLieux, mockUsers } from '../data/mockData';

export function SessionDetailScreen({
  sessionId,
  onBookVenue,
  onChat,
  onBack,
}: {
  sessionId: string;
  onBookVenue?: (sessionId: string, lieuId: string) => void;
  onChat?: (userId: string) => void;
  onBack: () => void;
}) {
  const { sessions } = useSessions();
  const session = sessions.find((s) => s.id === sessionId);
  const lieu = session?.lieuId
    ? mockLieux.find((l) => l.id === session.lieuId)
    : null;
  const createur = session
    ? mockUsers.find((u) => u.id === session.createurId)
    : null;

  if (!session) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.empty}>Session introuvable.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={onBack} style={styles.back}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.sport}>{SPORTS_LABELS[session.sportId]}</Text>
        <Text style={styles.type}>{TYPES_SESSION_LABELS[session.typeSession]}</Text>
        <Text style={styles.date}>
          {new Date(session.date).toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}{' '}
          à {session.heure}
        </Text>
        <Text style={styles.level}>
          Niveau : {NIVEAUX_LABELS[session.niveauRecherche]}
        </Text>
        <Text style={styles.location}>
          {session.localisation.ville ?? 'Paris'}
        </Text>
      </View>

      {createur && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Organisateur</Text>
          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {createur.prenom[0]}
                {createur.nom[0]}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {createur.prenom} {createur.nom}
              </Text>
              <Text style={styles.userSports}>
                {createur.sports.map((s) => SPORTS_LABELS[s.sportId]).join(', ')}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => onChat?.(createur.id)}
            >
              <Text style={styles.chatButtonText}>Discuter</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {lieu && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lieu proposé</Text>
          <View style={styles.lieuCard}>
            <Text style={styles.lieuName}>{lieu.nom}</Text>
            <Text style={styles.lieuAddress}>{lieu.adresse}</Text>
            <Text style={styles.lieuPrice}>
              {lieu.prixHoraire} € / heure (part : {(lieu.prixHoraire / 2).toFixed(0)} €)
            </Text>
            <TouchableOpacity
              style={styles.bookButton}
              onPress={() => onBookVenue?.(session.id, lieu.id)}
            >
              <Text style={styles.bookButtonText}>Réserver ce terrain</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {!lieu && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lieux à proximité</Text>
          {mockLieux.slice(0, 2).map((l) => (
            <View key={l.id} style={styles.lieuCard}>
              <Text style={styles.lieuName}>{l.nom}</Text>
              <Text style={styles.lieuAddress}>{l.adresse}</Text>
              <Text style={styles.lieuPrice}>{l.prixHoraire} € / heure</Text>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => onBookVenue?.(session.id, l.id)}
              >
                <Text style={styles.bookButtonText}>Choisir ce lieu</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: theme.spacing.lg, paddingBottom: 100 },
  back: { marginBottom: theme.spacing.md },
  backText: { color: colors.primary, fontSize: theme.fontSize.md },
  empty: { color: colors.textMuted, padding: theme.spacing.lg },
  card: {
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sport: { fontSize: theme.fontSize.xl, fontWeight: '700', color: colors.text },
  type: { fontSize: theme.fontSize.sm, color: colors.primary, marginTop: 4 },
  date: { fontSize: theme.fontSize.md, color: colors.text, marginTop: 8 },
  level: { fontSize: theme.fontSize.sm, color: colors.textSecondary, marginTop: 4 },
  location: { fontSize: theme.fontSize.sm, color: colors.textMuted, marginTop: 4 },
  section: { marginBottom: theme.spacing.lg },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: theme.spacing.sm,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  avatarText: { color: '#fff', fontWeight: '600' },
  userInfo: { flex: 1 },
  userName: { fontWeight: '600', color: colors.text },
  userSports: { fontSize: 12, color: colors.textSecondary },
  chatButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  chatButtonText: { color: '#fff', fontWeight: '600', fontSize: 12 },
  lieuCard: {
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  lieuName: { fontWeight: '600', color: colors.text },
  lieuAddress: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  lieuPrice: { fontSize: 12, color: colors.primary, marginTop: 4 },
  bookButton: {
    backgroundColor: colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  bookButtonText: { color: '#fff', fontWeight: '600' },
});
