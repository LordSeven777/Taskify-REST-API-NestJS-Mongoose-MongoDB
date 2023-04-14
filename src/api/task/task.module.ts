import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Task, TaskSchema } from './task.schema';
import { TaskService } from './task.service';

const taskMongooseModule = MongooseModule.forFeature([
  { name: Task.name, schema: TaskSchema },
]);

@Module({
  imports: [taskMongooseModule],
  providers: [TaskService],
  exports: [taskMongooseModule, TaskService],
})
export class TaskModule {}
