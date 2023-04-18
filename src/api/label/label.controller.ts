import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { BindLabelParamPipe } from './pipe';
import { AccessTokenGuard } from '../auth/guards';
import { LabelService } from './label.service';
import { CreateLabelDTO, UpdateLabelDTO } from './dto';
import { AuthUser, ApplyPolicy } from '../auth/decorator';
import { UserDocument } from '../user/user.schema';
import { LabelDocument } from './label.schema';
import { LabelPolicy } from './label.policy';
import { UserAction } from '../auth/auth.policy';

@Controller('api/labels')
export class LabelController {
  constructor(
    private labelService: LabelService,
    private labelPolicy: LabelPolicy,
  ) {}

  @Post('')
  @UseGuards(AccessTokenGuard)
  @ApplyPolicy(LabelPolicy, UserAction.Create)
  async create(
    @Body() payload: CreateLabelDTO,
    @AuthUser() authUser: UserDocument,
  ) {
    return this.labelService.create(authUser._id, payload);
  }

  @Put(':id')
  @UseGuards(AccessTokenGuard)
  async update(
    @Body() payload: UpdateLabelDTO,
    @Param('id', BindLabelParamPipe) label: LabelDocument,
    @AuthUser() authUser: UserDocument,
  ) {
    this.labelPolicy.authorize(authUser, UserAction.Update, label);
    return this.labelService.update(label, payload);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  async delete(
    @Param('id', BindLabelParamPipe) label: LabelDocument,
    @AuthUser() authUser: UserDocument,
  ) {
    this.labelPolicy.authorize(authUser, UserAction.Delete, label);
    return this.labelService.delete(label);
  }
}
