import {
  AbilityBuilder,
  ExtractSubjectType,
  ForbiddenError,
  InferSubjects,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';

import {
  AppAbility,
  ExceptionOptions,
  PolicyDefinition,
  UserAction,
} from '../auth/auth.policy';
import { UserDocument } from '../user/user.schema';
import { Task } from './task.schema';

export type TaskSubject = InferSubjects<typeof Task>;

@Injectable()
export class TaskPolicy extends PolicyDefinition<Task, TaskSubject> {
  createAbilityForUser(user: UserDocument) {
    const { can, build } = new AbilityBuilder(createMongoAbility);
    can(UserAction.Read, Task, undefined, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      'user.id': user.id,
    });
    can(UserAction.Read, Task, {
      user: user.id,
    });
    can(UserAction.Create, Task);
    can([UserAction.Update, UserAction.Delete], Task, {
      user: user.id,
    });
    return build({
      detectSubjectType(subject) {
        return subject.constructor as ExtractSubjectType<TaskSubject>;
      },
    }) as AppAbility<TaskSubject, Task>;
  }

  validateAbility(
    ability: AppAbility<TaskSubject, Task>,
    action: UserAction,
    task?: Task,
  ): boolean | void | ExceptionOptions {
    switch (action) {
      case UserAction.Create:
        ForbiddenError.from(ability)
          .setMessage('You do not have permissions for adding a task')
          .throwUnlessCan(UserAction.Create, Task);
        break;
      case UserAction.Read:
      case UserAction.Update:
      case UserAction.Delete:
        ForbiddenError.from(ability)
          .setMessage(
            `You should be the owner of the task in order to ${action} it`,
          )
          .throwUnlessCan(UserAction.Create, task);
        break;
      default:
        break;
    }
    return true;
  }
}
