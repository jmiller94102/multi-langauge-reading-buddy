import React, { useState, useEffect } from 'react';
import { useStackApp, useUser as useStackUser } from '@stackframe/stack';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const LoginPage: React.FC = () => {
  const app = useStackApp();
  const stackUser = useStackUser();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (stackUser) {
      const role = stackUser.clientMetadata?.role;
      navigate(role === 'teacher' ? '/teacher' : '/dashboard');
    }
  }, [stackUser, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await app.signInWithCredential({
        email,
        password,
      });

      if (result.status === 'error') {
        setError(result.error.message || 'Login failed. Please check your credentials.');
      } else {
        console.log('Login successful');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during login';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDevBypass = () => {
    // Create a mock user for development
    const mockUserId = 'dev_bypass_user';
    const mockUserData = {
      name: 'Dev User',
      email: 'dev@example.com',
      age: 10,
      gradeLevel: '4th',
      nativeLanguage: 'English',
      targetLanguage: 'Korean',
      blendLevel: 5,
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      coins: 100,
      gems: 10,
      streak: 0,
      totalStoriesRead: 0,
      totalQuizzesPassed: 0,
      createdAt: new Date().toISOString(),
    };

    // Store in localStorage with dev user ID
    localStorage.setItem(`readingApp_user_${mockUserId}`, JSON.stringify(mockUserData));
    
    // Navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-center mb-2 text-primary-900">
          Welcome Back!
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Sign in to continue your learning journey
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="student@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Sign Up
            </button>
          </p>
        </div>

        {/* Development Bypass Button */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleDevBypass}
            className="w-full bg-gray-600 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 transition text-sm"
          >
            Dev Bypass (Skip Auth)
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            For development only - bypasses authentication
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;