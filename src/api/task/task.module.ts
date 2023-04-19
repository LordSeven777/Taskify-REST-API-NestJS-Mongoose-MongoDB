import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Task, TaskSchema } from './task.schema';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { LabelsExist } from './validator';
import { LabelModule } from '../label/label.module';
import { TaskPolicy } from './task.policy';

const taskMongooseModule = MongooseModule.forFeature([
  { name: Task.name, schema: TaskSchema },
]);

@Module({
  imports: [taskMongooseModule, LabelModule],
  providers: [TaskService, LabelsExist, TaskPolicy],
  exports: [taskMongooseModule, TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
