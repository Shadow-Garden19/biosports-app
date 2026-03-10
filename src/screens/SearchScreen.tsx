import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { theme } from '../theme';
import { SPORTS_LABELS, NIVEAUX_LABELS, TYPES_SESSION_LABELS } from '../types';
import type { SportId, Niveau, TypeSession } from '../types';
import { mockUsers, mockConversations } from '../data/mockData';
import type { RootStackParamList } from '../navigation/AppNavigator';

const SPORTS_IDS: SportId[] = [
  'tennis', 'padel', 'basketball', 'football', 'badminton',
  'squash', 'volleyball', 'running', 'musculation', 'autre',
];
const JOURS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'] as const;

export function SearchScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [sport, setSport] = useState<SportId | null>(null);
  const [niveau, setNiveau] = useState<Niveau | null>(null);
  const [jour, setJour] = useState<string | null>(null);
  const [heure, setHeure] = useState('');
  const [typeSession, setTypeSession] = useState<TypeSession | null>(null);

  const compatibleUsers = mockUsers.filter((u) => {
    if (sport && !u.sports.some((s) => s.sportId === sport)) return false;
    if (niveau && !u.sports.some((s) => s.sportId === sport && s.niveau === niveau)) return false;
    if (jour && !u.disponibilites.some((d) => d.jour === jour)) return false;
    if (typeSession && !u.preferences.includes(typeSession)) return false;
    return true;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Rechercher un partenaire</Text>

      <Text style={styles.label}>Sport</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
        {SPORTS_IDS.map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.chip, sport === s && styles.chipSelected]}
            onPress={() => setSport(sport === s ? null : s)}
          >
            <Text style={[styles.chipText, sport === s && styles.chipTextSelected]}>
              {SPORTS_LABELS[s]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.label}>Niveau</Text>
      <View style={styles.chipRow}>
        {(['debutant', 'intermediaire', 'avance', 'expert'] as Niveau[]).map((n) => (
          <TouchableOpacity
            key={n}
            style={[styles.chip, niveau === n && styles.chipSelected]}
            onPress={() => setNiveau(niveau === n ? null : n)}
          >
            <Text style={[styles.chipText, niveau === n && styles.chipTextSelected]}>
              {NIVEAUX_LABELS[n]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Jour</Text>
      <View style={styles.chipRow}>
        {JOURS.map((j) => (
          <TouchableOpacity
            key={j}
            style={[styles.chip, jour === j && styles.chipSelected]}
            onPress={() => setJour(jour === j ? null : j)}
          >
            <Text style={[styles.chipText, jour === j && styles.chipTextSelected]}>
              {j.charAt(0).toUpperCase() + j.slice(1, 3)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Heure (ex: 16:00)</Text>
      <TextInput
        style={styles.input}
        placeholder="16:00"
        placeholderTextColor={colors.textMuted}
        value={heure}
        onChangeText={setHeure}
      />

      <Text style={styles.label}>Type</Text>
      <View style={styles.chipRow}>
        {(['match_amical', 'entrainement', 'competition'] as TypeSession[]).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.chip, typeSession === t && styles.chipSelected]}
            onPress={() => setTypeSession(typeSession === t ? null : t)}
          >
            <Text style={[styles.chipText, typeSession === t && styles.chipTextSelected]}>
              {TYPES_SESSION_LABELS[t]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.publishButton}
        onPress={() =>
          Alert.alert(
            'Session publiée',
            'Votre session a été publiée. Consultez l’accueil pour les prochaines étapes.',
            [{ text: 'OK', onPress: () => (navigation.getParent() as any)?.navigate('Home') }]
          )
        }
      >
        <Text style={styles.publishButtonText}>Publier une session</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Partenaires compatibles</Text>
      {compatibleUsers.length === 0 ? (
        <Text style={styles.empty}>Aucun partenaire trouvé. Ajustez les filtres.</Text>
      ) : (
        compatibleUsers.map((u) => {
          const conv = mockConversations.find(
            (c) => c.participants.includes(u.id) && c.participants.includes('1')
          );
          const conversationId = conv?.id ?? 'c1';
          return (
          <TouchableOpacity
            key={u.id}
            style={styles.userCard}
            onPress={() => navigation.navigate('Chat', { conversationId })}
          >
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>
                {u.prenom[0]}
                {u.nom[0]}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {u.prenom} {u.nom}
              </Text>
              {u.username ? (
                <Text style={styles.userHandle}>@{u.username}</Text>
              ) : null}
              <Text style={styles.userSports}>
                {u.sports.map((s) => SPORTS_LABELS[s.sportId]).join(', ')}
              </Text>
              {u.noteMoyenne != null && (
                <Text style={styles.userRating}>★ {u.noteMoyenne.toFixed(1)}</Text>
              )}
            </View>
          </TouchableOpacity>
          );
        })
      )}
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
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.fontSize.sm,
    color: colors.textSecondary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  chipsScroll: { marginBottom: theme.spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: theme.spacing.sm },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: theme.fontSize.sm, color: colors.text },
  chipTextSelected: { color: '#fff' },
  input: {
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: theme.spacing.md,
  },
  publishButton: {
    backgroundColor: colors.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  publishButtonText: { color: '#fff', fontWeight: '600' },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.sm,
  },
  empty: { color: colors.textMuted },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  userAvatarText: { color: '#fff', fontWeight: '600' },
  userInfo: { flex: 1 },
  userName: { fontSize: theme.fontSize.md, fontWeight: '600', color: colors.text },
  userHandle: { fontSize: theme.fontSize.sm, color: colors.primary, marginTop: 2 },
  userSports: { fontSize: theme.fontSize.sm, color: colors.textSecondary },
  userRating: { fontSize: theme.fontSize.sm, color: colors.secondary, marginTop: 2 },
});
