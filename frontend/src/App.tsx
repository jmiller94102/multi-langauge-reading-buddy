import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Reading } from './pages/Reading';
import { Achievements } from './pages/Achievements';
import { Shop } from './pages/Shop';
import { Progress } from './pages/Progress';
import { Profile } from './pages/Profile';
import { ComponentShowcase } from './pages/ComponentShowcase';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Main app pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reading" element={<Reading />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/profile" element={<Profile />} />

        {/* Component showcase for testing */}
        <Route path="/showcase" element={<ComponentShowcase />} />

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
