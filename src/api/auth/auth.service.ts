import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import type { TokenType, UserJwtPayload, AuthResult } from './auth';
import { RegisterUserDTO } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private jwtService: JwtService,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  async generateToken(tokenType: TokenType, payload: UserJwtPayload) {
    const secretEnvKey = `${tokenType}_TOKEN_SECRET_KEY`;
    const secret = this.config.get<string>(secretEnvKey);
    const options: JwtSignOptions =
      tokenType === 'ACCESS' ? { expiresIn: '3d' } : undefined;
    return this.jwtService.signAsync(payload, {
      secret,
      ...options,
    });
  }

  async register(payload: RegisterUserDTO): Promise<AuthResult> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(payload.password, saltRounds);
    const user = await this.userModel.create({
      firstName: payload.firstName,
      lastName: payload.lastName,
      username: payload.username,
      email: payload.email,
      password: hashedPassword,
    });
    delete user.password;
    const jwtPayload = {
      sub: user._id.toString(),
      username: user.username,
    };
    const accessToken = await this.generateToken('ACCESS', jwtPayload);
    const refreshToken = await this.generateToken('REFRESH', jwtPayload);
    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
