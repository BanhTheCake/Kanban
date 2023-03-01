import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { Module } from '@nestjs/common';
@Module({
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
