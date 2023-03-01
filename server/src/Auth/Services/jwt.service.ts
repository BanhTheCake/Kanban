import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export type TToken<T> = T & {
  iat: number;
  exp: number;
};

export type TAccessTokenPayload = {
  id: string;
  username: string;
};

export type TRefreshTokenPayload = {
  id: string;
  username: string;
};

@Injectable()
export class JWTService {
  constructor(
    private jwtService: JwtService,
    private ConfigService: ConfigService,
  ) {}

  generateAccessToken(data: TAccessTokenPayload) {
    return this.jwtService.sign(
      { id: data.id, username: data.username },
      {
        secret: this.ConfigService.get('ACCESS_TOKEN'),
        expiresIn: this.ConfigService.get('ACCESS_TOKEN_EXPIRES'),
      },
    );
  }

  generateRefreshToken(data: TRefreshTokenPayload) {
    return this.jwtService.sign(
      { id: data.id, username: data.username },
      {
        secret: this.ConfigService.get('REFRESH_TOKEN'),
        expiresIn: this.ConfigService.get('REFRESH_TOKEN_EXPIRES'),
      },
    );
  }
}
