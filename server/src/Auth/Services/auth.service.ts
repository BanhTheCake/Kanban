import { JWTService } from './jwt.service';
import { LoginDto } from './../Dto/login.dto';
import {
  Injectable,
  Inject,
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Users } from 'src/Entity/Entities/users.entity';
import { TResponse } from 'src/utils/types';
import { Repository } from 'typeorm';
import { RegisterDto } from '../Dto/register.dto';
import * as argon2 from 'argon2';
import { Response } from 'express';
import { cookieConfig } from 'src/utils/config';

export const handleServerError = (place: string) =>
  `Something wrong with server (AuthService - ${place}) !`;

@Injectable()
export class AuthService {
  constructor(
    @Inject('USERS') private userRepository: Repository<Users>,
    private JWTService: JWTService,
  ) {}

  getHello() {
    return 'i am auth service and hello';
  }

  async register(data: RegisterDto): Promise<TResponse> {
    try {
      const duplicateUser = await this.userRepository.findOne({
        where: { username: data.username },
      });
      if (duplicateUser) {
        return {
          errCode: 1,
          msg: 'Username has been exist in our system !',
        };
      }
      await this.userRepository.save([
        { username: data.username, password: await argon2.hash(data.password) },
      ]);
      return {
        errCode: 0,
        msg: 'ok',
      };
    } catch (error) {
      if (error.response) {
        throw error;
      }
      throw new InternalServerErrorException(handleServerError('register'));
    }
  }

  async login(data: LoginDto, response: Response): Promise<TResponse> {
    try {
      const currentUser = await this.userRepository.findOne({
        where: { username: data.username },
      });
      if (!currentUser) {
        return {
          errCode: 1,
          msg: 'Username or password is incorrect !',
        };
      }
      const isEqual = await argon2.verify(currentUser.password, data.password);
      if (!isEqual) {
        return {
          errCode: 1,
          msg: 'Username or password is incorrect !',
        };
      }

      const accessToken = this.JWTService.generateAccessToken({
        id: currentUser.id,
        username: currentUser.username,
      });

      const refreshToken = this.JWTService.generateRefreshToken({
        id: currentUser.id,
        username: currentUser.username,
      });

      response.cookie('refreshToken', refreshToken, cookieConfig);
      currentUser.refreshToken = refreshToken;
      await this.userRepository.save(currentUser);

      delete currentUser.password;
      delete currentUser.refreshToken;
      delete currentUser.created_at;
      delete currentUser.updated_at;

      return {
        errCode: 0,
        msg: 'Ok',
        data: { token: accessToken, data: currentUser },
      };
    } catch (error) {
      if (error.response) {
        throw error;
      }
      throw new InternalServerErrorException(handleServerError('login'));
    }
  }

  async logout(userId: string, response: Response): Promise<TResponse> {
    try {
      const currentUser = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!currentUser) {
        response.cookie('refreshToken', null, cookieConfig);
        throw new BadRequestException();
      }
      response.cookie('refreshToken', null, cookieConfig);
      currentUser.refreshToken = null;
      await this.userRepository.save(currentUser);
      return {
        errCode: 0,
        msg: 'Ok',
      };
    } catch (error) {
      if (error.response) {
        throw error;
      }
      throw new InternalServerErrorException(handleServerError('logout'));
    }
  }

  async refreshToken(refreshToken: string, res: Response): Promise<TResponse> {
    try {
      const currentUser = await this.userRepository.findOne({
        where: { refreshToken },
      });

      if (!currentUser) {
        throw new UnauthorizedException();
      }

      const newAccessToken = this.JWTService.generateAccessToken({
        id: currentUser.id,
        username: currentUser.username,
      });

      const newRefreshToken = this.JWTService.generateRefreshToken({
        id: currentUser.id,
        username: currentUser.username,
      });

      currentUser.refreshToken = newRefreshToken;
      res.cookie('refreshToken', newRefreshToken, cookieConfig);
      await this.userRepository.save(currentUser);

      return {
        errCode: 0,
        msg: 'Ok',
        data: {
          token: newAccessToken,
        },
      };
    } catch (error) {
      if (error.response) {
        throw error;
      }
      throw new InternalServerErrorException(handleServerError('refreshToken'));
    }
  }

  async verifyToken(refreshToken: string, res: Response): Promise<TResponse> {
    try {
      const currentUser = await this.userRepository.findOne({
        where: { refreshToken },
      });

      if (!currentUser) {
        res.cookie('refreshToken', null, cookieConfig);
        throw new UnauthorizedException();
      }
      return {
        errCode: 0,
        msg: 'Ok',
      };
    } catch (error) {
      if (error.response) {
        throw error;
      }
      throw new InternalServerErrorException(handleServerError('verifyToken'));
    }
  }
}
