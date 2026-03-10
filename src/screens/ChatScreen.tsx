import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { theme } from '../theme';
import { mockMessages, mockUsers, mockConversations } from '../data/mockData';

export function ChatScreen({
  conversationId,
  onBack,
}: {
  conversationId: string;
  onBack: () => void;
}) {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const baseMessages = mockMessages[conversationId] ?? [];
  const [localMessages, setLocalMessages] = useState<typeof baseMessages>([]);
  const messages = [...baseMessages, ...localMessages];

  const conv = mockConversations.find((c) => c.id === conversationId);
  const otherId = conv?.participants.find((id) => id !== user?.id);
  const other = mockUsers.find((u) => u.id === otherId);

  const handleSend = () => {
    if (!input.trim() || !user) return;
    const newMsg = {
      id: `local-${Date.now()}`,
      conversationId,
      expediteurId: user.id,
      contenu: input.trim(),
      createdAt: new Date().toISOString(),
      lu: false,
    };
    setLocalMessages((prev) => [...prev, newMsg]);
    setInput('');
  };

  const renderMessage = ({ item }: { item: (typeof messages)[0] }) => {
    const isMe = item.expediteurId === user?.id;
    return (
      <View style={[styles.messageRow, isMe && styles.messageRowMe]}>
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
          <Text style={[styles.bubbleText, isMe && styles.bubbleTextMe]}>
            {item.contenu}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {other ? `${other.prenom} ${other.nom}` : 'Chat'}
        </Text>
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messages}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Votre message..."
          placeholderTextColor={colors.textMuted}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendText}>Envoyer</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backText: { color: colors.primary, fontSize: theme.fontSize.md, marginRight: theme.spacing.md },
  headerTitle: { fontSize: theme.fontSize.lg, fontWeight: '600', color: colors.text },
  messages: { padding: theme.spacing.md, paddingBottom: theme.spacing.md },
  messageRow: { marginBottom: theme.spacing.sm, alignItems: 'flex-start' },
  messageRowMe: { alignItems: 'flex-end' },
  bubble: {
    maxWidth: '80%',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bubbleMe: { backgroundColor: colors.primary },
  bubbleText: { color: colors.text },
  bubbleTextMe: { color: '#fff' },
  inputRow: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: colors.text,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: 'center',
  },
  sendText: { color: '#fff', fontWeight: '600' },
});
