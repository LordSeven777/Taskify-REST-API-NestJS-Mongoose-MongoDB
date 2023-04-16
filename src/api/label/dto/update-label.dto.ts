import { PartialType } from '@nestjs/mapped-types';

import { CreateLabelDTO } from './create-label.dto';

export class UpdateLabelDTO extends PartialType(CreateLabelDTO) {}
