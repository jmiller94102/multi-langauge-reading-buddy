import React from 'react';
import { useSession } from '@/contexts/SessionContext';
import { useNavigate } from 'react-router-dom';

export const SessionIndicator: React.FC = () => {
  const { sessionId, studentId, isConnected, leaveSession } = useSession();
  const navigate = useNavigate();

  if (!isConnected) {
    return null;
  }

  const handleDisconnect = () => {
    leaveSession();
    navigate('/lobby');
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-green-600 text-white rounded-lg shadow-lg p-3 flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <div>
          <p className="text-xs font-bold">Connected to Session</p>
          <p className="text-[10px]">{sessionId} • {studentId}</p>
        </div>
      </div>
      <button
        onClick={handleDisconnect}
        className="bg-white text-green-700 text-xs font-semibold px-3 py-1 rounded hover:bg-gray-100 transition-colors"
      >
        Disconnect
      </button>
    </div>
  );
};

export default SessionIndicator;