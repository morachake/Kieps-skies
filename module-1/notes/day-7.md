# Mastering React State Management and API Integration

## Table of Contents
1. [Introduction to State in React](#introduction-to-state-in-react)
2. [Local State Management](#local-state-management)
3. [Component Communication Patterns](#component-communication-patterns)
4. [Context API for State Management](#context-api-for-state-management)
5. [State Management with Reducers](#state-management-with-reducers)
6. [External State Management Libraries](#external-state-management-libraries)
7. [API Integration Fundamentals](#api-integration-fundamentals)
8. [Advanced Data Fetching Patterns](#advanced-data-fetching-patterns)
9. [Error Handling in API Calls](#error-handling-in-api-calls)
10. [Caching and Performance Optimization](#caching-and-performance-optimization)
11. [Authentication and Authorization](#authentication-and-authorization)
12. [Real-time Data with WebSockets](#real-time-data-with-websockets)
13. [Testing State and API Logic](#testing-state-and-api-logic)
14. [Best Practices and Common Pitfalls](#best-practices-and-common-pitfalls)
15. [Practical Examples and Case Studies](#practical-examples-and-case-studies)

## Introduction to State in React

### What is State?

State in React represents the data that can change over time and affects what is rendered on the screen. Unlike props, which are passed from parent to child and are immutable within a component, state is fully managed within a component (or in dedicated state management solutions).

State is essential for:
- User interactions (form inputs, toggles, selections)
- Data from API calls
- UI state (loading, errors, visibility)
- Application state (authentication, preferences)

### Types of State in React Applications

1. **Local Component State**: Data that belongs to a single component
2. **Shared/Lifted State**: Data shared between multiple components through their common ancestor
3. **Global Application State**: Data accessible throughout the entire application
4. **URL State**: Data stored in the URL (query parameters, route parameters)
5. **Form State**: The values and validity of form inputs
6. **Server State**: Data fetched from APIs that represents server-side data

### State Principles in React

1. **Immutability**: Never mutate state directly; create new state objects
2. **Single Source of Truth**: For each piece of state, have one component that "owns" it
3. **Unidirectional Data Flow**: Data flows down the component tree
4. **Minimize State**: Only store values in state that actually need to trigger re-renders
5. **Derive When Possible**: Calculate values from existing state/props rather than duplicating state

## Local State Management

### useState Hook

The most basic way to manage state in functional components:

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

#### useState with Objects

When working with object state, remember to spread the previous state:

```jsx
const [user, setUser] = useState({
  name: '',
  email: '',
  preferences: {
    darkMode: false,
    notifications: true
  }
});

// Updating a nested property
setUser(prevUser => ({
  ...prevUser,
  preferences: {
    ...prevUser.preferences,
    darkMode: true
  }
}));
```

#### Lazy Initial State

If the initial state is expensive to compute, use a function:

```jsx
// Bad - computes on every render
const [items, setItems] = useState(expensiveComputation());

// Good - computes only once during initialization
const [items, setItems] = useState(() => expensiveComputation());
```

#### Independent vs. Combined State

Deciding when to use multiple state variables vs. one object:

```jsx
// Multiple independent state variables
const [name, setName] = useState('');
const [age, setAge] = useState(0);
const [isActive, setIsActive] = useState(false);

// Combined state - better for related values
const [formData, setFormData] = useState({
  name: '',
  age: 0,
  isActive: false
});
```

#### Functional Updates

When new state depends on the previous state, use functional updates:

```jsx
// Might lead to incorrect state if multiple updates are batched
setCount(count + 1);

// Guarantees correct state regardless of batching
setCount(prevCount => prevCount + 1);
```

### State Initialization Patterns

#### From Props

Initializing state based on props:

```jsx
function UserProfile({ initialUser }) {
  const [user, setUser] = useState(initialUser);
  // ...
}
```

#### From Local Storage

Persisting and retrieving state:

```jsx
function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Get stored value or default to false
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : false;
  });
  
  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);
  
  // ...
}
```

### State Updates and Batching

React batches state updates for performance. In React 18+, all state updates are batched automatically:

```jsx
function handleClick() {
  // These are batched into a single render
  setCount(c => c + 1);
  setFlag(true);
  setName('Alex');
}
```

In earlier versions, only state updates within React event handlers were batched. For async code, you could use `unstable_batchedUpdates`.

### Controlled vs. Uncontrolled Components

#### Controlled Components

Form elements whose values are controlled by React state:

```jsx
function ControlledForm() {
  const [inputValue, setInputValue] = useState('');
  
  return (
    <input
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
    />
  );
}
```

#### Uncontrolled Components

Form elements that manage their own state, accessed via refs:

```jsx
function UncontrolledForm() {
  const inputRef = useRef(null);
  
  function handleSubmit() {
    console.log(inputRef.current.value);
  }
  
  return (
    <>
      <input ref={inputRef} defaultValue="Initial value" />
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
}
```

## Component Communication Patterns

### Props Drilling

The simplest form of component communication:

```jsx
function Parent() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <Child count={count} onIncrement={() => setCount(count + 1)} />
    </div>
  );
}

function Child({ count, onIncrement }) {
  return (
    <div>
      <GrandChild count={count} onIncrement={onIncrement} />
    </div>
  );
}

function GrandChild({ count, onIncrement }) {
  return (
    <button onClick={onIncrement}>
      Count: {count}
    </button>
  );
}
```

Props drilling becomes cumbersome with deeply nested components.

### Component Composition

Using children props to avoid excessive prop passing:

```jsx
function Page() {
  const [user, setUser] = useState(null);
  
  return (
    <Layout>
      <Sidebar>
        <UserProfile user={user} />
      </Sidebar>
      <Content>
        <UserSettings user={user} onUpdateUser={setUser} />
      </Content>
    </Layout>
  );
}

function Layout({ children }) {
  return <div className="layout">{children}</div>;
}

function Sidebar({ children }) {
  return <div className="sidebar">{children}</div>;
}

function Content({ children }) {
  return <div className="content">{children}</div>;
}
```

### Render Props Pattern

Passing a function as a prop that returns React elements:

```jsx
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    function handleMouseMove(event) {
      setPosition({ x: event.clientX, y: event.clientY });
    }
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return render(position);
}

// Usage
function App() {
  return (
    <MouseTracker
      render={({ x, y }) => (
        <div>
          The mouse position is ({x}, {y})
        </div>
      )}
    />
  );
}
```

### Custom Events with Event Emitters

For more complex event-based communication:

```jsx
import { EventEmitter } from 'events';

// Create a singleton event bus
export const eventBus = new EventEmitter();

// Component A: Emit event
function ComponentA() {
  function handleClick() {
    eventBus.emit('my-event', { data: 'Hello from A' });
  }
  
  return <button onClick={handleClick}>Trigger Event</button>;
}

// Component B: Listen for event
function ComponentB() {
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    function handleEvent(payload) {
      setMessage(payload.data);
    }
    
    eventBus.on('my-event', handleEvent);
    return () => eventBus.off('my-event', handleEvent);
  }, []);
  
  return <div>Message: {message}</div>;
}
```

## Context API for State Management

### Creating and Using Context

```jsx
import { createContext, useContext, useState } from 'react';

// Create a context with default value
const UserContext = createContext(null);

// Provider component
function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  
  // Login/logout functions
  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);
  
  // Value object passed to consumers
  const value = {
    user,
    login,
    logout,
    isLoggedIn: user !== null
  };
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook for using this context
function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

// Wrap your app
function App() {
  return (
    <UserProvider>
      <Dashboard />
      <Settings />
    </UserProvider>
  );
}

// Use in components
function Dashboard() {
  const { user, logout } = useUser();
  
  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Multiple Contexts

Organizing different domains of state:

```jsx
function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <NotificationProvider>
          <MainContent />
        </NotificationProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
```

### Context Performance Considerations

Context triggers re-renders for all consuming components when its value changes. Optimize with:

1. **Split contexts by domain**: Create separate contexts for unrelated state
2. **Memoize context values**: Prevent unnecessary re-renders
3. **Use context selectors**: Only subscribe to specific parts of context

```jsx
// Memoizing context value
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  // Memoize the value object to prevent unnecessary re-renders
  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### Context + useReducer Pattern

Combining context with reducer for complex state:

```jsx
import { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  todos: [],
  loading: false,
  error: null
};

// Actions
const ADD_TODO = 'ADD_TODO';
const REMOVE_TODO = 'REMOVE_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const SET_LOADING = 'SET_LOADING';
const SET_ERROR = 'SET_ERROR';

// Reducer
function todoReducer(state, action) {
  switch (action.type) {
    case ADD_TODO:
      return {
        ...state,
        todos: [...state.todos, action.payload]
      };
    case REMOVE_TODO:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
    case TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
}

// Create context
const TodoContext = createContext();

// Provider component
function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  
  // Action creators
  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false
    };
    dispatch({ type: ADD_TODO, payload: newTodo });
  };
  
  const removeTodo = (id) => {
    dispatch({ type: REMOVE_TODO, payload: id });
  };
  
  const toggleTodo = (id) => {
    dispatch({ type: TOGGLE_TODO, payload: id });
  };
  
  // Value object
  const value = {
    todos: state.todos,
    loading: state.loading,
    error: state.error,
    addTodo,
    removeTodo,
    toggleTodo,
    dispatch
  };
  
  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
}

// Custom hook
function useTodos() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
}

// Usage in components
function TodoList() {
  const { todos, toggleTodo, removeTodo } = useTodos();
  
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
          />
          <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            {todo.text}
          </span>
          <button onClick={() => removeTodo(todo.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
```

## State Management with Reducers

### useReducer Hook

For complex state logic that involves multiple sub-values or when the next state depends on the previous one:

```jsx
import { useReducer } from 'react';

// Initial state
const initialState = { count: 0 };

// Reducer function
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    case 'set':
      return { count: action.payload };
    default:
      throw new Error(`Unsupported action type: ${action.type}`);
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <div>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
      <button onClick={() => dispatch({ type: 'set', payload: 10 })}>Set to 10</button>
    </div>
  );
}
```

### When to Use useReducer vs useState

**Use useState when:**
- State is simple (primitive values, simple objects)
- Few state transitions
- No need to share state between components
- No complex updates logic

**Use useReducer when:**
- Complex state objects with multiple sub-fields
- State transitions depend on previous state
- Complex business logic for updates
- Frequent state changes
- Need to test state updates separately from components

### Structuring Reducers

#### Action Types as Constants

```jsx
const ACTIONS = {
  ADD_TASK: 'ADD_TASK',
  TOGGLE_TASK: 'TOGGLE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  SET_FILTER: 'SET_FILTER'
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_TASK:
      // Add task logic
      return {...};
    // ...
  }
}
```

#### Action Creators

Functions that create action objects:

```jsx
function addTask(task) {
  return { type: ACTIONS.ADD_TASK, payload: task };
}

function toggleTask(id) {
  return { type: ACTIONS.TOGGLE_TASK, payload: id };
}

// Usage in component
dispatch(addTask({ id: Date.now(), text: 'New task', completed: false }));
```

#### Combining Reducers

For large applications, split by domain:

```jsx
// Tasks reducer
function tasksReducer(state, action) {
  switch (action.type) {
    case 'ADD_TASK':
    case 'TOGGLE_TASK':
    case 'DELETE_TASK':
      // Task-related logic
      return {...};
    default:
      return state;
  }
}

// UI reducer
function uiReducer(state, action) {
  switch (action.type) {
    case 'SET_FILTER':
    case 'TOGGLE_SIDEBAR':
    case 'SET_THEME':
      // UI-related logic
      return {...};
    default:
      return state;
  }
}

// Combined reducer
function reducer(state, action) {
  return {
    tasks: tasksReducer(state.tasks, action),
    ui: uiReducer(state.ui, action)
  };
}
```

### Async Operations with useReducer

Using a middleware-like pattern for async operations:

```jsx
import { useReducer, useCallback } from 'react';

// Action types
const FETCH_START = 'FETCH_START';
const FETCH_SUCCESS = 'FETCH_SUCCESS';
const FETCH_ERROR = 'FETCH_ERROR';

// Reducer
function reducer(state, action) {
  switch (action.type) {
    case FETCH_START:
      return { ...state, loading: true, error: null };
    case FETCH_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        data: action.payload, 
        error: null 
      };
    case FETCH_ERROR:
      return { 
        ...state, 
        loading: false, 
        error: action.payload 
      };
    default:
      return state;
  }
}

function useAsync(initialState) {
  const [state, dispatch] = useReducer(reducer, {
    data: null,
    loading: false,
    error: null,
    ...initialState
  });

  const run = useCallback(async (promise) => {
    dispatch({ type: FETCH_START });
    
    try {
      const data = await promise;
      dispatch({ type: FETCH_SUCCESS, payload: data });
      return data;
    } catch (error) {
      dispatch({ type: FETCH_ERROR, payload: error.message });
      return Promise.reject(error);
    }
  }, []);

  return { ...state, run };
}

// Usage in component
function UserProfile({ userId }) {
  const { data: user, loading, error, run } = useAsync();
  
  useEffect(() => {
    run(fetchUser(userId));
  }, [userId, run]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return null;
  
  return <div>{user.name}</div>;
}
```

## External State Management Libraries

### Redux

The most popular state management library with a large ecosystem:

```jsx
// Store setup
import { createStore } from 'redux';

// Reducer
function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

const store = createStore(counterReducer);

// Component integration with React-Redux
import { Provider, useSelector, useDispatch } from 'react-redux';

function App() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
}

function Counter() {
  // Select data from store
  const count = useSelector(state => state.count);
  
  // Get dispatch function
  const dispatch = useDispatch();
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>
        Increment
      </button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>
        Decrement
      </button>
    </div>
  );
}
```

#### Redux Toolkit (RTK)

Modern Redux with less boilerplate:

```jsx
import { configureStore, createSlice } from '@reduxjs/toolkit';

// Create a slice (combines actions and reducers)
const counterSlice = createSlice({
  name: 'counter',
  initialState: { count: 0 },
  reducers: {
    increment: state => {
      state.count += 1; // RTK uses Immer for immutable updates
    },
    decrement: state => {
      state.count -= 1;
    },
    incrementByAmount: (state, action) => {
      state.count += action.payload;
    }
  }
});

// Extract action creators and reducer
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// Configure store
const store = configureStore({
  reducer: {
    counter: counterSlice.reducer
  }
});

// Usage in component
function Counter() {
  const count = useSelector(state => state.counter.count);
  const dispatch = useDispatch();
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(increment())}>
        Increment
      </button>
      <button onClick={() => dispatch(incrementByAmount(5))}>
        Add 5
      </button>
    </div>
  );
}
```

### Zustand

A minimalist approach to state management:

```jsx
import create from 'zustand';

// Create a store
const useStore = create(set => ({
  bears: 0,
  increasePopulation: () => set(state => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 })
}));

// Use in component
function BearCounter() {
  const bears = useStore(state => state.bears);
  const increasePopulation = useStore(state => state.increasePopulation);
  
  return (
    <div>
      <h1>{bears} bears around here...</h1>
      <button onClick={increasePopulation}>Add a bear</button>
    </div>
  );
}
```

### Jotai

Atomic state management:

```jsx
import { atom, useAtom } from 'jotai';

// Define atoms
const countAtom = atom(0);
const doubleCountAtom = atom(get => get(countAtom) * 2);

function Counter() {
  // Use atoms
  const [count, setCount] = useAtom(countAtom);
  const [doubleCount] = useAtom(doubleCountAtom);
  
  return (
    <div>
      <p>Count: {count}</p>
      <p>Double: {doubleCount}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}
```

### Recoil

Facebook's experimental state management library:

```jsx
import { RecoilRoot, atom, selector, useRecoilState, useRecoilValue } from 'recoil';

// Define atom (basic state)
const counterState = atom({
  key: 'counterState',
  default: 0
});

// Define selector (derived state)
const doubleCounterState = selector({
  key: 'doubleCounterState',
  get: ({ get }) => {
    const count = get(counterState);
    return count * 2;
  }
});

function App() {
  return (
    <RecoilRoot>
      <Counter />
    </RecoilRoot>
  );
}

function Counter() {
  const [count, setCount] = useRecoilState(counterState);
  const doubleCount = useRecoilValue(doubleCounterState);
  
  return (
    <div>
      <p>Count: {count}</p>
      <p>Double: {doubleCount}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### MobX

Observable state management:

```jsx
import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite';

// State store
class CounterStore {
  count = 0;
  
  constructor() {
    makeAutoObservable(this);
  }
  
  increment() {
    this.count += 1;
  }
  
  decrement() {
    this.count -= 1;
  }
  
  get doubleCount() {
    return this.count * 2;
  }
}

const counterStore = new CounterStore();

// Observer component
const Counter = observer(() => {
  return (
    <div>
      <p>Count: {counterStore.count}</p>
      <p>Double count: {counterStore.doubleCount}</p>
      <button onClick={() => counterStore.increment()}>+</button>
      <button onClick={() => counterStore.decrement()}>-</button>
    </div>
  );
});
```

### Choosing a State Management Solution

| Library | Best For | Trade-offs |
|---------|----------|------------|
| Context + useReducer | Medium-sized apps, when you want to stick with React | Limited dev tools, performance concerns with large state |
| Redux | Large apps, complex state logic, time-travel debugging | Verbose, steeper learning curve |
| Redux Toolkit | Same as Redux but with less boilerplate | Still has Redux complexity |
| Zustand | Simpler apps, when you want minimal API | Less ecosystem support |
| Jotai/Recoil | Atomic state, when you need fine-grained updates | Newer, less mature |
| MobX | When you prefer an OOP approach | Different programming paradigm from React |

## API Integration Fundamentals

### Basic Data Fetching

Using the native Fetch API:

```jsx
import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Flag to handle component unmount
    let isMounted = true;
    
    async function fetchUsers() {
      try {
        const response = await fetch('https://api.example.com/users');
        
        // Check for HTTP errors
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Only update state if component is still mounted
        if (isMounted) {
          setUsers(data);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message);
          setLoading(false);
        }
      }
    }
    
    fetchUsers();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Axios Library

Using Axios for more consistent API handling:

```jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Create a cancel token source
    const source = axios.CancelToken.source();
    
    async function fetchUsers() {
      try {
        const response = await axios.get('https://api.example.com/users', {
          cancelToken: source.token
        });
        
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        if (!axios.isCancel(error)) {
          setError(error.message);
          setLoading(false);
        }
      }
    }
    
    fetchUsers();
    
    // Cleanup function to cancel the request on unmount
    return () => {
      source.cancel('Component unmounted');
    };
  }, []);
  
  // Render logic
}
```

### Custom Hook for Data Fetching

Creating a reusable hook:

```jsx
function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Don't fetch if no URL provided
    if (!url) {
      setLoading(false);
      return;
    }
    
    const abortController = new AbortController();
    
    async function fetchData() {
      try {
        setLoading(true);
        
        const response = await fetch(url, {
          ...options,
          signal: abortController.signal
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
