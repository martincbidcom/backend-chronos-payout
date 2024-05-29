import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CvuAccountTransactionsEntity } from 'src/entity/cvu-account-transactions.entity';
import { StellarAccountTransactionsEntity } from 'src/entity/stellar-account-transactions.entity';
import { StellarAccountEntity } from 'src/entity/stellar-account.entity';
import { BindService } from 'src/bind/bind.service';
import { ProcessLog, StatusTransaction } from 'src/common/utils/enum';
import { Transacction } from 'src/entity/transsaction.entity';
import { TempLogService } from 'src/temp-log/temp-log.service';
import { Repository } from 'typeorm';
import { BindCvuAccountsTransactionsEntity } from 'src/entity/bind-cvu-accounts-transactions.entity';
import { UserRolesEntity } from 'src/entity/user-roles.entity';
import { CvuAccountsEntity } from 'src/entity/cvu-accounts.entity';
import { CounterpartyLocalTransactionsEntity } from 'src/entity/counterparty-local-transactions.entity';
import { CounterpartyStellarTransactionsEntity } from 'src/entity/counterparty-stellar-transactions.entity';
import { CounterpartyCbuTransactionsEntity } from 'src/entity/counterparty_cbu_transactions.entity';

@Injectable()
export class TransactionService {
  private URL = process.env.URL_BIND;
  private BANK_ID = process.env.BANK_ID_BIND;
  private ACCOUNT_ID = process.env.ACCOUNT_ID_BIND;
  private VIEW_ID = process.env.VIEW_ID_BIND;
  constructor(
    @InjectRepository(Transacction)
    private _transacctionRepository: Repository<Transacction>,
    @InjectRepository(StellarAccountTransactionsEntity)
    private _stellarAccountTransactionsRepository: Repository<StellarAccountTransactionsEntity>,
    @InjectRepository(CvuAccountTransactionsEntity)
    private _cvuAccountTransactionsEntity: Repository<CvuAccountTransactionsEntity>,
    @InjectRepository(StellarAccountEntity)
    private _stellarAccountRepository: Repository<StellarAccountEntity>,
    private bindService: BindService,
    private tempLogService: TempLogService,
    @InjectRepository(BindCvuAccountsTransactionsEntity)
    private _bindCvuAccountsTransactionsEntity: Repository<BindCvuAccountsTransactionsEntity>,
    @InjectRepository(UserRolesEntity)
    private _userRolesEntity: Repository<UserRolesEntity>,
    @InjectRepository(CvuAccountsEntity)
    private _cvuAccountsEntity: Repository<CvuAccountsEntity>,
    @InjectRepository(CounterpartyLocalTransactionsEntity)
    private _counterpartyLocalTransactionsEntity: Repository<CounterpartyLocalTransactionsEntity>,
    @InjectRepository(CounterpartyStellarTransactionsEntity)
    private _counterpartyStellarTransactionsEntity: Repository<CounterpartyStellarTransactionsEntity>,
    @InjectRepository(CounterpartyCbuTransactionsEntity)
    private _counterpartyCbuTransactionsEntity: Repository<CounterpartyCbuTransactionsEntity>,
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

  /**
   * @method getPendingTransactions
   * Recupera todas las transacciones pendientes de la base de datos que tengan un estado 'IN_PROGRESS', 'IN_BIND_PROGRESS', o 'BIND_COMPLETED' y un tipo de transacción de cuenta 'cvu'
   * Obtener todas las transacciones no finalizadas de chronos y revisar si hubo cambios
   * @return {Promise<Array<any>>} An array of full transaction objects.
   */
  async getPendingTransactions() {
    const transactions = [];
    let data = await this._transacctionRepository
      .createQueryBuilder('transaction')
      .where('transaction.status IN (:...statuses)', {
        statuses: ['IN_PROGRESS', 'IN_BIND_PROGRESS', 'BIND_COMPLETED'],
      })
      .andWhere('transaction.account_transaction_type = :type', {
        type: 'cvu',
      })
      .getRawMany();
    data = [
      {
        transaction_id: '66479',
        account_transaction_id: '63976',
        account_transaction_type: 'cvu',
        transaction_type: 'send',
        counterparty_transaction_id: '36502',
        counterparty_transaction_type: 'cvu-external',
        datetime: '2024-05-28 19:22:42',
        related_transaction_id: null,
        cvu_stellar_transaction_id: null,
        is_consolidated: '0',
        user_id: '3453',
        status: 'IN_PROGRESS',
        uitoken: 'd3b74c8d-4100-4cb1-b701-fb45c4aec2f2',
        related_payment_request_payment_id: null,
      },
      {
        transaction_id: '66478',
        account_transaction_id: '63975',
        account_transaction_type: 'cvu',
        transaction_type: 'send',
        counterparty_transaction_id: '36501',
        counterparty_transaction_type: 'cvu-external',
        datetime: '2024-05-28 19:22:36',
        related_transaction_id: null,
        cvu_stellar_transaction_id: null,
        is_consolidated: '0',
        user_id: '3453',
        status: 'IN_BIND_PROGRESS',
        uitoken: 'd464bc98-20aa-48d0-8b95-4ef824c9680b',
        related_payment_request_payment_id: null,
      },
      {
        transaction_id: '66477',
        account_transaction_id: '63974',
        account_transaction_type: 'cvu',
        transaction_type: 'send',
        counterparty_transaction_id: '36500',
        counterparty_transaction_type: 'cvu-external',
        datetime: '2024-05-28 19:22:29',
        related_transaction_id: null,
        cvu_stellar_transaction_id: null,
        is_consolidated: '0',
        user_id: '3453',
        status: 'IN_BIND_PROGRESS',
        uitoken: 'ff277d0a-f616-4e18-837a-ce79be7f5c20',
        related_payment_request_payment_id: null,
      },
      {
        transaction_id: '66476',
        account_transaction_id: '63973',
        account_transaction_type: 'cvu',
        transaction_type: 'send',
        counterparty_transaction_id: '36499',
        counterparty_transaction_type: 'cvu-external',
        datetime: '2024-05-28 19:22:21',
        related_transaction_id: null,
        cvu_stellar_transaction_id: null,
        is_consolidated: '0',
        user_id: '3453',
        status: 'IN_BIND_PROGRESS',
        uitoken: '7ef810db-6099-4c6f-819e-d14dbdd62f5f',
        related_payment_request_payment_id: null,
      },
      {
        transaction_id: '66475',
        account_transaction_id: '63972',
        account_transaction_type: 'cvu',
        transaction_type: 'send',
        counterparty_transaction_id: '36498',
        counterparty_transaction_type: 'cvu-external',
        datetime: '2024-05-28 19:22:13',
        related_transaction_id: null,
        cvu_stellar_transaction_id: null,
        is_consolidated: '0',
        user_id: '3453',
        status: 'IN_BIND_PROGRESS',
        uitoken: '1003e995-0d40-446e-b6d7-82c1070f91bd',
        related_payment_request_payment_id: null,
      },
      {
        transaction_id: '66474',
        account_transaction_id: '63971',
        account_transaction_type: 'cvu',
        transaction_type: 'send',
        counterparty_transaction_id: '36497',
        counterparty_transaction_type: 'cvu-external',
        datetime: '2024-05-28 19:22:07',
        related_transaction_id: null,
        cvu_stellar_transaction_id: null,
        is_consolidated: '0',
        user_id: '3453',
        status: 'IN_BIND_PROGRESS',
        uitoken: '26eee08b-5482-48d4-b971-3ac7a4b2280f',
        related_payment_request_payment_id: null,
      },
      {
        transaction_id: '66473',
        account_transaction_id: '63970',
        account_transaction_type: 'cvu',
        transaction_type: 'send',
        counterparty_transaction_id: '36496',
        counterparty_transaction_type: 'cvu-external',
        datetime: '2024-05-28 19:22:03',
        related_transaction_id: null,
        cvu_stellar_transaction_id: null,
        is_consolidated: '0',
        user_id: '3453',
        status: 'IN_BIND_PROGRESS',
        uitoken: '72378539-6241-4483-a238-5bb1ae1cdfc1',
        related_payment_request_payment_id: null,
      },
      {
        transaction_id: '66472',
        account_transaction_id: '63969',
        account_transaction_type: 'cvu',
        transaction_type: 'send',
        counterparty_transaction_id: '36495',
        counterparty_transaction_type: 'cvu-external',
        datetime: '2024-05-28 19:21:51',
        related_transaction_id: null,
        cvu_stellar_transaction_id: null,
        is_consolidated: '0',
        user_id: '3453',
        status: 'IN_BIND_PROGRESS',
        uitoken: 'd90a5a1e-21a1-46a4-a51b-b8801030d85d',
        related_payment_request_payment_id: null,
      },
    ];
    const url: string = `${this.URL}/banks/${this.BANK_ID}/accounts/${this.ACCOUNT_ID}/${this.VIEW_ID}/transaction-request-types/TRANSFER-CVU/transaction-requests`;

    for (const transaction of data) {
      transactions.push(await this.getFullTransactionFromId(transaction));
    }
    return transactions;
  }

  /**
   * @method getFullTransactionFromId
   * Recupera los detalles completos de la transacción a partir del ID de transacción.
   *
   * @param {any} transactions - The transaction ID or IDs to retrieve.
   * @return {Promise<any>} A Promise that resolves to the full transaction details, or an object with `result` set to `false` and `error` set to 'Transaction not found' if the transaction is not found.
   */
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

  /**
   * @method getTransactionsFromId
   * Recupera los detalles completos de la transacción a partir del ID de transacción dado.
   *
   * @param {any} transactions - The transaction ID or IDs to retrieve.
   * @return {Promise<any>} A Promise that resolves to the full transaction details, or an object with `result` set to `false` and `error` set to the error message if there was an error.
   */
  async getTransactionsFromId(transactions) {
    const transaction = transactions;

    let source_transaction;
    let counterparty_transaction;
    let source_account = null;
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
    if (transaction.account_transaction_type == 'cvu') {
      source_transaction = await this.getTransactionForCVUTransactionId(
        transaction.account_transaction_id,
      );
      if (source_transaction !== null) {
        source_account = await this.getCVUAccount(
          source_transaction.cvu_account_id,
        );
        if (source_account) {
          delete source_account.balance;
        }
      }
    }

    if (transaction.counterparty_transaction_type == 'stellar') {
      counterparty_transaction =
        await this.getTransactionCounterpartyLocalForTransactionId(
          transaction.counterparty_transaction_id,
        );
      counterparty_account = await this.getStellarAccount(
        counterparty_transaction.account_id,
      );
      delete counterparty_account.balance;
    }
    if (
      transaction.counterparty_transaction_type == 'stellar-external' ||
      transaction.counterparty_transaction_type == 'stellar-base'
    ) {
      counterparty_transaction =
        await this.getTransactionCounterpartyStellarForTransactionId(
          transaction.counterparty_transaction_id,
        );
      counterparty_account = {
        stellar_public_key: counterparty_transaction.stellar_public_key,
        stellar_memo_id: counterparty_transaction.stellar_memo_id,
      };
    }
    if (transaction.counterparty_transaction_type == 'cvu') {
      counterparty_transaction =
        await this.getTransactionCounterpartyLocalForTransactionId(
          transaction.counterparty_transaction_id,
        );
      if (counterparty_transaction != null) {
        counterparty_account = await this.getCVUAccount(
          counterparty_transaction.account_id,
        );
        if (counterparty_account != null) {
          delete counterparty_account.balance;
        }
      } else {
        counterparty_transaction = {};
      }
    }
    if (
      transaction.counterparty_transaction_type == 'cvu-external' ||
      transaction.counterparty_transaction_type == 'cvu-recaudadora'
    ) {
      counterparty_transaction =
        await this.getTransactionCounterpartyCBUForTransactionId(
          transaction.counterparty_transaction_id,
        );
      counterparty_account = {
        cbu_cvu: counterparty_transaction
          ? counterparty_transaction.cbu_cvu
          : '',
      };
    }
    description = transaction.transaction_type;
    if (source_transaction) source_transaction.account = source_account;
    if (counterparty_transaction)
      counterparty_transaction.account = counterparty_account;
    transaction.related_transaction_id = transaction.related_transaction_id;
    transaction.source_transaction = source_transaction;
    transaction.counterparty_transaction = counterparty_transaction;
    transaction.description = description;

    return transaction;
  }

  /**
   * @method getTransactionForStellarTransactionId
   * Recupera una transacción del repositorio de transacciones de la cuenta de Stellar basándose en el ID de transacción de Stellar proporcionado.
   *
   * @param {number} stellar_transaction_id - The ID of the Stellar transaction to retrieve.
   * @return {Promise<object|null>} A Promise that resolves to the transaction object if found, or null if not found.
   */
  async getTransactionForStellarTransactionId(stellar_transaction_id: number) {
    const transaction =
      await this._stellarAccountTransactionsRepository.findOne({
        where: {
          stellar_account_transaction_id: stellar_transaction_id,
        },
      });

    if (transaction) {
      return transaction;
    }

    return null;
  }

  /**
   * @method getSendReceiveFullTransaction
   * Recupera los detalles completos de una transacción de envío/recepción.
   *
   * @param {any} transaction - The transaction object containing the necessary details.
   * @return {Promise<any>} - The transaction object with the full details.
   */
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
      transaction.cbu = {
        chronos_transaction: cvuAccountTransaction ? cvuAccountTransaction : '',
      };
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

  /**
   * @method getTransactionForCVUTransactionId
   * Recupera una transacción del repositorio de transacciones de cuentas CVU basándose en el ID de transacción CVU proporcionado.
   *
   * @param {any} cvu_transaction_id - The ID of the CVU transaction to retrieve.
   * @return {Promise<object|null>} A Promise that resolves to the transaction object if found, or null if not found.
   */
  async getTransactionForCVUTransactionId(cvu_transaction_id: any) {
    const data = await this._cvuAccountTransactionsEntity.findOne({
      where: { cvu_account_transaction_id: cvu_transaction_id },
    });

    if (data) {
      return data;
    }
    return null;
  }

  /**
   * @method getSellBuyAssetFullTransaction
   * Recupera los detalles completos de una transacción de venta/compra de activo.
   *
   * @param {any} transaction - The transaction object containing the necessary details.
   * @return {Promise<any>} - The transaction object with the full details.
   */
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
  /**
   * @method getFeeFullTransaction
   * Recupera los detalles completos de una transacción determinada, incluido el resumen de comisiones.
   *
   * @param {any} transaction - The transaction object for which to retrieve the full details.
   * @return {Promise<any>} The transaction object with the fee summary added to the 'summary' property.
   */
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
  /**
   * @method getStellarAccount
   * Recupera una cuenta de Stellar basado en su ID.
   *
   * @param {number} account_id - The ID of the Stellar account to retrieve.
   * @return {Promise<object|null>} A Promise that resolves to the Stellar account object if found, or null if not found.
   */
  async getStellarAccount(account_id: number) {
    const stellar_accounts = await this._stellarAccountRepository.findOne({
      where: { stellar_account_id: account_id },
    });
    if (stellar_accounts) {
      return stellar_accounts;
    }
    return null;
  }
  /**
   * @method sendTransaction
   * Crea una nueva transacción en el repositorio de transacciones.
   *
   * @param {any} payload - The payload containing the transaction details.
   * @return {Promise<any>} - The created transaction.
   */
  async sendTransaction(payload: any) {
    const transaction = await this.create({
      amountFiat: payload.amount,
      status: StatusTransaction.CREATED,
      referenceId: payload.reference,
      cvuDestination: payload.cvu,
    });

    if (!transaction) throw new Error('Falla al registrar la transaccion');

    const sendTransaction = await this.bindService.doTransaction({
      destinationCbu: payload.cvu,
      amount: payload.amount,
      idTransaction: Number(transaction.id),
    });

    const updateTransaction = await this.update(transaction.id, {
      responseBind: JSON.stringify('sendTransaction'),
      status: StatusTransaction.SENT,
    });

    if (updateTransaction.affected === 0) {
      await this.tempLogService.saveTempLog({
        process: ProcessLog.TRANSACTION,
        method: 'sendTransaction => no se pudo actualizar transaccion',
        description: `idTransaction = ${transaction.id}, status = ${StatusTransaction.SENT}, response = ${'sendTransaction'}`,
      });

      throw new Error('Falla al guardar la respuesta de BIND');
    }

    return transaction;
  }
  /**
   * @method getBINDCVUAccountTransaction
   * Recupera una transacción BINDCVU basado en su ID.
   *
   * @param {string} bindId - The ID of the BINDCVU account transaction to retrieve.
   * @return {Promise<object|null>} A Promise that resolves to the BINDCVU account transaction object if found, or null if not found.
   */
  async getBINDCVUAccountTransaction(bindId: string) {
    const data = await this._bindCvuAccountsTransactionsEntity
      .createQueryBuilder('bind_cvu_accounts_transactions')
      .where('bind.id = :bindId OR bind.transaction_id_1 = :bindId', { bindId })
      .getOne();

    if (data) {
      return data;
    }
    return null;
  }
  /**
   * @method getCVUAccountForStellarBase
   * Recupera la primera cuenta CVU asociada con el rol 'stellar-base'.
   *
   * @return {Promise<object|null>} A Promise that resolves to the first CVU account object if found, or null if not found.
   */
  async getCVUAccountForStellarBase() {
    const data = await this._userRolesEntity.findOne({
      where: { role: 'stellar-base' },
    });

    if (data) {
      return await this.getUserFirstCVUAccount(data.user_id);
    }
    return null;
  }
  /**
   * @method getUserFirstCVUAccount
   * Recupera la primera cuenta CVU asociada con el ID de usuario.
   *
   * @param {number} user_id - The ID of the user.
   * @return {Promise<object|null>} A Promise that resolves to the first CVU account object associated with the user ID, or null if no CVU account is found.
   */
  async getUserFirstCVUAccount(user_id: number) {
    // Por ahora vamos a tener solo una CVU account en chronos
    const cvu_accounts = await this.getUserCVUAccounts(user_id);
    if (cvu_accounts) {
      return cvu_accounts;
    }

    return null;
  }
  /**
   * @method getUserCVUAccounts
   * Recupera todas las cuentas CVU asociadas con el ID de usuario.
   *
   * @param {any} user_id - The ID of the user.
   * @return {Promise<object|null>} A Promise that resolves to the CVU account object if found, or null if not found.
   */
  async getUserCVUAccounts(user_id: any) {
    return await this._cvuAccountsEntity.findOne({
      where: { user_id },
    });
  }
  /**
   * @method getTransactionSummaryFromRelated
   * Genera un resumen de una operación y de su operación de contrapartida.
   *
   * @param {any} transaction - The transaction object.
   * @param {any} counterparty_transaction - The counterparty transaction object.
   * @return {any} The summary of the transaction and counterparty transaction.
   */
  getTransactionSummaryFromRelated(
    transaction: any,
    counterparty_transaction: any,
  ) {
    const summary: any = {
      datetime: transaction.datetime,
      transaction_type: transaction.transaction_type,
      source_account_type: transaction.account_transaction_type,
      source_currency: transaction.source_transaction.account.currency,
      source_user_id: transaction.source_transaction.account.user_id,
    };

    if (transaction.account_transaction_type == 'cvu') {
      summary.source_account_id = transaction.source_transaction.cvu_account_id;
      summary.source_account_cvu = transaction.source_transaction.account.cvu;
      summary.source_account_alias =
        transaction.source_transaction.account.alias;
      summary.concept = transaction.source_transaction.concept;
      summary.bank_description =
        transaction.source_transaction.bank_description;
    } else {
      summary.source_account_id =
        transaction.source_transaction.stellar_account_id;
      summary.source_account_stellar_public_key =
        transaction.source_transaction.account.stellar_public_key;
      summary.source_account_memo_id =
        transaction.source_transaction.account.stellar_memo_id;
    }

    summary.amount = transaction.source_transaction.amount;
    summary.counterparty_transaction_type =
      counterparty_transaction.counterparty_transaction_type;
    summary.target_user_id = counterparty_transaction.user_id;

    if (transaction.counterparty_transaction_type == 'cvu-external') {
      summary.target_user_id = null;
      summary.target_account_id =
        transaction.counterparty_transaction.cvu_account_id;
      summary.target_account_cvu =
        transaction.counterparty_transaction.account.cbu_cvu;
      summary.target_account_alias =
        transaction.counterparty_transaction.account.alias;
      summary.counterparty_transaction_type =
        transaction.counterparty_transaction_type;
      summary.target_source_account_type =
        transaction.counterparty_transaction_type;
      summary.target_source_currency =
        transaction.source_transaction.account.currency;
    } else if (
      transaction.account_transaction_type == 'stellar' &&
      transaction.counterparty_transaction_type == 'stellar-external' &&
      transaction.related_transaction_id != null &&
      transaction.cvu_stellar_transaction_id != null
    ) {
      summary.target_user_id = null;
      summary.target_account_stellar_public_key =
        transaction.counterparty_transaction.account.stellar_public_key;
      summary.target_account_memo_id =
        transaction.counterparty_transaction.account.stellar_memo_id;
      (summary.target_source_account_type =
        transaction.account_transaction_type),
        (summary.target_source_currency =
          transaction.source_transaction.account.currency);
      summary.counterparty_transaction_type =
        transaction.counterparty_transaction_type;
    } else if (
      transaction.counterparty_transaction_type == 'stellar-base' &&
      counterparty_transaction.counterparty_transaction_type ==
        'stellar-external'
    ) {
      summary.target_user_id = null;
      summary.target_account_stellar_public_key =
        transaction.counterparty_transaction.account.stellar_public_key;
      summary.target_account_memo_id =
        transaction.counterparty_transaction.account.stellar_memo_id;
      summary.counterparty_transaction_type =
        transaction.counterparty_transaction_type;
      (summary.target_source_account_type =
        transaction.account_transaction_type),
        (summary.target_source_currency =
          transaction.source_transaction.account.currency);
    } else if (
      ['stellar-external', 'stellar-base'].includes(
        transaction.counterparty_transaction_type,
      ) &&
      counterparty_transaction.counterparty_transaction_type != 'cvu' &&
      counterparty_transaction.counterparty_transaction_type != 'cvu-external'
    ) {
      if (
        transaction.counterparty_transaction_type == 'stellar-external' ||
        counterparty_transaction.counterparty_transaction_type == 'cvu-external'
      ) {
        summary.target_user_id = null;
      }

      summary.target_account_stellar_public_key =
        transaction.counterparty_transaction.account.stellar_public_key;
      summary.target_account_memo_id =
        transaction.counterparty_transaction.account.stellar_memo_id;
      summary.counterparty_transaction_type =
        transaction.counterparty_transaction_type;
      (summary.target_source_account_type =
        transaction.account_transaction_type),
        (summary.target_source_currency =
          transaction.source_transaction.account.currency);
    } else if (
      transaction.transaction_type == 'receive' &&
      counterparty_transaction.counterparty_transaction_type == 'cvu' &&
      transaction.account_transaction_type == 'stellar' &&
      transaction.counterparty_transaction_type == 'stellar-base'
    ) {
      summary.target_user_id =
        counterparty_transaction.counterparty_transaction.user_id;
      summary.target_account_id =
        counterparty_transaction.counterparty_transaction.account.cvu_account_id;
      summary.target_account_cvu =
        counterparty_transaction.counterparty_transaction.account.cvu;
      summary.target_account_alias =
        counterparty_transaction.counterparty_transaction.account.alias;
      (summary.target_source_account_type =
        counterparty_transaction.account_transaction_type),
        (summary.target_source_currency =
          counterparty_transaction.counterparty_transaction.account.currency);
    } else if (
      counterparty_transaction.counterparty_transaction_type == 'cvu' &&
      transaction.account_transaction_type == 'stellar' &&
      transaction.counterparty_transaction_type == 'stellar-base'
    ) {
      summary.target_user_id =
        counterparty_transaction.source_transaction.user_id;
      summary.target_account_id =
        counterparty_transaction.source_transaction.account.cvu_account_id;
      summary.target_account_cvu =
        counterparty_transaction.source_transaction.account.cvu;
      summary.target_account_alias =
        counterparty_transaction.source_transaction.account.alias;
      (summary.target_source_account_type =
        counterparty_transaction.account_transaction_type),
        (summary.target_source_currency =
          counterparty_transaction.source_transaction.account.currency);
    } else if (
      counterparty_transaction.counterparty_transaction_type == 'cvu'
    ) {
      summary.target_account_id =
        counterparty_transaction.source_transaction.cvu_account_id;
      summary.target_account_cvu =
        counterparty_transaction.source_transaction.account.cvu;
      summary.target_account_alias =
        counterparty_transaction.source_transaction.account.alias;
      (summary.target_source_account_type =
        counterparty_transaction.account_transaction_type),
        (summary.target_source_currency =
          counterparty_transaction.source_transaction.account.currency);
    } else if (
      counterparty_transaction.counterparty_transaction_type ==
      'stellar-external'
    ) {
      summary.target_user_id = null;
      summary.target_account_stellar_public_key =
        counterparty_transaction.counterparty_transaction.account.stellar_public_key;
      summary.target_account_memo_id =
        counterparty_transaction.counterparty_transaction.account.stellar_memo_id;
      (summary.target_source_account_type =
        counterparty_transaction.account_transaction_type),
        (summary.target_source_currency =
          counterparty_transaction.source_transaction.account.currency);
    } else if (
      counterparty_transaction.counterparty_transaction_type == 'cvu-external'
    ) {
      summary.target_user_id = null;
      summary.target_account_id =
        counterparty_transaction.counterparty_transaction.cvu_account_id;
      summary.target_account_cvu =
        counterparty_transaction.counterparty_transaction.account.cbu_cvu;
      summary.target_account_alias =
        counterparty_transaction.counterparty_transaction.account.alias;
      (summary.target_source_account_type =
        counterparty_transaction.account_transaction_type),
        (summary.target_source_currency =
          counterparty_transaction.source_transaction.account.currency);
    } else if (
      ['stellar', 'stellar-base'].includes(
        counterparty_transaction.counterparty_transaction_type,
      )
    ) {
      summary.target_account_id =
        counterparty_transaction.source_transaction.stellar_account_id;
      summary.target_account_stellar_public_key =
        counterparty_transaction.source_transaction.account.stellar_public_key;
      summary.target_account_memo_id =
        counterparty_transaction.source_transaction.account.stellar_memo_id;
      (summary.target_source_account_type =
        counterparty_transaction.account_transaction_type),
        (summary.target_source_currency =
          counterparty_transaction.source_transaction.account.currency);
    }
    return summary;
  }
  /**
   * @method getTransactionSummaryFrom
   * Genera un resumen de una transacción.
   *
   * @param {any} transaction - The transaction object.
   * @return {any} The summary of the transaction.
   */
  getTransactionSummaryFrom(transaction: any) {
    const summary: any = {
      datetime: transaction.datetime,
      transaction_type: transaction.transaction_type,
      source_account_type: transaction.account_transaction_type,
      source_currency: transaction.source_transaction.account.currency,
      source_user_id: transaction.source_transaction.account.user_id,
    };

    if (transaction.account_transaction_type == 'cvu') {
      summary.source_account_id = transaction.source_transaction.cvu_account_id;
      summary.source_account_cvu = transaction.source_transaction.account.cvu;
      summary.source_account_alias =
        transaction.source_transaction.account.alias;
      summary.concept = transaction.source_transaction.concept;
      summary.bank_description =
        transaction.source_transaction.bank_description;
    } else {
      summary.source_account_id =
        transaction.source_transaction.stellar_account_id;
      summary.source_account_stellar_public_key =
        transaction.source_transaction.account.stellar_public_key;
      summary.source_account_memo_id =
        transaction.source_transaction.account.stellar_memo_id;
    }
    summary.amount = transaction.source_transaction.amount;

    if (transaction.counterparty_transaction_type == 'cvu') {
      summary.target_account_id =
        transaction.counterparty_transaction.cvu_account_id;
      summary.target_account_cvu =
        transaction.counterparty_transaction.account.cvu;
      summary.target_account_alias =
        transaction.counterparty_transaction.account.alias;
    } else if (
      transaction.counterparty_transaction_type == 'stellar-external'
    ) {
      summary.target_account_type =
        transaction.counterparty_transaction.counterparty_transaction_type;
      summary.target_account_stellar_public_key =
        transaction.counterparty_transaction.account.stellar_public_key;
      summary.target_account_memo_id =
        transaction.counterparty_transaction.account.stellar_memo_id;
      summary.target_source_currency =
        transaction.source_transaction.account.currency;
    } else if (transaction.counterparty_transaction_type == 'cvu-external') {
      summary.target_account_id =
        transaction.counterparty_transaction.cvu_account_id;
      summary.target_account_cvu =
        transaction.counterparty_transaction.account.cbu_cvu;
      summary.target_account_alias =
        transaction.counterparty_transaction.account.alias;
      // la target currency no la tenemos positivamente, pero se supone que es igual a la del source
      summary.target_source_currency =
        transaction.source_transaction.account.currency;
    }
    summary.target_source_account_type =
      transaction.counterparty_transaction_type;

    return summary;
  }
  /**
   * @method getCVUAccount
   * Recupera una cuenta CVU de la base de datos basándose en el ID de cuenta proporcionado.
   *
   * @param {number} account_id - The ID of the CVU account to retrieve.
   * @return {Promise<object|null>} A Promise that resolves to the CVU account object if found, or null if not found.
   */
  async getCVUAccount(account_id: number) {
    const stellar_accounts = await this._cvuAccountsEntity.findOne({
      where: { cvu_account_id: account_id },
    });
    if (stellar_accounts) {
      return stellar_accounts;
    }
    return null;
  }
  /**
   * @method getTransactionCounterpartyLocalForTransactionId
   * Recupera los datos de la operación local de contrapartida para un ID de operación de contrapartida determinado.
   *
   * @param {number} counterparty_transaction_id - The ID of the counterparty transaction.
   * @return {Promise<any | null>} - A promise that resolves to the counterparty local transaction data if found, or null if not found.
   */
  async getTransactionCounterpartyLocalForTransactionId(
    counterparty_transaction_id: number,
  ) {
    const data = await this._counterpartyLocalTransactionsEntity.findOne({
      where: {
        chronos_target_local_transactions_id: counterparty_transaction_id,
      },
    });

    if (data) {
      return data;
    }
    return null;
  }

  /**
   * @method getTransactionCounterpartyStellarForTransactionId
   * Recupera los datos de la operación stellar de contrapartida para un ID de operación de contrapartida determinado.
   *
   * @param {number} counterparty_transaction_id - The ID of the counterparty transaction.
   * @return {Promise<any | null>} - A promise that resolves to the counterparty Stellar transaction data if found, or null if not found.
   */
  async getTransactionCounterpartyStellarForTransactionId(
    counterparty_transaction_id: number,
  ) {
    const data = await this._counterpartyStellarTransactionsEntity.findOne({
      where: {
        chronos_target_local_transactions_id: counterparty_transaction_id,
      },
    });

    if (data) {
      return data;
    }
    return null;
  }
  /**
   * @method getTransactionCounterpartyCBUForTransactionId
   * Recupera los datos de la transacción CBU de contrapartida para un ID de transacción de contrapartida determinado.
   *
   * @param {number} counterparty_transaction_id - The ID of the counterparty transaction.
   * @return {Promise<any | null>} - A promise that resolves to the counterparty CBU transaction data if found, or null if not found.
   */
  async getTransactionCounterpartyCBUForTransactionId(
    counterparty_transaction_id: number,
  ) {
    const data = await this._counterpartyCbuTransactionsEntity.findOne({
      where: { counterparty_cbu_transaction_id: counterparty_transaction_id },
    });

    if (data) {
      return data;
    }
    return null;
  }
}
