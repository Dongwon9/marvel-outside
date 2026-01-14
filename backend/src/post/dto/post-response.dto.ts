export class PostResponseDto {
  id!: string;
  title!: string;
  content!: string;
  published!: boolean;
  authorId!: string;

  constructor(partial: Partial<PostResponseDto> = {}) {
    Object.assign(this, partial);
  }
}
