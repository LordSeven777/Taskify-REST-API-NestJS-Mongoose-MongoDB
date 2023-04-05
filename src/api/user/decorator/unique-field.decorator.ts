import { Injectable, applyDecorators } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Validate, ValidatorConstraint } from 'class-validator';

import { User } from 'src/api/user/user.schema';
import { UniqueFieldValidator } from 'src/common/validators';

@ValidatorConstraint({ name: 'Unique', async: true })
@Injectable()
export class UniqueUserFieldValidator extends UniqueFieldValidator<User> {
  constructor(@InjectModel(User.name) protected model: Model<User>) {
    super();
  }
}

/**
 * Compound decorator for the unique user field validation
 *
 * @param field The unique field
 * @returns The compound decorator
 */
export function IsUniqueUserField(field: string) {
  return applyDecorators(Validate(UniqueUserFieldValidator, [field]));
}
