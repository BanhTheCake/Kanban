import { UpdateDataDto } from './dto/updateData.dto';
import { UpdatePositionDto } from './dto/updatePosition.dto';
import {
  Injectable,
  Inject,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { handleServerError } from 'src/Auth/Services/auth.service';
import { Boards } from 'src/Entity/Entities/boards.entity';
import { TResponse } from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class BoardService {
  constructor(@Inject('BOARDS') private BoardRepository: Repository<Boards>) {}

  async createNewBoard(userId: string): Promise<TResponse> {
    try {
      const boardsCount = await this.BoardRepository.count();
      const boards = await this.BoardRepository.find({
        where: { userId: userId },
        order: { position: 'ASC' },
      });
      const position = boards[boardsCount - 1]
        ? Number(boards[boardsCount - 1].position) + 1
        : boardsCount;
      const newBoard = await this.BoardRepository.save({
        userId: userId,
        position: position,
      });
      return {
        errCode: 0,
        msg: 'Ok',
        data: newBoard,
      };
    } catch (error) {
      if (error.response) {
        throw error;
      }
      throw new InternalServerErrorException(
        handleServerError('createNewBoard'),
      );
    }
  }

  async getAllBoards(userId: string): Promise<TResponse> {
    try {
      const boards = await this.BoardRepository.find({
        where: { userId: userId },
        order: { position: 'DESC' },
      });
      return {
        errCode: 0,
        msg: 'Ok',
        data: boards,
      };
    } catch (error) {
      if (error.response) {
        throw error;
      }
      throw new InternalServerErrorException(handleServerError('getAllBoards'));
    }
  }

  async getAllBoardsFavorite(userId: string): Promise<TResponse> {
    try {
      const boards = await this.BoardRepository.find({
        where: { userId: userId, isFavorite: true },
        order: { favoritePosition: 'DESC' },
      });
      return {
        errCode: 0,
        msg: 'Ok',
        data: boards,
      };
    } catch (error) {
      if (error.response) {
        throw error;
      }
      throw new InternalServerErrorException(
        handleServerError('getAllBoardsFavorite'),
      );
    }
  }

  async getCurrentBoard(boardId: string): Promise<TResponse> {
    try {
      const boards = await this.BoardRepository.createQueryBuilder('boards')
        .leftJoinAndSelect('boards.sections', 'sections')
        .leftJoinAndSelect('sections.tasks', 'tasks')
        .where('boards.boardId = :boardId', { boardId })
        .orderBy('sections.position', 'ASC')
        .addOrderBy('tasks.position', 'ASC')
        .getOne();

      const sections = boards.sections;
      delete boards.sections;

      return {
        errCode: 0,
        msg: 'Ok',
        data: { boards, sections },
      };
    } catch (error) {
      console.log(error);
      if (error.response) {
        throw error;
      }
      throw new InternalServerErrorException(
        handleServerError('getCurrentBoard'),
      );
    }
  }

  async updatePosition(data: UpdatePositionDto) {
    try {
      const newBoards = [...data.newBoards].reverse();
      for (const key in newBoards) {
        const index = Number(key);
        const board = newBoards[key];
        const currentBoard = await this.BoardRepository.findOne({
          where: { boardId: board.boardId },
        });
        if (data.type === 'private') {
          currentBoard.position = index;
        }
        if (data.type === 'favorite') {
          currentBoard.favoritePosition = index;
        }
        this.BoardRepository.save(currentBoard);
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
        handleServerError('updatePosition'),
      );
    }
  }

  async updateData(data: UpdateDataDto, boardId: string) {
    try {
      const currentBoard = await this.BoardRepository.findOne({
        where: { boardId },
      });
      if (!currentBoard) {
        throw new BadRequestException();
      }
      const newBoard = { ...currentBoard, ...data };

      if (data.isFavorite && data.isFavorite === true) {
        const favoriteCount = await this.BoardRepository.count({
          where: { userId: currentBoard.userId, isFavorite: true },
        });
        const favorites = await this.BoardRepository.find({
          where: { userId: currentBoard.userId, isFavorite: true },
          order: { favoritePosition: 'ASC' },
        });
        newBoard.favoritePosition = favorites[favoriteCount - 1]
          ? Number(favorites[favoriteCount - 1].favoritePosition) + 1
          : favoriteCount;
      }
      await this.BoardRepository.save(newBoard);
      return {
        errCode: 0,
        msg: 'Ok',
        data: newBoard,
      };
    } catch (error) {
      console.log(error);
      if (error.response) {
        throw error;
      }
      throw new InternalServerErrorException(
        handleServerError('updatePosition'),
      );
    }
  }

  async deleteBoard(boardId: string) {
    try {
      const currentBoard = await this.BoardRepository.findOne({
        where: { boardId },
      });
      if (!currentBoard) {
        throw new BadRequestException();
      }
      await this.BoardRepository.remove(currentBoard);
      return {
        errCode: 0,
        msg: 'Ok',
        data: currentBoard,
      };
    } catch (error) {
      console.log(error);
      if (error.response) {
        throw error;
      }
      throw new InternalServerErrorException(handleServerError('deleteBoard'));
    }
  }
}
