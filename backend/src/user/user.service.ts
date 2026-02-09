import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';

import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUser(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<UserResponseDto | null> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
    if (!user) return null;
    return plainToInstance(UserResponseDto, user);
  }

  async getUserById(id: string): Promise<UserResponseDto | null> {
    const user = await this.prisma.user.findFirst({
      where: { id: String(id), deletedAt: null },
    });
    if (!user) return null;
    return plainToInstance(UserResponseDto, user);
  }

  async getUsers(queryDto: GetUsersQueryDto): Promise<UserResponseDto[]> {
    const { skip, take, orderBy } = queryDto;
    const users = await this.prisma.user.findMany({
      where: { deletedAt: null },
      skip,
      take,
      orderBy: orderBy ? { [orderBy]: 'asc' } : undefined,
    });
    return plainToInstance(UserResponseDto, users);
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { email, name, password } = createUserDto;

    // Check if user already exists and is active
    const existingEmail = await this.prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
    if (existingEmail) {
      throw new ConflictException('User with this email already exists');
    }

    // Check if there's a deleted user with the same email and restore them
    const deletedUserWithEmail = await this.prisma.user.findFirst({
      where: { email, deletedAt: { not: null } },
    });
    if (deletedUserWithEmail) {
      const passwordHashed = await bcrypt.hash(password, 10);
      const restoredUser = await this.prisma.user.update({
        where: { id: deletedUserWithEmail.id },
        data: { deletedAt: null, passwordHashed, name },
      });
      return plainToInstance(UserResponseDto, restoredUser);
    }

    const existingName = await this.prisma.user.findUnique({
      where: { name },
    });
    if (existingName) {
      throw new ConflictException('User with this name already exists');
    }

    const passwordHashed = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        passwordHashed,
      },
    });
    return plainToInstance(UserResponseDto, user);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const { password, ...otherData } = updateUserDto;

    const data: Prisma.UserUpdateInput = {
      ...otherData,
    };

    if (password) {
      data.passwordHashed = await bcrypt.hash(password, 10);
    }
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data,
      });
      return plainToInstance(UserResponseDto, user);
    } catch (e) {
      // Handle unique constraint violations (e.g., email or name collisions)
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('User update violates unique constraint (email or name)');
      }
      throw e;
    }
  }

  async deleteUser(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return plainToInstance(UserResponseDto, user);
  }

  async restoreUser(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { deletedAt: null },
    });
    return plainToInstance(UserResponseDto, user);
  }
}
