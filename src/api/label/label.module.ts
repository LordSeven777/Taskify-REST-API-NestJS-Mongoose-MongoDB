import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Label, LabelSchema } from './label.schema';

const labelMongooseModule = MongooseModule.forFeature([
  { name: Label.name, schema: LabelSchema },
]);

@Module({
  imports: [labelMongooseModule],
  exports: [labelMongooseModule],
})
export class LabelModule {}
