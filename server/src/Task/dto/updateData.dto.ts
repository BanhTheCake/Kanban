import { IsOptional } from 'class-validator';

export class UpdateDataTaskDto {
  @IsOptional()
  title: string;

  @IsOptional()
  description: string;
}
