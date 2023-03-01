import { AccessTokenGuard } from './../Auth/Guards/accessToken.guard';
import {
  Controller,
  Post,
  UseGuards,
  Get,
  Param,
  Patch,
  Body,
  Delete,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { User } from 'src/utils/decorators/user.decorator';
import { TAccessTokenPayload } from 'src/Auth/Services/jwt.service';
import { UpdatePositionDto } from './dto/updatePosition.dto';
import { UpdateDataDto } from './dto/updateData.dto';

@Controller('boards')
export class BoardController {
  constructor(private BoardService: BoardService) {}

  @UseGuards(AccessTokenGuard)
  @Post('/create')
  createNewBoard(@User() user: TAccessTokenPayload) {
    return this.BoardService.createNewBoard(user.id);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/all/favorite')
  getAllBoardsFavorite(@User() user: TAccessTokenPayload) {
    return this.BoardService.getAllBoardsFavorite(user.id);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/all')
  getAllBoards(@User() user: TAccessTokenPayload) {
    return this.BoardService.getAllBoards(user.id);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/current/:boardId')
  getCurrentBoard(@Param('boardId') boardId: string) {
    return this.BoardService.getCurrentBoard(boardId);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('/updatePosition')
  updatePosition(@Body() data: UpdatePositionDto) {
    return this.BoardService.updatePosition(data);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('/update/:boardId')
  updateData(@Body() data: UpdateDataDto, @Param('boardId') boardId: string) {
    return this.BoardService.updateData(data, boardId);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/delete/:boardId')
  deleteBoard(@Param('boardId') boardId: string) {
    return this.BoardService.deleteBoard(boardId);
  }
}
