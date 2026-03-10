import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { theme } from '../theme';
import { mockConversations, mockUsers } from '../data/mockData';
import type { RootStackParamList } from '../navigation/AppNavigator';

export function ChatListScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const getOtherParticipant = (participants: string[]) => {
    const otherId = participants.find((id) => id !== user?.id);
    return mockUsers.find((u) => u.id === otherId);
  };

  const renderItem = ({ item }: { item: typeof mockConversations[0] }) => {
    const other = getOtherParticipant(item.participants);
    if (!other) return null;
    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() => navigation.navigate('Chat', { conversationId: item.id })}
        activeOpacity={0.8}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {other.prenom[0]}
            {other.nom[0]}
          </Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.name}>
            {other.prenom} {other.nom}
          </Text>
          {item.dernierMessage && (
            <Text style={styles.preview} numberOfLines={1}>
              {item.dernierMessage.contenu}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      {mockConversations.length === 0 ? (
        <Text style={styles.empty}>Aucune conversation.</Text>
      ) : (
        <FlatList
          data={mockConversations}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
    padding: theme.spacing.lg,
  },
  list: { padding: theme.spacing.md, paddingBottom: 100 },
  row: {
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  avatarText: { color: '#fff', fontWeight: '600' },
  body: { flex: 1 },
  name: { fontSize: theme.fontSize.md, fontWeight: '600', color: colors.text },
  preview: { fontSize: theme.fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  empty: {
    color: colors.textMuted,
    fontSize: theme.fontSize.md,
    padding: theme.spacing.lg,
  },
});
