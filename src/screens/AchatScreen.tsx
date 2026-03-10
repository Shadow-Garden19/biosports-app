import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors } from '../theme/colors';
import { theme } from '../theme';
import type { Accessoire } from '../types';
import { getAccessoireImageSource } from '../constants/images';

export function AchatScreen({
  product,
  onBack,
  onSuccess,
}: {
  product: Accessoire | null;
  onBack: () => void;
  onSuccess?: () => void;
}) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [loading, setLoading] = useState(false);

  if (!product) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={onBack} style={styles.back}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.empty}>Article introuvable.</Text>
      </View>
    );
  }

  const handlePayer = () => {
    if (!cardNumber.trim() || !expiry.trim() || !cvc.trim()) {
      Alert.alert('Champs manquants', 'Veuillez remplir tous les champs de paiement.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Paiement accepté',
        `Merci ! Votre commande (${product.nom}) a bien été enregistrée. Vous recevrez un email de confirmation.`,
        [{ text: 'OK', onPress: onSuccess }]
      );
    }, 600);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity onPress={onBack} style={styles.back}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Finaliser l'achat</Text>

        <View style={styles.productCard}>
          <Image
            source={getAccessoireImageSource(product.imageUrl)}
            style={styles.productImage}
            resizeMode="cover"
          />
          {product.imageUrl2 != null && (
            <Image
              source={getAccessoireImageSource(product.imageUrl2)}
              style={styles.productImageSecond}
              resizeMode="cover"
            />
          )}
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.nom}</Text>
            <Text style={styles.productDesc}>{product.description}</Text>
            <Text style={styles.productPrice}>{product.prix.toFixed(2)} €</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Paiement</Text>
        <View style={styles.form}>
          <Text style={styles.label}>Numéro de carte</Text>
          <TextInput
            style={styles.input}
            placeholder="4242 4242 4242 4242"
            placeholderTextColor={colors.textMuted}
            value={cardNumber}
            onChangeText={setCardNumber}
            keyboardType="number-pad"
            maxLength={19}
          />
          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.label}>Date d'expiration</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/AA"
                placeholderTextColor={colors.textMuted}
                value={expiry}
                onChangeText={setExpiry}
                keyboardType="number-pad"
                maxLength={5}
              />
            </View>
            <View style={styles.half}>
              <Text style={styles.label}>CVC</Text>
              <TextInput
                style={styles.input}
                placeholder="123"
                placeholderTextColor={colors.textMuted}
                value={cvc}
                onChangeText={setCvc}
                keyboardType="number-pad"
                maxLength={4}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.payButton, loading && styles.payButtonDisabled]}
          onPress={handlePayer}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.payButtonText}>
            {loading ? 'Traitement...' : `Payer ${product.prix.toFixed(2)} €`}
          </Text>
        </TouchableOpacity>

        <Text style={styles.secure}>
          Paiement sécurisé. Vos données sont protégées.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: { flex: 1 },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: 48,
  },
  back: { marginBottom: theme.spacing.md },
  backText: { color: colors.primary, fontSize: theme.fontSize.md },
  empty: { color: colors.textMuted, padding: theme.spacing.lg },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: theme.spacing.lg,
  },
  productCard: {
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  productImage: {
    width: '100%',
    height: 200,
    backgroundColor: colors.surfaceElevated,
  },
  productImageSecond: {
    width: '100%',
    height: 200,
    backgroundColor: colors.surfaceElevated,
    marginTop: 4,
  },
  productInfo: {
    padding: theme.spacing.lg,
  },
  productName: {
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
    color: colors.text,
  },
  productDesc: {
    fontSize: theme.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 4,
  },
  productPrice: {
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: theme.spacing.md,
  },
  form: { marginBottom: theme.spacing.lg },
  label: {
    fontSize: theme.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: theme.fontSize.md,
    color: colors.text,
    marginBottom: theme.spacing.md,
  },
  row: { flexDirection: 'row', gap: theme.spacing.md },
  half: { flex: 1 },
  payButton: {
    backgroundColor: colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  payButtonDisabled: { opacity: 0.7 },
  payButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: '700',
    color: colors.background,
  },
  secure: {
    fontSize: theme.fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
});
