# Schatzies Events Client and Resource Management System

A client and management system for Schatzies to manage communication with their clients and manage event resources.

## Tech Stack

- **Frontend:** React with TypeScript
- **Backend:** Express.js
- **Database:** DynamoDB (NoSQL)

## Hosted on AWS

- AWS Lambda (Express)
- S3 Bucket
- DynamoDB
- API Gateway
- GitHub Actions (CI/CD)
- AWS Lambda (Express)
- S3 Bucket
- DynamoDB
- API Gateway
- GitHub Actions (CI/CD)

## Getting Started

### Prerequisites

- Node.js (v22+)
- pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

- `pnpm dev` - Start development server with HMR
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint on the codebase
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check if code is formatted correctly
- `pnpm preview` - Preview production build

## UI Component Policy (Strict)

This project uses shadcn as the primary UI design library.

- Primary UI elements must use components from `src/components/ui`.
- Do not build primary UI with raw HTML primitives when a shadcn component exists.
- Required defaults for forms and auth screens:
  - Container: `Card`, `CardHeader`, `CardContent`
  - Fields: `Label`, `Input`
  - Actions: `Button`
- If a required primitive does not exist yet, add it under `src/components/ui` first, then use it in pages/layouts.
- Raw tags (`input`, `button`, `label`, etc.) are allowed only for low-level component implementation inside `src/components/ui`.

## Architecture

### Project Structure

```
src/
├── api/                           # API integration layer
│   ├── axios-instance.ts         # Axios configuration with credentials
│   └── auth.ts                   # Authentication API methods
├── components/
│   ├── layouts/
│   │   ├── PublicLayout.tsx      # Public pages layout (header + outlet)
│   │   └── AdminLayout.tsx       # Protected admin layout (sidebar + header + outlet)
│   └── ui/                       # shadcn/Radix UI components
├── context/
│   ├── AuthContext.tsx           # Auth context definition
│   └── AuthProvider.tsx          # Auth provider with verification logic
├── hooks/
│   └── useAuth.ts               # Custom hook for auth context
├── pages/
│   ├── public/
│   │   ├── LandingPage.tsx       # Home page (/)
│   │   └── EventPackagesPage.tsx # Event packages page (/event-packages)
│   └── dashboard/
│       └── DashboardPage.tsx     # Dashboard page (/dashboard)
├── routes/
│   └── routes.tsx               # Nested route definitions
├── types/
│   └── auth.ts                  # TypeScript interfaces
├── App.tsx                       # Main app component with providers
├── main.tsx                      # Entry point
└── index.css                     # Tailwind + design tokens
```

### Routing Structure

The application uses **React Router with nested routes**:

#### Public Routes
- **`/`** - Landing page (no authentication required)
  - Layout: PublicLayout (header + outlet)
  - Component: LandingPage

- **`/event-packages`** - Event packages overview (no authentication required)
  - Layout: PublicLayout (header + outlet)
  - Component: EventPackagesPage

#### Protected Routes
- **`/dashboard`** - Admin dashboard (authentication required)
  - Layout: AdminLayout (sidebar + header + outlet)
  - Component: DashboardPage
  - Authentication Guard: Redirects to `/` if not authenticated

### Authentication Flow

The application uses **HTTP-only cookies** for authentication with no client-side localStorage:

#### 1. App Initialization
1. App mounts and renders AuthProvider
2. AuthProvider useEffect calls `verifyToken()` with `isLoading=true`
3. Axios automatically sends authToken cookie in request
4. Backend validates cookie and returns user data if valid
5. User state is set, `isLoading=false`, routes render based on authentication

#### 2. Page Refresh
- Same as app initialization
- User authentication persists automatically via cookie verification
- No re-login needed

#### 3. Login Flow
1. User submits credentials
2. `authAPI.login(username, password)` POST to `/api/login`
3. Backend sets HTTP-only cookie and returns user data
4. Context updates user state, routes rerender
5. Dashboard becomes accessible

#### 4. Logout Flow
1. User clicks logout
2. `authAPI.logout()` POST to `/api/logout`
3. Backend clears HTTP-only cookie
4. Context sets user to null, routes redirect to `/`
5. Dashboard no longer accessible

### Security Features

- **HTTP-only Cookies**: JavaScript cannot access cookies (XSS protection)
- **Secure Flag**: Cookies only sent over HTTPS in production
- **SameSite Attribute**: Prevents CSRF attacks
- **No localStorage**: Sensitive auth data never stored in JavaScript-accessible storage
- **withCredentials**: Axios automatically includes cookies in requests
- **CORS Credentials**: Backend configured to accept cookies from frontend

### API Integration

All API calls use the axios instance configured in `api/axios-instance.ts`:

```typescript
- withCredentials: true    // Enable automatic cookie sending
- baseURL: VITE_API_BASE_URL // Read from environment variables
```

#### Available API Methods

**`authAPI.login(username, password)`**
- Endpoint: `POST /api/login`
- Returns: User data

**`authAPI.verifyToken()`**
- Endpoint: `GET /api/validate-token`
- Called automatically on app initialization and page refresh
- Returns: User data or null if invalid

**`authAPI.logout()`**
- Endpoint: `POST /api/logout`
- Clears server-side cookie

### Environment Variables

Create `.env.local` for development (already included):

```env
VITE_API_BASE_URL=http://localhost:3000
```

Create `.env.production` for production (already included):

```env
VITE_API_BASE_URL=https://your-api-domain.com
```

### Using useAuth Hook

Access authentication state anywhere in your components:

```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, isLoading, verifyToken } = useAuth();

  if (isLoading) return <p>Loading...</p>;
  if (!isAuthenticated) return <p>Not logged in</p>;

  return (
    <div>
      <p>Welcome, {user?.username}</p>
      <button onClick={() => verifyToken()}>Revalidate Session</button>
    </div>
  );
}
```

### Adding New Dashboard Routes

To add new routes under `/dashboard`, update `src/routes/routes.tsx`:

```typescript
{
  path: 'dashboard',
  Component: AdminLayout,
  children: [
    {
      index: true,
      Component: DashboardPage,
    },
    {
      path: 'events',
      Component: EventsPage,  // New route
    },
    {
      path: 'clients',
      Component: ClientsPage,  // New route
    },
  ],
}
```

## Contributing

### Branching

Create branches following this naming convention:

- Feature: `feature/feature-name`
- Bug fix: `bugfix/bug-name`
- Hotfix: `hotfix/issue-name`

```bash
git checkout -b feature/your-feature-name
```

### Code Formatting & Commits

Before committing, ensure your code is properly formatted:

```bash
# Format your code
pnpm format

# Stage your changes
git add .

# Commit with a clear message
git commit -m "type(scope): description"
```

Commit types:
- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code refactoring
- `style:` Formatting/styling changes
- `docs:` Documentation updates
- `chore:` Build and dependency updates

### Submitting Pull Requests

1. Push your branch to the repository
2. Open a Pull Request from your branch to `main`
3. Fill out the PR template with:
	- Clear description of changes
	- Link to related issues
	- Screenshots (if applicable)
4. Request reviewers
5. Address feedback and update your PR
6. Once approved, merge to `main`

Ensure:
- Code passes linting: `pnpm lint`
- Code is properly formatted: `pnpm format:check`
- All tests pass (if applicable)
- No merge conflicts
