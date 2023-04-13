import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { AccessTokenJwtStrategy, RefreshTokenJwtStrategy } from './strategy';

@Module({
  imports: [UserModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenJwtStrategy, RefreshTokenJwtStrategy],
})
export class AuthModule {}
