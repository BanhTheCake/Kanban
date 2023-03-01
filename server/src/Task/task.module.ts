import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Module } from '@nestjs/common';
@Module({
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
