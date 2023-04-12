import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from './user.schema';
import { UniqueUserFieldValidator } from './decorator/unique-field.decorator';

const userMongooseModule = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
]);

@Module({
  imports: [userMongooseModule],
  providers: [UniqueUserFieldValidator],
  exports: [UniqueUserFieldValidator, userMongooseModule],
})
export class UserModule {}
