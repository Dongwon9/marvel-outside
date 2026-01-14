import { Exclude } from 'class-transformer';

export class UserResponseDto {
  id!: string;
  email!: string;
  name!: string;
  registeredAt!: Date;
  deletedAt!: Date | null;

  @Exclude()
  passwordHashed!: string;

  constructor(partial: Partial<UserResponseDto> = {}) {
    Object.assign(this, partial);
  }
}
