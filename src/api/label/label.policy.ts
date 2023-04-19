import { Injectable } from '@nestjs/common';
import {
  AbilityBuilder,
  ExtractSubjectType,
  ForbiddenError,
  InferSubjects,
  createMongoAbility,
} from '@casl/ability';

import { PolicyDefinition, UserAction, AppAbility } from '../auth/auth.policy';
import { Label } from './label.schema';
import { UserDocument } from '../user/user.schema';

type LabelSubject = InferSubjects<typeof Label>;

@Injectable()
export class LabelPolicy extends PolicyDefinition<Label, LabelSubject> {
  createAbilityForUser(user: UserDocument) {
    const { can, build } = new AbilityBuilder(createMongoAbility);
    can(UserAction.Create, Label);
    can([UserAction.Update, UserAction.Delete], Label, {
      user: user.id,
    });
    return build({
      detectSubjectType(subject) {
        return subject.constructor as ExtractSubjectType<LabelSubject>;
      },
    }) as AppAbility<LabelSubject, Label>;
  }

  validateAbility(
    ability: AppAbility<LabelSubject, Label>,
    action: UserAction,
    label?: Label,
  ) {
    switch (action) {
      case UserAction.Create:
        ForbiddenError.from(ability)
          .setMessage('You do not have permissions for creating a label')
          .throwUnlessCan(action, Label);
        break;
      case UserAction.Update:
      case UserAction.Delete:
        ForbiddenError.from(ability)
          .setMessage('You are not the owner of the label')
          .throwUnlessCan(action, label);
        break;
      default:
        return true;
    }
  }
}
