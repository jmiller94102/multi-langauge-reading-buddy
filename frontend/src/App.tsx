import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProviders } from './contexts/AppProviders';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LevelUpCelebration } from './components/animations/LevelUpCelebration';
import { ToastContainer } from './components/common/ToastContainer';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { SessionIndicator } from './components/common/SessionIndicator';
import { useUser } from './contexts/UserContext';

// Lazy load pages for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Reading = lazy(() => import('./pages/Reading').then(m => ({ default: m.Reading })));
const Library = lazy(() => import('./pages/Library').then(m => ({ default: m.Library })));
const Achievements = lazy(() => import('./pages/Achievements').then(m => ({ default: m.Achievements })));
const Shop = lazy(() => import('./pages/Shop').then(m => ({ default: m.Shop })));
const Progress = lazy(() => import('./pages/Progress').then(m => ({ default: m.Progress })));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));
const TeacherDashboard = lazy(() => import('./pages/TeacherDashboard').then(m => ({ default: m.TeacherDashboard })));
const StudentLobby = lazy(() => import('./pages/StudentLobby').then(m => ({ default: m.StudentLobby })));
const ComponentShowcase = lazy(() => import('./pages/ComponentShowcase').then(m => ({ default: m.ComponentShowcase })));

// Global Celebrations Component
const GlobalCelebrations = () => {
  const { levelUpCelebration, clearLevelUpCelebration } = useUser();

  return (
    <>
      {levelUpCelebration && (
        <LevelUpCelebration
          newLevel={levelUpCelebration.newLevel}
          xpEarned={levelUpCelebration.xpEarned}
          onClose={clearLevelUpCelebration}
        />
      )}
    </>
  );
};

// Animated Routes with page transitions
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <Suspense fallback={<LoadingSpinner fullScreen message="Loading..." />}>
          <Routes location={location}>
            {/* Default route redirects to Dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Main app pages with lazy loading */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reading" element={<Reading />} />
            <Route path="/library" element={<Library />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/lobby" element={<StudentLobby />} />

            {/* Component showcase for testing */}
            <Route path="/showcase" element={<ComponentShowcase />} />

            {/* 404 fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <Router>
          <GlobalCelebrations />
          <ToastContainer />
          <SessionIndicator />
          <AnimatedRoutes />
        </Router>
      </AppProviders>
    </ErrorBoundary>
  );
}

export default App;
