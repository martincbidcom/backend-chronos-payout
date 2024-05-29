import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleConfigurationService } from './schedule-configuration.service';
import { ScheduleConfigurationController } from './schedule-configuration.controller';
import { ScheduleConfigurationEntity } from 'src/entity/schedule-configuration.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        ScheduleConfigurationEntity
    ]),
  ],
  providers: [ScheduleConfigurationService],
  exports: [ScheduleConfigurationService],
  controllers: [ScheduleConfigurationController],
})
export class ScheduleConfigurationModule {}
