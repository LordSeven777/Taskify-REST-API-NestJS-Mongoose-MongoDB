import { ForbiddenException, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { CreateTaskDTO } from './dto';
import { LabelService } from '../label/label.service';
import { Task } from './task.schema';
import { LabelDocument } from '../label/label.schema';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    private labelService: LabelService,
  ) {}

  async create(payload: CreateTaskDTO, userId: string | Types.ObjectId) {
    const labelsBelongsToUser = await this.labelService.existForUser(
      payload.labels,
      userId,
    );
    if (!labelsBelongsToUser) {
      throw new ForbiddenException(
        'Cannot create task with inappropriate labels',
        {
          description: 'Some of the task labels do not belong to the user',
        },
      );
    }
    const task = await this.taskModel.create({
      ...payload,
      user: userId,
    });
    return task.populate<{ labels: LabelDocument[] }>('labels');
  }
}
