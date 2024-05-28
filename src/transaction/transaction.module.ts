import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transacction } from 'src/entity/transsaction.entity';
import { TransactionController } from './transaction.controller';
import { BindModule } from 'src/bind/bind.module';
import { TempLogModule } from 'src/temp-log/temp-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transacction
    ]),
    BindModule,
    TempLogModule
  ],
  providers: [TransactionService],
  exports: [TransactionService],
  controllers: [TransactionController]
})
export class TransactionModule {}
