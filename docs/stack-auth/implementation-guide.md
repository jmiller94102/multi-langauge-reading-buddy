# Stack Auth Implementation Guide
## Multilingual Education App - Authentication with Stack Auth

**Version**: 1.0
**Last Updated**: 2025-10-24
**Purpose**: Technical reference for implementing Stack Auth authentication in the React+Vite frontend

---

## Table of Contents

1. [What is Stack Auth?](#what-is-stack-auth)
2. [Why Stack Auth for This Project?](#why-stack-auth-for-this-project)
3. [Setup Process](#setup-process)
4. [Architecture Overview](#architecture-overview)
5. [Frontend Integration (React + Vite)](#frontend-integration-react--vite)
6. [Teacher & Student Roles](#teacher--student-roles)
7. [Migration from localStorage to Stack Auth](#migration-from-localstorage-to-stack-auth)
8. [Testing & Validation](#testing--validation)
9. [Security Considerations](#security-considerations)
10. [Troubleshooting](#troubleshooting)

---

## What is Stack Auth?

**Stack Auth** is an open-source authentication platform (MIT/AGPL licensed) that provides:

- **Pre-built UI Components**: `<SignIn/>`, `<SignUp/>` components with customizable styling
- **Multiple Auth Methods**: Email/password, OAuth (Google, GitHub), magic links, passkeys
- **User Management**: Dashboard for managing users, roles, and permissions
- **Role-Based Access Control**: Built-in support for user roles and permissions
- **Multi-tenancy**: Team/organization management (optional)
- **Developer-Friendly**: 5-minute setup, React hooks, comprehensive documentation

**Key Features for Our App**:
- Username/password authentication (simple credentials)
- Role management (teacher vs student)
- Session management with JWT tokens
- No backend required for MVP (Stack Auth handles auth server)
- Pre-built React components (fast integration)

---

## Why Stack Auth for This Project?

### Perfect Fit for Hackathon

1. **Fast Setup**: 5-minute integration (critical for hackathons)
2. **No Backend Auth Logic**: Stack Auth handles JWT, password hashing, sessions
3. **Pre-built UI**: `<SignIn/>` and `<SignUp/>` components ready to use
4. **Free Tier**: Generous limits for demos and hackathons
5. **Open Source**: Transparency and customizability

### Alignment with Project Architecture

- **Current State**: React frontend with localStorage persistence
- **With Stack Auth**: React frontend + Stack Auth (cloud) + localStorage (app data)
- **Future State**: React + Stack Auth + Express backend (Phase 7)

### Alternative Considered

We evaluated building custom JWT auth with Express but Stack Auth provides:
- Faster implementation (hours vs days)
- Production-ready security (password hashing, rate limiting, JWT management)
- User management dashboard (useful for demo)

---

## Setup Process

### Step 1: Create Stack Auth Account

1. Visit [https://stack-auth.com](https://stack-auth.com)
2. Click "Sign Up" or "Get Started"
3. Create account with email/password or GitHub
4. Verify email if required

### Step 2: Create New Project

1. Once logged in, click "Create New Project"
2. **Project Name**: `multilingual-education-app` (or `reading-app-hackathon`)
3. **Authentication Methods**:
   - ✅ **Email/Password** (toggle ON)
   - ❌ Google (toggle OFF for MVP)
   - ❌ GitHub (toggle OFF for MVP)
   - ❌ Magic Links (toggle OFF for MVP)
4. Click "Create Project"

### Step 3: Get API Keys

After project creation, you'll receive three keys:

```
NEXT_PUBLIC_STACK_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=<your-publishable-key>
STACK_SECRET_SERVER_KEY=<your-secret-key>
```

**IMPORTANT**:
- `NEXT_PUBLIC_*` keys = Safe for frontend (public)
- `STACK_SECRET_SERVER_KEY` = Backend only (keep secret, not needed for MVP)

### Step 4: Add to Environment Variables

#### Frontend `.env` file

Create or update `frontend/.env`:

```bash
# Stack Auth Configuration
VITE_STACK_PROJECT_ID=<your-project-id>
VITE_STACK_PUBLISHABLE_CLIENT_KEY=<your-publishable-key>

# Stack Auth API URL (default, usually don't need to change)
VITE_STACK_API_URL=https://api.stack-auth.com
```

**Note**: Vite uses `VITE_` prefix for environment variables (not `NEXT_PUBLIC_`)

#### Backend `.env` file (Future Use - Phase 7)

Update `backend/.env`:

```bash
# Stack Auth Backend Configuration (POST-MVP)
STACK_SECRET_SERVER_KEY=<your-secret-key>
STACK_PROJECT_ID=<your-project-id>
```

### Step 5: Configure User Roles in Stack Auth Dashboard

1. Go to Stack Auth dashboard → Your Project → "Roles"
2. Create two roles:
   - **Role Name**: `teacher`
     - **Description**: "Teacher with classroom management permissions"
   - **Role Name**: `student`
     - **Description**: "Student with reading and learning permissions"
3. (Optional) Set permissions if needed for future features

---

## Architecture Overview

### Current Architecture (Pre-Stack Auth)

```
┌─────────────────────────────────────────┐
│  React Frontend (Vite)                  │
│  ┌─────────────────────────────────┐    │
│  │ UserContext (auto-creates user) │    │
│  │ localStorage: readingApp_user   │    │
│  └─────────────────────────────────┘    │
│                                         │
│  No authentication, no login required   │
└─────────────────────────────────────────┘
```

### New Architecture (With Stack Auth)

```
┌──────────────────────────────────────────────────────────┐
│  React Frontend (Vite)                                   │
│  ┌──────────────────────────────────────────────────┐    │
│  │ Stack Auth Provider                              │    │
│  │ ┌─────────────────┐  ┌──────────────────────┐   │    │
│  │ │ <SignIn />      │  │ useUser() hook       │   │    │
│  │ │ <SignUp />      │  │ - user.email         │   │    │
│  │ │ <UserButton />  │  │ - user.displayName   │   │    │
│  │ └─────────────────┘  │ - user.role          │   │    │
│  │                      │ - user.signOut()     │   │    │
│  │                      └──────────────────────┘   │    │
│  └──────────────────────────────────────────────────┘    │
│                           ↕                              │
│  ┌──────────────────────────────────────────────────┐    │
│  │ UserContext (enhanced)                           │    │
│  │ - Syncs Stack Auth user → app user data         │    │
│  │ - localStorage: readingApp_user_{stackUserId}   │    │
│  └──────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
                           ↕
          ┌────────────────────────────────┐
          │ Stack Auth (Cloud)             │
          │ - JWT token management         │
          │ - Password hashing             │
          │ - Session management           │
          │ - User database                │
          └────────────────────────────────┘
```

### Data Flow

1. **User Signs Up**:
   - Stack Auth creates user account
   - Returns JWT token + user object
   - Frontend creates app-specific user data in localStorage

2. **User Signs In**:
   - Stack Auth validates credentials
   - Returns JWT token + user object
   - Frontend loads app-specific user data from localStorage

3. **User Accesses App**:
   - Stack Auth validates JWT token on each request (automatic)
   - Frontend reads user data from localStorage
   - UserContext provides user state to all components

4. **User Signs Out**:
   - Stack Auth invalidates JWT token
   - Frontend clears session (localStorage preserved for next login)

---

## Frontend Integration (React + Vite)

### Installation

```bash
cd frontend
npm install @stackframe/stack
```

**Package**: `@stackframe/stack` provides React hooks and components

### Configuration

#### 1. Create Stack Client Configuration

Create `frontend/src/lib/stackAuth.ts`:

```typescript
import { StackClientApp } from "@stackframe/stack";

// Initialize Stack Auth client
export const stackClient = new StackClientApp({
  projectId: import.meta.env.VITE_STACK_PROJECT_ID,
  publishableClientKey: import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY,
  // Optional: custom API URL (defaults to https://api.stack-auth.com)
  // baseUrl: import.meta.env.VITE_STACK_API_URL,
});
```

#### 2. Wrap App with Stack Provider

Update `frontend/src/main.tsx` or `App.tsx`:

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

**Important**: `<StackProvider>` must wrap your entire app for hooks to work.

### Using Stack Auth Hooks

#### `useUser()` - Get Current User

```typescript
import { useUser } from '@stackframe/stack';

function Dashboard() {
  const user = useUser();

  if (!user) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.displayName || user.primaryEmail}!</h1>
      <p>Role: {user.clientMetadata?.role || 'student'}</p>
      <button onClick={() => user.signOut()}>Sign Out</button>
    </div>
  );
}
```

**Key Properties**:
- `user.id` - Unique user ID (UUID)
- `user.primaryEmail` - User's email
- `user.displayName` - User's display name (optional)
- `user.clientMetadata` - Custom data (e.g., role: 'teacher' | 'student')
- `user.signOut()` - Sign out function

#### `useStackApp()` - Access Stack Client

```typescript
import { useStackApp } from '@stackframe/stack';

function SignInForm() {
  const app = useStackApp();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSignIn = async () => {
    const result = await app.signInWithCredential({
      email,
      password,
    });

    if (result.status === 'error') {
      console.error('Sign in failed:', result.error);
    } else {
      console.log('Signed in successfully!');
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSignIn(); }}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Sign In</button>
    </form>
  );
}
```

### Pre-built Components

#### `<SignIn />` Component

```typescript
import { SignIn } from '@stackframe/stack';

function LoginPage() {
  return (
    <div className="login-page">
      <h1>Sign In to Reading App</h1>
      <SignIn />
    </div>
  );
}
```

**Customization Options**:
```typescript
<SignIn
  onSignIn={(user) => {
    console.log('User signed in:', user);
    // Redirect or handle post-signin logic
  }}
/>
```

#### `<SignUp />` Component

```typescript
import { SignUp } from '@stackframe/stack';

function RegisterPage() {
  return (
    <div className="register-page">
      <h1>Create Your Account</h1>
      <SignUp />
    </div>
  );
}
```

#### `<UserButton />` Component

Displays user avatar/menu with sign-out option:

```typescript
import { UserButton } from '@stackframe/stack';

function Header() {
  return (
    <header>
      <nav>
        <Logo />
        <UserButton />
      </nav>
    </header>
  );
}
```

### Protected Routes

Create a `ProtectedRoute` wrapper:

```typescript
import { useUser } from '@stackframe/stack';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'teacher' | 'student';
}

function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const user = useUser();

  // Not signed in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role if required
  if (requiredRole && user.clientMetadata?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
```

**Usage**:
```typescript
<Route path="/teacher" element={
  <ProtectedRoute requiredRole="teacher">
    <TeacherDashboard />
  </ProtectedRoute>
} />
```

---

## Teacher & Student Roles

### Role Selection During Signup

Create a custom signup flow with role selection:

```typescript
import { useStackApp } from '@stackframe/stack';
import { useState } from 'react';

function CustomSignUp() {
  const app = useStackApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'teacher' | 'student'>('student');

  const handleSignUp = async () => {
    try {
      const result = await app.signUpWithCredential({
        email,
        password,
      });

      if (result.status === 'error') {
        console.error('Sign up failed:', result.error);
        return;
      }

      // Update user metadata with role and display name
      await result.user.update({
        displayName,
        clientMetadata: { role },
      });

      console.log('Account created successfully!');
    } catch (error) {
      console.error('Sign up error:', error);
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSignUp(); }}>
      <input
        type="text"
        placeholder="Display Name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="role-selection">
        <label>
          <input
            type="radio"
            name="role"
            value="student"
            checked={role === 'student'}
            onChange={(e) => setRole('student')}
          />
          I am a Student
        </label>
        <label>
          <input
            type="radio"
            name="role"
            value="teacher"
            checked={role === 'teacher'}
            onChange={(e) => setRole('teacher')}
          />
          I am a Teacher
        </label>
      </div>

      <button type="submit">Create Account</button>
    </form>
  );
}
```

### Role-Based Routing

Update `App.tsx` to route users based on role:

```typescript
import { useUser } from '@stackframe/stack';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
  const user = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const role = user.clientMetadata?.role;

      // Redirect based on role
      if (role === 'teacher') {
        navigate('/teacher');
      } else if (role === 'student') {
        navigate('/dashboard');
      } else {
        // No role set, ask user to complete profile
        navigate('/complete-profile');
      }
    }
  }, [user, navigate]);

  // Rest of app routing
}
```

### Displaying Role-Specific UI

```typescript
function Header() {
  const user = useUser();
  const isTeacher = user?.clientMetadata?.role === 'teacher';

  return (
    <header>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/reading">Reading</Link>

        {isTeacher && (
          <>
            <Link to="/teacher">Teacher Portal</Link>
            <Link to="/teacher/classroom">Classroom</Link>
          </>
        )}

        <UserButton />
      </nav>
    </header>
  );
}
```

---

## Migration from localStorage to Stack Auth

### Current User Data Structure

Currently, the app stores user data in localStorage:

```typescript
// localStorage key: readingApp_user
{
  id: "uuid-generated",
  name: "Default User",
  avatar: "child1",
  level: 1,
  xp: 0,
  coins: 0,
  gems: 0,
  // ... stats, history, settings
}
```

### New Data Structure (With Stack Auth)

```typescript
// Stack Auth User (from useUser())
{
  id: "stack-user-id",
  primaryEmail: "student@example.com",
  displayName: "John Doe",
  clientMetadata: {
    role: "student"
  }
}

// App-Specific User Data (localStorage key: readingApp_user_{stackUserId})
{
  stackUserId: "stack-user-id",
  avatar: "child1",
  level: 1,
  xp: 0,
  coins: 0,
  gems: 0,
  // ... stats, history, settings
}
```

### Update UserContext

Modify `frontend/src/contexts/UserContext.tsx`:

```typescript
import { useUser as useStackUser } from '@stackframe/stack';
import { createContext, useContext, useEffect, useState } from 'react';

interface AppUser {
  stackUserId: string;
  avatar: string;
  level: number;
  xp: number;
  coins: number;
  gems: number;
  // ... other app-specific data
}

const UserContext = createContext<{
  user: AppUser | null;
  stackUser: any; // Stack Auth user
  updateUser: (updates: Partial<AppUser>) => void;
  addXP: (amount: number) => void;
  // ... other methods
} | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const stackUser = useStackUser(); // Stack Auth user
  const [appUser, setAppUser] = useState<AppUser | null>(null);

  useEffect(() => {
    if (!stackUser) {
      // User not signed in
      setAppUser(null);
      return;
    }

    // Load or create app-specific user data
    const storageKey = `readingApp_user_${stackUser.id}`;
    const savedData = localStorage.getItem(storageKey);

    if (savedData) {
      setAppUser(JSON.parse(savedData));
    } else {
      // First time login - create new app user
      const newAppUser: AppUser = {
        stackUserId: stackUser.id,
        avatar: 'child1',
        level: 1,
        xp: 0,
        coins: 0,
        gems: 0,
        // ... initialize other fields
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

  // ... other methods (addXP, addCoins, etc.)

  return (
    <UserContext.Provider value={{ user: appUser, stackUser, updateUser, addXP, ... }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}
```

**Key Changes**:
1. `useStackUser()` hook retrieves Stack Auth user
2. localStorage key includes Stack user ID: `readingApp_user_{stackUserId}`
3. App data separated from auth data
4. Context provides both `stackUser` (auth) and `user` (app data)

---

## Testing & Validation

### Manual Testing Checklist

#### Sign Up Flow
- [ ] Open app, click "Sign Up"
- [ ] Enter email, password, display name
- [ ] Select role (teacher or student)
- [ ] Submit form
- [ ] Verify account created in Stack Auth dashboard
- [ ] Verify user redirected to correct page based on role
- [ ] Verify localStorage contains new user data

#### Sign In Flow
- [ ] Sign out if logged in
- [ ] Click "Sign In"
- [ ] Enter credentials
- [ ] Verify successful login
- [ ] Verify user data loaded from localStorage
- [ ] Verify correct role-based routing

#### Sign Out Flow
- [ ] Click sign out button
- [ ] Verify user logged out
- [ ] Verify redirected to login page
- [ ] Verify localStorage preserved (not cleared)

#### Role-Based Access
- [ ] Sign in as student
- [ ] Verify cannot access `/teacher` routes
- [ ] Sign out, sign in as teacher
- [ ] Verify can access `/teacher` routes
- [ ] Verify student routes still accessible

#### Data Persistence
- [ ] Sign in as user A
- [ ] Earn XP, coins, complete quest
- [ ] Sign out
- [ ] Sign in as user B (different account)
- [ ] Verify user B has separate data
- [ ] Sign out, sign in as user A again
- [ ] Verify user A's progress preserved

### Automated Testing

#### Unit Tests

Test Stack Auth integration:

```typescript
// __tests__/stackAuth.test.tsx
import { render, screen } from '@testing-library/react';
import { StackProvider } from '@stackframe/stack';
import { stackClient } from '../lib/stackAuth';
import Dashboard from '../pages/Dashboard';

describe('Stack Auth Integration', () => {
  it('shows login prompt when not authenticated', () => {
    render(
      <StackProvider app={stackClient}>
        <Dashboard />
      </StackProvider>
    );

    expect(screen.getByText(/please sign in/i)).toBeInTheDocument();
  });

  // More tests...
});
```

#### Integration Tests

Test full authentication flow with mocked Stack Auth:

```typescript
// Mock Stack Auth for testing
jest.mock('@stackframe/stack', () => ({
  useUser: () => ({
    id: 'test-user-id',
    primaryEmail: 'test@example.com',
    displayName: 'Test User',
    clientMetadata: { role: 'student' },
  }),
}));
```

---

## Security Considerations

### Environment Variables

**Never commit API keys to git**:

```bash
# .gitignore
.env
.env.local
.env.*.local
```

### JWT Token Security

Stack Auth handles JWT tokens automatically:
- Tokens stored in httpOnly cookies (not accessible via JavaScript)
- Automatic token refresh
- Secure token transmission (HTTPS only)

### Password Requirements

Configure in Stack Auth dashboard:
- Minimum 8 characters
- Require uppercase, lowercase, number, special character (optional)
- Password strength meter (automatic)

### Rate Limiting

Stack Auth provides built-in rate limiting:
- Max 5 failed login attempts per 15 minutes
- Account temporarily locked after threshold
- Automatic unlock after cooldown period

### XSS Prevention

- Stack Auth escapes all user inputs
- Use `textContent` instead of `innerHTML` for user data
- Sanitize any user-generated content before rendering

### COPPA Compliance (Children's App)

**IMPORTANT**: This app is for children (3rd-6th grade)

- **No personally identifiable information** beyond email (required for login)
- **Parental consent** may be required for users under 13
- **Privacy policy** must be clear and accessible
- Consider adding "Parent Email" field during signup for verification

---

## Troubleshooting

### Issue: "Project ID not found" Error

**Cause**: Environment variables not loaded correctly

**Solution**:
1. Verify `.env` file exists in `frontend/` directory
2. Check variable names use `VITE_` prefix (not `NEXT_PUBLIC_`)
3. Restart Vite dev server after changing `.env`
4. Clear browser cache and localStorage

### Issue: User Data Not Persisting

**Cause**: localStorage key mismatch or not saving properly

**Solution**:
1. Check `UserContext` uses correct key: `readingApp_user_${stackUser.id}`
2. Verify `updateUser` function calls `localStorage.setItem`
3. Check browser console for localStorage errors
4. Ensure localStorage is not disabled (incognito mode issues)

### Issue: Role Not Working After Signup

**Cause**: `clientMetadata` not updated or not set during signup

**Solution**:
1. Verify `user.update({ clientMetadata: { role } })` is called after signup
2. Check Stack Auth dashboard → Users → Select user → Metadata tab
3. Ensure role is stored as `role` key in clientMetadata
4. Reload page to force `useUser()` to refetch user data

### Issue: CORS Errors

**Cause**: Stack Auth API blocking requests from localhost

**Solution**:
1. Stack Auth should allow `localhost` by default
2. Check Stack Auth dashboard → Settings → Allowed Origins
3. Add `http://localhost:5173` (Vite default port) to allowed origins
4. Ensure `baseUrl` in `stackClient` is correct

### Issue: "Invalid Credentials" on Valid Login

**Cause**: Multiple possible causes

**Solution**:
1. Check email is verified (Stack Auth may require email verification)
2. Go to Stack Auth dashboard → Users → Find user → Click "Verify Email"
3. Check password meets minimum requirements
4. Ensure user exists in Stack Auth dashboard
5. Try password reset flow to verify email/account is valid

---

## Additional Resources

### Official Documentation

- **Stack Auth Docs**: [https://docs.stack-auth.com](https://docs.stack-auth.com)
- **GitHub Repository**: [https://github.com/stack-auth/stack-auth](https://github.com/stack-auth/stack-auth)
- **React Components**: [https://docs.stack-auth.com/docs/react/components](https://docs.stack-auth.com/docs/react/components)
- **API Reference**: [https://docs.stack-auth.com/docs/react/sdk](https://docs.stack-auth.com/docs/react/sdk)

### Community Support

- **Discord**: Join Stack Auth community for help
- **GitHub Issues**: Report bugs or request features
- **Stack Overflow**: Tag questions with `stack-auth`

### Example Projects

- **Stack Auth Examples**: [https://github.com/stack-auth/stack-auth/tree/main/examples](https://github.com/stack-auth/stack-auth/tree/main/examples)
- **Next.js + Stack Auth**: Reference implementation

---

## Next Steps

After reading this guide:

1. **Execute PRP**: Follow the step-by-step implementation in `PRPs/frontend/stack-auth-login-implementation.md`
2. **Setup Stack Auth Account**: Create project and get API keys
3. **Integrate Frontend**: Install package, wrap app with provider
4. **Create Login Pages**: Build custom signup/login with role selection
5. **Update UserContext**: Sync Stack Auth user with app data
6. **Test Thoroughly**: Verify all flows work correctly
7. **Demo for Hackathon**: Show teacher and student login flows

---

**Document Status**: ✅ Complete
**Ready for Implementation**: Yes
**Estimated Implementation Time**: 3-4 hours (frontend only)
