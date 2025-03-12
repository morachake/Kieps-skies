# React.js: A Comprehensive Guide for Beginners

## Table of Contents
1. [Introduction to React](#introduction-to-react)
2. [Core Concepts](#core-concepts)
3. [Setting Up Your First React Project](#setting-up-your-first-react-project)
4. [JSX: JavaScript + XML](#jsx-javascript--xml)
5. [Components: The Building Blocks of React](#components-the-building-blocks-of-react)
6. [Props: Passing Data Between Components](#props-passing-data-between-components)
7. [State: Managing Data Within Components](#state-managing-data-within-components)
8. [Handling Events in React](#handling-events-in-react)
9. [Conditional Rendering](#conditional-rendering)
10. [Lists and Keys](#lists-and-keys)
11. [Forms in React](#forms-in-react)
12. [Component Lifecycle and Hooks](#component-lifecycle-and-hooks)
13. [Styling in React](#styling-in-react)
14. [React Router: Navigation in React Applications](#react-router-navigation-in-react-applications)
15. [State Management Beyond useState](#state-management-beyond-usestate)
16. [Making API Calls in React](#making-api-calls-in-react)
17. [Common Mistakes and Debugging](#common-mistakes-and-debugging)
18. [Best Practices](#best-practices)
19. [Next Steps in Your React Journey](#next-steps-in-your-react-journey)

## Introduction to React

### What is React?
React is a JavaScript library created by Facebook (now Meta) for building user interfaces. It allows developers to create large web applications that can update and render efficiently in response to data changes without reloading the page.

### Why React?
- **Component-Based Architecture**: React breaks down complex UIs into reusable, self-contained components
- **Declarative Approach**: You describe how your UI should look at any given point, and React handles updates
- **Virtual DOM**: React creates a lightweight copy of the actual DOM for performance optimization
- **One-Way Data Flow**: Data flows from parent to child components, making the code more predictable and easier to debug
- **Rich Ecosystem**: React has a vibrant community and ecosystem of libraries

### React vs Other Frameworks
While Angular and Vue.js are full-fledged frameworks, React is technically a library focused specifically on the view layer. This gives React flexibility but sometimes requires additional libraries for full application functionality.

## Core Concepts

### The Virtual DOM
One of React's key innovations is the Virtual DOM, which works as follows:

1. React creates a virtual representation of your UI in memory
2. When state changes occur, React:
   - Creates a new virtual DOM with the updated state
   - Compares it with the previous version (diffing)
   - Calculates the minimal number of operations needed to update the real DOM
   - Updates only what needs to change in the actual browser DOM

This process, called reconciliation, makes React applications fast and efficient.

### Component-Based Architecture
Everything in React is a component. A component is a self-contained, reusable piece of code that returns a React element describing what should appear on the screen.

### Unidirectional Data Flow
Data in React flows in one direction: from parent components down to child components. This makes applications more predictable and easier to understand.

## Setting Up Your First React Project

### Using Create React App
The easiest way to start with React is using Create React App, a tool that sets up a new React project with a good default configuration:

```bash
npx create-react-app my-first-app
cd my-first-app
npm start
```

This creates a new React application called "my-first-app" and starts a development server.

### Project Structure
A typical Create React App project structure:

```
my-first-app/
├── node_modules/
├── public/
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── index.css
│   ├── index.js
│   ├── logo.svg
│   └── reportWebVitals.js
├── .gitignore
├── package.json
└── README.md
```

Key files:
- `public/index.html`: The HTML template for your app
- `src/index.js`: The JavaScript entry point
- `src/App.js`: The main App component

### Using Vite (Alternative to Create React App)
Vite is a newer, faster build tool that's gaining popularity:

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
```

## JSX: JavaScript + XML

### What is JSX?
JSX is a syntax extension for JavaScript that looks similar to HTML but comes with the full power of JavaScript. It's not required for React, but most React developers use it because it visually represents the UI structure.

### JSX Syntax Rules
- JSX elements must close (self-closing tags need `/`)
- JSX can only return a single root element (wrap multiple elements in a fragment `<>...</>`)
- JavaScript expressions can be used inside JSX with curly braces `{}`
- React component names must start with a capital letter
- HTML attributes are written in camelCase in JSX (e.g., `className` instead of `class`)

### JSX Examples

Basic JSX:
```jsx
const element = <h1>Hello, world!</h1>;
```

JSX with JavaScript expressions:
```jsx
const name = 'John';
const element = <h1>Hello, {name}!</h1>;
```

JSX with attributes:
```jsx
const element = <img src={user.avatarUrl} alt="User profile" />;
```

Multi-line JSX (use parentheses):
```jsx
const element = (
  <div>
    <h1>Hello!</h1>
    <p>Welcome to React</p>
  </div>
);
```

### How JSX Works
Behind the scenes, JSX is transformed into regular JavaScript by tools like Babel. For example:

```jsx
const element = <h1>Hello, world!</h1>;
```

Becomes:
```javascript
const element = React.createElement('h1', null, 'Hello, world!');
```

## Components: The Building Blocks of React

### Types of Components

#### Functional Components
Simple, stateless components (though they can use Hooks for state):

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

#### Class Components
More feature-rich components with lifecycle methods:

```jsx
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

Note: Modern React favors functional components with Hooks over class components.

### Component Composition
Components can be nested and composed:

```jsx
function App() {
  return (
    <div>
      <Welcome name="Alice" />
      <Welcome name="Bob" />
      <Welcome name="Charlie" />
    </div>
  );
}
```

### Component Reusability
Components are designed to be reusable. Think of them as custom HTML elements that can be used multiple times with different properties.

## Props: Passing Data Between Components

### What Are Props?
Props (short for properties) are how components receive data from their parent. They are read-only and help make components reusable.

### How to Pass Props
From parent to child:

```jsx
function ParentComponent() {
  return <ChildComponent name="John" age={25} isActive={true} />;
}

function ChildComponent(props) {
  return (
    <div>
      <p>Name: {props.name}</p>
      <p>Age: {props.age}</p>
      <p>Active: {props.isActive ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

### Props Destructuring
For cleaner syntax:

```jsx
function ChildComponent({ name, age, isActive }) {
  return (
    <div>
      <p>Name: {name}</p>
      <p>Age: {age}</p>
      <p>Active: {isActive ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

### Default Props
You can set default values for props:

```jsx
function ChildComponent({ name, age, isActive = false }) {
  // ...
}

// Or using defaultProps (older approach)
ChildComponent.defaultProps = {
  isActive: false
};
```

### Children Props
React has a special prop called `children` that contains the content between component tags:

```jsx
function Container({ children }) {
  return <div className="container">{children}</div>;
}

// Usage
function App() {
  return (
    <Container>
      <h1>This is the content</h1>
      <p>It gets passed as the children prop</p>
    </Container>
  );
}
```

## State: Managing Data Within Components

### What is State?
State is a JavaScript object that stores data that might change over time and affects what is rendered. Unlike props, state is private and fully controlled by the component.

### useState Hook
In modern React, functional components use the `useState` Hook to manage state:

```jsx
import React, { useState } from 'react';

function Counter() {
  // Declare a state variable named "count" with initial value 0
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

### State Updates
State updates in React are asynchronous and may be batched for performance. When updating state based on the previous state, use the functional form:

```jsx
// Instead of this:
setCount(count + 1);

// Do this:
setCount(prevCount => prevCount + 1);
```

### State vs Props

| State                              | Props                                |
|------------------------------------|--------------------------------------|
| Managed within a component         | Passed to a component                |
| Can be changed by the component    | Read-only                            |
| Changes trigger re-renders         | Changes from parent trigger re-renders |
| Used for data that changes over time | Used for configuration and passing data |

### Managing Complex State
For complex state objects:

```jsx
const [user, setUser] = useState({
  name: 'John',
  age: 25,
  preferences: {
    theme: 'dark',
    notifications: true
  }
});

// Updating nested objects (preserve immutability)
setUser(prevUser => ({
  ...prevUser,
  preferences: {
    ...prevUser.preferences,
    theme: 'light'
  }
}));
```

## Handling Events in React

### Event Handling Basics
React events are named using camelCase and passed as functions:

```jsx
function Button() {
  function handleClick() {
    alert('Button was clicked!');
  }

  return <button onClick={handleClick}>Click Me</button>;
}
```

### Event Object
React events pass a synthetic event object:

```jsx
function Form() {
  function handleSubmit(event) {
    event.preventDefault(); // Prevents the default form submission
    console.log('Form submitted');
  }

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Passing Parameters to Event Handlers
You can pass parameters to event handlers using arrow functions:

```jsx
function ItemList() {
  function handleItemClick(id, event) {
    console.log(`Item ${id} clicked`);
  }

  return (
    <ul>
      <li onClick={(e) => handleItemClick(1, e)}>Item 1</li>
      <li onClick={(e) => handleItemClick(2, e)}>Item 2</li>
    </ul>
  );
}
```

### Common Events
- `onClick`: Triggered when an element is clicked
- `onChange`: Triggered when form inputs change
- `onSubmit`: Triggered when a form is submitted
- `onMouseEnter`/`onMouseLeave`: Triggered when the mouse enters/leaves an element
- `onFocus`/`onBlur`: Triggered when an element gains/loses focus

## Conditional Rendering

### If-Else with Variables
```jsx
function Greeting({ isLoggedIn }) {
  let content;
  
  if (isLoggedIn) {
    content = <h1>Welcome back!</h1>;
  } else {
    content = <h1>Please sign in</h1>;
  }
  
  return <div>{content}</div>;
}
```

### Ternary Operator
```jsx
function Greeting({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn 
        ? <h1>Welcome back!</h1> 
        : <h1>Please sign in</h1>}
    </div>
  );
}
```

### Logical && Operator
For simple "render or don't render" conditions:

```jsx
function Notifications({ messages }) {
  return (
    <div>
      {messages.length > 0 && (
        <h2>You have {messages.length} unread messages.</h2>
      )}
    </div>
  );
}
```

### Switch-Case
For multiple conditions:

```jsx
function Status({ status }) {
  switch(status) {
    case 'loading':
      return <Spinner />;
    case 'success':
      return <SuccessMessage />;
    case 'error':
      return <ErrorMessage />;
    default:
      return null;
  }
}
```

## Lists and Keys

### Rendering Lists
Use the `map()` method to transform arrays into lists of elements:

```jsx
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

### Keys
Keys help React identify items that have changed, been added, or been removed. Keys should be:
- Unique among siblings
- Stable across renders
- Typically from your data (like IDs)

```jsx
// Good: Using stable IDs
{todos.map(todo => <li key={todo.id}>{todo.text}</li>)}

// Acceptable only if items won't reorder: Using index as key
{todos.map((todo, index) => <li key={index}>{todo.text}</li>)}
```

### Handling List Updates
When a list updates, React uses keys to determine what changed:
- With proper keys, React updates only the changed elements
- Without keys or with poorly chosen keys, the entire list might re-render

## Forms in React

### Controlled Components
In controlled components, form data is handled by React state:

```jsx
function NameForm() {
  const [name, setName] = useState('');

  function handleChange(event) {
    setName(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    alert('Submitted name: ' + name);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" value={name} onChange={handleChange} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Handling Multiple Inputs
For forms with multiple inputs:

```jsx
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log(formData);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Message"
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Form Input Types
React supports all HTML form elements:
- Text inputs
- Textareas
- Select dropdowns
- Checkboxes
- Radio buttons
- File inputs (these are uncontrolled by default)

### Validation
Basic form validation example:

```jsx
function ValidationForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function handleChange(e) {
    const value = e.target.value;
    setEmail(value);
    
    if (value && !validateEmail(value)) {
      setError('Please enter a valid email');
    } else {
      setError('');
    }
  }

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={handleChange}
        placeholder="Email"
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
```

## Component Lifecycle and Hooks

### Functional Component Lifecycle with Hooks

#### useState
Declares a state variable:

```jsx
const [count, setCount] = useState(0);
```

#### useEffect
Performs side effects after render:

```jsx
// Runs after every render
useEffect(() => {
  document.title = `You clicked ${count} times`;
});

// Runs only when count changes
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]);

// Runs only once after initial render (like componentDidMount)
useEffect(() => {
  fetchData();
}, []);

// Cleanup (like componentWillUnmount)
useEffect(() => {
  const subscription = subscribe();
  return () => {
    // Cleanup code
    subscription.unsubscribe();
  };
}, []);
```

#### useContext
Accesses context without nesting:

```jsx
const theme = useContext(ThemeContext);
```

#### useRef
Creates a mutable reference:

```jsx
const inputRef = useRef(null);

// Later in your code
inputRef.current.focus();
```

#### useCallback
Memoizes callback functions:

```jsx
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

#### useMemo
Memoizes expensive calculations:

```jsx
const memoizedValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);
```

### Custom Hooks
Create reusable logic across components:

```jsx
// Custom hook for form handling
function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
  }

  function resetForm() {
    setValues(initialValues);
  }

  return { values, handleChange, resetForm };
}

// Usage
function SignupForm() {
  const { values, handleChange, resetForm } = useForm({
    username: '',
    email: '',
    password: ''
  });
  
  // Use these values and functions in your form
}
```

## Styling in React

### Inline Styles
Apply styles directly with JavaScript objects:

```jsx
function Button() {
  const buttonStyle = {
    backgroundColor: 'blue',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer'
  };

  return <button style={buttonStyle}>Click Me</button>;
}
```

### CSS Classes
Use traditional CSS with className:

```jsx
// In your CSS file
.button {
  background-color: blue;
  color: white;
  /* other styles */
}

// In your component
function Button() {
  return <button className="button">Click Me</button>;
}
```

### CSS Modules
Locally scoped CSS classes:

```jsx
// Button.module.css
.button {
  background-color: blue;
  color: white;
}

// Button.js
import styles from './Button.module.css';

function Button() {
  return <button className={styles.button}>Click Me</button>;
}
```

### Styled Components
CSS-in-JS library for component-scoped styles:

```jsx
import styled from 'styled-components';

const StyledButton = styled.button`
  background-color: blue;
  color: white;
  padding: 10px 15px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  
  &:hover {
    background-color: darkblue;
  }
`;

function Button() {
  return <StyledButton>Click Me</StyledButton>;
}
```

### CSS-in-JS Libraries
Other popular styling approaches:
- Emotion
- Tailwind CSS (utility classes)
- Material-UI's styling system

## React Router: Navigation in React Applications

### Setting Up React Router
```jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Navigation Components
- `<Link>`: For navigation without page reload
- `<NavLink>`: Like Link, but with active state styling
- `useNavigate()`: Programmatic navigation

```jsx
import { useNavigate } from 'react-router-dom';

function LoginButton() {
  const navigate = useNavigate();
  
  function handleLogin() {
    // After successful login
    navigate('/dashboard');
  }
  
  return <button onClick={handleLogin}>Log In</button>;
}
```

### URL Parameters
```jsx
// In your routes
<Route path="/users/:userId" element={<UserProfile />} />

// In UserProfile component
import { useParams } from 'react-router-dom';

function UserProfile() {
  const { userId } = useParams();
  
  return <div>Profile of user {userId}</div>;
}
```

### Nested Routes
```jsx
<Routes>
  <Route path="/dashboard" element={<Dashboard />}>
    <Route index element={<Overview />} />
    <Route path="stats" element={<Stats />} />
    <Route path="settings" element={<Settings />} />
  </Route>
</Routes>

// In Dashboard component
import { Outlet } from 'react-router-dom';

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Outlet /> {/* Nested route components render here */}
    </div>
  );
}
```

## State Management Beyond useState

### useReducer
For complex state logic:

```jsx
import { useReducer } from 'react';

// Reducer function
function counterReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      throw new Error();
  }
}

function Counter() {
  const initialState = { count: 0 };
  const [state, dispatch] = useReducer(counterReducer, initialState);
  
  return (
    <div>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}
```

### Context API
For passing data through the component tree without props drilling:

```jsx
// Create context
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

// Provider component
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  function toggleTheme() {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Use the context
function ThemedButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <button 
      style={{ 
        backgroundColor: theme === 'light' ? 'white' : 'black',
        color: theme === 'light' ? 'black' : 'white'
      }}
      onClick={toggleTheme}
    >
      Toggle Theme
    </button>
  );
}

// Wrap your app
function App() {
  return (
    <ThemeProvider>
      <ThemedButton />
      {/* Other components that can access the theme */}
    </ThemeProvider>
  );
}
```

### External State Management Libraries
For large applications:

- **Redux**: Predictable state container with a single store
- **MobX**: Simple, scalable state management with observables
- **Recoil**: Facebook's experimental state management library
- **Zustand**: Simple yet powerful state management
- **Jotai**: Atomic state management

## Making API Calls in React

### Fetch API
Using the built-in Fetch API with useEffect:

```jsx
import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
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

### Axios
Using the popular Axios library:

```jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Render logic here...
}
```

### Custom Hook for API Calls
Create a reusable hook:

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    async function fetchData() {
      try {
        const response = await fetch(url, { signal: abortController.signal });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setError(error.message);
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [url]);

  return { data, loading, error };
}

// Usage
function UserList() {
  const { data, loading, error } = useFetch('https://jsonplaceholder.typicode.com/users');

  // Render logic here...
}
```

### React Query
Popular data-fetching library:

```jsx
import { useQuery } from 'react-query';

function fetchUsers() {
  return fetch('https://jsonplaceholder.typicode.com/users').then(res => res.json());
}

function UserList() {
  const { data, isLoading, error } = useQuery('users', fetchUsers);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

## Common Mistakes and Debugging

### State and Props Mistakes
- Mutating state directly (use setters)
- Modifying props (props are read-only)
- Not using the functional update form when new state depends on old state
- Forgetting that setState is asynchronous

### useEffect Mistakes
- Missing dependencies in the dependency array
- Infinite re-render loops from incorrect dependencies
- Not cleaning up subscriptions or timers
- Using useEffect when not necessary

### Render Optimization
- Creating functions or objects during render (move outside or use memoization)
- Unnecessary re-renders (use React.memo, useMemo, useCallback)
- Large component trees without proper splitting

### React Developer Tools
Browser extension that provides:
- Component tree inspection
- Props and state visualization
- Performance profiling
- Debugging tools

### Common Error Messages
- "Adjacent JSX elements must be wrapped in an enclosing tag"
- "Cannot update a component while rendering a different component"
- "Too many re-renders"
- "Objects are not valid as a React child"

## Best Practices

### Component Organization
- One component per file
- Group related components in folders
- Use index files for cleaner imports
- Separate containers (logic) from presentational components (UI)

### Performance Optimization
- Use React.memo for pure functional components
- Memoize expensive calculations with useMemo
- Memoize callback functions with useCallback
- Use virtualization for long lists (react-window, react-virtualized)
- Lazy load components with React.lazy and Suspense

```jsx
const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
