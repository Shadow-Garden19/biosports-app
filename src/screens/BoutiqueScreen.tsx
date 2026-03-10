import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { ACCESSOIRE_CATEGORY_LABELS } from '../types';
import type { AccessoireCategory, Accessoire } from '../types';
import { mockAccessoires } from '../data/mockData';
import { Logo } from '../components/Logo';
import { getAccessoireImageSource } from '../constants/images';
import type { RootStackParamList } from '../navigation/AppNavigator';

const CATEGORIES: AccessoireCategory[] = [
  'raquettes',
  'balles',
  'gourdes',
  'sacs',
  'textiles',
  'autre',
];

export function BoutiqueScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [category, setCategory] = useState<AccessoireCategory | null>(null);
  const { width } = useWindowDimensions();
  const cardWidth = width > 400 ? (width - 48) / 2 - 8 : (width - 32) / 2 - 6;

  const filtered =
    category == null
      ? mockAccessoires
      : mockAccessoires.filter((a) => a.categorie === category);

  const handleAcheter = (item: Accessoire) => {
    navigation.navigate('Achat', { productId: item.id });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Logo size="small" showSlogan={false} />
        <Text style={styles.title}>Boutique</Text>
        <Text style={styles.subtitle}>Raquettes, balles, gourdes & plus</Text>
      </View>

      <Text style={styles.sectionTitle}>Catégories</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
      >
        <TouchableOpacity
          style={[styles.chip, category === null && styles.chipSelected]}
          onPress={() => setCategory(null)}
        >
          <Text style={[styles.chipText, category === null && styles.chipTextSelected]}>
            Toutes
          </Text>
        </TouchableOpacity>
        {CATEGORIES.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.chip, category === c && styles.chipSelected]}
            onPress={() => setCategory(c)}
          >
            <Text style={[styles.chipText, category === c && styles.chipTextSelected]}>
              {ACCESSOIRE_CATEGORY_LABELS[c]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Accessoires</Text>
      {filtered.length === 0 ? (
        <Text style={styles.empty}>Aucun accessoire dans cette catégorie.</Text>
      ) : (
        <View style={styles.grid}>
          {filtered.map((item) => (
            <View key={item.id} style={[styles.card, { width: cardWidth }]}>
              <Image
                source={getAccessoireImageSource(item.imageUrl)}
                style={styles.image}
                resizeMode="cover"
              />
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.nom}
              </Text>
              <Text style={styles.cardPrice}>{item.prix.toFixed(2)} €</Text>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => handleAcheter(item)}
                activeOpacity={0.8}
              >
                <Text style={styles.btnText}>Acheter</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  chipsRow: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row',
    paddingBottom: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  chipTextSelected: {
    color: colors.background,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: colors.surfaceElevated,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    paddingHorizontal: 10,
    paddingTop: 4,
  },
  btn: {
    marginHorizontal: 10,
    marginTop: 8,
    marginBottom: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  btnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.background,
  },
  empty: {
    fontSize: 14,
    color: colors.textMuted,
    marginHorizontal: 20,
    marginTop: 8,
  },
});
