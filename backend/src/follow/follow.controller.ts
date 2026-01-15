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
} from '@nestjs/common';

import { FollowService } from './follow.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { GetFollowersQueryDto } from './dto/get-followers-query.dto';
import { FollowResponseDto } from './dto/follow-response.dto';

import { UserResponseDto } from '@/user/dto/user-response.dto';

@Controller('follows')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  // 사용자 팔로우
  @Post('users/:userId/follow')
  @HttpCode(HttpStatus.CREATED)
  async follow(
    @Param('userId') followerId: string,
    @Body() createFollowDto: CreateFollowDto,
  ): Promise<FollowResponseDto> {
    return this.followService.follow(followerId, createFollowDto);
  }

  // 사용자 언팔로우
  @Delete('users/:userId/follow/:followingId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unfollow(
    @Param('userId') followerId: string,
    @Param('followingId') followingId: string,
  ): Promise<void> {
    await this.followService.unfollow(followerId, followingId);
  }

  // 특정 사용자의 팔로워 목록
  @Get('users/:userId/followers')
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
  async getFollowStats(
    @Param('userId') userId: string,
  ): Promise<{ followersCount: number; followingCount: number }> {
    return this.followService.getFollowStats(userId);
  }

  // 팔로우 여부 확인
  @Get('users/:followerId/is-following/:followingId')
  async isFollowing(
    @Param('followerId') followerId: string,
    @Param('followingId') followingId: string,
  ): Promise<{ isFollowing: boolean }> {
    const isFollowing = await this.followService.isFollowing(followerId, followingId);
    return { isFollowing };
  }
}
