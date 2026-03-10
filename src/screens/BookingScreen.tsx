import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { colors } from '../theme/colors';
import { theme } from '../theme';
import { useClubBooking } from '../context/ClubBookingContext';
import { useConversations } from '../context/ConversationsContext';
import { useSessions } from '../context/SessionsContext';
import { useAuth } from '../context/AuthContext';
import { mockUsers } from '../data/mockData';
import {
  TENNIS_CLUB_PARIS_1ER_ID,
  TENNIS_CLUB_PARIS_1ER_IMAGES,
  TENNIS_CLUB_PARIS_1ER_LABELS,
  PADEL_ARENA_ID,
  PADEL_ARENA_IMAGES,
  PADEL_ARENA_LABELS,
} from '../constants/clubGalleries';

const NB_PERSONNES_OPTIONS = [2, 3, 4, 5, 6];

export function BookingScreen({
  lieuId,
  sessionId,
  onConfirm,
  onBack,
}: {
  lieuId: string;
  sessionId?: string;
  /** Appelé après réservation ; si groupe créé, reçoit l’id de la conversation. */
  onConfirm?: (conversationId?: string) => void;
  onBack: () => void;
}) {
  const { user } = useAuth();
  const { venues, createReservation, reserving, error } = useClubBooking();
  const { addConversation } = useConversations();
  const { updateSession } = useSessions();
  const [localError, setLocalError] = useState<string | null>(null);
  const [nbPersonnes, setNbPersonnes] = useState(2);

  const lieu = venues.find((l) => l.id === lieuId);
  if (!lieu) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.empty}>Lieu introuvable.</Text>
      </View>
    );
  }

  const partParJoueur = (lieu.prixHoraire / nbPersonnes).toFixed(2);

  const handleConfirm = async () => {
    setLocalError(null);
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const dateStr = date.toISOString().split('T')[0];
    try {
      const result = await createReservation({
        lieuId: lieu.id,
        date: dateStr,
        heureDebut: '14:00',
        dureeMinutes: 60,
        sessionId,
        nbPersonnes,
      });
      let newConversationId: string | undefined;
      if (nbPersonnes > 1 && user) {
        const others = mockUsers.filter((u) => u.id !== user.id).slice(0, nbPersonnes - 1);
        const participants = [user.id, ...others.map((u) => u.id)];
        const groupId = `group-${Date.now()}`;
        addConversation({
          id: groupId,
          participants,
          sessionId,
          dernierMessage: undefined,
        });
        newConversationId = groupId;
        if (sessionId) {
          updateSession(sessionId, { conversationId: groupId, participantsIds: participants });
        }
      }
      const message =
        result.message ||
        'Votre réservation a bien été enregistrée dans le planning du club. Vous recevrez un rappel avant la session.';
      const groupInfo = newConversationId
        ? '\n\nUn groupe de discussion a été créé avec les participants.'
        : '';
      if (Platform.OS === 'web') {
        const ok = typeof window !== 'undefined' && window.confirm(`${message}${groupInfo}\n\nOK pour continuer ?`);
        if (ok) onConfirm?.(newConversationId);
      } else {
        Alert.alert('Réservation enregistrée', message + groupInfo, [
          { text: 'OK', onPress: () => onConfirm?.(newConversationId) },
        ]);
      }
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : 'Impossible d’enregistrer la réservation. Réessayez.');
    }
  };

  const err = localError || error;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={onBack} style={styles.back}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Réservation</Text>
      <Text style={styles.syncInfo}>
        Cette réservation est enregistrée directement dans le système du club (même planning que le site du club).
      </Text>

      <Text style={styles.galleryTitle}>Le club en images</Text>
      {(lieu.id === TENNIS_CLUB_PARIS_1ER_ID ? TENNIS_CLUB_PARIS_1ER_IMAGES.length > 0 : lieu.id === PADEL_ARENA_ID ? PADEL_ARENA_IMAGES.length > 0 : lieu.gallery && lieu.gallery.length > 0) ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.galleryScroll}
          style={styles.galleryContainer}
        >
          {(lieu.id === TENNIS_CLUB_PARIS_1ER_ID
            ? TENNIS_CLUB_PARIS_1ER_IMAGES
            : lieu.id === PADEL_ARENA_ID
              ? PADEL_ARENA_IMAGES
              : (lieu.gallery ?? []).map((uri) => ({ uri }))
          ).map((source, index) => (
            <View key={`${lieu.id}-${index}`} style={styles.galleryItem}>
              <Image
                source={typeof source === 'number' ? source : source}
                style={styles.galleryImage}
                resizeMode="cover"
              />
              {(lieu.id === TENNIS_CLUB_PARIS_1ER_ID
                ? TENNIS_CLUB_PARIS_1ER_LABELS[index]
                : lieu.id === PADEL_ARENA_ID
                  ? PADEL_ARENA_LABELS[index]
                  : lieu.galleryLabels?.[index]) ? (
                <Text style={styles.galleryLabel} numberOfLines={1}>
                  {lieu.id === TENNIS_CLUB_PARIS_1ER_ID
                    ? TENNIS_CLUB_PARIS_1ER_LABELS[index]
                    : lieu.id === PADEL_ARENA_ID
                      ? PADEL_ARENA_LABELS[index]
                      : lieu.galleryLabels?.[index]}
                </Text>
              ) : null}
            </View>
          ))}
        </ScrollView>
      ) : lieu.imageUrl ? (
        <Image source={{ uri: lieu.imageUrl }} style={styles.lieuImage} resizeMode="cover" />
      ) : null}

      <View style={styles.card}>
        <Text style={styles.lieuName}>{lieu.nom}</Text>
        <Text style={styles.lieuAddress}>{lieu.adresse}</Text>

        <Text style={styles.nbPersonnesLabel}>Nombre de participants</Text>
        <View style={styles.nbPersonnesRow}>
          {NB_PERSONNES_OPTIONS.map((n) => (
            <TouchableOpacity
              key={n}
              style={[styles.nbPersonnesBtn, nbPersonnes === n && styles.nbPersonnesBtnActive]}
              onPress={() => setNbPersonnes(n)}
            >
              <Text style={[styles.nbPersonnesBtnText, nbPersonnes === n && styles.nbPersonnesBtnTextActive]}>
                {n}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Prix total (1h)</Text>
          <Text style={styles.priceValue}>{lieu.prixHoraire} €</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Part par joueur ({nbPersonnes} pers.)</Text>
          <Text style={styles.priceHighlight}>{partParJoueur} €</Text>
        </View>
      </View>

      {err ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{err}</Text>
        </View>
      ) : null}

      <Text style={styles.info}>
        Le paiement sera divisé automatiquement. Chaque joueur paie sa part dans l’application ; BIOSPORTS reverse
        ensuite la somme au club partenaire.
      </Text>

      <TouchableOpacity
        style={[styles.confirmButton, reserving && styles.confirmButtonDisabled]}
        onPress={handleConfirm}
        disabled={reserving}
      >
        {reserving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.confirmButtonText}>Payer et réserver</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: theme.spacing.lg, paddingBottom: 100 },
  back: { marginBottom: theme.spacing.md },
  backText: { color: colors.primary, fontSize: theme.fontSize.md },
  empty: { color: colors.textMuted, padding: theme.spacing.lg },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: theme.spacing.xs,
  },
  syncInfo: {
    fontSize: theme.fontSize.sm,
    color: colors.primary,
    marginBottom: theme.spacing.md,
  },
  galleryTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: theme.spacing.sm,
  },
  galleryContainer: {
    marginHorizontal: -theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  galleryScroll: {
    paddingHorizontal: theme.spacing.lg,
    paddingRight: theme.spacing.xl,
  },
  galleryItem: {
    marginRight: theme.spacing.md,
  },
  galleryImage: {
    width: Dimensions.get('window').width * 0.75,
    maxWidth: 320,
    height: 200,
    borderRadius: theme.borderRadius.md,
    backgroundColor: colors.surfaceElevated,
  },
  galleryLabel: {
    fontSize: theme.fontSize.sm,
    color: colors.textSecondary,
    marginTop: theme.spacing.xs,
    paddingHorizontal: 2,
  },
  lieuImage: {
    width: '100%',
    height: 180,
    borderRadius: theme.borderRadius.md,
    backgroundColor: colors.surfaceElevated,
    marginBottom: theme.spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  lieuName: { fontSize: theme.fontSize.lg, fontWeight: '600', color: colors.text },
  lieuAddress: { fontSize: theme.fontSize.sm, color: colors.textSecondary, marginTop: 4 },
  nbPersonnesLabel: {
    fontSize: theme.fontSize.sm,
    color: colors.textSecondary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  nbPersonnesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  nbPersonnesBtn: {
    minWidth: 44,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  nbPersonnesBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  nbPersonnesBtnText: { fontSize: theme.fontSize.md, color: colors.text, fontWeight: '500' },
  nbPersonnesBtnTextActive: { color: '#fff' },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  priceLabel: { color: colors.textSecondary },
  priceValue: { fontWeight: '600', color: colors.text },
  priceHighlight: { fontWeight: '700', color: colors.primary, fontSize: theme.fontSize.lg },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: theme.spacing.sm,
  },
  info: {
    fontSize: theme.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: theme.spacing.xl,
    lineHeight: 20,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  confirmButtonDisabled: { opacity: 0.7 },
  confirmButtonText: { color: '#fff', fontWeight: '600', fontSize: theme.fontSize.md },
  errorBox: {
    backgroundColor: 'rgba(198, 40, 40, 0.15)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  errorText: { color: colors.error, fontSize: theme.fontSize.sm },
});
