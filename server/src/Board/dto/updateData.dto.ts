import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateDataDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;
}
