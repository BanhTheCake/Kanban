import { ArrayMinSize, IsArray, IsNotEmpty, IsIn } from 'class-validator';
import { Boards } from 'src/Entity/Entities/boards.entity';

const types = ['favorite', 'private'] as const;
export type TypeState = (typeof types)[number];

export class UpdatePositionDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  newBoards: Boards[];

  @IsIn(types)
  type: TypeState;
}
