import { Controller, Post, Body } from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterUserDTO, LoginDTO } from './dto';

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
}
