import React, { createContext, useContext, useState, useCallback } from 'react';
import type { SessionSportive } from '../types';
import { mockSessions } from '../data/mockData';

interface SessionsContextType {
  sessions: SessionSportive[];
  addSession: (session: Omit<SessionSportive, 'id' | 'createdAt'>) => void;
  removeSession: (sessionId: string) => void;
  updateSession: (sessionId: string, updates: Partial<SessionSportive>) => void;
  addParticipant: (sessionId: string, userId: string) => void;
  removeParticipant: (sessionId: string, userId: string) => void;
  setCanInvite: (sessionId: string, userId: string, canInvite: boolean) => void;
}

const SessionsContext = createContext<SessionsContextType | undefined>(undefined);

export function SessionsProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<SessionSportive[]>(mockSessions);

  const addSession = useCallback((session: Omit<SessionSportive, 'id' | 'createdAt'>) => {
    const newSession: SessionSportive = {
      ...session,
      id: 's' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setSessions((prev) => [newSession, ...prev]);
  }, []);

  const removeSession = useCallback((sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  }, []);

  const updateSession = useCallback((sessionId: string, updates: Partial<SessionSportive>) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, ...updates } : s))
    );
  }, []);

  const addParticipant = useCallback((sessionId: string, userId: string) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId || s.participantsIds.includes(userId)) return s;
        return { ...s, participantsIds: [...s.participantsIds, userId] };
      })
    );
  }, []);

  const removeParticipant = useCallback((sessionId: string, userId: string) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        const canInviteIds = (s.canInviteIds ?? []).filter((id) => id !== userId);
        return {
          ...s,
          participantsIds: s.participantsIds.filter((id) => id !== userId),
          canInviteIds: canInviteIds.length ? canInviteIds : undefined,
        };
      })
    );
  }, []);

  const setCanInvite = useCallback((sessionId: string, userId: string, canInvite: boolean) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        const current = s.canInviteIds ?? [];
        const has = current.includes(userId);
        if (canInvite && !has)
          return { ...s, canInviteIds: [...current, userId] };
        if (!canInvite && has)
          return { ...s, canInviteIds: current.filter((id) => id !== userId) };
        return s;
      })
    );
  }, []);

  return (
    <SessionsContext.Provider
      value={{
        sessions,
        addSession,
        removeSession,
        updateSession,
        addParticipant,
        removeParticipant,
        setCanInvite,
      }}
    >
      {children}
    </SessionsContext.Provider>
  );
}

export function useSessions() {
  const ctx = useContext(SessionsContext);
  if (ctx === undefined) {
    throw new Error('useSessions must be used within a SessionsProvider');
  }
  return ctx;
}
