export class PostResponseDto {
  id!: string;
  title!: string;
  content!: string;
  published!: boolean;
  hits!: number;
  authorId!: string;
  boardId!: string;
  createdAt!: Date;
  updatedAt!: Date;
  likes!: number;
  dislikes!: number;
  constructor(partial: Partial<PostResponseDto> = {}) {
    Object.assign(this, partial);
  }
}
