import {
  AbilityTuple,
  MongoAbility,
  MongoQuery,
  Subject,
  ForbiddenError,
} from '@casl/ability';
import { AnyObject } from '@casl/ability/dist/types/types';
import { ForbiddenException } from '@nestjs/common';

import { UserDocument } from '../user/user.schema';

export enum UserAction {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type AppAbility<TSubject = Subject, TFields = AnyObject> = MongoAbility<
  AbilityTuple<UserAction, TSubject>,
  MongoQuery<TFields>
>;

export interface ExceptionOptions {
  message?: string;
  description?: string;
}

export abstract class PolicyDefinition<TEntity = unknown, TSubject = Subject> {
  abstract createAbilityForUser(
    user: UserDocument,
  ): AppAbility<TSubject, TEntity>;

  abstract validateAbility(
    ability: AppAbility<TSubject, TEntity>,
    action: UserAction,
    subject?: TEntity,
  ): void | boolean | ExceptionOptions;

  authorize(
    user: UserDocument,
    action: UserAction,
    subject?: TEntity,
  ): boolean {
    const ability = this.createAbilityForUser(user);
    let isSuccess: boolean;
    let exceptionOptions: ExceptionOptions | undefined;
    try {
      const result = this.validateAbility(ability, action, subject);
      if (typeof result === 'boolean') isSuccess = result;
      else if (result) exceptionOptions = result;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException({
          message: 'Unauthorized action',
          description: error.message,
        });
      } else {
        throw error;
      }
    }
    if (typeof isSuccess !== 'undefined' && !isSuccess) {
      throw new ForbiddenException('Unauthorized action');
    }
    if (exceptionOptions) {
      exceptionOptions.message ||= 'Unauthorized action';
      throw new ForbiddenException(exceptionOptions);
    }
    return true;
  }
}
