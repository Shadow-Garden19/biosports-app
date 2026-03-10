import React, { createContext, useContext, useState, useCallback } from 'react';
import type { SessionSportive } from '../types';
import { mockSessions } from '../data/mockData';

interface SessionsContextType {
  sessions: SessionSportive[];
  addSession: (session: Omit<SessionSportive, 'id' | 'createdAt'>) => void;
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

  return (
    <SessionsContext.Provider value={{ sessions, addSession }}>
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
