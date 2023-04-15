import { Body, Controller, Post, UseGuards } from '@nestjs/common';

// import { BindLabelParamPipe } from './pipe';
import { AccessTokenGuard } from '../auth/guards';
import { LabelService } from './label.service';
import { CreateLabelDTO } from './create-label.dto';
import { AuthUser } from '../auth/decorator';
import { UserDocument } from '../user/user.schema';

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
}
