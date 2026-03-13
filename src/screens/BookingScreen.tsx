import React, { useState, useEffect } from 'react';
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
import type { PrestationLieu } from '../types';
import type { CreneauDisponible } from '../types/clubBooking';
import { colors } from '../theme/colors';
import { theme } from '../theme';
import { useClubBooking } from '../context/ClubBookingContext';
import { useConversations } from '../context/ConversationsContext';
import { useSessions } from '../context/SessionsContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
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
  const { showToast } = useToast();
  const { venues, createReservation, reserving, error, getAvailability } = useClubBooking();
  const { addConversation } = useConversations();
  const { updateSession } = useSessions();
  const [localError, setLocalError] = useState<string | null>(null);
  const [nbPersonnes, setNbPersonnes] = useState(2);
  const [selectedPrestation, setSelectedPrestation] = useState<PrestationLieu | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedCreneau, setSelectedCreneau] = useState<CreneauDisponible | null>(null);
  const [creneaux, setCreneaux] = useState<CreneauDisponible[]>([]);
  const [loadingCreneaux, setLoadingCreneaux] = useState(false);

  const lieu = venues.find((l) => l.id === lieuId);

  useEffect(() => {
    if (!lieuId || !selectedDate) return;
    setLoadingCreneaux(true);
    getAvailability(lieuId, selectedDate)
      .then(setCreneaux)
      .catch(() => setCreneaux([]))
      .finally(() => setLoadingCreneaux(false));
  }, [lieuId, selectedDate, getAvailability]);
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

  const prestations = lieu.prestations && lieu.prestations.length > 0 ? lieu.prestations : null;
  const effectivePrix =
    selectedPrestation?.prixHoraire ?? selectedCreneau?.prixTotal ?? lieu.prixHoraire;
  const partParJoueur =
    effectivePrix > 0 ? (effectivePrix / nbPersonnes).toFixed(2) : null;
  const mustChoosePrestation = prestations != null && selectedPrestation == null;
  const mustChooseCreneau = !selectedCreneau;

  const dateOptions = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
    return { dateStr, label, isToday: i === 0 };
  });

  const handleConfirm = async () => {
    if (!selectedCreneau) return;
    setLocalError(null);
    try {
      const result = await createReservation({
        lieuId: lieu.id,
        date: selectedDate,
        heureDebut: selectedCreneau.heureDebut,
        dureeMinutes: selectedCreneau.dureeMinutes,
        sessionId,
        nbPersonnes,
        terrainId: selectedPrestation?.id,
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
      showToast('Réservation enregistrée');
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

        {lieu.messageOuvertureReservations ? (
          <View style={styles.ouvertureResaBox}>
            <Text style={styles.ouvertureResaText}>{lieu.messageOuvertureReservations}</Text>
          </View>
        ) : null}

        {prestations ? (
          <>
            <Text style={styles.sectionLabel}>Sport et type de terrain</Text>
            <Text style={styles.sectionHint}>
              Ce club propose plusieurs options ; le prix varie selon le terrain.
            </Text>
            <View style={styles.prestationsRow}>
              {prestations.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.prestationChip, selectedPrestation?.id === p.id && styles.prestationChipActive]}
                  onPress={() => setSelectedPrestation(p)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.prestationChipText, selectedPrestation?.id === p.id && styles.prestationChipTextActive]} numberOfLines={2}>
                    {p.label}
                  </Text>
                  <Text style={[styles.prestationChipPrice, selectedPrestation?.id === p.id && styles.prestationChipPriceActive]}>
                    {p.prixHoraire > 0 ? `${p.prixHoraire} €/h` : 'Sur site'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : null}

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
      </View>

      {(!prestations || selectedPrestation) ? (
        <>
          <Text style={styles.stepTitle}>Date</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateStrip}>
        {dateOptions.map(({ dateStr, label, isToday }) => (
          <TouchableOpacity
            key={dateStr}
            style={[styles.dateChip, selectedDate === dateStr && styles.dateChipActive]}
            onPress={() => { setSelectedDate(dateStr); setSelectedCreneau(null); }}
          >
            <Text style={[styles.dateChipLabel, selectedDate === dateStr && styles.dateChipLabelActive]}>
              {isToday ? 'Aujourd\'hui' : label.split(' ')[0]}
            </Text>
            <Text style={[styles.dateChipDay, selectedDate === dateStr && styles.dateChipDayActive]}>
              {label.split(' ')[1]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.stepTitle}>Créneaux disponibles</Text>
      {loadingCreneaux ? (
        <View style={styles.creneauxLoading}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.creneauxLoadingText}>Chargement des créneaux…</Text>
        </View>
      ) : creneaux.length === 0 ? (
        <Text style={styles.creneauxEmpty}>Aucun créneau disponible pour cette date.</Text>
      ) : (
        <View style={styles.creneauxGrid}>
          {creneaux.map((c) => {
            const prix = selectedPrestation?.prixHoraire ?? c.prixTotal ?? lieu.prixHoraire;
            const isSelected = selectedCreneau?.heureDebut === c.heureDebut;
            return (
              <TouchableOpacity
                key={c.heureDebut}
                style={[styles.creneauChip, isSelected && styles.creneauChipActive]}
                onPress={() => setSelectedCreneau(c)}
                activeOpacity={0.8}
              >
                <Text style={[styles.creneauChipTime, isSelected && styles.creneauChipTimeActive]}>
                  {c.heureDebut}
                </Text>
                <Text style={[styles.creneauChipPrice, isSelected && styles.creneauChipPriceActive]}>
                  {prix > 0 ? `${prix} €` : '—'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <View style={styles.recapCard}>
        <Text style={styles.recapTitle}>Récapitulatif</Text>
        {selectedCreneau ? (
          <>
            <View style={styles.recapRow}>
              <Text style={styles.recapLabel}>Date</Text>
              <Text style={styles.recapValue}>
                {new Date(selectedDate + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </Text>
            </View>
            <View style={styles.recapRow}>
              <Text style={styles.recapLabel}>Horaire</Text>
              <Text style={styles.recapValue}>{selectedCreneau.heureDebut} – {selectedCreneau.heureFin}</Text>
            </View>
            {selectedPrestation && (
              <View style={styles.recapRow}>
                <Text style={styles.recapLabel}>Terrain</Text>
                <Text style={styles.recapValue}>{selectedPrestation.label}</Text>
              </View>
            )}
            <View style={styles.recapRow}>
              <Text style={styles.recapLabel}>Prix total</Text>
              <Text style={styles.recapValue}>{effectivePrix > 0 ? `${effectivePrix} €` : 'Voir site du club'}</Text>
            </View>
            <View style={styles.recapRow}>
              <Text style={styles.recapLabel}>Part par joueur ({nbPersonnes})</Text>
              <Text style={[styles.recapValue, styles.recapHighlight]}>{partParJoueur != null ? `${partParJoueur} €` : '—'}</Text>
            </View>
          </>
        ) : (
          <Text style={styles.recapPlaceholder}>Sélectionnez un créneau ci-dessus.</Text>
        )}
      </View>
        </>
      ) : (
        <View style={styles.card}>
          <Text style={styles.recapPlaceholder}>Choisissez d’abord le sport et le type de terrain ci-dessus pour voir les dates et créneaux.</Text>
        </View>
      )}

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
        style={[styles.confirmButton, (reserving || mustChoosePrestation || mustChooseCreneau) && styles.confirmButtonDisabled]}
        onPress={handleConfirm}
        disabled={reserving || mustChoosePrestation || mustChooseCreneau}
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
  ouvertureResaBox: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.sm,
    backgroundColor: colors.background,
    borderRadius: theme.borderRadius.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  ouvertureResaText: {
    fontSize: theme.fontSize.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  sectionLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  sectionHint: {
    fontSize: theme.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  prestationsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  prestationChip: {
    minWidth: 140,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  prestationChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  prestationChipText: { fontSize: theme.fontSize.sm, color: colors.text, fontWeight: '500' },
  prestationChipTextActive: { color: '#fff' },
  prestationChipPrice: { fontSize: theme.fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  prestationChipPriceActive: { color: 'rgba(255,255,255,0.9)' },
  stepTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  dateStrip: {
    marginBottom: theme.spacing.md,
    marginHorizontal: -theme.spacing.lg,
  },
  dateChip: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginLeft: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    minWidth: 72,
  },
  dateChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dateChipLabel: { fontSize: theme.fontSize.xs, color: colors.textSecondary },
  dateChipLabelActive: { color: 'rgba(255,255,255,0.9)' },
  dateChipDay: { fontSize: theme.fontSize.md, fontWeight: '600', color: colors.text, marginTop: 2 },
  dateChipDayActive: { color: '#fff' },
  creneauxLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
  },
  creneauxLoadingText: { fontSize: theme.fontSize.sm, color: colors.textSecondary },
  creneauxEmpty: { fontSize: theme.fontSize.sm, color: colors.textMuted, padding: theme.spacing.md },
  creneauxGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  creneauChip: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 76,
    alignItems: 'center',
  },
  creneauChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  creneauChipTime: { fontSize: theme.fontSize.md, fontWeight: '600', color: colors.text },
  creneauChipTimeActive: { color: '#fff' },
  creneauChipPrice: { fontSize: theme.fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  creneauChipPriceActive: { color: 'rgba(255,255,255,0.9)' },
  recapCard: {
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  recapTitle: { fontSize: theme.fontSize.lg, fontWeight: '600', color: colors.text, marginBottom: theme.spacing.sm },
  recapRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: theme.spacing.xs },
  recapLabel: { fontSize: theme.fontSize.sm, color: colors.textSecondary },
  recapValue: { fontSize: theme.fontSize.sm, color: colors.text, fontWeight: '500' },
  recapHighlight: { color: colors.primary, fontWeight: '700' },
  recapPlaceholder: { fontSize: theme.fontSize.sm, color: colors.textMuted },
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
