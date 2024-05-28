import { Module } from '@nestjs/common';
import { BindService } from './bind.service';
import { BindController } from './bind.controller';

@Module({
  imports:[
  ],
  controllers: [BindController],
  providers: [BindService],
  exports: [BindService],
})
export class BindModule {}
