import { Body, Controller, Get, Post } from '@nestjs/common';
import { BindService } from './bind.service';
import { DoRequestDto } from 'src/common/dto/bind.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('BindController')
@Controller()
export class BindController {
  constructor(private readonly bindService: BindService) {}

  @Post('do-request-bind')
  async doTransaction(@Body() body: DoRequestDto) {
    return await this.bindService.doTransaction(body);
  }
}
