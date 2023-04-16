import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';

import { CreateLabelDTO, UpdateLabelDTO } from './dto';
import { Label, LabelDocument } from './label.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class LabelService {
  constructor(@InjectModel('Label') private labelModel: Model<Label>) {}

  async getOne(id: Types.ObjectId | string) {
    const label = await this.labelModel.findById(id);
    if (!label) {
      throw new NotFoundException('Label not found', {
        description:
          'The label specified in the request id parameter is not found',
      });
    }
    return label;
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

  async update(label: LabelDocument, payload: UpdateLabelDTO) {
    if (payload?.name) label.name = payload.name;
    if (payload?.color) label.color = payload.color;
    await label.save();
    return label;
  }

  async delete(label: LabelDocument) {
    await label.deleteOne();
    return label;
  }

  async existsForUser(
    userId: Types.ObjectId | string,
    name: string,
  ): Promise<boolean> {
    const label = await this.labelModel.findOne({ name, user: userId });
    return label !== null;
  }
}
