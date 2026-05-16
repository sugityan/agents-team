# TODO App Architecture

## Overview

A simple TODO application built with Next.js App Router, featuring task management with add, delete, toggle, and filter capabilities, persisted via localStorage.

## Architecture

### Component Structure

```
app/
├── layout.tsx        # Root layout (contains NavigationBar)
├── page.tsx          # Home page (contains TODOApp)
├── globals.css       # Global styles
└── components/
    ├── NavigationBar.tsx    # Global navigation bar
    └── TODOApp.tsx          # Main TODO application component
```

### Data Flow

1. **User Action** → Component State Update → localStorage Sync → UI Re-render
2. **Page Load** → Read from localStorage → Initialize State → Render

### State Management

- Single source of truth: `useState` hook in `TODOApp.tsx`
- Persistence: Read/write to `localStorage` on state changes

## Detailed Specifications

### 1. NavigationBar Component

**Location**: `app/components/NavigationBar.tsx`

**Responsibilities**:
- Display app title "TODO App"
- Provide link to home page (`/`)

**Implementation**:
- Use Next.js `Link` component for navigation
- Fixed position or consistent placement in layout

### 2. TODOApp Component

**Location**: `app/components/TODOApp.tsx`

**Responsibilities**:
- Manage TODO list state
- Handle add, delete, toggle operations
- Implement filtering (All/Active/Completed)
- Persist data to localStorage

**State Structure**:
```typescript
interface TODO {
  id: string;
  text: string;
  completed: boolean;
}

interface TODOState {
  todos: TODO[];
  filter: 'all' | 'active' | 'completed';
}
```

**Features**:
1. **Add TODO**: Text input + submit button to create new task
2. **Delete TODO**: Button to remove a specific task
3. **Toggle TODO**: Checkbox or button to mark complete/incomplete
4. **Filter**: Buttons/tabs to filter by All/Active/Completed

**localStorage**:
- Key: `todos`
- Value: JSON stringified array of TODO objects

### 3. Integration

- `layout.tsx` imports and renders `NavigationBar` on all pages
- `page.tsx` imports and renders `TODOApp`

## Implementation Notes

### Constraints (MANDATORY)

| Constraint | Details |
|------------|---------|
| **Language** | TypeScript only |
| **Styling** | Tailwind CSS v4 (CSS-first config in `globals.css`) |
| **Router** | App Router only (no Pages Router) |
| **Libraries** | No additional libraries (use built-in React hooks) |
| **Persistence** | localStorage only |

### Prerequisites

1. Ensure Node.js and npm are installed
2. Run `npm install` to install dependencies

### Common Pitfalls

1. **SSR Hydration Mismatch**: localStorage is only available in browser. Use `useEffect` to read initial state, or use a client-side check to avoid hydration errors.
2. **Type Safety**: Define proper TypeScript interfaces for TODO items.
3. **Filter Logic**: Ensure filtered view updates correctly when todos change.
4. **Unique IDs**: Use `Date.now()` or `crypto.randomUUID()` for unique TODO IDs.

### Suggested File Structure

```
app/
├── components/
│   ├── NavigationBar.tsx
│   └── TODOApp.tsx
├── layout.tsx
├── page.tsx
└── globals.css
```

## Post-Implementation

After implementation, verify:
1. Can add new TODOs
2. Can delete TODOs
3. Can toggle completion status
4. Filter works (All/Active/Completed)
5. Data persists after page reload
6. No console errors