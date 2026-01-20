import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { ContentFormat } from './content-format.enum';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @IsEnum(ContentFormat)
  @IsOptional()
  contentFormat?: ContentFormat;
}
