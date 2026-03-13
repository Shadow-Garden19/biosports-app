import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { colors } from '../theme/colors';
import { theme } from '../theme';
import { SPORTS_LABELS, NIVEAUX_LABELS, TYPES_SESSION_LABELS } from '../types';
import { useSessions } from '../context/SessionsContext';
import { useAuth } from '../context/AuthContext';
import { useConversations } from '../context/ConversationsContext';
import { useToast } from '../context/ToastContext';
import { mockLieux, mockUsers } from '../data/mockData';

export function SessionDetailScreen({
  sessionId,
  onBookVenue,
  onChat,
  onOpenGroupChat,
  onDeleteSession,
  onBack,
}: {
  sessionId: string;
  onBookVenue?: (sessionId: string, lieuId: string) => void;
  onChat?: (userId: string) => void;
  /** Ouvrir le chat de groupe lié à la session. */
  onOpenGroupChat?: (conversationId: string) => void;
  /** Supprimer la session (réservé au créateur). */
  onDeleteSession?: () => void;
  onBack: () => void;
}) {
  const { user } = useAuth();
  const { sessions, addParticipant, removeParticipant, setCanInvite, removeSession } = useSessions();
  const { conversations, updateConversationParticipants } = useConversations();
  const { showToast } = useToast();
  const [addSearch, setAddSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const session = sessions.find((s) => s.id === sessionId);
  const lieu = session?.lieuId
    ? mockLieux.find((l) => l.id === session.lieuId)
    : null;
  const createur = session
    ? mockUsers.find((u) => u.id === session.createurId)
    : null;
  const isCreateur = user?.id === session?.createurId;
  const canManageParticipants =
    isCreateur || (session?.canInviteIds ?? []).includes(user?.id ?? '');

  const addSearchClean = addSearch.trim().replace(/^@/, '').toLowerCase();
  const addCandidates =
    addSearchClean.length >= 2
      ? mockUsers.filter(
          (u) =>
            u.id !== user?.id &&
            !session?.participantsIds.includes(u.id) &&
            u.username?.toLowerCase().includes(addSearchClean)
        )
      : [];

  const handleAddParticipant = (userId: string) => {
    if (!session) return;
    addParticipant(sessionId, userId);
    if (session.conversationId) {
      const newParticipants = [...session.participantsIds, userId];
      updateConversationParticipants(session.conversationId, newParticipants);
    }
    setShowAddModal(false);
    setAddSearch('');
    showToast('Partenaire ajouté à la session');
  };

  const handleRemoveParticipant = (userId: string) => {
    if (!session || !isCreateur) return;
    removeParticipant(sessionId, userId);
    if (session.conversationId) {
      const newParticipants = session.participantsIds.filter((id) => id !== userId);
      updateConversationParticipants(session.conversationId, newParticipants);
    }
  };

  const handleDeleteSession = () => {
    if (!session || !isCreateur) return;
    const doDelete = () => {
      removeSession(sessionId);
      onDeleteSession?.();
    };
    if (Platform.OS === 'web') {
      if (window.confirm('Êtes-vous sûr de vouloir supprimer cette session ? Cette action est irréversible.')) {
        doDelete();
      }
    } else {
      Alert.alert(
        'Supprimer la session',
        'Êtes-vous sûr de vouloir supprimer cette session ? Cette action est irréversible.',
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Supprimer',
            style: 'destructive',
            onPress: doDelete,
          },
        ]
      );
    }
  };

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

      {/* Supprimer la session (créateur uniquement) */}
      {isCreateur && (
        <TouchableOpacity style={styles.deleteSessionButton} onPress={handleDeleteSession}>
          <Text style={styles.deleteSessionButtonText}>Supprimer la session</Text>
        </TouchableOpacity>
      )}

      {/* Chat de groupe */}
      {session.conversationId && (
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.groupChatButton}
            onPress={() => onOpenGroupChat?.(session.conversationId!)}
          >
            <Text style={styles.groupChatButtonText}>Ouvrir le chat du groupe</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Participants */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Participants ({session.participantsIds.length})
        </Text>
        {session.participantsIds.map((participantId) => {
          const participant = mockUsers.find((u) => u.id === participantId);
          const isOrganisateur = participantId === session.createurId;
          const canInvite = (session.canInviteIds ?? []).includes(participantId);
          const isSelf = participantId === user?.id;
          if (!participant) return null;
          return (
            <View key={participantId} style={styles.participantRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {participant.prenom[0]}
                  {participant.nom[0]}
                </Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {participant.prenom} {participant.nom}
                  {isOrganisateur && (
                    <Text style={styles.badge}> · Organisateur</Text>
                  )}
                </Text>
                <Text style={styles.userSports}>
                  {participant.sports.map((s) => SPORTS_LABELS[s.sportId]).join(', ')}
                </Text>
              </View>
              {isCreateur && !isSelf && (
                <View style={styles.participantActions}>
                  <View style={styles.canInviteRow}>
                    <Text style={styles.canInviteLabel}>Peut inviter</Text>
                    <Switch
                      value={canInvite}
                      onValueChange={(v) => setCanInvite(sessionId, participantId, v)}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveParticipant(participantId)}
                  >
                    <Text style={styles.removeButtonText}>Retirer</Text>
                  </TouchableOpacity>
                </View>
              )}
              {!isCreateur && !session.conversationId && createur?.id === participantId && (
                <TouchableOpacity
                  style={styles.chatButton}
                  onPress={() => onChat?.(participant.id)}
                >
                  <Text style={styles.chatButtonText}>Discuter</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}

        {canManageParticipants && (
          <>
            <TouchableOpacity
              style={styles.addParticipantButton}
              onPress={() => setShowAddModal(true)}
            >
              <Text style={styles.addParticipantButtonText}>+ Ajouter un participant</Text>
            </TouchableOpacity>

            <Modal
              visible={showAddModal}
              transparent
              animationType="fade"
              onRequestClose={() => setShowAddModal(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setShowAddModal(false)}
              >
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Ajouter un participant</Text>
                  <TextInput
                    style={styles.handleInput}
                    placeholder="@nom_utilisateur"
                    placeholderTextColor={colors.textMuted}
                    value={addSearch}
                    onChangeText={setAddSearch}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {addCandidates.length > 0 && (
                    <ScrollView style={styles.candidatesList}>
                      {addCandidates.map((u) => (
                        <TouchableOpacity
                          key={u.id}
                          style={styles.candidateRow}
                          onPress={() => handleAddParticipant(u.id)}
                        >
                          <View style={styles.avatarSmall}>
                            <Text style={styles.avatarText}>
                              {u.prenom[0]}
                              {u.nom[0]}
                            </Text>
                          </View>
                          <View style={styles.candidateInfo}>
                            <Text style={styles.userName}>
                              {u.prenom} {u.nom}
                            </Text>
                            <Text style={styles.userHandle}>@{u.username}</Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}
                  {addSearchClean.length >= 2 && addCandidates.length === 0 && (
                    <Text style={styles.noResult}>
                      Aucun utilisateur trouvé pour @{addSearchClean}
                    </Text>
                  )}
                  <TouchableOpacity
                    style={styles.modalClose}
                    onPress={() => setShowAddModal(false)}
                  >
                    <Text style={styles.modalCloseText}>Fermer</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>
          </>
        )}
      </View>

      {lieu && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lieu proposé</Text>
          <View style={styles.lieuCard}>
            <Text style={styles.lieuName}>{lieu.nom}</Text>
            <Text style={styles.lieuAddress}>{lieu.adresse}</Text>
            <Text style={styles.lieuPrice}>
              {lieu.prixHoraire > 0
                ? `${lieu.prixHoraire} € / heure (part : ${(lieu.prixHoraire / Math.max(1, session.participantsIds.length)).toFixed(0)} €)`
                : 'Voir tarifs sur le site du club'}
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
              <Text style={styles.lieuPrice}>
                {l.prixHoraire > 0 ? `${l.prixHoraire} € / heure` : 'Voir tarifs sur le site du club'}
              </Text>
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
  deleteSessionButton: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: theme.borderRadius.md,
  },
  deleteSessionButtonText: { color: colors.error, fontWeight: '600', fontSize: theme.fontSize.sm },
  groupChatButton: {
    backgroundColor: colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  groupChatButtonText: { color: '#fff', fontWeight: '600', fontSize: theme.fontSize.md },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
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
  badge: { fontWeight: '400', color: colors.primary, fontSize: theme.fontSize.sm },
  userSports: { fontSize: 12, color: colors.textSecondary },
  participantActions: { alignItems: 'flex-end', gap: 4 },
  canInviteRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  canInviteLabel: { fontSize: theme.fontSize.xs, color: colors.textSecondary },
  removeButton: { paddingVertical: 4, paddingHorizontal: 8 },
  removeButtonText: { fontSize: theme.fontSize.sm, color: colors.error },
  chatButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  chatButtonText: { color: '#fff', fontWeight: '600', fontSize: 12 },
  addParticipantButton: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  addParticipantButtonText: { color: colors.primary, fontWeight: '600', fontSize: theme.fontSize.sm },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    maxHeight: '70%',
  },
  modalTitle: { fontSize: theme.fontSize.lg, fontWeight: '600', color: colors.text, marginBottom: theme.spacing.md },
  handleInput: {
    backgroundColor: colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: theme.spacing.md,
  },
  candidatesList: { maxHeight: 200, marginBottom: theme.spacing.md },
  candidateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  candidateInfo: { flex: 1 },
  userHandle: { fontSize: theme.fontSize.sm, color: colors.primary, marginTop: 2 },
  noResult: { fontSize: theme.fontSize.sm, color: colors.textMuted, marginBottom: theme.spacing.md },
  modalClose: {
    backgroundColor: colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  modalCloseText: { color: colors.primary, fontWeight: '600' },
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
