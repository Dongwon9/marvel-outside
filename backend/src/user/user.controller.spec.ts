import { Test, TestingModule } from '@nestjs/testing';

import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    createUser: jest.fn(),
    getUsers: jest.fn(),
    getUserById: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user and return UserResponseDto', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'testuser',
        password: 'password123',
      };
      const userResponseDto: UserResponseDto = {
        id: '1',
        email: 'test@example.com',
        name: 'testuser',
        registeredAt: new Date(),
        deletedAt: null,
        passwordHashed: '',
      };

      mockUserService.createUser.mockResolvedValue(userResponseDto);

      const result = await controller.createUser(createUserDto);

      expect(result).toEqual(userResponseDto);
      expect(service.createUser).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw error when service throws ConflictException', async () => {
      const createUserDto: CreateUserDto = {
        email: 'existing@example.com',
        name: 'existing',
        password: 'pass123',
      };

      mockUserService.createUser.mockRejectedValue(
        new Error('User with this email already exists'),
      );

      await expect(controller.createUser(createUserDto)).rejects.toThrow(
        'User with this email already exists',
      );
    });
  });

  describe('getUsers', () => {
    it('should return array of users with query parameters', async () => {
      const mockUsers: UserResponseDto[] = [
        {
          id: '1',
          email: 'user1@example.com',
          name: 'user1',
          registeredAt: new Date(),
          deletedAt: null,
          passwordHashed: '',
        },
        {
          id: '2',
          email: 'user2@example.com',
          name: 'user2',
          registeredAt: new Date(),
          deletedAt: null,
          passwordHashed: '',
        },
      ];
      const query: GetUsersQueryDto = { skip: 0, take: 10 };

      mockUserService.getUsers.mockResolvedValue(mockUsers);

      const result = await controller.getUsers(query);

      expect(result).toEqual(mockUsers);
      expect(service.getUsers).toHaveBeenCalledWith(query);
    });
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const userResponseDto: UserResponseDto = {
        id: '1',
        email: 'test@example.com',
        name: 'testuser',
        registeredAt: new Date(),
        deletedAt: null,
        passwordHashed: '',
      };

      mockUserService.getUserById.mockResolvedValue(userResponseDto);

      const result = await controller.getUserById('1');

      expect(result).toEqual(userResponseDto);
      expect(service.getUserById).toHaveBeenCalledWith('1');
    });

    it('should return null when user not found', async () => {
      mockUserService.getUserById.mockResolvedValue(null);

      const result = await controller.getUserById('999');

      expect(result).toBeNull();
      expect(service.getUserById).toHaveBeenCalledWith('999');
    });
  });

  describe('updateUser', () => {
    it('should update user and return updated user', async () => {
      const updateUserDto: UpdateUserDto = { name: 'updatedname' };
      const updatedUser: UserResponseDto = {
        id: '1',
        email: 'test@example.com',
        name: 'updatedname',
        registeredAt: new Date(),
        deletedAt: null,
        passwordHashed: '',
      };

      mockUserService.updateUser.mockResolvedValue(updatedUser);

      const result = await controller.updateUser('1', updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(service.updateUser).toHaveBeenCalledWith('1', updateUserDto);
    });
  });

  describe('deleteUser', () => {
    it('should delete current user successfully', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'testuser',
        passwordHashed: 'hashed-password',
        registeredAt: new Date(),
        deletedAt: null,
      };

      mockUserService.deleteUser.mockResolvedValue(undefined);

      const result = await controller.deleteUser(mockUser as any);

      expect(result).toBeUndefined();
      expect(service.deleteUser).toHaveBeenCalledWith(mockUser.id);
    });
  });
});
