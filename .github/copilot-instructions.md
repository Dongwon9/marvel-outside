# AI Coding Instructions for Marvel Outside Backend

## Project Overview

This is a **NestJS + Prisma + PostgreSQL** backend for the Marvel Outside project. It implements a modular architecture with feature modules (User, Post) that handle database operations through Prisma ORM.

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

4. **Add a controller endpoint**: Update `backend/src/feature/feature.controller.ts` with decorated method (`@Get()`, `@Post()`, etc.), inject service, call service method

5. **Fix type mismatches**: Check Prisma generated types in `backend/src/generated/prisma/client.ts` for correct Input/Output types

6. **Run tests**: `pnpm run test` runs all unit tests; test files auto-generated by NestJS CLI

## Things to not do

- Do not edit files in `backend/src/generated/prisma/` directly
- Do not format manually. format on save is enabled.

## Key Files Reference

- [backend/package.json](../backend/package.json): Scripts, dependencies (NestJS, Prisma, PostgreSQL)
- [backend/tsconfig.json](../backend/tsconfig.json): TypeScript config with strict mode
- [backend/src/app.module.ts](../backend/src/app.module.ts): Module registration and DI
- [backend/prisma/schema.prisma](../backend/prisma/schema.prisma): Database schema definition
- [backend/src/prisma/prisma.service.ts](../backend/src/prisma/prisma.service.ts): Prisma client setup with PrismaPg adapter
