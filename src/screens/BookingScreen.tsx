import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { colors } from '../theme/colors';
import { theme } from '../theme';
import { mockLieux } from '../data/mockData';

export function BookingScreen({
  lieuId,
  sessionId,
  onConfirm,
  onBack,
}: {
  lieuId: string;
  sessionId?: string;
  onConfirm?: () => void;
  onBack: () => void;
}) {
  const lieu = mockLieux.find((l) => l.id === lieuId);
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

  const partParJoueur = (lieu.prixHoraire / 2).toFixed(2);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={onBack} style={styles.back}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Réservation</Text>
      <View style={styles.card}>
        <Text style={styles.lieuName}>{lieu.nom}</Text>
        <Text style={styles.lieuAddress}>{lieu.adresse}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Prix total (1h)</Text>
          <Text style={styles.priceValue}>{lieu.prixHoraire} €</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Votre part (divisée entre joueurs)</Text>
          <Text style={styles.priceHighlight}>{partParJoueur} €</Text>
        </View>
      </View>

      <Text style={styles.info}>
        Le paiement sera divisé automatiquement. Chaque joueur paie sa part dans
        l'application ; BIOSPORTS reverse ensuite la somme au club partenaire.
      </Text>

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => {
          if (Platform.OS === 'web') {
            // Sur le web, Alert.alert ne s'affiche pas correctement → on confirme directement
            const ok = typeof window !== 'undefined' && window.confirm(
              'Réservation confirmée. Votre réservation a bien été enregistrée. Vous recevrez un rappel avant la session. OK pour continuer ?'
            );
            if (ok) onConfirm?.();
          } else {
            Alert.alert(
              'Réservation confirmée',
              'Votre réservation a bien été enregistrée. Vous recevrez un rappel avant la session.',
              [{ text: 'OK', onPress: onConfirm }]
            );
          }
        }}
      >
        <Text style={styles.confirmButtonText}>Payer et réserver</Text>
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
    marginBottom: theme.spacing.lg,
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
  confirmButtonText: { color: '#fff', fontWeight: '600', fontSize: theme.fontSize.md },
});
