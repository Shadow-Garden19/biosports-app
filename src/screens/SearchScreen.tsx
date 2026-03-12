import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useSessions } from '../context/SessionsContext';
import { colors } from '../theme/colors';
import { theme } from '../theme';
import { SPORTS_LABELS, NIVEAUX_LABELS, TYPES_SESSION_LABELS } from '../types';
import type { SportId, Niveau, TypeSession } from '../types';
import type { JourSemaine } from '../types';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { mockUsers, mockLieux } from '../data/mockData';

const SPORTS_IDS: SportId[] = [
  'tennis', 'padel', 'basketball', 'football', 'badminton',
  'squash', 'volleyball', 'running', 'musculation', 'autre',
];

const JOURS: JourSemaine[] = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

/** Retourne le jour de la semaine (lundi=1 … dimanche=7) pour une date ISO YYYY-MM-DD */
function getDayOfWeek(dateStr: string): number {
  const d = new Date(dateStr + 'T12:00:00');
  const jsDay = d.getDay();
  return jsDay === 0 ? 7 : jsDay;
}

/** Map jour français -> numéro (lundi=1, dimanche=7) */
const JOUR_TO_NUM: Record<JourSemaine, number> = {
  lundi: 1, mardi: 2, mercredi: 3, jeudi: 4, vendredi: 5, samedi: 6, dimanche: 7,
};

export function SearchScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const { sessions } = useSessions();
  const [sport, setSport] = React.useState<SportId | null>(null);
  const [niveau, setNiveau] = React.useState<Niveau | null>(null);
  const [jour, setJour] = React.useState<JourSemaine | null>(null);
  const [heure, setHeure] = React.useState('');
  const [typeSession, setTypeSession] = React.useState<TypeSession | null>(null);

  const matchingSessions = useMemo(() => {
    return sessions.filter((s) => {
      if (s.statut !== 'ouverte' && s.statut !== 'complete') return false;
      if (sport && s.sportId !== sport) return false;
      if (niveau && s.niveauRecherche !== niveau) return false;
      if (jour) {
        const sessionDayNum = getDayOfWeek(s.date);
        if (sessionDayNum !== JOUR_TO_NUM[jour]) return false;
      }
      if (heure.trim()) {
        const h = heure.trim().replace(/\s/g, '');
        if (!h.includes(':')) {
          const hourOnly = h.padStart(2, '0').substring(0, 2);
          if (!s.heure.startsWith(hourOnly)) return false;
        } else if (s.heure !== h) {
          return false;
        }
      }
      if (typeSession && s.typeSession !== typeSession) return false;
      return true;
    });
  }, [sessions, sport, niveau, jour, heure, typeSession]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Rechercher une session</Text>
      <Text style={styles.subtitle}>
        Indiquez le sport, le jour, l’heure et le niveau pour voir les sessions qui correspondent.
      </Text>

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
        placeholder="14:00"
        placeholderTextColor={colors.textMuted}
        value={heure}
        onChangeText={setHeure}
        keyboardType="numbers-and-punctuation"
      />

      <Text style={styles.label}>Niveau recherché</Text>
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

      <Text style={styles.label}>Type de session</Text>
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

      <Text style={styles.sectionTitle}>
        Sessions correspondantes ({matchingSessions.length})
      </Text>
      {matchingSessions.length === 0 ? (
        <Text style={styles.empty}>
          Aucune session ne correspond à vos critères. Modifiez les filtres ou créez une session.
        </Text>
      ) : (
        matchingSessions.map((session) => {
          const isMe = session.createurId === user?.id;
          const createur = mockUsers.find((u) => u.id === session.createurId);
          const lieu = session.lieuId
            ? mockLieux.find((l) => l.id === session.lieuId)
            : null;
          return (
            <TouchableOpacity
              key={session.id}
              style={styles.sessionCard}
              onPress={() => navigation.navigate('SessionDetail', { sessionId: session.id })}
              activeOpacity={0.8}
            >
              <View style={styles.sessionHeader}>
                <Text style={styles.sessionSport}>{SPORTS_LABELS[session.sportId]}</Text>
                <Text style={styles.sessionType}>{TYPES_SESSION_LABELS[session.typeSession]}</Text>
              </View>
              <Text style={styles.sessionDate}>
                {new Date(session.date).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}{' '}
                à {session.heure}
              </Text>
              <Text style={styles.sessionLevel}>
                Niveau : {NIVEAUX_LABELS[session.niveauRecherche]}
              </Text>
              <Text style={styles.sessionLocation}>
                {session.localisation.ville ?? 'Paris'}
                {lieu ? ` · ${lieu.nom}` : ''}
              </Text>
              <Text style={styles.sessionCreator}>
                Organisateur : {isMe ? 'Vous' : createur ? `${createur.prenom} ${createur.nom}` : '—'}
              </Text>
              <Text style={styles.sessionParticipants}>
                {session.participantsIds.length} participant(s)
              </Text>
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
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: colors.textSecondary,
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
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.sm,
  },
  empty: {
    color: colors.textMuted,
    fontSize: theme.fontSize.md,
  },
  sessionCard: {
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sessionHeader: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, marginBottom: 4 },
  sessionSport: { fontSize: theme.fontSize.lg, fontWeight: '700', color: colors.text },
  sessionType: { fontSize: theme.fontSize.sm, color: colors.primary },
  sessionDate: { fontSize: theme.fontSize.md, color: colors.text },
  sessionLevel: { fontSize: theme.fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  sessionLocation: { fontSize: theme.fontSize.sm, color: colors.textMuted, marginTop: 2 },
  sessionCreator: { fontSize: theme.fontSize.sm, color: colors.textSecondary, marginTop: 4 },
  sessionParticipants: { fontSize: theme.fontSize.xs, color: colors.textMuted, marginTop: 2 },
});
