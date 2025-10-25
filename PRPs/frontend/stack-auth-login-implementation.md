# PRP: Stack Auth Login Implementation
## Teacher & Student Authentication with Username/Password

**Version**: 1.0
**Created**: 2025-10-24
**Status**: Ready for Implementation
**Estimated Time**: 3-4 hours
**Priority**: High (Hackathon Feature)

---

## Overview

Implement Stack Auth authentication to enable teacher and student login with simple username/password credentials. This is a hackathon showcase feature demonstrating proper authentication integration.

**Key Requirements**:
- Simple email/password login (no OAuth for MVP)
- Single login flow with role selection (teacher vs student)
- Frontend-only integration (no backend changes for now)
- Preserve existing app functionality with localStorage
- Role-based routing (teachers → `/teacher`, students → `/dashboard`)

---

## Prerequisites

### Required Reading
- [ ] Read: `/docs/stack-auth/implementation-guide.md` (comprehensive technical guide)
- [ ] Read: `/docs/v2-architecture.md` (sections on UserContext)
- [ ] Read: `/frontend/src/contexts/UserContext.tsx` (understand current implementation)

### Environment Setup
- [ ] Node.js 20.x installed
- [ ] Frontend running on `http://localhost:5173`
- [ ] Git branch created: `git checkout -b feature/stack-auth-login`

### Stack Auth Account
- [ ] Stack Auth account created at [https://stack-auth.com](https://stack-auth.com)
- [ ] Project created: "multilingual-education-app"
- [ ] API keys obtained (see Step 1 below)

---

## Implementation Steps

### Step 1: Stack Auth Project Setup

**Objective**: Create Stack Auth project and configure environment variables

#### Actions

1. **Create Stack Auth Account** (if not done):
   - Visit [https://stack-auth.com](https://stack-auth.com)
   - Sign up with email or GitHub
   - Verify email

2. **Create New Project**:
   - Click "Create New Project"
   - **Project Name**: `multilingual-education-app` (or your preferred name)
   - **Authentication Methods**:
     - ✅ Email/Password (enable)
     - ❌ Google (disable for MVP)
     - ❌ GitHub (disable for MVP)
     - ❌ Magic Links (disable for MVP)
   - Click "Create Project"

3. **Copy API Keys**:

   You'll receive three keys:
   ```
   NEXT_PUBLIC_STACK_PROJECT_ID=<your-project-id>
   NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=<your-key>
   STACK_SECRET_SERVER_KEY=<your-secret-key>
   ```

4. **Configure Environment Variables**:

   Create/update `frontend/.env`:

   ```bash
   # Stack Auth Configuration
   VITE_STACK_PROJECT_ID=<paste-your-project-id>
   VITE_STACK_PUBLISHABLE_CLIENT_KEY=<paste-your-publishable-key>

   # Stack Auth API URL (default)
   VITE_STACK_API_URL=https://api.stack-auth.com
   ```

   **IMPORTANT**: Use `VITE_` prefix (not `NEXT_PUBLIC_`) for Vite projects

5. **Add Secret Key to Backend `.env`** (for future use):

   Update `backend/.env`:

   ```bash
   # Stack Auth Backend Configuration (POST-MVP)
   STACK_SECRET_SERVER_KEY=<paste-your-secret-key>
   STACK_PROJECT_ID=<paste-your-project-id>
   ```

6. **Update `.gitignore`**:

   Verify `.env` files are ignored:

   ```bash
   # Check .gitignore includes:
   .env
   .env.local
   .env.*.local
   ```

#### Validation

```bash
# Verify environment variables load correctly
cd frontend
cat .env  # Should show VITE_STACK_PROJECT_ID and VITE_STACK_PUBLISHABLE_CLIENT_KEY

# Restart Vite dev server to load new env vars
npm run dev
```

**Manual Check**:
- [ ] `.env` file exists in `frontend/` directory
- [ ] API keys are correct format (project ID is UUID-like, publishable key starts with `pk_`)
- [ ] `.env` is in `.gitignore` (never commit secrets!)
- [ ] Dev server restarted and running

**Checkpoint**: Environment variables configured ✅

---

### Step 2: Install Stack Auth Package

**Objective**: Install and configure Stack Auth SDK for React

#### Actions

1. **Install Stack Auth**:

   ```bash
   cd frontend
   npm install @stackframe/stack
   ```

2. **Verify Installation**:

   ```bash
   # Check package.json includes @stackframe/stack
   grep "@stackframe/stack" package.json
   ```

3. **Create Stack Client Configuration**:

   Create file: `frontend/src/lib/stackAuth.ts`

   ```typescript
   import { StackClientApp } from "@stackframe/stack";

   // Initialize Stack Auth client
   export const stackClient = new StackClientApp({
     projectId: import.meta.env.VITE_STACK_PROJECT_ID,
     publishableClientKey: import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY,
   });
   ```

4. **Wrap App with Stack Provider**:

   Update `frontend/src/main.tsx`:

   ```typescript
   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import { StackProvider } from '@stackframe/stack';
   import { stackClient } from './lib/stackAuth';
   import App from './App';
   import './index.css';

   ReactDOM.createRoot(document.getElementById('root')!).render(
     <React.StrictMode>
       <StackProvider app={stackClient}>
         <App />
       </StackProvider>
     </React.StrictMode>
   );
   ```

#### Validation

```bash
# Build should succeed without errors
npm run build

# Dev server should run without errors
npm run dev
```

**Manual Check**:
- [ ] `@stackframe/stack` in `package.json` dependencies
- [ ] `stackAuth.ts` file created with correct config
- [ ] `main.tsx` updated with `<StackProvider>`
- [ ] No console errors in browser
- [ ] App still loads (white screen = error, check console)

**Sub-Agent Validation**:
```bash
/agents code-reviewer "Review Stack Auth configuration in frontend/src/lib/stackAuth.ts and frontend/src/main.tsx for correctness and security"
```

**Checkpoint**: Stack Auth SDK installed and configured ✅

---

### Step 3: Create Authentication Pages

**Objective**: Build custom login and signup pages with role selection

#### Actions

1. **Create Login Page**:

   Create file: `frontend/src/pages/LoginPage.tsx`

   ```typescript
   import React, { useState } from 'react';
   import { useStackApp, useUser } from '@stackframe/stack';
   import { useNavigate } from 'react-router-dom';
   import { motion } from 'framer-motion';

   export default function LoginPage() {
     const app = useStackApp();
     const user = useUser();
     const navigate = useNavigate();

     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const [error, setError] = useState('');
     const [loading, setLoading] = useState(false);

     // Redirect if already logged in
     React.useEffect(() => {
       if (user) {
         const role = user.clientMetadata?.role;
         navigate(role === 'teacher' ? '/teacher' : '/dashboard');
       }
     }, [user, navigate]);

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
           // Success - useEffect will handle redirect
           console.log('Login successful');
         }
       } catch (err: any) {
         setError(err.message || 'An error occurred during login');
       } finally {
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
         </motion.div>
       </div>
     );
   }
   ```

2. **Create Signup Page**:

   Create file: `frontend/src/pages/SignupPage.tsx`

   ```typescript
   import React, { useState } from 'react';
   import { useStackApp, useUser } from '@stackframe/stack';
   import { useNavigate } from 'react-router-dom';
   import { motion } from 'framer-motion';

   export default function SignupPage() {
     const app = useStackApp();
     const user = useUser();
     const navigate = useNavigate();

     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const [displayName, setDisplayName] = useState('');
     const [role, setRole] = useState<'teacher' | 'student'>('student');
     const [error, setError] = useState('');
     const [loading, setLoading] = useState(false);

     // Redirect if already logged in
     React.useEffect(() => {
       if (user) {
         const userRole = user.clientMetadata?.role;
         navigate(userRole === 'teacher' ? '/teacher' : '/dashboard');
       }
     }, [user, navigate]);

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
       } catch (err: any) {
         setError(err.message || 'An error occurred during signup');
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
   }
   ```

#### Validation

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Dev server should show no errors
npm run dev
```

**Manual Check**:
- [ ] Login page renders at `/login`
- [ ] Signup page renders at `/signup`
- [ ] Forms are styled correctly (Tailwind classes work)
- [ ] Role selection UI displays properly
- [ ] No TypeScript errors in console
- [ ] Navigation between login/signup works

**Sub-Agent Validation**:
```bash
/agents code-reviewer "Review LoginPage.tsx and SignupPage.tsx for security, error handling, and UX best practices"
```

**Checkpoint**: Authentication pages created ✅

---

### Step 4: Update UserContext for Stack Auth Integration

**Objective**: Sync Stack Auth users with app-specific user data in localStorage

#### Actions

1. **Read Current UserContext**:

   ```bash
   # Review current implementation
   cat frontend/src/contexts/UserContext.tsx
   ```

2. **Update UserContext**:

   Modify `frontend/src/contexts/UserContext.tsx`:

   ```typescript
   import React, { createContext, useContext, useState, useEffect } from 'react';
   import { useUser as useStackUser } from '@stackframe/stack';

   // App-specific user data (stored in localStorage)
   interface AppUser {
     stackUserId: string;
     avatar: string;
     level: number;
     xp: number;
     coins: number;
     gems: number;
     stats: {
       totalReadings: number;
       totalQuizzes: number;
       correctAnswers: number;
       wordsRead: number;
       averageQuizScore: number;
       currentStreak: number;
       longestStreak: number;
     };
     settings: {
       primaryLanguage: string;
       secondaryLanguage: string;
       audioEnabled: boolean;
       notificationsEnabled: boolean;
     };
     // ... other fields from original UserContext
   }

   interface UserContextType {
     // Stack Auth user (authentication)
     stackUser: any | null;
     // App-specific user data
     user: AppUser | null;
     // Methods
     updateUser: (updates: Partial<AppUser>) => void;
     addXP: (amount: number) => void;
     addCoins: (amount: number) => void;
     spendCoins: (amount: number) => boolean;
     incrementStreak: () => void;
     // ... other methods
   }

   const UserContext = createContext<UserContextType | null>(null);

   export function UserProvider({ children }: { children: React.ReactNode }) {
     const stackUser = useStackUser(); // Stack Auth user
     const [appUser, setAppUser] = useState<AppUser | null>(null);

     useEffect(() => {
       if (!stackUser) {
         // User not authenticated
         setAppUser(null);
         return;
       }

       // Load or create app-specific user data
       const storageKey = `readingApp_user_${stackUser.id}`;
       const savedData = localStorage.getItem(storageKey);

       if (savedData) {
         // Existing user - load data
         setAppUser(JSON.parse(savedData));
       } else {
         // New user - initialize data
         const newAppUser: AppUser = {
           stackUserId: stackUser.id,
           avatar: 'child1',
           level: 1,
           xp: 0,
           coins: 100, // Starting coins
           gems: 0,
           stats: {
             totalReadings: 0,
             totalQuizzes: 0,
             correctAnswers: 0,
             wordsRead: 0,
             averageQuizScore: 0,
             currentStreak: 0,
             longestStreak: 0,
           },
           settings: {
             primaryLanguage: 'en',
             secondaryLanguage: 'ko',
             audioEnabled: true,
             notificationsEnabled: true,
           },
         };
         setAppUser(newAppUser);
         localStorage.setItem(storageKey, JSON.stringify(newAppUser));
       }
     }, [stackUser]);

     const updateUser = (updates: Partial<AppUser>) => {
       if (!appUser || !stackUser) return;

       const updated = { ...appUser, ...updates };
       setAppUser(updated);
       localStorage.setItem(`readingApp_user_${stackUser.id}`, JSON.stringify(updated));
     };

     const addXP = (amount: number) => {
       if (!appUser) return;

       const newXP = appUser.xp + amount;
       const newLevel = Math.floor(newXP / 100) + 1; // Simple leveling

       updateUser({
         xp: newXP,
         level: newLevel,
       });
     };

     const addCoins = (amount: number) => {
       if (!appUser) return;
       updateUser({ coins: appUser.coins + amount });
     };

     const spendCoins = (amount: number): boolean => {
       if (!appUser || appUser.coins < amount) return false;
       updateUser({ coins: appUser.coins - amount });
       return true;
     };

     const incrementStreak = () => {
       if (!appUser) return;

       const newStreak = appUser.stats.currentStreak + 1;
       const newLongest = Math.max(newStreak, appUser.stats.longestStreak);

       updateUser({
         stats: {
           ...appUser.stats,
           currentStreak: newStreak,
           longestStreak: newLongest,
         },
       });
     };

     return (
       <UserContext.Provider
         value={{
           stackUser,
           user: appUser,
           updateUser,
           addXP,
           addCoins,
           spendCoins,
           incrementStreak,
         }}
       >
         {children}
       </UserContext.Provider>
     );
   }

   export function useUser() {
     const context = useContext(UserContext);
     if (!context) {
       throw new Error('useUser must be used within UserProvider');
     }
     return context;
   }
   ```

3. **Update App.tsx** to wrap with UserProvider:

   ```typescript
   import { UserProvider } from './contexts/UserContext';

   function App() {
     return (
       <UserProvider>
         {/* Rest of app */}
       </UserProvider>
     );
   }
   ```

#### Validation

```bash
# Type check
npm run type-check

# Test in browser
npm run dev
```

**Manual Check**:
- [ ] UserContext exports both `stackUser` and `user`
- [ ] New users get initialized with default data
- [ ] localStorage uses key format: `readingApp_user_{stackUserId}`
- [ ] Existing functionality (XP, coins, stats) still works
- [ ] Multiple user accounts have separate data

**Sub-Agent Validation**:
```bash
/agents code-reviewer "Review updated UserContext.tsx for state management, localStorage usage, and Stack Auth integration"
```

**Checkpoint**: UserContext updated for Stack Auth ✅

---

### Step 5: Add Routes and Role-Based Navigation

**Objective**: Configure routes for login/signup and redirect based on user role

#### Actions

1. **Update Router Configuration**:

   Modify `frontend/src/App.tsx` (or wherever routes are defined):

   ```typescript
   import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
   import { useUser } from './contexts/UserContext';
   import LoginPage from './pages/LoginPage';
   import SignupPage from './pages/SignupPage';
   import Dashboard from './pages/Dashboard';
   import TeacherDashboard from './pages/TeacherDashboard';
   // ... other imports

   function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'teacher' | 'student' }) {
     const { stackUser } = useUser();

     if (!stackUser) {
       return <Navigate to="/login" replace />;
     }

     if (requiredRole && stackUser.clientMetadata?.role !== requiredRole) {
       return <Navigate to="/unauthorized" replace />;
     }

     return <>{children}</>;
   }

   function App() {
     return (
       <BrowserRouter>
         <Routes>
           {/* Public routes */}
           <Route path="/login" element={<LoginPage />} />
           <Route path="/signup" element={<SignupPage />} />

           {/* Protected routes */}
           <Route
             path="/dashboard"
             element={
               <ProtectedRoute>
                 <Dashboard />
               </ProtectedRoute>
             }
           />

           <Route
             path="/teacher"
             element={
               <ProtectedRoute requiredRole="teacher">
                 <TeacherDashboard />
               </ProtectedRoute>
             }
           />

           {/* Default redirect */}
           <Route path="/" element={<Navigate to="/login" replace />} />

           {/* 404 */}
           <Route path="*" element={<div>Page not found</div>} />
         </Routes>
       </BrowserRouter>
     );
   }

   export default App;
   ```

2. **Create Unauthorized Page** (optional):

   Create `frontend/src/pages/UnauthorizedPage.tsx`:

   ```typescript
   export default function UnauthorizedPage() {
     return (
       <div className="min-h-screen flex items-center justify-center">
         <div className="text-center">
           <h1 className="text-4xl font-bold text-red-600">Unauthorized</h1>
           <p className="mt-4 text-gray-600">You don't have permission to access this page.</p>
           <a href="/dashboard" className="mt-6 inline-block text-primary-600 underline">
             Go to Dashboard
           </a>
         </div>
       </div>
     );
   }
   ```

3. **Add Sign Out Button** to existing pages:

   Update `frontend/src/components/layout/Header.tsx` (or similar):

   ```typescript
   import { useUser } from '../../contexts/UserContext';

   export default function Header() {
     const { stackUser } = useUser();

     return (
       <header className="bg-white shadow">
         <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
           <Logo />

           {stackUser && (
             <div className="flex items-center gap-4">
               <span className="text-sm text-gray-700">
                 {stackUser.displayName || stackUser.primaryEmail}
               </span>
               <button
                 onClick={() => stackUser.signOut()}
                 className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
               >
                 Sign Out
               </button>
             </div>
           )}
         </nav>
       </header>
     );
   }
   ```

#### Validation

```bash
# Type check
npm run type-check

# Run dev server
npm run dev
```

**Manual Testing**:
- [ ] Navigate to `/` → redirects to `/login`
- [ ] Login → redirects to `/dashboard` (student) or `/teacher` (teacher)
- [ ] Access `/teacher` as student → redirects to `/unauthorized`
- [ ] Sign out → redirects to `/login`
- [ ] Access protected route without login → redirects to `/login`

**Sub-Agent Validation**:
```bash
/agents code-reviewer "Review routing configuration, protected routes, and role-based access control"
```

**Checkpoint**: Routes and role-based navigation configured ✅

---

### Step 6: Update Existing Components

**Objective**: Update components to use new UserContext structure

#### Actions

1. **Search for UserContext Usage**:

   ```bash
   cd frontend
   grep -r "useUser" src/ --include="*.tsx" --include="*.ts"
   ```

2. **Update Components**:

   For each component using `useUser()`:

   **Before**:
   ```typescript
   const { user } = useUser();
   console.log(user.name); // ❌ Old structure
   ```

   **After**:
   ```typescript
   const { user, stackUser } = useUser();
   console.log(stackUser?.displayName); // ✅ Stack Auth user
   console.log(user?.level); // ✅ App-specific data
   ```

3. **Common Updates**:

   - **Dashboard.tsx**: Use `stackUser.displayName` for greeting
   - **Profile.tsx**: Display email from `stackUser.primaryEmail`
   - **Pet components**: Use `user` for XP, level, coins
   - **Reading components**: Use `user` for stats and settings

4. **Example Update**:

   `frontend/src/pages/Dashboard.tsx`:

   ```typescript
   import { useUser } from '../contexts/UserContext';

   export default function Dashboard() {
     const { user, stackUser } = useUser();

     if (!stackUser) {
       return <div>Please log in</div>;
     }

     return (
       <div>
         <h1>Welcome, {stackUser.displayName || 'Learner'}!</h1>
         <p>Level: {user?.level || 1}</p>
         <p>XP: {user?.xp || 0}</p>
         <p>Role: {stackUser.clientMetadata?.role || 'student'}</p>
       </div>
     );
   }
   ```

#### Validation

```bash
# Type check all files
npm run type-check

# Lint
npm run lint

# Run tests
npm test
```

**Manual Check**:
- [ ] Dashboard shows correct user data
- [ ] Pet system uses correct XP/level from `user`
- [ ] Profile shows email from `stackUser`
- [ ] No TypeScript errors
- [ ] No runtime errors in console

**Sub-Agent Validation**:
```bash
/agents code-reviewer "Review all components using UserContext to ensure correct separation of Stack Auth data and app data"
```

**Checkpoint**: Existing components updated ✅

---

### Step 7: Testing & Quality Assurance

**Objective**: Comprehensive testing of authentication flows

#### Actions

1. **Manual Testing Checklist**:

   **Sign Up Flow**:
   - [ ] Open app → redirected to `/login`
   - [ ] Click "Sign Up"
   - [ ] Enter: Name, Email, Password
   - [ ] Select Role: Student
   - [ ] Submit form
   - [ ] Verify: Redirected to `/dashboard`
   - [ ] Verify: localStorage has `readingApp_user_{id}`
   - [ ] Verify: User appears in Stack Auth dashboard

   **Sign In Flow**:
   - [ ] Sign out
   - [ ] Click "Sign In"
   - [ ] Enter credentials
   - [ ] Verify: Redirected to `/dashboard`
   - [ ] Verify: App data loaded correctly (XP, level, coins)

   **Role-Based Access**:
   - [ ] Sign up as Teacher
   - [ ] Verify: Redirected to `/teacher`
   - [ ] Try accessing `/dashboard` → Should work (teachers can access student view)
   - [ ] Sign out, sign in as Student
   - [ ] Try accessing `/teacher` → Should redirect to `/unauthorized`

   **Data Persistence**:
   - [ ] Sign in, earn XP, complete quest
   - [ ] Sign out
   - [ ] Sign in again
   - [ ] Verify: Progress saved (XP, quests, etc.)

   **Multi-User**:
   - [ ] Create User A (student)
   - [ ] Earn 100 XP
   - [ ] Sign out
   - [ ] Create User B (teacher)
   - [ ] Verify: User B has 0 XP (separate data)
   - [ ] Sign out, sign in as User A
   - [ ] Verify: User A still has 100 XP

2. **Automated Testing**:

   Create `frontend/src/__tests__/auth.test.tsx`:

   ```typescript
   import { render, screen, waitFor } from '@testing-library/react';
   import userEvent from '@testing-library/user-event';
   import { StackProvider } from '@stackframe/stack';
   import { stackClient } from '../lib/stackAuth';
   import LoginPage from '../pages/LoginPage';

   describe('Authentication', () => {
     it('renders login form', () => {
       render(
         <StackProvider app={stackClient}>
           <LoginPage />
         </StackProvider>
       );

       expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
       expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
       expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
     });

     // More tests...
   });
   ```

3. **Run Tests**:

   ```bash
   npm test
   npm run test:coverage
   ```

#### Validation

**Sub-Agent Validation**:
```bash
/agents security-auditor "Comprehensive security audit for authentication implementation including XSS, CSRF, password handling, and role-based access control"
```

**Accessibility Check**:
```bash
/agents accessibility-checker "WCAG AA compliance check for login and signup pages"
```

**Quality Gates**:
- [ ] All manual tests pass
- [ ] Automated tests pass (if written)
- [ ] No TypeScript errors
- [ ] No console errors or warnings
- [ ] Security audit passes
- [ ] Accessibility audit passes

**Checkpoint**: Testing complete, all quality gates passed ✅

---

### Step 8: Documentation & Demo Preparation

**Objective**: Prepare for hackathon demo and document the feature

#### Actions

1. **Create Demo Accounts**:

   Create test accounts in Stack Auth:
   - **Teacher Account**: `teacher@demo.com` / `DemoPassword123!`
   - **Student Account**: `student@demo.com` / `DemoPassword123!`

2. **Update README**:

   Add to `README.md`:

   ```markdown
   ## Authentication

   This app uses [Stack Auth](https://stack-auth.com) for authentication.

   ### Demo Accounts

   - **Student**: `student@demo.com` / `DemoPassword123!`
   - **Teacher**: `teacher@demo.com` / `DemoPassword123!`

   ### Features

   - Email/password authentication
   - Role-based access (teacher vs student)
   - Persistent user data across sessions
   - Secure JWT token management

   ### Setup

   1. Create Stack Auth account at https://stack-auth.com
   2. Create new project, enable Email/Password auth
   3. Copy API keys to `frontend/.env`:
      ```
      VITE_STACK_PROJECT_ID=your-project-id
      VITE_STACK_PUBLISHABLE_CLIENT_KEY=your-key
      ```
   4. Restart dev server
   ```

3. **Prepare Demo Script**:

   Create `docs/demo-script.md`:

   ```markdown
   # Hackathon Demo Script - Stack Auth Integration

   ## Demo Flow (3 minutes)

   1. **Show Login Page** (15s)
      - Point out clean, simple UI
      - Mention Stack Auth integration

   2. **Sign Up as Student** (30s)
      - Enter name, email, password
      - Select "I am a Student"
      - Submit → Redirected to Dashboard

   3. **Show Student Features** (45s)
      - Dashboard with XP, level, coins
      - Virtual pet system
      - Reading stories, quizzes
      - Emphasize: Data persists per user

   4. **Sign Out & Sign Up as Teacher** (30s)
      - Sign out
      - Create new account as Teacher
      - Show separate data (new user)

   5. **Show Teacher Features** (45s)
      - Teacher dashboard
      - Classroom management
      - Real-time student monitoring
      - Emphasize: Role-based access control

   6. **Highlight Stack Auth** (15s)
      - Show Stack Auth dashboard (optional)
      - Mention: "5-minute integration"
      - Open-source, production-ready
      - Secure JWT, password hashing

   ## Key Talking Points

   - ✅ **Stack Auth** = Open-source Auth0 alternative
   - ✅ **Simple login** = Username/password (can add OAuth later)
   - ✅ **Role-based** = Teachers and students have different access
   - ✅ **Persistent data** = User progress saved across sessions
   - ✅ **Production-ready** = Secure, scalable, well-documented
   ```

4. **Create Screenshots**:

   Take screenshots:
   - Login page
   - Signup page (with role selection)
   - Student dashboard
   - Teacher dashboard
   - Stack Auth dashboard (showing users)

   Save to: `docs/screenshots/`

#### Validation

**Manual Check**:
- [ ] Demo accounts work correctly
- [ ] README updated with Stack Auth info
- [ ] Demo script is clear and timed
- [ ] Screenshots captured

**Checkpoint**: Demo preparation complete ✅

---

## Final Validation

### Pre-Commit Checklist

Run all quality checks:

```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Tests
npm test

# Build (ensure production build works)
npm run build
```

### Sub-Agent Final Review

```bash
/agents code-reviewer "Final comprehensive review of Stack Auth implementation including security, code quality, documentation, and demo readiness"
```

### Quality Gates

- [ ] ✅ All tests pass
- [ ] ✅ No TypeScript errors
- [ ] ✅ No linting errors
- [ ] ✅ Production build succeeds
- [ ] ✅ Security audit passed
- [ ] ✅ Accessibility audit passed
- [ ] ✅ Demo accounts created
- [ ] ✅ Documentation updated

---

## Commit & Deploy

### Git Workflow

```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "feat: Implement Stack Auth login for teachers and students

- Add Stack Auth SDK integration
- Create login and signup pages with role selection
- Update UserContext to sync Stack Auth with app data
- Add role-based routing and protected routes
- Implement sign out functionality
- Add demo accounts for hackathon
- Update documentation

🤖 Generated with Claude Code (https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to remote
git push origin feature/stack-auth-login
```

### Deployment Notes

**Environment Variables**:
Ensure production environment has:
- `VITE_STACK_PROJECT_ID`
- `VITE_STACK_PUBLISHABLE_CLIENT_KEY`

**Stack Auth Settings**:
- Add production domain to "Allowed Origins" in Stack Auth dashboard
- Enable email verification (optional but recommended)

---

## Troubleshooting

### Common Issues

**Issue**: "Project ID not found"
- **Fix**: Restart Vite dev server after adding `.env` variables

**Issue**: User data not persisting
- **Fix**: Check `localStorage` key format: `readingApp_user_{stackUserId}`

**Issue**: Role not working
- **Fix**: Verify `clientMetadata.role` is set during signup

**Issue**: CORS errors
- **Fix**: Add `http://localhost:5173` to Stack Auth allowed origins

---

## Success Criteria

### Feature Complete When:

- [ ] Teachers can sign up and log in
- [ ] Students can sign up and log in
- [ ] Roles are correctly assigned during signup
- [ ] Teachers access `/teacher` routes only
- [ ] Students can access student features
- [ ] Data persists per user across sessions
- [ ] Sign out works correctly
- [ ] Demo accounts ready for hackathon
- [ ] All quality gates passed

---

## Post-Implementation

### Future Enhancements (POST-HACKATHON)

- Add OAuth (Google, GitHub)
- Implement magic link login
- Add password reset flow
- Enable two-factor authentication
- Integrate backend JWT validation (Phase 7)
- Add email verification requirement
- Implement parent email for COPPA compliance

### Related PRPs

- `PRPs/backend/stack-auth-backend-integration.md` (Phase 7)
- `PRPs/fullstack/parent-consent-flow.md` (COPPA compliance)

---

**PRP Status**: ✅ Ready for Execution
**Estimated Time**: 3-4 hours
**Priority**: High (Hackathon Feature)
**Dependencies**: None (frontend-only)

---

## Notes

- This implementation is frontend-only; backend JWT validation comes in Phase 7
- Stack Auth handles all security (password hashing, JWT management)
- localStorage is used for app-specific data, not authentication
- Role-based access is enforced on frontend (backend enforcement in Phase 7)

---

**Last Updated**: 2025-10-24
**Author**: Claude Code
**Review Status**: Ready for implementation
