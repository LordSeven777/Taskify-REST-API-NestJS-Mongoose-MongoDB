import { PartialType } from '@nestjs/mapped-types';

import { CreateTaskDTO } from 'src/api/task/dto';

export class UpdateTaskDTO extends PartialType(CreateTaskDTO) {}
