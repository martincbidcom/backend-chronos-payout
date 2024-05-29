import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transacctions } from 'src/entity/transsaction.entity';
import { TransactionController } from './transaction.controller';
import { BindModule } from 'src/bind/bind.module';
import { TempLogModule } from 'src/temp-log/temp-log.module';
import { ScheduleConfigurationModule } from 'src/schedule-configuration/schedule-configuration.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transacctions
    ]),
    BindModule,
    TempLogModule,
    ScheduleConfigurationModule
  ],
  providers: [TransactionService],
  exports: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
