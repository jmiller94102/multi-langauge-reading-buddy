/**
 * TeacherDashboard Page
 * Real-time classroom monitoring dashboard for teachers
 */

import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { StudentCard } from '@/components/dashboard/StudentCard';
import { Button } from '@/components/common/Button';
import { useClassroomSSE } from '@/hooks/useClassroomSSE';
import { classroomTeacherService } from '@/services/classroom-teacher.service';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/contexts/ToastContext';
import type { ClassroomSessionMetadata } from '@/types/classroom';
import { StoryPromptInput } from '@/components/reading/StoryPromptInput';
import { StorySettings } from '@/components/reading/StorySettings';
import { LanguageSettings } from '@/components/reading/LanguageSettings';
import { StoryDisplay } from '@/components/reading/StoryDisplay';
import { generateStory, generateQuiz } from '@/services/azureOpenAI';
import type { StorySettings as StorySettingsType, LanguageSettings as LanguageSettingsType, Story } from '@/types/story';
import type { Quiz } from '@/types/quiz';
import { defaultStorySettings, defaultLanguageSettings } from '@/types/story';
import { defaultQuizSettings } from '@/types/quiz';

type TeacherStoryState = 'none' | 'input' | 'generating' | 'generated';

export const TeacherDashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user } = useUser();
  const { showToast } = useToast();
  
  // Session state
  const [sessionId, setSessionId] = useState<string | null>(searchParams.get('sessionId'));
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSessionMode, setCurrentSessionMode] = useState<'teacher_story' | 'free_time'>('free_time');

  // Session creation form
  const [classroomId, setClassroomId] = useState<string>('');
  const [newSessionId, setNewSessionId] = useState<string>('');
  const [storyId, setStoryId] = useState<string>('');
  const [studentIds, setStudentIds] = useState<string>('');
  const [sessionMode, setSessionMode] = useState<'teacher_story' | 'free_time'>('free_time');

  // Teacher story generation state
  const [teacherStoryState, setTeacherStoryState] = useState<TeacherStoryState>('none');
  const [storySettings, setStorySettings] = useState<StorySettingsType>(defaultStorySettings);
  const [languageSettings, setLanguageSettings] = useState<LanguageSettingsType>(defaultLanguageSettings);
  const [teacherStory, setTeacherStory] = useState<Story | null>(null);
  const [teacherQuiz, setTeacherQuiz] = useState<Quiz | null>(null);

  // Connect to SSE for real-time updates
  const { students, isConnected, error: sseError } = useClassroomSSE({
    sessionId: sessionId || undefined,
    enabled: !!sessionId,
  });

  // Handle session creation
  const handleCreateSession = async () => {
    if (!newSessionId) {
      setError('Session ID is required');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/classroom/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: newSessionId,
          teacherId: user.id,
          storyId: storyId || 'default-story',
          mode: sessionMode
        })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create session');
      }

      setSessionId(data.sessionId);
      setCurrentSessionMode(sessionMode);
      
      // Initialize teacher story state based on mode
      if (sessionMode === 'teacher_story') {
        setTeacherStoryState('input');
      }
      
      // Update URL with sessionId
      const url = new URL(window.location.href);
      url.searchParams.set('sessionId', data.sessionId);
      window.history.pushState({}, '', url.toString());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create session');
    } finally {
      setIsCreating(false);
    }
  };

  // Handle teacher story generation
  const handlePromptChange = (prompt: string) => {
    setStorySettings({ ...storySettings, prompt });
  };

  const handleGenerateTeacherStory = async () => {
    setError(null);
    setTeacherStoryState('generating');

    try {
      // Generate story
      const generatedStory = await generateStory(storySettings, languageSettings);
      setTeacherStory(generatedStory);

      // Generate quiz
      const generatedQuiz = await generateQuiz(generatedStory, defaultQuizSettings);
      setTeacherQuiz(generatedQuiz);

      // Send story to backend for distribution
      if (sessionId) {
        const response = await fetch('http://localhost:8080/api/classroom/set-story', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            story: generatedStory,
            quiz: generatedQuiz
          })
        });

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to set story');
        }
      }

      setTeacherStoryState('generated');
      showToast('Story generated and shared with students', 'success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate story');
      setTeacherStoryState('input');
    }
  };

  const handleNewTeacherStory = () => {
    setTeacherStory(null);
    setTeacherQuiz(null);
    setTeacherStoryState('input');
    setError(null);
  };

  // Handle session end
  const handleEndSession = async () => {
    if (!sessionId) return;

    try {
      await classroomTeacherService.endSession(sessionId);
      setSessionId(null);
      
      // Clear sessionId from URL
      const url = new URL(window.location.href);
      url.searchParams.delete('sessionId');
      window.history.pushState({}, '', url.toString());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to end session');
    }
  };

  // Generate student URL for sharing
  const generateStudentURL = (studentId: string) => {
    if (!sessionId) return '';
    return classroomTeacherService.generateStudentURL(sessionId, studentId, storyId);
  };

  // Copy student URL to clipboard
  const copyStudentURL = (studentId: string) => {
    const url = generateStudentURL(studentId);
    navigator.clipboard.writeText(url);
  };

  // Sort students by status priority (stuck > idle > reading > completed)
  const sortedStudents = [...students].sort((a, b) => {
    const priority = { stuck: 0, idle: 1, reading: 2, completed: 3 };
    return priority[a.status] - priority[b.status];
  });

  return (
    <PageLayout>
      <div className="space-y-3">
        {/* Page Header */}
        <div className="card py-3 px-4">
          <h1 className="text-child-lg font-bold text-gray-900 mb-1">
            Teacher Dashboard - Live Classroom Monitoring
          </h1>
          <p className="text-[11px] text-gray-600">
            Monitor student reading progress in real-time
          </p>
        </div>

        {/* Session Creation Form */}
        {!sessionId && (
          <div className="card py-4 px-4 space-y-3">
            <h2 className="text-child-base font-bold text-gray-900">Create Classroom Session</h2>
            
            <div className="space-y-2">
              <div>
                <label className="text-[11px] font-semibold text-gray-700 block mb-1">
                  Session ID *
                </label>
                <input
                  type="text"
                  value={newSessionId}
                  onChange={(e) => setNewSessionId(e.target.value)}
                  placeholder="e.g., session-monday-reading"
                  className="w-full px-3 py-2 text-child-sm border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-700 block mb-1">
                  Session Mode *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSessionMode('free_time')}
                    className={`py-2 px-3 rounded-lg font-semibold text-child-xs transition-colors ${
                      sessionMode === 'free_time'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Student Free Time
                  </button>
                  <button
                    type="button"
                    onClick={() => setSessionMode('teacher_story')}
                    className={`py-2 px-3 rounded-lg font-semibold text-child-xs transition-colors ${
                      sessionMode === 'teacher_story'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Teacher Story
                  </button>
                </div>
                <p className="text-[10px] text-gray-600 mt-1">
                  {sessionMode === 'free_time' 
                    ? 'Students generate their own stories individually'
                    : 'You generate one story for all students'}
                </p>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-700 block mb-1">
                  Story ID (optional)
                </label>
                <input
                  type="text"
                  value={storyId}
                  onChange={(e) => setStoryId(e.target.value)}
                  placeholder="e.g., story-123"
                  className="w-full px-3 py-2 text-child-sm border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-300 rounded-lg py-2 px-3">
                <p className="text-child-xs text-red-700">{error}</p>
              </div>
            )}

            <Button
              variant="primary"
              size="large"
              onClick={handleCreateSession}
              disabled={isCreating || !newSessionId}
              className="w-full"
            >
              {isCreating ? 'Creating Session...' : 'Create Session'}
            </Button>
          </div>
        )}

        {/* Active Session */}
        {sessionId && (
          <>
            {/* Teacher Story Generation UI (only for teacher_story mode) */}
            {currentSessionMode === 'teacher_story' && teacherStoryState !== 'none' && (
              <div className="space-y-3">
                {/* Story Input State */}
                {teacherStoryState === 'input' && (
                  <div className="card py-4 px-4 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-child-base font-bold text-purple-900">
                        Generate Story for Students
                      </h2>
                      <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-1 rounded font-semibold">
                        Teacher Story Mode
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                      <div className="lg:col-span-2">
                        <StoryPromptInput
                          prompt={storySettings.prompt}
                          storySettings={storySettings}
                          languageSettings={languageSettings}
                          onPromptChange={handlePromptChange}
                          onGenerate={handleGenerateTeacherStory}
                          isGenerating={false}
                        />
                      </div>
                      <div className="space-y-2">
                        <StorySettings settings={storySettings} onChange={setStorySettings} />
                        <LanguageSettings settings={languageSettings} onChange={setLanguageSettings} />
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-50 border-2 border-red-300 rounded-lg py-2 px-3">
                        <p className="text-child-xs text-red-700">{error}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Story Generating State */}
                {teacherStoryState === 'generating' && (
                  <div className="card py-8 px-6 text-center space-y-4">
                    <div className="animate-spin text-4xl">⏳</div>
                    <h2 className="text-child-base font-bold text-gray-900">
                      Generating Story for Your Students
                    </h2>
                    <p className="text-[11px] text-gray-600">
                      Creating a {storySettings.gradeLevel} grade story at Level {languageSettings.blendLevel}{' '}
                      ({languageSettings.secondaryLanguage === 'ko' ? 'Korean' : 'Mandarin'})
                    </p>
                  </div>
                )}

                {/* Story Generated State */}
                {teacherStoryState === 'generated' && teacherStory && (
                  <div className="card py-4 px-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-child-base font-bold text-purple-900">
                        Story Ready for Students
                      </h2>
                      <Button
                        variant="outline"
                        size="small"
                        onClick={handleNewTeacherStory}
                      >
                        Generate New Story
                      </Button>
                    </div>
                    <div className="bg-green-50 border-2 border-green-300 rounded-lg py-3 px-4">
                      <p className="text-child-sm font-bold text-green-900 mb-1">
                        {teacherStory.title}
                      </p>
                      <p className="text-[11px] text-green-700">
                        Story shared with all students in this session. Students will see this story when they join.
                      </p>
                      <p className="text-[10px] text-green-600 mt-1">
                        {teacherStory.wordCount} words • {languageSettings.secondaryLanguage === 'ko' ? 'Korean' : 'Mandarin'} blend level {languageSettings.blendLevel}
                      </p>
                    </div>
                    <div className="bg-white border-2 border-gray-200 rounded-lg p-3 max-h-64 overflow-y-auto">
                      <StoryDisplay
                        story={teacherStory}
                        onFinish={() => {}}
                        onGenerateNew={handleNewTeacherStory}
                        onSaveStory={() => {}}
                        currentBlendLevel={languageSettings.blendLevel}
                        showHints={languageSettings.showHints}
                        showRomanization={languageSettings.showRomanization}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Session Info & Controls */}
            <div className="card py-3 px-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-child-base font-bold text-gray-900">
                    Active Session: {sessionId}
                  </h2>
                  <p className="text-[11px] text-gray-600">
                    {isConnected ? '🟢 Connected' : '🔴 Disconnected'} • {students.length} students
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="small"
                  onClick={handleEndSession}
                  className="bg-red-50 border-red-300 text-red-700 hover:bg-red-100"
                >
                  End Session
                </Button>
              </div>

              {/* Share Student Lobby Link */}
              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg py-2 px-3">
                <p className="text-[10px] font-semibold text-blue-700 mb-1">
                  Student Lobby Link (Share with all students):
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={`${window.location.origin}/lobby`}
                    readOnly
                    className="flex-1 px-2 py-1 text-[10px] bg-white border border-blue-200 rounded"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/lobby`);
                    }}
                    className="px-2 py-1 bg-blue-500 text-white text-[10px] font-semibold rounded hover:bg-blue-600"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-[9px] text-blue-600 mt-1">
                  Students will see your session ({sessionId}) in the lobby and can join
                </p>
              </div>

              {sseError && (
                <div className="bg-red-50 border-2 border-red-300 rounded-lg py-2 px-3">
                  <p className="text-child-xs text-red-700">
                    Connection Error: {sseError.message}
                  </p>
                </div>
              )}
            </div>

            {/* Student Progress Grid */}
            <div className="space-y-2">
              <h2 className="text-child-base font-bold text-gray-900 px-1">
                Student Progress ({students.length})
              </h2>

              {students.length === 0 && (
                <div className="card py-8 px-4 text-center">
                  <p className="text-child-sm text-gray-600">
                    Waiting for students to join...
                  </p>
                  <p className="text-[11px] text-gray-500 mt-2">
                    Share the student reading link above
                  </p>
                </div>
              )}

              {students.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {sortedStudents.map((student) => (
                    <StudentCard key={student.studentId} student={student} />
                  ))}
                </div>
              )}
            </div>

            {/* Summary Statistics */}
            {students.length > 0 && (
              <div className="card py-3 px-4">
                <h3 className="text-child-sm font-bold text-gray-900 mb-2">
                  Class Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center">
                    <p className="text-[11px] text-gray-600">Reading</p>
                    <p className="text-child-base font-bold text-green-700">
                      {students.filter(s => s.status === 'reading').length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] text-gray-600">Idle</p>
                    <p className="text-child-base font-bold text-yellow-700">
                      {students.filter(s => s.status === 'idle').length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] text-gray-600">Needs Help</p>
                    <p className="text-child-base font-bold text-red-700">
                      {students.filter(s => s.status === 'stuck').length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] text-gray-600">Completed</p>
                    <p className="text-child-base font-bold text-blue-700">
                      {students.filter(s => s.status === 'completed').length}
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t-2 border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-semibold text-gray-700">
                      Average Progress:
                    </span>
                    <span className="text-child-sm font-bold text-gray-900">
                      {Math.round(students.reduce((sum, s) => sum + s.progress, 0) / students.length)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
};