import { ContentFormat } from './content-format.enum';

export class PostResponseDto {
  id!: string;
  title!: string;
  content!: string;
  contentFormat!: ContentFormat;
  published!: boolean;
  hits!: number;
  authorId!: string;
  boardId!: string;
  createdAt!: Date;
  updatedAt!: Date;
  constructor(partial: Partial<PostResponseDto> = {}) {
    Object.assign(this, partial);
  }
}
