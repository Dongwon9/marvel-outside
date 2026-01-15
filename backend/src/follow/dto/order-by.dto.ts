import { IsIn } from 'class-validator';

export class OrderByDto {
  @IsIn(['createdAt', 'name', 'lastLoginAt'])
  field!: 'createdAt' | 'name' | 'lastLoginAt';

  @IsIn(['asc', 'desc'])
  direction!: 'asc' | 'desc';
}
