import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { PrismaService } from '../prisma/prisma.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { FollowResponseDto } from './dto/follow-response.dto';
import { GetFollowersQueryDto } from './dto/get-followers-query.dto';
import { UserResponseDto } from '../user/dto/user-response.dto';

@Injectable()
export class FollowService {
  constructor(private prisma: PrismaService) {}

  async follow(followerId: string, createFollowDto: CreateFollowDto): Promise<FollowResponseDto> {
    const { followingId } = createFollowDto;

    // 자기 자신을 팔로우할 수 없음
    if (followerId === followingId) {
      throw new BadRequestException('Cannot follow yourself');
    }

    // 팔로우할 사용자가 존재하는지 확인
    const targetUser = await this.prisma.user.findUnique({
      where: { id: followingId, deletedAt: null },
    });
    if (!targetUser) {
      throw new NotFoundException('User to follow not found');
    }

    // 이미 팔로우 중인지 확인
    const existingFollow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
    if (existingFollow) {
      throw new ConflictException('Already following this user');
    }

    // 팔로우 생성
    const follow = await this.prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });

    return plainToInstance(FollowResponseDto, follow);
  }

  async unfollow(followerId: string, followingId: string): Promise<void> {
    const follow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (!follow) {
      throw new NotFoundException('Follow relationship not found');
    }

    await this.prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
  }
  async getFollowers(
    userId: string,
    query: GetFollowersQueryDto,
  ): Promise<Array<{ createdAt: Date; user: UserResponseDto }>> {
    let orderByObj = {};
    if (query.orderBy) {
      const { field, direction } = query.orderBy;
      switch (field) {
        case 'createdAt':
          orderByObj = { createdAt: direction };
          break;
        case 'name':
          orderByObj = { follower: { name: direction } };
          break;
        case 'lastLoginAt':
          orderByObj = { follower: { lastLoginAt: direction } };
          break;
        default:
          orderByObj = { createdAt: 'desc' };
          break;
      }
    }
    const followers = await this.prisma.follow.findMany({
      where: {
        followingId: userId,
      },
      include: { follower: true },
      omit: {
        followerId: true,
        followingId: true,
      },
      skip: query.skip,
      take: query.take,
      orderBy: orderByObj,
    });
    return followers.map(({ follower, ...follow }) => ({
      createdAt: follow.createdAt,
      user: plainToInstance(UserResponseDto, follower),
    }));
  }
  
  async getFollowing(
    userId: string,
    query: GetFollowersQueryDto,
  ): Promise<Array<{ createdAt: Date; user: UserResponseDto }>> {
    let orderByObj = {};
    if (query.orderBy) {
      const { field, direction } = query.orderBy;
      switch (field) {
        case 'createdAt':
          orderByObj = { createdAt: direction };
          break;
        case 'name':
          orderByObj = { following: { name: direction } };
          break;
        case 'lastLoginAt':
          orderByObj = { following: { lastLoginAt: direction } };
          break;
        default:
          orderByObj = { createdAt: 'desc' };
          break;
      }
    }
    const followers = await this.prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      omit: {
        followerId: true,
        followingId: true,
      },
      include: { following: true },
      skip: query.skip,
      take: query.take,
      orderBy: orderByObj,
    });
    return followers.map(({ following, ...follow }) => ({
      createdAt: follow.createdAt,
      user: plainToInstance(UserResponseDto, following),
    }));
  }
  async getFollowStats(userId: string): Promise<{
    followersCount: number;
    followingCount: number;
  }> {
    const [followersCount, followingCount] = await Promise.all([
      this.prisma.follow.count({ where: { followingId: userId } }),
      this.prisma.follow.count({ where: { followerId: userId } }),
    ]);

    return { followersCount, followingCount };
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    return !!follow;
  }
}
