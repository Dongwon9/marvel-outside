import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { Public } from '@/auth/decorators/public.decorator';
import { User } from '@/generated/prisma/client';

import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(@Query() queryDto: GetUsersQueryDto): Promise<UserResponseDto[]> {
    return this.userService.getUsers(queryDto);
  }

  @Get(':id')
  @Public()
  async getUserById(@Param('id') id: string): Promise<UserResponseDto | null> {
    return this.userService.getUserById(id);
  }

  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@CurrentUser() user: User): Promise<void> {
    await this.userService.deleteUser(user.id);
  }
}
