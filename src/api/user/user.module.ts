import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from './user.schema';
import { UniqueUserFieldValidator } from './decorator/unique-field.decorator';
import { UserService } from './user.service';

const userMongooseModule = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
]);

@Module({
  imports: [userMongooseModule],
  providers: [UniqueUserFieldValidator, UserService],
  exports: [UniqueUserFieldValidator, userMongooseModule, UserService],
})
export class UserModule {}
