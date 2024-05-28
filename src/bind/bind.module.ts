import { Module } from '@nestjs/common';
import { BindService } from './bind.service';
import { BindController } from './bind.controller';
import { TempLogModule } from 'src/temp-log/temp-log.module';

@Module({
  imports:[
    TempLogModule
  ],
  controllers: [BindController],
  providers: [BindService],
  exports: [BindService],
})
export class BindModule {}
