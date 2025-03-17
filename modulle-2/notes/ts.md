# TypeScript Basics for JavaScript Developers

## Introduction

TypeScript is a superset of JavaScript that adds static typing. As JavaScript developers preparing to learn React Native (which now uses TypeScript by default), understanding these core TypeScript concepts will make your transition much smoother.

## Why TypeScript?

JavaScript is dynamically typed, meaning variables can change types at runtime:

```javascript
// JavaScript
let message = "Hello"; // message is a string
message = 42;          // Now message is a number
message = true;        // Now message is a boolean
// This is all valid JavaScript!
```

TypeScript adds static typing to prevent these type changes and catch errors before runtime:

```typescript
// TypeScript
let message: string = "Hello"; // message can ONLY be a string
message = 42;  // ❌ Error: Type 'number' is not assignable to type 'string'
message = true; // ❌ Error: Type 'boolean' is not assignable to type 'string'
```

## 1. Basic Type Annotations

In JavaScript, you declare variables without specifying their types:

```javascript
// JavaScript
let name = "John";
let age = 30;
let isActive = true;
```

In TypeScript, you can add type annotations using a colon after the variable name:

```typescript
// TypeScript
let name: string = "John";
let age: number = 30;
let isActive: boolean = true;
```

TypeScript can often infer types automatically, so you don't always need annotations:

```typescript
// TypeScript with type inference
let name = "John";       // TypeScript infers type string
let age = 30;            // TypeScript infers type number
let isActive = true;     // TypeScript infers type boolean
```

However, type annotations are useful when declaring variables without initialization:

```typescript
// TypeScript without initialization
let name: string;         // Must be assigned a string later
let age: number;          // Must be assigned a number later
let isActive: boolean;    // Must be assigned a boolean later

// Later in code
name = "John";            // ✅ Valid
age = "thirty";           // ❌ Error: Type 'string' is not assignable to type 'number'
```

## 2. Core TypeScript Types

TypeScript includes all the types you're familiar with in JavaScript, plus some additional ones:

### Primitive Types

```typescript
// String
let firstName: string = "John";

// Number (includes integers and floating-point values)
let age: number = 30;
let price: number = 9.99;

// Boolean
let isActive: boolean = true;

// Null and Undefined
let emptyValue: null = null;
let notDefined: undefined = undefined;

// Symbol
let uniqueKey: symbol = Symbol("key");

// BigInt
let largeNumber: bigint = 100n;
```

### Arrays

In JavaScript, arrays can contain mixed types:

```javascript
// JavaScript array
let mixedArray = ["John", 30, true];
```

In TypeScript, you specify the element type:

```typescript
// TypeScript arrays
let names: string[] = ["John", "Jane", "Bob"];
let ages: number[] = [25, 30, 35];

// Alternative syntax
let scores: Array<number> = [85, 90, 95];

// Mixed arrays (explicit union type)
let mixed: (string | number | boolean)[] = ["John", 30, true];
```

### Objects

In JavaScript, objects can have any properties:

```javascript
// JavaScript object
let user = {
  name: "John",
  age: 30
};

user.location = "New York"; // Add a new property
```

In TypeScript, objects have defined shapes:

```typescript
// TypeScript object with inline type
let user: { name: string; age: number } = {
  name: "John",
  age: 30
};

user.location = "New York"; // ❌ Error: Property 'location' does not exist on type '{ name: string; age: number }'
```

### Special TypeScript Types

```typescript
// Any - turns off type checking (avoid when possible)
let flexible: any = "Hello";
flexible = 42;      // ✅ Valid
flexible = true;    // ✅ Valid
flexible.nonExistentMethod(); // No error during compilation (but will fail at runtime)

// Unknown - safer alternative to any
let safeFlexible: unknown = "Hello";
// safeFlexible.length; // ❌ Error: Object is of type 'unknown'

// Need to check the type first
if (typeof safeFlexible === "string") {
  console.log(safeFlexible.length); // ✅ Valid
}

// Void - used for functions that don't return a value
function logMessage(): void {
  console.log("Hello");
  // No return statement needed
}

// Never - for functions that never return (throw errors or infinite loops)
function throwError(): never {
  throw new Error("Something went wrong");
}
```

## 3. Type Aliases and Interfaces

### Type Aliases

Type aliases create custom names for types:

```typescript
// Basic type alias
type UserID = string;
let id: UserID = "user123";

// Object type alias
type Point = {
  x: number;
  y: number;
};

let position: Point = { x: 10, y: 20 };

// Union type alias
type Status = "pending" | "approved" | "rejected";
let orderStatus: Status = "pending";
// orderStatus = "shipped"; // ❌ Error: Type '"shipped"' is not assignable to type 'Status'
```

### Interfaces

Interfaces define object shapes (similar to type aliases for objects):

```typescript
// Interface definition
interface User {
  id: string;
  name: string;
  email: string;
  age?: number; // Optional property (the ? makes it optional)
}

// Creating an object based on interface
let user: User = {
  id: "user123",
  name: "John",
  email: "john@example.com"
  // age is optional, so we can omit it
};

// Error if missing required properties
let invalidUser: User = {
  id: "user456",
  name: "Jane"
  // ❌ Error: Property 'email' is missing in type '{ id: string; name: string; }' but required in type 'User'
};
```

### Differences between Type Aliases and Interfaces

```typescript
// Interfaces can be extended
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// Types can use union operations
type Pet = Dog | { species: string; name: string };

// Interfaces can be merged (declaration merging)
interface User {
  name: string;
}

interface User {
  age: number;
}

// Result is the same as:
// interface User {
//   name: string;
//   age: number;
// }
```

## 4. Functions in TypeScript

In JavaScript, function parameters have no type checking:

```javascript
// JavaScript function
function greet(name) {
  return `Hello, ${name}!`;
}

greet("John");  // Works as expected
greet(42);      // Also works, but might not be intended
```

TypeScript adds type annotations for parameters and return values:

```typescript
// TypeScript function with parameter and return type annotations
function greet(name: string): string {
  return `Hello, ${name}!`;
}

greet("John");  // ✅ Valid
greet(42);      // ❌ Error: Argument of type 'number' is not assignable to parameter of type 'string'
```

### Function Types

```typescript
// Function type with arrow syntax
let greeter: (name: string) => string;

// Assign a function that matches the type
greeter = function(name: string) {
  return `Hello, ${name}!`;
};

// Optional and default parameters
function createUser(name: string, age?: number, active: boolean = true) {
  // age is optional (might be undefined)
  return { name, age, active };
}

createUser("John");                // ✅ Valid: { name: "John", age: undefined, active: true }
createUser("Jane", 30);            // ✅ Valid: { name: "Jane", age: 30, active: true }
createUser("Bob", 25, false);      // ✅ Valid: { name: "Bob", age: 25, active: false }
```

### Function Overloads

```typescript
// Function overloads provide different ways to call a function
function convertValue(value: string): number;
function convertValue(value: number): string;
function convertValue(value: string | number): string | number {
  if (typeof value === "string") {
    return parseInt(value, 10);  // Convert string to number
  } else {
    return value.toString();     // Convert number to string
  }
}

const num = convertValue("42");    // TypeScript knows this returns a number
const str = convertValue(42);      // TypeScript knows this returns a string
```

## 5. Union and Intersection Types

### Union Types

Union types allow multiple possible types for a value:

```javascript
// In JavaScript, this would just work, but with no type checking
function displayId(id) {
  console.log(`ID: ${id}`);
}

displayId("user123");
displayId(456);
```

With TypeScript union types:

```typescript
// TypeScript union type
function displayId(id: string | number) {
  console.log(`ID: ${id}`);
  
  // Type narrowing
  if (typeof id === "string") {
    console.log(id.toUpperCase());  // OK - TypeScript knows id is a string here
  } else {
    console.log(id.toFixed(2));     // OK - TypeScript knows id is a number here
  }
}

displayId("user123");  // ✅ Valid
displayId(456);        // ✅ Valid
displayId(true);       // ❌ Error: Argument of type 'boolean' is not assignable to parameter of type 'string | number'
```

### Intersection Types

Intersection types combine multiple types:

```typescript
// Define two separate types
type Employee = {
  id: string;
  name: string;
};

type Manager = {
  subordinates: string[];
  department: string;
};

// Combine types with intersection
type ManagerEmployee = Employee & Manager;

// Must have ALL properties from BOTH types
const manager: ManagerEmployee = {
  id: "emp123",
  name: "John",
  subordinates: ["emp456", "emp789"],
  department: "Engineering"
};
```

## 6. Enums

Enums create sets of named constants:

```typescript
// Numeric enum (values start at 0 by default)
enum UserRole {
  Regular,    // 0
  Editor,     // 1
  Admin,      // 2
  SuperAdmin  // 3
}

let role = UserRole.Editor;
console.log(role);  // Outputs: 1

// String enum (more explicit)
enum Theme {
  Light = "light",
  Dark = "dark",
  System = "system"
}

let userTheme = Theme.Dark;
console.log(userTheme);  // Outputs: "dark"

// Using enums
function checkPermission(role: UserRole): boolean {
  return role >= UserRole.Admin;
}

console.log(checkPermission(UserRole.Regular));    // false
console.log(checkPermission(UserRole.SuperAdmin)); // true
```

## 7. Generics

Generics allow you to create reusable components that work with different types:

```javascript
// In JavaScript, you don't restrict array types
function getFirstElement(array) {
  return array[0];
}

// Works with any array
getFirstElement([1, 2, 3]);             // Returns: 1
getFirstElement(["a", "b", "c"]);       // Returns: "a"
```

With TypeScript generics:

```typescript
// TypeScript generic function
function getFirstElement<T>(array: T[]): T | undefined {
  return array[0];
}

// TypeScript knows what type is returned based on the input
const first = getFirstElement([1, 2, 3]);          // TypeScript knows this is number
const name = getFirstElement(["a", "b", "c"]);     // TypeScript knows this is string
const mixed = getFirstElement([true, "a", 123]);   // TypeScript knows this is string | number | boolean
```

Generic interfaces:

```typescript
// Generic interface
interface Box<T> {
  value: T;
}

let numberBox: Box<number> = { value: 42 };
let stringBox: Box<string> = { value: "hello" };
```

## 8. Type Assertion

Type assertion allows you to tell TypeScript about the type of something when TypeScript can't figure it out:

```typescript
// Type assertion with as
let someValue: unknown = "Hello, TypeScript!";
let strLength: number = (someValue as string).length;

// Alternative syntax with angle brackets (not usable in JSX)
let strLength2: number = (<string>someValue).length;
```

## 9. Literal Types

Literal types allow you to specify exact values:

```typescript
// String literal type
let direction: "north" | "south" | "east" | "west";
direction = "north";    // ✅ Valid
direction = "northeast"; // ❌ Error: Type '"northeast"' is not assignable to type '"north" | "south" | "east" | "west"'

// Numeric literal type
let diceRoll: 1 | 2 | 3 | 4 | 5 | 6;
diceRoll = 3;   // ✅ Valid
diceRoll = 7;   // ❌ Error: Type '7' is not assignable to type '1 | 2 | 3 | 4 | 5 | 6'
```

## 10. Type Guards

Type guards help TypeScript narrow down types:

```typescript
// Type guard with typeof
function padValue(value: string | number): string {
  // TypeScript knows which type we're dealing with in each branch
  if (typeof value === "string") {
    return value.padStart(10, " ");  // String method
  } else {
    return value.toString().padStart(10, "0");  // Number method
  }
}

// Type guard with instanceof
class Car {
  drive() { console.log("Driving a car"); }
}

class Truck {
  drive() { console.log("Driving a truck"); }
  loadCargo() { console.log("Loading cargo"); }
}

type Vehicle = Car | Truck;

function useVehicle(vehicle: Vehicle) {
  vehicle.drive();  // Both Car and Truck have drive method
  
  // Check if it's a Truck before using truck-specific method
  if (vehicle instanceof Truck) {
    vehicle.loadCargo();  // Safe - TypeScript knows it's a Truck
  }
}
```

## 11. Optional Chaining and Nullish Coalescing

TypeScript supports JavaScript's optional chaining and nullish coalescing operators:

```typescript
// Optional chaining (?.)
interface User {
  name: string;
  address?: {
    street: string;
    city: string;
  };
}

function getUserCity(user: User): string {
  // Access deeply nested properties safely
  return user.address?.city || "Unknown";
}

// Nullish coalescing (??)
// Returns the right side only when the left side is null or undefined
function getDisplayName(user: User): string {
  return user.name ?? "Anonymous";  // "" is considered a valid name
}
```

## 12. Common TypeScript Errors and How to Fix Them

### Error: Type 'X' is not assignable to type 'Y'

```typescript
// Error
let age: number = "30";  // ❌ Error: Type 'string' is not assignable to type 'number'

// Fix: Use the correct type
let age: number = 30;  // ✅ Valid
// Or change the type annotation
let age: string = "30";  // ✅ Valid
```

### Error: Property 'X' does not exist on type 'Y'

```typescript
// Error
interface User {
  name: string;
  email: string;
}

const user: User = { name: "John", email: "john@example.com" };
console.log(user.age);  // ❌ Error: Property 'age' does not exist on type 'User'

// Fix: Add the property to the interface
interface User {
  name: string;
  email: string;
  age?: number;  // Make it optional
}

// Or use a type assertion (use sparingly)
console.log((user as any).age);  // ✅ Valid but bypasses type checking
```

### Error: Object is possibly 'null' or 'undefined'

```typescript
// Error
function getFirstElement(arr: string[]) {
  return arr[0].toUpperCase();  // ❌ Error: Object is possibly 'undefined'
}

// Fix: Add a null check
function getFirstElement(arr: string[]) {
  if (arr.length > 0) {
    return arr[0].toUpperCase();  // ✅ Valid
  }
  return "";
}

// Or use the non-null assertion operator (when you're sure it's not null)
function getFirstElement(arr: string[]) {
  return arr[0]!.toUpperCase();  // ✅ Valid - the ! tells TypeScript the value won't be null
}
```

## Practical Exercises

1. **Convert This JavaScript to TypeScript**:

   ```javascript
   // JavaScript
   function calculateTotal(items, tax) {
     let total = 0;
     for (const item of items) {
       total += item.price;
     }
     return total * (1 + tax);
   }
   
   const shoppingCart = [
     { name: "Book", price: 10.99 },
     { name: "Coffee", price: 3.99 }
   ];
   
   console.log(calculateTotal(shoppingCart, 0.07));
   ```

   TypeScript solution:

   ```typescript
   // TypeScript
   interface Item {
     name: string;
     price: number;
   }
   
   function calculateTotal(items: Item[], tax: number): number {
     let total = 0;
     for (const item of items) {
       total += item.price;
     }
     return total * (1 + tax);
   }
   
   const shoppingCart: Item[] = [
     { name: "Book", price: 10.99 },
     { name: "Coffee", price: 3.99 }
   ];
   
   console.log(calculateTotal(shoppingCart, 0.07));
   ```

2. **Create a User Authentication System with Types**:

   Build interfaces and types for a simple authentication system with users, roles, and permissions.

3. **Fix the TypeScript Errors**:

   Provide code with TypeScript errors and have students fix them.

## Conclusion

TypeScript builds on your JavaScript knowledge by adding static types that help catch errors before runtime. The concepts covered here will form a solid foundation for using TypeScript in React Native development.

As you move forward, remember that TypeScript's goal is to make your code more robust and maintainable. The initial learning curve pays off with fewer bugs and better developer tools.
