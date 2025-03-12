# Building a Todo List App with React and Context API: A Step-by-Step Guide

In this tutorial, we'll build a simple todo list application to understand React basics with a focus on state management using the Context API. This project will help you understand:

- React component structure
- Context API for state management
- React Hooks (useState, useContext, useEffect)
- Form handling in React
- Conditional rendering

## Project Overview

Our todo list app will allow users to:
- Add new tasks
- Mark tasks as complete
- Delete tasks
- Filter tasks (All, Active, Completed)

## Setting Up the Project

### Step 1: Create a New React Application

Open your terminal and run:

```bash
npx create-react-app todo-app
cd todo-app
```

### Step 2: Clean Up the Project

Remove unnecessary files from the starter project:

1. Delete the following files:
   - `src/App.test.js`
   - `src/logo.svg`
   - `src/reportWebVitals.js`
   - `src/setupTests.js`

2. Clean up `src/App.js` to look like this:

```jsx
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Todo App</h1>
    </div>
  );
}

export default App;
```

3. Clean up `src/index.js` to look like this:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Step 3: Create the Project Structure

Create the following folder structure:

```
todo-app/
├── node_modules/
├── public/
├── src/
│   ├── components/
│   │   ├── TodoForm.js
│   │   ├── TodoItem.js
│   │   ├── TodoList.js
│   │   └── TodoFilter.js
│   ├── context/
│   │   └── TodoContext.js
│   ├── App.css
│   ├── App.js
│   ├── index.css
│   └── index.js
├── package.json
└── README.md
```

To create this structure, run these commands:

```bash
mkdir -p src/components src/context
touch src/components/TodoForm.js src/components/TodoItem.js src/components/TodoList.js src/components/TodoFilter.js
touch src/context/TodoContext.js
```

## Creating the Context API for State Management

### Step 4: Set Up the TodoContext

The Context API allows us to share state between components without prop drilling. Let's implement it:

File: `src/context/TodoContext.js`

```jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Create the context
const TodoContext = createContext();

// Initial state
const initialState = {
  todos: JSON.parse(localStorage.getItem('todos')) || [],
  filter: 'all' // 'all', 'active', or 'completed'
};

// Actions
const ADD_TODO = 'ADD_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const DELETE_TODO = 'DELETE_TODO';
const SET_FILTER = 'SET_FILTER';

// Reducer function
function todoReducer(state, action) {
  switch (action.type) {
    case ADD_TODO:
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: Date.now(),
            text: action.payload,
            completed: false
          }
        ]
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
    
    case DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
    
    case SET_FILTER:
      return {
        ...state,
        filter: action.payload
      };
    
    default:
      return state;
  }
}

// Provider component
export function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  
  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(state.todos));
  }, [state.todos]);
  
  // Action creators
  const addTodo = (text) => {
    if (text.trim()) {
      dispatch({ type: ADD_TODO, payload: text });
    }
  };
  
  const toggleTodo = (id) => {
    dispatch({ type: TOGGLE_TODO, payload: id });
  };
  
  const deleteTodo = (id) => {
    dispatch({ type: DELETE_TODO, payload: id });
  };
  
  const setFilter = (filter) => {
    dispatch({ type: SET_FILTER, payload: filter });
  };
  
  // Get filtered todos
  const filteredTodos = state.todos.filter(todo => {
    if (state.filter === 'active') return !todo.completed;
    if (state.filter === 'completed') return todo.completed;
    return true; // 'all' filter
  });
  
  // The value that will be provided to consumers
  const value = {
    todos: state.todos,
    filteredTodos,
    filter: state.filter,
    addTodo,
    toggleTodo,
    deleteTodo,
    setFilter
  };
  
  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

// Custom hook to use the todo context
export function useTodo() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
}
```

This file sets up everything we need for state management:

1. **Context Creation**: We create a context that will hold our todo state.
2. **Reducer**: We implement a reducer that handles different actions (add, toggle, delete).
3. **Provider Component**: This component wraps our app and provides the state to all children.
4. **Custom Hook**: The `useTodo` hook makes it easy to use our context in components.
5. **Local Storage**: We use `useEffect` to save todos to local storage.

## Building Components

### Step 5: Create the TodoForm Component

File: `src/components/TodoForm.js`

```jsx
import React, { useState } from 'react';
import { useTodo } from '../context/TodoContext';

function TodoForm() {
  const [text, setText] = useState('');
  const { addTodo } = useTodo();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text);
      setText(''); // Clear the input after adding
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new task..."
        className="todo-input"
      />
      <button type="submit" className="add-button">Add</button>
    </form>
  );
}

export default TodoForm;
```

This component:
- Uses the `useState` hook to manage the input field's state
- Uses our custom `useTodo` hook to get the `addTodo` function from context
- Handles form submission and clears the input after adding a task

### Step 6: Create the TodoItem Component

File: `src/components/TodoItem.js`

```jsx
import React from 'react';
import { useTodo } from '../context/TodoContext';

function TodoItem({ todo }) {
  const { toggleTodo, deleteTodo } = useTodo();
  
  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
        className="todo-checkbox"
      />
      <span 
        className={`todo-text ${todo.completed ? 'completed' : ''}`}
      >
        {todo.text}
      </span>
      <button 
        onClick={() => deleteTodo(todo.id)}
        className="delete-button"
      >
        Delete
      </button>
    </div>
  );
}

export default TodoItem;
```

This component:
- Displays a single todo item with a checkbox and delete button
- Uses our context to toggle or delete a todo
- Adds a CSS class to completed todos for styling

### Step 7: Create the TodoList Component

File: `src/components/TodoList.js`

```jsx
import React from 'react';
import TodoItem from './TodoItem';
import { useTodo } from '../context/TodoContext';

function TodoList() {
  const { filteredTodos } = useTodo();
  
  if (filteredTodos.length === 0) {
    return <p className="empty-list">No tasks to display</p>;
  }
  
  return (
    <div className="todo-list">
      {filteredTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}

export default TodoList;
```

This component:
- Gets the filtered todos from our context
- Maps over the todos and renders a `TodoItem` for each one
- Shows a message when there are no todos to display

### Step 8: Create the TodoFilter Component

File: `src/components/TodoFilter.js`

```jsx
import React from 'react';
import { useTodo } from '../context/TodoContext';

function TodoFilter() {
  const { filter, setFilter } = useTodo();
  
  return (
    <div className="todo-filter">
      <button 
        className={filter === 'all' ? 'active' : ''}
        onClick={() => setFilter('all')}
      >
        All
      </button>
      <button 
        className={filter === 'active' ? 'active' : ''}
        onClick={() => setFilter('active')}
      >
        Active
      </button>
      <button 
        className={filter === 'completed' ? 'active' : ''}
        onClick={() => setFilter('completed')}
      >
        Completed
      </button>
    </div>
  );
}

export default TodoFilter;
```

This component:
- Displays filter buttons (All, Active, Completed)
- Gets the current filter and `setFilter` function from context
- Applies an 'active' class to the currently selected filter

### Step 9: Update the App Component

Now let's put everything together in our App component:

File: `src/App.js`

```jsx
import React from 'react';
import './App.css';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import TodoFilter from './components/TodoFilter';
import { TodoProvider } from './context/TodoContext';

function App() {
  return (
    <TodoProvider>
      <div className="App">
        <h1>Todo List</h1>
        <div className="todo-container">
          <TodoForm />
          <TodoFilter />
          <TodoList />
        </div>
      </div>
    </TodoProvider>
  );
}

export default App;
```

This component:
- Wraps everything in the `TodoProvider` so all components have access to our context
- Arranges our components in the desired layout

### Step 10: Add Some CSS Styling

Let's add some basic styling to make our app look nice:

File: `src/App.css`

```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  background-color: #f7f7f7;
  color: #333;
}

.App {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
}

.todo-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

/* TodoForm styles */
.todo-form {
  display: flex;
  margin-bottom: 20px;
}

.todo-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 16px;
}

.add-button {
  padding: 10px 15px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  font-size: 16px;
}

.add-button:hover {
  background-color: #2980b9;
}

/* TodoFilter styles */
.todo-filter {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.todo-filter button {
  padding: 8px 12px;
  margin: 0 5px;
  background-color: #f1f1f1;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.todo-filter button.active {
  background-color: #3498db;
  color: white;
}

/* TodoList styles */
.todo-list {
  margin-top: 20px;
}

.empty-list {
  text-align: center;
  color: #7f8c8d;
  margin: 20px 0;
}

/* TodoItem styles */
.todo-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-checkbox {
  margin-right: 10px;
  cursor: pointer;
}

.todo-text {
  flex: 1;
  font-size: 16px;
}

.todo-text.completed {
  text-decoration: line-through;
  color: #7f8c8d;
}

.delete-button {
  padding: 5px 10px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
}

.delete-button:hover {
  background-color: #c0392b;
}
```

## Running the Application

### Step 11: Start the Development Server

Now that we've built all the components, let's run the application:

```bash
npm start
```

Your browser should open automatically at `http://localhost:3000` showing your todo list application.

## Understanding the Flow

Let's review how data flows through our application:

1. **State Management (Context API)**:
   - The `TodoContext` provides the state and functions to all components
   - The reducer handles state updates based on dispatched actions
   - Local storage is used to persist todos between page refreshes

2. **Component Hierarchy**:
   - `App` wraps everything in the `TodoProvider`
   - `TodoForm` adds new todos
   - `TodoList` displays the filtered list of todos
   - `TodoItem` displays each individual todo
   - `TodoFilter` allows the user to switch between different views

3. **User Interactions**:
   - When a user adds a task, `TodoForm` calls the `addTodo` function from context
   - When a user checks/unchecks a task, `TodoItem` calls the `toggleTodo` function
   - When a user deletes a task, `TodoItem` calls the `deleteTodo` function
   - When a user clicks a filter button, `TodoFilter` calls the `setFilter` function

## Next Steps for Learning

Now that you've built this app, here are some ways to extend it for further learning:

1. **Add Task Editing**:
   - Allow users to edit existing tasks
   - Add an "Edit" button to `TodoItem`
   - Create a new action in the reducer

2. **Add Categories or Tags**:
   - Allow users to categorize tasks
   - Add a dropdown to the form for selecting categories
   - Extend filtering to include categories

3. **Add Due Dates**:
   - Allow users to set due dates for tasks
   - Sort tasks by due date
   - Highlight overdue tasks

4. **Add User Authentication**:
   - Add a login system
   - Store todos per user in a database
   - Use Firebase or another BaaS for backend

## Troubleshooting Common Issues

### "React Hook useContext cannot be called at the top level"
Make sure you're calling hooks inside component functions, not at the top level of your module.

### "Cannot read properties of undefined (reading 'map')"
This usually means your context value is undefined. Make sure your component is wrapped in the `TodoProvider`.

### "Objects are not valid as a React child"
You're trying to render an object directly. Convert it to a string or extract the specific properties you want to display.

### "Too many re-renders"
This usually happens when you have an infinite loop in your effect or event handlers. Check that your effect dependencies are correct and that you're not updating state within a render.

## Conclusion

Congratulations! You've built a simple todo list application using React and Context API. This project demonstrates:

- How to structure a React application
- How to use the Context API for state management
- How to use React Hooks for state and context
- How to handle forms and user input
- How to persist data with localStorage

By understanding these fundamentals, you're well on your way to building more complex React applications. The Context API approach you've learned here can scale to larger applications when organized properly, though for very complex apps you might want to explore other state management solutions like Redux or Zustand.

Happy coding!
