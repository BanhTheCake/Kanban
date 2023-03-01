import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { TAccessTokenPayload, TToken } from '../Services/jwt.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'ACCESS_TOKEN',
) {
  constructor(ConfigService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ConfigService.get('ACCESS_TOKEN'),
    });
  }

  async validate(payload: TToken<TAccessTokenPayload>) {
    return { id: payload.id, username: payload.username };
  }
}
