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
import { CommentService } from '@/comment/comment.service';
import { User } from '@/generated/prisma/client';

import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly commentService: CommentService,
  ) {}

  @Get()
  async getUsers(@Query() queryDto: GetUsersQueryDto): Promise<UserResponseDto[]> {
    return this.userService.getUsers(queryDto);
  }

  @Get(':id')
  @Public()
  async getUserById(@Param('id') id: string): Promise<UserResponseDto | null> {
    return this.userService.getUserById(id);
  }

  @Get(':id/stats')
  @Public()
  async getUserStats(@Param('id') id: string): Promise<{
    postCount: number;
    commentCount: number;
    followerCount: number;
    followingCount: number;
    likedCount: number;
  }> {
    return this.userService.getUserStats(id);
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
    await this.userService.hardDeleteUserInstant(user.id);
  }

  @Get(':id/comments')
  @Public()
  async getUserComments(@Param('id') userId: string) {
    return this.commentService.findAllByAuthor(userId);
  }
}
