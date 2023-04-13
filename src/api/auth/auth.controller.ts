import { Controller, Post, Body, Get, UseGuards, Res } from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterUserDTO, LoginDTO } from './dto';
import { AuthUser } from './decorator';
import { UserDocument } from '../user/user.schema';
import { AccessTokenGuard } from './guards';
import { Response } from 'express';
import { REFRESH_TOKEN_COOKIE_NAME } from './auth.constants';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() payload: RegisterUserDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const authResult = await this.authService.register(payload);
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, authResult.refreshToken, {
      secure: true,
      httpOnly: true,
    });
    return authResult;
  }

  @Post('login')
  async login(
    @Body() credentials: LoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const authResult = await this.authService.login(credentials);
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, authResult.refreshToken, {
      secure: true,
      httpOnly: true,
    });
    return authResult;
  }

  @Get('me')
  @UseGuards(AccessTokenGuard)
  getMe(@AuthUser() authUser: UserDocument) {
    return authUser;
  }
}
