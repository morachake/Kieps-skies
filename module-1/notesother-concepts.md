# React Navigation, Routing, TypeScript & Data Fetching: A Comprehensive Guide

## Table of Contents

1. [Introduction](#introduction)
2. [Project Setup with TypeScript](#project-setup-with-typescript)
3. [Routing with React Router](#routing-with-react-router)
   - [Basic Routing Setup](#basic-routing-setup)
   - [Route Parameters and Dynamic Routes](#route-parameters-and-dynamic-routes)
   - [Nested Routes](#nested-routes)
   - [Protected Routes](#protected-routes)
   - [Lazy Loading Routes](#lazy-loading-routes)
4. [TypeScript Integration](#typescript-integration)
   - [TypeScript with React Router](#typescript-with-react-router)
   - [Type-Safe Route Parameters](#type-safe-route-parameters)
   - [TypeScript with Navigation State](#typescript-with-navigation-state)
5. [Navigation Patterns](#navigation-patterns)
   - [Programmatic Navigation](#programmatic-navigation)
   - [Navigation Guards](#navigation-guards)
   - [Route-Based Code Splitting](#route-based-code-splitting)
   - [Animated Transitions](#animated-transitions)
6. [Data Fetching Strategies](#data-fetching-strategies)
   - [Setting Up React Query](#setting-up-react-query)
   - [Data Fetching with React Router Loaders](#data-fetching-with-react-router-loaders)
   - [Error Handling with TypeScript](#error-handling-with-typescript)
   - [Optimistic Updates](#optimistic-updates)
   - [Infinite Scrolling and Pagination](#infinite-scrolling-and-pagination)
7. [Authentication and Authorization](#authentication-and-authorization)
   - [JWT Authentication Flow](#jwt-authentication-flow)
   - [Protecting Routes](#protecting-routes)
   - [Handling Expired Tokens](#handling-expired-tokens)
8. [Building a Complete App](#building-a-complete-app)
   - [Project Structure](#project-structure)
   - [API Client with TypeScript](#api-client-with-typescript)
   - [State Management with Context](#state-management-with-context)
   - [Component Architecture](#component-architecture)
9. [Performance Optimization](#performance-optimization)
   - [Route Prefetching](#route-prefetching)
   - [Data Caching Strategies](#data-caching-strategies)
   - [Memoization Techniques](#memoization-techniques)
10. [Testing Navigation and Data Fetching](#testing-navigation-and-data-fetching)
    - [Testing Routes](#testing-routes)
    - [Mocking API Calls](#mocking-api-calls)
    - [Integration Tests](#integration-tests)
11. [Deployment Considerations](#deployment-considerations)
    - [Server Configuration for SPA Routing](#server-configuration-for-spa-routing)
    - [Environment Variables](#environment-variables)
12. [Conclusion and Resources](#conclusion-and-resources)

## Introduction

Modern React applications often need robust client-side routing, type safety with TypeScript, and efficient data fetching strategies. This guide walks you through building a complete application that incorporates these technologies, with detailed explanations and practical examples.

## Project Setup with TypeScript

Let's start by setting up a new React project with TypeScript:

```bash
# Using Create React App
npx create-react-app my-app --template typescript

# OR using Vite (recommended for faster development)
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
```

### Adding Essential Dependencies

```bash
# Routing
npm install react-router-dom

# Data fetching
npm install @tanstack/react-query axios

# UI components (optional)
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion

# Form handling (optional)
npm install react-hook-form zod @hookform/resolvers
```

### Basic Project Structure

```
my-app/
├── src/
│   ├── api/                  # API client and service functions
│   ├── components/           # Reusable UI components
│   ├── hooks/                # Custom hooks
│   ├── pages/                # Route components
│   ├── routes/               # Routing configuration
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Utility functions
│   ├── context/              # React Context providers
│   ├── App.tsx               # Main App component
│   ├── main.tsx              # Entry point
│   └── vite-env.d.ts         # Vite type declarations
└── tsconfig.json             # TypeScript configuration
```

## Routing with React Router

### Basic Routing Setup

Let's create a basic routing structure using React Router v6:

First, create your route components:

```tsx
// src/pages/Home.tsx
import React from 'react';

const Home: React.FC = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to our application!</p>
    </div>
  );
};

export default Home;

// src/pages/About.tsx
import React from 'react';

const About: React.FC = () => {
  return (
    <div>
      <h1>About Page</h1>
      <p>Learn more about our company.</p>
    </div>
  );
};

export default About;

// src/pages/NotFound.tsx
import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
};

export default NotFound;
```

Now, set up the router in your main App component:

```tsx
// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
```

### Route Parameters and Dynamic Routes

Let's add a route with parameters:

```tsx
// src/pages/UserProfile.tsx
import React from 'react';
import { useParams } from 'react-router-dom';

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  
  return (
    <div>
      <h1>User Profile</h1>
      <p>User ID: {userId}</p>
      {/* We'll add data fetching here later */}
    </div>
  );
};

export default UserProfile;
```

Add the dynamic route to your App component:

```tsx
// Update the Routes section in App.tsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/users/:userId" element={<UserProfile />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

### Nested Routes

Let's implement nested routes for a dashboard section:

```tsx
// src/pages/Dashboard/index.tsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <nav>
        <ul>
          <li><Link to="/dashboard">Dashboard Home</Link></li>
          <li><Link to="/dashboard/analytics">Analytics</Link></li>
          <li><Link to="/dashboard/settings">Settings</Link></li>
        </ul>
      </nav>
      
      {/* Nested routes will render here */}
      <Outlet />
    </div>
  );
};

export default Dashboard;

// src/pages/Dashboard/DashboardHome.tsx
import React from 'react';

const DashboardHome: React.FC = () => {
  return <div>Dashboard Home Content</div>;
};

export default DashboardHome;

// src/pages/Dashboard/Analytics.tsx
import React from 'react';

const Analytics: React.FC = () => {
  return <div>Analytics Content</div>;
};

export default Analytics;

// src/pages/Dashboard/Settings.tsx
import React from 'react';

const Settings: React.FC = () => {
  return <div>Settings Content</div>;
};

export default Settings;
```

Update your routes to include nested routes:

```tsx
// Update the Routes section in App.tsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/users/:userId" element={<UserProfile />} />
  
  {/* Nested dashboard routes */}
  <Route path="/dashboard" element={<Dashboard />}>
    <Route index element={<DashboardHome />} />
    <Route path="analytics" element={<Analytics />} />
    <Route path="settings" element={<Settings />} />
  </Route>
  
  <Route path="*" element={<NotFound />} />
</Routes>
```

### Protected Routes

Let's implement protected routes that require authentication:

```tsx
// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        try {
          // In a real app, you'd validate the token with your backend
          // For now, we'll simulate it
          const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
          setUser(userData);
        } catch (error) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
  
  const login = async (username: string, password: string) => {
    // Simulate API call
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful login
      const userData: User = {
        id: '1',
        username,
        email: `${username}@example.com`,
      };
      
      // Save to localStorage (in a real app, store JWT token)
      localStorage.setItem('auth_token', 'fake_jwt_token');
      localStorage.setItem('user_data', JSON.stringify(userData));
      
      setUser(userData);
    } catch (error) {
      throw new Error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        login, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

Now, let's create a protected route wrapper:

```tsx
// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    // Redirect to login page but save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
```

Create a login page:

```tsx
// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LocationState {
  from?: {
    pathname: string;
  };
}

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the page they were trying to access or default to dashboard
  const from = (location.state as LocationState)?.from?.pathname || '/dashboard';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(username, password);
      // Redirect them to the page they were trying to access
      navigate(from, { replace: true });
    } catch (err) {
      setError('Invalid username or password');
    }
  };
  
  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
```

Update your App to use the auth provider and protected routes:

```tsx
// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import Dashboard from './pages/Dashboard';
import DashboardHome from './pages/Dashboard/DashboardHome';
import Analytics from './pages/Dashboard/Analytics';
import Settings from './pages/Dashboard/Settings';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </nav>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/users/:userId" element={<UserProfile />} />
          
          {/* Protected dashboard routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
```

### Lazy Loading Routes

Let's implement lazy loading for routes to improve performance:

```tsx
// src/App.tsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Eagerly loaded components
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

// Lazy loaded components
const About = lazy(() => import('./pages/About'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const DashboardHome = lazy(() => import('./pages/Dashboard/DashboardHome'));
const Analytics = lazy(() => import('./pages/Dashboard/Analytics'));
const Settings = lazy(() => import('./pages/Dashboard/Settings'));

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </nav>
        
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/users/:userId" element={<UserProfile />} />
            
            {/* Protected dashboard routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
```

## TypeScript Integration

### TypeScript with React Router

Let's define proper types for our routes:

```tsx
// src/types/route.ts
export interface RouteConfig {
  path: string;
  label: string;
  // Add more properties as needed
}

export const ROUTES = {
  HOME: { path: '/', label: 'Home' },
  ABOUT: { path: '/about', label: 'About' },
  LOGIN: { path: '/login', label: 'Login' },
  DASHBOARD: { path: '/dashboard', label: 'Dashboard' },
  DASHBOARD_ANALYTICS: { path: '/dashboard/analytics', label: 'Analytics' },
  DASHBOARD_SETTINGS: { path: '/dashboard/settings', label: 'Settings' },
  USER_PROFILE: (userId: string) => ({ 
    path: `/users/${userId}`, 
    label: `User ${userId}` 
  }),
} as const;
```

Using the route config for navigation:

```tsx
// src/components/Navigation.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../types/route';
import { useAuth } from '../context/AuthContext';

const Navigation: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  
  return (
    <nav>
      <ul>
        <li>
          <Link 
            to={ROUTES.HOME.path} 
            className={location.pathname === ROUTES.HOME.path ? 'active' : ''}
          >
            {ROUTES.HOME.label}
          </Link>
        </li>
        <li>
          <Link 
            to={ROUTES.ABOUT.path}
            className={location.pathname === ROUTES.ABOUT.path ? 'active' : ''}
          >
            {ROUTES.ABOUT.label}
          </Link>
        </li>
        {isAuthenticated ? (
          <>
            <li>
              <Link 
                to={ROUTES.DASHBOARD.path}
                className={location.pathname.startsWith(ROUTES.DASHBOARD.path) ? 'active' : ''}
              >
                {ROUTES.DASHBOARD.label}
              </Link>
            </li>
            <li>
              <button onClick={logout}>Logout</button>
            </li>
          </>
        ) : (
          <li>
            <Link 
              to={ROUTES.LOGIN.path}
              className={location.pathname === ROUTES.LOGIN.path ? 'active' : ''}
            >
              {ROUTES.LOGIN.label}
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
```

### Type-Safe Route Parameters

Let's improve our route parameters with TypeScript:

```tsx
// src/types/params.ts
export interface UserParams {
  userId: string;
}

export interface ProductParams {
  productId: string;
}

// Add more parameter interfaces as needed
```

Using typed parameters in components:

```tsx
// src/pages/UserProfile.tsx with improved types
import React from 'react';
import { useParams } from 'react-router-dom';
import { UserParams } from '../types/params';

const UserProfile: React.FC = () => {
  const { userId } = useParams<keyof UserParams>() as UserParams;
  
  return (
    <div>
      <h1>User Profile</h1>
      <p>User ID: {userId}</p>
    </div>
  );
};

export default UserProfile;
```

### TypeScript with Navigation State

Let's add type safety to our navigation state:

```tsx
// src/types/navigation.ts
export interface LocationState {
  from?: {
    pathname: string;
  };
  message?: string;
}

// src/pages/Login.tsx with improved type safety
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LocationState } from '../types/navigation';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const state = location.state as LocationState;
  const from = state?.from?.pathname || '/dashboard';
  const message = state?.message;
  
  // ... rest of the component
  
  return (
    <div>
      <h1>Login</h1>
      {message && <p className="info-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      
      {/* Rest of the form */}
    </div>
  );
};
```

## Navigation Patterns

### Programmatic Navigation

Let's implement common programmatic navigation patterns:

```tsx
// src/pages/ProductDetails.tsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductParams } from '../types/params';
import { ROUTES } from '../types/route';

const ProductDetails: React.FC = () => {
  const { productId } = useParams<keyof ProductParams>() as ProductParams;
  const navigate = useNavigate();
  
  // Navigate to another page
  const goToRelatedProduct = (relatedId: string) => {
    navigate(`/products/${relatedId}`);
  };
  
  // Navigate with state
  const goToCart = () => {
    navigate('/cart', { 
      state: { 
        addedProduct: productId,
        message: 'Product added to cart!'
      } 
    });
  };
  
  // Navigate with replace (replaces current history entry)
  const goToCategory = (categoryId: string) => {
    navigate(`/categories/${categoryId}`, { replace: true });
  };
  
  // Go back
  const goBack = () => {
    navigate(-1);
  };
  
  // Go forward
  const goForward = () => {
    navigate(1);
  };
  
  return (
    <div>
      <h1>Product Details</h1>
      <p>Product ID: {productId}</p>
      
      <div className="actions">
        <button onClick={() => goToRelatedProduct('123')}>
          View Related Product
        </button>
        <button onClick={goToCart}>Add to Cart</button>
        <button onClick={() => goToCategory('electronics')}>
          View Category
        </button>
        <button onClick={goBack}>Back</button>
        <button onClick={goForward}>Forward</button>
      </div>
    </div>
  );
};

export default ProductDetails;
```

### Navigation Guards

Let's implement a navigation guard for unsaved changes:

```tsx
// src/hooks/usePrompt.ts
import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * A custom hook to prompt the user before navigating away from a page with unsaved changes
 */
export function usePrompt(
  message: string,
  when: boolean
): void {
  const navigate = useNavigate();
  const location = useLocation();

  // Function to handle the beforeunload event
  const handleBeforeUnload = useCallback(
    (e: BeforeUnloadEvent) => {
      if (when) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    },
    [when, message]
  );

  // Prompt the user when they try to navigate within the app
  useEffect(() => {
    if (!when) return;

    // Create a blocker function
    const unblock = navigate((nextLocation) => {
      if (
        nextLocation.pathname !== location.pathname &&
        !window.confirm(message)
      ) {
        // Block navigation and stay on the current page
        return false;
      }
      // Allow navigation
      return true;
    });

    // Handle browser-level navigation (refresh, closing tab)
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // Clean up event listener and blocker when component unmounts
      window.removeEventListener('beforeunload', handleBeforeUnload);
      unblock();
    };
  }, [when, message, navigate, location.pathname, handleBeforeUnload]);
}
```

Using the navigation guard in a form:

```tsx
// src/pages/CreatePost.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrompt } from '../hooks/usePrompt';

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const navigate = useNavigate();
  
  // Show prompt when form is dirty and user tries to navigate away
  usePrompt('You have unsaved changes. Are you sure you want to leave?', isDirty);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setIsDirty(true);
  };
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsDirty(true);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save the post (in a real app, you'd call an API)
    console.log('Saving post:', { title, content });
    
    // Reset dirty state
    setIsDirty(false);
    
    // Navigate to the posts list
    navigate('/posts', { 
      state: { message: 'Post created successfully!' } 
    });
  };
  
  return (
    <div>
      <h1>Create Post</h1>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={handleTitleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
            rows={10}
            required
          />
        </div>
        
        <button type="submit">Save Post</button>
        <button
          type="button"
          onClick={() => {
            if (isDirty && !window.confirm('Discard changes?')) {
              return;
            }
            navigate('/posts');
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
```

### Route-Based Code Splitting

Let's set up a more advanced route-based code splitting approach:

```tsx
// src/routes/index.tsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import LoadingFallback from '../components/LoadingFallback';

// Eagerly loaded components
import Home from '../pages/Home';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';

// Dynamic imports for code splitting
const About = lazy(() => import('../pages/About'));
const UserProfile = lazy(() => import('../pages/UserProfile'));
const ProductDetails = lazy(() => import('../pages/ProductDetails'));
const CreatePost = lazy(()
