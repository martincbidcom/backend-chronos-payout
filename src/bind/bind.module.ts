import { Module } from '@nestjs/common';
import { BindService } from './bind.service';

@Module({
  imports:[
  ],
  providers: [BindService],
  exports: [BindService],
})
export class BindModule {}
