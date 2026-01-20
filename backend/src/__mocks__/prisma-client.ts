// Mock Prisma Client for Jest tests
export class PrismaClient {
  user = {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  post = {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  follow = {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };

  rate = {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  board = {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  $connect = jest.fn();
  $disconnect = jest.fn();
}

// Mock Prisma types for tests
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Prisma {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type UserWhereUniqueInput = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type UserWhereInput = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type UserCreateInput = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type UserUpdateInput = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type PostWhereUniqueInput = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type PostWhereInput = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type PostCreateInput = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type PostUpdateInput = any;
}
