import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateFollowDto {
  @IsUUID()
  @IsNotEmpty()
  followingId!: string;
}
