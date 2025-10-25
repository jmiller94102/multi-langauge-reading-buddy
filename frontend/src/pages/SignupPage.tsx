import React, { useState, useEffect } from 'react';
import { useStackApp, useUser as useStackUser } from '@stackframe/stack';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const SignupPage: React.FC = () => {
  const app = useStackApp();
  const stackUser = useStackUser();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'teacher' | 'student'>('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (stackUser) {
      const userRole = stackUser.clientMetadata?.role;
      navigate(userRole === 'teacher' ? '/teacher' : '/dashboard');
    }
  }, [stackUser, navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await app.signUpWithCredential({
        email,
        password,
      });

      if (result.status === 'error') {
        setError(result.error.message || 'Signup failed. Please try again.');
        setLoading(false);
        return;
      }

      // Update user metadata with display name and role
      await result.user.update({
        displayName,
        clientMetadata: { role },
      });

      console.log('Signup successful, redirecting...');
      // useEffect will handle redirect
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during signup';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-center mb-2 text-primary-900">
          Create Account
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Join thousands of learners worldwide
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

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
              minLength={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Min. 8 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I am a...
            </label>
            <div className="space-y-2">
              <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={role === 'student'}
                  onChange={() => setRole('student')}
                  className="mr-3"
                />
                <div>
                  <div className="font-semibold">Student</div>
                  <div className="text-sm text-gray-600">I want to learn and read stories</div>
                </div>
              </label>

              <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="role"
                  value="teacher"
                  checked={role === 'teacher'}
                  onChange={() => setRole('teacher')}
                  className="mr-3"
                />
                <div>
                  <div className="font-semibold">Teacher</div>
                  <div className="text-sm text-gray-600">I want to manage a classroom</div>
                </div>
              </label>
            </div>
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Sign In
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;