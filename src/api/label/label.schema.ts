import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import { User } from '../user/user.schema';

export type LabelDocument = HydratedDocument<Label>;

@Schema({ timestamps: true })
export class Label {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  name: string;

  @Prop({
    type: String,
    default: '#777777',
    required: true,
  })
  color: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
  })
  user: User;
}

export const LabelSchema = SchemaFactory.createForClass(Label);
