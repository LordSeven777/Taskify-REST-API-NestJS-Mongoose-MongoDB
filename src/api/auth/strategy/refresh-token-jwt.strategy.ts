import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/api/user/user.service';
import { UserJwtPayload } from '../auth';
import { Request } from 'express';
import { REFRESH_TOKEN_COOKIE_NAME } from '../auth.constants';

@Injectable()
export class RefreshTokenJwtStrategy extends PassportStrategy(
  Strategy,
  'RefreshTokenJwt',
) {
  constructor(config: ConfigService, private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenJwtStrategy.extractJwtFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get('REFRESH_TOKEN_SECRET_KEY'),
    });
  }

  static extractJwtFromCookie(req: Request): string | null {
    if (req.cookies && REFRESH_TOKEN_COOKIE_NAME in req.cookies) {
      return req.cookies[REFRESH_TOKEN_COOKIE_NAME];
    }
    return null;
  }

  async validate(payload: UserJwtPayload) {
    const user = await this.userService.getOne(payload.sub);
    return user;
  }
}
