import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { TaskService } from './task.service';
import { AccessTokenGuard, PolicyGuard } from '../auth/guards';
import { CreateTaskDTO } from './dto';
import { TaskPolicy } from './task.policy';
import { UserDocument } from '../user/user.schema';
import { UserAction } from '../auth/auth.policy';
import { AuthUser, CheckPolicy } from '../auth/decorator';

@Controller('api/tasks')
export class TaskController {
  constructor(
    private taskService: TaskService,
    private taskPolicy: TaskPolicy,
  ) {}

  @Post('')
  @UseGuards(AccessTokenGuard)
  @UseGuards(PolicyGuard)
  @CheckPolicy(TaskPolicy, UserAction.Create)
  async create(
    @Body() payload: CreateTaskDTO,
    @AuthUser() authUser: UserDocument,
  ) {
    return this.taskService.create(payload, authUser.id);
  }
}
