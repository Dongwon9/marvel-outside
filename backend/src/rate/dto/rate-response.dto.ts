import { Exclude } from 'class-transformer';

export class RateResponseDto {
  userId!: string;

  postId!: string;

  isLike!: boolean;

  @Exclude()
  createdAt?: Date;

  constructor(partial?: Partial<RateResponseDto>) {
    Object.assign(this, partial);
  }
}
