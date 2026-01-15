import { ConflictException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
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
    const user = await this.prisma.user.findUnique({
      where: { id: String(id) },
    });
    if (!user) return null;
    return plainToInstance(UserResponseDto, user);
  }

  async getUsers(queryDto: GetUsersQueryDto): Promise<UserResponseDto[]> {
    const { skip, take, orderBy } = queryDto;
    const users = await this.prisma.user.findMany({
      skip,
      take,
      orderBy: orderBy ? { [orderBy]: 'asc' } : undefined,
    });
    return plainToInstance(UserResponseDto, users);
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Check if user already exists
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (existingEmail) {
      throw new ConflictException('User with this email already exists');
    }
    const existingName = await this.prisma.user.findUnique({
      where: { name: createUserDto.name },
    });
    if (existingName) {
      throw new ConflictException('User with this name already exists');
    }
    const { email, name, password } = createUserDto;
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

    const user = await this.prisma.user.update({
      where: { id },
      data,
    });
    return plainToInstance(UserResponseDto, user);
  }

  async deleteUser(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return plainToInstance(UserResponseDto, user);
  }
}
