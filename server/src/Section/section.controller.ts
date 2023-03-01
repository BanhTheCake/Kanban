import { AccessTokenGuard } from './../Auth/Guards/accessToken.guard';
import {
  Controller,
  UseGuards,
  Post,
  Body,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { SectionService } from './section.service';
import { UpdateSectionDto } from './dto/updateSection.dto';
import { UpdatePositionDto } from './dto/updatePosition.dto';
@Controller('sections')
export class SectionController {
  constructor(private SectionService: SectionService) {}

  @UseGuards(AccessTokenGuard)
  @Post('/create')
  createNewSection(@Body() data: { boardId: string }) {
    return this.SectionService.createNewSection(data.boardId);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/delete/:sectionId')
  deleteCurrentSection(@Param('sectionId') sectionId: string) {
    return this.SectionService.deleteCurrentSection(sectionId);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('/update/:sectionId')
  updateCurrentSection(
    @Body() data: UpdateSectionDto,
    @Param('sectionId') sectionId: string,
  ) {
    return this.SectionService.updateCurrentSection(data, sectionId);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('/updatePosition')
  updatePositionSections(@Body() data: UpdatePositionDto) {
    return this.SectionService.updatePosition(data);
  }
}
