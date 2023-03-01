import { TaskService } from './task.service';
import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { UpdatePositionTaskDto } from './dto/updatePosition.dto';
import { UpdateDataTaskDto } from './dto/updateData.dto';
@Controller('tasks')
export class TaskController {
  constructor(private TaskService: TaskService) {}

  @Post('/create')
  createNewTask(@Body() data: { sectionId: string }) {
    return this.TaskService.createNewTask(data.sectionId);
  }

  @Patch('/updatePosition')
  updatePosition(@Body() data: UpdatePositionTaskDto) {
    return this.TaskService.updatePosition(data);
  }

  @Patch('/update/:taskId')
  updateData(@Param('taskId') taskId: string, @Body() data: UpdateDataTaskDto) {
    return this.TaskService.updateData(taskId, data);
  }
}
