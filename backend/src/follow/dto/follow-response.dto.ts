import { Exclude, Expose } from 'class-transformer';

export class FollowResponseDto {
  @Expose()
  followerId!: string;

  @Expose()
  followingId!: string;

  @Expose()
  createdAt!: Date;

  constructor(partial: Partial<FollowResponseDto>) {
    Object.assign(this, partial);
  }
}
