import { Injectable } from '@nestjs/common';
import {
  AbilityBuilder,
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
      detectSubjectType: () => Label,
    }) as AppAbility<LabelSubject, Label>;
  }

  validateAbility(
    ability: AppAbility<LabelSubject, Label>,
    action: UserAction,
    label?: Label,
  ) {
    let message: string;
    switch (action) {
      case UserAction.Create:
        message = 'You do not have permissions for creating a label';
        break;
      case UserAction.Update:
      case UserAction.Delete:
        message = `You cannot ${action} the label are the owner of the label`;
        break;
      default:
        throw new Error('Unsupported user action on label policy');
    }
    ForbiddenError.from(ability)
      .setMessage(message)
      .throwUnlessCan(action, label ?? Label);
    return true;
  }
}
