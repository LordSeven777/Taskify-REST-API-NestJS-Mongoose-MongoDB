import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { CreateTaskDTO, UpdateTaskDTO } from './dto';
import { LabelService } from '../label/label.service';
import { Task, TaskDocument } from './task.schema';
import { LabelDocument } from '../label/label.schema';
import { UserDocument } from '../user/user.schema';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    private labelService: LabelService,
  ) {}

  async getOne(id: string | Types.ObjectId) {
    const task = await this.taskModel.findById(id);
    if (!task) {
      throw new NotFoundException('Cannot find the task');
    }
    return task.populate<{ user: UserDocument; labels: LabelDocument[] }>([
      'user',
      'labels',
    ]);
  }

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

  async update(task: TaskDocument, payload: UpdateTaskDTO) {
    if (payload.labels) {
      const labelsBelongsToUser = await this.labelService.existForUser(
        payload.labels,
        (task.user as UserDocument).id,
      );
      if (!labelsBelongsToUser) {
        throw new ForbiddenException(
          'Cannot update task with inappropriate labels',
          {
            description:
              'Some of the task labels do not belong to the owner of the task',
          },
        );
      }
    }
    payload.name && (task.name = payload.name);
    payload.description && (task.description = payload.description);
    payload.checkList && (task.checkList = payload.checkList);
    payload.startsAt && (task.startsAt = payload.startsAt);
    payload.endsAt && (task.endsAt = payload.endsAt);
    payload.isCompleted && (task.isCompleted = payload.isCompleted);
    payload.labels && (task.labels = payload.labels);
    await task.save();
    return task.populate<{ user: UserDocument; labels: LabelDocument[] }>([
      'user',
      'labels',
    ]);
  }

  async delete(task: TaskDocument) {
    await task.deleteOne();
    return task;
  }
}
