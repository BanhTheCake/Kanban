import { RefreshTokenGuard } from './../Guards/refreshToken.guard';
import { AccessTokenGuard } from './../Guards/accessToken.guard';
import {
  Controller,
  Get,
  Body,
  Res,
  Param,
  UseGuards,
  Post,
} from '@nestjs/common';
import { Response } from 'express';
import { LoginDto } from '../Dto/login.dto';
import { RegisterDto } from '../Dto/register.dto';
import { AuthService } from '../Services/auth.service';
import { User } from 'src/utils/decorators/user.decorator';
import { TAccessTokenPayload } from '../Services/jwt.service';

@Controller('auth')
export class AuthController {
  constructor(private AuthService: AuthService) {}

  @UseGuards(AccessTokenGuard)
  @Get('hello')
  getHello(@User() user: TAccessTokenPayload) {
    return user;
  }

  @Post('register')
  register(@Body() data: RegisterDto) {
    return this.AuthService.register(data);
  }

  @Post('login')
  login(
    @Body() data: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.AuthService.login(data, response);
  }

  @Get('logout/:id')
  logout(
    @Param('id') id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.AuthService.logout(id, response);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshToken(
    @User() { refreshToken }: { refreshToken: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.AuthService.refreshToken(refreshToken, res);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('verifyToken')
  verifyToken(
    @User() { refreshToken }: { refreshToken: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.AuthService.verifyToken(refreshToken, res);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('currentV2')
  getCurrentDataV2(
    @User() { refreshToken }: { refreshToken: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.AuthService.getCurrentDataV2(refreshToken, res);
  }

  @UseGuards(AccessTokenGuard)
  @Get('current')
  getCurrentData(@User() user: TAccessTokenPayload) {
    return user;
  }
}
