import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from './user.schema';
import { UniqueUserFieldValidator } from './decorator/unique-field.decorator';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UniqueUserFieldValidator],
  exports: [UniqueUserFieldValidator],
})
export class UserModule {}
