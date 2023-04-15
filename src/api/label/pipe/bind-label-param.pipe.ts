import { Injectable, PipeTransform } from '@nestjs/common';

import { LabelService } from '../label.service';

@Injectable()
export class BindLabelParamPipe implements PipeTransform {
  constructor(private labelService: LabelService) {}

  async transform(id: string) {
    return await this.labelService.getOne(id);
  }
}
