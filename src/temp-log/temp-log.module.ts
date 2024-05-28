import { Module } from '@nestjs/common';
import { TempLogService } from './temp-log.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TempLog } from 'src/entity/temp-log.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      TempLog
    ]),
  ],
  providers: [TempLogService],
  exports: [TempLogService]
})
export class TempLogModule {}
