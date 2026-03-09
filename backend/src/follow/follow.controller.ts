import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { Public } from '@/auth/decorators/public.decorator';
import type { User } from '@/generated/prisma/client';
import { UserResponseDto } from '@/user/dto/user-response.dto';

import { CreateFollowDto } from './dto/create-follow.dto';
import { FollowResponseDto } from './dto/follow-response.dto';
import { GetFollowersQueryDto } from './dto/get-followers-query.dto';
import { FollowService } from './follow.service';

@Controller('follows')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  // 사용자 팔로우 (followerId는 로그인 사용자로 고정)
  @Post('users/:userId/follow')
  @HttpCode(HttpStatus.CREATED)
  async follow(
    @Param('userId') userId: string,
    @Body() createFollowDto: CreateFollowDto,
    @CurrentUser() user: User,
  ): Promise<FollowResponseDto> {
    if (user.id !== userId) {
      throw new ForbiddenException('You can only follow as yourself');
    }
    return this.followService.follow(user.id, createFollowDto);
  }

  // 사용자 언팔로우 (followerId는 로그인 사용자로 고정)
  @Delete('users/:userId/follow/:followingId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unfollow(
    @Param('userId') userId: string,
    @Param('followingId') followingId: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    if (user.id !== userId) {
      throw new ForbiddenException('You can only unfollow as yourself');
    }
    await this.followService.unfollow(user.id, followingId);
  }

  // 특정 사용자의 팔로워 목록
  @Get('users/:userId/followers')
  @Public()
  async getFollowers(
    @Param('userId') userId: string,
    @Query() queryDto: GetFollowersQueryDto,
  ): Promise<
    Array<{
      createdAt: Date;
      user: UserResponseDto;
    }>
  > {
    return this.followService.getFollowers(userId, queryDto);
  }

  // 특정 사용자가 팔로우하는 목록
  @Get('users/:userId/following')
  @Public()
  async getFollowing(
    @Param('userId') userId: string,
    @Query() queryDto: GetFollowersQueryDto,
  ): Promise<
    Array<{
      createdAt: Date;
      user: UserResponseDto;
    }>
  > {
    return this.followService.getFollowing(userId, queryDto);
  }

  // 팔로우 통계 (팔로워 수, 팔로잉 수)
  @Get('users/:userId/stats')
  @Public()
  async getFollowStats(
    @Param('userId') userId: string,
  ): Promise<{ followersCount: number; followingCount: number }> {
    return this.followService.getFollowStats(userId);
  }

  // 팔로우 여부 확인
  @Get('users/:followerId/is-following/:followingId')
  @Public()
  async isFollowing(
    @Param('followerId') followerId: string,
    @Param('followingId') followingId: string,
  ): Promise<{ isFollowing: boolean }> {
    const isFollowing = await this.followService.isFollowing(followerId, followingId);
    return { isFollowing };
  }
}
