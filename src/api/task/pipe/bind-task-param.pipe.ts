import { Injectable, PipeTransform } from '@nestjs/common';

import { TaskService } from '../task.service';

@Injectable()
export class BindTaskParamPipe implements PipeTransform {
  constructor(private taskService: TaskService) {}

  async transform(id: string) {
    return this.taskService.getOne(id);
  }
}
