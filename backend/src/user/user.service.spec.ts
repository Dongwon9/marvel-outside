import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';

import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

// Mock bcrypt module
jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    passwordHashed: 'hashedpassword',
    refreshToken: null,
    registeredAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('getUser', () => {
    it('should return a user when found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);

      const result = await service.getUser({ id: '1' });

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(
        expect.objectContaining({
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
        }),
      );
    });

    it('should return null when user not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const result = await service.getUser({ email: 'missing@example.com' });

      expect(result).toBeNull();
    });
  });

  describe('getUsers', () => {
    it('should return array of users with pagination', async () => {
      const users = [mockUser, { ...mockUser, id: '2', email: 'test2@example.com' }];
      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(users);
      const queryDto: GetUsersQueryDto = { skip: 0, take: 10 };

      const result = await service.getUsers(queryDto);

      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: undefined,
      });
      expect(result).toHaveLength(2);
    });

    it('should return users with orderBy', async () => {
      const users = [mockUser];
      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(users);
      const queryDto: GetUsersQueryDto = { skip: 0, take: 10, orderBy: 'name' };

      await service.getUsers(queryDto);

      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { name: 'asc' },
      });
    });
  });

  describe('createUser', () => {
    it('should create and return a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'newuser@example.com',
        name: 'New User',
        password: 'password123',
      };

      const mocks = {
        findUnique: jest.fn(),
        create: jest.fn(),
      };
      mocks.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
      mocks.create.mockResolvedValue(mockUser);
      prismaService.user.findUnique = mocks.findUnique;
      prismaService.user.create = mocks.create;
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');

      const result = await service.createUser(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mocks.create).toHaveBeenCalledWith({
        data: {
          email: createUserDto.email,
          name: createUserDto.name,
          passwordHashed: 'hashedpassword',
        },
      });
      expect(result).toEqual(
        expect.objectContaining({
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
        }),
      );
    });

    it('should throw ConflictException if email already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'New User',
        password: 'password123',
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);

      await expect(service.createUser(createUserDto)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if name already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'newuser@example.com',
        name: 'Test User',
        password: 'password123',
      };

      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockUser);

      await expect(service.createUser(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('updateUser', () => {
    it('should update user without password', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };
      const updatedUser = { ...mockUser, name: 'Updated Name' };

      const updateMock = jest.fn().mockResolvedValue(updatedUser);
      prismaService.user.update = updateMock;

      const result = await service.updateUser('1', updateUserDto);

      expect(updateMock).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { name: 'Updated Name' },
      });
      expect(result).toEqual(
        expect.objectContaining({
          id: mockUser.id,
          name: 'Updated Name',
        }),
      );
    });

    it('should update user with password hash', async () => {
      const updateUserDto: UpdateUserDto = {
        password: 'newpassword123',
      };
      const updatedUser = { ...mockUser, passwordHashed: 'newhashed' };

      const updateMock = jest.fn().mockResolvedValue(updatedUser);
      prismaService.user.update = updateMock;
      (bcrypt.hash as jest.Mock).mockResolvedValue('newhashed');

      await service.updateUser('1', updateUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 10);
      expect(updateMock).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { passwordHashed: 'newhashed' },
      });
    });
  });

  describe('deleteUser', () => {
    it('should soft delete a user', async () => {
      const deletedUser = { ...mockUser, deletedAt: new Date() };
      const deleteMock = jest.fn().mockResolvedValue(deletedUser);
      prismaService.user.update = deleteMock;

      const result = await service.deleteUser('1');

      const callArgs = deleteMock.mock.calls[0]?.[0];
      expect(callArgs?.where).toEqual({ id: '1' });
      expect(callArgs?.data.deletedAt).toBeInstanceOf(Date);
      expect(result.deletedAt).not.toBeNull();
    });
  });
});
