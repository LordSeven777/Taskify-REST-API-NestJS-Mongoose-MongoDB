import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import { Label } from '../label/label.schema';
import { User } from '../user/user.schema';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task {
  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop()
  description: string;

  @Prop([
    {
      type: String,
      default: [],
    },
  ])
  checkList: string[];

  @Prop({
    type: Date,
    required: true,
  })
  startsAt: Date;

  @Prop({
    type: Date,
    required: true,
  })
  endsAt: Date;

  @Prop({
    type: Boolean,
    required: true,
    default: false,
  })
  isCompleted: boolean;

  @Prop([
    {
      type: MongooseSchema.Types.ObjectId,
      default: [],
      ref: 'Label',
    },
  ])
  labels: Label[];

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  user: User;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
