import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/api/user/user.service';
import { UserJwtPayload } from '../auth';

@Injectable()
export class RefreshTokenJwtStrategy extends PassportStrategy(
  Strategy,
  'RefreshTokenJwt',
) {
  constructor(config: ConfigService, private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('REFRESH_TOKEN_SECRET_KEY'),
    });
  }

  async validate(payload: UserJwtPayload) {
    const user = await this.userService.getOne(payload.sub);
    return user;
  }
}
