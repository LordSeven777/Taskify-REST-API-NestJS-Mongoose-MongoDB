import { BadRequestException, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';

import { CreateLabelDTO } from './create-label.dto';
import { Label } from './label.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class LabelService {
  constructor(@InjectModel('Label') private labelModel: Model<Label>) {}

  async existsForUser(
    userId: Types.ObjectId | string,
    name: string,
  ): Promise<boolean> {
    const label = await this.labelModel.findOne({ name, user: userId });
    return label !== null;
  }

  async create(userId: Types.ObjectId | string, payload: CreateLabelDTO) {
    if (await this.existsForUser(userId, payload.name)) {
      throw new BadRequestException('Label name already exists', {
        description: 'The label name already exists for the authenticated user',
      });
    }
    const label = await this.labelModel.create({
      name: payload.name,
      color: payload.color,
      user: userId,
    });
    return label;
  }
}
