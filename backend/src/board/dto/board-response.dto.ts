import { Expose } from 'class-transformer';

export class BoardResponseDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  description!: string | null;

  @Expose()
  createdAt!: Date;

  @Expose()
  subscriberCount!: number;

  @Expose()
  isSubscribed!: boolean;
}
