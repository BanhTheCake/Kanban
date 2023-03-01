import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { Tasks } from 'src/Entity/Entities/tasks.entity';

export class UpdatePositionTaskDto {
  @IsNotEmpty()
  @IsArray()
  sourceTasks: Tasks[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  destinationTasks?: Tasks[];
}
