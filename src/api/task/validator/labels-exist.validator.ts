import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isMongoId,
} from 'class-validator';
import { LabelService } from 'src/api/label/label.service';

@ValidatorConstraint({ name: 'LabelsExist', async: true })
@Injectable()
export class LabelsExist implements ValidatorConstraintInterface {
  constructor(private labelService: LabelService) {}

  async validate(labelIds: string[]) {
    if (!Array.isArray(labelIds)) return true;
    if (labelIds.some((id) => !isMongoId(id))) return true;
    return this.labelService.exist(labelIds);
  }

  defaultMessage(): string {
    return 'One of the labels does not exist';
  }
}
