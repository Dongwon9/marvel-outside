import { CreateBoardDto } from '../../src/board/dto/create-board.dto';
import { CreateCommentDto } from '../../src/comment/dto/create-comment.dto';
import { CreatePostDto } from '../../src/post/dto/create-post.dto';
import { CreateRateDto } from '../../src/rate/dto/create-rate.dto';

/**
 * E2E 테스트용 팩토리 모음
 */

export class E2EBoardFactory {
  static createBoardDto(overrides?: Partial<CreateBoardDto>): CreateBoardDto {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    const unique = `${timestamp}-${random}`;

    return {
      name: `Board${unique}`,
      description: `Description for board ${unique}`,
      ...overrides,
    };
  }

  static createBoardDtos(count: number, overrides?: Partial<CreateBoardDto>) {
    return Array.from({ length: count }, () => this.createBoardDto(overrides));
  }
}

export class E2EPostFactory {
  static createPostDto(overrides?: Partial<CreatePostDto>): CreatePostDto {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    const unique = `${timestamp}-${random}`;

    return {
      title: `Post Title ${unique}`,
      content: `# Post Content ${unique}\n\nThis is test content.`,
      boardId: 'board-id-placeholder',
      ...overrides,
    };
  }

  static createPostDtos(count: number, overrides?: Partial<CreatePostDto>) {
    return Array.from({ length: count }, () => this.createPostDto(overrides));
  }

  static createPostDtoWithBoard(
    boardId: string,
    overrides?: Partial<CreatePostDto>,
  ): CreatePostDto {
    return this.createPostDto({
      boardId,
      ...overrides,
    });
  }
}

export class E2ECommentFactory {
  static createCommentDto(overrides?: Partial<CreateCommentDto>): CreateCommentDto {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);

    return {
      content: `Test comment ${timestamp}-${random}`,
      ...overrides,
    };
  }

  static createCommentDtos(count: number, overrides?: Partial<CreateCommentDto>) {
    return Array.from({ length: count }, () => this.createCommentDto(overrides));
  }
}

export class E2ERateFactory {
  static createRateDto(
    userId: string,
    postId: string,
    isLike: boolean = true,
    overrides?: Partial<CreateRateDto>,
  ): CreateRateDto {
    return {
      userId,
      postId,
      isLike,
      ...overrides,
    };
  }

  static createMultipleRateDtos(
    userIds: string[],
    postId: string,
    isLike: boolean = true,
  ): CreateRateDto[] {
    return userIds.map(userId => this.createRateDto(userId, postId, isLike));
  }
}

export class E2EFollowFactory {
  static createFollowDto(
    followerId: string,
    followingId: string,
  ): { followerId: string; followingId: string } {
    return {
      followerId,
      followingId,
    };
  }

  static createFollowDtos(
    followerId: string,
    followingIds: string[],
  ): { followerId: string; followingId: string }[] {
    return followingIds.map(followingId => this.createFollowDto(followerId, followingId));
  }
}
