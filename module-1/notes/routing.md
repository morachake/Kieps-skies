# React Router Dom Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Basic Setup](#basic-setup)
4. [Core Components](#core-components)
   - [BrowserRouter](#browserrouter)
   - [Routes and Route](#routes-and-route)
   - [Link and NavLink](#link-and-navlink)
   - [Navigate](#navigate)
   - [Outlet](#outlet)
5. [Route Parameters](#route-parameters)
6. [Nested Routes](#nested-routes)
7. [Protected Routes](#protected-routes)
8. [Hooks](#hooks)
   - [useParams](#useparams)
   - [useNavigate](#usenavigate)
   - [useLocation](#uselocation)
   - [useSearchParams](#usesearchparams)
   - [useMatch](#usematch)
9. [Lazy Loading](#lazy-loading)
10. [404 Pages](#404-pages)
11. [Query Parameters](#query-parameters)
12. [Advanced Concepts](#advanced-concepts)
    - [Data Loading](#data-loading)
    - [Route Loaders](#route-loaders)
    - [Route Actions](#route-actions)
13. [Best Practices](#best-practices)
14. [Migrating from v5 to v6](#migrating-from-v5-to-v6)

## Introduction <a name="introduction"></a>

React Router Dom is a standard library for routing in React applications. It enables navigation between views in your single-page application (SPA), allowing users to navigate through different components without refreshing the page, while maintaining the browser history and enabling bookmarking.

React Router v6 introduced several significant changes from v5, including a more declarative API, automatic route ranking, and improved hooks.

## Installation <a name="installation"></a>

Install React Router Dom using npm or yarn:

```bash
# Using npm
npm install react-router-dom

# Using yarn
yarn add react-router-dom
```

## Basic Setup <a name="basic-setup"></a>

Here's a basic setup to get started with React Router:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import your components
import App from './App';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import NotFound from './components/NotFound';

// Create root and render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
```

Your `App.js` file should include an Outlet to render the matched route:

```jsx
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

function App() {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet /> {/* This is where the matched route will render */}
      </main>
    </div>
  );
}

export default App;
```

## Core Components <a name="core-components"></a>

### BrowserRouter <a name="browserrouter"></a>

`BrowserRouter` is a router implementation that uses the HTML5 history API to keep your UI in sync with the URL. It should wrap your entire application.

```jsx
import { BrowserRouter } from 'react-router-dom';

function Root() {
  return (
    <BrowserRouter>
      {/* The rest of your app goes here */}
    </BrowserRouter>
  );
}
```

**Props:**
- `basename`: The base URL for all locations. Useful when your app is served from a sub-directory.
- `window`: The window object to use. Useful for testing.

### Routes and Route <a name="routes-and-route"></a>

`Routes` component replaces the `Switch` component from v5. It renders the first `Route` that matches the current URL.

`Route` defines a mapping between a URL path and a component to render.

```jsx
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Contact from './Contact';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}
```

**Route Props:**
- `path`: The URL pattern to match
- `element`: The React element to render when the path matches
- `index`: Specifies this route as the default child route for a parent route
- `caseSensitive`: Whether the path is case-sensitive (defaults to false)

### Link and NavLink <a name="link-and-navlink"></a>

`Link` is used to navigate between pages without refreshing the page.

```jsx
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
    </nav>
  );
}
```

`NavLink` is a special type of `Link` that knows whether it's "active" or not. This is useful for building navigation menus.

```jsx
import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <NavLink 
            to="/"
            className={({ isActive }) => isActive ? "active" : ""}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/about"
            className={({ isActive }) => isActive ? "active" : ""}
          >
            About
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
```

**Link/NavLink Props:**
- `to`: The URL to navigate to
- `replace`: If true, replaces the current entry in the history stack instead of adding a new one
- `state`: State to persist to the `location`

**NavLink Additional Props:**
- `className`: Can be a function that receives `{ isActive }` and returns a class name
- `style`: Can be a function that receives `{ isActive }` and returns style object
- `end`: When true, the NavLink will only be active when the current URL exactly matches the 'to' path

### Navigate <a name="navigate"></a>

`Navigate` is a component that changes the current location when it is rendered. It's useful for redirects.

```jsx
import { Navigate } from 'react-router-dom';

function PrivateRoute({ user, children }) {
  return user ? children : <Navigate to="/login" replace />;
}
```

**Navigate Props:**
- `to`: The URL to navigate to
- `replace`: If true, replaces the current entry in the history stack
- `state`: State to persist to the `location`

### Outlet <a name="outlet"></a>

`Outlet` renders the currently matched child route of a parent route. It's essential for nested routes.

```jsx
import { Outlet } from 'react-router-dom';

function DashboardLayout() {
  return (
    <div>
      <h1>Dashboard</h1>
      <nav>
        <Link to="stats">Stats</Link>
        <Link to="settings">Settings</Link>
      </nav>
      <div className="content">
        <Outlet /> {/* Will render either Stats or Settings */}
      </div>
    </div>
  );
}
```

## Route Parameters <a name="route-parameters"></a>

Route parameters allow you to extract dynamic parts of the URL.

```jsx
import { Routes, Route, useParams } from 'react-router-dom';

// Define a route with parameters
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/users/:userId" element={<UserProfile />} />
      <Route path="/products/:category/:productId" element={<ProductDetail />} />
    </Routes>
  );
}

// Access parameters in component
function UserProfile() {
  const { userId } = useParams();
  return <div>User ID: {userId}</div>;
}

function ProductDetail() {
  const { category, productId } = useParams();
  return (
    <div>
      <p>Category: {category}</p>
      <p>Product ID: {productId}</p>
    </div>
  );
}
```

## Nested Routes <a name="nested-routes"></a>

Nested routes allow you to create complex layouts where portions of the UI are dependent on the URL.

```jsx
import { Routes, Route, Outlet, Link } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        
        {/* Nested routes */}
        <Route path="dashboard" element={<Dashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="stats" element={<DashboardStats />} />
          <Route path="settings" element={<DashboardSettings />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function Layout() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>
      <main>
        <Outlet /> {/* Renders matched child */}
      </main>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <nav>
        <Link to="">Overview</Link> {/* Links to index route */}
        <Link to="stats">Stats</Link>
        <Link to="settings">Settings</Link>
      </nav>
      <Outlet /> {/* Renders matched child */}
    </div>
  );
}
```

## Protected Routes <a name="protected-routes"></a>

Protected routes restrict access to certain routes based on authentication or authorization status.

```jsx
import { Navigate, Outlet } from 'react-router-dom';

// Auth context (simplified)
const useAuth = () => {
  const user = localStorage.getItem('user');
  return !!user; // Returns true if user is authenticated
};

// Protected route component
function ProtectedRoute() {
  const isAuthenticated = useAuth();
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  // Render children routes if authenticated
  return <Outlet />;
}

// Usage in routes
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      
      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
```

## Hooks <a name="hooks"></a>

React Router provides several hooks to access routing information and functionality.

### useParams <a name="useparams"></a>

`useParams` returns an object with the current URL parameters.

```jsx
import { useParams } from 'react-router-dom';

function ProductDetail() {
  const { productId } = useParams();
  
  return <div>Product ID: {productId}</div>;
}
```

### useNavigate <a name="usenavigate"></a>

`useNavigate` returns a function that lets you navigate programmatically.

```jsx
import { useNavigate } from 'react-router-dom';

function ProductList() {
  const navigate = useNavigate();
  
  function handleProductClick(productId) {
    // Navigate to product detail page
    navigate(`/products/${productId}`);
  }
  
  function goBack() {
    // Go back one page in history
    navigate(-1);
  }
  
  function goToHome() {
    // Navigate and replace current history entry
    navigate('/', { replace: true });
  }
  
  return (
    <div>
      <button onClick={goBack}>Back</button>
      <button onClick={goToHome}>Home</button>
      <ul>
        <li onClick={() => handleProductClick('1')}>Product 1</li>
        <li onClick={() => handleProductClick('2')}>Product 2</li>
      </ul>
    </div>
  );
}
```

### useLocation <a name="uselocation"></a>

`useLocation` returns the current location object, which represents the current URL.

```jsx
import { useLocation } from 'react-router-dom';

function CurrentLocation() {
  const location = useLocation();
  
  return (
    <div>
      <p>Current pathname: {location.pathname}</p>
      <p>Search params: {location.search}</p>
      <p>Hash: {location.hash}</p>
      <p>State: {JSON.stringify(location.state)}</p>
    </div>
  );
}
```

### useSearchParams <a name="usesearchparams"></a>

`useSearchParams` is like React's `useState` but for the URL search parameters.

```jsx
import { useSearchParams } from 'react-router-dom';

function ProductFilterPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get current filters from URL
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  
  function handleCategoryChange(e) {
    const value = e.target.value;
    // Update search params
    setSearchParams(prev => {
      if (value) {
        prev.set('category', value);
      } else {
        prev.delete('category');
      }
      return prev;
    });
  }
  
  return (
    <div>
      <h1>Product Filters</h1>
      <select value={category} onChange={handleCategoryChange}>
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>
      
      <input
        type="number"
        placeholder="Min Price"
        value={minPrice}
        onChange={(e) => {
          setSearchParams(prev => {
            if (e.target.value) {
              prev.set('minPrice', e.target.value);
            } else {
              prev.delete('minPrice');
            }
            return prev;
          });
        }}
      />
      
      <div>
        <p>Selected category: {category || 'None'}</p>
        <p>Min price: {minPrice || 'None'}</p>
      </div>
    </div>
  );
}
```

### useMatch <a name="usematch"></a>

`useMatch` matches the current URL against a path pattern.

```jsx
import { useMatch } from 'react-router-dom';

function ProductPageIndicator() {
  // Check if current URL matches a product page
  const match = useMatch('/products/:productId');
  
  if (match) {
    return <div>You are viewing product: {match.params.productId}</div>;
  }
  
  return <div>Browse our products</div>;
}
```

## Lazy Loading <a name="lazy-loading"></a>

React Router works well with React's `lazy` and `Suspense` for code splitting.

```jsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load route components
const Home = lazy(() => import('./components/Home'));
const About = lazy(() => import('./components/About'));
const Dashboard = lazy(() => import('./components/Dashboard'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </Suspense>
  );
}
```

## 404 Pages <a name="404-pages"></a>

Handle routes that don't match any defined routes with a 404 page.

```jsx
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      
      {/* 404 route - must be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function NotFound() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for doesn't exist.</p>
      <Link to="/">Go Home</Link>
    </div>
  );
}
```

## Query Parameters <a name="query-parameters"></a>

Query parameters can be accessed and manipulated using the `useSearchParams` hook.

```jsx
import { useSearchParams } from 'react-router-dom';

function ProductSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get query parameters
  const query = searchParams.get('q') || '';
  const sort = searchParams.get('sort') || 'newest';
  
  function handleSearch(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newQuery = formData.get('searchQuery');
    
    // Update search parameters
    setSearchParams(prev => {
      if (newQuery) {
        prev.set('q', newQuery);
      } else {
        prev.delete('q');
      }
      return prev;
    });
  }
  
  return (
    <div>
      <form onSubmit={handleSearch}>
        <input 
          name="searchQuery"
          defaultValue={query} 
          placeholder="Search products..." 
        />
        <button type="submit">Search</button>
      </form>
      
      <div>
        <label>Sort by:</label>
        <select 
          value={sort}
          onChange={(e) => {
            setSearchParams(prev => {
              prev.set('sort', e.target.value);
              return prev;
            });
          }}
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price (Low to High)</option>
          <option value="price_desc">Price (High to Low)</option>
        </select>
      </div>
      
      <div>
        <p>Searching for: {query || 'All products'}</p>
        <p>Sorted by: {sort}</p>
      </div>
    </div>
  );
}
```

## Advanced Concepts <a name="advanced-concepts"></a>

React Router v6.4+ introduced new data APIs for loading and mutating data.

### Data Loading <a name="data-loading"></a>

The new data APIs in React Router 6.4+ simplify data loading for routes.

```jsx
import { 
  createBrowserRouter, 
  RouterProvider,
  defer,
  Await,
  useLoaderData
} from 'react-router-dom';
import { Suspense } from 'react';

// Loader function for a route
async function userLoader({ params }) {
  const user = await fetchUser(params.userId);
  const postsPromise = fetchUserPosts(params.userId);
  
  // Return both immediate data and deferred data
  return defer({
    user,
    posts: postsPromise // This will load after component renders
  });
}

function UserProfile() {
  const { user, posts } = useLoaderData();
  
  return (
    <div>
      <h1>{user.name}'s Profile</h1>
      <p>Email: {user.email}</p>
      
      {/* Handle deferred data */}
      <Suspense fallback={<p>Loading posts...</p>}>
        <Await 
          resolve={posts}
          errorElement={<p>Error loading posts</p>}
        >
          {(resolvedPosts) => (
            <div>
              <h2>Posts</h2>
              <ul>
                {resolvedPosts.map(post => (
                  <li key={post.id}>{post.title}</li>
                ))}
              </ul>
            </div>
          )}
        </Await>
      </Suspense>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: 'users/:userId',
        element: <UserProfile />,
        loader: userLoader
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}
```

### Route Loaders <a name="route-loaders"></a>

Route loaders let you load data before rendering a route component.

```jsx
import { 
  createBrowserRouter, 
  RouterProvider,
  useLoaderData
} from 'react-router-dom';

// Define loaders for routes
async function productsLoader() {
  const response = await fetch('/api/products');
  
  if (!response.ok) {
    throw new Response('Failed to load products', { status: 500 });
  }
  
  return response.json();
}

async function productLoader({ params }) {
  const response = await fetch(`/api/products/${params.id}`);
  
  if (!response.ok) {
    throw new Response('Product not found', { 
      status: response.status 
    });
  }
  
  return response.json();
}

// Components that use loader data
function ProductList() {
  const products = useLoaderData();
  
  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <Link to={`/products/${product.id}`}>
              {product.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductDetail() {
  const product = useLoaderData();
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
    </div>
  );
}

// Create router with loader configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: 'products',
        element: <ProductList />,
        loader: productsLoader,
        errorElement: <ErrorPage />
      },
      {
        path: 'products/:id',
        element: <ProductDetail />,
        loader: productLoader,
        errorElement: <ProductErrorPage />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}
```

### Route Actions <a name="route-actions"></a>

Route actions allow you to handle data mutations like form submissions.

```jsx
import { 
  Form, 
  useActionData, 
  redirect,
  useNavigation
} from 'react-router-dom';

// Action function for a route
async function createProductAction({ request }) {
  // Get form data
  const formData = await request.formData();
  const newProduct = {
    name: formData.get('name'),
    price: Number(formData.get('price')),
    description: formData.get('description')
  };
  
  // Validate (simple example)
  const errors = {};
  if (!newProduct.name) errors.name = 'Name is required';
  if (!newProduct.price) errors.price = 'Price is required';
  
  // Return errors if validation fails
  if (Object.keys(errors).length) {
    return { errors };
  }
  
  // Submit to API
  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    });
    
    if (!response.ok) {
      return { errors: { submit: 'Failed to create product' } };
    }
    
    // Redirect on success
    return redirect('/products');
  } catch (error) {
    return { errors: { submit: error.message } };
  }
}

// Component with form
function CreateProduct() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  
  return (
    <div>
      <h1>Create Product</h1>
      
      {/* Forms submitted with actions use the Form component */}
      <Form method="post">
        <div>
          <label>
            Name:
            <input type="text" name="name" />
          </label>
          {actionData?.errors?.name && (
            <p className="error">{actionData.errors.name}</p>
          )}
        </div>
        
        <div>
          <label>
            Price:
            <input type="number" name="price" step="0.01" />
          </label>
          {actionData?.errors?.price && (
            <p className="error">{actionData.errors.price}</p>
          )}
        </div>
        
        <div>
          <label>
            Description:
            <textarea name="description" />
          </label>
        </div>
        
        {actionData?.errors?.submit && (
          <p className="error">{actionData.errors.submit}</p>
        )}
        
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Product'}
        </button>
      </Form>
    </div>
  );
}

// Add action to route configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: 'products/new',
        element: <CreateProduct />,
        action: createProductAction
      }
    ]
  }
]);
```

## Best Practices <a name="best-practices"></a>

Here are some best practices for using React Router effectively:

1. **Organize Routes Logically**
   - Group related routes together
   - Use nested routes for related UI sections
   - Keep route definitions in one place for better visibility

2. **Use Relative Paths and Links**
   - For nested routes, use relative paths when possible
   - This makes your code more maintainable and less prone to errors

3. **Handle Loading States**
   - Always provide feedback during navigation and data loading
   - Use the navigation.state from useNavigation to show loading indicators

4. **Implement Error Boundaries**
   - Use errorElement for handling route errors
   - Create dedicated error components for different scenarios

5. **Manage Route Protection**
   - Implement consistent patterns for protected routes
   - Consider using a higher-order component or layout route for protection

6. **Use URL Parameters Wisely**
   - Keep URLs clean and readable
   - Use path parameters for essential identifiers
   - Use query parameters for filters and optional settings

7. **Lazy Load Routes**
   - Use React.lazy() for code splitting
   - Improves initial load performance

8. **Test Your Routes**
   - Write tests for your routing logic
   - Verify protected routes work as expected
   - Test parameter extraction

## Migrating from v5 to v6 <a name="migrating-from-v5-to-v6"></a>

If you're upgrading from React Router v5 to v6, here are key changes to be aware of:

1. **Switch → Routes**
   - `Switch` is replaced by `Routes`
   - `Routes` automatically picks the best match
   - No need for exact prop

2. **Route Changes**
   - `component` or `render` prop is replaced by `element`
   - `element` takes JSX directly: `<Route element={<Home />} />`

3. **Nested Routes**
   - Nested routes are declared differently
   - They're defined in the parent route
   - Use `Outlet` to render child routes

4. **No More Route Props**
   - `match`, `location`, and `history` are no longer passed as props
   - Use hooks instead: `useParams()`, `useLocation()`, `useNavigate()`

5. **Hooks Replace HOCs**
   - `withRouter` HOC is removed
   - Use hooks directly in function components

6. **No More `<Redirect>`**
   - Use `<Navigate>` component instead
   - Or use `useNavigate()` hook programmatically

7. **Navigation Changes**
   - `history.push()` → `navigate()`
   - `history.replace()` → `navigate(path, { replace: true })`

Example migration:

```jsx
// React Router v5
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';

function App() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/about" render={() => <About extra="info" />} />
      <PrivateRoute path="/dashboard" component={Dashboard} />
      <Redirect from="/old-path" to="/new-path" />
      <Route path="*" component={NotFound} />
    </Switch>
  );
}

function Profile() {
  const history = useHistory();
  
  const goToDashboard = () => {
    history.push('/dashboard');
  };
  
  return (
    <div>
      <h1>Profile</h1>
      <button onClick={goToDashboard}>Go to Dashboard</button>
    </div>
  );
}
```

```jsx
// React Router v6
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About extra="info" />} />
      <Route
        path="/dashboard"
        element={<RequireAuth><Dashboard /></RequireAuth>}
      />
      <Route path="/old-path" element={<Navigate to="/new-path" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function RequireAuth({ children }) {
  const isAuthenticated = checkAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function Profile() {
  const navigate = useNavigate();
  
  const goToDashboard = () => {
    navigate('/dashboard');
  };
  
  return (
    <div>
      <h1>Profile</h1>
      <button onClick={goToDashboard}>Go to Dashboard</button>
    </div>
  );
}
```

This documentation should give you a comprehensive understanding of React
