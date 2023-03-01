import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { Module } from '@nestjs/common';
@Module({
  controllers: [SectionController],
  providers: [SectionService],
})
export class SectionModule {}
