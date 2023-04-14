import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';

import { User, UserDocument } from './user.schema';
import { QueryParams } from 'src/common/types/query';
import { getDateEdgeTimes } from 'src/common/utils/date-time.utils';
import { LabelDocument } from '../label/label.schema';
import { Task } from '../task/task.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Task') private taskModel: Model<Task>,
  ) {}

  async getOne(identifier: string) {
    const user = await this.userModel.findOne({
      $or: [
        { _id: identifier },
        { username: identifier },
        { email: identifier },
      ],
    });
    if (!user) {
      throw new NotFoundException('The user does not exist');
    }
    return user;
  }

  async getTasks(
    userId: ObjectId | string,
    params: QueryParams & { date?: string },
  ) {
    const sort = params.sort || '-startsAt';
    const date = params.date || new Date().toISOString();
    const [dateStart, dateEnd] = getDateEdgeTimes(date);
    const tasks = await this.taskModel
      .find({
        startsAt: {
          $lte: dateEnd,
        },
        endsAt: {
          $gte: dateStart,
        },
        user: userId,
      })
      .sort(sort)
      .select('-description -checkList')
      .populate<{ labels: LabelDocument[] }>('labels');
    return tasks;
  }

  async delete(user: UserDocument) {
    await user.deleteOne();
    return user;
  }
}
