import { Controller, Post, Body, Get, UseGuards, Res } from '@nestjs/common';
import { CookieOptions } from 'express';

import { AuthService } from './auth.service';
import { RegisterUserDTO, LoginDTO } from './dto';
import { AuthUser } from './decorator';
import { UserDocument } from '../user/user.schema';
import { AccessTokenGuard, RefreshTokenGuard } from './guards';
import { Response } from 'express';
import { REFRESH_TOKEN_COOKIE_NAME } from './auth.constants';

const refreshTokenCookieOptions: CookieOptions = {
  secure: true,
  httpOnly: true,
};

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() payload: RegisterUserDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const authResult = await this.authService.register(payload);
    res.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      authResult.refreshToken,
      refreshTokenCookieOptions,
    );
    return authResult;
  }

  @Post('login')
  async login(
    @Body() credentials: LoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const authResult = await this.authService.login(credentials);
    res.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      authResult.refreshToken,
      refreshTokenCookieOptions,
    );
    return authResult;
  }

  @Get('me')
  @UseGuards(AccessTokenGuard)
  getMe(@AuthUser() authUser: UserDocument) {
    return authUser;
  }

  @Post('refresh-token')
  @UseGuards(RefreshTokenGuard)
  async refreshToken(@AuthUser() authUser: UserDocument) {
    return this.authService.refreshToken(authUser);
  }
}
