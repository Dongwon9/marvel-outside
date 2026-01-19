# AI Coding Instructions for Marvel Outside

## About me

I am Dongwon, the lead developer of the Marvel Outside project. This document provides comprehensive instructions for AI coding assistants to effectively contribute to the backend and frontend development of the Marvel Outside full-stack application.
This is my first time developing a full-stack app using NestJS, Prisma, React, Vite, and Tailwind CSS, so detailed instructions are necessary to ensure code quality and consistency.
I don't plan to(and don't know how to) use advanced CI/CD. so I will not use it until nessesary.

## Project Overview

This is a full-stack application for the Marvel Outside project:

- **Backend**: NestJS + Prisma + PostgreSQL with modular architecture
- **Frontend**: React + Vite + Tailwind CSS with modern TypeScript setup

The backend implements feature modules (User, Post, Follow, Rate) that handle database operations through Prisma ORM. The frontend uses React 19 with TypeScript, Vite for build tooling, and Tailwind CSS v4 for styling.

## Architecture Patterns

### Layered Module Structure

Each feature module (e.g., `user/`, `post/`) follows this pattern:

- **Controller** (`*.controller.ts`): HTTP routes, delegates to service
- **Service** (`*.service.ts`): Business logic with Prisma queries
- **Module Registration**: Controllers and services registered in `app.module.ts`

All modules are imported and declared in [backend/src/app.module.ts](../backend/src/app.module.ts). **Use NestJS CLI to scaffold new modules:**

```bash
nest generate resource feature-name
```

This creates and auto-registers:

- `src/feature-name/` directory
- `feature-name.module.ts`, `feature-name.controller.ts`, `feature-name.service.ts`
- `*.spec.ts` test files
- Module registration in `app.module.ts`

**Module structure**:

```typescript
@Module({
  controllers: [FeatureController],
  providers: [FeatureService],
  exports: [FeatureService], // Makes service available to other modules
})
export class FeatureModule {}
```

**Manual setup** (if needed):

1. Create `src/feature-name/` directory
2. Implement service and controller files
3. Register in `AppModule`

### Prisma as Data Layer

- Database models defined in [backend/prisma/schema.prisma](../backend/prisma/schema.prisma)
- `PrismaService` ([backend/src/prisma/prisma.service.ts](../backend/src/prisma/prisma.service.ts)) extends `PrismaClient` with `PrismaPg` adapter for PostgreSQL
- Generated types imported from `backend/src/generated/prisma/client` (e.g., `User`, `Post`, `Prisma` types)
- Services accept typed parameters: `Prisma.UserCreateInput`, `Prisma.UserWhereUniqueInput`

See [backend/src/user/user.service.ts](../backend/src/user/user.service.ts) and [backend/src/post/post.service.ts](../backend/src/post/post.service.ts) for standard CRUD patterns.

### Database Schema

Current models in [backend/prisma/schema.prisma](../backend/prisma/schema.prisma):

- **User**: `id`, `email` (unique), `name`, `posts[]` (relation)
- **Post**: `id`, `title`, `content`, `published` (default false), `author` (User relation)

Migrations stored in `prisma/migrations/`.

## Development Workflow

### Setup

```bash
cd backend
pnpm install
# Set DATABASE_URL env var pointing to PostgreSQL
pnpm run start:dev        # watch mode on port 3000
```

### Docker Dev Environment

For local development using Docker (no DB container — use your serverless PostgreSQL via `DATABASE_URL`):

**Prerequisites**

- Docker and Docker Compose installed
- `DATABASE_URL` set in your host environment (consumed by PrismaService)

**Files**

- Compose: [docker-compose.dev.yml](../docker-compose.dev.yml)
- Backend image: [backend/Dockerfile.dev](../backend/Dockerfile.dev)
- Frontend image: [frontend/Dockerfile.dev](../frontend/Dockerfile.dev)

**Start containers**

```bash
cd /home/dongwon/Projects/marvel-outside
docker compose -f docker-compose.dev.yml up --build
```

**Access**

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

Notes:

- No DB container is started; `DATABASE_URL` must point to your serverless database.
- File watching inside containers uses polling (`CHOKIDAR_USEPOLLING=true`) for reliability with bind mounts.
- `node_modules` are kept in named volumes to avoid permission issues while source is bind-mounted.
- Vite is bound to `0.0.0.0` for external access from the host.

Optional proxy (recommended for API calls from frontend during Docker dev): update [frontend/vite.config.ts](../frontend/vite.config.ts) to proxy to the backend service name:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://backend:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
```

**Stop containers**

```bash
docker compose -f docker-compose.dev.yml down
```

### Key Commands

- **Build**: `pnpm run build` (outputs to `dist/`)
- **Lint/Format**: `pnpm run lint` (ESLint + fix), `pnpm run format` (Prettier)
- **Tests**: `pnpm run test` (Jest unit tests), `pnpm run test:e2e` (e2e tests)
- **Database**: `pnpm prisma migrate dev` (create/apply migrations)

### NestJS CLI Commands

Use the NestJS CLI to scaffold modules, services, and controllers:

```bash
# Generate complete resource (module + controller + service + DTO)
nest generate resource comment

# Generate individual components
nest generate module feature-name
nest generate service feature-name
nest generate controller feature-name

# List all available schematics
nest generate --help
```

The CLI automatically:

- Creates feature directory structure
- Registers modules in `app.module.ts`
- Generates `.spec.ts` test files
- Follows project conventions

### Database Migrations

After schema changes in `prisma/schema.prisma`:

```bash
pnpm prisma migrate dev --name feature_description
```

This generates migration SQL and regenerates client types in `src/generated/prisma/`.

## Code Style & Patterns

### TypeScript Configuration

- **Target**: ES2021, strict mode enabled
- **Module Format**: ES2020 modules for modern JavaScript import/export
- **Decorators**: `experimentalDecorators` and `emitDecoratorMetadata` enabled (required for NestJS)
- **Module Resolution**: Node, with `@/` alias for `src/` imports
- **Generated Prisma**: Do NOT edit `src/generated/prisma/` directly—regenerate via migrations

### DTO (Data Transfer Object) Patterns

**DTOs are mandatory for all request/response handling.** Each feature module should have:

#### Request DTOs

- **CreateXxxDto**: For POST requests (e.g., `CreateUserDto`, `CreatePostDto`)
  - Use `class-validator` decorators (`@IsString()`, `@IsEmail()`, etc.) for validation
  - Validates input before reaching the service layer

- **UpdateXxxDto**: For PUT/PATCH requests (e.g., `UpdateUserDto`, `UpdatePostDto`)
  - All fields should be `@IsOptional()` to allow partial updates
  - Validates only provided fields

- **GetXxxQueryDto**: For GET query parameters (e.g., `GetUsersQueryDto`, `GetPostsQueryDto`)
  - Use `@Type(() => Number)` for type conversion from URL strings
  - Common fields: `skip`, `take`, `orderBy`

#### Response DTOs

- **XxxResponseDto**: For API responses (e.g., `UserResponseDto`, `PostResponseDto`)
  - Use `@Exclude()` from `class-transformer` to hide sensitive fields (e.g., `passwordHashed`)
  - Should include constructor that accepts `Partial<XxxResponseDto>`
  - Use `plainToInstance()` in services to transform Prisma models to DTOs

#### Service Implementation with DTOs

```typescript
import { plainToInstance } from 'class-transformer';

async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
  // Business logic with Prisma
  const user = await this.prisma.user.create({
    data: {
      email: createUserDto.email,
      name: createUserDto.name,
      passwordHashed: await bcrypt.hash(createUserDto.password, 10),
    },
  });
  // Transform to DTO before returning
  return plainToInstance(UserResponseDto, user);
}

async getUsers(queryDto: GetUsersQueryDto): Promise<UserResponseDto[]> {
  const users = await this.prisma.user.findMany({
    skip: queryDto.skip,
    take: queryDto.take,
    orderBy: queryDto.orderBy ? { [queryDto.orderBy]: 'asc' } : undefined,
  });
  return plainToInstance(UserResponseDto, users);
}
```

**File Structure:**

```
src/feature-name/
  dto/
    create-feature.dto.ts      # POST request validation
    update-feature.dto.ts      # PUT request validation
    get-features-query.dto.ts  # GET query parameters
    feature-response.dto.ts    # Response with @Exclude() for sensitive fields
  feature.service.ts           # Use DTOs for parameters and returns
  feature.controller.ts        # Receive DTOs, validate automatically
  feature.module.ts
```

### Service Patterns

Services should accept **DTO objects as parameters** instead of raw Prisma types:

```typescript
// ✅ Recommended: Service accepts DTOs
async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto>
async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto>
async getUsers(queryDto: GetUsersQueryDto): Promise<UserResponseDto[]>

// ❌ Avoid: Service accepts Prisma types directly
async createUser(data: Prisma.UserCreateInput): Promise<User>
async getUsers(params: { skip?: number; where?: Prisma.UserWhereInput }): Promise<User[]>
```

**Benefits:**

- Validation happens automatically before service logic
- Clear contract between controller and service
- Sensitive fields excluded from responses via `@Exclude()`
- Type-safe transformations using `plainToInstance()`
- Consistent API documentation

### Dependency Injection

NestJS `@Injectable()` decorator with constructor injection:

```typescript
constructor(private prisma: PrismaService) {}
```

Services are singleton by default.

### Module Organization

Each feature module encapsulates its service and controller:

```typescript
// backend/src/user/user.module.ts
@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Makes UserService available to other modules
})
export class UserModule {}
```

The root `AppModule` imports all feature modules:

```typescript
// backend/src/app.module.ts
@Module({
  imports: [UserModule, PostModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
```

**Key principle**: Services from exported modules are available for dependency injection in controllers that require them.

### NestJS CLI Best Practices

- **Always use `nest generate resource`** for new features (not manual folder creation)
- CLI automatically updates `app.module.ts` imports and declarations
- Generated files follow project conventions and include test stubs
- Faster than manual setup and less error-prone

## Testing

- **Unit Tests**: Colocated with source (e.g., `user.service.spec.ts` next to `user.service.ts`)
- **E2E Tests**: In `test/` directory using Jest with `jest-e2e.json` config
- **Mocking**: Use `PrismaService` mocks in tests; example stubs in existing `.spec.ts` files

## Critical Implementation Details

Environment Setup

- PostgreSQL connection via `DATABASE_URL` env var (consumed by `PrismaService`)
- No `.env` file committed; use `.env.local` or deployment env vars

### Current Controllers

Controllers are currently minimal stubs; expand with route handlers (GET, POST, etc.) as features develop. Follow NestJS patterns: `@Get()`, `@Post()`, `@Body()`, `@Param()`.

## Common Tasks for AI Agents

1. **Add a new feature module**:

   ```bash
   nest generate resource feature-name
   ```

   Then update `backend/src/feature-name/feature-name.service.ts` with business logic.

2. **Add a new model**: Update `backend/prisma/schema.prisma` → `pnpm prisma migrate dev --name feature_description` → types auto-regenerate

3. **Add a service method**: Update service in `backend/src/feature/feature.service.ts` with Prisma query using appropriate `Prisma.*Input` types

4. **Add a controller endpoint**: Update `backend/src/feature/feature.controller.ts` with decorated method (`@Get()`, `@Post()`, `@Body()`, `@Param()`), inject service, call service method

5. **Fix type mismatches**: Check Prisma generated types in `backend/src/generated/prisma/client.ts` for correct Input/Output types

6. **Run tests**: `pnpm run test` runs all unit tests; test files auto-generated by NestJS CLI

## Things to not do

- Do not edit files in `backend/src/generated/prisma/` directly
- Do not format manually. format on save is enabled.

## Key Files Reference

### Backend

- [backend/package.json](../backend/package.json): Scripts, dependencies (NestJS, Prisma, PostgreSQL)
- [backend/tsconfig.json](../backend/tsconfig.json): TypeScript config with strict mode
- [backend/src/app.module.ts](../backend/src/app.module.ts): Module registration and DI
- [backend/prisma/schema.prisma](../backend/prisma/schema.prisma): Database schema definition
- [backend/src/prisma/prisma.service.ts](../backend/src/prisma/prisma.service.ts): Prisma client setup with PrismaPg adapter

### Docker

- [docker-compose.dev.yml](../docker-compose.dev.yml): Dev compose with backend/frontend services (no DB)
- [backend/Dockerfile.dev](../backend/Dockerfile.dev): NestJS dev image (pnpm, watch mode)
- [frontend/Dockerfile.dev](../frontend/Dockerfile.dev): Vite React dev image (pnpm, dev server)

### Frontend

- [frontend/package.json](../frontend/package.json): Scripts, dependencies (React, Vite, Tailwind CSS)
- [frontend/tsconfig.json](../frontend/tsconfig.json): TypeScript project references
- [frontend/tsconfig.app.json](../frontend/tsconfig.app.json): App-specific TypeScript config
- [frontend/vite.config.ts](../frontend/vite.config.ts): Vite configuration with Tailwind plugin
- [frontend/src/main.tsx](../frontend/src/main.tsx): React app entry point

---

## Frontend Development

### Tech Stack

- **React 19**: Latest React with improved TypeScript support
- **Vite**: Fast build tool with HMR (Hot Module Replacement)
- **Tailwind CSS v4**: Utility-first CSS framework using Vite plugin
- **TypeScript**: Strict mode enabled with modern ES2022 target

### Project Structure

```
frontend/
  src/
    main.tsx              # App entry point
    App.tsx               # Root component
    index.css             # Global styles with Tailwind directives
    components/           # Reusable UI components
    api/                  # API client and types
    hooks/                # Custom React hooks
    pages/                # Page components
    stores/               # State management
  public/                 # Static assets
  vite.config.ts         # Vite configuration
  tailwind.config.js     # Tailwind configuration
  tsconfig.json          # TS project references
  tsconfig.app.json      # App TypeScript config
```

### Development Workflow

#### Setup

```bash
cd frontend
pnpm install
pnpm run dev          # Dev server on port 5173 (default)
```

#### Key Commands

- **Dev Server**: `pnpm run dev` (with HMR)
- **Build**: `pnpm run build` (TypeScript check + Vite build)
- **Preview**: `pnpm run preview` (preview production build)
- **Lint**: `pnpm run lint` (ESLint with auto-fix)

### Tailwind CSS Integration

#### Vite Plugin Setup

Tailwind CSS v4 uses the **Vite plugin** instead of PostCSS:

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
```

**Important**: Do NOT use `postcss.config.js` when using the Vite plugin. The plugin handles all CSS processing internally.

#### Tailwind Configuration

```javascript
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
};
```

This tells Tailwind to scan all source files for class names.

#### Using Tailwind in Components

```tsx
// Utility-first approach
export default function Button() {
  return (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Click me
    </button>
  );
}

// Responsive design
export default function Card() {
  return (
    <div className="w-full md:w-1/2 lg:w-1/3 p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-2">Title</h2>
        <p className="text-gray-600">Content</p>
      </div>
    </div>
  );
}

// Dark mode support
export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <h1 className="text-gray-900 dark:text-white">Marvel Outside</h1>
    </header>
  );
}
```

#### Global Styles

```css
/* src/index.css */
@import "tailwindcss";

/* Custom global styles */
body {
  @apply bg-gray-50 text-gray-900;
}

/* Custom component classes (use sparingly) */
@layer components {
  .btn-primary {
    @apply bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600;
  }
}
```

### TypeScript Configuration

- **Target**: ES2022 with modern JavaScript features
- **Module**: ESNext with bundler resolution
- **JSX**: `react-jsx` (automatic runtime, no React import needed)
- **Strict Mode**: Enabled with additional linting rules
- **Project References**: Separated app and node configs for better type checking

Key compiler options:

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
  },
}
```

### Component Patterns

#### Functional Components with TypeScript

```tsx
// Simple component
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

export default function Button({
  label,
  onClick,
  variant = "primary",
}: ButtonProps) {
  const baseClasses = "px-4 py-2 rounded font-medium transition-colors";
  const variantClasses = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {label}
    </button>
  );
}
```

#### State Management

```tsx
import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div className="animate-pulse">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
      <p className="text-gray-600">{user.email}</p>
    </div>
  );
}
```

### API Integration

Structure your API calls in separate modules:

```typescript
// src/api/userApi.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

export async function getUsers(): Promise<User[]> {
  const response = await fetch("/api/users");
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
}

export async function getUserById(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) throw new Error("Failed to fetch user");
  return response.json();
}

export async function createUser(data: {
  name: string;
  email: string;
}): Promise<User> {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create user");
  return response.json();
}
```

### Styling Best Practices

#### Use Tailwind Utility Classes

**✅ Recommended:**

```tsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-gray-900">Title</h2>
  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Action
  </button>
</div>
```

**❌ Avoid custom CSS classes:**

```tsx
// Don't create custom CSS classes unless absolutely necessary
<div className="custom-card">
  <h2 className="custom-title">Title</h2>
</div>
```

#### Component Organization

```tsx
// Good: Clear, readable, using Tailwind utilities
export default function PostCard({ title, content, author }: PostCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{content}</p>
      <div className="flex items-center text-sm text-gray-500">
        <span>By {author}</span>
      </div>
    </article>
  );
}
```

#### Responsive Design

```tsx
// Mobile-first responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards */}
</div>

// Responsive padding and text
<div className="p-4 md:p-6 lg:p-8">
  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
    Responsive Title
  </h1>
</div>
```

### Common Tasks for AI Agents

1. **Create a new component**:
   - Create file in `src/components/ComponentName.tsx`
   - Use functional component with TypeScript interfaces
   - Style with Tailwind utility classes
   - Export as default

2. **Add a new page**:
   - Create file in `src/pages/PageName.tsx`
   - Import and use existing components
   - Set up routing (if using React Router)

3. **Style with Tailwind**:
   - Use utility classes directly in `className`
   - Refer to Tailwind docs for class names
   - Use responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
   - Use state variants: `hover:`, `focus:`, `active:`

4. **Add API integration**:
   - Create API function in `src/api/`
   - Define TypeScript interfaces for data
   - Use in components with `useState` and `useEffect`

5. **Debug styles**:
   - Check Tailwind config content paths
   - Verify classes are being detected
   - Use browser DevTools to inspect computed styles

### Things to NOT do

- Do not create `postcss.config.js` (Vite plugin handles CSS)
- Do not write custom CSS unless absolutely necessary (use Tailwind)
- Do not import React in components (automatic JSX runtime)
- Do not use inline styles (prefer Tailwind utilities)

---

## Backend Development
