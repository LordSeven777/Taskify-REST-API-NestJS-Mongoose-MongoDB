import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Label, LabelSchema } from './label.schema';
import { LabelController } from './label.controller';
import { LabelService } from './label.service';

const labelMongooseModule = MongooseModule.forFeature([
  { name: Label.name, schema: LabelSchema },
]);

@Module({
  imports: [labelMongooseModule],
  exports: [labelMongooseModule, LabelService],
  providers: [LabelService],
  controllers: [LabelController],
})
export class LabelModule {}
