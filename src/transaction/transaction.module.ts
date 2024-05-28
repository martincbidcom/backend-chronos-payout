import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transacction } from 'src/entity/transsaction.entity';
import { TransactionController } from './transaction.controller';
import { BindModule } from 'src/bind/bind.module';
import { StellarAccountTransactionsEntity } from 'src/entity/stellar-account-transactions.entity';
import { CvuAccountTransactionsEntity } from 'src/entity/cvu-account-transactions.entity';
import { StellarAccountEntity } from 'src/entity/stellar-account.entity';
import { TempLogModule } from 'src/temp-log/temp-log.module';
import { BindCvuAccountsTransactionsEntity } from 'src/entity/bind-cvu-accounts-transactions.entity';
import { CvuAccountsEntity } from 'src/entity/cvu-accounts.entity';
import { UserRolesEntity } from 'src/entity/user-roles.entity';
import { CounterpartyLocalTransactionsEntity } from 'src/entity/counterparty-local-transactions.entity';
import { CounterpartyStellarTransactionsEntity } from 'src/entity/counterparty-stellar-transactions.entity';
import { CounterpartyCbuTransactionsEntity } from 'src/entity/counterparty_cbu_transactions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transacction,
      StellarAccountTransactionsEntity,
      CvuAccountTransactionsEntity,
      StellarAccountEntity,
      BindCvuAccountsTransactionsEntity,
      UserRolesEntity,
      CvuAccountsEntity,
      CounterpartyLocalTransactionsEntity,
      CounterpartyStellarTransactionsEntity,
      CounterpartyCbuTransactionsEntity
    ]),
    BindModule,
    TempLogModule,
  ],
  providers: [TransactionService],
  exports: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
