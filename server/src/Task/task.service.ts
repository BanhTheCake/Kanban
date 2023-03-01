import { UpdateDataTaskDto } from './dto/updateData.dto';
import { UpdatePositionTaskDto } from './dto/updatePosition.dto';
import { Tasks } from 'src/Entity/Entities/tasks.entity';
import { Repository } from 'typeorm';
import {
  Injectable,
  Inject,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { TResponse } from 'src/utils/types';
import { handleServerError } from 'src/Auth/Services/auth.service';
@Injectable()
export class TaskService {
  constructor(@Inject('TASKS') private TaskRepository: Repository<Tasks>) {}

  async createNewTask(sectionId: string): Promise<TResponse> {
    try {
      const tasksCount = await this.TaskRepository.count({
        where: { sectionId },
      });
      const tasks = await this.TaskRepository.find({
        where: { sectionId: sectionId },
        order: { position: 'ASC' },
      });
      const position = tasks[tasksCount - 1]
        ? Number(tasks[tasksCount - 1].position) + 1
        : tasksCount;
      const currentTask = await this.TaskRepository.save({
        sectionId: sectionId,
        position: position,
      });
      return {
        errCode: 0,
        msg: 'Ok',
        data: currentTask,
      };
    } catch (error) {
      console.log(error);
      if (error.response) {
        throw error;
      }
      throw new InternalServerErrorException(
        handleServerError('createNewSection'),
      );
    }
  }

  async updatePosition(data: UpdatePositionTaskDto): Promise<TResponse> {
    try {
      const { destinationTasks, sourceTasks } = data;
      for (const key in sourceTasks) {
        const index = Number(key);
        const currentTasks = await this.TaskRepository.findOne({
          where: { taskId: sourceTasks[index].taskId },
        });
        currentTasks.position = index;
        await this.TaskRepository.save(currentTasks);
      }

      if (destinationTasks) {
        for (const key in destinationTasks) {
          const index = Number(key);
          const currentTasks = await this.TaskRepository.findOne({
            where: { taskId: destinationTasks[index].taskId },
            loadEagerRelations: false,
          });
          currentTasks.position = index;
          currentTasks.sectionId = destinationTasks[index].sectionId;
          await this.TaskRepository.save(currentTasks);
        }
      }

      return {
        errCode: 0,
        msg: 'Ok',
      };
    } catch (error) {
      console.log(error);
      if (error.response) {
        throw error;
      }
      throw new InternalServerErrorException(
        handleServerError('createNewSection'),
      );
    }
  }

  async updateData(
    taskId: string,
    data: UpdateDataTaskDto,
  ): Promise<TResponse> {
    try {
      const currentTask = await this.TaskRepository.findOne({
        where: { taskId },
      });
      const newTask = { ...currentTask, ...data };
      await this.TaskRepository.save(newTask);
      return {
        errCode: 0,
        msg: 'Ok',
        data: newTask,
      };
    } catch (error) {
      console.log(error);
      if (error.response) {
        throw error;
      }
      throw new InternalServerErrorException(handleServerError('updateData'));
    }
  }
}
