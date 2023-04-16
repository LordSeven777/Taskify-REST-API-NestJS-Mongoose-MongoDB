import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';

import { BindLabelParamPipe } from './pipe';
import { AccessTokenGuard } from '../auth/guards';
import { LabelService } from './label.service';
import { CreateLabelDTO, UpdateLabelDTO } from './dto';
import { AuthUser } from '../auth/decorator';
import { UserDocument } from '../user/user.schema';
import { LabelDocument } from './label.schema';

@Controller('api/labels')
export class LabelController {
  constructor(private labelService: LabelService) {}

  @Post('')
  @UseGuards(AccessTokenGuard)
  async create(
    @Body() payload: CreateLabelDTO,
    @AuthUser() authUser: UserDocument,
  ) {
    return this.labelService.create(authUser._id, payload);
  }

  @Put(':id')
  @UseGuards(AccessTokenGuard)
  async update(
    @Param('id', BindLabelParamPipe) label: LabelDocument,
    @Body() payload: UpdateLabelDTO,
  ) {
    return this.labelService.update(label, payload);
  }
}
