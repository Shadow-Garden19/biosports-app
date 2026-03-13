import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { theme } from '../theme';
import { SPORTS_LABELS } from '../types';
import { useConversations } from '../context/ConversationsContext';
import { EmptyState } from '../components/EmptyState';
import { mockUsers } from '../data/mockData';
import type { RootStackParamList } from '../navigation/AppNavigator';

export function ChatListScreen() {
  const { user } = useAuth();
  const { conversations } = useConversations();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchHandle, setSearchHandle] = useState('');

  const handleQuery = searchHandle.trim().replace(/^@/, '').toLowerCase();
  const friendsByHandle = handleQuery.length >= 2
    ? mockUsers.filter((u) => u.id !== user?.id && u.username?.toLowerCase().includes(handleQuery))
    : [];

  const getOtherParticipant = (participants: string[]) => {
    const otherId = participants.find((id) => id !== user?.id);
    return mockUsers.find((u) => u.id === otherId);
  };

  const isGroup = (participants: string[]) => participants.length > 2;

  const renderItem = ({ item }: { item: (typeof conversations)[0] }) => {
    const other = getOtherParticipant(item.participants);
    const group = isGroup(item.participants);
    const displayName = group
      ? `Groupe (${item.participants.length} participants)`
      : other
        ? `${other.prenom} ${other.nom}`
        : 'Chat';
    const initials = group
      ? `${item.participants.length}`
      : other
        ? `${other.prenom[0]}${other.nom[0]}`
        : '?';
    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() => navigation.navigate('Chat', { conversationId: item.id })}
        activeOpacity={0.8}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.name}>{displayName}</Text>
          {item.dernierMessage && (
            <Text style={styles.preview} numberOfLines={1}>
              {item.dernierMessage.contenu}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <>
      <View style={styles.addFriendSection}>
        <Text style={styles.addFriendTitle}>Ajouter un ami</Text>
        <TextInput
          style={styles.handleInput}
          placeholder="@nom_utilisateur"
          placeholderTextColor={colors.textMuted}
          value={searchHandle}
          onChangeText={setSearchHandle}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {friendsByHandle.length > 0 && (
          <View style={styles.handleResults}>
            {friendsByHandle.map((u) => {
              const conv = conversations.find(
                (c) => c.participants.includes(u.id) && user && c.participants.includes(user.id)
              );
              const conversationId = conv?.id ?? 'c1';
              return (
                <TouchableOpacity
                  key={u.id}
                  style={styles.friendRow}
                  onPress={() => navigation.navigate('Chat', { conversationId })}
                >
                  <View style={styles.avatarSmall}>
                    <Text style={styles.avatarText}>
                      {u.prenom[0]}
                      {u.nom[0]}
                    </Text>
                  </View>
                  <View style={styles.friendInfo}>
                    <Text style={styles.name}>{u.prenom} {u.nom}</Text>
                    <Text style={styles.userHandle}>@{u.username}</Text>
                    <Text style={styles.friendSports}>
                      {u.sports.map((s) => SPORTS_LABELS[s.sportId]).join(', ')}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        {handleQuery.length >= 2 && friendsByHandle.length === 0 && (
          <Text style={styles.noResult}>Aucun utilisateur trouvé pour @{handleQuery}</Text>
        )}
      </View>
      <Text style={styles.sectionTitle}>Conversations</Text>
    </>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      {conversations.length === 0 ? (
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
          {renderHeader()}
          <EmptyState
            icon="chatbubbles-outline"
            title="Aucune conversation"
            message="Recherchez des sessions et contactez les organisateurs, ou ajoutez un ami par son @nom_utilisateur ci-dessus."
            actionLabel="Voir les sessions"
            onAction={() => (navigation.getParent() as any)?.navigate('Search')}
          />
        </ScrollView>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
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
  list: { flex: 1 },
  listContent: { padding: theme.spacing.md, paddingBottom: 100 },
  addFriendSection: {
    backgroundColor: colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addFriendTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: theme.spacing.sm,
  },
  handleInput: {
    backgroundColor: colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  handleResults: { marginTop: theme.spacing.md },
  friendRow: {
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
  friendInfo: { flex: 1 },
  userHandle: { fontSize: theme.fontSize.sm, color: colors.primary, marginTop: 2 },
  friendSports: { fontSize: theme.fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  noResult: { fontSize: theme.fontSize.sm, color: colors.textMuted, marginTop: theme.spacing.sm },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: theme.spacing.sm,
  },
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
});
