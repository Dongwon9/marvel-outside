import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let mockUserService: Partial<UserService>;

  beforeEach(async () => {
    mockUserService = {
      createUser: jest.fn(),
      getUsers: jest.fn(),
      getUserById: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    let controller: UserController;
    let mockUserService: { createUser: jest.Mock };

    beforeEach(async () => {
      mockUserService = {
        createUser: jest.fn(),
      };

      const module: TestingModule = await Test.createTestingModule({
        controllers: [UserController],
        providers: [{ provide: UserService, useValue: mockUserService }],
      }).compile();

      controller = module.get<UserController>(UserController);
    });

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
      expect(mockUserService.createUser).toHaveBeenCalledWith(createUserDto);
      expect(mockUserService.createUser).toHaveBeenCalledTimes(1);
    });

    it('should pass correct CreateUserDto to service', async () => {
      const createUserDto: CreateUserDto = {
        email: 'newuser@example.com',
        name: 'newuser',
        password: 'securepass123',
      };

      mockUserService.createUser.mockResolvedValue({ id: '2' } as UserResponseDto);

      await controller.createUser(createUserDto);

      expect(mockUserService.createUser).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        name: 'newuser',
        password: 'securepass123',
      });
    });

    it('should return created user with all fields', async () => {
      const createUserDto: CreateUserDto = {
        email: 'user@example.com',
        name: 'user',
        password: 'pass123',
      };
      const userResponseDto: UserResponseDto = {
        id: '3',
        email: 'user@example.com',
        name: 'user',
        registeredAt: new Date('2024-01-01'),
        deletedAt: null,
        passwordHashed: '',
      };

      mockUserService.createUser.mockResolvedValue(userResponseDto);

      const result = await controller.createUser(createUserDto);

      expect(result).toHaveProperty('id', '3');
      expect(result).toHaveProperty('email', 'user@example.com');
      expect(result).toHaveProperty('name', 'user');
      expect(result).toHaveProperty('registeredAt');
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
    let controller: UserController;
    let mockUserService: { getUsers: jest.Mock };

    beforeEach(async () => {
      mockUserService = {
        getUsers: jest.fn(),
      };

      const module: TestingModule = await Test.createTestingModule({
        controllers: [UserController],
        providers: [{ provide: UserService, useValue: mockUserService }],
      }).compile();

      controller = module.get<UserController>(UserController);
    });

    it('should return array of users', async () => {
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

      mockUserService.getUsers.mockResolvedValue(mockUsers);

      const result = await controller.getUsers({ skip: 0, take: 10 });

      expect(result).toEqual(mockUsers);
      expect(mockUserService.getUsers).toHaveBeenCalledWith({ skip: 0, take: 10 });
    });

    it('should pass query parameters to service', async () => {
      mockUserService.getUsers.mockResolvedValue([]);

      await controller.getUsers({ skip: 5, take: 20, orderBy: 'email' });

      expect(mockUserService.getUsers).toHaveBeenCalledWith({
        skip: 5,
        take: 20,
        orderBy: 'email',
      });
    });

    it('should return empty array when no users found', async () => {
      mockUserService.getUsers.mockResolvedValue([]);

      const result = await controller.getUsers({ skip: 0, take: 10 });

      expect(result).toEqual([]);
    });
  });

  describe('getUserById', () => {
    let controller: UserController;
    let mockUserService: { getUserById: jest.Mock };

    beforeEach(async () => {
      mockUserService = {
        getUserById: jest.fn(),
      };

      const module: TestingModule = await Test.createTestingModule({
        controllers: [UserController],
        providers: [{ provide: UserService, useValue: mockUserService }],
      }).compile();

      controller = module.get<UserController>(UserController);
    });

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
      expect(mockUserService.getUserById).toHaveBeenCalledWith('1');
    });

    it('should return null when user not found', async () => {
      mockUserService.getUserById.mockResolvedValue(null);

      const result = await controller.getUserById('999');

      expect(result).toBeNull();
      expect(mockUserService.getUserById).toHaveBeenCalledWith('999');
    });

    it('should pass correct id to service', async () => {
      mockUserService.getUserById.mockResolvedValue(null);

      await controller.getUserById('abc123');

      expect(mockUserService.getUserById).toHaveBeenCalledWith('abc123');
    });
  });

  describe('updateUser', () => {
    let controller: UserController;
    let mockUserService: { updateUser: jest.Mock };

    beforeEach(async () => {
      mockUserService = {
        updateUser: jest.fn(),
      };

      const module: TestingModule = await Test.createTestingModule({
        controllers: [UserController],
        providers: [{ provide: UserService, useValue: mockUserService }],
      }).compile();

      controller = module.get<UserController>(UserController);
    });

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
      expect(mockUserService.updateUser).toHaveBeenCalledWith('1', updateUserDto);
    });

    it('should update user password', async () => {
      const updateUserDto: UpdateUserDto = { password: 'newpassword' };
      const updatedUser: UserResponseDto = {
        id: '1',
        email: 'test@example.com',
        name: 'testuser',
        registeredAt: new Date(),
        deletedAt: null,
        passwordHashed: '',
      };

      mockUserService.updateUser.mockResolvedValue(updatedUser);

      const result = await controller.updateUser('1', updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(mockUserService.updateUser).toHaveBeenCalledWith('1', { password: 'newpassword' });
    });

    it('should pass correct id and update dto to service', async () => {
      const updateUserDto: UpdateUserDto = { name: 'newname', password: 'newpass' };
      mockUserService.updateUser.mockResolvedValue({} as UserResponseDto);

      await controller.updateUser('user123', updateUserDto);

      expect(mockUserService.updateUser).toHaveBeenCalledWith('user123', updateUserDto);
    });
  });

  describe('deleteUser', () => {
    let controller: UserController;
    let mockUserService: { deleteUser: jest.Mock };

    beforeEach(async () => {
      mockUserService = {
        deleteUser: jest.fn(),
      };

      const module: TestingModule = await Test.createTestingModule({
        controllers: [UserController],
        providers: [{ provide: UserService, useValue: mockUserService }],
      }).compile();

      controller = module.get<UserController>(UserController);
    });

    it('should delete user successfully', async () => {
      mockUserService.deleteUser.mockResolvedValue(undefined);

      const result = await controller.deleteUser('1');

      expect(result).toBeUndefined();
      expect(mockUserService.deleteUser).toHaveBeenCalledWith('1');
    });

    it('should pass correct id to service', async () => {
      mockUserService.deleteUser.mockResolvedValue(undefined);

      await controller.deleteUser('user456');

      expect(mockUserService.deleteUser).toHaveBeenCalledWith('user456');
    });

    it('should handle delete errors', async () => {
      mockUserService.deleteUser.mockRejectedValue(new Error('User not found'));

      await expect(controller.deleteUser('999')).rejects.toThrow('User not found');
    });
  });
});
