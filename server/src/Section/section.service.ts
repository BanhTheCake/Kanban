import { UpdateSectionDto } from './dto/updateSection.dto';
import { Repository } from 'typeorm';
import {
  Injectable,
  Inject,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { Sections } from 'src/Entity/Entities/sections.entity';
import { handleServerError } from 'src/Auth/Services/auth.service';
import { TResponse } from 'src/utils/types';
import { UpdatePositionDto } from './dto/updatePosition.dto';
@Injectable()
export class SectionService {
  constructor(
    @Inject('SECTIONS') private SectionRepository: Repository<Sections>,
  ) {}

  async createNewSection(boardId: string): Promise<TResponse> {
    try {
      const sectionsCount = await this.SectionRepository.count({
        where: { boardId },
      });
      const sections = await this.SectionRepository.find({
        where: { boardId: boardId },
        order: { position: 'ASC' },
      });
      const position = sections[sectionsCount - 1]
        ? Number(sections[sectionsCount - 1].position) + 1
        : sectionsCount;
      const currentSection = await this.SectionRepository.save({
        boardId: boardId,
        position: position,
      });
      return {
        errCode: 0,
        msg: 'Ok',
        data: currentSection,
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

  async deleteCurrentSection(sectionId: string): Promise<TResponse> {
    try {
      const sectionDelete = await this.SectionRepository.findOne({
        where: { sectionId },
      });
      if (!sectionDelete) {
        throw new BadRequestException();
      }
      await this.SectionRepository.remove(sectionDelete);
      return {
        errCode: 0,
        msg: 'Ok',
        data: sectionDelete,
      };
    } catch (error) {
      console.log(error);
      if (error.response) {
        throw error;
      }
      throw new InternalServerErrorException(
        handleServerError('deleteCurrentSection'),
      );
    }
  }

  async updateCurrentSection(
    data: UpdateSectionDto,
    sectionId: string,
  ): Promise<TResponse> {
    try {
      const currentSection = await this.SectionRepository.findOne({
        where: { sectionId },
      });
      if (!currentSection) {
        throw new BadRequestException();
      }
      currentSection.title = data.title;
      await this.SectionRepository.save(currentSection);
      return {
        errCode: 0,
        msg: 'Ok',
        data: currentSection,
      };
    } catch (error) {
      console.log(error);
      if (error.response) {
        throw error;
      }
      throw new InternalServerErrorException(
        handleServerError('updateCurrentSection'),
      );
    }
  }

  async updatePosition(data: UpdatePositionDto): Promise<TResponse> {
    try {
      const newSections = data.newSections;
      for (const key in newSections) {
        const index = Number(key);
        const currentSection = await this.SectionRepository.findOne({
          where: { sectionId: newSections[key].sectionId },
        });
        currentSection.position = index;
        await this.SectionRepository.save(currentSection);
      }
      return {
        errCode: 0,
        msg: 'Ok',
        data: newSections,
      };
    } catch (error) {
      console.log(error);
      if (error.response) {
        throw error;
      }
      throw new InternalServerErrorException(
        handleServerError('updateCurrentSection'),
      );
    }
  }
}
