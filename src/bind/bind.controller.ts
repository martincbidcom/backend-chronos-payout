import { Body, Controller, Get } from '@nestjs/common';
import { BindService } from './bind.service';
import { DoRequestDto } from 'src/common/dto/bind.dto';

@Controller()
export class BindController {
  constructor(private readonly bindService: BindService) {}

  @Get()
  async getHello(@Body() body: DoRequestDto) {
    return await this.bindService.doTransaction(body);
  }
}
