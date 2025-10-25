import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

interface SessionContextType {
  sessionId: string | null;
  studentId: string | null;
  isConnected: boolean;
  joinSession: (sessionId: string, studentId?: string, studentName?: string) => Promise<void>;
  leaveSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

const SESSION_STORAGE_KEY = 'classroom_session';

interface SessionData {
  sessionId: string;
  studentId: string;
}

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Load session from localStorage on mount
  useEffect(() => {
    const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
    if (storedSession) {
      try {
        const sessionData: SessionData = JSON.parse(storedSession);
        setSessionId(sessionData.sessionId);
        setStudentId(sessionData.studentId);
        setIsConnected(true);
        console.log('[SessionContext] Restored session from localStorage:', sessionData);
      } catch (error) {
        console.error('[SessionContext] Failed to parse stored session:', error);
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }
  }, []);

  const joinSession = async (newSessionId: string, providedStudentId?: string, studentName?: string) => {
    try {
      console.log('[SessionContext] Joining session:', newSessionId, 'with studentId:', providedStudentId);

      let finalStudentId: string;

      // If studentId is already provided (from StudentLobby), skip backend request
      // The join request was already made in StudentLobby
      if (providedStudentId) {
        finalStudentId = providedStudentId;
        console.log('[SessionContext] Using existing studentId:', finalStudentId);
      } else {
        // Make backend request to join session (will generate new studentId)
        const response = await fetch(`${API_BASE_URL}/classroom/join-session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: newSessionId,
            studentName: studentName || undefined
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to join session: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to join session');
        }

        finalStudentId = data.studentId;
        console.log('[SessionContext] Backend registration successful, studentId:', finalStudentId);
      }

      const sessionData: SessionData = {
        sessionId: newSessionId,
        studentId: finalStudentId
      };

      // Save to localStorage
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));

      // Update state
      setSessionId(newSessionId);
      setStudentId(finalStudentId);
      setIsConnected(true);

      console.log('[SessionContext] Joined session:', sessionData);
    } catch (error) {
      console.error('[SessionContext] Error joining session:', error);
      throw error;
    }
  };

  const leaveSession = () => {
    // Remove from localStorage
    localStorage.removeItem(SESSION_STORAGE_KEY);
    
    // Clear state
    setSessionId(null);
    setStudentId(null);
    setIsConnected(false);
    
    console.log('[SessionContext] Left session');
  };

  return (
    <SessionContext.Provider
      value={{
        sessionId,
        studentId,
        isConnected,
        joinSession,
        leaveSession
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};