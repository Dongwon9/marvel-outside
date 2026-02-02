export class PostResponseDto {
  id!: string;
  title!: string;
  content!: string;
  hits!: number;
  authorId!: string;
  authorName!: string;
  boardId!: string;
  boardName!: string;
  createdAt!: Date;
  updatedAt!: Date;
  publishedAt!: Date | null;
  likes!: number;
  dislikes!: number;
  constructor(partial: Partial<PostResponseDto> = {}) {
    Object.assign(this, partial);
  }
}
