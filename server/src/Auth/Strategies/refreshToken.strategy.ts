import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'REFRESH_TOKEN',
) {
  constructor(ConfigService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.fromCookies,
      ]),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: ConfigService.get('REFRESH_TOKEN'),
    });
  }

  static fromCookies(req: Request) {
    const { refreshToken } = req.cookies;
    if (!refreshToken) throw new UnauthorizedException();
    return refreshToken;
  }

  async validate(request: Request) {
    const { refreshToken } = request.cookies;
    return { refreshToken };
  }
}
