import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterUserDTO, LoginDTO } from './dto';
import { AuthUser } from './decorator';
import { UserDocument } from '../user/user.schema';
import { AccessTokenGuard } from './guards';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() payload: RegisterUserDTO) {
    return this.authService.register(payload);
  }

  @Post('login')
  async login(@Body() credentials: LoginDTO) {
    return this.authService.login(credentials);
  }

  @Get('me')
  @UseGuards(AccessTokenGuard)
  getMe(@AuthUser() authUser: UserDocument) {
    return authUser;
  }
}
