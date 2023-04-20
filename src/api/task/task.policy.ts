import {
  AbilityBuilder,
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
    const actions = [UserAction.Read, UserAction.Update, UserAction.Delete];
    can(UserAction.Create, Task);
    can(actions, Task, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      'user.id': user.id,
    });
    can(actions, Task, {
      user: user.id,
    });
    return build({
      detectSubjectType: () => Task,
    }) as AppAbility<TaskSubject, Task>;
  }

  validateAbility(
    ability: AppAbility<TaskSubject, Task>,
    action: UserAction,
    task?: Task,
  ): boolean | void | ExceptionOptions {
    let message: string;
    switch (action) {
      case UserAction.Create:
        message = 'You do not have permissions for adding a task';
        break;
      case UserAction.Read:
      case UserAction.Update:
      case UserAction.Delete:
        message = `You should be the owner of the task in order to ${action} it`;
        break;
      default:
        throw new Error('Unsupported user action on task policy');
    }
    ForbiddenError.from(ability)
      .setMessage(message)
      .throwUnlessCan(action, task ?? Task);
    return true;
  }
}
