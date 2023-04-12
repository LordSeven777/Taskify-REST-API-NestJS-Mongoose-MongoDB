import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/user/user.module';
import { TaskModule } from './api/task/task.module';
import { LabelModule } from './api/label/label.module';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL as string),
    AuthModule,
    UserModule,
    TaskModule,
    LabelModule,
  ],
})
export class AppModule {}
