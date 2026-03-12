import React, { useState, useRef, useEffect } from 'react';
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
import { useConversations } from '../context/ConversationsContext';
import { colors } from '../theme/colors';
import { theme } from '../theme';
import { mockUsers } from '../data/mockData';

export function ChatScreen({
  conversationId,
  onBack,
  onCreateSession,
}: {
  conversationId: string;
  onBack: () => void;
  onCreateSession?: () => void;
}) {
  const { user } = useAuth();
  const { conversations, getMessages, addMessage } = useConversations();
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList>(null);
  const rawMessages = getMessages(conversationId);
  const messages = [...rawMessages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const conv = conversations.find((c) => c.id === conversationId);
  const isGroup = (conv?.participants.length ?? 0) > 2;
  const otherId = conv?.participants.find((id) => id !== user?.id);
  const other = mockUsers.find((u) => u.id === otherId);
  const headerTitle = isGroup
    ? `Groupe (${conv!.participants.length} participants)`
    : other
      ? `${other.prenom} ${other.nom}`
      : 'Chat';

  const getSenderName = (expediteurId: string) => {
    if (expediteurId === user?.id) return 'Vous';
    const u = mockUsers.find((x) => x.id === expediteurId);
    return u ? `${u.prenom} ${u.nom}` : 'Inconnu';
  };

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
    addMessage(conversationId, newMsg);
    setInput('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  useEffect(() => {
    const t = setTimeout(() => listRef.current?.scrollToEnd({ animated: false }), 200);
    return () => clearTimeout(t);
  }, [conversationId]);

  const renderMessage = ({ item }: { item: (typeof messages)[0] }) => {
    const isMe = item.expediteurId === user?.id;
    return (
      <View style={[styles.messageRow, isMe && styles.messageRowMe]}>
        {isGroup && (
          <Text style={[styles.senderName, isMe && styles.senderNameMe]}>{getSenderName(item.expediteurId)}</Text>
        )}
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
        <Text style={styles.headerTitle}>{headerTitle}</Text>
      </View>
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messages}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
      />
      {onCreateSession && (
        <TouchableOpacity style={styles.createSessionBtn} onPress={onCreateSession} activeOpacity={0.8}>
          <Text style={styles.createSessionBtnText}>+ Créer une session</Text>
        </TouchableOpacity>
      )}
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
  createSessionBtn: {
    backgroundColor: colors.primary,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  createSessionBtnText: { color: '#fff', fontWeight: '600', fontSize: theme.fontSize.sm },
  messages: { padding: theme.spacing.md, paddingBottom: theme.spacing.md },
  messageRow: { marginBottom: theme.spacing.sm, alignItems: 'flex-start' },
  messageRowMe: { alignItems: 'flex-end' },
  senderName: {
    fontSize: theme.fontSize.xs,
    color: colors.textMuted,
    marginBottom: 2,
    marginLeft: theme.spacing.sm,
  },
  senderNameMe: { marginLeft: 0, marginRight: theme.spacing.sm, textAlign: 'right' },
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
