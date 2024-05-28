import { Module } from '@nestjs/common';
import { BindService } from './bind.service';
import { TempLogModule } from 'src/temp-log/temp-log.module';

@Module({
  imports:[
    TempLogModule
  ],
  providers: [BindService],
  exports: [BindService],
})
export class BindModule {}
