# Advanced React Concepts: Mastering Modern React Development

## Table of Contents

1. [Introduction](#introduction)
2. [Advanced Component Patterns](#advanced-component-patterns)
   - [Compound Components](#compound-components)
   - [Render Props](#render-props)
   - [Higher-Order Components (HOCs)](#higher-order-components-hocs)
   - [Custom Hooks](#custom-hooks)
   - [Component Composition vs. Inheritance](#component-composition-vs-inheritance)
3. [Performance Optimization](#performance-optimization)
   - [React.memo and PureComponent](#reactmemo-and-purecomponent)
   - [useMemo and useCallback](#usememo-and-usecallback)
   - [Code Splitting and Lazy Loading](#code-splitting-and-lazy-loading)
   - [Virtualization for Long Lists](#virtualization-for-long-lists)
   - [Tree Shaking and Bundle Optimization](#tree-shaking-and-bundle-optimization)
4. [State Management at Scale](#state-management-at-scale)
   - [Context API Patterns](#context-api-patterns)
   - [Reducers with TypeScript](#reducers-with-typescript)
   - [State Machines with XState](#state-machines-with-xstate)
   - [Immutable State with Immer](#immutable-state-with-immer)
   - [Global Store Architecture](#global-store-architecture)
5. [Advanced Hooks](#advanced-hooks)
   - [Custom Hook Design Patterns](#custom-hook-design-patterns)
   - [Hook Dependencies Optimization](#hook-dependencies-optimization)
   - [useImperativeHandle and forwardRef](#useimperativehandle-and-forwardref)
   - [useLayoutEffect vs useEffect](#uselayouteffect-vs-useeffect)
   - [useDebugValue and useId](#usedebugvalue-and-useid)
6. [Testing Advanced React Components](#testing-advanced-react-components)
   - [Testing Hooks](#testing-hooks)
   - [Testing Context Providers](#testing-context-providers)
   - [Testing Async Components](#testing-async-components)
   - [Mocking API Calls](#mocking-api-calls)
   - [Snapshot Testing vs. Behavior Testing](#snapshot-testing-vs-behavior-testing)
7. [Advanced Routing and Navigation](#advanced-routing-and-navigation)
   - [Nested Routes and Layouts](#nested-routes-and-layouts)
   - [Route Protection and Authentication](#route-protection-and-authentication)
   - [URL State Management](#url-state-management)
   - [Data Fetching with React Router](#data-fetching-with-react-router)
   - [Animated Route Transitions](#animated-route-transitions)
8. [React Server Components](#react-server-components)
   - [Client vs. Server Components](#client-vs-server-components)
   - [Data Fetching Patterns](#data-fetching-patterns)
   - [Streaming and Suspense](#streaming-and-suspense)
   - [Progressive Enhancement](#progressive-enhancement)
9. [TypeScript with React](#typescript-with-react)
   - [Advanced Type Patterns](#advanced-type-patterns)
   - [Generic Components](#generic-components)
   - [Type-Safe Context and Reducers](#type-safe-context-and-reducers)
   - [TypeScript with Custom Hooks](#typescript-with-custom-hooks)
10. [Building a Design System](#building-a-design-system)
    - [Component API Design](#component-api-design)
    - [Composition vs. Configuration](#composition-vs-configuration)
    - [Theming and Styling Solutions](#theming-and-styling-solutions)
    - [Accessibility Patterns](#accessibility-patterns)
11. [Data Fetching Strategies](#data-fetching-strategies)
    - [Advanced React Query Techniques](#advanced-react-query-techniques)
    - [SWR and Stale-While-Revalidate Pattern](#swr-and-stale-while-revalidate-pattern)
    - [Optimistic Updates](#optimistic-updates)
    - [Caching Strategies](#caching-strategies)
12. [Real-world Case Studies](#real-world-case-studies)
    - [Building a High-Performance Dashboard](#building-a-high-performance-dashboard)
    - [Implementing Multi-step Forms](#implementing-multi-step-forms)
    - [Authentication System Architecture](#authentication-system-architecture)
    - [Micro-frontend Architecture](#micro-frontend-architecture)

## Introduction

This guide is designed for React developers who have mastered the fundamentals and are ready to dive into advanced concepts and patterns. We'll explore techniques used by senior React developers to build scalable, maintainable, and high-performance applications. Each section includes practical examples and real-world scenarios.

## Advanced Component Patterns

### Compound Components

Compound components are a pattern where multiple components work together to form a cohesive API. Think of them like the native `<select>` and `<option>` elements in HTML.

**Example: Tabs Component**

```jsx
// Implementation
const TabsContext = React.createContext();

function Tabs({ children, defaultIndex = 0 }) {
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);
  
  const value = React.useMemo(() => ({
    selectedIndex,
    setSelectedIndex,
  }), [selectedIndex]);
  
  return (
    <TabsContext.Provider value={value}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }) {
  return <div className="tab-list">{children}</div>;
}

function Tab({ children, index }) {
  const { selectedIndex, setSelectedIndex } = useContext(TabsContext);
  
  return (
    <button
      className={`tab ${selectedIndex === index ? 'active' : ''}`}
      onClick={() => setSelectedIndex(index)}
    >
      {children}
    </button>
  );
}

function TabPanels({ children }) {
  return <div className="tab-panels">{children}</div>;
}

function TabPanel({ children, index }) {
  const { selectedIndex } = useContext(TabsContext);
  
  return selectedIndex === index ? (
    <div className="tab-panel">{children}</div>
  ) : null;
}

// Assemble the compound component
Tabs.TabList = TabList;
Tabs.Tab = Tab;
Tabs.TabPanels = TabPanels;
Tabs.TabPanel = TabPanel;
```

**Usage:**

```jsx
function App() {
  return (
    <Tabs defaultIndex={0}>
      <Tabs.TabList>
        <Tabs.Tab index={0}>Profile</Tabs.Tab>
        <Tabs.Tab index={1}>Settings</Tabs.Tab>
        <Tabs.Tab index={2}>Notifications</Tabs.Tab>
      </Tabs.TabList>
      
      <Tabs.TabPanels>
        <Tabs.TabPanel index={0}>
          <h2>Profile Content</h2>
          <p>Your profile information here</p>
        </Tabs.TabPanel>
        <Tabs.TabPanel index={1}>
          <h2>Settings Content</h2>
          <p>Your settings information here</p>
        </Tabs.TabPanel>
        <Tabs.TabPanel index={2}>
          <h2>Notifications Content</h2>
          <p>Your notification preferences here</p>
        </Tabs.TabPanel>
      </Tabs.TabPanels>
    </Tabs>
  );
}
```

**Benefits:**
- Expressive and declarative API
- Flexible component placement
- Logical grouping of related components
- Internal state handling without prop drilling

### Render Props

Render props is a pattern where a component's prop is a function that returns a React element, giving the component control over what to render.

**Example: Toggler Component**

```jsx
function Toggler({ render }) {
  const [isOn, setIsOn] = useState(false);
  
  const toggle = () => setIsOn(prev => !prev);
  
  return render({ isOn, toggle });
}

// Usage
function App() {
  return (
    <Toggler
      render={({ isOn, toggle }) => (
        <div>
          <button onClick={toggle}>
            {isOn ? 'Turn Off' : 'Turn On'}
          </button>
          <p>The light is {isOn ? 'on' : 'off'}</p>
        </div>
      )}
    />
  );
}
```

**Alternative Usage with Children Prop:**

```jsx
function Toggler({ children }) {
  const [isOn, setIsOn] = useState(false);
  
  const toggle = () => setIsOn(prev => !prev);
  
  return children({ isOn, toggle });
}

// Usage
function App() {
  return (
    <Toggler>
      {({ isOn, toggle }) => (
        <div>
          <button onClick={toggle}>
            {isOn ? 'Turn Off' : 'Turn On'}
          </button>
          <p>The light is {isOn ? 'on' : 'off'}</p>
        </div>
      )}
    </Toggler>
  );
}
```

**Benefits:**
- Maximum flexibility in rendering
- Separation of behavior from rendering
- Easy composition of multiple render props
- Avoids HOC wrapper hell

### Higher-Order Components (HOCs)

Higher-Order Components are functions that take a component and return a new enhanced component.

**Example: withAuth HOC**

```jsx
function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
      // Simulated auth check
      const checkAuth = async () => {
        try {
          setIsLoading(true);
          // In a real app, you would check a token or session
          const response = await fetch('/api/auth/me');
          const data = await response.json();
          
          setIsAuthenticated(true);
          setUser(data.user);
        } catch (error) {
          setIsAuthenticated(false);
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      };
      
      checkAuth();
    }, []);
    
    if (isLoading) {
      return <div>Loading authentication status...</div>;
    }
    
    if (!isAuthenticated) {
      return <div>Please log in to access this content</div>;
    }
    
    // Pass through all props plus additional auth related props
    return <Component {...props} user={user} />;
  };
}

// Usage
function UserProfile({ user }) {
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}

const AuthenticatedUserProfile = withAuth(UserProfile);

// In your app
function App() {
  return <AuthenticatedUserProfile />;
}
```

**Benefits:**
- Reuse logic across multiple components
- Clean separation of concerns
- Predictable behavior across components
- Good for cross-cutting concerns (auth, logging, etc.)

**Drawbacks:**
- Can create wrapper hell (multiple HOCs nested)
- Harder to debug
- Naming collisions in props
- Less popular since Hooks introduction

### Custom Hooks

Custom Hooks allow you to extract component logic into reusable functions that can use React's built-in hooks.

**Example: useFormValidation**

```jsx
function useFormValidation(initialValues, validationRules) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);
  
  // Update form values
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
  };
  
  // Validate a single field
  const validateField = (name, value) => {
    if (!validationRules[name]) return '';
    
    const rules = validationRules[name];
    
    if (rules.required && !value) {
      return 'This field is required';
    }
    
    if (rules.minLength && value.length < rules.minLength) {
      return `Must be at least ${rules.minLength} characters`;
    }
    
    if (rules.pattern && !rules.pattern.test(value)) {
      return rules.message || 'Invalid format';
    }
    
    return '';
  };
  
  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    let formIsValid = true;
    
    Object.keys(validationRules).forEach(field => {
      const errorMessage = validateField(field, values[field]);
      if (errorMessage) {
        newErrors[field] = errorMessage;
        formIsValid = false;
      }
    });
    
    setErrors(newErrors);
    setIsValid(formIsValid);
    
    return formIsValid;
  };
  
  // Handle blur event for field validation
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const errorMessage = validateField(name, value);
    
    setErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
  };
  
  // Handle form submission
  const handleSubmit = (callback) => async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formIsValid = validateForm();
    
    if (formIsValid && callback) {
      await callback(values);
    }
    
    setIsSubmitting(false);
  };
  
  // Reset form to initial values
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  };
  
  return {
    values,
    errors,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm
  };
}

// Usage
function SignupForm() {
  const { 
    values, 
    errors, 
    isSubmitting, 
    handleChange, 
    handleBlur, 
    handleSubmit 
  } = useFormValidation(
    { email: '', password: '' },
    {
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email'
      },
      password: {
        required: true,
        minLength: 8
      }
    }
  );
  
  const submitForm = async (formValues) => {
    console.log('Submitting form with values:', formValues);
    // API call would go here
  };
  
  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.email && <p className="error">{errors.email}</p>}
      </div>
      
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.password && <p className="error">{errors.password}</p>}
      </div>
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Sign Up'}
      </button>
    </form>
  );
}
```

**Benefits:**
- Reuse stateful logic across components
- Organize related logic in a single place
- Easier testing and composition
- More readable component code

### Component Composition vs. Inheritance

React recommends composition over inheritance for reusing code between components.

**Problem with Inheritance:**

```jsx
// Base component
class Button extends React.Component {
  render() {
    return (
      <button className="button" onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

// Inheriting component - THIS IS NOT THE REACT WAY
class DangerButton extends Button {
  render() {
    const buttonElement = super.render();
    return React.cloneElement(buttonElement, {
      className: `${buttonElement.props.className} button-danger`
    });
  }
}
```

**Better Approach with Composition:**

```jsx
// Base button component
function Button({ className, children, ...props }) {
  return (
    <button className={`button ${className}`} {...props}>
      {children}
    </button>
  );
}

// Specialized buttons using composition
function DangerButton(props) {
  return <Button className="button-danger" {...props} />;
}

function PrimaryButton(props) {
  return <Button className="button-primary" {...props} />;
}

// Composition with containment
function Dialog({ title, children }) {
  return (
    <div className="dialog">
      <div className="dialog-header">
        <h2>{title}</h2>
      </div>
      <div className="dialog-content">
        {children}
      </div>
    </div>
  );
}

// Usage
function App() {
  return (
    <Dialog title="Important Message">
      <p>This is an important message!</p>
      <div className="dialog-actions">
        <PrimaryButton>Accept</PrimaryButton>
        <DangerButton>Decline</DangerButton>
      </div>
    </Dialog>
  );
}
```

**Benefits of Composition:**
- More flexible than inheritance
- Explicit and easier to understand
- Better for component reuse
- Aligns with React's philosophy

## Performance Optimization

### React.memo and PureComponent

`React.memo` (for function components) and `PureComponent` (for class components) implement shallow prop comparison to prevent unnecessary re-renders.

**Example: Using React.memo**

```jsx
// Without memo - will re-render whenever parent re-renders
function UserProfile({ user }) {
  console.log('UserProfile render');
  return (
    <div>
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
    </div>
  );
}

// With memo - only re-renders if props change
const MemoizedUserProfile = React.memo(function UserProfile({ user }) {
  console.log('MemoizedUserProfile render');
  return (
    <div>
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
    </div>
  );
});

// With custom comparison function
const MemoizedUserProfileCustom = React.memo(
  function UserProfile({ user }) {
    console.log('MemoizedUserProfileCustom render');
    return (
      <div>
        <h2>{user.name}</h2>
        <p>Email: {user.email}</p>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if name or email changes
    return (
      prevProps.user.name === nextProps.user.name &&
      prevProps.user.email === nextProps.user.email
    );
  }
);
```

**Example: Using PureComponent (Class components)**

```jsx
// Regular Component - will re-render on every parent render
class UserProfile extends React.Component {
  render() {
    console.log('UserProfile render');
    return (
      <div>
        <h2>{this.props.user.name}</h2>
        <p>Email: {this.props.user.email}</p>
      </div>
    );
  }
}

// PureComponent - only re-renders if shallow prop comparison shows changes
class UserProfilePure extends React.PureComponent {
  render() {
    console.log('UserProfilePure render');
    return (
      <div>
        <h2>{this.props.user.name}</h2>
        <p>Email: {this.props.user.email}</p>
      </div>
    );
  }
}
```

**When to use:**
- For expensive render operations
- For components that render often with the same props
- To prevent renders in large component trees

**When NOT to use:**
- For components that almost always receive different props
- When the component is simple and rendering is cheap
- When the component relies on context changes

### useMemo and useCallback

`useMemo` memoizes expensive calculations, while `useCallback` memoizes functions to prevent unnecessary recreations.

**Example: useMemo for Expensive Calculations**

```jsx
function ProductList({ products, filter }) {
  // Without memoization - recalculates on every render
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(filter.toLowerCase())
  );
  
  // With useMemo - only recalculates when dependencies change
  const memoizedFilteredProducts = useMemo(() => {
    console.log('Filtering products...');
    return products.filter(product => 
      product.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [products, filter]);
  
  return (
    <ul>
      {memoizedFilteredProducts.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

**Example: useCallback for Event Handlers**

```jsx
function Parent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  
  // Without useCallback - a new function is created on every render
  const handleClick = () => {
    setCount(count + 1);
  };
  
  // With useCallback - function is memoized
  const memoizedHandleClick = useCallback(() => {
    setCount(prevCount => prevCount + 1);
  }, []); // Empty dependencies array - function never changes
  
  // With dependencies that change - function recreated when dependencies change
  const alertText = useCallback(() => {
    alert(text);
  }, [text]);
  
  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <p>Count: {count}</p>
      
      {/* Will cause MemoizedButton to re-render on every Parent render */}
      <Button onClick={handleClick}>Increment (Non-Memoized)</Button>
      
      {/* Will NOT cause MemoizedButton to re-render unnecessarily */}
      <MemoizedButton onClick={memoizedHandleClick}>
        Increment (Memoized)
      </MemoizedButton>
      
      <MemoizedButton onClick={alertText}>
        Alert Text (Memoized but changes when text changes)
      </MemoizedButton>
    </div>
  );
}

// A memoized button component
const MemoizedButton = React.memo(function Button({ onClick, children }) {
  console.log(`Button "${children}" rendered`);
  return <button onClick={onClick}>{children}</button>;
});
```

**Best Practices:**
1. Use `useMemo` for expensive calculations
2. Use `useCallback` when passing callbacks to optimized child components
3. Keep dependency arrays as small as possible
4. Don't overuse - there's a performance cost to memoization itself

### Code Splitting and Lazy Loading

Code splitting allows you to split your code into smaller chunks which can be loaded on demand.

**Example: Basic Route-based Code Splitting**

```jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Regular import - loaded immediately
import Home from './pages/Home';
import NavBar from './components/NavBar';

// Lazy loaded components - only loaded when needed
const About = lazy(() => import('./pages/About'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
  return (
    <Router>
      <NavBar />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
```

**Example: Component-level Code Splitting**

```jsx
import React, { Suspense, lazy, useState } from 'react';

// Lazy load a heavy component
const HeavyChart = lazy(() => import('./components/HeavyChart'));

function Dashboard() {
  const [showChart, setShowChart] = useState(false);
  
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <button onClick={() => setShowChart(!showChart)}>
        {showChart ? 'Hide Chart' : 'Show Chart'}
      </button>
      
      {showChart && (
        <Suspense fallback={<div>Loading chart...</div>}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  );
}
```

**Advanced: Preloading Components**

```jsx
// Define lazy components
const HeavyFeature = lazy(() => import('./components/HeavyFeature'));

// Create preload function
const preloadHeavyFeature = () => import('./components/HeavyFeature');

function App() {
  return (
    <div>
      <button 
        onMouseOver={preloadHeavyFeature} // Preload on hover
        onClick={() => setShowFeature(true)}
      >
        Show Heavy Feature
      </button>
      
      {showFeature && (
        <Suspense fallback={<div>Loading...</div>}>
          <HeavyFeature />
        </Suspense>
      )}
    </div>
  );
}
```

**Benefits:**
- Reduces initial load time
- Only loads code when needed
- Better user experience for large applications

### Virtualization for Long Lists

Virtualization renders only the visible items in a long list, improving performance.

**Example: Using react-window**

```jsx
import React from 'react';
import { FixedSizeList } from 'react-window';

// Sample data - imagine this is thousands of items
const bigList = Array(10000)
  .fill()
  .map((_, index) => ({
    id: index,
    name: `Item ${index}`,
    description: `Description for item ${index}`
  }));

// Row component for a single item
function Row({ index, style, data }) {
  const item = data[index];
  
  return (
    <div style={{
      ...style,
      display: 'flex',
      alignItems: 'center',
      padding: '8px',
      borderBottom: '1px solid #eee'
    }}>
      <div>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
      </div>
    </div>
  );
}

function VirtualizedList() {
  return (
    <div>
      <h2>Virtualized List with 10,000 Items</h2>
      
      <FixedSizeList
        height={400}
        width="100%"
        itemCount={bigList.length}
        itemSize={80}
        itemData={bigList}
      >
        {Row}
      </FixedSizeList>
    </div>
  );
}
```

**Example: Using react-window with variable sizes**

```jsx
import { VariableSizeList } from 'react-window';

// Get item size function
const getItemSize = index => {
  // Items with even indexes are taller
  return index % 2 === 0 ? 80 : 50;
};

function VariableSizedList() {
  return (
    <div>
      <h2>Variable Height List</h2>
      
      <VariableSizeList
        height={400}
        width="100%"
        itemCount={bigList.length}
        itemSize={getItemSize}
        itemData={bigList}
      >
        {Row}
      </VariableSizeList>
    </div>
  );
}
```

**Benefits:**
- Drastically improves performance for long lists
- Reduces DOM size and memory usage
- Smooth scrolling even with thousands of items
- Works well in combination with infinite loading

### Tree Shaking and Bundle Optimization

Tree shaking removes unused code from your bundle, reducing its size.

**Example: Proper ES Module Imports**

```jsx
// Bad - imports entire lodash library
import _ from 'lodash';

// Good - only imports what's needed
import { debounce, throttle } from 'lodash-es';

// Even better - direct imports
import debounce from 'lodash-es/debounce';
import throttle from 'lodash-es/throttle';
```

**Example: Analyzing Bundle Size**

```bash
# Add webpack-bundle-analyzer to your project
npm install --save-dev webpack-bundle-analyzer

# For Create React App, you can use source-map-explorer
npm install --save-dev source-map-explorer

# Add to package.json scripts
"analyze": "source-map-explorer 'build/static/js/*.js'"

# Then build and analyze
npm run build
npm run analyze
```

**Example: Dynamic Imports in Component**

```jsx
import React, { useState } from 'react';

function App() {
  const [MomentComponent, setMomentComponent] = useState(null);
  
  const loadMoment = async () => {
    // Only load the heavy library when needed
    const moment = await import('moment');
    setMomentComponent(() => () => (
      <div>Current time: {moment.default().format('MMMM Do YYYY, h:mm:ss a')}</div>
    ));
  };
  
  return (
    <div>
      <button onClick={loadMoment}>Show Current Time with Moment.js</button>
      {MomentComponent && <MomentComponent />}
    </div>
  );
}
```

**Webpack Configuration Tips:**

```js
// webpack.config.js
module.exports = {
  // Enable tree shaking
  mode: 'production',
  optimization: {
    usedExports: true,
    minimize: true,
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // Get the name. E.g. node_modules/packageName/sub/path
            // or node_modules/packageName
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1];
            
            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
  },
};
```

**Benefits:**
- Smaller bundle sizes
- Faster load times
- Better user experience
- Reduced memory usage

## State Management at Scale

### Context API Patterns

Here are some advanced patterns for using Context
