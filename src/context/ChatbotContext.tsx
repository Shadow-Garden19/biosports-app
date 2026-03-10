import React, { createContext, useContext, useState, useCallback } from 'react';
import type { SportId } from '../types';

export interface PendingReservationMessage {
  sessionId: string;
  sportId: SportId;
  sportLabel: string;
}

interface ChatbotContextType {
  /** Message en attente après une réservation (affiche la bulle du chatbot) */
  pendingMessage: PendingReservationMessage | null;
  /** Déclencher l’affichage du chatbot après une réservation */
  triggerAfterReservation: (sessionId: string, sportId: SportId, sportLabel: string) => void;
  /** Fermer / ignorer le message (utilisateur a tout le matériel ou a fermé) */
  dismissChatbot: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export function ChatbotProvider({ children }: { children: React.ReactNode }) {
  const [pendingMessage, setPendingMessage] = useState<PendingReservationMessage | null>(null);

  const triggerAfterReservation = useCallback(
    (sessionId: string, sportId: SportId, sportLabel: string) => {
      setPendingMessage({ sessionId, sportId, sportLabel });
    },
    []
  );

  const dismissChatbot = useCallback(() => {
    setPendingMessage(null);
  }, []);

  return (
    <ChatbotContext.Provider
      value={{ pendingMessage, triggerAfterReservation, dismissChatbot }}
    >
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const ctx = useContext(ChatbotContext);
  if (ctx === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return ctx;
}
