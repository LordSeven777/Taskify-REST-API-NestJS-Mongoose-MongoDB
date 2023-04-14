import { Controller, Get, Param, Query } from '@nestjs/common';

import { UserService } from './user.service';
import { MatchesUserParam } from './decorator';

@Controller('api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id/tasks')
  @MatchesUserParam
  async getTasks(
    @Param() params: { id: string },
    @Query() query: { sort?: string; date?: string },
  ) {
    return this.userService.getTasks(params.id, query);
  }

  @Get(':id/labels')
  @MatchesUserParam
  async getLabels(
    @Param() params: { id: string },
    @Query() query: { q?: string },
  ) {
    return this.userService.getLabels(params.id, {
      search: query.q,
    });
  }
}
