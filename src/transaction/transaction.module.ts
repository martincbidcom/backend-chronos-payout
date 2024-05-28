import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transacction } from 'src/entity/transsaction.entity';
import { TransactionController } from './transaction.controller';
import { BindModule } from 'src/bind/bind.module';
import { StellaAccountTransactionsEntity } from 'src/entity/stellar-account-transactions.entity';
import { CvuAccountTransactionsEntity } from 'src/entity/cvu-account-transactions.entity';
import { StellaAccountEntity } from 'src/entity/stellar-account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transacction,
      StellaAccountTransactionsEntity,
      CvuAccountTransactionsEntity,
      StellaAccountEntity
    ]),
    BindModule
  ],
  providers: [TransactionService],
  exports: [TransactionService],
  controllers: [TransactionController]
})
export class TransactionModule {}
