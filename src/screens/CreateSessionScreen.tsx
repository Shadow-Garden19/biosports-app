import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useSessions } from '../context/SessionsContext';
import { colors } from '../theme/colors';
import { theme } from '../theme';
import { SPORTS_LABELS, NIVEAUX_LABELS, TYPES_SESSION_LABELS } from '../types';
import type { SportId, Niveau, TypeSession } from '../types';

const SPORTS_OPTIONS: SportId[] = [
  'tennis', 'padel', 'basketball', 'football', 'badminton', 'running',
];

export function CreateSessionScreen({ onBack }: { onBack: () => void }) {
  const { user } = useAuth();
  const { addSession } = useSessions();
  const [sportId, setSportId] = useState<SportId>('tennis');
  const [date, setDate] = useState('');
  const [heure, setHeure] = useState('18:00');
  const [niveau, setNiveau] = useState<Niveau>('intermediaire');
  const [typeSession, setTypeSession] = useState<TypeSession>('match_amical');

  const handleCreate = () => {
    if (!user || !date.trim()) return;
    const dateIso = date.includes('T') ? date.split('T')[0] : date;
    addSession({
      sportId,
      createurId: user.id,
      date: dateIso,
      heure: heure,
      niveauRecherche: niveau,
      typeSession,
      localisation: user.localisation,
      participantsIds: [user.id],
      statut: 'ouverte',
    });
    onBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={onBack} style={styles.back}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Créer une session</Text>

      <Text style={styles.label}>Sport</Text>
      <View style={styles.chipsRow}>
        {SPORTS_OPTIONS.map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.chip, sportId === s && styles.chipSelected]}
            onPress={() => setSportId(s)}
          >
            <Text style={[styles.chipText, sportId === s && styles.chipTextSelected]}>
              {SPORTS_LABELS[s]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Date</Text>
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
        placeholder="AAAA-MM-JJ (ex. 2025-03-15)"
        placeholderTextColor={colors.textMuted}
      />

      <Text style={styles.label}>Heure</Text>
      <TextInput
        style={styles.input}
        value={heure}
        onChangeText={setHeure}
        placeholder="14:00"
        placeholderTextColor={colors.textMuted}
      />

      <Text style={styles.label}>Niveau recherché</Text>
      <View style={styles.chipsRow}>
        {(['debutant', 'intermediaire', 'avance', 'expert'] as Niveau[]).map((n) => (
          <TouchableOpacity
            key={n}
            style={[styles.chip, niveau === n && styles.chipSelected]}
            onPress={() => setNiveau(n)}
          >
            <Text style={[styles.chipText, niveau === n && styles.chipTextSelected]}>
              {NIVEAUX_LABELS[n]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Type de session</Text>
      <View style={styles.chipsRow}>
        {(['match_amical', 'entrainement', 'competition'] as TypeSession[]).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.chip, typeSession === t && styles.chipSelected]}
            onPress={() => setTypeSession(t)}
          >
            <Text style={[styles.chipText, typeSession === t && styles.chipTextSelected]}>
              {TYPES_SESSION_LABELS[t]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.submitBtn, (!date.trim() && styles.submitBtnDisabled)]}
        onPress={handleCreate}
        disabled={!date.trim()}
      >
        <Text style={styles.submitBtnText}>Créer la session</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: theme.spacing.lg, paddingBottom: 100 },
  back: { marginBottom: theme.spacing.md },
  backText: { color: colors.primary, fontSize: theme.fontSize.md },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: theme.spacing.xl,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    fontSize: theme.fontSize.md,
    marginBottom: theme.spacing.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: theme.spacing.sm,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: { fontSize: theme.fontSize.sm, color: colors.textSecondary },
  chipTextSelected: { color: colors.background, fontWeight: '600' },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: colors.background, fontWeight: '600', fontSize: theme.fontSize.md },
});
