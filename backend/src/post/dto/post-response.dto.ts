export class PostResponseDto {
  id!: string;
  title!: string;
  content!: string;
  published!: boolean;
  authorId!: string;
  boardId!: string;
  createdAt!: Date;
  updatedAt!: Date;
  constructor(partial: Partial<PostResponseDto> = {}) {
    Object.assign(this, partial);
  }
}
