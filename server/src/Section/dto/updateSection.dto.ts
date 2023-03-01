import { IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateSectionDto {
  @IsNotEmpty()
  title: string;
}
