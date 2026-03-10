import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useSessions } from '../context/SessionsContext';
import { Logo } from '../components/Logo';
import { colors } from '../theme/colors';
import { theme } from '../theme';
import { SPORTS_LABELS } from '../types';
import type { SportId } from '../types';
import { NIVEAUX_LABELS, TYPES_SESSION_LABELS } from '../types';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { SessionSportive } from '../types';
import { BALLES_TENNIS_IMAGE } from '../constants/images';
import { mockUsers } from '../data/mockData';

const SPORTS_FILTER: SportId[] = [
  'tennis', 'padel', 'basketball', 'football', 'badminton', 'running',
];

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const { sessions } = useSessions();
  const [selectedSport, setSelectedSport] = useState<SportId | null>(null);
  const [modalDate, setModalDate] = useState<string | null>(null);

  const sessionsFiltered = sessions.filter(
    (s) => !selectedSport || s.sportId === selectedSport
  );

  const mySessionDates = useMemo(() => {
    const userId = user?.id ?? '1';
    const byDate: Record<string, SessionSportive[]> = {};
    sessions.forEach((s) => {
      if (!s.participantsIds.includes(userId)) return;
      const d = s.date;
      if (!byDate[d]) byDate[d] = [];
      byDate[d].push(s);
    });
    return byDate;
  }, [sessions, user?.id]);

  const chartDays = useMemo(() => {
    const out: { date: string; label: string; sessions: SessionSportive[] }[] = [];
    for (let i = -7; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const sessionsOfDay = mySessionDates[dateStr] ?? [];
      out.push({
        date: dateStr,
        label: d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
        sessions: sessionsOfDay,
      });
    }
    return out;
  }, [mySessionDates]);

  const sessionsForModal = modalDate ? (mySessionDates[modalDate] ?? []) : [];

  const userStats = useMemo(() => {
    const userId = user?.id ?? '1';
    const mySessions = sessions.filter((s) => s.participantsIds.includes(userId));
    const pastSessions = mySessions.filter((s) => new Date(s.date) < new Date());
    const upcomingSessions = mySessions.filter((s) => new Date(s.date) >= new Date());
    const sportsCount: Record<string, number> = {};
    const partnerCount: Record<string, number> = {};
    mySessions.forEach((s) => {
      sportsCount[s.sportId] = (sportsCount[s.sportId] ?? 0) + 1;
      s.participantsIds.forEach((id) => {
        if (id === userId) return;
        partnerCount[id] = (partnerCount[id] ?? 0) + 1;
      });
    });
    const topSportId = Object.entries(sportsCount).sort((a, b) => b[1] - a[1])[0]?.[0] as SportId | undefined;
    const topPartnerId = Object.entries(partnerCount).sort((a, b) => b[1] - a[1])[0]?.[0];
    const topPartner = topPartnerId ? mockUsers.find((u) => u.id === topPartnerId) : null;
    return {
      totalPlayed: pastSessions.length,
      upcoming: upcomingSessions.length,
      topSport: topSportId ? SPORTS_LABELS[topSportId] : null,
      topSportCount: topSportId ? sportsCount[topSportId] : 0,
      topPartner: topPartner ? `${topPartner.prenom} ${topPartner.nom}` : null,
      topPartnerCount: topPartnerId ? partnerCount[topPartnerId] : 0,
    };
  }, [sessions, user?.id]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Logo size="small" showSlogan={false} />
        <Text style={styles.greeting}>
          Bonjour, {user?.prenom ?? 'Sportif'} !
        </Text>
        <Text style={styles.subtitle}>Trouvez une session près de chez vous</Text>
      </View>

      <TouchableOpacity
        style={styles.searchBox}
        onPress={() => (navigation.getParent() as any)?.navigate('Search')}
      >
        <Text style={styles.searchPlaceholder}>
          Sport, date, lieu, niveau...
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Sports</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sportsRow}
      >
        {SPORTS_FILTER.map((sportId) => (
          <TouchableOpacity
            key={sportId}
            style={[
              styles.sportChip,
              selectedSport === sportId && styles.sportChipSelected,
            ]}
            onPress={() => setSelectedSport(selectedSport === sportId ? null : sportId)}
          >
            <Text
              style={[
                styles.sportChipText,
                selectedSport === sportId && styles.sportChipTextSelected,
              ]}
            >
              {SPORTS_LABELS[sportId]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.createSessionBtn}
        onPress={() => navigation.navigate('CreateSession')}
      >
        <Text style={styles.createSessionBtnText}>+ Créer une session</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Sessions à proximité</Text>
      {sessionsFiltered.length === 0 ? (
        <Text style={styles.empty}>Aucune session pour le moment.</Text>
      ) : (
        sessionsFiltered.map((session) => (
          <TouchableOpacity
            key={session.id}
            style={styles.card}
            onPress={() => navigation.navigate('SessionDetail', { sessionId: session.id })}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardSport}>{SPORTS_LABELS[session.sportId]}</Text>
              <Text style={styles.cardType}>
                {TYPES_SESSION_LABELS[session.typeSession]}
              </Text>
            </View>
            <Text style={styles.cardDate}>
              {new Date(session.date).toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}{' '}
              à {session.heure}
            </Text>
            <Text style={styles.cardLevel}>
              Niveau : {NIVEAUX_LABELS[session.niveauRecherche]}
            </Text>
            <Text style={styles.cardLocation}>
              {session.localisation.ville ?? 'Paris'}
            </Text>
          </TouchableOpacity>
        ))
      )}

      <Text style={styles.sectionTitle}>Jours joués</Text>
      <Text style={styles.chartSubtitle}>Clique sur un jour pour voir les sessions</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chartRow}
      >
        {chartDays.map(({ date, label, sessions: daySessions }) => (
          <TouchableOpacity
            key={date}
            style={[
              styles.chartBarWrap,
              daySessions.length > 0 && styles.chartBarWrapActive,
            ]}
            onPress={() => daySessions.length > 0 && setModalDate(date)}
          >
            <View
              style={[
                styles.chartBar,
                daySessions.length > 0 && styles.chartBarFilled,
                { height: daySessions.length > 0 ? 36 + daySessions.length * 12 : 12 },
              ]}
            />
            <Text
              style={[
                styles.chartLabel,
                daySessions.length > 0 && styles.chartLabelActive,
              ]}
              numberOfLines={1}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Mes stats</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{userStats.totalPlayed}</Text>
          <Text style={styles.statLabel}>Sessions jouées</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{userStats.upcoming}</Text>
          <Text style={styles.statLabel}>À venir</Text>
        </View>
        {userStats.topSport && (
          <View style={styles.statCardWide}>
            <Text style={styles.statLabel}>Sport le plus pratiqué</Text>
            <Text style={styles.statValueSecondary}>{userStats.topSport}</Text>
            <Text style={styles.statMeta}>{userStats.topSportCount} session{userStats.topSportCount > 1 ? 's' : ''}</Text>
          </View>
        )}
        {userStats.topPartner && (
          <View style={styles.statCardWide}>
            <Text style={styles.statLabel}>Partenaire avec qui tu joues le plus</Text>
            <Text style={styles.statValueSecondary}>{userStats.topPartner}</Text>
            <Text style={styles.statMeta}>{userStats.topPartnerCount} session{userStats.topPartnerCount > 1 ? 's' : ''} ensemble</Text>
          </View>
        )}
      </View>

      <View style={styles.aboutSection}>
        <Text style={styles.aboutTitle}>À propos de nous</Text>
        <Text style={styles.aboutText}>
          BIOSPORTS a pour but de faciliter la pratique sportive entre passionnés. Trouvez des partenaires à proximité, réservez des terrains en club ou en extérieur, et organisez vos matchs et entraînements en quelques clics. Que vous soyez débutant ou confirmé, l'app vous met en relation avec des joueurs qui partagent vos sports et votre niveau, pour que le sport reste avant tout un plaisir et une rencontre.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.boutiqueTransition}
        onPress={() => navigation.navigate('Main', { screen: 'Boutique' })}
        activeOpacity={0.95}
      >
        <Image
          source={BALLES_TENNIS_IMAGE}
          style={styles.boutiqueTransitionImage}
          resizeMode="cover"
        />
        <View style={styles.boutiqueTransitionOverlay} />
        <View style={styles.boutiqueTransitionContent}>
          <Text style={styles.boutiqueTransitionTitle}>Notre boutique</Text>
          <Text style={styles.boutiqueTransitionText}>
            Raquettes, balles de tennis et de padel, gourdes, sacs et textiles : tout l’équipement pour vos sessions, sélectionné pour la qualité et le rapport qualité-prix. Pensez à checker votre matériel avant de jouer.
          </Text>
          <Text style={styles.boutiqueTransitionCta}>Découvrir la boutique →</Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={!!modalDate}
        transparent
        animationType="fade"
        onRequestClose={() => setModalDate(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalDate(null)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>
              Sessions du {modalDate ? new Date(modalDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) : ''}
            </Text>
            {sessionsForModal.length === 0 ? (
              <Text style={styles.modalEmpty}>Aucune session ce jour.</Text>
            ) : (
              sessionsForModal.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={styles.modalCard}
                  onPress={() => {
                    setModalDate(null);
                    navigation.navigate('SessionDetail', { sessionId: s.id });
                  }}
                >
                  <Text style={styles.modalCardSport}>{SPORTS_LABELS[s.sportId]}</Text>
                  <Text style={styles.modalCardMeta}>
                    {TYPES_SESSION_LABELS[s.typeSession]} · {s.heure} · {s.localisation.ville ?? 'Paris'}
                  </Text>
                </TouchableOpacity>
              ))
            )}
            <TouchableOpacity style={styles.modalClose} onPress={() => setModalDate(null)}>
              <Text style={styles.modalCloseText}>Fermer</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: theme.spacing.md, paddingBottom: 100 },
  header: { marginBottom: theme.spacing.lg, alignItems: 'center' },
  greeting: {
    fontSize: theme.fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
    marginTop: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  searchBox: {
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchPlaceholder: {
    color: colors.textMuted,
    fontSize: theme.fontSize.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: theme.spacing.sm,
  },
  sportsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: theme.spacing.lg,
  },
  sportChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sportChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sportChipText: { fontSize: theme.fontSize.sm, color: colors.text },
  sportChipTextSelected: { color: '#fff' },
  card: {
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  cardSport: { fontSize: theme.fontSize.lg, fontWeight: '600', color: colors.text },
  cardType: { fontSize: theme.fontSize.sm, color: colors.primary },
  cardDate: { fontSize: theme.fontSize.sm, color: colors.textSecondary },
  cardLevel: { fontSize: theme.fontSize.sm, color: colors.text },
  cardLocation: { fontSize: theme.fontSize.sm, color: colors.textMuted, marginTop: 4 },
  empty: { color: colors.textMuted, fontSize: theme.fontSize.md },
  createSessionBtn: {
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  createSessionBtnText: {
    color: colors.primary,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
  chartSubtitle: {
    fontSize: theme.fontSize.xs,
    color: colors.textMuted,
    marginBottom: theme.spacing.sm,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: theme.spacing.md,
    paddingRight: theme.spacing.md,
    gap: 8,
    minHeight: 100,
  },
  chartBarWrap: {
    alignItems: 'center',
    width: 38,
  },
  chartBarWrapActive: {},
  chartBar: {
    width: 26,
    borderRadius: 6,
    backgroundColor: colors.surfaceElevated,
    marginBottom: 6,
    minHeight: 12,
  },
  chartBarFilled: {
    backgroundColor: colors.primary,
  },
  chartLabel: {
    fontSize: 11,
    color: colors.textMuted,
  },
  chartLabelActive: {
    color: colors.text,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statCardWide: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
  },
  statValueSecondary: {
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
    color: colors.text,
    marginTop: 4,
  },
  statLabel: {
    fontSize: theme.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statMeta: {
    fontSize: theme.fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  aboutSection: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  aboutTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: theme.spacing.sm,
  },
  aboutText: {
    fontSize: theme.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  boutiqueTransition: {
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    minHeight: 200,
    backgroundColor: colors.surface,
  },
  boutiqueTransitionImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  boutiqueTransitionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  boutiqueTransitionContent: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    minHeight: 200,
    justifyContent: 'flex-end',
  },
  boutiqueTransitionTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: theme.spacing.sm,
  },
  boutiqueTransitionText: {
    fontSize: theme.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 21,
    marginBottom: theme.spacing.md,
  },
  boutiqueTransitionCta: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: '100%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: theme.spacing.md,
  },
  modalEmpty: {
    color: colors.textMuted,
    marginBottom: theme.spacing.md,
  },
  modalCard: {
    backgroundColor: colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalCardSport: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  modalCardMeta: {
    fontSize: theme.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 4,
  },
  modalClose: {
    marginTop: theme.spacing.md,
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  modalCloseText: {
    color: colors.primary,
    fontWeight: '600',
  },
});
