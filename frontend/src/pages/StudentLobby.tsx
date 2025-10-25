import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../contexts/SessionContext';

interface Session {
  sessionId: string;
  teacherId: string;
  storyId: string;
  mode: 'teacher_story' | 'free_time';
  studentCount: number;
  createdAt: string;
}

export const StudentLobby: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState('');
  const { joinSession, isConnected, sessionId: currentSessionId } = useSession();
  const navigate = useNavigate();

  // Fetch active sessions
  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/classroom/sessions');
      const data = await response.json();
      
      if (data.success) {
        setSessions(data.sessions);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSession = async (sessionId: string) => {
    try {
      const response = await fetch('http://localhost:8080/api/classroom/join-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          studentName: studentName || undefined
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Store session in context (persists in localStorage)
        joinSession(data.sessionId, data.studentId);
        
        // Navigate to reading page
        navigate('/reading');
      }
    } catch (error) {
      console.error('Error joining session:', error);
    }
  };

  const handleDisconnect = () => {
    navigate('/reading');
  };

  if (isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Already Connected</h1>
          <p className="text-gray-600 mb-6">
            You are currently connected to session: <span className="font-bold">{currentSessionId}</span>
          </p>
          <button
            onClick={handleDisconnect}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Reading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8 mt-8">
          Join a Classroom Session
        </h1>

        {/* Student Name Input */}
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <label className="block text-gray-700 font-bold mb-2">
            Your Name (Optional)
          </label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Enter your name..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Active Sessions */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Active Sessions</h2>
          
          {loading ? (
            <p className="text-gray-600">Loading sessions...</p>
          ) : sessions.length === 0 ? (
            <p className="text-gray-600">No active sessions available. Ask your teacher to create one!</p>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.sessionId}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Session: {session.sessionId}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Teacher: {session.teacherId}
                      </p>
                      <p className="text-sm text-gray-600">
                        Mode: {session.mode === 'teacher_story' ? 'Teacher Story' : 'Free Time'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {session.studentCount} {session.studentCount === 1 ? 'student' : 'students'} connected
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleJoinSession(session.sessionId)}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors mt-2"
                  >
                    Join Session
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-800 bg-opacity-50 rounded-lg shadow-xl p-6 mt-6 text-white">
          <h3 className="text-lg font-bold mb-2">How to Join:</h3>
          <ol className="list-decimal list-inside space-y-1">
            <li>Optionally enter your name above</li>
            <li>Choose a session from the list</li>
            <li>Click "Join Session" to connect</li>
            <li>You'll be taken to the reading page automatically</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default StudentLobby;