import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  applyDecorators,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { UserDocument } from '../user.schema';
import { AccessTokenGuard } from 'src/api/auth/guards';

/**
 * Guard that requires the authenticated user to be the specified user param 'id' in the request parameters
 */
@Injectable()
export class MatchesUserParamGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const authUser = request.user as UserDocument;
    if (authUser.id !== request.params.id) {
      throw new ForbiddenException(
        'You are not the user specified in the request parameter',
      );
    }
    return true;
  }
}

/**
 * Wrapper decorator for the MatchUserParamGuard guard
 */
export const MatchesUserParam = applyDecorators(
  UseGuards(AccessTokenGuard),
  UseGuards(MatchesUserParamGuard),
);
