import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { colors } from '../theme/colors';
import { theme } from '../theme';
import type { SportId, Niveau, TypeSession } from '../types';
import { SPORTS_LABELS, NIVEAUX_LABELS, TYPES_SESSION_LABELS } from '../types';
import { SPORT_IMAGES, SPORT_IDS_ORDER } from '../constants/images';

const SPORTS_IDS: SportId[] = [
  'tennis', 'padel', 'basketball', 'football', 'badminton',
  'squash', 'volleyball', 'running', 'musculation', 'autre',
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface RegisterScreenProps {
  onRegister: (data: RegisterData) => void;
  onGoToLogin: () => void;
}

export interface RegisterData {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  sports: { sportId: SportId; niveau: Niveau }[];
  preferences: TypeSession[];
  description?: string;
}

export function RegisterScreen({ onRegister, onGoToLogin }: RegisterScreenProps) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [description, setDescription] = useState('');
  const [sports, setSports] = useState<{ sportId: SportId; niveau: Niveau }[]>([]);
  const [preferences, setPreferences] = useState<TypeSession[]>([]);

  const stepOpacity = useRef(new Animated.Value(1)).current;
  const stepTranslate = useRef(new Animated.Value(0)).current;

  const runStepTransition = (nextStep: number) => {
    const direction = nextStep > step ? 1 : -1;
    stepTranslate.setValue(0);
    Animated.parallel([
      Animated.timing(stepOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(stepTranslate, {
        toValue: -40 * direction,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setStep(nextStep);
      stepTranslate.setValue(40 * direction);
      Animated.parallel([
        Animated.timing(stepOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(stepTranslate, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
      ]).start();
    });
  };

  const toggleSport = (sportId: SportId, niveau: Niveau) => {
    setSports((prev) => {
      const exists = prev.find((s) => s.sportId === sportId);
      if (exists) {
        if (exists.niveau === niveau) return prev.filter((s) => s.sportId !== sportId);
        return prev.map((s) => (s.sportId === sportId ? { ...s, niveau } : s));
      }
      return [...prev, { sportId, niveau }];
    });
  };

  const togglePreference = (p: TypeSession) => {
    setPreferences((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const handleRegister = () => {
    onRegister({
      email,
      password,
      nom,
      prenom,
      sports,
      preferences,
      description: description || undefined,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.progressWrap}>
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, { width: `${(step / 2) * 100}%` }]} />
        </View>
        <Text style={styles.stepLabel}>Étape {step} sur 2</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          style={{
            opacity: stepOpacity,
            transform: [{ translateX: stepTranslate }],
          }}
        >
          {step === 1 && (
            <>
              <View style={styles.heroRegister}>
                <Image source={{ uri: SPORT_IMAGES.tennis }} style={styles.heroImg} resizeMode="cover" />
                <View style={styles.heroOverlay} />
                <Text style={styles.heroTitle}>Rejoignez la communauté</Text>
                <Text style={styles.heroSubtitle}>Quelques infos pour créer votre profil</Text>
              </View>
              <Text style={styles.title}>Créer mon compte</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder="Prénom"
                placeholderTextColor={colors.textMuted}
                value={prenom}
                onChangeText={setPrenom}
              />
              <TextInput
                style={styles.input}
                placeholder="Nom"
                placeholderTextColor={colors.textMuted}
                value={nom}
                onChangeText={setNom}
              />
              <TouchableOpacity style={styles.button} onPress={() => runStepTransition(2)}>
                <Text style={styles.buttonText}>Suivant</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.sectionIntro}>Tous les sports disponibles</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.clubImagesWrap}
                style={styles.clubImagesScroll}
              >
                {SPORT_IDS_ORDER.map((sportId) => (
                  <View key={sportId} style={styles.clubImageCard}>
                    <Image
                      source={{ uri: SPORT_IMAGES[sportId] }}
                      style={styles.clubImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.clubImageLabel}>
                      {SPORTS_LABELS[sportId as keyof typeof SPORTS_LABELS]}
                    </Text>
                  </View>
                ))}
              </ScrollView>

              <Text style={styles.title}>Mon profil sportif</Text>
              <Text style={styles.label}>Sports pratiqués et niveau</Text>
              {SPORTS_IDS.map((sportId) => (
                <View key={sportId} style={styles.sportRow}>
                  <Text style={styles.sportName}>{SPORTS_LABELS[sportId]}</Text>
                  <View style={styles.niveaux}>
                    {(['debutant', 'intermediaire', 'avance', 'expert'] as Niveau[]).map((n) => {
                      const isSelected = sports.some((s) => s.sportId === sportId && s.niveau === n);
                      return (
                        <TouchableOpacity
                          key={n}
                          style={[styles.chip, isSelected && styles.chipSelected]}
                          onPress={() => toggleSport(sportId, n)}
                        >
                          <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                            {NIVEAUX_LABELS[n].slice(0, 3)}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ))}
              <Text style={styles.label}>Préférences</Text>
              <View style={styles.chipRow}>
                {(['match_amical', 'entrainement', 'competition'] as TypeSession[]).map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[styles.chip, preferences.includes(p) && styles.chipSelected]}
                    onPress={() => togglePreference(p)}
                  >
                    <Text style={[styles.chipText, preferences.includes(p) && styles.chipTextSelected]}>
                      {TYPES_SESSION_LABELS[p]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Courte description ou passions sportives (optionnel)"
                placeholderTextColor={colors.textMuted}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />
              <TouchableOpacity style={styles.buttonSecondary} onPress={() => runStepTransition(1)}>
                <Text style={styles.buttonSecondaryText}>Retour</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>S'inscrire</Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>

        <TouchableOpacity style={styles.link} onPress={onGoToLogin}>
          <Text style={styles.linkText}>Déjà un compte ? Se connecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  progressWrap: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  stepLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 6,
  },
  scroll: { padding: theme.spacing.lg, paddingBottom: 48 },
  heroRegister: {
    height: 160,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.lg,
    position: 'relative',
  },
  heroImg: { width: '100%', height: '100%' },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  heroTitle: {
    position: 'absolute',
    bottom: 36,
    left: theme.spacing.md,
    right: theme.spacing.md,
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  heroSubtitle: {
    position: 'absolute',
    bottom: 16,
    left: theme.spacing.md,
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  sectionIntro: {
    fontSize: theme.fontSize.sm,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  clubImagesWrap: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: theme.spacing.xl,
    paddingVertical: 4,
  },
  clubImagesScroll: { marginHorizontal: -theme.spacing.lg },
  clubImageCard: {
    width: 180,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  clubImage: {
    width: '100%',
    height: 110,
  },
  clubImageLabel: {
    padding: theme.spacing.sm,
    fontSize: 12,
    color: colors.textSecondary,
  },
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
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  sportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    flexWrap: 'wrap',
  },
  sportName: { width: 100, fontSize: theme.fontSize.sm, color: colors.text },
  niveaux: { flexDirection: 'row', gap: 4, flexWrap: 'wrap' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: theme.spacing.md },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 12, color: colors.textSecondary },
  chipTextSelected: { color: '#fff' },
  button: {
    backgroundColor: colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  buttonSecondary: {
    padding: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  buttonSecondaryText: { color: colors.primary, fontSize: theme.fontSize.md },
  buttonText: { color: '#fff', fontSize: theme.fontSize.lg, fontWeight: '600' },
  link: { alignItems: 'center', marginTop: theme.spacing.xl },
  linkText: { color: colors.primary, fontSize: theme.fontSize.sm },
});
