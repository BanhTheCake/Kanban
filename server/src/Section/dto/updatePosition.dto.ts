import { ArrayMinSize, IsArray, IsNotEmpty } from 'class-validator';
import { Sections } from 'src/Entity/Entities/sections.entity';

export class UpdatePositionDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  newSections: Sections[];
}
