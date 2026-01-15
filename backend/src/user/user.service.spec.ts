import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { PrismaService } from '../prisma/prisma.service';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'testuser',
    passwordHashed: 'hashedpassword',
    registeredAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getUser', () => {
    it('should return a user when found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);

      const result = await service.getUser({ id: '1' });

      expect(result).toEqual(expect.objectContaining({ id: '1', email: 'test@example.com' }));
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should return null when user not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const result = await service.getUser({ id: '999' });

      expect(result).toBeNull();
    });
  });

  describe('getUserById', () => {
    it('should return a user when found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);

      const result = await service.getUserById('1');

      expect(result).toEqual(expect.objectContaining({ id: '1' }));
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should return null when user not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const result = await service.getUserById('999');

      expect(result).toBeNull();
    });
  });

  describe('getUsers', () => {
    it('should return array of users with query parameters', async () => {
      const mockUsers = [mockUser];
      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(mockUsers);

      const queryDto: GetUsersQueryDto = { skip: 0, take: 10, orderBy: 'email' };
      const result = await service.getUsers(queryDto);

      expect(result).toHaveLength(1);
      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { email: 'asc' },
      });
    });

    it('should return array of users without orderBy', async () => {
      const mockUsers = [mockUser];
      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(mockUsers);

      const queryDto: GetUsersQueryDto = { skip: 0, take: 10 };
      const result = await service.getUsers(queryDto);

      expect(result).toHaveLength(1);
      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: undefined,
      });
    });
  });

  describe('createUser', () => {
    const createUserDto: CreateUserDto = {
      email: 'new@example.com',
      name: 'newuser',
      password: 'password123',
    };

    it('should create a new user successfully', async () => {
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword' as never);

      const result = await service.createUser(createUserDto);

      expect(result).toEqual(expect.objectContaining({ email: mockUser.email }));
      expect(prismaService.user.findUnique).toHaveBeenCalledTimes(2);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: 'new@example.com',
          name: 'newuser',
          passwordHashed: 'hashedpassword',
        },
      });
    });

    it('should throw ConflictException when email already exists', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(mockUser);
      const UserDto2 = { ...createUserDto, name: 'anothername' };
      await expect(service.createUser(UserDto2)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException when name already exists', async () => {
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValueOnce(null) // email check passes
        .mockResolvedValueOnce(mockUser); // name check fails
      const UserDto2 = { ...createUserDto, email: 'another@example.com' };
      await expect(service.createUser(UserDto2)).rejects.toThrow(ConflictException);
    });

    it('should hash password with correct salt rounds', async () => {
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword' as never);

      await service.createUser(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    });

    it('should call findUnique twice to check email and name uniqueness', async () => {
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword' as never);

      await service.createUser(createUserDto);

      expect(prismaService.user.findUnique).toHaveBeenNthCalledWith(1, {
        where: { email: 'new@example.com' },
      });
      expect(prismaService.user.findUnique).toHaveBeenNthCalledWith(2, {
        where: { name: 'newuser' },
      });
    });
  });

  describe('updateUser', () => {
    it('should update user without password', async () => {
      const updateUserDto: UpdateUserDto = { name: 'updatedname' };
      const updatedUser = { ...mockUser, name: 'updatedname' };
      jest.spyOn(prismaService.user, 'update').mockResolvedValue(updatedUser);

      const result = await service.updateUser('1', updateUserDto);

      expect(result).toEqual(expect.objectContaining({ name: 'updatedname' }));
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { name: 'updatedname' },
      });
    });

    it('should update user with password', async () => {
      const updateUserDto: UpdateUserDto = { password: 'newpassword' };
      jest.spyOn(prismaService.user, 'update').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('newhashedpassword' as never);

      const result = await service.updateUser('1', updateUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { passwordHashed: 'newhashedpassword' },
      });
    });
  });

  describe('deleteUser', () => {
    it('should soft delete user', async () => {
      const deletedUser = { ...mockUser, deletedAt: new Date() };
      jest.spyOn(prismaService.user, 'update').mockResolvedValue(deletedUser);

      const result = await service.deleteUser('1');

      expect(result.deletedAt).toBeTruthy();
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { deletedAt: expect.any(Date) as unknown as Date },
      });
    });
  });
});
