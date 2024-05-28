import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CvuAccountTransactionsEntity } from 'src/entity/cvu-account-transactions.entity';
import { StellaAccountTransactionsEntity } from 'src/entity/stellar-account-transactions.entity';
import { StellaAccountEntity } from 'src/entity/stellar-account.entity';
import { Transacction } from 'src/entity/transsaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transacction)
    private _transacctionRepository: Repository<Transacction>,
    private _stellaAccountTransactionsRepository: Repository<StellaAccountTransactionsEntity>,
    private _cvuAccountTransactionsEntity: Repository<CvuAccountTransactionsEntity>,
    private _stellaAccountRepository: Repository<StellaAccountEntity>,
  ) {}

  async create(transacction: Transacction) {
    const createTransacction =
      this._transacctionRepository.create(transacction);
    return await this._transacctionRepository.save(createTransacction);
  }

  async findOne(obj: any) {
    return await this._transacctionRepository.findOne(obj);
  }

  async update(id: string, obj: any) {
    return await this._transacctionRepository.update({ id }, obj);
  }

  async checkAndUpdateCVUAccountsTransactionsFromChronos() {
    // Obtener todas las transacciones no finalizadas de chronos
    // y revisar si hubo cambios
    const transactions = await this.getPendingTransactions();
    return true;
  }

  async getPendingTransactions() {
    const transactions = [];
    const data = await this._transacctionRepository
      .createQueryBuilder()
      .where('transaction.status IN (:...statuses)', {
        statuses: ['IN_PROGRESS', 'IN_BIND_PROGRESS', 'BIND_COMPLETED'],
      })
      .andWhere('transaction.account_transaction_type = :type', {
        type: 'cvu',
      })
      .getRawMany();

    for (const transaction of data) {
      transactions.push(await this.getFullTransactionFromId(transaction));
    }
    return transactions;
  }

  async getFullTransactionFromId(transactions) {
    // Trae tambien las transacciones relacionadas
    const transaction = await this.getTransactionsFromId(transactions);
    if (transaction == null) {
      return { result: false, error: 'Transaction not found' };
    }

    if (
      transaction.transaction_type == 'receive' ||
      transaction.transaction_type == 'send'
    ) {
      return await this.getSendReceiveFullTransaction(transaction);
    }

    if (
      transaction.transaction_type == 'sell_asset' ||
      transaction.transaction_type == 'buy_asset'
    ) {
      return await this.getSellBuyAssetFullTransaction(transaction);
    }

    if (
      transaction.transaction_type == 'fee' ||
      transaction.transaction_type == 'fee-collected'
    ) {
      return await this.getFeeFullTransaction(transaction);
    }

    return transaction;
  }

  async getTransactionsFromId(transactions) {
    const transaction = transactions;

    let source_transaction;
    let counterparty_transaction;
    let source_account;
    let counterparty_account;
    let description;

    if (transaction.account_transaction_type == 'stellar') {
      source_transaction = await this.getTransactionForStellarTransactionId(
        transaction.account_transaction_id,
      );
      source_account = await this.getStellarAccount(
        source_transaction.stellar_account_id,
      );
      delete source_account.balance;
    }
    // if (transaction.account_transaction_type == 'cvu') {
    //   source_transaction = await this.getTransactionForCVUTransactionId(
    //     transaction.account_transaction_id,
    //   );
    //   source_account = await this.getCVUAccount(
    //     source_transaction.cvu_account_id,
    //   );
    //   if (source_account) {
    //     delete source_account.balance;
    //   }
    // }

    // if (transaction.counterparty_transaction_type == 'stellar') {
    //   counterparty_transaction =
    //     await this.getTransactionCounterpartyLocalForTransactionId(
    //       transaction.counterparty_transaction_id,
    //     );
    //   counterparty_account = await this.getStellarAccount(
    //     counterparty_transaction.account_id,
    //   );
    //   delete counterparty_account.balance;
    //   /*        if (transaction.transaction_type == "send") { description = "Transferencia a Stellar Memo: " + counterparty_account.stellar_memo_id};
    //           if (transaction.transaction_type == "receive") { description = "Recibido desde Stellar Memo: " + counterparty_account.stellar_memo_id};
    //           if (transaction.transaction_type == "buy_asset") { description = "Recibido desde Stellar Memo: " + counterparty_account.stellar_memo_id}; */
    // }
    // if (
    //   transaction.counterparty_transaction_type == 'stellar-external' ||
    //   transaction.counterparty_transaction_type == 'stellar-base'
    // ) {
    //   counterparty_transaction =
    //     await this.getTransactionCounterpartyStellarForTransactionId(
    //       transaction.counterparty_transaction_id,
    //     );
    //   counterparty_account = {
    //     stellar_public_key: counterparty_transaction.stellar_public_key,
    //     stellar_memo_id: counterparty_transaction.stellar_memo_id,
    //   };
    // }
    // if (transaction.counterparty_transaction_type == 'cvu') {
    //   counterparty_transaction =
    //     await this.getTransactionCounterpartyLocalForTransactionId(
    //       transaction.counterparty_transaction_id,
    //     );
    //   if (counterparty_transaction != null) {
    //     counterparty_account = await this.getCVUAccount(
    //       counterparty_transaction.account_id,
    //     );
    //     if (counterparty_account != null) {
    //       delete counterparty_account.balance;
    //     }
    //   } else {
    //     counterparty_transaction = {};
    //   }
    //   /*        if (transaction.transaction_type == "send") { description = "Transferencia a CVU: " + counterparty_account.cvu};
    //           if (transaction.transaction_type == "receive") { description = "Recibido desde CVU: " + source_account.cvu}; */
    // }
    // if (
    //   transaction.counterparty_transaction_type == 'cvu-external' ||
    //   transaction.counterparty_transaction_type == 'cvu-recaudadora'
    // ) {
    //   counterparty_transaction =
    //     await this.getTransactionCounterpartyCBUForTransactionId(
    //       transaction.counterparty_transaction_id,
    //     );
    //   counterparty_account = { cbu_cvu: counterparty_transaction.cbu_cvu };
    // }
    description = transaction.transaction_type;
    source_transaction.account = source_account;
    counterparty_transaction.account = counterparty_account;
    transaction.related_transaction_id = transaction.related_transaction_id;
    transaction.source_transaction = source_transaction;
    transaction.counterparty_transaction = counterparty_transaction;
    transaction.description = description;

    return transaction;
  }

  async getTransactionForStellarTransactionId(stellar_transaction_id: number) {
    const transaction = await this._stellaAccountTransactionsRepository.findOne(
      {
        where: {
          stellar_account_transaction_id: stellar_transaction_id,
        },
      },
    );

    if (transaction) {
      return transaction;
    }

    return null;
  }

  async getSendReceiveFullTransaction(transaction: any) {
    const related_id = transaction.related_transaction_id;
    if (related_id != null) {
      transaction.related_transaction =
        await this.getTransactionsFromId(related_id);
    }
    const cvu_stellar_related_id = transaction.cvu_stellar_transaction_id;
    if (cvu_stellar_related_id != null) {
      transaction.cvu_stellar_transaction = await this.getTransactionsFromId(
        cvu_stellar_related_id,
      );
    }

    if (transaction.account_transaction_type === 'cvu') {
      const cvuAccountTransaction =
        await this.getTransactionForCVUTransactionId(
          transaction.account_transaction_id,
        );
      transaction.cbu = { chronos_transaction: cvuAccountTransaction };
      if (cvuAccountTransaction) {
        const bindCVUTransaction = await this.getBINDCVUAccountTransaction(
          cvuAccountTransaction.bind_transaction_id,
        );
        transaction.cbu.bind_transaction = bindCVUTransaction;
      }
    }

    let counterparty_transaction;
    const base_user_account = await this.getCVUAccountForStellarBase();
    if (transaction.user_id != base_user_account.user_id) {
      counterparty_transaction = transaction.cvu_stellar_transaction;
    }
    if (counterparty_transaction == null) {
      counterparty_transaction = transaction.related_transaction;
    }

    let summary;

    if (counterparty_transaction != null) {
      summary = this.getTransactionSummaryFromRelated(
        transaction,
        counterparty_transaction,
      );
    } else {
      // Si pasa por aca es porque es una transaccion que no tiene transacciones relacionadas
      summary = this.getTransactionSummaryFrom(transaction);
    }

    transaction.summary = summary;

    return transaction;
  }

  async getTransactionForCVUTransactionId(cvu_transaction_id: any) {
    const data = await this._cvuAccountTransactionsEntity.findOne({
      where: { cvu_account_transaction_id: cvu_transaction_id },
    });

    if (data) {
      return data;
    }
    return null;
  }

  async getSellBuyAssetFullTransaction(transaction: any) {
    const related_id = transaction.related_transaction_id;

    let summary = {};

    if (related_id != null) {
      transaction.related_transaction =
        await this.getTransactionsFromId(related_id);
      const rate =
        transaction.source_transaction.amount /
        transaction.related_transaction.source_transaction.amount;
      const rate_inversed =
        transaction.related_transaction.source_transaction.amount /
        transaction.source_transaction.amount;
      summary = {
        target_amount:
          transaction.related_transaction.source_transaction.amount,
        rate: `${rate.toFixed(7)} ${transaction.source_transaction.account.currency} / ${transaction.counterparty_transaction.account.currency}`,
        rate_inversed: `${rate_inversed.toFixed(7)} ${transaction.counterparty_transaction.account.currency} / ${transaction.source_transaction.account.currency}`,
      };
    }

    summary = {
      ...summary,
      datetime: transaction.datetime,
      transaction_type: transaction.transaction_type,

      source_account_type: transaction.account_transaction_type,
      source_currency: transaction.source_transaction.account.currency,
      source_user_id: transaction.source_transaction.account.user_id,

      target_currency: transaction.counterparty_transaction.account.currency,
      target_account_type: transaction.counterparty_transaction_type,

      amount: transaction.source_transaction.amount,
      source_amount: transaction.source_transaction.amount,
      stellar_transaction_id:
        transaction.source_transaction.stellar_transaction_id,
    };

    transaction.summary = summary;
    return transaction;
  }
  async getFeeFullTransaction(transaction: any) {
    // TODO: Ver si es necesario agregar mas detalles de la transaccion

    const summary = {
      datetime: transaction.datetime,
      transaction_type: transaction.transaction_type,
      source_account_type: transaction.account_transaction_type,
      source_currency: transaction.source_transaction.account.currency,
      source_user_id: transaction.source_transaction.account.user_id,
      amount: transaction.source_transaction.amount,
    };

    transaction.summary = summary;
    return transaction;
  }
  async getStellarAccount(account_id: number) {
    const stellar_accounts = await this.findOne({
      where: { stellar_account_id: account_id },
    });
    if (stellar_accounts) {
      return stellar_accounts;
    }
    return null;
  }
}
