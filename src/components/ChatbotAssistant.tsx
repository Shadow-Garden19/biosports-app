import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useChatbot } from '../context/ChatbotContext';
import { colors } from '../theme/colors';
import { theme } from '../theme';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { SportId } from '../types';

/** Équipement suggéré par sport pour le message du chatbot */
const EQUIPMENT_BY_SPORT: Record<SportId, string[]> = {
  tennis: ['balles de tennis', 'raquette', 'gourde'],
  padel: ['balles de padel', 'raquette padel', 'gourde'],
  basketball: ['ballon', 'chaussures', 'gourde'],
  football: ['ballon', 'chaussures', 'gourde'],
  badminton: ['volant', 'raquette', 'gourde'],
  squash: ['balles de squash', 'raquette', 'gourde'],
  volleyball: ['ballon', 'gourde'],
  running: ['gourde', 'tenue adaptée'],
  musculation: ['gourde', 'serviette'],
  autre: ['gourde', 'équipement adapté'],
};

export function ChatbotAssistant() {
  const { pendingMessage, dismissChatbot } = useChatbot();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();

  const hasPendingMessage = !!pendingMessage;

  const equipmentList =
    pendingMessage && EQUIPMENT_BY_SPORT[pendingMessage.sportId]
      ? EQUIPMENT_BY_SPORT[pendingMessage.sportId]
      : ['gourde', 'équipement adapté'];
  const equipmentText = equipmentList.join(', ');

  const goToBoutique = () => {
    dismissChatbot();
    navigation.navigate('Main', { screen: 'Boutique' });
  };

  const handleDismiss = () => {
    dismissChatbot();
  };

  const bottomOffset = Platform.OS === 'web' ? 62 : 128;

  return (
    <View style={[styles.anchor, { bottom: bottomOffset }]} pointerEvents="box-none">
      {/* Trait → Bulle : même zone en bas à droite. Quand message : bulle ; sinon : petit trait */}
      {hasPendingMessage ? (
        <View style={styles.bubbleContainer}>
          <View style={[styles.bubble, { maxWidth: width - 32 }]}>
            <View style={styles.bubbleHeader}>
              <View style={styles.botAvatar}>
                <Ionicons name="fitness" size={20} color={colors.background} />
              </View>
              <Text style={styles.bubbleTitle}>Assistant BIOSPORTS</Text>
            </View>
            <Text style={styles.bubbleMessage}>
              Vous avez réservé une session <Text style={styles.sportHighlight}>{pendingMessage.sportLabel}</Text>.
              Avez-vous tout le nécessaire ? Par exemple : {equipmentText}.
            </Text>
            <View style={styles.bubbleActions}>
              <TouchableOpacity style={styles.btnSecondary} onPress={handleDismiss} activeOpacity={0.8}>
                <Text style={styles.btnSecondaryText}>Oui, j'ai tout</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnPrimary} onPress={goToBoutique} activeOpacity={0.8}>
                <Text style={styles.btnPrimaryText}>Voir la boutique</Text>
                <Ionicons name="bag-outline" size={18} color={colors.background} />
              </TouchableOpacity>
            </View>
            <View style={styles.bubbleArrow} />
          </View>
        </View>
      ) : (
        <View style={styles.traitContainer}>
          <View style={styles.trait} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: {
    position: 'absolute',
    right: 0,
    left: 0,
    alignItems: 'flex-end',
    zIndex: 999,
  },
  bubbleContainer: {
    paddingRight: 12,
    paddingBottom: 0,
    alignItems: 'flex-end',
  },
  bubble: {
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bubbleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  bubbleTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: colors.text,
  },
  bubbleMessage: {
    fontSize: theme.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  sportHighlight: {
    color: colors.primary,
    fontWeight: '600',
  },
  bubbleActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
  },
  btnSecondary: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnSecondaryText: {
    fontSize: theme.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: colors.primary,
  },
  btnPrimaryText: {
    fontSize: theme.fontSize.sm,
    color: colors.background,
    fontWeight: '600',
  },
  bubbleArrow: {
    position: 'absolute',
    bottom: -8,
    right: 24,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.surface,
  },
  traitContainer: {
    marginRight: 0,
    width: 6,
    height: 22,
    justifyContent: 'flex-end',
  },
  trait: {
    width: 6,
    height: 22,
    backgroundColor: colors.primary,
    borderRadius: 2,
    opacity: 0.9,
  },
});
