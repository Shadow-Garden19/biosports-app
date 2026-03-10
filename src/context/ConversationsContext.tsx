import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Conversation, Message } from '../types';
import { mockConversations, mockMessages } from '../data/mockData';

interface ConversationsContextType {
  conversations: Conversation[];
  addConversation: (conversation: Conversation) => void;
  updateConversationParticipants: (conversationId: string, participantIds: string[]) => void;
  getMessages: (conversationId: string) => Message[];
  addMessage: (conversationId: string, message: Message) => void;
}

const ConversationsContext = createContext<ConversationsContextType | undefined>(undefined);

export function ConversationsProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [messagesByConversation, setMessagesByConversation] = useState<Record<string, Message[]>>(mockMessages);

  const addConversation = useCallback((conversation: Conversation) => {
    setConversations((prev) => {
      if (prev.some((c) => c.id === conversation.id)) return prev;
      return [conversation, ...prev];
    });
    setMessagesByConversation((prev) => {
      if (prev[conversation.id]) return prev;
      return { ...prev, [conversation.id]: [] };
    });
  }, []);

  const updateConversationParticipants = useCallback((conversationId: string, participantIds: string[]) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, participants: participantIds } : c))
    );
  }, []);

  const getMessages = useCallback(
    (conversationId: string): Message[] => {
      return messagesByConversation[conversationId] ?? [];
    },
    [messagesByConversation]
  );

  const addMessage = useCallback((conversationId: string, message: Message) => {
    setMessagesByConversation((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] ?? []), message],
    }));
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId ? { ...c, dernierMessage: message } : c
      )
    );
  }, []);

  return (
    <ConversationsContext.Provider
      value={{
        conversations,
        addConversation,
        updateConversationParticipants,
        getMessages,
        addMessage,
      }}
    >
      {children}
    </ConversationsContext.Provider>
  );
}

export function useConversations() {
  const ctx = useContext(ConversationsContext);
  if (ctx === undefined) {
    throw new Error('useConversations must be used within ConversationsProvider');
  }
  return ctx;
}
